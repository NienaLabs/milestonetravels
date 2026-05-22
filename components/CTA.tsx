"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    tl.from('.cta-glow', { scale: 0, opacity: 0, duration: 1.5, ease: 'power2.out' })
      .from('.cta-headline', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
      .from('.cta-btn-container', { 
        y: 30, opacity: 0, 
        duration: 0.8, ease: 'back.out(1.5)' 
      }, '-=0.5');
  }, { scope: container });

  return (
    <section id="contact" ref={container} className="min-h-[60vh] md:min-h-[80vh] relative flex flex-col items-center justify-center text-center overflow-hidden" style={{ backgroundColor: 'var(--bg-cta)' }}>
      {/* Sunrise glow */}
      <div className="cta-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--navy-sky)_0%,_transparent_60%)] opacity-20 pointer-events-none mix-blend-screen blur-3xl z-0"></div>
      
      <div className="z-10 container mx-auto px-6 relative">
        <h2 className="cta-headline type-hero-italic mb-12 text-white-pure">Your Next Journey Awaits</h2>
        
        <div className="cta-btn-container flex justify-center items-center">
          <button className="group relative px-10 py-5 rounded-full bg-white-pure text-navy-deep font-headline font-bold text-lg md:text-xl uppercase tracking-widest overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
            <span className="relative z-10 transition-colors duration-500 group-hover:text-white-pure">See Upcoming Tours</span>
            <div className="absolute inset-0 bg-navy-sky translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
          </button>
        </div>
      </div>
    </section>
  );
}
