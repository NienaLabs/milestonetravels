import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

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
    } = await req.json();

    if (!title || !destination || !description || !departureDate || !returnDate || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tour = await prisma.tour.create({
      data: {
        title,
        destination,
        description,
        departureDate: new Date(departureDate),
        returnDate: new Date(returnDate),
        price: parseFloat(price),
        image: image || null,
        spots: spots ? parseInt(spots) : 20,
        groupChatLink: groupChatLink || null,
        enquiryPhone: enquiryPhone || null,
      },
    });

    return NextResponse.json({ success: true, tour });
  } catch (error) {
    console.error("Failed to create tour:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
