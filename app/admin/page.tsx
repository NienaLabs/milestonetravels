import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import BookingTrackerClient from "@/components/BookingTrackerClient";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const tours = await prisma.tour.findMany({
    include: {
      bookings: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          payments: {
            orderBy: {
              createdAt: "desc"
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      departureDate: "asc"
    }
  });

  // Serialize Dates
  const serializedTours = tours.map(t => ({
    ...t,
    departureDate: t.departureDate.toISOString(),
    returnDate: t.returnDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    bookings: t.bookings.map(b => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      payments: b.payments.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString()
      }))
    }))
  }));

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3">Admin Portal</p>
        <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">Booking Tracker</h1>
        <p className="font-body text-white-muted text-base">
          Manage tours, add bookings manually, track customer payments, and inspect transaction logs.
        </p>
      </div>

      <BookingTrackerClient initialTours={serializedTours as any} />
    </div>
  );
}
