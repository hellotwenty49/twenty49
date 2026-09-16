"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-28 px-6 lg:px-12" style={{ backgroundColor: "#fffefa" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden text-center py-20 px-8"
          style={{
            background: "linear-gradient(135deg, #560035 0%, #7a004b 50%, #9c0060 100%)",
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #fffefa 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Glow blobs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px] opacity-20"
            style={{ backgroundColor: "#e8008a" }} />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-[60px] opacity-20"
            style={{ backgroundColor: "#ff40a0" }} />

          <div className="relative z-10">
            <p
              className="text-xs tracking-[0.3em] uppercase font-semibold mb-4"
              style={{ color: "rgba(255,254,250,0.6)" }}
            >
              Begin Your Journey
            </p>

            <h2
              className="text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ color: "#fffefa" }}
            >
              Ready to Live Well?
            </h2>

            <p
              className="text-base leading-relaxed max-w-xl mx-auto mb-12"
              style={{ color: "rgba(255,254,250,0.8)" }}
            >
              Join thousands of people who have already chosen a life of balance, 
              intention, and vitality. Your wellness journey begins with one step.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300"
              style={{
                backgroundColor: "#fffefa",
                color: "#7a004b",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
              }}
            >
              Start Living Well
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
