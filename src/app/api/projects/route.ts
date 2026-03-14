import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ProjectModel } from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();
    const projects = await ProjectModel.find({}).sort({ featured: -1, year: -1 }).lean();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const project = await ProjectModel.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
