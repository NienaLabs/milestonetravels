"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Custom Cloud SVG component
const CloudSvg = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 200 100" className={className} style={style} fill="white" preserveAspectRatio="none">
    <path d="M 50 90 C 30 90 20 80 20 65 C 20 50 35 45 40 45 C 45 25 70 10 95 15 C 115 5 145 10 155 35 C 175 35 185 50 185 65 C 185 85 165 90 145 90 Z" />
  </svg>
);

const TRUST_DATA = [
  { side: 'left', title: "RELIABLE & PROFESSIONAL", desc: "Service you can absolutely count on." },
  { side: 'right', title: "BEST PRICES", desc: "Great deals guaranteed on all packages." },
  { side: 'left', title: "24/7 SUPPORT", desc: "We are here whenever you need us." },
  { side: 'right', title: "HASSLE-FREE", desc: "Fast and flawlessly smooth bookings." }
];

export default function FlightExperience() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=800%', // Increased for the 4 separate timeline events
        pin: true,
        scrub: 1.2,
      }
    });

    // Phase 1: Idle
    tl.to({}, { duration: 0.5 });

    // Phase 2: Zoom Reveal
    tl.to('.story-content', { opacity: 0, x: -50, duration: 0.6 }, 'zoom');
    tl.to('.window-glass', { opacity: 0, duration: 0.3 }, 'zoom');
    tl.to('.window-hole', { 
      scale: 25, 
      ease: 'power3.in',
      duration: 1.5 
    }, 'zoom');

    tl.set('.story-overlay', { display: 'none' });

    // Phase 3: The Flight & Timeline
    // Plane flies DOWNWARD from above the screen, cruises, then exits
    tl.to('.flying-plane', {
      y: '50vh',
      ease: 'power2.out',
      duration: 3
    }, 'flight');

    tl.to('.flying-plane', {
      y: '150vh',
      ease: 'power2.in',
      duration: 7
    }, 'flight+=3');

    // Background clouds drift UPWARDS to simulate falling/diving speed
    tl.to('.bg-cloud', { y: '-100vh', duration: 10, ease: 'none' }, 'flight');

    // Animate the Trust texts sequentially
    TRUST_DATA.forEach((_, i) => {
      const startTime = i * 2.2; // Spaced out along the flight
      const selector = `.trust-item-${i}`;
      
      // Text fades in and moves up slightly
      tl.fromTo(selector, 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 
        `flight+=${startTime}`
      );
      
      // Text stays for a bit, then fades out moving up
      tl.to(selector, 
        { opacity: 0, y: -40, duration: 0.8, ease: 'power2.in' }, 
        `flight+=${startTime + 2}` // Leaves before the next one fully arrives
      );
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#87CEEB] to-[#2B4FD4]">
      
      {/* Background clouds for depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <CloudSvg className="bg-cloud absolute top-[100vh] left-[-10%] w-[600px] opacity-40 filter blur-[20px]" />
         <CloudSvg className="bg-cloud absolute top-[150vh] right-[-5%] w-[500px] opacity-30 filter blur-[15px]" />
         <CloudSvg className="bg-cloud absolute top-[200vh] left-[20%] w-[800px] opacity-50 filter blur-[30px]" />
      </div>

      {/* --- TRUST TIMELINE --- */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {TRUST_DATA.map((item, index) => (
          <div 
            key={index}
            className={`trust-item-${index} absolute top-[15vh] md:top-[40vh] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 ${item.side === 'left' ? 'md:left-[5vw] lg:left-[15vw]' : 'md:right-[5vw] lg:right-[15vw]'} w-[280px] md:w-[400px]`}
          >
            {/* The Cloud Platform */}
            <CloudSvg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] md:w-[550px] opacity-90 filter blur-[12px] -z-10" />
            
            {/* The Text */}
            <div className={`relative z-10 text-center md:text-left ${item.side === 'right' ? 'md:text-right' : 'md:text-left'}`}>
              <h3 className="text-2xl md:text-3xl font-headline font-black text-slate-800 mb-2 leading-tight tracking-tight drop-shadow-sm">
                {item.title}
              </h3>
              <p className="font-body text-slate-700 font-bold md:text-lg drop-shadow-sm">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- THE AEROPLANE --- */}
      {/* Positioned entirely above the viewport using -translate-y-full */}
      <Image 
        src="/img/aeroplane-fly.png" 
        alt="Aeroplane flying" 
        width={800}
        height={800}
        priority
        className="flying-plane absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-[350px] md:w-[450px] lg:w-[650px] h-auto object-contain z-30 drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]" 
      />

      {/* --- STORY OVERLAY (Phase 1) --- */}
      <div className="story-overlay absolute inset-0 z-50 pointer-events-none">
        
        {/* Story Text: Stacked on top for mobile, left side for desktop */}
        <div className="story-content absolute top-[8%] lg:top-1/2 lg:-translate-y-1/2 left-[5vw] lg:left-[8vw] w-[90vw] lg:w-[40vw] text-white-pure z-50 pointer-events-auto">
          <h3 className="type-section-num absolute -top-8 lg:-top-16 left-2 lg:-left-8 text-white-muted pointer-events-none select-none text-3xl lg:text-5xl">01</h3>
          <div className="text-navy-sky text-4xl lg:text-6xl mb-2 lg:mb-6 font-display leading-none">&quot;</div>
          <p className="type-h3 font-display italic mb-4 lg:mb-8 text-xl lg:text-3xl leading-snug">
            &quot;Travel is not just about the destination. It&apos;s about the transformation that happens along the way.&quot;
          </p>
          <div className="h-[2px] w-16 lg:w-24 bg-tick-accent mb-4 lg:mb-8"></div>
          <p className="type-body text-white-soft text-sm lg:text-base">
            At Milestone Travels, we believe every journey is a milestone. From the moment you board your flight to the memories you create, we are dedicated to curating premium, unforgettable experiences tailored specifically to you.
          </p>
        </div>

        {/* The Aeroplane Window Mask: Stacked below text on mobile, right side for desktop */}
        <div className="window-hole absolute top-[60%] lg:top-1/2 -translate-y-1/2 left-1/2 lg:left-auto lg:right-[10vw] -translate-x-1/2 lg:translate-x-0 w-[240px] h-[340px] lg:w-[350px] lg:h-[500px] rounded-[100px] lg:rounded-[150px] shadow-[0_0_0_5000px_#071135]">
           
           {/* Airplane Window Frame (Plastic bezel) */}
           <div className="window-glass absolute inset-0 rounded-[100px] lg:rounded-[150px] border-[16px] lg:border-[24px] border-[#cbd5e1] shadow-[inset_0_0_20px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.9)] z-10 pointer-events-none">
              {/* Inner Rubber Seal */}
              <div className="absolute inset-0 rounded-[84px] lg:rounded-[126px] border-[4px] lg:border-[6px] border-[#0f172a] shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)]"></div>
           </div>

           {/* Glass reflections */}
           <div className="window-glass absolute inset-0 rounded-[100px] lg:rounded-[150px] bg-white/5 shadow-[inset_0_0_40px_rgba(255,255,255,0.2)] z-20 pointer-events-none"></div>
           <div className="window-glass absolute top-[10%] left-[15%] w-[12%] h-[45%] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[3px] transform -rotate-[15deg] z-20 pointer-events-none"></div>
           <div className="window-glass absolute bottom-[15%] right-[20%] w-[8%] h-[20%] bg-gradient-to-t from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-[15deg] z-20 pointer-events-none"></div>
        </div>
      </div>
      
    </section>
  );
}
