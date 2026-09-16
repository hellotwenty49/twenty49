"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Values", href: "#values" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#fffefa]/90 backdrop-blur-md shadow-[0_2px_20px_rgba(122,0,75,0.12)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex flex-col leading-tight group">
          <span
            className="text-2xl font-bold tracking-widest"
            style={{ color: "#7a004b" }}
          >
            TWENTY49
          </span>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "#9c6080" }}
          >
            Live Well
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-widest uppercase transition-colors duration-300"
              style={{ color: "#4a1030" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#7a004b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#4a1030")
              }
            >
              {link.label}
            </a>
          ))}
          <a
            href="#values"
            className="px-6 py-2.5 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300"
            style={{
              backgroundColor: "#7a004b",
              color: "#fffefa",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#560035";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(122,0,75,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#7a004b";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            style={{ backgroundColor: "#7a004b" }}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            style={{ backgroundColor: "#7a004b" }}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            style={{ backgroundColor: "#7a004b" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden px-6 pb-6 flex flex-col gap-4"
            style={{ backgroundColor: "#fffefa" }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase py-2 border-b"
                style={{ color: "#4a1030", borderColor: "rgba(122,0,75,0.15)" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#values"
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-center px-6 py-3 rounded-full text-sm tracking-widest uppercase font-bold"
              style={{ backgroundColor: "#7a004b", color: "#fffefa" }}
            >
              Get Started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
