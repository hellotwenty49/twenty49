import type { Metadata } from "next";
import AuthLayout from "../components/AuthLayout";
import Onboarding from "./Onboarding";

export const metadata: Metadata = {
  title: "Set up your profile",
  description: "Tell us what you're looking for so we can match you with the right flatmates.",
  robots: { index: false },
};

export default function OnboardingPage() {
  return (
    <AuthLayout>
      <Onboarding />
    </AuthLayout>
  );
}
