import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || trimmedEmail.length > 254 || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: trimmedEmail },
      update: {},
      create: { email: trimmedEmail },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
