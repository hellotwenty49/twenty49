"use client";

import { useRef } from "react";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  hasError?: boolean;
};

/** Six single-digit boxes with auto-advance, backspace, arrows, paste and SMS autofill. */
export default function OtpInput({ value, onChange, disabled, hasError }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(value.length - 1, i))]?.focus();

  const fill = (start: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    const next = [...value];
    let last = start;
    for (let k = 0; k < digits.length && start + k < next.length; k++) {
      next[start + k] = digits[k];
      last = start + k;
    }
    onChange(next);
    focusAt(last + 1);
  };

  return (
    <div className="flex gap-2 sm:gap-3" role="group" aria-label="6-digit code">
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={i === 0}
          maxLength={i === 0 ? value.length : 1}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={hasError || undefined}
          disabled={disabled}
          value={d}
          onChange={(e) => {
            const raw = e.target.value;
            if (!raw.replace(/\D/g, "")) {
              const next = [...value];
              next[i] = "";
              onChange(next);
              return;
            }
            fill(i, raw);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              const next = [...value];
              next[i - 1] = "";
              onChange(next);
              focusAt(i - 1);
              e.preventDefault();
            } else if (e.key === "ArrowLeft") {
              focusAt(i - 1);
            } else if (e.key === "ArrowRight") {
              focusAt(i + 1);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            fill(0, e.clipboardData.getData("text"));
          }}
          onFocus={(e) => e.currentTarget.select()}
          className={`min-w-0 flex-1 h-14 text-center font-display text-[26px] font-extrabold text-ink bg-paper rounded-[14px] border-2 ${
            hasError ? "border-plum" : "border-sand"
          } focus-visible:outline-[3px] focus-visible:outline-coral focus-visible:outline-offset-2`}
        />
      ))}
    </div>
  );
}
