import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import ToursGrid from '@/components/ToursGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upcoming Tours | Milestone Travels',
  description: 'Browse and book curated tour packages with Milestone Travels.',
};

export const dynamic = 'force-dynamic';

export default async function ToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { departureDate: 'asc' },
    include: { _count: { select: { bookings: true } } },
  });

  const toursWithAvailability = tours.map(({ _count, ...tour }) => ({
    ...tour,
    spotsRemaining: Math.max(0, tour.spots - _count.bookings),
  }));

  return (
    <div className="min-h-screen bg-[#060810] text-white selection:bg-blue-500/30 selection:text-white">
      <Navbar />

      {/* ── Hero Slider ── full-screen GSAP column-split */}
      <HeroSlider />

      {/* ── Tour Cards ── */}
      <ToursGrid tours={toursWithAvailability} />
    </div>
  );
}