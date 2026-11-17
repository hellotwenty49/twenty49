"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "../components/OtpInput";
import ErrorText from "../components/ErrorText";
import {
  OTP_LENGTH,
  RESEND_SECONDS,
  isValidIndianMobile,
  requestOtp,
  verifyOtp,
} from "../lib/auth";

type Step = "phone" | "otp";

const emptyOtp = () => Array<string>(OTP_LENGTH).fill("");
const formatPhone = (d: string) => `+91 ${d.slice(0, 5)} ${d.slice(5)}`;

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState(""); // 10 digits, no country code
  const [otp, setOtp] = useState<string[]>(emptyOtp);
  const [otpKey, setOtpKey] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Resend countdown.
  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  const sendCode = async () => {
    setLoading(true);
    setError("");
    try {
      await requestOtp(phone);
      setOtp(emptyOtp());
      setOtpKey((k) => k + 1);
      setSeconds(RESEND_SECONDS);
      setStep("otp");
    } catch {
      setError("We couldn't send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianMobile(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    void sendCode();
  };

  const verify = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(phone, code);
      if (!res.ok) {
        setError("That code doesn't match. Check it and try again.");
        setOtp(emptyOtp());
        setOtpKey((k) => k + 1);
        setLoading(false);
        return;
      }
      router.push("/onboarding");
      return; // keep the button busy while we navigate
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const onOtpChange = (next: string[]) => {
    setOtp(next);
    setError("");
    if (next.every(Boolean) && !loading) void verify(next.join(""));
  };

  const onOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Enter all 6 digits.");
      return;
    }
    void verify(code);
  };

  return (
    <section
      aria-labelledby="login-title"
      className="w-full max-w-md sm:pt-4"
    >
      {step === "phone" && (
        <>
          <p className="label text-plum">Get started</p>
          <h1 id="login-title" className="mt-2 text-[34px] sm:text-[40px] text-ink">
            Enter your mobile number.
          </h1>
          <p className="mt-3 text-base text-plum">
            We&apos;ll send a one-time code to log you in or create your account.
          </p>

          <form onSubmit={onPhoneSubmit} noValidate className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="label text-plum">
                Mobile number
              </label>
              <div
                className={`flex items-stretch rounded-[14px] border-2 bg-paper overflow-hidden focus-within:outline-[3px] focus-within:outline-coral focus-within:outline-offset-2 ${
                  error ? "border-plum" : "border-sand"
                }`}
              >
                <span className="flex items-center px-4 bg-sand text-plum font-bold" aria-hidden="true">
                  +91
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  autoFocus
                  placeholder="98765 43210"
                  aria-label="Mobile number, 10 digits, country code plus 91"
                  aria-invalid={!!error || undefined}
                  aria-describedby={error ? "auth-error" : undefined}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  className="min-h-[52px] w-full min-w-0 px-4 bg-transparent text-ink text-lg font-semibold outline-none"
                />
              </div>
              {error && <ErrorText id="auth-error">{error}</ErrorText>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
              {loading ? "Sending code…" : "Send OTP"}
            </button>
            <p className="text-sm text-plum text-center">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="label text-plum">Verify</p>
          <h1 id="login-title" className="mt-2 text-[34px] sm:text-[40px] text-ink">
            Enter the 6-digit code.
          </h1>
          <p className="mt-3 text-base text-plum">
            Sent to <span className="font-bold">{formatPhone(phone)}</span>.{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("phone");
              }}
              className="font-bold underline underline-offset-2 min-h-[44px] -my-3 px-1"
            >
              Change number
            </button>
          </p>

          <form onSubmit={onOtpSubmit} noValidate className="mt-8 flex flex-col gap-4">
            <OtpInput
              key={otpKey}
              value={otp}
              onChange={onOtpChange}
              disabled={loading}
              hasError={!!error}
            />
            {error && <ErrorText id="auth-error">{error}</ErrorText>}
            <button
              type="submit"
              disabled={loading || otp.some((d) => !d)}
              className="btn btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
            <div className="text-center text-sm text-plum" aria-live="polite">
              {seconds > 0 ? (
                <span>Resend code in 0:{String(seconds).padStart(2, "0")}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => void sendCode()}
                  disabled={loading}
                  className="font-bold underline underline-offset-2 min-h-[44px] px-2"
                >
                  Resend code
                </button>
              )}
            </div>
          </form>
        </>
      )}

    </section>
  );
}
