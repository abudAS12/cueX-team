import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id, 10);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: "Invalid contact ID" },
        { status: 400 }
      );
    }

    await db.contacts.update({
      where: { id: contactId },
      data: { is_read: true },
    });

    return NextResponse.json({ message: "Contact marked as read" });
  } catch (error) {
    console.error("Error marking contact as read:", error);
    return NextResponse.json(
      { error: "Failed to mark contact as read" },
      { status: 500 }
    );
  }
}
