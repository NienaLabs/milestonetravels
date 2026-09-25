import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reference, tourId, amountToPay } = await request.json();

    if (!reference || !tourId || amountToPay == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Always use the tour price from the database — never trust a client-supplied price.
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    if (amountToPay < tour.price * 0.1) {
      return NextResponse.json({ error: "Minimum payment is 10%" }, { status: 400 });
    }

    // Check if user already booked this tour
    let booking = await prisma.booking.findFirst({
      where: { userId: session.user.id, tourId }
    });

    // Only enforce capacity for a brand-new booking — topping up an existing one doesn't take a new spot.
    if (!booking) {
      const bookingsCount = await prisma.booking.count({ where: { tourId } });
      if (bookingsCount >= tour.spots) {
        return NextResponse.json({ error: "This tour is fully booked" }, { status: 400 });
      }
    }

    const remainingBalance = tour.price - (booking?.amountPaid || 0);
    if (amountToPay > remainingBalance) {
      return NextResponse.json({ error: "Payment exceeds the remaining balance" }, { status: 400 });
    }

    // Call Paystack API to verify the transaction
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY is missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Verify amount (Paystack returns amount in pesewas)
    const expectedAmountInPesewas = Math.round(amountToPay * 100);
    if (paystackData.data.amount < expectedAmountInPesewas) {
      return NextResponse.json({ error: "Paid amount does not match expected amount" }, { status: 400 });
    }

    if (!booking) {
      booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          tourId,
          totalPrice: tour.price,
          amountPaid: amountToPay,
          status: amountToPay >= tour.price ? "CONFIRMED" : "PENDING"
        }
      });
    } else {
      const newAmountPaid = booking.amountPaid + amountToPay;
      // Update amount paid
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          amountPaid: newAmountPaid,
          status: newAmountPaid >= booking.totalPrice ? "CONFIRMED" : "PENDING"
        }
      });
    }

    // Check if payment with this reference already exists to prevent duplicate entries
    const existingPayment = await prisma.payment.findUnique({
      where: { reference }
    });

    if (!existingPayment) {
      // Record payment
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: amountToPay,
          method: "paystack",
          reference: reference,
          status: "SUCCESS"
        }
      });
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error("Booking verification error:", error);
    return NextResponse.json({ error: "Failed to verify booking" }, { status: 500 });
  }
}
