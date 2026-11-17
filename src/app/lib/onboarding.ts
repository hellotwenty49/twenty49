/**
 * Onboarding data model, options, validation and storage.
 *
 * PLACEHOLDER STORAGE: drafts are kept in this browser's localStorage so the
 * flow can be built and tested before a backend exists. `loadDraft`,
 * `saveDraft` and `clearDraft` are async on purpose: replace their bodies with
 * Supabase calls later and nothing else needs to change.
 *
 * When wiring the database, "Any" accept values map to sets of accepted
 * values (e.g. food accept "any" -> ["veg", "nonveg"]).
 */

export type StepId =
  | "intent"
  | "about"
  | "washroom"
  | "name"
  | "gender"
  | "age"
  | "occupation"
  | "workplace"
  | "flatmates"
  | "flatBio"
  | "bio"
  | "roomType"
  | "furnishing"
  | "sectors"
  | "society"
  | "bhk"
  | "flatmateCount"
  | "availableFrom"
  | "rent"
  | "photos"
  | "budget"
  | "moveIn"
  | "dealbreakers"
  | "done";

export type Intent = "seek" | "host";
export type Gender = "male" | "female";
export type Household = "single" | "plusone";
export type LookingFor = "male" | "female" | "couple" | "any";
export type HostType = "replacement" | "roommate" | "flatmate";
export type RoomType = "private" | "shared" | "any";
export type Furnishing = "furnished" | "semi" | "unfurnished";
export type Washroom = "attached" | "common";
export type FlatmateMix = "women" | "men" | "mixed" | "couples";
export type FlatmateOccupation = "working" | "students" | "mixed";
export type Occupation = "working" | "student";
export type DealBreaker = "veg" | "parties" | "pets" | "smoking";
export type Visibility = "everyone" | "matches" | "hidden";

export type LifestyleKey = "food" | "drinks" | "parties" | "fitness" | "pets";
export interface LifestyleAnswer {
  own: string | null;
  accept: string;
}

/** Someone who already lives in the flat (hosts only, optional). */
export interface Flatmate {
  gender: Gender | null;
  occupation: Occupation | null;
  workplace: string;
}
export const FLATMATES_MAX = 5;
export const PHOTOS_MAX = 6;
export const emptyFlatmate = (): Flatmate => ({ gender: null, occupation: null, workplace: "" });

export interface Draft {
  step: StepId;
  completed: boolean;

  intent: Intent | null;
  gender: Gender | null;
  household: Household | null;

  // Where / who
  lookingFor: LookingFor | null;
  sectors: string[];

  // Seeker
  /** The most they would pay each month, all-in (rent, maintenance, furniture rent). */
  budgetMax: number | null;
  moveIn: string;
  /** Things they will not live with. Empty means they are easygoing about all of them. */
  dealBreakers: DealBreaker[];

  // Host
  hostType: HostType | null;
  bhk: string | null;
  flatmateCount: string | null;
  flatmateMix: FlatmateMix | null;
  flatmateOccupation: FlatmateOccupation | null;
  /** Optional details of other people already living in the flat, up to FLATMATES_MAX. */
  flatmates: Flatmate[];
  /** Monthly rent, maintenance included. */
  rent: string;
  deposit: string;
  /** Optional costs. Empty means there is no such cost. */
  oneTimeCost: string;
  furnitureRent: string;
  maidCost: string;
  cookCost: string;
  /** For each extra above: true means the tenant can choose not to pay for it. */
  furnitureOptional: boolean;
  maidOptional: boolean;
  cookOptional: boolean;
  availableFrom: string;

  // Room (both)
  roomType: RoomType | null;
  furnishing: Furnishing | null;
  washroom: Washroom | null;

  lifestyle: Record<LifestyleKey, LifestyleAnswer>;

  // Profile
  name: string;
  nameVisibility: Visibility;
  dob: string;
  age: string;
  /** Worked out from the age they enter: this year minus age. Keeps their age current as years pass. */
  birthYear: number | null;
  ageVisibility: Visibility;
  occupation: Occupation | null;
  workplace: string;
  bio: string;
  /** Photos as small JPEG data URLs, main photo first. Placeholder until real file storage exists. */
  photos: string[];
  /** Hosts: society, building or area name. */
  society: string;
  societyVisibility: Visibility;
  /** Hosts: a short line about the flat and the people living there. */
  flatBio: string;
  workplaceVisibility: Visibility;
}

export const BIO_MAX = 100;
export const BUDGET_MIN = 5000;
export const BUDGET_MAX = 60000;
export const BUDGET_STEP = 1000;

