import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const members = await db.members.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const name = formData.get("name") as string;
      const role = formData.get("role") as string;
      const bio = (formData.get("bio") as string) || null;
      const socials = (formData.get("socials") as string) || null;
      const file = formData.get("photo") as File | null;

      if (!name || !role) {
        return NextResponse.json(
          { error: "Name and role are required" },
          { status: 400 }
        );
      }

      let photoUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${ext}`;

        // ✅ ubah File ke ArrayBuffer sebelum upload
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
        photoUrl = publicUrl.publicUrl;
      }

      const newMember = await db.members.create({
        data: {
          name,
          role,
          bio,
          photo: photoUrl,
          socials: socials ? JSON.parse(socials) : null,
          is_active: true,
        },
      });

      return NextResponse.json({
        message: "Member created successfully",
        id: newMember.id,
      });
    } else {
      const body = await request.json();
      const { name, role, bio, photo, socials } = body;

      if (!name || !role)
        return NextResponse.json(
          { error: "Name and role are required" },
          { status: 400 }
        );

      const newMember = await db.members.create({
        data: {
          name,
          role,
          bio: bio || null,
          photo: photo || null,
          socials: socials ? JSON.parse(socials) : null,
          is_active: true,
        },
      });

      return NextResponse.json({
        message: "Member created successfully (JSON mode)",
      });
    }
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
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
        { error: "Member ID is required" },
        { status: 400 }
      );

    await db.members.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
