/**
 * Namesake review for the enacted budgets (GAA 2020–2026): which DPWH program
 * families found by the place search ("Bukidnon") are works outside Bukidnon.
 * Writes src/bukidnon/exclusions-gaa.ts, which portal.config.ts publishes as
 * exclusions with reasons (About page). See docs/bukidnon-reference.md#namesake-review.
 *
 *   npx tsx scripts/bukidnon/review-namesakes.ts           review and write the file
 *   npx tsx scripts/bukidnon/review-namesakes.ts --list    also print every family and its class
 *   npx tsx scripts/bukidnon/review-namesakes.ts --fresh   ignore the cache and ask the API again
 *
 * Why it's needed: the GAA has no place or region, so a name search for
 * "Bukidnon" also finds the Davao–Bukidnon Road in Davao City, the East–West
 * lateral road "connecting Agusan del Sur to Bukidnon", and so on.
 *
 * How a family is judged, in order (first match wins):
 *  1. Listed under a Bukidnon district engineering office in any year: kept.
 *  2. Listed only under other district engineering offices: excluded (office).
 *  3. Central Office or a regional office (they build anywhere), so the name decides:
 *     a. it names a Bukidnon office, legislative district or institution: kept;
 *     b. it is a study filed under Region XI or XII: excluded;
 *     c. its location (the last part of the name) is outside Bukidnon: excluded;
 *     d. its location is Bukidnon or one of its towns: kept;
 *     e. a section of, or bridge on, a road that the GAA otherwise lists only under
 *        offices outside Bukidnon (by kilometre post where the road crosses the
 *        boundary, by bridge id for bridges): excluded; only under Bukidnon
 *        offices: kept;
 *     f. otherwise unresolved, and kept: a name match stays in unless the data
 *        shows it is elsewhere. Unresolved families are printed for the record.
 *
 * Requests (budget.bettergov.ph only, documented in docs/data-sources/budget-api.md):
 *   GET /api/v1/gaa/departments/18/programs?q=Bukidnon             the families
 *   GET /api/v1/gaa/years/{y}/departments/18/children?level=fpaps&parent=18-001
 *   GET /api/v1/gaa/years/{y}/departments/18/children?level=operating_units&parent=<fpap>
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { argv, cwd, env } from 'node:process';
import config from '../../portal.config.ts';
import { DEFAULT_API } from '../../src/config.ts';
import { GAA_YEARS } from '../../src/api/types.ts';

const list = argv.includes('--list');
const fresh = argv.includes('--fresh');
const API = (env.VITE_API_BASE || config.api || DEFAULT_API).replace(/\/+$/, '') + '/api/v1';
const place = config.scope.places?.[0];
if (!place) throw new Error('portal.config.ts names no place to review.');
const Q = place.q ?? place.label;
const CACHE = resolve(cwd(), 'node_modules/.cache/bukidnon-namesakes');
const OUT = resolve(cwd(), 'src/bukidnon/exclusions-gaa.ts');
mkdirSync(CACHE, { recursive: true });

interface Page<T> { data: T[]; next_cursor?: string | null }
interface Family { fam_key: string; name: string }
interface Fpap { year: number; id: string; description: string }
interface Unit { unit: string; year: number }

async function get<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const url = new URL(API + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url);
      if (r.ok) return (await r.json()) as T;
      if (attempt >= 6) throw new Error(`${r.status} ${url}`);
    } catch (err) {
      if (attempt >= 6) throw err;
    }
    await new Promise((res) => setTimeout(res, 1000 * 2 ** Math.min(attempt, 5)));
  }
}

async function cached<T>(name: string, load: () => Promise<T>): Promise<T> {
  const file = join(CACHE, name);
  if (!fresh && existsSync(file)) return JSON.parse(readFileSync(file, 'utf8')) as T;
  const value = await load();
  writeFileSync(file, JSON.stringify(value));
  return value;
}

async function pages<T>(path: string, params: Record<string, string | number>): Promise<T[]> {
  const rows: T[] = [];
  let cursor: string | null | undefined;
  do {
    const page: Page<T> = await get<Page<T>>(path, cursor ? { ...params, cursor } : params);
    rows.push(...page.data);
    cursor = page.next_cursor;
  } while (cursor);
  return rows;
}

// --- 1. The families, and the GAA lines (FPAPs) behind them, with their offices ---

const families = await cached('families.json', () => pages<Family>('/gaa/departments/18/programs', { q: Q, limit: 500 }));
const needle = Q.toLowerCase();
const fpaps = (
  await Promise.all(
    GAA_YEARS.map((year) =>
      cached(`fpaps-${year}.json`, async () =>
        (await pages<{ id: string; description: string }>(`/gaa/years/${year}/departments/18/children`, { level: 'fpaps', parent: '18-001', limit: 500 }))
          .filter((f) => f.description.toLowerCase().includes(needle))
          .map((f): Fpap => ({ year, id: f.id, description: f.description })),
      ),
    ),
  )
).flat();

const unitsFile = join(CACHE, 'units.json');
const unitsOf: Record<string, string[]> = !fresh && existsSync(unitsFile) ? JSON.parse(readFileSync(unitsFile, 'utf8')) : {};
const todo = fpaps.filter((f) => !unitsOf[`${f.year}|${f.id}`]);
for (let i = 0; i < todo.length; i += 6) {
  await Promise.all(
    todo.slice(i, i + 6).map(async (f) => {
      const r = await get<Page<{ description: string }>>(`/gaa/years/${f.year}/departments/18/children`, { level: 'operating_units', parent: f.id, limit: 50 });
      unitsOf[`${f.year}|${f.id}`] = r.data.map((u) => u.description);
    }),
  );
  if (i % 300 === 0) {
    writeFileSync(unitsFile, JSON.stringify(unitsOf));
    console.error(`offices: ${Math.min(i + 6, todo.length)} / ${todo.length}`);
  }
}
writeFileSync(unitsFile, JSON.stringify(unitsOf));

// A family is one name in one agency; its key is the name, normalised as the API does.
const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
const linesByName = new Map<string, Unit[]>();
for (const f of fpaps) {
  const k = norm(f.description);
  const units = unitsOf[`${f.year}|${f.id}`] ?? [];
  linesByName.set(k, [...(linesByName.get(k) ?? []), ...units.map((unit) => ({ unit, year: f.year }))]);
}

// --- 2. The rules ---

const TOWNS =
  'Baungon|Damulog|Dangcagan|Don Carlos|Impasug-? ?ong|Impasugong|Kadingilan|Kalilangan|Kibawe|Kitaotao|Lantapan|Libona|' +
  'Malaybalay(?: City)?|City of Malaybalay|Malitbog|Manolo Fortich|Maramag|Pangantucan|Quezon|San Fernando|Sumilao|Talakag|' +
  'Valencia(?: City)?|City of Valencia|Cabanglasan';
const NAMES_BUKIDNON_BODY = [
  /Bukidnon\s*\(?\s*(1st|2nd|3rd|4th|first|second|third|fourth|lone)\b/i,
  /\b(1st|2nd|3rd|4th|first|second|third|fourth)\s+(legislative\s+)?district,?\s+(of\s+)?Bukidnon/i,
  /Province of Bukidnon|Bukidnon Province|Bukidnon Provincial|Bukidnon State University|Northern Bukidnon State College|Central Mindanao University|Bukidnon Airport/i,
];
const STUDY_ELSEWHERE = /Regionwide ?\/ ?Nationwide.*-\s*Region (XI|XII)\s*-/i;
const OUTSIDE =
  /(Davao City|Davao del Norte|Davao del Sur|Davao De Oro|Compostela Valley|Agusan del Sur|Agusan del Norte|Surigao del Sur|Butuan City|Las Nieves|Misamis Oriental|Cagayan de Oro City|North Cotabato|Cotabato|Iligan City|Lanao del Norte|Marilog District|Calinan District|Santo Tomas)$/i;
const AT_BUKIDNON = [
  /^Bukidnon$/i,
  new RegExp(`(^|\\s)(${TOWNS})(\\s+Bukidnon)?$`, 'i'),
  // "… Kibawe–Arakan Road (Kibawe Section) Bukidnon", but not "… road connecting Agusan del Sur to Bukidnon".
  /(?<![-–/]\s*|\bto\s+)(?<=(Section|Road|Rd)\s+)Bukidnon$/i,
];
const TOWN_COMMA_BUKIDNON = new RegExp(`\\b(${TOWNS})\\s*,\\s*Bukidnon\\b`, 'i');
// Decided by hand: entries the rules can't place, with the evidence.
const BY_HAND: { match: RegExp; reason: string }[] = [
  {
    match: /^Jct\. Davao-Bukidnon Road \(Calinan Section\) . Wangan/,
    reason:
      'Listed under the DPWH Central Office. The other GAA entries for this road (Jct. Davao–Bukidnon Road (Calinan Section)–Wangan–…–Kapatagan Road) name Davao City or Davao del Sur as the location.',
  },
];

/** The location: the last comma-separated part of the name, without brackets or Package/Phase. */
function locationOf(name: string): string {
  const parts = name
    .replace(/\([^)]*\)?/g, ' ')
    .split(',')
    .map((x) => x.replace(/\b(package|phase|pkg)\s+[\w-]+/gi, ' ').replace(/[\s.]+/g, ' ').trim())
    .filter(Boolean);
  return parts.at(-1) ?? '';
}

