import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    let uploadUrl: string;
    let uploadBody: Record<string, string>;

    if (uploadPreset) {
      // Unsigned upload via preset
      uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      uploadBody = {
        file: dataUri,
        upload_preset: uploadPreset,
        folder: "portfolio/projects",
      };
    } else if (apiKey && apiSecret) {
      // Signed upload
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const folder = "portfolio/projects";
      const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(signatureStr);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      uploadBody = {
        file: dataUri,
        api_key: apiKey,
        timestamp,
        folder,
        signature,
      };
    } else {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured. Set CLOUDINARY_UPLOAD_PRESET or CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET." },
        { status: 500 }
      );
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadBody),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", result);
      return NextResponse.json(
        { error: result.error?.message || "Upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
