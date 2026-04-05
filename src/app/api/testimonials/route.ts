import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { TestimonialModel } from "@/models/Testimonial";

const fallbackTestimonials = [
  {
    name: "Product Lead",
    role: "Lead Product Designer",
    company: "Stealth Startup",
    quote: "He ships fast, keeps the UI precise, and improves the product while implementing it.",
    featured: true,
  },
  {
    name: "Engineering Manager",
    role: "Frontend Manager",
    company: "Enterprise SaaS",
    quote: "Reliable on complex frontend systems and unusually strong at turning ambiguous requirements into clean execution.",
    featured: true,
  },
];

export async function GET() {
  try {
    await dbConnect();
    const items = await TestimonialModel.find({ featured: true }).sort({ createdAt: -1 }).lean();
    if (!items.length) return NextResponse.json(fallbackTestimonials);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(fallbackTestimonials);
  }
}
