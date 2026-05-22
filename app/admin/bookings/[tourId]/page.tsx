// app/admin/bookings/[tourId]/page.tsx
// Server component — fetches tour + bookings, renders TourTravelersClient

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import TourTravelersClient from "@/components/TourTravelersClient";

export default async function TourTravelersPage({
  params,
}: {
  params: { tourId: string };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const { tourId } = await params;

  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: {
      bookings: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
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
      },
    },
  });

  if (!tour) notFound();

  // Serialize dates to ISO strings
  const serializedTour = {
    ...tour,
    departureDate: tour.departureDate.toISOString(),
    returnDate: tour.returnDate.toISOString(),
    createdAt: tour.createdAt.toISOString(),
    updatedAt: tour.updatedAt.toISOString(),
    bookings: tour.bookings.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      payments: b.payments.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      })),
    })),
  };

  return <TourTravelersClient tour={serializedTour as any} />;
}