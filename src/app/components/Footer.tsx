"use client";

export default function Footer() {
  return (
    <footer
      className="py-10 px-6 lg:px-12 border-t"
      style={{
        backgroundColor: "#fffefa",
        borderColor: "rgba(122,0,75,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start leading-tight">
          <span
            className="text-xl font-bold tracking-widest"
            style={{ color: "#7a004b" }}
          >
            TWENTY49
          </span>
          <span
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "#9c6080" }}
          >
            Live Well
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          {["About", "Values", "Testimonials"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs tracking-widest uppercase transition-colors duration-200"
              style={{ color: "#9c6080" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#7a004b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#9c6080")
              }
            >
              {item}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p
          className="text-xs text-center md:text-right"
          style={{ color: "#9c6080" }}
        >
          © {new Date().getFullYear()} Twenty49. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
