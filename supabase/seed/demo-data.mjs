// Generates synthetic demo data for twenty49: people, rooms, flatmates and illustrated room photos.
//
//   node supabase/seed/demo-data.mjs <output folder>
//
// It writes  <output>/demo-data.sql  and  <output>/photos/<host id>/<listing id>/<n>.webp.
// Everything is tagged raw_user_meta_data.synthetic = true, so it can be removed in one go:
//   delete from auth.users where raw_user_meta_data ->> 'synthetic' = 'true';
// (profiles, listings, photo records, flatmates and interests are deleted with them).
// The names, companies and societies are made up. Same seed gives the same data.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const out = process.argv[2];
if (!out) throw new Error("Usage: node demo-data.mjs <output folder>");
fs.mkdirSync(path.join(out, "photos"), { recursive: true });

/* ───────── seeded random ───────── */
let seed = 20490;
const rnd = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const chance = (p) => rnd() < p;
const shuffle = (arr) => arr.map((v) => [rnd(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const uuid = () => {
  const h = Array.from({ length: 32 }, () => Math.floor(rnd() * 16).toString(16));
  h[12] = "4"; h[16] = "89ab"[Math.floor(rnd() * 4)];
  const s = h.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
};
const q = (s) => (s === null || s === undefined ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const arr = (a) => `'{${a.join(",")}}'`;

/* ───────── vocabulary ───────── */
const FEMALE = ["Aisha","Ananya","Diya","Ishita","Kavya","Meera","Naina","Pooja","Riya","Sanya","Tanvi","Zoya","Aditi","Bhavna","Charu","Devika","Esha","Garima","Harini","Isha","Jhanvi","Kriti","Lavanya","Mitali","Nidhi","Palak","Rhea","Shreya","Tara","Vidhi"];
const MALE = ["Aarav","Arjun","Dev","Harsh","Ishaan","Karan","Kabir","Manav","Neel","Rohan","Sahil","Tanmay","Varun","Yash","Aditya","Bhavesh","Chirag","Dhruv","Farhan","Gaurav","Hemant","Jai","Kunal","Lakshya","Mohit","Nikhil","Pranav","Rishi","Sameer","Vikram"];
const SURNAME = ["Sharma","Verma","Gupta","Singh","Mehta","Kapoor","Reddy","Nair","Iyer","Khan","Joshi","Malhotra","Bose","Chopra","Desai","Bhatia","Saxena","Menon","Rao","Tandon"];
const COMPANIES = ["Nimbus Labs","Quantix","Brightpath","Zenith Finserv","Orbit Retail","Kite Analytics","Lumen Health","Verdant Energy","Pixel & Co","Cobalt Consulting","Summit Logistics","Aster Pharma","Delta Media","Fable Games","Helix Bank"];
const COLLEGES = ["Amity University","Delhi University","Manav Rachna","GD Goenka University","NorthCap University","IMT Ghaziabad","MDI Gurgaon","Ashoka University"];
const SOCIETIES = ["Greenwood Heights","Palm Residency","Orchid Gardens","The Skyline","Maple Court","Silver Oaks","Lotus Apartments","Sunrise Towers","Cedar Residency","Willow Park","Marigold Enclave","Aurora Heights","Jasmine Villas","Birchwood Homes","Coral Bay","Sapphire Greens","Emerald Court","Indigo Towers","Heritage Square","Harmony Homes"];
const SECTORS = ["Sector 49","Sector 49","Sector 56","Sector 56","Sector 57","Sector 50","Sector 54","Sector 82","Sector 82","Sector 83","Sector 84","Sector 65","Sector 67","Sector 43","Sector 45","Sector 28","Sector 29","Sector 14","Sector 15","Sector 21","Sector 22","Sector 31","Sector 40","DLF Phase 2","DLF Phase 2","DLF Phase 3","DLF Phase 3","DLF Phase 4","DLF Phase 5","Golf Course Road","Golf Course Road","Sohna Road","Sohna Road","Sushant Lok 1","Sushant Lok 2","MG Road","South City 1","Nirvana Country","Palam Vihar","Udyog Vihar"];
const PREMIUM = { "DLF Phase 2": 1.3, "DLF Phase 3": 1.3, "DLF Phase 4": 1.25, "DLF Phase 5": 1.4, "Golf Course Road": 1.5, "Sushant Lok 1": 1.15, "Sushant Lok 2": 1.1, "MG Road": 1.2, "Sector 54": 1.25, "Sector 57": 1.1, "Sector 49": 1.1, "Sector 56": 1.1, "Sohna Road": 0.95, "Sector 82": 0.9, "Sector 83": 0.85, "Sector 84": 0.8 };
const BIO_OPEN = ["Sunny","Spacious","Airy","Cosy","Bright","Quiet","Modern","Homely","Well-kept","Breezy"];
const BIO_FLAT = { rk: "studio", 1: "1BHK", 2: "2BHK", 3: "3BHK", 4: "4BHK", 5: "5BHK" };
const BIO_END = ["friendly crowd, weekend movie nights.","chai on the balcony, easy-going people.","great metro access, calm evenings.","everyone cooks on Sundays.","pet-friendly, plants everywhere.","close to cafes and the gym.","early risers, tidy and respectful.","big balcony, good light all day.","work-from-home friendly, fast wifi.","board games and quiet weekends."];

const sectorUse = new Set();

/* ───────── people ───────── */
const users = [], profiles = [], prefs = [], seekerSectors = [], listings = [], flatmates = [], photos = [];
const used = new Set();
const nameFor = (g) => {
  for (;;) {
    const n = `${pick(g === "female" ? FEMALE : MALE)} ${pick(SURNAME)}`;
    if (!used.has(n)) { used.add(n); return n; }
  }
};
const newUser = (n) => {
  const id = uuid();
  users.push(`(${q(id)}, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', ${q(`demo.${n}@twenty49.invalid`)}, '{"synthetic": true}', now(), now())`);
  return id;
};
const addProfile = (id, intent, gender, extra = {}) => {
  const student = chance(intent === "seek" ? 0.35 : 0.1);
  const row = {
    id, intent, gender,
    name: nameFor(gender),
    nv: chance(0.6) ? "everyone" : "matches",
    by: new Date().getFullYear() - (student ? int(19, 25) : int(24, 38)),
    av: chance(0.8) ? "everyone" : "matches",
    occ: student ? "student" : "working",
    work: student ? pick(COLLEGES) : pick(COMPANIES),
    wv: chance(0.4) ? "everyone" : "matches",
    bio: intent === "seek" ? `${pick(["Early riser","Night owl","Foodie","Reader","Runner","Cricket fan","Plant parent"])}, ${pick(["tidy","easy-going","quiet","fun","organised"])}, ${pick(["loves cooking","into music","gym every day","weekend trekker","board games fan"])}.` : null,
    ...extra,
  };
  profiles.push(row);
  return row;
};

/* hosts and their rooms: 48 female households, 32 male households */
const TODAY = new Date();
const addDays = (d) => { const x = new Date(TODAY); x.setDate(x.getDate() + d); return x.toISOString().slice(0, 10); };
const hostPlan = [...Array(48).fill("female"), ...Array(32).fill("male")];
hostPlan.forEach((gender, i) => {
  const hid = newUser(`host${i + 1}`);
  addProfile(hid, "host", gender);
  const lid = uuid();
  const sector = pick(SECTORS);
  sectorUse.add(sector);
  const bhk = pick(["rk", "1", "1", "2", "2", "2", "2", "3", "3", "3", "3", "4", "4", "5"]);
  const roomType = chance(0.68) ? "private" : "shared";
  const base = { rk: 8500, 1: 10500, 2: 13000, 3: 16000, 4: 19000, 5: 22000 }[bhk];
  const prem = PREMIUM[sector] ?? 1;
  const rent = Math.round((base * prem * (roomType === "shared" ? 0.55 : 1) * (0.85 + rnd() * 0.35)) / 500) * 500;
  const furnitureRent = chance(0.45) ? int(1, 4) * 500 : 0;
  const maidCost = chance(0.35) ? int(1, 3) * 500 : 0;
  const cookCost = chance(0.3) ? int(2, 5) * 500 : 0;
  const flatmateCount = Math.min(9, { rk: 1, 1: 1, 2: int(1, 2), 3: int(1, 3), 4: int(2, 4), 5: int(3, 5) }[bhk]);
  const rules = shuffle(["veg", "parties", "pets", "smoking"]).slice(0, int(0, 2));
  listings.push({
    id: lid, host: hid, bio: `${pick(BIO_OPEN)} ${BIO_FLAT[bhk]}, ${pick(BIO_END)}`.slice(0, 100),
    roomType, furnishing: pick(["furnished", "furnished", "semi", "semi", "unfurnished"]),
    washroom: roomType === "private" ? chance(0.65) : chance(0.3), bhk, flatmateCount,
    availableFrom: addDays(int(-3, 70)), sector, society: pick(SOCIETIES), socVis: chance(0.5) ? "everyone" : "matches",
    rent, deposit: rent * pick([1, 2, 2, 3]), oneTime: chance(0.25) ? int(1, 5) * 500 : 0,
    furnitureRent, furnitureOptional: furnitureRent > 0 && chance(0.6),
    maidCost, maidOptional: maidCost > 0 && chance(0.7),
    cookCost, cookOptional: cookCost > 0 && chance(0.7),
    rules, published: addDays(-int(0, 28)),
  });
  // flatmates: for most rooms; a few have someone of the other gender (those rooms won't match anyone)
  if (chance(0.65)) {
    const n = Math.min(flatmateCount, 5);
    for (let p = 0; p < n; p++) {
      const g = i % 12 === 5 && p === 0 ? (gender === "female" ? "male" : "female") : gender;
      const student = chance(0.2);
      flatmates.push({ listing: lid, position: p, gender: g, occ: student ? "student" : "working", work: student ? pick(COLLEGES) : pick(COMPANIES) });
    }
  }
});

/* seekers: 40 people looking for rooms */
for (let i = 0; i < 40; i++) {
  const gender = i % 5 < 3 ? "female" : "male";
  const id = newUser(`seeker${i + 1}`);
  addProfile(id, "seek", gender);
  const sectorsPicked = shuffle([...new Set(SECTORS)]).slice(0, int(1, 3));
  sectorsPicked.forEach((s) => sectorUse.add(s));
  prefs.push({ id, household: chance(0.85) ? "single" : "plusone", roomType: chance(0.7) ? "private" : "shared", budget: int(8, 30) * 1000, moveIn: addDays(int(3, 50)), rules: shuffle(["veg", "parties", "pets", "smoking"]).slice(0, int(0, 2)) });
  sectorsPicked.forEach((s, k) => seekerSectors.push({ id, slot: k + 1, sector: s }));
}

/* ───────── illustrated room photos ───────── */
const PALETTES = [
  { wall: "#F5E8CC", floor: "#C99A6B", accent: "#F34E3D", soft: "#FFAA76", deep: "#55263D" },
  { wall: "#E3D9EF", floor: "#B58E6A", accent: "#55263D", soft: "#F34E3D", deep: "#2B1020" },
  { wall: "#FDF6E6", floor: "#A9835F", accent: "#FFAA76", soft: "#E3D9EF", deep: "#55263D" },
  { wall: "#F0DCC0", floor: "#8C6A4A", accent: "#F34E3D", soft: "#E3D9EF", deep: "#2B1020" },
  { wall: "#DCEBE3", floor: "#B89774", accent: "#55263D", soft: "#FFAA76", deep: "#2B1020" },
  { wall: "#F6DDD3", floor: "#A07C58", accent: "#2B1020", soft: "#F34E3D", deep: "#55263D" },
];
const W = 1200, H = 900;
const sky = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE3F5"/><stop offset="1" stop-color="#F6EBD3"/></linearGradient>`;
const frame = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}"/><rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" rx="3" fill="#fff" opacity=".8"/>`;
const plant = (x, y, s, p) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="0" width="52" height="46" rx="8" fill="${p.accent}"/><path d="M0 0 C-50 -50 -40 -110 -8 -130 C-10 -80 -6 -40 0 0Z" fill="#4F8A5B"/><path d="M0 0 C45 -40 50 -100 14 -140 C20 -90 8 -40 0 0Z" fill="#6AAE74"/><path d="M0 0 C-6 -60 4 -120 0 -150 C16 -110 12 -50 0 0Z" fill="#3F7A4C"/></g>`;
const lamp = (x, y, p) => `<g transform="translate(${x} ${y})"><rect x="-4" y="0" width="8" height="110" fill="${p.deep}"/><path d="M-42 0 L42 0 L26 -70 L-26 -70Z" fill="${p.soft}"/><ellipse cx="0" cy="116" rx="30" ry="8" fill="${p.deep}"/></g>`;
const window_ = (x, y, w, h, p, id) => `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="8" fill="${p.deep}" opacity=".85"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/><rect x="${x + w / 2 - 5}" y="${y}" width="10" height="${h}" fill="${p.deep}" opacity=".85"/><rect x="${x}" y="${y + h / 2 - 5}" width="${w}" height="10" fill="${p.deep}" opacity=".85"/><path d="M${x + 20} ${y + h - 40} l40 -50 l30 30 l45 -60 l60 80z" fill="#fff" opacity=".35"/>`;

const scenes = {
  bedroom(p) {
    const wx = int(120, 700);
    return `<defs>${sky("s")}</defs><rect width="${W}" height="${H}" fill="${p.wall}"/><rect y="640" width="${W}" height="260" fill="${p.floor}"/><rect y="630" width="${W}" height="16" fill="#00000018"/>
      ${window_(wx, 140, 240, 280, p, "s")}<rect x="${wx - 40}" y="120" width="44" height="340" fill="${p.soft}" opacity=".9"/><rect x="${wx + 258}" y="120" width="44" height="340" fill="${p.soft}" opacity=".9"/>
      ${frame(wx + 380, 170, 150, 190, p.accent)}${frame(wx + 560, 200, 110, 140, p.soft)}
      <ellipse cx="560" cy="780" rx="360" ry="60" fill="${p.soft}" opacity=".55"/>
      <rect x="250" y="400" width="520" height="150" rx="20" fill="${p.deep}"/><rect x="230" y="500" width="560" height="190" rx="26" fill="#fff"/><rect x="230" y="560" width="560" height="130" rx="26" fill="${p.accent}"/><rect x="270" y="470" width="190" height="80" rx="30" fill="${p.soft}"/><rect x="500" y="470" width="190" height="80" rx="30" fill="#fff" stroke="${p.soft}" stroke-width="6"/><rect x="230" y="690" width="40" height="40" fill="${p.deep}"/><rect x="750" y="690" width="40" height="40" fill="${p.deep}"/>
      <rect x="840" y="560" width="130" height="130" rx="10" fill="${p.deep}"/><rect x="860" y="600" width="90" height="10" fill="${p.soft}"/>${lamp(905, 440, p)}${plant(1090, 690, 1.2, p)}`;
  },
  living(p) {
    return `<defs>${sky("s")}</defs><rect width="${W}" height="${H}" fill="${p.wall}"/><rect y="650" width="${W}" height="250" fill="${p.floor}"/>
      ${window_(int(800, 880), 150, 220, 300, p, "s")}${frame(150, 160, 200, 140, p.accent)}${frame(380, 190, 120, 160, p.soft)}
      <ellipse cx="520" cy="790" rx="420" ry="70" fill="${p.deep}" opacity=".18"/>
      <rect x="180" y="470" width="620" height="170" rx="40" fill="${p.accent}"/><rect x="150" y="530" width="100" height="170" rx="30" fill="${p.deep}"/><rect x="750" y="530" width="100" height="170" rx="30" fill="${p.deep}"/><rect x="260" y="420" width="190" height="120" rx="36" fill="${p.soft}"/><rect x="520" y="420" width="190" height="120" rx="36" fill="#fff"/>
      <rect x="320" y="720" width="360" height="80" rx="14" fill="${p.deep}"/><rect x="340" y="730" width="320" height="16" rx="8" fill="${p.soft}"/>
      <rect x="860" y="500" width="260" height="170" rx="10" fill="${p.deep}"/><rect x="876" y="516" width="228" height="120" fill="#1B1B24"/>${lamp(130, 520, p)}${plant(1100, 700, 1.3, p)}`;
  },
  kitchen(p) {
    const tiles = Array.from({ length: 8 }, (_, r) => Array.from({ length: 16 }, (_, c) => `<rect x="${c * 75 + 2}" y="${300 + r * 38}" width="70" height="34" fill="#fff" opacity="${(r + c) % 2 ? 0.8 : 0.55}"/>`).join("")).join("");
    return `<rect width="${W}" height="${H}" fill="${p.wall}"/>${tiles}<rect y="700" width="${W}" height="200" fill="${p.floor}"/>
      <rect x="40" y="60" width="1120" height="200" rx="10" fill="${p.accent}"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${60 + i * 185}" y="80" width="165" height="160" rx="6" fill="${p.soft}" opacity=".85"/><rect x="${130 + i * 185}" y="210" width="26" height="8" rx="4" fill="${p.deep}"/>`).join("")}
      <rect x="40" y="580" width="940" height="130" fill="${p.deep}"/><rect x="30" y="560" width="960" height="30" fill="#fff"/>${Array.from({ length: 5 }, (_, i) => `<rect x="${60 + i * 185}" y="600" width="165" height="100" rx="6" fill="${p.accent}"/><rect x="${130 + i * 185}" y="615" width="26" height="8" rx="4" fill="#fff"/>`).join("")}
      <rect x="330" y="520" width="300" height="40" rx="6" fill="#2E2E36"/><circle cx="390" cy="540" r="16" fill="#555"/><circle cx="480" cy="540" r="16" fill="#555"/><circle cx="570" cy="540" r="16" fill="#555"/>
      <rect x="1010" y="270" width="150" height="440" rx="12" fill="#fff" stroke="${p.deep}" stroke-width="8"/><rect x="1020" y="470" width="130" height="8" fill="${p.deep}"/><rect x="1130" y="380" width="8" height="60" rx="4" fill="${p.deep}"/>${plant(130, 560, 0.9, p)}`;
  },
  balcony(p) {
    const b = Array.from({ length: 9 }, (_, i) => { const w = int(70, 130), h = int(120, 380), x = i * 140 + int(-10, 20); return `<rect x="${x}" y="${470 - h}" width="${w}" height="${h + 40}" fill="${i % 2 ? p.deep : p.accent}" opacity="${0.35 + (i % 3) * 0.12}"/>${Array.from({ length: Math.floor(h / 46) }, (_, r) => `<rect x="${x + 14}" y="${470 - h + 16 + r * 46}" width="${w - 28}" height="14" fill="#fff" opacity=".5"/>`).join("")}`; }).join("");
    return `<defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC9A0"/><stop offset=".6" stop-color="#FFE9CF"/><stop offset="1" stop-color="#F6EBD3"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#d)"/><circle cx="${int(200, 1000)}" cy="190" r="74" fill="#fff" opacity=".7"/>${b}
      <rect y="560" width="${W}" height="340" fill="${p.floor}"/><rect y="500" width="${W}" height="14" fill="${p.deep}"/>${Array.from({ length: 24 }, (_, i) => `<rect x="${10 + i * 50}" y="514" width="10" height="150" fill="${p.deep}"/>`).join("")}<rect y="660" width="${W}" height="14" fill="${p.deep}"/>
      <rect x="170" y="700" width="260" height="14" rx="6" fill="${p.accent}"/><rect x="190" y="714" width="12" height="110" fill="${p.deep}"/><rect x="398" y="714" width="12" height="110" fill="${p.deep}"/><rect x="230" y="620" width="140" height="80" rx="30" fill="${p.soft}"/>${plant(760, 730, 1.4, p)}${plant(930, 740, 1, p)}${plant(1060, 735, 1.2, p)}`;
  },
};
const sceneOrder = ["bedroom", "living", "kitchen", "balcony", "bedroom", "living"];

const render = async (name, svg, file) => {
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${svg}</svg>`))
    .webp({ quality: 78 }).toFile(file);
};

