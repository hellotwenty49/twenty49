import { DEAL_BREAKERS, OCCUPATIONS, formatINR, type DealBreaker, type Furnishing, type Gender, type Occupation, type RoomType } from "./onboarding";

/** One room as the feed returns it. Fields marked "matches only" arrive as null until there is a match. */
export interface RoomCard {
  listing_id: string;
  score: number;
  bio: string;
  sector: string;
  society: string | null;
  bhk: string;
  room_type: RoomType;
  furnishing: Furnishing;
  attached_washroom: boolean;
  flatmate_count: number;
  available_from: string;
  rent: number;
  deposit: number;
  one_time_cost: number;
  furniture_rent: number;
  furniture_optional: boolean;
  maid_cost: number;
  maid_optional: boolean;
  cook_cost: number;
  cook_optional: boolean;
  mandatory_monthly_cost: number;
  house_rules: DealBreaker[];
  photos: string[];
  host: {
    first_name: string | null;
    age: number | null;
    occupation: Occupation;
    workplace: string | null;
  };
  flatmates: { gender: Gender; occupation: Occupation; workplace: string | null }[];
}

export const bhkLabel = (v: string) => (v === "rk" ? "1 RK" : `${v} BHK`);

export const FURNISHING_LABEL: Record<Furnishing, string> = {
  furnished: "Furnished",
  semi: "Semi-furnished",
  unfurnished: "Unfurnished",
};

export const occupationLabel = (o: Occupation) => OCCUPATIONS.find((x) => x.value === o)?.label ?? o;
export const ruleLabel = (r: DealBreaker) => DEAL_BREAKERS.find((x) => x.value === r)?.label ?? r;

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** "Available now" for dates up to today, otherwise "Available from 12 Dec". */
export function availability(iso: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return iso <= today ? "Available now" : `Available from ${formatDate(iso)}`;
}

/** Costs a tenant can choose to skip (optional) and the ones they must take (compulsory). */
export function extras(r: RoomCard) {
  const items = [
    { label: "Furniture", cost: r.furniture_rent, optional: r.furniture_optional },
    { label: "Maid", cost: r.maid_cost, optional: r.maid_optional },
    { label: "Cook", cost: r.cook_cost, optional: r.cook_optional },
  ].filter((i) => i.cost > 0);
  return {
    items,
    compulsory: items.filter((i) => !i.optional),
    optional: items.filter((i) => i.optional),
  };
}

export const inr = formatINR;
