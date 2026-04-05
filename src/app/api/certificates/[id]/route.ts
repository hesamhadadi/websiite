import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CertificateModel } from "@/models/Certificate";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const data = await req.json();
    const certificate = await CertificateModel.findByIdAndUpdate(params.id, data, { new: true });
    if (!certificate) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(certificate);
  } catch {
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await CertificateModel.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}
