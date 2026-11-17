"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  emptyDraft,
  loadDraft,
  saveDraft,
  stepsFor,
  summarise,
  validateStep,
  type Draft,
  type Errors,
  type Intent,
  type Occupation,
  type StepId,
} from "../lib/onboarding";
import {
  AboutStep,
  AgeStep,
  AvailableFromStep,
  BhkStep,
  BioStep,
  BudgetStep,
  DealBreakersStep,
  FlatBioStep,
  FlatmateCountStep,
  FlatmatesStep,
  FurnishingStep,
  GenderStep,
  IntentStep,
  isOneTapStep,
  MoveInStep,
  NameStep,
  OccupationStep,
  PhotosStep,
  RentStep,
  RoomTypeStep,
  SectorsStep,
  SocietyStep,
  WashroomStep,
  WorkplaceStep,
  type StepProps,
} from "./steps";

interface Meta {
  label: string;
  title: string;
  intro?: string;
}

function metaFor(step: StepId, intent: Intent | null, occupation: Occupation | null): Meta {
  const host = intent === "host";
  switch (step) {
    case "intent":
      return { label: "Welcome", title: "What brings you here?" };
    case "name":
      return { label: "About me", title: "What's your name?" };
    case "gender":
      return { label: "About me", title: "Are you male or female?" };
    case "occupation":
      return { label: "About me", title: "What do you do?" };
    case "flatBio":
      return { label: "The flat", title: "Say something about the flat." };
    case "flatmates":
      return {
        label: "The flat",
        title: "Who else lives there?",
        intro: "Optional. Add up to 5 flatmates who already live in the flat.",
      };
    case "workplace":
      return {
        label: "About me",
        title: occupation === "student" ? "Where do you study?" : "Where do you work?",
      };
    case "dealbreakers":
      return {
        label: "Lifestyle",
        title: "Any deal-breakers?",
      };
    case "moveIn":
      return { label: "When & Where", title: "When do you want to move in?" };
    case "budget":
      return { label: "When & Where", title: "What's your monthly budget?" };
    case "photos":
      return {
        label: "Photos",
        title: "Add photos of the room.",
        intro: "Add up to 6. The first one is your main photo. These are visible to everyone.",
      };
    case "rent":
      return {
        label: "Costs",
        title: "What does it cost?",
        intro: "All of this is visible to everyone.",
      };
    case "availableFrom":
      return { label: "The room", title: "When is the room available?" };
    case "flatmateCount":
      return { label: "The flat", title: "How many flatmates live there now?" };
    case "bhk":
      return { label: "The flat", title: "How big is the flat?" };
    case "society":
      return { label: "The flat", title: "What's the society or area called?" };
    case "sectors":
      return host
        ? { label: "The flat", title: "Where is the flat?" }
        : { label: "When & Where", title: "Where do you want to stay?" };
    case "furnishing":
      return { label: "The room", title: "Is the room furnished?" };
    case "roomType":
      return host
        ? { label: "The room", title: "What are you renting out?" }
        : { label: "When & Where", title: "What kind of room?" };
    case "bio":
      return { label: "About me", title: "Say something about yourself." };
    case "age":
      return { label: "About me", title: "How old are you?" };
    case "about":
      return { label: "About me", title: "A little about you." };
    case "washroom":
      return { label: "The room", title: "Does it have an attached washroom?" };
    default:
      return { label: "", title: "" };
  }
}

const STEP_COMPONENTS: Record<Exclude<StepId, "done">, (p: StepProps) => React.ReactNode> = {
  intent: IntentStep,
  name: NameStep,
  gender: GenderStep,
  age: AgeStep,
  occupation: OccupationStep,
  workplace: WorkplaceStep,
  flatmates: FlatmatesStep,
  flatBio: FlatBioStep,
  bio: BioStep,
  roomType: RoomTypeStep,
  furnishing: FurnishingStep,
  sectors: SectorsStep,
  society: SocietyStep,
  bhk: BhkStep,
  flatmateCount: FlatmateCountStep,
  availableFrom: AvailableFromStep,
  rent: RentStep,
  photos: PhotosStep,
  budget: BudgetStep,
  moveIn: MoveInStep,
  dealbreakers: DealBreakersStep,
  about: AboutStep,
  washroom: WashroomStep,
};

