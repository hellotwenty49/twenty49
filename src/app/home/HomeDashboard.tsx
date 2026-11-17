"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR, loadDraft, saveDraft, type Draft } from "../lib/onboarding";
import { fetchDemoFeed } from "../lib/supabase";
import { formatDate, type RoomCard } from "../lib/rooms";
import RoomListing from "./RoomListing";

const INTEREST_KEY = "twenty49.interested.v1";

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; rooms: RoomCard[] };

/** The answer to one feed request. It only counts while it matches the request being shown. */
interface Result {
  key: string;
  rooms: RoomCard[] | null; // null means the request failed
}

function loadInterested(): string[] {
  try {
    const raw = window.localStorage.getItem(INTEREST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export default function HomeDashboard() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [interested, setInterested] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);

  // Who is this? Until sign-in exists, the answers saved by onboarding stand in for the account.
  useEffect(() => {
    let alive = true;
    void loadDraft().then((d) => {
      if (!alive) return;
      if (!d.completed || d.intent !== "seek") {
        router.replace("/onboarding");
        return;
      }
      setDraft(d);
      setInterested(loadInterested());
    });
    return () => {
      alive = false;
    };
  }, [router]);

  // The request for the rooms that fit them. Changing it (or pressing "Try again") fetches again.
  const request =
    draft && draft.gender && draft.roomType && draft.budgetMax !== null
      ? {
          gender: draft.gender,
          sectors: draft.sectors,
          roomType: draft.roomType,
          budgetMax: draft.budgetMax,
          moveIn: draft.moveIn,
        }
      : null;
  const key = request ? `${attempt}:${JSON.stringify(request)}` : "";

  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    fetchDemoFeed(request, controller.signal)
      .then((rooms) => setResult({ key, rooms }))
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setResult({ key, rooms: null });
      });
    return () => controller.abort();
    // `key` stands for the whole request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const state: State =
    !result || result.key !== key
      ? { kind: "loading" }
      : result.rooms === null
        ? { kind: "error" }
        : { kind: "ready", rooms: result.rooms };

  const toggleInterest = (id: string) => {
    setInterested((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      try {
        window.localStorage.setItem(INTEREST_KEY, JSON.stringify(next));
      } catch {
        // storage can be blocked; the page still works
      }
      return next;
    });
  };

  const editAnswers = () => {
    if (!draft) return;
    void saveDraft({ ...draft, step: "intent" }).then(() => router.push("/onboarding"));
  };

  if (!draft) {
    return <section aria-busy="true" aria-label="Loading" className="min-h-[50vh]" />;
  }

  const firstName = draft.name.trim().split(" ")[0];

  return (
    <section aria-labelledby="home-title" className="w-full">
      <p className="label text-plum">Your matches</p>
      <h1 id="home-title" tabIndex={-1} className="mt-2 text-[34px] sm:text-[44px] text-ink outline-none">
        Hi{firstName ? `, ${firstName}` : ""}. Here are rooms for you.
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Your search">
        <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-plum">
          {draft.sectors.join(", ")}
        </span>
        <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-plum">
          {draft.roomType === "private" ? "Private room" : "Shared room"}
        </span>
        <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-plum">
          Up to {draft.budgetMax !== null ? formatINR(draft.budgetMax) : ""} a month
        </span>
        <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-plum">
          Moving in {draft.moveIn ? formatDate(draft.moveIn) : "soon"}
        </span>
        <button
          type="button"
          onClick={editAnswers}
          className="min-h-[44px] px-2 font-bold underline underline-offset-2 text-plum"
        >
          Change
        </button>
      </div>

      <div className="mt-8" aria-live="polite">
        {state.kind === "loading" && (
          <>
            <p className="sr-only">Finding rooms for you</p>
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex flex-col gap-4">
                  <div className="aspect-[4/3] animate-pulse rounded-[20px] bg-sand" />
                  <div className="h-7 w-1/3 animate-pulse rounded bg-sand" />
                  <div className="h-5 w-2/3 animate-pulse rounded bg-sand" />
                </li>
              ))}
            </ul>
          </>
        )}

        {state.kind === "error" && (
          <div className="max-w-md">
            <p className="text-lg font-bold text-ink">We couldn&apos;t load rooms right now.</p>
            <p className="mt-1 text-plum">Check your connection and try again.</p>
            <button type="button" onClick={() => setAttempt((a) => a + 1)} className="btn btn-primary mt-4">
              Try again
            </button>
          </div>
        )}

        {state.kind === "ready" && state.rooms.length === 0 && (
          <div className="max-w-md">
            <p className="text-lg font-bold text-ink">No rooms match yet.</p>
            <p className="mt-1 text-plum">
              Try adding more areas, raising your budget, or moving your date.
            </p>
            <button type="button" onClick={editAnswers} className="btn btn-primary mt-4">
              Change my search
            </button>
          </div>
        )}

        {state.kind === "ready" && state.rooms.length > 0 && (
          <>
            <p className="mb-6 font-semibold text-plum">
              {state.rooms.length === 1 ? "1 room matches you" : `${state.rooms.length} rooms match you`}
            </p>
            <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {state.rooms.map((room) => (
                <li key={room.listing_id}>
                  <RoomListing
                    room={room}
                    interested={interested.includes(room.listing_id)}
                    onToggleInterest={() => toggleInterest(room.listing_id)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
