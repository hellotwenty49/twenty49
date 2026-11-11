import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in or sign up",
  description: "Log in or create your twenty49 account with your mobile number.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="bg-cream min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 flex justify-center items-start">
        <LoginForm />
      </main>
      <SiteFooter />
    </div>
  );
}
