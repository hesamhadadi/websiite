import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactModel } from "@/models/Contact";

export async function GET() {
  try {
    await dbConnect();
    const messages = await ContactModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