export default function Onboarding() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  // Load any saved progress.
  useEffect(() => {
    let alive = true;
    void loadDraft().then((d) => {
      if (alive) setDraft(d);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Autosave every change.
  useEffect(() => {
    if (draft) void saveDraft(draft);
  }, [draft]);

  // Move focus to the heading when the step changes.
  const step = draft?.step;
  useEffect(() => {
    if (!step) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);

  if (!draft) {
    return (
      <section
        aria-busy="true"
        aria-label="Loading"
        className="w-full max-w-xl sm:pt-4 min-h-[320px]"
      />
    );
  }

  const set = (patch: Partial<Draft>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch)) delete next[k];
      return next;
    });
  };
  const clear = (key: string) =>
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });

  const goTo = (s: StepId) => {
    setErrors({});
    setDraft((d) => (d ? { ...d, step: s } : d));
  };

  /* ── Done screen ── */
  if (draft.step === "done") {
    return (
      <section
        aria-labelledby="ob-title"
        className="w-full max-w-xl sm:pt-4"
      >
        <p className="label text-plum">All set</p>
        <h1
          id="ob-title"
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 text-[34px] sm:text-[40px] text-ink outline-none"
        >
          You&apos;re all set{draft.name.trim() ? `, ${draft.name.trim().split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-3 text-base text-plum">
          Your profile is saved. We&apos;re getting matching ready and will be in touch as soon as it
          opens.
        </p>
        <p className="mt-6 border-t-2 border-sand pt-4 font-semibold text-ink">{summarise(draft)}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn btn-primary sm:flex-1">
            Back to home
          </Link>
          <button type="button" onClick={() => goTo("intent")} className="btn btn-secondary sm:flex-1">
            Edit my answers
          </button>
        </div>
        {process.env.NODE_ENV !== "production" && (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setDraft(emptyDraft());
            }}
            className="mt-4 text-sm font-bold underline underline-offset-2 text-plum min-h-[44px]"
          >
            Start over (testing only)
          </button>
        )}
      </section>
    );
  }

  /* ── Wizard ── */
  const steps = stepsFor(draft.intent);
  const index = Math.max(0, steps.indexOf(draft.step));
  const meta = metaFor(draft.step, draft.intent, draft.occupation);
  const StepBody = STEP_COMPONENTS[draft.step];
  const isLast = index === steps.length - 1;
  // The room-to-rent flow is still being built, so its last screen says Continue for now.
  const knownTotal = draft.intent !== null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateStep(draft, draft.step);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => {
        const target = formRef.current?.querySelector<HTMLElement>(
          "[data-invalid] input, [data-invalid] button",
        );
        target?.focus();
      });
      return;
    }
    if (isLast) {
      const finished: Draft = { ...draft, completed: true, step: "done" };
      setDraft(finished);
      // People looking for a room go straight to their matches.
      if (draft.intent === "seek") {
        void saveDraft(finished).then(() => router.push("/home"));
      }
    } else {
      goTo(steps[index + 1]);
    }
  };

  return (
    <section
      aria-labelledby="ob-title"
      className="w-full max-w-xl sm:pt-4"
    >
      <div className="flex items-center justify-between min-h-[44px]">
        {index > 0 ? (
          <button
            type="button"
            onClick={() => goTo(steps[index - 1])}
            className="inline-flex items-center gap-1 font-bold text-plum min-h-[44px] -ml-2 px-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back
          </button>
        ) : (
          <span />
        )}
        <p className="text-sm font-semibold text-plum">
          {knownTotal ? `Step ${index + 1} of ${steps.length}` : "Step 1"}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Sign-up progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(((index + 1) / (knownTotal ? steps.length : 13)) * 100)}
        className="mt-2 h-2 rounded-full bg-sand overflow-hidden"
      >
        <div
          className="h-full bg-plum transition-all duration-300"
          style={{ width: `${((index + 1) / (knownTotal ? steps.length : 13)) * 100}%` }}
        />
      </div>

      <p className="label text-plum mt-8">{meta.label}</p>
      <h1
        id="ob-title"
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 text-[30px] sm:text-[36px] text-ink outline-none"
      >
        {meta.title}
      </h1>
      {meta.intro && <p className="mt-3 text-base text-plum">{meta.intro}</p>}

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-6">
        <StepBody
          d={draft}
          set={set}
          errors={errors}
          clear={clear}
          next={() => goTo(steps[index + 1])}
        />
        {!isOneTapStep(draft) && (
          <button type="submit" className="btn btn-primary w-full mt-2">
            {isLast && draft.intent !== "host" ? "Finish" : "Continue"}
          </button>
        )}
      </form>
    </section>
  );
}
