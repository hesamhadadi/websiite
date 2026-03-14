import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactModel } from "@/models/Contact";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const data = await req.json();
    const msg = await ContactModel.findByIdAndUpdate(params.id, data, { new: true });
    if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(msg);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await ContactModel.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
