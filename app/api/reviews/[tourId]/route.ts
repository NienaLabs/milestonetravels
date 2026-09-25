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

    if (typeof reviewerName !== "string" || typeof comment !== "string") {
      return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
    }

    const trimmedName = reviewerName.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || trimmedName.length > 100) {
      return NextResponse.json({ error: "Name must be between 1 and 100 characters" }, { status: 400 });
    }

    if (!trimmedComment || trimmedComment.length > 2000) {
      return NextResponse.json({ error: "Comment must be between 1 and 2000 characters" }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: "Rating must be a whole number between 1 and 5" }, { status: 400 });
    }

    const tourExists = await prisma.tour.findUnique({ where: { id: tourId }, select: { id: true } });
    if (!tourExists) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        tourId,
        reviewerName: trimmedName,
        rating: numericRating,
        comment: trimmedComment,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