const roadKey = (s: string) =>
  s.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s*\(\s*/g, ' (').replace(/\s*\)\s*/g, ') ').replace(/\broad\b/g, 'rd')
    .replace(/misamis oriental/g, 'misamis or').replace(/\b(brdy|bdry)\.?/g, 'bdry').replace(/\s+/g, ' ').trim();
const ROADS: [key: string, label: string][] = [
  ['paco-roxas-arakan valley-jct davao-bukidnon rd', 'Paco–Roxas–Arakan Valley–Jct Davao–Bukidnon Road'],
  ['sayre highway (jct bukidnon-davao city rd-cotabato bdry)', 'Sayre Highway (Jct Bukidnon–Davao City Road–Cotabato boundary)'],
  ['bukidnon-davao city rd', 'Bukidnon–Davao City Road'],
  ['kapalong-talaingod-valencia (bukidnon) rd', 'Kapalong–Talaingod–Valencia (Bukidnon) Road'],
  ['davao-bukidnon rd', 'Davao–Bukidnon Road'],
  ['bukidnon-cotabato rd', 'Bukidnon–Cotabato Road'],
  ['cdo-airport-bukidnon', 'CDO–Airport–Bukidnon Road'],
  ['misamis or-bukidnon-agusan rd', 'Misamis Oriental–Bukidnon–Agusan Road'],
  ['bukidnon bdry-north cotabato rd', 'Bukidnon Boundary–North Cotabato Road'],
];
/** A section of the road itself, or a bridge or works along it; not a feeder road from a junction with it. */
function roadOf(name: string) {
  const s = roadKey(name);
  return ROADS.find(([k]) => s.startsWith(k) || [`along ${k}`, `along-${k}`, `along the ${k}`, `at ${k}`].some((p) => s.includes(p)));
}
function kmPosts(name: string): [number, number] | null {
  const ks = [...name.matchAll(/K\s*(\d{4})/g)].map((m) => Number(m[1]));
  return ks.length ? [Math.min(...ks), Math.max(...ks)] : null;
}
const bridgeId = (name: string) => /B\d{5}MN/.exec(name.replace(/\s+/g, ''))?.[0] ?? null;

