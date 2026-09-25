import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();

    if (typeof subject !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || trimmedSubject.length > 200) {
      return NextResponse.json({ error: "Subject must be between 1 and 200 characters" }, { status: 400 });
    }

    if (!trimmedMessage || trimmedMessage.length > 5000) {
      return NextResponse.json({ error: "Message must be between 1 and 5000 characters" }, { status: 400 });
    }

    const supportMessage = await prisma.supportMessage.create({
      data: {
        userId: session.user.id,
        subject: trimmedSubject,
        message: trimmedMessage,
      },
    });

    return NextResponse.json({ success: true, supportMessage });
  } catch (error) {
    console.error("Failed to submit support message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
