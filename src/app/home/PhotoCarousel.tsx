"use client";

import { useRef, useState } from "react";
import { photoUrl } from "../lib/supabase";

/** Swipeable photo strip. Arrow buttons and dots help on desktop. */
export default function PhotoCarousel({ photos, label }: { photos: string[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (to: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(photos.length - 1, to));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[20px] bg-sand text-plum text-sm font-semibold">
        No photos yet
      </div>
    );
  }

  const arrow =
    "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center text-cream sm:flex focus-visible:outline-[3px] focus-visible:outline-coral focus-visible:outline-offset-2 rounded-full";
  const disc = "flex h-8 w-8 items-center justify-center rounded-full bg-ink/65";

  return (
    <div className="group relative overflow-hidden rounded-[20px] bg-sand">
      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${label} photos`}
      >
        {photos.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p}
            src={photoUrl(p)}
            alt={`${label}, photo ${i + 1} of ${photos.length}`}
            loading={i === 0 ? "eager" : "lazy"}
            className="h-full w-full shrink-0 snap-center object-cover"
            draggable={false}
          />
        ))}
      </div>

      {photos.length > 1 && (
        <>
          {index > 0 && (
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className={`${arrow} left-1`}>
              <span className={disc}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </span>
            </button>
          )}
          {index < photos.length - 1 && (
            <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className={`${arrow} right-1`}>
              <span className={disc}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          )}
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5" aria-hidden="true">
            {photos.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/60"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
