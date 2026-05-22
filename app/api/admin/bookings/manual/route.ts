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

    const { tourId, email, amountPaid } = await req.json();

    if (!tourId || !email) {
      return NextResponse.json({ error: "Missing tourId or email" }, { status: 400 });
    }
    
    const parsedAmountPaid = amountPaid ? parseFloat(amountPaid) : 0;
    if (isNaN(parsedAmountPaid) || parsedAmountPaid < 0) {
      return NextResponse.json({ error: "Invalid amount paid" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found with that email" }, { status: 404 });
    }

    // Find the tour to get the price
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Check if user already booked this tour
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        tourId: tour.id,
      }
    });

    if (existingBooking) {
      return NextResponse.json({ error: "User has already booked this tour" }, { status: 400 });
    }

    if (parsedAmountPaid > tour.price) {
      return NextResponse.json({ error: "Amount paid cannot exceed total tour price" }, { status: 400 });
    }

    // Create the manual booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        tourId: tour.id,
        totalPrice: tour.price,
        amountPaid: parsedAmountPaid,
        status: parsedAmountPaid >= tour.price ? "CONFIRMED" : "PENDING",
        ...(parsedAmountPaid > 0 ? {
          payments: {
            create: {
              amount: parsedAmountPaid,
              method: "manual",
              reference: `MANUAL-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              status: "SUCCESS"
            }
          }
        } : {})
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        payments: true
      }
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("Manual booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
