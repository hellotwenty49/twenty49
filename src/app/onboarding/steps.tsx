"use client";

import {
  BHKS,
  FLATMATES_MAX,
  PHOTOS_MAX,
  emptyFlatmate,
  type Flatmate,
  FLATMATE_COUNTS,
  FURNISHINGS,
  AGE_VISIBILITY,
  DEAL_BREAKERS,
  BIO_MAX,
  ageFromBirthYear,
  birthYearFromAge,
  GENDERS,
  HOUSEHOLDS,
  INTENTS,
  LOCK_AFTER_COMPLETE,
  NAME_VISIBILITY,
  stepsFor,
  OCCUPATIONS,
  ROOM_TYPE_CHOICES,
  WASHROOMS,
  todayISO,
  type Draft,
  type Errors,
} from "../lib/onboarding";
import { PhotoGrid } from "./PhotoGrid";
import { AgeSlider, BudgetSlider, Choice, MoneyField, MultiChoice, Switch, SectorPicker, TextAreaField, TextField } from "./fields";

export interface StepProps {
  d: Draft;
  set: (patch: Partial<Draft>) => void;
  errors: Errors;
  clear: (key: string) => void;
  /** Go to the next step (used by one-tap steps). */
  next: () => void;
}

/** Steps whose only question is a single tap: they move on by themselves, with no Continue button. */
export function isOneTapStep(d: Draft): boolean {
  if (d.step === "intent") return true;
  if (d.step === "gender") return !(LOCK_AFTER_COMPLETE && d.completed);
  if (d.step === "occupation") return true;
  if (d.step === "roomType") return true;
  if (d.step === "furnishing") return true;
  if (d.step === "washroom") return true;
  if (d.step === "bhk") return true;
  if (d.step === "flatmateCount") return true;
  if (d.step === "about") return true;
  return false;
}

export function IntentStep({ d, set, errors }: StepProps) {
  return (
    <Choice
      legend="I want to"
      name="intent"
      variant="card"
      options={INTENTS}
      value={d.intent}
      onChange={(intent) =>
        set({ intent, sectors: intent === "host" ? d.sectors.slice(0, 1) : d.sectors })
      }
      onPick={(v) => set({ step: stepsFor(v)[1] })}
      error={errors.intent}
    />
  );
}

export function NameStep({ d, set, errors }: StepProps) {
  const locked = LOCK_AFTER_COMPLETE && d.completed;
  return (
    <>
      {locked ? (
        <div className="flex flex-col gap-1.5">
          <p className="label text-plum">Your name</p>
          <p className="min-h-[52px] flex items-center px-4 rounded-[14px] border-2 border-sand bg-sand text-ink text-lg font-semibold">
            {d.name}
          </p>
          <p className="text-sm text-plum">
            Your name can&apos;t be changed once your profile is complete.
          </p>
        </div>
      ) : (
        <TextField
          id="name"
          label="Your name"
          hint="It can't be changed once your profile is complete."
          autoComplete="given-name"
          maxLength={40}
          value={d.name}
          onChange={(name) => set({ name })}
          error={errors.name}
        />
      )}
      <Choice
        legend="Who can see your name?"
        hint="Only your first name will be visible."
        name="nameVisibility"
        options={NAME_VISIBILITY}
        value={d.nameVisibility}
        onChange={(nameVisibility) => set({ nameVisibility })}
      />
    </>
  );
}

export function GenderStep({ d, set, errors, next }: StepProps) {
  if (LOCK_AFTER_COMPLETE && d.completed) {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="label text-plum">I am</p>
        <p className="min-h-[52px] flex items-center px-4 rounded-[14px] border-2 border-sand bg-sand text-ink text-lg font-semibold">
          {GENDERS.find((g) => g.value === d.gender)?.label}
        </p>
        <p className="text-sm text-plum">Your gender can&apos;t be changed once your profile is complete.</p>
      </div>
    );
  }
  return (
    <Choice
      legend="I am"
      hint="We use this to match you with the right flatmates. It can't be changed once your profile is complete. It is always visible on your profile."
      name="gender"
      options={GENDERS}
      value={d.gender}
      onChange={(gender) => set({ gender })}
      onPick={next}
      error={errors.gender}
    />
  );
}

