import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const gallery = await db.gallery.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const type = (formData.get("type") as string) || "image";
      const caption = (formData.get("caption") as string) || null;
      const tags = (formData.get("tags") as string) || null;
      const file = formData.get("file") as File | null;

      if (!file)
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        );

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;

      // ✅ ubah File menjadi ArrayBuffer agar bisa diupload ke Supabase
      const buffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("image")
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("image")
        .getPublicUrl(fileName);

      const newGallery = await db.gallery.create({
        data: {
          type,
          file_path: publicUrl.publicUrl,
          caption,
          tags,
          is_active: true,
        },
      });

      return NextResponse.json({
        message: "Gallery item created successfully",
        id: newGallery.id,
      });
    } else {
      const body = await request.json();
      const { type, file_path, caption, metadata, tags } = body;
      if (!file_path)
        return NextResponse.json(
          { error: "File path is required" },
          { status: 400 }
        );

      const newGallery = await db.gallery.create({
        data: {
          type: type || "image",
          file_path,
          caption: caption || null,
          tags: tags || null,
          metadata: metadata ? JSON.stringify(metadata) : "{}",
          is_active: true,
        },
      });
      return NextResponse.json({
        message: "Gallery item created successfully (JSON mode)",
      });
    }
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id)
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );

    await db.gallery.delete({ where: { id: Number(id) } });
    return NextResponse.json({
      message: "Gallery item deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
