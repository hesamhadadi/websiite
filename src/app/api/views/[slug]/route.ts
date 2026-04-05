import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";

export async function POST(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect();
    await BlogPostModel.findOneAndUpdate(
      { slug: params.slug, published: true },
      { $inc: { views: 1 } }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