export function AgeStep({ d, set, errors }: StepProps) {
  const locked = LOCK_AFTER_COMPLETE && d.completed;
  const lockedAge = ageFromBirthYear(d.birthYear);
  return (
    <>
      {locked ? (
        <div className="flex flex-col gap-1.5">
          <p className="label text-plum">Your age</p>
          <p className="min-h-[52px] flex items-center px-4 rounded-[14px] border-2 border-sand bg-sand text-ink text-lg font-semibold">
            {lockedAge ?? ""}
          </p>
          <p className="text-sm text-plum">Your age can&apos;t be changed once your profile is complete.</p>
        </div>
      ) : (
        <>
          <AgeSlider
            value={d.age}
            onChange={(age) => set({ age, birthYear: birthYearFromAge(age) })}
            error={errors.age}
          />
          <p className="text-sm text-plum -mt-3">It can&apos;t be changed once your profile is complete.</p>
        </>
      )}
      <Choice
        legend="Who can see your age?"
        name="ageVisibility"
        options={AGE_VISIBILITY}
        value={d.ageVisibility}
        onChange={(ageVisibility) => set({ ageVisibility })}
      />
    </>
  );
}

export function OccupationStep({ d, set, errors, next }: StepProps) {
  return (
    <Choice
      legend="I am a"
      hint="This is visible to everyone."
      name="occupation"
      options={OCCUPATIONS}
      value={d.occupation}
      onChange={(occupation) => set({ occupation })}
      onPick={next}
      error={errors.occupation}
    />
  );
}

export function WorkplaceStep({ d, set, errors }: StepProps) {
  const student = d.occupation === "student";
  return (
    <>
      <TextField
        id="workplace"
        label={student ? "College" : "Workplace"}
        hint={student ? undefined : "Name of your company."}
        autoComplete="organization"
        maxLength={60}
        value={d.workplace}
        onChange={(workplace) => set({ workplace })}
        error={errors.workplace}
      />
      <Choice
        legend={`Who can see your ${student ? "college" : "workplace"}?`}
        name="workplaceVisibility"
        options={NAME_VISIBILITY}
        value={d.workplaceVisibility}
        onChange={(workplaceVisibility) => set({ workplaceVisibility })}
      />
    </>
  );
}

export function BioStep({ d, set, errors }: StepProps) {
  return (
    <TextAreaField
      id="bio"
      label="Your bio"
      hint="Show your personality in a line or two."
      placeholder="Early riser, chai addict, weekend cook…"
      maxLength={BIO_MAX}
      value={d.bio}
      onChange={(bio) => set({ bio })}
      error={errors.bio}
    />
  );
}

export function RoomTypeStep({ d, set, errors, next }: StepProps) {
  return (
    <Choice
      legend={d.intent === "host" ? "I'm renting out a" : "I'm looking for a"}
      hint="This is visible to everyone."
      name="roomType"
      options={ROOM_TYPE_CHOICES}
      value={d.roomType === "private" || d.roomType === "shared" ? d.roomType : null}
      onChange={(roomType) => set({ roomType })}
      onPick={next}
      error={errors.roomType}
    />
  );
}

export function SectorsStep({ d, set, errors }: StepProps) {
  const host = d.intent === "host";
  return (
    <SectorPicker
      label={host ? "Sector or locality" : "Sectors or localities"}
      hint={
        host
          ? "Pick one. This is visible to everyone."
          : "Pick up to 3. Choose from the list, or search for another."
      }
      max={host ? 1 : 3}
      value={d.sectors}
      onChange={(sectors) => set({ sectors })}
      error={errors.sectors}
      suggestionsFirst
      allowCustom={false}
    />
  );
}

export function BudgetStep({ d, set, errors }: StepProps) {
  return (
    <>
      <p className="text-base text-plum">
        The most you would pay each month, including room rent, maintenance and furniture rent.
      </p>
      <p className="text-sm text-plum -mt-3">
        Nobody else can see this. We only use it to show you rooms within your budget.
      </p>
      <BudgetSlider
        value={d.budgetMax}
        onChange={(budgetMax) => set({ budgetMax })}
        error={errors.budgetMax}
      />
    </>
  );
}

export function MoveInStep({ d, set, errors }: StepProps) {
  return (
    <TextField
      id="moveIn"
      label="Move-in date"
      hint="This is visible to everyone."
      type="date"
      min={todayISO()}
      value={d.moveIn}
      onChange={(moveIn) => set({ moveIn })}
      error={errors.moveIn}
    />
  );
}

export function DealBreakersStep({ d, set }: StepProps) {
  return (
    <MultiChoice
      legend="Deal-breakers"
      hint="Tap any that you can't live with. If none of these bother you, just continue. These are visible to everyone."
      name="dealBreakers"
      hideLegend
      options={DEAL_BREAKERS}
      value={d.dealBreakers}
      onChange={(dealBreakers) => set({ dealBreakers })}
    />
  );
}

