"use client";

import { useState, useEffect, useRef } from "react";
import Logo from "./components/Logo";

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
    <div className="bg-cream min-h-[100dvh] flex flex-col">

      {/* ── TOP BAR ── */}
      <header className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 flex flex-col gap-4">
        <div className="flex items-center justify-center py-2">
          <a href="#" aria-label="twenty49 home" className="inline-flex items-center">
            <Logo className="h-[90px] sm:h-[120px]" />
          </a>
        </div>
      </header>

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
          {(["Rentals", "Owners", "Contact"] as const).map((key) => (
            <button
              key={key}
              onClick={() => openModal(key)}
              className={`btn ${key === "Rentals" ? "btn-primary" : "btn-secondary"} min-w-[140px]`}
            >
              {key}
            </button>
          ))}
        </nav>

        {/* Arch illustration */}
        <div
          className="mt-12 sm:mt-16 w-full max-w-[1100px] h-[150px] sm:h-[220px] rounded-[30px] bg-coral relative overflow-hidden"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 600 220"
            preserveAspectRatio="xMidYMax meet"
            className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto max-w-full"
          >
            <path d="M60 220V120a70 70 0 0 1 140 0v100z" fill="#55263D" />
            <path d="M230 220V90a70 70 0 0 1 140 0v130z" fill="#F5E8CC" />
            <path d="M400 220V130a70 70 0 0 1 140 0v90z" fill="#FFAA76" />
            <path d="M100 220v-70a30 30 0 0 1 60 0v70z" fill="#F5E8CC" />
            <path d="M270 220v-100a30 30 0 0 1 60 0v100z" fill="#55263D" />
            <path d="M440 220v-60a30 30 0 0 1 60 0v60z" fill="#55263D" />
          </svg>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="on-dark w-full bg-ink text-cream mt-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo variant="dark" className="h-[72px]" />
          <p className="text-sm tracking-wider text-center text-muted-on-plum">
            © 2026 twenty49
          </p>
        </div>
      </footer>

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
            {modal.category === "Rentals" ? (
              <div className="flex flex-col gap-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-sand p-5 rounded-[22px]">
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
                    <div key={idx} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-plum fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      <span className="text-sm font-semibold text-ink">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://wa.me/919892192473?text=Hi%20twenty49,%20I%20am%20interested%20in%203BHK/4BHK/5BHK%20rental%20properties."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                  <span>Inquire via WhatsApp</span>
                </a>
                </div>
              </div>
            ) : modal.category === "Owners" ? (
              <div className="flex flex-col gap-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-sand p-5 rounded-[22px]">
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
                    <div key={idx} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-plum fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      <span className="text-sm font-semibold text-ink">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://wa.me/919892192473?text=Hi%20twenty49,%20I%20am%20a%20property%20owner%20interested%20in%20twenty49%20management%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 12.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-1.5 0v2.5zm3.75 1.5a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-1.5 0v3.5zm-7.5 0a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-1.5 0v3.5zM7.5 8a2.5 2.5 0 0 1 5 0v1h-5V8zm12.75 4.5c.41 0 .75.34.75.75v5.25a2.5 2.5 0 0 1-2.5 2.5h-13a2.5 2.5 0 0 1-2.5-2.5V13.25c0-.41.34-.75.75-.75h1.75V10a4 4 0 0 1 8 0v2.5h6.75z"/></svg>
                  <span>Partner with twenty49</span>
                </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 text-left">
                <div className="bg-sand p-5 rounded-[22px] flex flex-col gap-3">
                  <div className="border-b border-plum/20 pb-3">
                    <span className="label text-plum">
                      Founder
                    </span>
                    <h4 className="text-xl text-ink mt-1">
                      Shashank Gupta
                    </h4>
                    <p className="text-sm text-plum mt-1">
                      Former Four Seasons, Ritz Carlton, and Marriott
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 text-sm font-semibold text-ink">
                    <a
                      href="mailto:hello.twenty49@gmail.com"
                      className="flex items-center gap-2.5 min-h-[44px] hover:text-plum transition-colors"
                    >
                      <span className="text-plum"><svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></span>
                      <span>hello.twenty49@gmail.com</span>
                    </a>
                    <a
                      href="tel:+919892192473"
                      className="flex items-center gap-2.5 min-h-[44px] hover:text-plum transition-colors"
                    >
                      <span className="text-plum"><svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></span>
                      <span>+91 98921 92473</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-1">
                <a
                  href="https://wa.me/919892192473?text=Hi%20Shashank,%20I%20would%20like%20to%20know%20more%20about%20twenty49."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                  <span>Chat on WhatsApp</span>
                </a>
                  <a
                    href="mailto:hello.twenty49@gmail.com"
                    className="btn btn-secondary"
                  >
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            )}

            {modalSuccess && (
              <p role="status" className="text-sm text-plum font-semibold text-center mt-4">
                ✓ Thank you! The twenty49 concierge will reach out directly.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
