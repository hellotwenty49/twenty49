/**
 * Minimal Supabase access for the browser, using only the public (publishable) key.
 * Calls are plain fetch requests, so there is nothing to install yet. When sign-in is built this
 * is where the Supabase client will go.
 */

import type { Gender, RoomType } from "./onboarding";
import type { RoomCard } from "./rooms";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const photoUrl = (path: string) => `${URL_BASE}/storage/v1/object/public/listing-photos/${path}`;

export interface FeedRequest {
  gender: Gender;
  sectors: string[];
  roomType: RoomType;
  budgetMax: number;
  moveIn: string;
}

/**
 * TEMPORARY: rooms for a seeker, using the demo_feed function that works without sign-in.
 * Replaced by the signed-in matching_listings() call when sign-in is built.
 */
export async function fetchDemoFeed(req: FeedRequest, signal?: AbortSignal): Promise<RoomCard[]> {
  if (!URL_BASE || !KEY) throw new Error("Supabase is not configured");
  const res = await fetch(`${URL_BASE}/rest/v1/rpc/demo_feed`, {
    method: "POST",
    signal,
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      p_gender: req.gender,
      p_sector_names: req.sectors,
      p_room_type: req.roomType,
      p_budget_max: req.budgetMax,
      p_move_in: req.moveIn,
      p_limit: 30,
    }),
  });
  if (!res.ok) throw new Error(`Could not load rooms (${res.status})`);
  return (await res.json()) as RoomCard[];
}
