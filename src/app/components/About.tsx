"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "10K+", label: "Lives Transformed" },
  { value: "98%", label: "Member Satisfaction" },
  { value: "50+", label: "Expert Contributors" },
  { value: "4.9★", label: "Average Rating" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="about"
      className="py-28 px-6 lg:px-12 relative overflow-hidden"
      style={{ backgroundColor: "#7a004b" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ backgroundColor: "#fffefa" }} />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10"
        style={{ backgroundColor: "#fffefa" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.p
              ref={ref}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs tracking-[0.3em] uppercase font-semibold mb-4"
              style={{ color: "rgba(255,254,250,0.65)" }}
            >
              Who We Are
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-8"
              style={{ color: "#fffefa" }}
            >
              Built for those who choose to{" "}
              <span style={{ color: "rgba(255,200,230,0.95)" }}>
                live fully
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base leading-relaxed mb-6"
              style={{ color: "rgba(255,254,250,0.8)" }}
            >
              Twenty49 was born from a simple belief: that everyone deserves to live 
              a life brimming with health, happiness, and purpose. We're not just a 
              wellness platform — we're a philosophy, a practice, and a community.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base leading-relaxed"
              style={{ color: "rgba(255,254,250,0.8)" }}
            >
              Our name reflects something profound — every year has 49 weeks of 
              possibility after the holiday rush. We're here to make every single 
              one of them count.
            </motion.p>
          </div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.12 }}
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: "rgba(255,254,250,0.1)" }}
              >
                <p
                  className="text-4xl font-bold mb-2"
                  style={{ color: "#fffefa" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "rgba(255,254,250,0.65)" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
