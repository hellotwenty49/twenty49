"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Arches from "./Arches";

const links = [
  { href: "/mission", label: "Mission" },
  { href: "/contact", label: "Contact" },
];

/** Frosted-glass pill used for the desktop menu items. */
const glass =
  "inline-flex items-center min-h-[48px] px-6 rounded-full text-base font-bold text-plum bg-paper/70 backdrop-blur-lg border border-white/60 hover:bg-paper/90 transition-colors";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Close on Escape and stop the page scrolling behind the open menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 grid grid-cols-[44px_1fr_44px] sm:grid-cols-[1fr_auto_1fr] items-center sm:gap-6">
        {/* Mobile: left spacer keeps the logo centred */}
        <span className="sm:hidden" aria-hidden="true" />

        <Link
          href="/"
          aria-label="twenty49 home"
          className="inline-flex items-center justify-center sm:col-start-2 sm:row-start-1"
        >
          <Logo className="h-[76px] sm:h-[130px]" />
        </Link>

        {/* Mobile: burger button */}
        <button
          type="button"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="sm:hidden h-11 w-11 rounded-full bg-sand text-plum flex items-center justify-center"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Desktop: glass menu items either side of the logo */}
        <nav aria-label="Site" className="hidden sm:contents">
          <Link
            href="/mission"
            className={`${glass} sm:col-start-1 sm:row-start-1 sm:justify-self-start`}
          >
            Mission
          </Link>
          <div className="sm:col-start-3 sm:row-start-1 sm:justify-self-end flex items-center gap-3">
            <Link href="/contact" className={glass}>
              Contact
            </Link>
            <Link
              href="/login"
              className="btn btn-primary !min-h-[48px] !px-6 !rounded-full"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile: full-screen menu */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-dark sm:hidden fixed inset-0 z-50 bg-plum text-cream flex flex-col px-4 pt-4 pb-6 overflow-y-auto"
        >
          <div className="grid grid-cols-[44px_1fr_44px] items-center">
            <span aria-hidden="true" />
            <Link
              href="/"
              aria-label="twenty49 home"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center"
            >
              <Logo variant="dark" className="h-[76px]" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              autoFocus
              className="h-11 w-11 rounded-full bg-cream text-plum flex items-center justify-center"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Site" className="mt-10 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between min-h-[84px] border-b border-cream/20 font-display text-[44px] font-extrabold text-cream"
              >
                {l.label}
                <svg
                  className="w-8 h-8 text-coral"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </nav>

          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="btn btn-primary w-full mt-8 !min-h-[56px] text-lg"
          >
            Get started, it&apos;s free
          </Link>

          <Arches className="mt-auto pt-0 h-[120px] shrink-0" />
        </div>
      )}
    </>
  );
}
