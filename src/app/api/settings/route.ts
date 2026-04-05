import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SettingsModel } from "@/models/Settings";

export async function GET() {
  try {
    await dbConnect();
    const docs = await SettingsModel.find({}).lean<Array<{ key: string; value: string }>>();
    const result: Record<string, string> = {};
    for (const doc of docs) {
      if (doc.key) result[doc.key] = doc.value ?? "";
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json() as Record<string, string>;
    for (const [key, value] of Object.entries(data)) {
      await SettingsModel.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
