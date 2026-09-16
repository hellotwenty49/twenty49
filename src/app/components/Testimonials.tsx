"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "Twenty49 completely changed how I think about my daily routines. I feel more energised, focused, and genuinely happy with the choices I make every day.",
    name: "Priya Mehta",
    role: "Yoga Instructor & Wellness Coach",
    initials: "PM",
  },
  {
    quote:
      "I was sceptical at first, but the principles at the core of Twenty49 are so grounded and practical. It's not another fad — it's a real lifestyle shift.",
    name: "Arjun Sharma",
    role: "Entrepreneur & Fitness Enthusiast",
    initials: "AS",
  },
  {
    quote:
      "What I love most is the community. Surrounded by people who are all on this journey of living well — it keeps me motivated and accountable.",
    name: "Kavita Nair",
    role: "Nutritionist & Author",
    initials: "KN",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="testimonials"
      className="py-28 px-6 lg:px-12"
      style={{ backgroundColor: "#fffefa" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-4"
            style={{ color: "#7a004b" }}
          >
            Voices from Our Community
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "#1a0011" }}
          >
            Real stories.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7a004b 0%, #c4006e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Real results.
            </span>
          </motion.h2>
        </div>

        {/* Testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative rounded-3xl p-10 md:p-14 mb-10 border"
          style={{
            backgroundColor: "#fffefa",
            borderColor: "rgba(122,0,75,0.12)",
            boxShadow: "0 20px 60px rgba(122,0,75,0.08)",
          }}
        >
          {/* Quote mark */}
          <span
            className="absolute top-8 left-10 text-8xl font-bold leading-none opacity-10 select-none"
            style={{ color: "#7a004b" }}
          >
            "
          </span>

          <motion.p
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative text-lg md:text-xl leading-relaxed mb-10 text-center"
            style={{ color: "#3a1020" }}
          >
            "{testimonials[active].quote}"
          </motion.p>

          <motion.div
            key={`name-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-2"
              style={{ backgroundColor: "#7a004b", color: "#fffefa" }}
            >
              {testimonials[active].initials}
            </div>
            <p className="font-bold text-sm tracking-wide" style={{ color: "#1a0011" }}>
              {testimonials[active].name}
            </p>
            <p className="text-xs tracking-wider" style={{ color: "#9c6080" }}>
              {testimonials[active].role}
            </p>
          </motion.div>
        </motion.div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View testimonial ${i + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{
                width: active === i ? "32px" : "8px",
                height: "8px",
                backgroundColor: active === i ? "#7a004b" : "rgba(122,0,75,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
