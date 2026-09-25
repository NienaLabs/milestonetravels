import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (status !== "OPEN" && status !== "RESOLVED") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supportMessage = await prisma.supportMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, supportMessage });
  } catch (error) {
    console.error("Failed to update support message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