export function emptyDraft(): Draft {
  const blank = (): LifestyleAnswer => ({ own: null, accept: "any" });
  return {
    step: "intent",
    completed: false,
    intent: null,
    gender: null,
    household: null,
    lookingFor: null,
    sectors: [],
    budgetMax: null,
    moveIn: "",
    dealBreakers: [],
    hostType: null,
    bhk: null,
    flatmateCount: null,
    flatmateMix: null,
    flatmateOccupation: null,
    flatmates: [],
    rent: "",
    deposit: "",
    oneTimeCost: "",
    furnitureRent: "",
    maidCost: "",
    cookCost: "",
    furnitureOptional: false,
    maidOptional: false,
    cookOptional: false,
    availableFrom: "",
    roomType: null,
    furnishing: null,
    washroom: null,
    lifestyle: {
      food: blank(),
      drinks: blank(),
      parties: blank(),
      fitness: blank(),
      pets: blank(),
    },
    name: "",
    nameVisibility: "everyone",
    dob: "",
    age: "",
    birthYear: null,
    ageVisibility: "everyone",
    occupation: null,
    workplace: "",
    bio: "",
    photos: [],
    society: "",
    societyVisibility: "matches",
    flatBio: "",
    workplaceVisibility: "matches",
  };
}

/** Name and gender are editable while filling in the flow, and lock after the last step. */
export const LOCK_AFTER_COMPLETE = true;

/* ── Steps ── */

export function stepsFor(intent: Intent | null): StepId[] {
  if (intent === "host") {
    return ["intent", "name", "gender", "age", "occupation", "workplace", "flatmates", "flatBio", "roomType", "furnishing", "washroom", "sectors", "society", "bhk", "flatmateCount", "availableFrom", "rent", "dealbreakers", "photos"];
  }
  return ["intent", "name", "gender", "about", "age", "occupation", "workplace", "bio", "roomType", "sectors", "budget", "moveIn", "dealbreakers"];
}

/* ── Option lists ── */

export interface Option<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
}

