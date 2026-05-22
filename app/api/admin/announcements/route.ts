import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, message } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
      }
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error: any) {
    console.error("Failed to create announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
