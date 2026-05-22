import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: "ImageKit configuration is missing" }, { status: 500 });
    }

    // Convert file to base64 or send as buffer. ImageKit accepts form data with 'file' field.
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("fileName", file.name || "uploaded_image");
    uploadFormData.append("folder", "/milestone_tours"); // Optional folder

    const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

    const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: uploadFormData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("ImageKit Upload Error:", uploadResult);
      return NextResponse.json(
        { error: uploadResult.message || "Failed to upload image" },
        { status: uploadResponse.status }
      );
    }

    return NextResponse.json({ url: uploadResult.url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
