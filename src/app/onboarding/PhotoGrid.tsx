"use client";

import { useRef, useState } from "react";
import ErrorText from "../components/ErrorText";
import { blobToDataUrl, compressImage } from "../lib/images";

/** Big originals are fine: they are shrunk before saving. */
const MAX_FILE_MB = 40;

async function toDataUrl(file: File): Promise<string> {
  const { blob } = await compressImage(file);
  return blobToDataUrl(blob);
}

const iconBtn =
  "absolute w-11 h-11 flex items-center justify-center text-cream focus-visible:outline-[3px] focus-visible:outline-coral focus-visible:outline-offset-[-3px] rounded-[18px]";
const iconDisc = "flex h-7 w-7 items-center justify-center rounded-full bg-ink/70";

/** A photo grid in the style of dating apps: tap an empty slot to add, the first photo is the main one. */
export function PhotoGrid({
  value,
  onChange,
  max,
  error,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  max: number;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProblem("");
    setBusy(true);
    const room = max - value.length;
    const next = [...value];
    let skipped = 0;
    for (const file of Array.from(files).slice(0, room)) {
      if (!file.type.startsWith("image/") || file.size > MAX_FILE_MB * 1024 * 1024) {
        skipped++;
        continue;
      }
      try {
        next.push(await toDataUrl(file));
      } catch {
        skipped++;
      }
    }
    if (files.length > room) setProblem(`You can add up to ${max} photos.`);
    else if (skipped > 0) setProblem(`We couldn't use ${skipped} of the files. Use photos under ${MAX_FILE_MB} MB.`);
    onChange(next);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const makeMain = (i: number) => onChange([value[i], ...value.filter((_, j) => j !== i)]);

  return (
    <div data-invalid={error ? "true" : undefined} className="flex flex-col gap-3">
      <input
        ref={inputRef}
        id="photos"
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void addFiles(e.target.files)}
      />
      <ul className="grid grid-cols-3 gap-3" aria-label="Your photos">
        {Array.from({ length: max }, (_, i) => {
          const src = value[i];
          return (
            <li key={i} className="relative aspect-[3/4]">
              {src ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Photo ${i + 1} of ${value.length}${i === 0 ? ", main photo" : ""}`}
                    className="h-full w-full rounded-[18px] object-cover bg-sand"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-plum px-2.5 py-1 text-xs font-bold text-cream">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={`Remove photo ${i + 1}`}
                    className={`${iconBtn} top-0 right-0`}
                  >
                    <span className={iconDisc}>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </span>
                  </button>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => makeMain(i)}
                      aria-label={`Make photo ${i + 1} the main photo`}
                      className={`${iconBtn} top-0 left-0`}
                    >
                      <span className={iconDisc}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
                        </svg>
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => inputRef.current?.click()}
                  aria-label={`Add photo ${i + 1}`}
                  className="flex h-full w-full items-center justify-center rounded-[18px] border-2 border-dashed border-plum/40 bg-paper text-plum transition-colors hover:bg-sand disabled:opacity-60 focus-visible:outline-[3px] focus-visible:outline-coral focus-visible:outline-offset-2"
                >
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-plum" aria-live="polite">
        {busy ? "Optimising your photos…" : `${value.length} of ${max} added. Tap the star on a photo to make it your main one.`}
      </p>
      {problem && <ErrorText id="photos-problem">{problem}</ErrorText>}
      {error && <ErrorText id="photos-error">{error}</ErrorText>}
    </div>
  );
}
