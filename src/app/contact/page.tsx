import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the twenty49 team by email or phone.",
};

const contacts = [
  {
    label: "Email",
    value: "hello.twenty49@gmail.com",
    href: "mailto:hello.twenty49@gmail.com",
    tint: "bg-apricot",
    icon: (
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    ),
  },
  {
    label: "Phone",
    value: "+91 98921 92473",
    href: "tel:+919892192473",
    tint: "bg-lavender",
    icon: (
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="bg-cream min-h-[100dvh] flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <section className="pt-12 sm:pt-20 pb-10 sm:pb-14 max-w-3xl">
          <p className="label text-plum mb-4">Contact</p>
          <h1 className="text-[clamp(42px,6vw,80px)] text-ink">Say hello.</h1>
          <p className="mt-6 text-lg sm:text-xl text-plum max-w-2xl">
            Questions, ideas, or want to work with us? Reach out and we will
            get back to you.
          </p>
        </section>

        <section className="pb-12 sm:pb-[88px] grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="bg-paper rounded-[24px] p-5 sm:p-8 flex items-center gap-4 sm:gap-5 hover:bg-sand transition-colors"
            >
              <span
                className={`${c.tint} shrink-0 h-14 w-14 rounded-full flex items-center justify-center text-ink`}
                aria-hidden="true"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  {c.icon}
                </svg>
              </span>
              <span className="flex flex-col gap-1 min-w-0">
                <span className="label text-plum">{c.label}</span>
                <span className="font-display text-[17px] min-[420px]:text-[21px] sm:text-[26px] font-extrabold text-ink [overflow-wrap:anywhere]">
                  {c.value}
                </span>
              </span>
            </a>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
