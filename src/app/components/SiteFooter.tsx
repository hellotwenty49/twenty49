import Link from "next/link";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="on-dark w-full bg-ink text-cream mt-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" aria-label="twenty49 home">
          <Logo variant="dark" className="h-[72px]" />
        </Link>
        <nav aria-label="Footer" className="flex items-center gap-2">
          <Link
            href="/mission"
            className="inline-flex items-center min-h-[44px] px-3 font-semibold text-cream hover:underline"
          >
            Mission
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center min-h-[44px] px-3 font-semibold text-cream hover:underline"
          >
            Contact
          </Link>
        </nav>
        <p className="text-sm tracking-wider text-center text-muted-on-plum">
          © 2026 twenty49
        </p>
      </div>
    </footer>
  );
}
