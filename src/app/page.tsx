"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Arches from "./components/Arches";

const headlines = [
  "Find your people. Skip the broker.",
  "Someone moved out? Fill the room by Friday.",
  "Rooms come and go. Flatmates fit.",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToHeadline = (index: number) => {
    if (index === currentIndex) return;
    setFading(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setFading(false);
    }, 300);
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
        setFading(false);
      }, 300);
    }, 1500);
  };

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDotClick = (index: number) => {
    goToHeadline(index);
    resetInterval();
  };

  return (
    <div className="bg-cream min-h-[100dvh] flex flex-col">

      <SiteHeader />

      {/* ── HERO ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 text-center max-w-[1200px] mx-auto w-full">

        {/* Rotating Headline */}
        <div className="flex items-center justify-center w-full">
          <h1
            className={`headline-fade text-[clamp(42px,6vw,80px)] min-h-[4.3em] sm:min-h-[3.2em] flex items-center justify-center text-ink max-w-4xl${fading ? " opacity-0" : ""}`}
          >
            {headlines[currentIndex]}
          </h1>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center mt-2 mb-10 sm:mb-12" role="group" aria-label="Headlines">
          {headlines.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === currentIndex}
              onClick={() => handleDotClick(i)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <span
                className="block h-2 rounded-full transition-all duration-500"
                style={{
                  width: i === currentIndex ? "32px" : "10px",
                  backgroundColor: i === currentIndex ? "var(--plum)" : "var(--sand)",
                  boxShadow: i === currentIndex ? "none" : "inset 0 0 0 1.5px var(--plum)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Get started */}
        <Link href="/login" className="btn btn-primary min-w-[200px]">
          Get started, it&apos;s free
        </Link>
        <p className="mt-4 text-base font-semibold text-plum">
          No fees. No brokerage.
        </p>

        {/* Arch illustration */}
        <Arches className="mt-12 sm:mt-16 max-w-[1100px] h-[150px] sm:h-[220px]" />
      </main>

      <SiteFooter />

    </div>
  );
}
