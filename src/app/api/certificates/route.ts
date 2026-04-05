import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CertificateModel } from "@/models/Certificate";

export async function GET() {
  try {
    await dbConnect();
    const certificates = await CertificateModel.find({})
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    return NextResponse.json(certificates);
  } catch {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const certificate = await CertificateModel.create(data);
    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}
