import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Contact API (GET, POST multipart/form-data or JSON, DELETE)
 * - Accepts optional file upload saved to /public/image (attachment)
 * - Uses shared Prisma client `db`
 */

export async function GET() {
  try {
    const contacts = await db.contacts.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const name = formData.get("name")?.toString();
      const email = formData.get("email")?.toString();
      const subject = formData.get("subject")?.toString() || null;
      const message = formData.get("message")?.toString();
      const file = formData.get("file") as File | null;

      if (!name || !email || !message) {
        return NextResponse.json(
          { error: "Name, email and message are required" },
          { status: 400 }
        );
      }

      // basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      let attachmentPath: string | null = null;
      if (file) {
        const uploadDir = path.join(process.cwd(), "public", "image");
        await mkdir(uploadDir, { recursive: true });

        const ext = path.extname(file.name);
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        attachmentPath = `/image/${fileName}`;
      }

      const newContact = await db.contacts.create({
        data: {
          name,
          email,
          subject,
          message,
          // If you added `attachment` column to schema, include it:
          // attachment: attachmentPath,
        },
      });

      return NextResponse.json({
        message: "Contact created successfully",
        id: newContact.id,
        attachment: attachmentPath,
      });
    } else {
      // JSON fallback
      const body = await request.json();
      const { name, email, subject, message } = body;

      if (!name || !email || !message) {
        return NextResponse.json(
          { error: "Name, email and message are required" },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      const newContact = await db.contacts.create({
        data: {
          name,
          email,
          subject: subject || null,
          message,
        },
      });

      return NextResponse.json({
        message: "Contact created successfully (JSON mode)",
        id: newContact.id,
      });
    }
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
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
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    await db.contacts.delete({ where: { id: Number(id) } });

    return NextResponse.json({
      message: "Contact deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
