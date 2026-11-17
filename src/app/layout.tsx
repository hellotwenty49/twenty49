import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (latin subset, variable) so builds and dev never depend on Google Fonts.
const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-latin.woff2",
  weight: "600 800",
  variable: "--font-bricolage",
  display: "swap",
});

const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  weight: "400 700",
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Find your flatmates",
  description:
    "Match with compatible flatmates, skip the broker, and fill an empty room in days. Flat sharing in Gurugram, made simple.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#F5E8CC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
