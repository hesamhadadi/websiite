import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const query = all ? {} : { published: true };
    const posts = await BlogPostModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const post = await BlogPostModel.create(data);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
