import ReviewFormClient from "@/components/ReviewFormClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ReviewPage({ params }: { params: Promise<{ tourId: string }> }) {
  const { tourId } = await params;
  
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    select: { id: true, title: true, destination: true, image: true }
  });

  if (!tour) {
    return notFound();
  }

  return <ReviewFormClient tour={tour as any} />;
}
