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

    const { reference, tourId, amountToPay, totalTourPrice } = await request.json();

    if (!reference || !tourId || amountToPay == null || totalTourPrice == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (amountToPay < totalTourPrice * 0.1) {
      return NextResponse.json({ error: "Minimum payment is 10%" }, { status: 400 });
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

    // Check if user already booked this tour
    let booking = await prisma.booking.findFirst({
      where: { userId: session.user.id, tourId }
    });

    if (!booking) {
      booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          tourId,
          totalPrice: totalTourPrice,
          amountPaid: amountToPay,
          status: "CONFIRMED"
        }
      });
    } else {
      // Update amount paid
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          amountPaid: booking.amountPaid + amountToPay
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
