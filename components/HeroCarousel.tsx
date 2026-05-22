"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── Slide data ─────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    eyebrow: "Featured Destination",
    title: "Santorini, Greece",
    sub: "Cycladic whitewash and endless Aegean blue",
    accent: "#38bdf8",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    eyebrow: "Adventure Awaits",
    title: "Safari, Kenya",
    sub: "Witness the great migration on open savannah",
    accent: "#f59e0b",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    eyebrow: "New Booking Open",
    title: "Kyoto, Japan",
    sub: "Bamboo forests, shrine paths, and lantern light",
    accent: "#f472b6",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    eyebrow: "Limited Spots",
    title: "Accra, Ghana",
    sub: "Cultural immersion in the heart of West Africa",
    accent: "#34d399",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
  },
];

/* ─── Carousel ───────────────────────────────────────────── */
export default function HeroCarousel({ userName }: { userName: string }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 900);
  };

  const advance = () => {
    goTo((current + 1) % SLIDES.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(advance, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, animating]);

  const slide = SLIDES[current];

  return (
    <>
      <div className="hero-carousel" role="region" aria-label="Featured destinations carousel">
        {/* ── Slides ── */}
        <div className="hero-carousel__track">
          {/* Previous (exiting) */}
          {prev !== null && (
            <div key={`prev-${prev}`} className="hero-carousel__slide hero-carousel__slide--exit" aria-hidden="true">
              <Image
                src={SLIDES[prev].image}
                alt={SLIDES[prev].title}
                fill
                sizes="100vw"
                priority={prev === 0}
                className="hero-carousel__img"
              />
              <div className="hero-carousel__overlay" style={{ "--accent": SLIDES[prev].accent } as React.CSSProperties} />
            </div>
          )}

          {/* Current (entering) */}
          <div key={`cur-${current}`} className="hero-carousel__slide hero-carousel__slide--enter" aria-label={`${slide.title} — ${slide.sub}`}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority
              className="hero-carousel__img"
            />
            <div className="hero-carousel__overlay" style={{ "--accent": slide.accent } as React.CSSProperties} />

            {/* Content */}
            <div className="hero-carousel__content">
              <p className="hero-carousel__eyebrow" style={{ color: slide.accent }}>
                {slide.eyebrow}
              </p>
              <h2 className="hero-carousel__title">{slide.title}</h2>
              <p className="hero-carousel__sub">{slide.sub}</p>
            </div>

            {/* User greeting — bottom left */}
            <div className="hero-carousel__greeting">
              <span className="hero-carousel__greeting-label">Welcome back</span>
              <span className="hero-carousel__greeting-name">{userName}</span>
            </div>
          </div>
        </div>

        {/* ── Progress dots ── */}
        <div className="hero-carousel__dots" role="tablist" aria-label="Carousel slides">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              className={`hero-carousel__dot ${i === current ? "hero-carousel__dot--active" : ""}`}
              style={i === current ? { "--dot-accent": slide.accent } as React.CSSProperties : undefined}
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                goTo(i);
                timerRef.current = setInterval(advance, 5000);
              }}
            />
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div className="hero-carousel__progress">
          <div
            key={`prog-${current}`}
            className="hero-carousel__progress-fill"
            style={{ "--progress-accent": slide.accent } as React.CSSProperties}
          />
        </div>
      </div>
    </>
  );
}


