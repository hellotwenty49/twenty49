"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const pillars = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Mind & Body",
    description:
      "We believe true wellness is holistic. Nurture your mental clarity and physical vitality together — because one cannot thrive without the other.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.95 5.05l.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
      </svg>
    ),
    title: "Intentional Living",
    description:
      "Every choice shapes your story. We help you build routines and mindsets rooted in purpose — so your daily life reflects your deepest values.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Community & Growth",
    description:
      "Wellness flourishes in connection. Join a community of like-minded individuals walking the path of growth, accountability, and mutual support.",
  },
];

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className="group relative p-8 rounded-2xl border transition-all duration-500 cursor-default"
      style={{
        borderColor: "rgba(122,0,75,0.12)",
        backgroundColor: "#fffefa",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(122,0,75,0.4)";
        el.style.backgroundColor = "rgba(122,0,75,0.03)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 20px 60px rgba(122,0,75,0.12)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(122,0,75,0.12)";
        el.style.backgroundColor = "#fffefa";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"
        style={{
          backgroundColor: "rgba(122,0,75,0.08)",
          color: "#7a004b",
        }}
      >
        {pillar.icon}
      </div>

      {/* Title */}
      <h3
        className="text-xl font-bold mb-3 tracking-wide"
        style={{ color: "#1a0011" }}
      >
        {pillar.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "#6a3050" }}
      >
        {pillar.description}
      </p>

      {/* Hover accent bar */}
      <div
        className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: "linear-gradient(90deg, #7a004b, #c4006e)",
        }}
      />
    </motion.div>
  );
}

export default function Values() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="values" className="py-28 px-6 lg:px-12" style={{ backgroundColor: "#fffefa" }}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-4"
            style={{ color: "#7a004b" }}
          >
            Our Pillars
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold leading-tight mb-6"
            style={{ color: "#1a0011" }}
          >
            Wellness is a{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7a004b 0%, #c4006e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              way of life
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base leading-relaxed"
            style={{ color: "#6a3050" }}
          >
            At Twenty49, we've built our foundation on three core pillars that guide 
            everything we do — helping you unlock a life that's healthy, meaningful, and joyful.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