const isDeo = (u: string) => /District Engineering Office$/i.test(u);
const isBukidnonDeo = (u: string) => /^Bukidnon .*District Engineering Office$/i.test(u);

interface Judged { key: string; name: string; units: string[]; cls: string; reason: string }
const fams = families.map((f) => {
  const lines = linesByName.get(f.fam_key.split('|').slice(1).join('|')) ?? linesByName.get(norm(f.name)) ?? [];
  return { key: `gaa:${f.fam_key}`, name: f.name, lines, units: [...new Set(lines.map((l) => l.unit))] };
});

// Evidence: which district offices list sections of each road (with their kilometre span), and each bridge.
type Span = { min: number; max: number };
const roadEvidence: Record<string, Record<string, Span>> = {};
const bridgeEvidence: Record<string, Set<string>> = {};
for (const f of fams) {
  const deos = f.units.filter(isDeo);
  if (!deos.length) continue;
  const road = roadOf(f.name);
  const k = kmPosts(f.name);
  for (const u of deos) {
    if (road) {
      const e = ((roadEvidence[road[0]] ??= {})[u] ??= { min: Infinity, max: -Infinity });
      if (k) { e.min = Math.min(e.min, k[0]); e.max = Math.max(e.max, k[1]); }
    }
    const b = bridgeId(f.name);
    if (b) (bridgeEvidence[b] ??= new Set()).add(u);
  }
}

const yearsUnder = (lines: Unit[], unit: string) => [...new Set(lines.filter((l) => l.unit === unit).map((l) => l.year))].sort().join(', ');
const span = ([u, e]: [string, Span]) => (e.min <= e.max ? `${u} (K${e.min}–K${e.max})` : u);

