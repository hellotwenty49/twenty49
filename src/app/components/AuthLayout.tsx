import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

/**
 * Shared page shell for the log-in and sign-up flows.
 * Mobile and tablet: the form on its own. Desktop (lg+): form on the left,
 * a tall illustration panel on the right that stays in view while scrolling.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:items-start">
        <div className="flex justify-center lg:justify-start">{children}</div>

        <aside
          className="hidden lg:flex flex-col justify-between relative overflow-hidden rounded-[30px] bg-coral lg:sticky lg:top-8 h-[calc(100dvh-14rem)] min-h-[480px] max-h-[600px]"
        >
          <p className="relative z-10 p-10 font-display text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink max-w-[14ch]">
            Find your people. Skip the broker.
          </p>
          <svg
            viewBox="0 0 360 400"
            preserveAspectRatio="xMidYMax meet"
            className="absolute inset-x-0 bottom-0 mx-auto h-[68%] w-auto max-w-full"
            aria-hidden="true"
          >
            <path d="M20 400V220a50 50 0 0 1 100 0v180z" fill="#55263D" />
            <path d="M130 400V130a50 50 0 0 1 100 0v270z" fill="#F5E8CC" />
            <path d="M240 400V250a50 50 0 0 1 100 0v150z" fill="#FFAA76" />
            <path d="M48 400v-100a22 22 0 0 1 44 0v100z" fill="#F5E8CC" />
            <path d="M158 400V240a22 22 0 0 1 44 0v160z" fill="#55263D" />
            <path d="M268 400v-90a22 22 0 0 1 44 0v90z" fill="#55263D" />
          </svg>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
