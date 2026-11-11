"use client";

import { useState, useEffect, useRef } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Arches from "./components/Arches";

const headlines = [
  "Find your people. Skip the broker.",
  "Someone moved out? Fill the room by Friday.",
  "Rooms come and go. Flatmates fit.",
];

type ModalData = {
  category: string;
  title: string;
  desc: string;
};

const modalContent: Record<string, ModalData> = {
  "Create account": {
    category: "Create account",
    title: "Join twenty49.",
    desc: "Set up your account to find rooms and flatmates.",
  },
  "Sign in": {
    category: "Sign in",
    title: "Welcome back.",
    desc: "Sign in to pick up where you left off.",
  },
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
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

  const openModal = (key: string) => {
    setModal(modalContent[key]);
    setModalSuccess(false);
  };

  const closeModal = () => setModal(null);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess(true);
    setTimeout(() => closeModal(), 1800);
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

        {/* Buttons */}
        <nav aria-label="Primary" className="flex items-center justify-center flex-wrap gap-3 sm:gap-4">
          {(["Create account", "Sign in"] as const).map((key) => (
            <button
              key={key}
              onClick={() => openModal(key)}
              className={`btn ${key === "Create account" ? "btn-primary" : "btn-secondary"} min-w-[170px]`}
            >
              {key}
            </button>
          ))}
        </nav>

        {/* Arch illustration */}
        <Arches className="mt-12 sm:mt-16 max-w-[1100px] h-[150px] sm:h-[220px]" />
      </main>

      <SiteFooter />

      {/* ── MODAL ── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Sheet slides up on mobile, centered card on desktop */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={modal.title}
            className="bg-paper w-full sm:max-w-md sm:rounded-[28px] rounded-t-[28px] p-6 sm:p-8 shadow-float relative max-h-[92dvh] overflow-y-auto"
          >

            {/* Close */}
            <button
              aria-label="Close modal"
              onClick={closeModal}
              className="absolute top-3 right-3 text-plum hover:bg-sand rounded-full transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>

            {/* Handle bar on mobile */}
            <div className="sm:hidden w-10 h-1 rounded-full bg-sand mx-auto mb-5" aria-hidden="true" />

            {/* Header */}
            <div className="flex flex-col gap-2 mb-5 text-left pr-10">
              <span className="label text-plum">
                {modal.category}
              </span>
              <h3 className="text-[26px] text-ink">
                {modal.title}
              </h3>
              <p className="text-base text-plum leading-relaxed mt-0.5">
                {modal.desc}
              </p>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleModalSubmit} className="flex flex-col gap-4 text-left">
              {modal.category === "Create account" && (
                <label className="flex flex-col gap-1.5">
                  <span className="label text-plum">Name</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    className="input"
                  />
                </label>
              )}
              <label className="flex flex-col gap-1.5">
                <span className="label text-plum">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="input"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="label text-plum">Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete={
                    modal.category === "Create account"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  minLength={8}
                  className="input"
                />
              </label>
              <button type="submit" className="btn btn-primary w-full mt-1">
                {modal.category}
              </button>
            </form>

            {modalSuccess && (
              <p role="status" className="text-sm text-plum font-semibold text-center mt-4">
                ✓ Thanks! Accounts aren&apos;t live yet. We&apos;ll be in touch when they open.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
