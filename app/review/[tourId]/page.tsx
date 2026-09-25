import ReviewFormClient from "@/components/ReviewFormClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tourId: string }>;
}): Promise<Metadata> {
  const { tourId } = await params;
  const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { title: true } });
  return {
    title: tour ? `Review — ${tour.title} | Milestone Travels` : "Leave a Review | Milestone Travels",
  };
}

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
