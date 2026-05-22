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

    const { bookingId, amountPaid } = await req.json();

    if (!bookingId || amountPaid === undefined) {
      return NextResponse.json({ error: "Missing bookingId or amountPaid" }, { status: 400 });
    }

    const parsedAmountPaid = parseFloat(amountPaid);
    if (isNaN(parsedAmountPaid) || parsedAmountPaid < 0) {
      return NextResponse.json({ error: "Invalid amount paid" }, { status: 400 });
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tour: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (parsedAmountPaid > booking.totalPrice) {
      return NextResponse.json({ error: "Amount paid cannot exceed total tour price" }, { status: 400 });
    }

    // Update the booking amountPaid
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        amountPaid: parsedAmountPaid,
        status: parsedAmountPaid >= booking.totalPrice ? "CONFIRMED" : "PENDING",
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

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    console.error("Update payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
