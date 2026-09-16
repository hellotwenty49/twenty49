"use client";

import { useState, useEffect, useRef } from "react";

const headlines = [
  "Curated rental living for modern professionals.",
  "Zero brokerage. Vetted flatmates. Designer rooms.",
  "One stop solution for your room rental needs.",
];

type ModalData = {
  category: string;
  title: string;
  desc: string;
};

const modalContent: Record<string, ModalData> = {
  Rentals: {
    category: "Rentals",
    title: "Live Well. We Handle the Rest.",
    desc: "3BHK, 4BHK, and 5BHK properties",
  },
  Owners: {
    category: "Owners",
    title: "Your Property. Our Responsibility.",
    desc: "3BHK, 4BHK, and 5BHK properties",
  },
  Contact: {
    category: "Contact",
    title: "Direct Concierge Desk",
    desc: "Need immediate relocation advice or soft launch inquiries? Reach out directly to our Gurugram executive concierge desk.",
  },
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalContact, setModalContact] = useState("");
  const [modalNote, setModalNote] = useState("");
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
    }, 4200);
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
    setModalName("");
    setModalContact("");
    setModalNote("");
  };

  const closeModal = () => setModal(null);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess(true);
    setTimeout(() => closeModal(), 1800);
  };

  return (
    <div className="bg-[#FAF5EE] min-h-[100dvh] flex flex-col">

      {/* ── TOP BAR ── */}
      <header className="w-full max-w-7xl mx-auto px-5 sm:px-10 pt-6 sm:pt-6">
        {/* Mobile: stacked — badge top, logo center */}
        {/* Desktop: single row with flex */}

        {/* Row 1 on mobile: badge + location side by side */}
        <div className="flex items-center justify-between sm:hidden mb-2 pt-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#7a004b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7a004b] animate-pulse shrink-0" />
            Launching Soon
          </span>
          <div className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-semibold text-neutral-600">
            <svg className="w-3.5 h-3.5 text-[#7a004b] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Gurugram
          </div>
        </div>

        {/* Logo — full width centred on mobile, inline on desktop */}
        <div className="flex items-center justify-center sm:hidden py-2">
          <a href="#">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="twenty49 - Live Well"
              className="w-auto object-contain max-w-[85vw]"
              style={{ height: "140px" }}
            />
          </a>
        </div>

        {/* Desktop: single row */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex-1 flex items-center justify-start">
            <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] font-semibold text-[#7a004b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a004b] animate-pulse" />
              Launching Soon
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center">
            <a href="#">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="twenty49 - Live Well"
                className="w-auto object-contain"
                style={{ height: "150px", maxHeight: "160px" }}
              />
            </a>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <div className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em] font-semibold text-neutral-600 hover:text-[#7a004b] transition-colors cursor-default">
              <svg className="w-3.5 h-3.5 text-[#7a004b] fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>Gurugram</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-2 sm:py-4 mt-2 sm:mt-4 text-center max-w-4xl mx-auto w-full">

        {/* Rotating Headline */}
        <div className="min-h-[100px] sm:min-h-[110px] flex items-center justify-center w-full mb-1">
          <h1
            className={`headline-fade text-[2rem] sm:text-4xl md:text-5xl lg:text-[54px] font-normal leading-[1.2] sm:leading-[1.25] tracking-tight text-[#24181f] max-w-3xl${fading ? " opacity-0" : ""}`}
          >
            {headlines[currentIndex]}
          </h1>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mt-4 sm:mt-6 mb-20 sm:mb-16">
          {headlines.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => handleDotClick(i)}
              className="h-1 rounded-full transition-all duration-500 cursor-pointer"
              style={{
                width: i === currentIndex ? "32px" : "10px",
                backgroundColor: i === currentIndex ? "#7a004b" : "rgba(122,0,75,0.25)",
                minWidth: "10px",
                minHeight: "16px", // larger tap target
              }}
            />
          ))}
        </div>

        {/* Pill Buttons */}
        <nav className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 text-sm font-semibold tracking-wide mt-6 sm:mt-0">
          {(["Rentals", "Owners", "Contact"] as const).map((key) => (
            <button
              key={key}
              onClick={() => openModal(key)}
              className="px-6 py-3 rounded-full border border-[#7a004b]/20 hover:border-[#7a004b] text-[#7a004b] bg-white/60 hover:bg-[#7a004b] hover:text-[#fffefa] active:scale-[0.97] transition-all duration-200 min-h-[44px]"
            >
              {key}
            </button>
          ))}
        </nav>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-10 pb-6 sm:pb-10 flex items-center justify-center text-xs text-neutral-500">
        <div className="tracking-wider text-center">
          © 2026 twenty49
        </div>
      </footer>

      {/* ── MODAL ── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Sheet slides up on mobile, centered card on desktop */}
          <div className="bg-[#fffefa] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 sm:p-8 shadow-2xl border border-[#7a004b]/15 relative max-h-[92dvh] overflow-y-auto">

            {/* Close */}
            <button
              aria-label="Close modal"
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-[#7a004b] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>

            {/* Handle bar on mobile */}
            <div className="sm:hidden w-10 h-1 rounded-full bg-neutral-200 mx-auto mb-5" />

            {/* Header */}
            <div className="flex flex-col gap-2 mb-5 text-left pr-8">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#7a004b]">
                {modal.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-normal text-[#24181f] leading-snug">
                {modal.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mt-0.5">
                {modal.desc}
              </p>
            </div>

            {/* Modal Content */}
            {modal.category === "Rentals" ? (
              <div className="flex flex-col gap-5 text-left">
                {/* Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#FAF5EE] p-4 rounded-xl border border-[#7a004b]/10">
                  {[
                    "Fully Furnished",
                    "High-Speed Wi-Fi",
                    "Maintenance Included",
                    "Fitness & Lifestyle Spaces",
                    "Community of Professionals",
                    "24/7 Resident Support",
                    "No Brokerage",
                    "Resident-Friendly Policies",
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#7a004b] fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-xs font-medium text-[#24181f]">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp inquiry button */}
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="https://wa.me/919892192473?text=Hi%20twenty49,%20I%20am%20interested%20in%203BHK/4BHK/5BHK%20rental%20properties."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-full bg-[#7a004b] hover:bg-[#60003b] active:scale-[0.98] text-[#fffefa] text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm min-h-[44px] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : modal.category === "Owners" ? (
              <div className="flex flex-col gap-5 text-left">
                {/* Owners Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#FAF5EE] p-4 rounded-xl border border-[#7a004b]/10">
                  {[
                    "End-to-End Property Management",
                    "Tenant Sourcing & Screening",
                    "Reliable Rent Collection",
                    "Maintenance & Upkeep",
                    "Transparent Reporting",
                    "Dedicated Property Support",
                    "Occupancy Management",
                    "Professional Property Standards",
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#7a004b] fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-xs font-medium text-[#24181f]">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp partner button */}
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="https://wa.me/919892192473?text=Hi%20twenty49,%20I%20am%20a%20property%20owner%20interested%20in%20twenty49%20management%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-full bg-[#7a004b] hover:bg-[#60003b] active:scale-[0.98] text-[#fffefa] text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm min-h-[44px] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M11 12.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-1.5 0v2.5zm3.75 1.5a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-1.5 0v3.5zm-7.5 0a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-1.5 0v3.5zM7.5 8a2.5 2.5 0 0 1 5 0v1h-5V8zm12.75 4.5c.41 0 .75.34.75.75v5.25a2.5 2.5 0 0 1-2.5 2.5h-13a2.5 2.5 0 0 1-2.5-2.5V13.25c0-.41.34-.75.75-.75h1.75V10a4 4 0 0 1 8 0v2.5h6.75z"/>
                    </svg>
                    <span>Partner with twenty49</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 text-left">
                {/* Leadership & Direct Contacts Card */}
                <div className="bg-[#FAF5EE] p-4 rounded-xl border border-[#7a004b]/10 flex flex-col gap-3">
                  <div className="border-b border-[#7a004b]/10 pb-2.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#7a004b]">
                      Founder
                    </span>
                    <h4 className="text-sm font-semibold text-[#24181f] mt-0.5">
                      Shashank Gupta
                    </h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Former Four Seasons, Ritz Carlton, and Marriott
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-0.5 text-xs text-neutral-700">
                    <a
                      href="mailto:hello.twenty49@gmail.com"
                      className="flex items-center gap-2 hover:text-[#7a004b] transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#7a004b] fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span>hello.twenty49@gmail.com</span>
                    </a>
                    <a
                      href="tel:+919892192473"
                      className="flex items-center gap-2 hover:text-[#7a004b] transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#7a004b] fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      <span>+91 98921 92473</span>
                    </a>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="flex items-center gap-2.5 pt-1">
                  <a
                    href="https://wa.me/919892192473?text=Hi%20Shashank,%20I%20would%20like%20to%20know%20more%20about%20twenty49."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-full bg-[#7a004b] hover:bg-[#60003b] active:scale-[0.98] text-[#fffefa] text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm min-h-[44px] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a
                    href="mailto:hello.twenty49@gmail.com"
                    className="px-4 py-3.5 rounded-full border border-[#7a004b]/30 text-[#7a004b] hover:bg-[#7a004b]/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px] flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4 text-[#7a004b] fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            )}

            {modalSuccess && (
              <p className="text-xs text-[#7a004b] font-medium text-center mt-3">
                ✓ Thank you! The twenty49 concierge will reach out directly.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
