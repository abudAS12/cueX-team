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

    // ✅ Jika upload via FormData (bukan JSON)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const type = (formData.get("type") as string) || "image";
      const caption = (formData.get("caption") as string) || null;
      const tags = (formData.get("tags") as string) || null;
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        );
      }

      // ✅ Deteksi ekstensi file dan jenis (image/video)
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isVideo = ["mp4", "mov", "avi", "mkv", "webm"].includes(ext || "");

      // ✅ Tentukan folder penyimpanan di bucket
      const folder = isVideo ? "videos" : "images";
      const fileName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;

      // ✅ Konversi file ke buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // ✅ Upload ke bucket "image" (boleh untuk gambar & video)
      const { error: uploadError } = await supabase.storage
        .from("image")
        .upload(fileName, buffer, {
          contentType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
          upsert: false, // jangan replace file lama
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw uploadError;
      }

      // ✅ Dapatkan URL publik
      const { data: publicUrlData } = supabase.storage
        .from("image")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error("Failed to get public URL from Supabase");
      }

      // ✅ Simpan ke database
      const newGallery = await db.gallery.create({
        data: {
          type: isVideo ? "video" : "image",
          file_path: publicUrl,
          caption,
          tags,
          is_active: true,
        },
      });

      return NextResponse.json({
        message: "Gallery item created successfully",
        id: newGallery.id,
      });
    }

    // ✅ Jika JSON mode (bukan multipart)
    const body = await request.json();
    const { type, file_path, caption, metadata, tags } = body;

    if (!file_path) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

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

    if (!id) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

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
      // ✅ Simpan ke database
      const newGallery = await db.gallery.create({
        data: {
          type: isVideo ? "video" : "image",
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
