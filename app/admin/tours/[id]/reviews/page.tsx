import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import AdminReviewsClient from "@/components/AdminReviewsClient";

export default async function AdminTourReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const { id } = await params;
  
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!tour) {
    return notFound();
  }

  // Serialize dates
  const serializedTour = {
    ...tour,
    departureDate: tour.departureDate.toISOString(),
    returnDate: tour.returnDate.toISOString(),
    createdAt: tour.createdAt.toISOString(),
    updatedAt: tour.updatedAt.toISOString(),
    reviews: tour.reviews.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    }))
  };

  return <AdminReviewsClient tour={serializedTour as any} />;
}
