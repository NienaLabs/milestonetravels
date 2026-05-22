"use client";
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function FlightPath() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const [svgHeight, setSvgHeight] = useState(1000);

  useEffect(() => {
    const updateHeight = () => {
      setSvgHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useGSAP(() => {
    if (window.innerWidth < 1024) return;
    
    if (pathRef.current && planeRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        }
      });

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const point = path.getPointAtLength(self.progress * length);
          const nextPoint = path.getPointAtLength(Math.min((self.progress + 0.001) * length, length));
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
          
          gsap.set(planeRef.current, {
            x: point.x,
            y: point.y,
            rotation: angle,
            transformOrigin: "center center"
          });
        }
      });
    }
  }, { dependencies: [svgHeight] });

  // Generate a dynamic path based on height
  const pathD = `M 60 0 C 120 ${svgHeight * 0.2} 0 ${svgHeight * 0.4} 60 ${svgHeight * 0.5} C 120 ${svgHeight * 0.6} 0 ${svgHeight * 0.8} 60 ${svgHeight}`;

  return (
    <div className="fixed top-0 right-[5vw] w-[120px] h-full pointer-events-none z-40 hidden lg:block">
      <svg 
        ref={svgRef}
        width="120"
        height={svgHeight}
        viewBox={`0 0 120 ${svgHeight}`}
        style={{ filter: 'drop-shadow(0 0 5px rgba(59, 111, 232, 0.7))' }}
      >
        <path 
          ref={pathRef}
          d={pathD}
          stroke="var(--navy-sky)" 
          strokeWidth="2" 
          strokeDasharray="8 6" 
          fill="none" 
        />
        <g ref={planeRef}>
          {/* We translate -12,-12 inside the G so the center of the plane is at the path point */}
          <g transform="translate(-12, -12)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white-pure fill-white-pure drop-shadow-md">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8l6.4 3.9L7 16l-3.2-.7L2 17l4.1 4.1L10 18l4.1 1.9 1.8-1.8-.7-3.2 4.1-1.9 3.9 6.4c.4-.2.7-.6.6-1.1z" />
            </svg>
          </g>
        </g>
      </svg>
    </div>
  );
}
