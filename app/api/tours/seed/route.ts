import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const existingTours = await prisma.tour.count();
    
    if (existingTours > 0) {
      return NextResponse.json({ message: "Database already seeded with tours." });
    }

    await prisma.tour.createMany({
      data: [
        {
          title: "Maldives Gateway",
          description: "Experience the ultimate luxury in the Maldives with overwater villas and crystal clear waters.",
          destination: "Maldives",
          departureDate: new Date("2026-08-15T10:00:00Z"),
          returnDate: new Date("2026-08-22T10:00:00Z"),
          price: 3500.00,
          image: "/img/auth-travel.png",
          spots: 10,
          groupChatLink: "https://chat.whatsapp.com/mocklink1",
        },
        {
          title: "Safari in Kenya",
          description: "A breathtaking adventure through the Masai Mara, spotting the Big Five in their natural habitat.",
          destination: "Kenya",
          departureDate: new Date("2026-09-10T08:00:00Z"),
          returnDate: new Date("2026-09-17T18:00:00Z"),
          price: 2800.00,
          image: "/img/auth-travel.png", 
          spots: 15,
          groupChatLink: "https://chat.whatsapp.com/mocklink2",
        },
        {
          title: "Paris Editorial",
          description: "Discover the romantic streets of Paris, premium dining, and exclusive museum tours.",
          destination: "France",
          departureDate: new Date("2026-10-05T12:00:00Z"),
          returnDate: new Date("2026-10-12T15:00:00Z"),
          price: 4200.00,
          image: "/img/auth-travel.png",
          spots: 8,
          groupChatLink: "https://chat.whatsapp.com/mocklink3",
        }
      ]
    });

    await prisma.announcement.create({
      data: {
        title: "Welcome to Milestone Travels",
        message: "We are thrilled to announce our new premium booking platform. Explore our upcoming tours and book your next adventure today!",
      }
    });

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
