import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import HomeDashboard from "./HomeDashboard";

export const metadata: Metadata = {
  title: "Your matches",
  description: "Rooms that fit what you're looking for.",
  robots: { index: false },
};

export default function HomePage() {
  return (
    <div className="bg-cream min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20">
        <HomeDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