let count = 0;
for (const l of listings) {
  const dir = path.join(out, "photos", l.host, l.id);
  fs.mkdirSync(dir, { recursive: true });
  const p = pick(PALETTES);
  const n = int(3, 5);
  for (let k = 0; k < n; k++) {
    await render(sceneOrder[k], scenes[sceneOrder[k]](p), path.join(dir, `${k + 1}.webp`));
    photos.push({ listing: l.id, position: k, path: `${l.host}/${l.id}/${k + 1}.webp` });
    count++;
  }
}

/* ───────── SQL ───────── */
const sql = [];
sql.push("-- Synthetic demo data for twenty49 (generated by supabase/seed/demo-data.mjs). Remove with:\n--   delete from auth.users where raw_user_meta_data ->> 'synthetic' = 'true';\n");
sql.push(`insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at) values\n${users.join(",\n")};\n`);
sql.push(`insert into public.profiles (id, intent, full_name, name_visibility, gender, birth_year, age_visibility, occupation, workplace, workplace_visibility, bio, onboarding_completed_at) values\n${profiles.map((p) => `(${q(p.id)}, ${q(p.intent)}, ${q(p.name)}, ${q(p.nv)}, ${q(p.gender)}, ${p.by}, ${q(p.av)}, ${q(p.occ)}, ${q(p.work)}, ${q(p.wv)}, ${q(p.bio)}, now())`).join(",\n")};\n`);
sql.push(`insert into public.seeker_preferences (profile_id, household, room_type, budget_max, move_in, deal_breakers) values\n${prefs.map((p) => `(${q(p.id)}, ${q(p.household)}, ${q(p.roomType)}, ${p.budget}, ${q(p.moveIn)}, ${arr(p.rules)})`).join(",\n")};\n`);
sql.push(`insert into public.seeker_sectors (seeker_id, slot, sector_id) values\n${seekerSectors.map((s) => `(${q(s.id)}, ${s.slot}, (select id from public.sectors where name = ${q(s.sector)}))`).join(",\n")};\n`);
sql.push(`insert into public.listings (id, host_id, status, bio, room_type, furnishing, attached_washroom, bhk, flatmate_count, available_from, sector_id, society, society_visibility, rent, deposit, one_time_cost, furniture_rent, furniture_optional, maid_cost, maid_optional, cook_cost, cook_optional, house_rules, published_at) values\n${listings.map((l) => `(${q(l.id)}, ${q(l.host)}, 'active', ${q(l.bio)}, ${q(l.roomType)}, ${q(l.furnishing)}, ${l.washroom}, ${q(l.bhk)}, ${l.flatmateCount}, ${q(l.availableFrom)}, (select id from public.sectors where name = ${q(l.sector)}), ${q(l.society)}, ${q(l.socVis)}, ${l.rent}, ${l.deposit}, ${l.oneTime}, ${l.furnitureRent}, ${l.furnitureOptional}, ${l.maidCost}, ${l.maidOptional}, ${l.cookCost}, ${l.cookOptional}, ${arr(l.rules)}, ${q(l.published)})`).join(",\n")};\n`);
sql.push(`insert into public.listing_flatmates (listing_id, position, gender, occupation, workplace) values\n${flatmates.map((f) => `(${q(f.listing)}, ${f.position}, ${q(f.gender)}, ${q(f.occ)}, ${q(f.work)})`).join(",\n")};\n`);
sql.push(`insert into public.listing_photos (listing_id, position, storage_path) values\n${photos.map((p) => `(${q(p.listing)}, ${p.position}, ${q(p.path)})`).join(",\n")};\n`);
fs.writeFileSync(path.join(out, "demo-data.sql"), sql.join("\n"));
console.log(JSON.stringify({ users: users.length, hosts: hostPlan.length, seekers: prefs.length, listings: listings.length, flatmates: flatmates.length, photos: count, sectors: [...sectorUse].length }));
