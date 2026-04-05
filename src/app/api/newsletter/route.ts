import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { NewsletterSubscriptionModel } from "@/models/NewsletterSubscription";
import { enforceRateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const limiter = enforceRateLimit(`newsletter:${ip}`, 10, 60 * 60 * 1000);

    if (!limiter.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await dbConnect();
    await NewsletterSubscriptionModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), source: "site" },
      { upsert: true, new: true }
    );

    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      await fetch("https://api.resend.com/audiences/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audience_id: process.env.RESEND_AUDIENCE_ID,
          email,
        }),
      }).catch(() => null);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}
