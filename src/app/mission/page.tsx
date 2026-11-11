import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Arches from "../components/Arches";

export const metadata: Metadata = {
  title: "Our mission",
  description:
    "Finding a room in a big city is hard. twenty49 exists to make moving to a new city easier, warmer and a lot less stressful.",
};

const beliefs = [
  {
    title: "Home comes first",
    body: "A good place to live turns a strange city into yours. Everything else gets easier from there.",
    tint: "bg-apricot",
  },
  {
    title: "People over listings",
    body: "The right flatmate matters as much as the right room. We match on how you live, not just what you can afford.",
    tint: "bg-lavender",
  },
  {
    title: "No middlemen, no surprises",
    body: "No brokers and no brokerage fees. Straight answers, and a quick replacement when a flatmate moves out.",
    tint: "bg-sand",
  },
];

export default function MissionPage() {
  return (
    <div className="bg-cream min-h-[100dvh] flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Intro */}
        <section className="pt-12 sm:pt-20 pb-12 sm:pb-[88px] max-w-4xl">
          <p className="label text-plum mb-4">Our mission</p>
          <h1 className="text-[clamp(42px,6vw,80px)] text-ink">
            Moving to a big city shouldn&apos;t feel like starting from scratch.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-plum max-w-2xl">
            Finding a room in a new city is hard. Endless listings, brokers who
            vanish after the fee, flatmates you have never met, and a deadline
            that won&apos;t wait. Most of us have been there, and it is no way
            to begin a new chapter.
          </p>
          <p className="mt-4 text-lg sm:text-xl text-plum max-w-2xl">
            We started twenty49 to change that. Our mission is simple: make
            life easier for everyone moving into a big city, so that the
            hardest part of the move is saying goodbye to the old place.
          </p>
        </section>

        {/* Beliefs */}
        <section className="pb-12 sm:pb-[88px]" aria-labelledby="beliefs">
          <h2
            id="beliefs"
            className="text-[clamp(34px,4.4vw,56px)] text-ink mb-8 sm:mb-10"
          >
            What we believe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {beliefs.map((b) => (
              <article
                key={b.title}
                className="bg-paper rounded-[24px] p-6 sm:p-8 flex flex-col gap-4"
              >
                <span
                  className={`${b.tint} block h-3 w-14 rounded-full`}
                  aria-hidden="true"
                />
                <h3 className="text-[26px] text-ink">{b.title}</h3>
                <p className="text-base sm:text-lg text-plum">{b.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="pb-12 sm:pb-[88px]">
          <div className="bg-plum rounded-[30px] px-6 py-10 sm:p-14 text-cream flex flex-col gap-6 items-start">
            <h2 className="text-[clamp(34px,4.4vw,56px)] text-cream max-w-3xl">
              A new city is easier when someone has your back.
            </h2>
            <p className="text-lg text-muted-on-plum max-w-2xl">
              Questions, ideas, or just want to say hello? We would love to
              hear from you.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Get in touch
            </Link>
          </div>
          <Arches className="mt-6 h-[130px] sm:h-[180px]" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
