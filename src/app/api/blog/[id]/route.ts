import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const data = await req.json();
    const post = await BlogPostModel.findByIdAndUpdate(params.id, data, { new: true });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await BlogPostModel.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