const judged: Judged[] = fams.map((f) => {
  const j = (cls: string, reason = ''): Judged => ({ key: f.key, name: f.name, units: f.units, cls, reason });
  const where = `Listed under the DPWH ${f.units.join(' and ')}`;
  if (f.units.some(isBukidnonDeo)) return j('keep: Bukidnon office');
  if (f.units.length && f.units.every(isDeo)) {
    return j('exclude: office', `The GAA lists it under the ${f.units.map((u) => `${u} (${yearsUnder(f.lines, u)})`).join(' and the ')}, not a Bukidnon office.`);
  }
  if (NAMES_BUKIDNON_BODY.some((r) => r.test(f.name))) return j('keep: names a Bukidnon office, district or institution');
  const study = STUDY_ELSEWHERE.exec(f.name);
  if (study) return j('exclude: study elsewhere', `${where}; the name files it under Region ${study[1]} (${study[1] === 'XI' ? 'Davao Region' : 'SOCCSKSARGEN'}). Bukidnon is in Region X.`);
  const loc = locationOf(f.name);
  const outside = OUTSIDE.exec(loc);
  if (outside) return j('exclude: location', `${where}; the name places the work in ${outside[1]}, outside Bukidnon.`);
  if (AT_BUKIDNON.some((r) => r.test(loc)) || TOWN_COMMA_BUKIDNON.test(f.name)) return j('keep: location in Bukidnon');
  const hand = BY_HAND.find((h) => h.match.test(f.name));
  if (hand) return j('exclude: by hand', hand.reason);

  const road = roadOf(f.name);
  const b = bridgeId(f.name);
  if (b && bridgeEvidence[b]) {
    const us = [...bridgeEvidence[b]];
    if (us.some(isBukidnonDeo)) return j('keep: bridge under a Bukidnon office elsewhere');
    return j('exclude: bridge', `${where}. Elsewhere the GAA lists bridge ${b} under the ${us.join(' and the ')}, not a Bukidnon office.`);
  }
  if (road) {
    const ev = Object.entries(roadEvidence[road[0]] ?? {});
    const ours = ev.filter(([u]) => isBukidnonDeo(u));
    const theirs = ev.filter(([u]) => !isBukidnonDeo(u));
    if (theirs.length && !ours.length) {
      return j('exclude: road', `${where}. Every section of the ${road[1]} that the 2020–2026 GAA lists under a district office is under the ${theirs.map(span).join(' or the ')}; none is under a Bukidnon office.`);
    }
    if (ours.length && !theirs.length) return j('keep: road under Bukidnon offices');
    const k = kmPosts(f.name);
    if (ours.length && theirs.length && k) {
      const inOurs = ours.some(([, e]) => k[0] >= e.min && k[1] <= e.max);
      const inTheirs = theirs.some(([, e]) => k[0] >= e.min && k[1] <= e.max);
      if (inOurs && !inTheirs) return j('keep: road section under Bukidnon offices');
      if (inTheirs && !inOurs) {
        return j('exclude: road section', `${where}. Its kilometre posts (K${k[0]}–K${k[1]}) are on the stretch of the ${road[1]} that the GAA lists under the ${theirs.map(span).join(' or the ')}; the Bukidnon offices' sections start at K${Math.min(...ours.map(([, e]) => e.min))}.`);
      }
    }
  }
  return j('unresolved (kept)');
});

// --- 3. Report and write ---

const tally: Record<string, number> = {};
for (const x of judged) tally[x.cls] = (tally[x.cls] ?? 0) + 1;
console.log(`DPWH families whose name has "${Q}": ${families.length} (${fpaps.length} GAA lines, 2020–2026)`);
for (const [cls, n] of Object.entries(tally).sort()) console.log(`  ${cls.padEnd(52)} ${n}`);
const unresolved = judged.filter((x) => x.cls.startsWith('unresolved'));
if (unresolved.length) {
  console.log('\nUnresolved, kept (the data does not place them):');
  for (const x of unresolved) console.log(`  [${x.units.join(' | ')}] ${x.name}`);
}
if (list) for (const x of judged) console.log(`${x.cls}\t${x.key}\t${x.units.join(' | ')}\t${x.name}`);

const excluded = judged.filter((x) => x.cls.startsWith('exclude')).sort((a, b) => a.key.localeCompare(b.key));
const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
writeFileSync(
  OUT,
  `/**
 * Generated by scripts/bukidnon/review-namesakes.ts from budget.bettergov.ph. Do not edit by hand:
 * change the rules in the script and run it again (npx tsx scripts/bukidnon/review-namesakes.ts).
 *
 * DPWH program families (GAA 2020–2026) that the place search "${Q}" finds but whose GAA
 * entries put the work outside Bukidnon. ${excluded.length} of ${families.length} families.
 */
import type { Exclusion } from '../config';

export const gaaNamesakes: Exclusion[] = [
${excluded.map((x) => `  {\n    key: ${q(x.key)},\n    reason: ${q(x.reason)},\n  },`).join('\n')}
];
`,
);
console.log(`\nWrote ${excluded.length} exclusions to ${OUT}`);
