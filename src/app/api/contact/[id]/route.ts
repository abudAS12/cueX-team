import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id, 10);
    if (Number.isNaN(contactId)) {
      return NextResponse.json(
        { error: "Invalid contact id" },
        { status: 400 }
      );
    }

    await db.contacts.delete({
      where: { id: contactId },
    });

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
