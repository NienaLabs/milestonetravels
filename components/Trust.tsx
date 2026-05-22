"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  { label: 'RELIABLE & PROFESSIONAL', desc: 'Service you can count on' },
  { label: 'BEST PRICES', desc: 'Great deals on all packages' },
  { label: '24/7 SUPPORT', desc: 'We are here when you need us' },
  { label: 'HASSLE-FREE', desc: 'Fast and smooth bookings' },
  { label: 'SATISFACTION', desc: 'Guaranteed customer happiness' },
];

export default function Trust() {
  const container = useRef(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      if (track.current) {
        gsap.to(track.current, {
          x: () => -(track.current!.scrollWidth - window.innerWidth + 100),
          ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            pin: true,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
          }
        });

        gsap.from('.trust-icon', {
          scale: 0,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.15,
          scrollTrigger: {
            trigger: container.current,
            start: 'top center',
            toggleActions: 'play none none reverse'
          }
        });
      }
    });
  }, { scope: container });

  return (
    <section id="why-us" ref={container} className="h-screen flex flex-col justify-center overflow-hidden relative bg-gradient-to-b from-navy-deep to-cta" style={{ background: 'linear-gradient(180deg, var(--bg-trust) 0%, var(--bg-cta) 100%)' }}>
      <div className="container mx-auto px-6 mb-12 flex-shrink-0 z-10">
        <h2 className="type-h2 text-white-pure text-center md:text-left">Trust Altitude</h2>
      </div>
      <div className="trust-track flex gap-12 px-6 md:px-[10vw] w-max items-center z-10" ref={track}>
        {pillars.map((p, i) => (
          <div key={i} className="flex flex-col items-center md:items-start w-64 md:w-80 flex-shrink-0">
            <div className="trust-icon w-20 h-20 rounded-full border border-white-ghost flex items-center justify-center mb-8 relative">
              <div className="absolute inset-2 rounded-full bg-navy-mid/50 flex items-center justify-center">
                <Check className="text-tick-accent w-8 h-8" strokeWidth={3} />
              </div>
            </div>
            <h3 className="type-body font-bold text-lg text-white-pure mb-2 tracking-wide uppercase">{p.label}</h3>
            <p className="font-display italic text-white-soft text-xl">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
