'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TourCard from './TourCard';

gsap.registerPlugin(ScrollTrigger);

export default function ToursGrid({ tours }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    
    const cards = sectionRef.current.querySelectorAll('.tour-card');
    const heading = sectionRef.current.querySelector('.section-heading');

    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        },
      );
    }

    if (heading) {
      // Heading reveal
      gsap.fromTo(
        heading,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        },
      );
    }
  }, { scope: sectionRef });

  if (!tours || tours.length === 0) {
    return (
      <section ref={sectionRef} className="py-32 text-center text-white/30 font-body text-sm tracking-wider uppercase">
        No upcoming tours
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">

        {/* Section heading */}
        <div className="section-heading flex items-end justify-between mb-14 gap-6">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
              Curated Experiences
            </p>
            <h2 className="font-display italic text-4xl md:text-5xl font-light text-white leading-none">
              Upcoming Tours
            </h2>
          </div>
          <div className="hidden md:block h-px flex-1 max-w-xs bg-white/[0.08]" />
          <p className="hidden md:block font-body text-xs text-white/30 whitespace-nowrap">
            {tours.length} {tours.length === 1 ? 'tour' : 'tours'} available
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tours.map(tour => (
            <div key={tour.id} className="tour-card">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}