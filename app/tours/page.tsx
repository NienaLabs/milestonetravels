import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import ToursGrid from '@/components/ToursGrid';

export const dynamic = 'force-dynamic';

export default async function ToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { departureDate: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#060810] text-white selection:bg-blue-500/30 selection:text-white">
      <Navbar />

      {/* ── Hero Slider ── full-screen GSAP column-split */}
      <HeroSlider />

      {/* ── Tour Cards ── */}
      <ToursGrid tours={tours} />
    </div>
  );
}