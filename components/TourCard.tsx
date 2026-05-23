'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, ArrowUpRight } from 'lucide-react';

export default function TourCard({ tour }: { tour: any }) {
  const departure = new Date(tour.departureDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const nights = Math.round(
    (new Date(tour.returnDate).getTime() - new Date(tour.departureDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {tour.image ? (
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
            <MapPin size={24} className="text-white/20" />
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
          <span className="font-body text-xs font-bold tracking-wider text-white">
            GH₵{Number(tour.price).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Destination tag */}
        <div className="flex items-center gap-1.5 text-white/40">
          <MapPin size={11} strokeWidth={1.5} />
          <span className="font-body text-[10px] tracking-[0.2em] uppercase">
            {tour.destination}
          </span>
        </div>

        <h3 className="font-headline text-lg font-semibold leading-snug text-white/90 line-clamp-2">
          {tour.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-white/40">
            <Calendar size={11} strokeWidth={1.5} />
            <span className="font-body text-[10px] tracking-wider">{departure}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40">
            <span className="font-body text-[10px] tracking-wider">{nights}N</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 ml-auto">
            <Users size={11} strokeWidth={1.5} />
            <span className="font-body text-[10px] tracking-wider">{tour.spots}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/checkout/${tour.id}`}
          className="flex items-center justify-between w-full py-3 px-4 bg-white text-black font-body text-xs font-bold tracking-[0.15em] uppercase rounded-lg hover:bg-white/90 transition-colors group/btn"
        >
          <span>Book Now</span>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}