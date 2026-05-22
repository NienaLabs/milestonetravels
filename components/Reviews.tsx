"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  { id: 1, name: "Sarah Jenkins", text: "Milestone Travels took care of every single detail. Our honeymoon in Bali was completely stress-free and magical. The hotel upgrades were a wonderful surprise!", rating: 5 },
  { id: 2, name: "Marcus Johnson", text: "I travel frequently for work and Milestone handles all my corporate bookings now. They are fast, reliable, and always secure the best rates.", rating: 5 },
  { id: 3, name: "Elena Rodriguez", text: "The guided tour through Rome was breathtaking. The local guides they partnered with were incredibly knowledgeable and skipped all the lines.", rating: 5 },
  
  { id: 4, name: "Michael Thorne", text: "Best prices I could find for business class flights to Tokyo. The booking process was seamless and the customer service is top-notch.", rating: 5 },
  { id: 5, name: "Aisha Patel", text: "I've used several travel agencies before, but none compare to the personalized itinerary Milestone put together for my family's European vacation.", rating: 5 },
  { id: 6, name: "James Wilson", text: "Flawless execution from start to finish. The private airport transfers were waiting for us exactly on time, making our trip incredibly relaxing.", rating: 5 },
  
  { id: 7, name: "Chloe Dupont", text: "Their recommendations for boutique hotels were spot on. We stayed at the most beautiful hidden gems that we would never have found on our own.", rating: 5 },
  { id: 8, name: "David Chen", text: "Exceptional 24/7 support. My flight was delayed, but their team had already rebooked my connecting flight before I even landed. Truly professional.", rating: 5 },
  { id: 9, name: "Emma Thompson", text: "Our safari trip to Kenya was the experience of a lifetime. The lodges were luxurious and the entire journey felt safe and expertly organized.", rating: 5 }
];

const ReviewCard = ({ review }: { review: any }) => (
  <div className="bg-glass-card p-8 lg:p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/5 hover:border-navy-sky/30 transition-all duration-500 transform hover:-translate-y-2">
    <div className="flex gap-1 mb-6 text-tick-accent">
      {[...Array(review.rating)].map((_, i) => (
        <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
    <p className="font-body text-white-soft text-lg mb-8 leading-relaxed italic">
      "{review.text}"
    </p>
    <div className="font-headline font-bold text-white-pure tracking-wider uppercase">
      — {review.name}
    </div>
  </div>
);

export default function Reviews() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%', // Pin for 1.5x screen height to ensure time to reveal all cards
          pin: true,
          scrub: 1,
        }
      });

      // First and last columns move DOWN physically as you scroll down (starting high, ending low)
      tl.fromTo('.col-down', { y: '-60vh' }, { y: '20vh', ease: 'none' }, 0);
      
      // Middle column moves UP physically as you scroll down (starting low, ending high)
      tl.fromTo('.col-up', { y: '20vh' }, { y: '-60vh', ease: 'none' }, 0);
    });

  }, { scope: containerRef });

  return (
    <section id="reviews" ref={containerRef} className="relative md:h-screen md:overflow-hidden flex flex-col py-20 md:py-0">
      
      {/* Decorative gradient background for a premium glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-navy-bright rounded-full opacity-10 filter blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center mb-12 md:mb-8 md:pt-20 flex-shrink-0">
        <h3 className="type-label text-navy-sky mb-4">TESTIMONIALS</h3>
        <h2 className="type-h2 text-white-pure mb-6">CLIENT JOURNEYS</h2>
        <div className="h-[2px] w-24 bg-tick-accent mx-auto"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10 flex-grow md:overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 w-full relative md:h-[150vh]">
          
          <div className="col-down flex flex-col gap-6 lg:gap-10">
            {reviews.slice(0, 3).map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
          
          <div className="col-up flex flex-col gap-6 lg:gap-10">
            {reviews.slice(3, 6).map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
          
          <div className="col-down flex flex-col gap-6 lg:gap-10">
            {reviews.slice(6, 9).map(r => <ReviewCard key={r.id} review={r} />)}
          </div>

        </div>
      </div>

      {/* Fade out at the bottom to make the cards smoothly disappear instead of hard cutting off */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-navy-deep to-transparent z-20 pointer-events-none"></div>
    </section>
  );
}
