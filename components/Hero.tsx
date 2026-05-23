"use client";

import React, { useEffect, useState, useRef } from "react";
import "./Hero.css";
import Link from "next/link";

const SLIDES = [
  {
    id: 1,
    image: "/img/1.jpg",
    title: "MILESTONES TO MEMORIES",
    description:
      "Let us plan your perfect getaway. From domestic flights to international reservations at the best fares.",
  },
  {
    id: 2,
    image: "/img/2.jpg",
    title: "COMFORT & LUXURY",
    description:
      "Discover comfortable stays and fully furnished apartments tailored strictly to your budget and preference.",
  },
  {
    id: 3,
    image: "/img/3.jpg",
    title: "GUIDED ADVENTURES",
    description:
      "Exciting holiday packages for leisure, adventure, and group travel. Create memories that last a lifetime.",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  // ─── Diameter: write directly to the DOM node, never setState ─────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const d = Math.sqrt(
        Math.pow(el.offsetWidth, 2) + Math.pow(el.offsetHeight, 2)
      );
      el.style.setProperty("--diameter", `${d}px`);
    };

    update();

    roRef.current = new ResizeObserver(update);
    roRef.current.observe(el);

    return () => roRef.current?.disconnect();
  }, []);

  // ─── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const active = SLIDES[activeSlide];
  const titleWords = active.title.split(" ");
  const firstWord = titleWords[0];
  const restOfTitle = titleWords.slice(1).join(" ");

  return (
    <section className="slider-container" ref={containerRef}>
      {/* Aeroplane — real DOM element so GSAP yoyo can target it */}
      <div className="hero-aeroplane" aria-hidden="true" />

      {/* Slides — image circles only, no text inside */}
      <div className="slider-list">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`slider-item${index === activeSlide ? " active" : ""}`}
          >
            <div
              className="slider-image"
              style={{ "--url": `url('${slide.image}')` } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
      <div className="slider-content container mx-auto px-4">
        <h2 key={`title-${activeSlide}`} className="slide-in-title">
          <span className="outline-text">{firstWord}</span> {restOfTitle}
        </h2>
        <p key={`desc-${activeSlide}`} className="slide-in-desc">
          {active.description}
        </p>
        <div className="mt-4" key={`btn-${activeSlide}`}>
          <Link href="/tours" className="px-8 py-3 border border-white-pure text-white-pure text-sm tracking-[0.12em] font-bold uppercase hover:bg-navy-bright hover:border-navy-bright transition-colors duration-300">
          Explore Our Upcoming Tours          </Link>
        </div>
      </div>
    </section>
  );
}