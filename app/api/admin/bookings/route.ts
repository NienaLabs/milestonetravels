import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        tour: {
          select: {
            title: true,
            destination: true,
            price: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Failed to fetch bookings for admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
