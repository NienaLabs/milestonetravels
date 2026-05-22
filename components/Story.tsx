"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
        end: 'bottom 25%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.story-num', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })
      .from('.story-quotemark', { y: -40, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.5')
      .from('.story-quote', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .from('.story-rule', { scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.inOut' }, '-=0.2')
      .from('.story-body-text', { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' }, '-=0.4')
      .from('.stat-number', {
        textContent: 0,
        duration: 2,
        ease: 'power1.out',
        snap: { textContent: 1 },
        stagger: 0.2,
      }, '-=0.3');
  }, { scope: container });

  return (
    <section id="story" ref={container} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-story" style={{ backgroundColor: 'var(--bg-story)' }}>
      {/* Background SVG map placeholder */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto px-6 z-10 relative py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <h3 className="story-num type-section-num absolute -top-16 -left-8 text-white-muted pointer-events-none select-none">01</h3>
            <div className="text-navy-sky text-6xl mb-6 story-quotemark font-display">"</div>
            <p className="story-quote type-h3 font-display italic mb-8 relative z-10">
              "Travel is not just about the destination. It's about the transformation that happens along the way."
            </p>
            <div className="h-[2px] w-24 bg-tick-accent mb-8 story-rule"></div>
            <p className="story-body-text type-body text-white-soft">
              At Milestone Travels, we believe every journey is a milestone. From the moment you board your flight to the memories you create, we are dedicated to curating premium, unforgettable experiences tailored specifically to you.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-center border border-white-ghost p-10 backdrop-blur-md rounded-2xl bg-glass-card shadow-[0_30px_80px_rgba(7,17,53,0.6)] relative transform transition-transform hover:-translate-y-2 duration-500 hover:border-navy-sky/50">
             <div className="absolute inset-0 bg-white-pure opacity-[0.02] rounded-2xl pointer-events-none"></div>
             <div>
               <div className="text-5xl font-display font-bold text-white-pure mb-2 flex justify-center"><span className="stat-number">500</span>+</div>
               <div className="type-label text-navy-sky">Destinations</div>
             </div>
             <div>
               <div className="text-5xl font-display font-bold text-white-pure mb-2 flex justify-center"><span className="stat-number">10</span>K+</div>
               <div className="type-label text-navy-sky">Happy Travelers</div>
             </div>
             <div className="col-span-2 mt-4 pt-6 border-t border-white-ghost/30">
               <div className="text-4xl font-display font-bold text-white-pure mb-2">24/7</div>
               <div className="type-label text-navy-sky">Dedicated Support</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
