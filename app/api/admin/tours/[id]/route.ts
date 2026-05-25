import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.tour.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete tour:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const {
      title,
      destination,
      description,
      departureDate,
      returnDate,
      price,
      image,
      spots,
      groupChatLink,
      enquiryPhone,
    } = body;

    const updatedTour = await prisma.tour.update({
      where: { id },
      data: {
        title,
        destination,
        description,
        departureDate: new Date(departureDate),
        returnDate: new Date(returnDate),
        price,
        image,
        spots,
        groupChatLink,
        enquiryPhone,
      },
    });

    return NextResponse.json({ success: true, tour: updatedTour });
  } catch (error) {
    console.error("Failed to update tour:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
