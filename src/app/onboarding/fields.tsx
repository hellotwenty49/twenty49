"use client";

import { useId, useState } from "react";
import ErrorText from "../components/ErrorText";
import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  SECTORS,
  SUGGESTED_SECTORS,
  formatINR,
  type Option,
} from "../lib/onboarding";

const CHECK = (
  <svg
    className="hidden group-has-[:checked]:block w-4 h-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12l5 5 9-10" />
  </svg>
);

const FOCUS =
  "peer-focus-visible:outline-[3px] peer-focus-visible:outline-coral peer-focus-visible:outline-offset-2";

/** Single-choice group built from native radios. */
export function Choice<T extends string>({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  onPick,
  error,
  variant = "chip",
}: {
  legend: string;
  hint?: string;
  name: string;
  options: Option<T>[];
  value: T | null;
  onChange: (v: T) => void;
  /** Fires on every click, including re-clicking the current choice. */
  onPick?: (v: T) => void;
  error?: string;
  variant?: "chip" | "card";
}) {
  const errId = `${name}-error`;
  return (
    <fieldset
      data-invalid={error ? "true" : undefined}
      aria-describedby={error ? errId : undefined}
      className="min-w-0 border-0 p-0 m-0"
    >
      <legend className="label text-plum mb-2 p-0">{legend}</legend>
      {hint && <p className="text-sm text-plum mb-3">{hint}</p>}
      <div className={variant === "card" ? "flex flex-col gap-3" : "flex flex-wrap gap-2"}>
        {options.map((o) => (
          <label key={o.value} className="group relative block">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              onClick={() => onPick?.(o.value)}
              className="peer sr-only"
            />
            {variant === "card" ? (
              <span
                className={`flex items-start justify-between gap-3 rounded-[20px] border-2 border-sand bg-paper p-5 text-ink cursor-pointer transition-colors peer-not-checked:hover:bg-sand peer-checked:bg-plum peer-checked:border-plum peer-checked:text-cream ${FOCUS}`}
              >
                <span className="flex flex-col gap-1">
                  <span className="font-display text-xl font-extrabold">{o.label}</span>
                  {o.hint && <span className="text-sm font-medium opacity-90">{o.hint}</span>}
                </span>
                {CHECK}
              </span>
            ) : (
              <span
                className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-[14px] border-2 border-sand bg-paper text-ink font-semibold cursor-pointer transition-colors peer-not-checked:hover:bg-sand peer-checked:bg-plum peer-checked:border-plum peer-checked:text-cream ${FOCUS}`}
              >
                {CHECK}
                {o.label}
              </span>
            )}
          </label>
        ))}
      </div>
      {error && (
        <div className="mt-2">
          <ErrorText id={errId}>{error}</ErrorText>
        </div>
      )}
    </fieldset>
  );
}

/** Label + control + hint + error wrapper. */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: React.ReactNode;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5" data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className="label text-plum inline-flex items-center gap-2">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-plum">
          {hint}
        </p>
      )}
      {children}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

const describe = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

export function TextField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
  min,
  max,
  prefix,
}: {
  id: string;
  label: React.ReactNode;
  hint?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "date";
  inputMode?: "numeric" | "text";
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  min?: string;
  max?: string;
  prefix?: string;
}) {
  const common = {
    id,
    name: id,
    type,
    inputMode,
    autoComplete,
    placeholder,
    maxLength,
    min,
    max,
    value,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describe(id, hint, error),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
  } as const;

  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {prefix ? (
        <div
          className={`flex items-stretch rounded-[14px] border-2 bg-paper overflow-hidden focus-within:outline-[3px] focus-within:outline-coral focus-within:outline-offset-2 ${
            error ? "border-plum" : "border-sand"
          }`}
        >
          <span className="flex items-center px-4 bg-sand text-plum font-bold" aria-hidden="true">
            {prefix}
          </span>
          <input
            {...common}
            className="min-h-[48px] w-full min-w-0 px-4 bg-transparent text-ink text-base font-semibold outline-none"
          />
        </div>
      ) : (
        <input {...common} className={`input ${error ? "!border-plum" : ""}`} />
      )}
    </Field>
  );
}

/** Pick any number of options (including none), built from native checkboxes. */
export function MultiChoice<T extends string>({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  hideLegend = false,
}: {
  legend: string;
  hint?: string;
  name: string;
  options: Option<T>[];
  value: T[];
  onChange: (v: T[]) => void;
  /** Keep the legend for screen readers but don't show it. */
  hideLegend?: boolean;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0 m-0">
      <legend className={hideLegend ? "sr-only" : "label text-plum mb-2 p-0"}>{legend}</legend>
      {hint && <p className="text-sm text-plum mb-3">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="group relative block">
            <input
              type="checkbox"
              name={name}
              value={o.value}
              checked={value.includes(o.value)}
              onChange={(e) =>
                onChange(e.target.checked ? [...value, o.value] : value.filter((v) => v !== o.value))
              }
              className="peer sr-only"
            />
            <span
              className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-[14px] border-2 border-sand bg-paper text-ink font-semibold cursor-pointer transition-colors peer-not-checked:hover:bg-sand peer-checked:bg-plum peer-checked:border-plum peer-checked:text-cream ${FOCUS}`}
            >
              {CHECK}
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** An on/off switch built from a native checkbox. State is shown in words as well as position. */
export function Switch({
  label,
  onText,
  offText,
  checked,
  onChange,
}: {
  label: string;
  onText: string;
  offText: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="group flex items-center gap-3 min-h-[44px] cursor-pointer">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative inline-block h-7 w-12 shrink-0 rounded-full border-2 border-sand bg-sand transition-colors peer-checked:bg-plum peer-checked:border-plum peer-focus-visible:outline-[3px] peer-focus-visible:outline-coral peer-focus-visible:outline-offset-2 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-paper after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
      <span className="flex flex-col">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-sm text-plum">{checked ? onText : offText}</span>
      </span>
    </label>
  );
}

/** Short free text with a live character count. */
export function TextAreaField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  placeholder?: string;
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        name={id}
        rows={3}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${describe(id, hint, error) ?? ""} ${id}-count`.trim()}
        onChange={(e) => onChange(e.target.value.replace(/\n/g, " "))}
        className={`input resize-none py-3 ${error ? "!border-plum" : ""}`}
      />
      <p id={`${id}-count`} className="text-sm text-plum text-right">
        {value.length}/{maxLength}
      </p>
    </Field>
  );
}

/** Whole-rupee amount, digits only. */
export function MoneyField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
}: {
  id: string;
  label: React.ReactNode;
  hint?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const n = Number(value);
  return (
    <TextField
      id={id}
      label={label}
      hint={hint ?? (value && n > 0 ? `${formatINR(n)} per month` : undefined)}
      error={error}
      value={value}
      onChange={(v) => onChange(v.replace(/\D/g, "").slice(0, 7))}
      inputMode="numeric"
      prefix="₹"
      placeholder="0"
    />
  );
}

export const AGE_MIN = 18;
export const AGE_MAX = 60;
const AGE_START = 25;

/** Age as a native slider. Nothing is chosen until the person touches it. */
export function AgeSlider({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (age: string) => void;
  error?: string;
}) {
  const chosen = value !== "";
  const n = chosen ? Number(value) : AGE_START;
  const label = n >= AGE_MAX ? `${AGE_MAX}+` : String(n);
  return (
    <div data-invalid={error ? "true" : undefined} className="flex flex-col gap-1.5">
      <label htmlFor="age" className="label text-plum">
        Your age
      </label>
      <p
        className={`font-display text-[48px] leading-none font-extrabold ${chosen ? "text-ink" : "text-plum/50"}`}
        aria-live="polite"
      >
        {label}
      </p>
      <input
        id="age"
        name="age"
        type="range"
        min={AGE_MIN}
        max={AGE_MAX}
        step={1}
        value={n}
        aria-valuetext={chosen ? `${label} years old` : "Not chosen yet"}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "age-error" : undefined}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => {
          if (!chosen) onChange(String(AGE_START));
        }}
        className="w-full h-11 accent-[#f34e3d]"
      />
      <div className="flex justify-between text-sm font-semibold text-plum" aria-hidden="true">
        <span>{AGE_MIN}</span>
        <span>{AGE_MAX}+</span>
      </div>
      {!chosen && !error && <p className="text-sm text-plum">Slide to choose your age.</p>}
      {error && <ErrorText id="age-error">{error}</ErrorText>}
    </div>
  );
}

/** Maximum monthly budget as a native slider. Nothing is chosen until the person touches it. */
export function BudgetSlider({
  value,
  onChange,
  error,
}: {
  value: number | null;
  onChange: (v: number) => void;
  error?: string;
}) {
  const start = 25000;
  const chosen = value !== null;
  const n = chosen ? value : start;
  return (
    <div data-invalid={error ? "true" : undefined} className="flex flex-col gap-1.5">
      <label htmlFor="budgetMax" className="label text-plum">
        Maximum per month
      </label>
      <p
        className={`font-display text-[40px] leading-none font-extrabold ${chosen ? "text-ink" : "text-plum/50"}`}
        aria-live="polite"
      >
        {formatINR(n)}
      </p>
      <input
        id="budgetMax"
        name="budgetMax"
        type="range"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={BUDGET_STEP}
        value={n}
        aria-valuetext={chosen ? `${formatINR(n)} per month` : "Not chosen yet"}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "budgetMax-error" : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
        onClick={() => {
          if (!chosen) onChange(start);
        }}
        className="w-full h-11 accent-[#f34e3d]"
      />
      <div className="flex justify-between text-sm font-semibold text-plum" aria-hidden="true">
        <span>{formatINR(BUDGET_MIN)}</span>
        <span>{formatINR(BUDGET_MAX)}</span>
      </div>
      {!chosen && !error && <p className="text-sm text-plum">Slide to choose your budget.</p>}
      {error && <ErrorText id="budgetMax-error">{error}</ErrorText>}
    </div>
  );
}

/** Searchable multi-select for Gurugram sectors and localities. */
export function SectorPicker({
  label,
  hint,
  max,
  value,
  onChange,
  error,
  suggestionsFirst = false,
  allowCustom = true,
}: {
  label: string;
  hint?: string;
  max: number;
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
  /** Show the suggested options above the search box. */
  suggestionsFirst?: boolean;
  /** Let people add text that isn't in the list. */
  allowCustom?: boolean;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const full = max > 1 && value.length >= max;

  const matches = q
    ? SECTORS.filter((s) => !value.includes(s) && s.toLowerCase().includes(q)).slice(0, 6)
    : [];
  const exact = SECTORS.some((s) => s.toLowerCase() === q) || value.some((s) => s.toLowerCase() === q);
  const suggestions = SUGGESTED_SECTORS.filter((s) => !value.includes(s)).slice(0, suggestionsFirst ? 8 : 6);

  const add = (s: string) => {
    const clean = s.trim().slice(0, 40);
    if (!clean || value.includes(clean)) return;
    onChange(max === 1 ? [clean] : [...value, clean].slice(0, max));
    setQuery("");
  };
  const remove = (s: string) => onChange(value.filter((v) => v !== s));

  const pill =
    "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[14px] border-2 font-semibold";

  const suggestionsBlock = (
    <div>
              <p className="text-sm text-plum mb-2">{suggestionsFirst ? "Popular areas" : "Suggestions"}</p>
              <ul className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => add(s)}
                      className={`${pill} border-sand bg-paper text-ink hover:bg-sand`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
    </div>
  );


  return (
    <div className="flex flex-col gap-2" data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className="label text-plum">
        {label}
      </label>
      {hint && <p className="text-sm text-plum">{hint}</p>}

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected">
          {value.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => remove(s)}
                aria-label={`Remove ${s}`}
                className={`${pill} bg-plum border-plum text-cream`}
              >
                {s}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!full && (
        <>
          {suggestionsFirst && !q && suggestionsBlock}
          <input
            id={id}
            type="text"
            value={query}
            maxLength={40}
            autoComplete="off"
            placeholder="Search a sector or locality"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (matches[0]) add(matches[0]);
                else if (q && allowCustom) add(query);
              }
            }}
            className={`input ${error ? "!border-plum" : ""}`}
          />
          <p className="sr-only" aria-live="polite">
            {q ? `${matches.length} matches` : ""}
          </p>

          {q ? (
            <ul className="flex flex-wrap gap-2">
              {matches.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => add(s)}
                    className={`${pill} border-sand bg-paper text-ink hover:bg-sand`}
                  >
                    {s}
                  </button>
                </li>
              ))}
              {!exact && matches.length === 0 && !allowCustom && (
                <li className="text-sm text-plum">No sector found. Try another name or number.</li>
              )}
              {!exact && matches.length === 0 && allowCustom && (
                <li>
                  <button
                    type="button"
                    onClick={() => add(query)}
                    className={`${pill} border-plum bg-paper text-plum hover:bg-sand`}
                  >
                    Add “{query.trim()}”
                  </button>
                </li>
              )}
            </ul>
          ) : (
            !suggestionsFirst && suggestionsBlock
          )}
        </>
      )}
      {full && <p className="text-sm text-plum">That&apos;s the maximum of {max}. Remove one to add another.</p>}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}
