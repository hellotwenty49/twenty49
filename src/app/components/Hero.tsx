"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#fffefa" }}
    >
      {/* Background decorative orbs */}
      <div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ backgroundColor: "#7a004b" }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 pointer-events-none"
        style={{ backgroundColor: "#c4006e" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(122,0,75,1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(122,0,75,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center pt-32 pb-20">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10 border"
          style={{
            borderColor: "rgba(122,0,75,0.2)",
            backgroundColor: "rgba(122,0,75,0.05)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#7a004b" }}
          />
          <span
            className="text-xs tracking-[0.25em] uppercase font-semibold"
            style={{ color: "#7a004b" }}
          >
            Your wellness journey starts here
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
          style={{ color: "#1a0011" }}
        >
          Live Well.{" "}
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #7a004b 0%, #c4006e 60%, #e8008a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Every Day.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-14"
          style={{ color: "#6a3050" }}
        >
          Twenty49 is your trusted companion for a balanced, intentional life — 
          combining modern wellness insights with timeless principles to help you 
          thrive in mind, body, and spirit.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#values"
            className="group px-10 py-4 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300 inline-flex items-center gap-3"
            style={{
              backgroundColor: "#7a004b",
              color: "#fffefa",
              boxShadow: "0 4px 24px rgba(122,0,75,0.35)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "#560035";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 32px rgba(122,0,75,0.5)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "#7a004b";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 24px rgba(122,0,75,0.35)";
            }}
          >
            Discover Twenty49
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          <a
            href="#about"
            className="px-10 py-4 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300 border-2"
            style={{
              borderColor: "#7a004b",
              color: "#7a004b",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "rgba(122,0,75,0.06)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "transparent";
              el.style.transform = "translateY(0)";
            }}
          >
            Learn More
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 flex flex-col items-center gap-2"
        >
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "#9c6080" }}
          >
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(122,0,75,0.3)" }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{ backgroundColor: "#7a004b" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
