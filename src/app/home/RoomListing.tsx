"use client";

import PhotoCarousel from "./PhotoCarousel";
import {
  FURNISHING_LABEL,
  availability,
  bhkLabel,
  extras,
  inr,
  occupationLabel,
  ruleLabel,
  type RoomCard,
} from "../lib/rooms";

const chip = "inline-flex items-center rounded-full bg-sand px-3 py-1 text-sm font-semibold text-plum";

export default function RoomListing({
  room,
  interested,
  onToggleInterest,
}: {
  room: RoomCard;
  interested: boolean;
  onToggleInterest: () => void;
}) {
  const { items, compulsory, optional } = extras(room);
  const place = [room.sector, room.society].filter(Boolean).join(" · ");
  const label = `${bhkLabel(room.bhk)} in ${room.sector}`;
  const host = room.host;
  const hostLine = host.first_name
    ? `Hosted by ${host.first_name}${host.age ? `, ${host.age}` : ""}`
    : host.age
      ? `Host, ${host.age}`
      : "Host details are visible after you match";

  return (
    <article className="flex flex-col gap-4" aria-labelledby={`room-${room.listing_id}`}>
      <PhotoCarousel photos={room.photos} label={label} />

      <div className="flex flex-col gap-3">
        <div>
          <p className="font-display text-[28px] leading-none font-extrabold text-ink">
            {inr(room.mandatory_monthly_cost)}
            <span className="ml-1 text-base font-semibold text-plum">/ month</span>
          </p>
          {(compulsory.length > 0 || optional.length > 0) && (
            <p className="mt-1 text-sm text-plum">
              {compulsory.length > 0
                ? `Rent ${inr(room.rent)} + ${compulsory.map((c) => `${c.label.toLowerCase()} ${inr(c.cost)}`).join(" + ")}.`
                : `Rent ${inr(room.rent)}.`}
              {optional.length > 0 &&
                ` Optional: ${optional.map((o) => `${o.label.toLowerCase()} ${inr(o.cost)}`).join(", ")}.`}
            </p>
          )}
        </div>

        <div>
          <h3 id={`room-${room.listing_id}`} className="text-lg font-bold text-ink leading-snug">
            {room.bio}
          </h3>
          <p className="mt-1 text-sm font-semibold text-plum">
            {place} · {bhkLabel(room.bhk)}
          </p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Room features">
          <li className={chip}>{room.room_type === "private" ? "Private room" : "Shared room"}</li>
          <li className={chip}>{FURNISHING_LABEL[room.furnishing]}</li>
          {room.attached_washroom && <li className={chip}>Attached washroom</li>}
          <li className={chip}>
            {room.flatmate_count} flatmate{room.flatmate_count === 1 ? "" : "s"}
          </li>
          <li className={`${chip} !bg-apricot/40 !text-ink`}>{availability(room.available_from)}</li>
        </ul>

        {room.house_rules.length > 0 && (
          <p className="text-sm text-plum">
            <span className="font-bold">House rules:</span> {room.house_rules.map(ruleLabel).join(", ")}
          </p>
        )}

        <details className="group rounded-[14px] border-2 border-sand bg-paper px-4 py-1">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-bold text-ink">
            Costs and people
            <svg className="h-5 w-5 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 pb-3 pt-1 text-sm">
            <dt className="text-plum">Monthly rent</dt>
            <dd className="font-semibold text-ink">{inr(room.rent)}</dd>
            {items.map((i) => (
              <div key={i.label} className="contents">
                <dt className="text-plum">
                  {i.label} {i.optional ? "(optional)" : "(compulsory)"}
                </dt>
                <dd className="font-semibold text-ink">{inr(i.cost)}</dd>
              </div>
            ))}
            <dt className="text-plum">Deposit</dt>
            <dd className="font-semibold text-ink">{room.deposit > 0 ? inr(room.deposit) : "None"}</dd>
            {room.one_time_cost > 0 && (
              <>
                <dt className="text-plum">One-time cost</dt>
                <dd className="font-semibold text-ink">{inr(room.one_time_cost)}</dd>
              </>
            )}
          </dl>
          <div className="border-t-2 border-sand py-3 text-sm text-plum">
            <p className="font-bold text-ink">{hostLine}</p>
            <p>
              {occupationLabel(host.occupation)}
              {host.workplace ? `, ${host.workplace}` : ""}
            </p>
            {room.flatmates.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1">
                {room.flatmates.map((f, i) => (
                  <li key={i}>
                    Flatmate {i + 1}: {f.gender === "female" ? "Female" : "Male"}, {occupationLabel(f.occupation)}
                    {f.workplace ? `, ${f.workplace}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>

        <button
          type="button"
          onClick={onToggleInterest}
          aria-pressed={interested}
          className={`btn w-full ${interested ? "btn-secondary" : "btn-primary"}`}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill={interested ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 21s-7-4.6-9.3-9.2C1.2 8.6 3 5 6.5 5c2 0 3.5 1.2 5.5 3.3C14 6.2 15.500 5 17.500 5 21 5 22.800 8.600 21.300 11.800 19 16.400 12 21 12 21z" />
          </svg>
          {interested ? "Interested" : "I'm interested"}
        </button>
      </div>
    </article>
  );
}
