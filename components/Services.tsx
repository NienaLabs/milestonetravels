"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./Services.css";

const initialItems = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    author: "MILESTONE TRAVELS",
    title: "FLIGHT BOOKINGS",
    topic: "DOMESTIC & INT.",
    description: "Experience seamless travel planning with our comprehensive flight booking services. We secure the best routes and fares for your global adventures.",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    author: "MILESTONE TRAVELS",
    title: "LUXURY STAYS",
    topic: "HOTELS & RESORTS",
    description: "Relax in unparalleled comfort. We partner with top-tier hotels and exclusive resorts worldwide to guarantee your stay is nothing short of spectacular.",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop",
    author: "MILESTONE TRAVELS",
    title: "GUIDED TOURS",
    topic: "ADVENTURE",
    description: "Dive deep into local cultures with our expertly curated guided tours. From historical landmarks to hidden gems, we bring destinations to life.",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    author: "MILESTONE TRAVELS",
    title: "TRANSPORTATION",
    topic: "TRANSFERS",
    description: "Enjoy smooth transitions from airport to hotel. Our private transfer services ensure you travel safely, comfortably, and always on time.",
  }
];

export default function Services() {
  const [items, setItems] = useState(initialItems);
  const [animatingClass, setAnimatingClass] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = () => {
    setAnimatingClass("next");
    
    setItems((prev) => {
      const newItems = [...prev];
      const first = newItems.shift();
      if (first) newItems.push(first);
      return newItems;
    });
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAnimatingClass("");
    }, 3000); // corresponds to timeRunning in CSS
  };

  const handlePrev = () => {
    setAnimatingClass("prev");
    
    setItems((prev) => {
      const newItems = [...prev];
      const last = newItems.pop();
      if (last) newItems.unshift(last);
      return newItems;
    });
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAnimatingClass("");
    }, 3000);
  };

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 7000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  });

  // In the original JS, the thumbnail list offsets the first item to the end
  const thumbnailItems = [...items.slice(1), items[0]];

  return (
    <section id="services" className={`services-carousel ${animatingClass}`}>
      <div className="list">
        {items.map((item) => (
          <div key={item.id} className="item">
            <Image src={item.img} alt={item.title} width={1920} height={1080} className="w-full h-full object-cover" priority={item.id === 1} />
            <div className="content">
              <div className="author">OUR SERVICES</div>
              <div className="title">{item.title}</div>
              <div className="topic">{item.topic}</div>
              <div className="des">{item.description}</div>
              <div className="buttons">
                <button>SEE MORE</button>
                <button>BOOK NOW</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="thumbnail">
        {thumbnailItems.map((item) => (
          <div key={`thumb-${item.id}`} className="item">
            <Image src={item.img} alt={item.title} width={300} height={440} className="w-full h-full object-cover rounded-[20px]" />
            <div className="content">
              <div className="title">{item.title}</div>
              <div className="description">{item.topic}</div>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="arrows"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <button id="prev" onClick={handlePrev}>{"<"}</button>
        <button id="next" onClick={handleNext}>{">"}</button>
      </div>
    </section>
  );
}
