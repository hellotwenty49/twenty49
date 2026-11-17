import type { Metadata } from "next";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in or sign up",
  description: "Log in or create your twenty49 account with your mobile number.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
