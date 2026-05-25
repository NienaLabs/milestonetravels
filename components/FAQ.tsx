"use client";
import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "What is included in your luxury tour packages?",
    answer: "Our packages typically include premium accommodations, private airport transfers, exclusive guided experiences, and 24/7 dedicated concierge support. Flights and special requests can be seamlessly bundled into your tailored itinerary."
  },
  {
    question: "Do you offer custom-tailored itineraries?",
    answer: "Absolutely. We specialize in curating bespoke journeys. After a personalized consultation, we design an itinerary tailored specifically to your preferences, travel style, and timeline to ensure a truly unique experience."
  },
  {
    question: "How far in advance should I book my trip?",
    answer: "For international travel and peak seasons, we recommend booking 3 to 6 months in advance. This allows us to secure the best suites in boutique hotels, top-tier dining reservations, and first-class cabin availability."
  },
  {
    question: "What happens if my flight is delayed or canceled?",
    answer: "Our dedicated support team monitors your travel schedule in real-time. In the event of disruptions, we proactively handle rebooking, alternative arrangements, and hotel notifications while you relax."
  },
  {
    question: "Do you provide corporate travel management?",
    answer: "Yes, we offer comprehensive corporate travel services including priority booking, negotiated luxury rates, streamlined itinerary management, and executive VIP support for you and your team."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-white/10 overflow-hidden">
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
      >
        <span className={`font-headline text-lg md:text-xl transition-colors duration-300 ${isOpen ? 'text-navy-sky' : 'text-white-pure group-hover:text-white-pure/80'}`}>
          {question}
        </span>
        <div className={`ml-4 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-navy-sky' : 'text-white-muted group-hover:text-white-pure'}`}>
          <ChevronDown size={24} strokeWidth={1.5} />
        </div>
      </button>
      <div 
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'}`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-white-soft leading-relaxed pr-8 md:pr-12">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.faq-item', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <section id="faq" ref={containerRef} className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-story)' }}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy-bright rounded-full opacity-5 filter blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <h3 className="type-label text-white-soft mb-4">GOT QUESTIONS?</h3>
          <h2 className="type-h2 text-white-pure mb-6">FREQUENTLY ASKED</h2>
          <div className="h-[2px] w-24 bg-tick-accent mx-auto"></div>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <FAQItem 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