export const INTENTS: Option<Intent>[] = [
  { value: "seek", label: "I'm looking for a room", hint: "Find a flat and flatmates who fit." },
  { value: "host", label: "I have a room to rent", hint: "Fill a vacancy with the right person." },
];
export const GENDERS: Option<Gender>[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];
export const HOUSEHOLDS: Option<Household>[] = [
  { value: "single", label: "Just me" },
  { value: "plusone", label: "Me + 1" },
];
export const LOOKING_FOR: Option<LookingFor>[] = [
  { value: "male", label: "Male only" },
  { value: "female", label: "Female only" },
  { value: "couple", label: "Couple" },
  { value: "any", label: "Any" },
];
export const HOST_TYPES: Option<HostType>[] = [
  { value: "replacement", label: "Replacing someone who's leaving" },
  { value: "roommate", label: "Sharing my room" },
  { value: "flatmate", label: "A room in my flat" },
];
export const BHKS: Option[] = [
  { value: "rk", label: "1 RK" },
  ...["1", "2", "3", "4", "5"].map((n) => ({ value: n, label: `${n} BHK` })),
];
export const FLATMATE_COUNTS: Option[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => ({
  value: n,
  label: n,
}));
export const FLATMATE_MIX: Option<FlatmateMix>[] = [
  { value: "women", label: "All women" },
  { value: "men", label: "All men" },
  { value: "mixed", label: "Mixed" },
  { value: "couples", label: "Couple(s)" },
];
export const FLATMATE_OCC: Option<FlatmateOccupation>[] = [
  { value: "working", label: "Working pros" },
  { value: "students", label: "Students" },
  { value: "mixed", label: "Mixed" },
];
export const ROOM_TYPE_CHOICES: Option<RoomType>[] = [
  { value: "private", label: "Private Room" },
  { value: "shared", label: "Shared Room" },
];
export const DEAL_BREAKERS: Option<DealBreaker>[] = [
  { value: "veg", label: "Veg only" },
  { value: "parties", label: "No parties" },
  { value: "pets", label: "No pets" },
  { value: "smoking", label: "No smoking" },
];
export const FURNISHINGS: Option<Furnishing>[] = [
  { value: "furnished", label: "Furnished" },
  { value: "semi", label: "Semi-furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];
export const WASHROOMS: Option<Washroom>[] = [
  { value: "attached", label: "Yes" },
  { value: "common", label: "No" },
];
export const OCCUPATIONS: Option<Occupation>[] = [
  { value: "working", label: "Working Professional" },
  { value: "student", label: "Student" },
];
export const NAME_VISIBILITY: Option<Visibility>[] = [
  { value: "everyone", label: "Everyone" },
  { value: "matches", label: "Matches only" },
];
export const AGE_VISIBILITY = NAME_VISIBILITY;
export const WORKPLACE_VISIBILITY: Option<Visibility>[] = [
  { value: "everyone", label: "Everyone" },
  { value: "matches", label: "Matches only" },
  { value: "hidden", label: "Hidden" },
];

export interface LifestyleQuestion {
  key: LifestyleKey;
  title: string;
  ownLabel: { seek: string; host: string };
  ownOptions: Option[];
  acceptLabel: string;
  acceptOptions: Option[];
}

const YES_NO: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
const YES_NO_ANY: Option[] = [...YES_NO, { value: "any", label: "Any" }];

export const LIFESTYLE: LifestyleQuestion[] = [
  {
    key: "food",
    title: "Food",
    ownLabel: { seek: "I eat", host: "Our home is" },
    ownOptions: [
      { value: "veg", label: "Veg" },
      { value: "nonveg", label: "Non-veg" },
    ],
    acceptLabel: "Flatmate eats",
    acceptOptions: [
      { value: "veg", label: "Veg only" },
      { value: "nonveg", label: "Non-veg" },
      { value: "any", label: "Any" },
    ],
  },
  {
    key: "drinks",
    title: "Drinks",
    ownLabel: { seek: "I drink", host: "Drinking at home" },
    ownOptions: YES_NO,
    acceptLabel: "Flatmate drinks",
    acceptOptions: YES_NO_ANY,
  },
  {
    key: "parties",
    title: "Parties",
    ownLabel: { seek: "I enjoy parties", host: "Parties at home" },
    ownOptions: YES_NO,
    acceptLabel: "Flatmate parties",
    acceptOptions: YES_NO_ANY,
  },
  {
    key: "fitness",
    title: "Fitness",
    ownLabel: { seek: "I work out", host: "We work out" },
    ownOptions: YES_NO,
    acceptLabel: "Flatmate works out",
    acceptOptions: YES_NO_ANY,
  },
  {
    key: "pets",
    title: "Pets",
    ownLabel: { seek: "I have pets", host: "Pets at home" },
    ownOptions: YES_NO,
    acceptLabel: "Flatmate has pets",
    acceptOptions: YES_NO_ANY,
  },
];

/* ── Sectors and localities (Gurugram) ── */

const LOCALITIES = [
  "DLF Phase 1",
  "DLF Phase 2",
  "DLF Phase 3",
  "DLF Phase 4",
  "DLF Phase 5",
  "Golf Course Road",
  "Golf Course Extension Road",
  "Sohna Road",
  "Sushant Lok 1",
  "Sushant Lok 2",
  "Sushant Lok 3",
  "MG Road",
  "Udyog Vihar",
  "Cyber City",
  "South City 1",
  "South City 2",
  "Nirvana Country",
  "Palam Vihar",
  "Ardee City",
  "Malibu Towne",
];
export const SECTORS: string[] = [
  ...LOCALITIES,
  ...Array.from({ length: 115 }, (_, i) => `Sector ${i + 1}`),
];
export const SUGGESTED_SECTORS = [
  "DLF Phase 2",
  "DLF Phase 3",
  "Golf Course Road",
  "Sohna Road",
  "Sushant Lok 1",
  "Sector 49",
  "Sector 56",
  "Sector 82",
];

/* ── Helpers ── */

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const eighteenYearsAgoISO = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return toISO(d);
};
export const MIN_DOB = "1940-01-01";

export function ageFromDob(dob: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [y, m, d] = dob.split("-").map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1;
  return age;
}

export const workplaceLabel = (o: Occupation | null) =>
  o === "student" ? "College" : "Workplace";

/* ── Validation ── */

export type Errors = Record<string, string>;

const REQUIRED_CHOICE = "Choose one to continue.";

/** Birth year implied by an age entered today, or null if the age isn't valid. */
export function birthYearFromAge(age: string): number | null {
  const n = Number(age);
  return age.trim() && Number.isInteger(n) && n >= 18 && n <= 99 ? new Date().getFullYear() - n : null;
}

export function ageFromBirthYear(year: number | null): number | null {
  return year === null ? null : new Date().getFullYear() - year;
}

export function validateStep(d: Draft, step: StepId): Errors {
  const e: Errors = {};

  switch (step) {
    case "intent":
      if (!d.intent) e.intent = REQUIRED_CHOICE;
      break;

    case "about":
      if (!d.household) e.household = REQUIRED_CHOICE;
      break;

    case "moveIn":
      if (!d.moveIn) e.moveIn = "Pick your move-in date.";
      else if (d.moveIn < todayISO()) e.moveIn = "Move-in date can't be in the past.";
      break;

    case "washroom":
      if (!d.washroom) e.washroom = REQUIRED_CHOICE;
      break;

    case "name": {
      const n = d.name.trim();
      if (!n) e.name = "Enter your name.";
      else if (n.length < 2 || !/^\p{L}[\p{L} .'-]*$/u.test(n)) e.name = "Enter your name using letters only.";
      break;
    }

    case "budget":
      if (d.budgetMax === null) e.budgetMax = "Choose your monthly budget.";
      break;

    case "photos":
      if (d.photos.length === 0) e.photos = "Add at least one photo.";
      break;

    case "rent":
      if (d.rent === "") e.rent = "Enter the monthly rent.";
      else if (Number(d.rent) <= 0) e.rent = "Enter an amount above 0.";
      if (d.deposit === "") e.deposit = "Enter the deposit, or 0 if none.";
      for (const [key, label] of [
        ["oneTimeCost", "one-time cost"],
        ["furnitureRent", "furniture rent"],
        ["maidCost", "maid cost"],
        ["cookCost", "cook cost"],
      ] as const) {
        if (d[key] === "") e[key] = `Enter the ${label}, or 0 if none.`;
      }
      break;

    case "availableFrom":
      if (!d.availableFrom) e.availableFrom = "Pick the date the room is free from.";
      else if (d.availableFrom < todayISO()) e.availableFrom = "The date can't be in the past.";
      break;

    case "flatmateCount":
      if (!d.flatmateCount) e.flatmateCount = REQUIRED_CHOICE;
      break;

    case "bhk":
      if (!d.bhk) e.bhk = REQUIRED_CHOICE;
      break;

    case "society":
      if (!d.society.trim()) e.society = "Enter the society or area name.";
      break;

    case "sectors":
      if (d.sectors.length === 0) {
        e.sectors = d.intent === "host" ? "Pick the sector or locality of your flat." : "Pick at least one sector or locality.";
      }
      break;

    case "furnishing":
      if (!d.furnishing) e.furnishing = REQUIRED_CHOICE;
      break;

    case "roomType":
      if (d.roomType !== "private" && d.roomType !== "shared") e.roomType = REQUIRED_CHOICE;
      break;

    case "flatBio":
      if (!d.flatBio.trim()) e.flatBio = "Write a line about the flat.";
      break;

    case "bio":
      if (!d.bio.trim()) e.bio = "Write a line about yourself.";
      break;

    case "flatmates":
      d.flatmates.forEach((f, i) => {
        if (!f.gender) e[`flatmates.${i}.gender`] = REQUIRED_CHOICE;
        if (!f.occupation) e[`flatmates.${i}.occupation`] = REQUIRED_CHOICE;
        if (f.occupation && !f.workplace.trim()) {
          e[`flatmates.${i}.workplace`] =
            f.occupation === "student" ? "Enter their college." : "Enter where they work.";
        }
      });
      break;

    case "workplace":
      if (!d.workplace.trim()) {
        e.workplace = d.occupation === "student" ? "Enter your college." : "Enter where you work.";
      }
      break;

    case "occupation":
      if (!d.occupation) e.occupation = REQUIRED_CHOICE;
      break;

    case "age": {
      const n = Number(d.age);
      if (!d.age.trim()) e.age = "Choose your age.";
      else if (n < 18) e.age = "You need to be 18 or older to use twenty49.";
      else if (n > 99) e.age = "Enter a valid age.";
      break;
    }

    case "gender":
      if (!d.gender) e.gender = REQUIRED_CHOICE;
      break;

    case "done":
      break;
  }
  return e;
}

/* ── Storage (placeholder: localStorage) ── */

const KEY = "twenty49.onboarding.v1";

export async function loadDraft(): Promise<Draft> {
  const base = emptyDraft();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<Draft>;
    // Earlier drafts used "woman"/"man"/"other".
    const old = saved.gender as string | null | undefined;
    const gender = old === "woman" ? "female" : old === "man" ? "male" : old === "other" ? null : old;
    if ((saved.household as string | null) === "couple") saved.household = "plusone";
    return {
      ...base,
      ...saved,
      gender: (gender ?? null) as Draft["gender"],
      lifestyle: { ...base.lifestyle, ...(saved.lifestyle ?? {}) },
    };
  } catch {
    return base;
  }
}

export async function saveDraft(draft: Draft): Promise<void> {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage can be blocked (private mode); the flow still works in memory.
  }
}

export async function clearDraft(): Promise<void> {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/* ── Summary line for the final screen ── */

export function summarise(d: Draft): string {
  const where = d.sectors.join(", ");
  if (d.intent === "host") {
    return `Room to rent in ${where}${d.bhk ? ` · ${BHKS.find((b) => b.value === d.bhk)?.label ?? ""}` : ""}`;
  }
  return `Looking for a room in ${where} · up to ${d.budgetMax === null ? "—" : formatINR(d.budgetMax)}/month`;
}
