import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    const { tourId } = await params;
    
    if (!tourId) {
      return NextResponse.json({ error: "Missing tourId" }, { status: 400 });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      select: {
        id: true,
        title: true,
        destination: true,
        image: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, tour });
  } catch (error) {
    console.error("Error fetching tour for review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    const { tourId } = await params;
    
    if (!tourId) {
      return NextResponse.json({ error: "Missing tourId" }, { status: 400 });
    }

    const body = await request.json();
    const { reviewerName, rating, comment } = body;

    if (!reviewerName || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        tourId,
        reviewerName,
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
