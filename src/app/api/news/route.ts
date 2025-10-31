import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const news = await db.news.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        content: true,
        featured_image: true,
        event_date: true,
        created_at: true,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const title = formData.get("title") as string;
      const summary = (formData.get("summary") as string) || null;
      const content = (formData.get("content") as string) || null;
      const event_date = (formData.get("event_date") as string) || null;
      const file = formData.get("file") as File | null;

      if (!title) {
        return NextResponse.json(
          { error: "Title is required" },
          { status: 400 }
        );
      }

      let fileUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${ext}`;

        console.log("🖼️ Uploading news image:", fileName);

        // ✅ FIX untuk Vercel: konversi File → Buffer sebelum upload
        const buffer = Buffer.from(await file.arrayBuffer());
        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(fileName, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (uploadError) {
          console.error("❌ Upload error:", uploadError);
          throw uploadError;
        }

        const { data: publicUrl } = supabase.storage
          .from("image")
          .getPublicUrl(fileName);

        fileUrl = publicUrl.publicUrl;
        console.log("✅ Uploaded to:", fileUrl);
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const newNews = await db.news.create({
        data: {
          title,
          slug,
          summary,
          content,
          featured_image: fileUrl,
          event_date: event_date ? new Date(event_date) : null,
          is_published: true,
        },
      });

      console.log("✅ News created:", newNews.id);

      return NextResponse.json({
        message: "✅ News created successfully",
        id: newNews.id,
      });
    }

    // ✅ JSON mode (tanpa form-data)
    const body = await request.json();
    const { title, summary, content, featured_image, event_date } = body;

    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newNews = await db.news.create({
      data: {
        title,
        slug,
        summary,
        content,
        featured_image: featured_image || null,
        event_date: event_date ? new Date(event_date) : null,
        is_published: true,
      },
    });

    return NextResponse.json({
      message: "✅ News created successfully (JSON mode)",
      id: newNews.id,
    });
  } catch (error) {
    console.error("❌ Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id)
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );

    const existing = await db.news.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "News not found" }, { status: 404 });

    await db.news.delete({ where: { id } });

    console.log("🗑️ News deleted:", id);

    return NextResponse.json({ message: "🗑️ News deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
