import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import MyTripsClient from "@/components/MyTripsClient";
import HeroCarousel from "@/components/HeroCarousel";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { tour: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = bookings.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    tour: {
      ...b.tour,
      departureDate: b.tour.departureDate.toISOString(),
      returnDate: b.tour.returnDate.toISOString(),
      createdAt: b.tour.createdAt.toISOString(),
      updatedAt: b.tour.updatedAt.toISOString(),
    },
  }));

  const stats = [
    {
      label: "Active Bookings",
      value: bookings.filter((b) => b.status === "CONFIRMED").length,
      suffix: "",
      icon: "/icons/burns-folder.png",
    },
    {
      label: "Total Invested",
      value: `GH₵${bookings.reduce((s, b) => s + b.amountPaid, 0).toLocaleString()}`,
      suffix: "",
      icon: "/icons/card.png",
    },
    {
      label: "Trips Completed",
      value: bookings.filter((b) => b.amountPaid >= b.totalPrice).length,
      suffix: "",
      icon: "/icons/wheel.png",
    },
  ];

  return (
    <>
      <HeroCarousel userName={session.user.name?.split(" ")[0] ?? "Traveller"} />

      <div className="dash-stats">
        {stats.map((s, i) => (
          <div key={s.label} className="dash-stat" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="dash-stat__row">
              <div className="dash-stat__iconWrap">
                <Image
                  src={s.icon}
                  alt={s.label}
                  width={48}
                  height={48}
                  className="dash-stat__icon"
                />
              </div>

              <div className="dash-stat__text">
                <span className="dash-stat__label">{s.label}</span>
                <span className="dash-stat__value">
                  {s.value}
                  {s.suffix}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MyTripsClient bookings={serialized} />
    </>
  );
}