export function FlatmatesStep({ d, set, errors, clear }: StepProps) {
  const clearAll = () => {
    for (let i = 0; i < FLATMATES_MAX; i++) {
      for (const f of ["gender", "occupation", "workplace"]) clear(`flatmates.${i}.${f}`);
    }
  };
  const update = (i: number, patch: Partial<Flatmate>) => {
    set({ flatmates: d.flatmates.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
    for (const k of Object.keys(patch)) clear(`flatmates.${i}.${k}`);
    if ("occupation" in patch) clear(`flatmates.${i}.workplace`);
  };
  const add = () => {
    clearAll();
    set({ flatmates: [...d.flatmates, emptyFlatmate()] });
  };
  const remove = (i: number) => {
    clearAll();
    set({ flatmates: d.flatmates.filter((_, j) => j !== i) });
  };

  const who = d.workplaceVisibility === "matches" ? "matches only" : "everyone";
  return (
    <>
      <p className="text-sm text-plum">
        Gender and occupation are visible to everyone. Workplace or college is visible to {who}, the same as
        yours.
      </p>
      {d.flatmates.map((f, i) => (
        <section
          key={i}
          aria-label={`Flatmate ${i + 1}`}
          className="flex flex-col gap-4 border-t-2 border-sand pt-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold text-ink">Flatmate {i + 1}</h2>
            <button
              type="button"
              onClick={() => remove(i)}
              className="font-bold underline underline-offset-2 text-plum min-h-[44px] px-2 -mr-2"
            >
              Remove
            </button>
          </div>
          <Choice
            legend="Gender"
            name={`flatmate-${i}-gender`}
            options={GENDERS}
            value={f.gender}
            onChange={(gender) => update(i, { gender })}
            error={errors[`flatmates.${i}.gender`]}
          />
          <Choice
            legend="Occupation"
            name={`flatmate-${i}-occupation`}
            options={OCCUPATIONS}
            value={f.occupation}
            onChange={(occupation) => update(i, { occupation })}
            error={errors[`flatmates.${i}.occupation`]}
          />
          {f.occupation && (
            <TextField
              id={`flatmate-${i}-workplace`}
              label={f.occupation === "student" ? "College" : "Workplace"}
              maxLength={60}
              value={f.workplace}
              onChange={(workplace) => update(i, { workplace })}
              error={errors[`flatmates.${i}.workplace`]}
            />
          )}
        </section>
      ))}
      {d.flatmates.length < FLATMATES_MAX ? (
        <button type="button" onClick={add} className="btn btn-secondary w-full">
          {d.flatmates.length === 0 ? "Add a flatmate" : "Add another flatmate"}
        </button>
      ) : (
        <p className="text-sm text-plum">That&apos;s the maximum of {FLATMATES_MAX} flatmates.</p>
      )}
    </>
  );
}

export function FlatBioStep({ d, set, errors }: StepProps) {
  return (
    <TextAreaField
      id="flatBio"
      label="About the flat"
      hint="Tell people about the flat and who lives there."
      placeholder="Sunny 3BHK, friendly crowd, weekend movie nights…"
      maxLength={BIO_MAX}
      value={d.flatBio}
      onChange={(flatBio) => set({ flatBio })}
      error={errors.flatBio}
    />
  );
}

export function FurnishingStep({ d, set, errors, next }: StepProps) {
  return (
    <Choice
      legend="The room is"
      hint="This is visible to everyone."
      name="furnishing"
      options={FURNISHINGS}
      value={d.furnishing}
      onChange={(furnishing) => set({ furnishing })}
      onPick={next}
      error={errors.furnishing}
    />
  );
}

export function SocietyStep({ d, set, errors }: StepProps) {
  return (
    <>
      <TextField
        id="society"
        label="Society or area name"
        hint="The name of your society, building or area."
        autoComplete="off"
        maxLength={60}
        value={d.society}
        onChange={(society) => set({ society })}
        error={errors.society}
      />
      <Choice
        legend="Who can see this?"
        name="societyVisibility"
        options={NAME_VISIBILITY}
        value={d.societyVisibility}
        onChange={(societyVisibility) => set({ societyVisibility })}
      />
    </>
  );
}

export function BhkStep({ d, set, errors, next }: StepProps) {
  return (
    <Choice
      legend="Flat size"
      hint="This is visible to everyone."
      name="bhk"
      options={BHKS}
      value={d.bhk}
      onChange={(bhk) => set({ bhk })}
      onPick={next}
      error={errors.bhk}
    />
  );
}

export function FlatmateCountStep({ d, set, errors, next }: StepProps) {
  return (
    <Choice
      legend="Flatmates living there now"
      hint="Not counting you. This is visible to everyone."
      name="flatmateCount"
      options={FLATMATE_COUNTS}
      value={d.flatmateCount}
      onChange={(flatmateCount) => set({ flatmateCount })}
      onPick={next}
      error={errors.flatmateCount}
    />
  );
}

export function AvailableFromStep({ d, set, errors }: StepProps) {
  return (
    <TextField
      id="availableFrom"
      label="Available from"
      hint="This is visible to everyone."
      type="date"
      min={todayISO()}
      value={d.availableFrom}
      onChange={(availableFrom) => set({ availableFrom })}
      error={errors.availableFrom}
    />
  );
}

const iconProps = {
  className: "w-6 h-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const ICON_SOFA = (
  <svg {...iconProps}>
    <path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
    <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z" />
    <path d="M6 18v2M18 18v2" />
  </svg>
);
const ICON_BROOM = (
  <svg {...iconProps}>
    <path d="M19 3l-6 6" />
    <path d="M11 7l6 6-3 1-5 6H4l1-5 5-6z" />
  </svg>
);
const ICON_CHEF = (
  <svg {...iconProps}>
    <path d="M7 14a4 4 0 0 1-1-7.9A4 4 0 0 1 12 4a4 4 0 0 1 6 2.1A4 4 0 0 1 17 14" />
    <path d="M7 14v6h10v-6" />
  </svg>
);

/** An extra the host charges for. If an amount is entered, the host says whether the tenant can skip it. */
function ExtraCost({
  id,
  label,
  icon,
  value,
  optional,
  onChange,
  onOptional,
  error,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  optional: boolean;
  onChange: (v: string) => void;
  onOptional: (v: boolean) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <MoneyField
        id={id}
        label={
          <>
            <span className="text-plum [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
            {label}
          </>
        }
        hint="Per month. Enter 0 if none."
        value={value}
        onChange={onChange}
        error={error}
      />
      <Switch
        label="Optional for the tenant"
        onText="The tenant can choose not to pay for this."
        offText="The tenant has to pay for this."
        checked={optional}
        onChange={onOptional}
      />
    </div>
  );
}

export function RentStep({ d, set, errors }: StepProps) {
  return (
    <>
      <MoneyField
        id="rent"
        label="Monthly rent"
        hint="Include maintenance."
        value={d.rent}
        onChange={(rent) => set({ rent })}
        error={errors.rent}
      />
      <MoneyField
        id="deposit"
        label="Deposit"
        hint="Enter 0 if there is no deposit."
        value={d.deposit}
        onChange={(deposit) => set({ deposit })}
        error={errors.deposit}
      />
      <MoneyField
        id="oneTimeCost"
        label="One-time cost"
        hint="Any one-time charge. Enter 0 if none."
        value={d.oneTimeCost}
        onChange={(oneTimeCost) => set({ oneTimeCost })}
        error={errors.oneTimeCost}
      />
      <ExtraCost
        id="furnitureRent"
        label="Furniture rent"
        icon={ICON_SOFA}
        value={d.furnitureRent}
        optional={d.furnitureOptional}
        onChange={(furnitureRent) => set({ furnitureRent })}
        error={errors.furnitureRent}
        onOptional={(furnitureOptional) => set({ furnitureOptional })}
      />
      <ExtraCost
        id="maidCost"
        label="Maid cost"
        icon={ICON_BROOM}
        value={d.maidCost}
        optional={d.maidOptional}
        onChange={(maidCost) => set({ maidCost })}
        error={errors.maidCost}
        onOptional={(maidOptional) => set({ maidOptional })}
      />
      <ExtraCost
        id="cookCost"
        label="Cook cost"
        icon={ICON_CHEF}
        value={d.cookCost}
        optional={d.cookOptional}
        onChange={(cookCost) => set({ cookCost })}
        error={errors.cookCost}
        onOptional={(cookOptional) => set({ cookOptional })}
      />
    </>
  );
}

export function PhotosStep({ d, set, errors }: StepProps) {
  return (
    <PhotoGrid
      value={d.photos}
      onChange={(photos) => set({ photos })}
      max={PHOTOS_MAX}
      error={errors.photos}
    />
  );
}

export function AboutStep({ d, set, errors, next }: StepProps) {
  return (
    <>
      <Choice
        legend="I'm moving as"
        name="household"
        options={HOUSEHOLDS}
        value={d.household}
        onChange={(household) => set({ household })}
        onPick={next}
        error={errors.household}
      />
    </>
  );
}

export function WashroomStep({ d, set, errors, next }: StepProps) {
  return (
    <Choice
      legend="Attached washroom?"
      hint="This is visible to everyone."
      name="washroom"
      options={WASHROOMS}
      value={d.washroom}
      onChange={(washroom) => set({ washroom })}
      onPick={next}
      error={errors.washroom}
    />
  );
}

