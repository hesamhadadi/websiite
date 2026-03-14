import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose, { Schema, models } from "mongoose";

const SettingsSchema = new Schema(
  { key: { type: String, required: true, unique: true }, value: { type: String } },
  { timestamps: true }
);
const SettingsModel = models.Settings || mongoose.model("Settings", SettingsSchema);

export async function GET() {
  try {
    await dbConnect();
    const docs = await SettingsModel.find({}).lean() as unknown as { key: string; value: string }[];
    const result: Record<string, string> = {};
    for (const doc of docs) result[doc.key] = doc.value;
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    for (const [key, value] of Object.entries(data)) {
      await SettingsModel.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
