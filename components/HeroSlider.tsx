'use client';

import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const SLIDES = [
  {
    src: '/img/1.jpg',
    label: 'Santorini, Greece',
    sub: 'Aegean Escapes',
  },
  {
    src: '/img/2.jpg',
    label: 'Kyoto, Japan',
    sub: 'Eastern Horizons',
  },
  {
    src: '/img/3.jpg',
    label: 'Machu Picchu, Peru',
    sub: 'Andean Odyssey',
  },
  {
    src: '/img/1.jpg',
    label: 'Amalfi Coast, Italy',
    sub: 'Mediterranean Gold',
  },
];

const NUM_COLS = 5;
const HOLD_DURATION = 3.2;
const COL_DURATION  = 0.55;
const COL_STAGGER   = 0.07;

export default function HeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef   = useRef<HTMLDivElement>(null);
  const incomingRef  = useRef<HTMLDivElement>(null);

  const currentIdxRef  = useRef(0);
  const incomingIdxRef = useRef(1);
  const isAnimating    = useRef(false);

  const [displayIndices, setDisplayIndices] = useState({
    current:  0,
    incoming: 1,
  });

  const currentCols  = useRef<(HTMLDivElement | null)[]>([]);
  const incomingCols = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    gsap.set(incomingCols.current, { yPercent: -100 });
    gsap.set(incomingRef.current?.querySelector('.slide-meta') as Element | null, { autoAlpha: 0 });

    const advance = () => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          currentIdxRef.current  = incomingIdxRef.current;
          incomingIdxRef.current = (incomingIdxRef.current + 1) % SLIDES.length;

          flushSync(() => {
            setDisplayIndices({
              current:  currentIdxRef.current,
              incoming: incomingIdxRef.current,
            });
          });

          gsap.set(currentCols.current,  { yPercent: 0 });
          gsap.set(incomingCols.current, { yPercent: -100 });
          gsap.set(incomingRef.current?.querySelector('.slide-meta') as Element | null, { autoAlpha: 0 });

          isAnimating.current = false;
        },
      });

      tl.to(incomingCols.current, {
        yPercent: 0,
        duration: COL_DURATION,
        stagger:  COL_STAGGER,
        ease:     'power3.inOut',
      });

      tl.to(
        incomingRef.current?.querySelector('.slide-meta') as Element | null,
        { autoAlpha: 1, duration: 0.01 },
        '-=0',
      );

      tl.to(
        currentCols.current,
        {
          yPercent: 100,
          duration: COL_DURATION,
          stagger:  COL_STAGGER,
          ease:     'power3.inOut',
        },
        0,
      );
    };

    const interval = setInterval(
      advance,
      (HOLD_DURATION + COL_DURATION + COL_STAGGER * NUM_COLS) * 1000,
    );
    return () => clearInterval(interval);
  }, { scope: containerRef });

  const renderLayer = (slideIdx: number, colsRef: React.MutableRefObject<(HTMLDivElement | null)[]>, metaVisible: boolean) => {
    const slide = SLIDES[slideIdx];
    const colWidthPct = 100 / NUM_COLS;

    return (
      <div className="absolute inset-0">
        {Array.from({ length: NUM_COLS }).map((_, ci) => (
          <div
            key={ci}
            ref={el => { colsRef.current[ci] = el; }}
            className="absolute top-0 bottom-0 overflow-hidden will-change-transform"
            style={{
              // ── Fix: use left + width with a 1px bleed on the right edge
              // so sub-pixel rounding never leaves a gap between columns.
              left:  `${ci * colWidthPct}%`,
              width: `calc(${colWidthPct}% + 1px)`,
            }}
          >
            {/*
              Inner container: offset leftward by ci columns so the full-width
              image strip is positioned correctly behind this column's window.
              We also subtract ci×1px to account for the 1px bleeds accumulated
              by preceding columns, keeping the image perfectly registered.
            */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left:  `calc(${-ci * 100}% - ${ci}px)`,
                width: `calc(${NUM_COLS * 100}% + ${NUM_COLS}px)`,
              }}
            >
              <Image
                src={slide.src}
                alt={slide.label}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}

        <div
          className="slide-meta absolute bottom-16 left-16 z-20"
          style={{ opacity: metaVisible ? 1 : 0 }}
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-white/60 mb-2">
            {slide.sub}
          </p>
          <h2 className="font-display italic text-6xl md:text-8xl font-light text-white leading-none">
            {slide.label}
          </h2>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <div ref={currentRef} className="absolute inset-0">
        {renderLayer(displayIndices.current, currentCols, true)}
      </div>

      <div ref={incomingRef} className="absolute inset-0 z-[5]">
        {renderLayer(displayIndices.incoming, incomingCols, false)}
      </div>

      <div className="absolute bottom-16 right-16 z-20 flex items-center gap-3">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-500 ${
              i === displayIndices.current
                ? 'w-6 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase">Explore</span>
        <span className="block w-px h-8 bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}