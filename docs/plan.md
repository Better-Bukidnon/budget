# Bukidnon Transparency Portal: plan

## Goal

Let any Bukidnon resident answer, in a few clicks and with a source for every number:

- **What does the national budget give Bukidnon**, and where: by district, by town, by
  agency, by year?
- **What changed** between the President's proposal (NEP) and the House bill for 2027?
- **What happened on the ground**: which roads, buildings and water systems were
  contracted, by whom, and are they finished?
- **Who decides**: which representative, which district office, which officials?

Audience: residents, local media, barangay and LGU staff, teachers and school heads,
students and researchers, and civil-society groups. Mobile first: most visitors will be on
phones with patchy data.

## What we start from

The template ([docs/architecture.md](architecture.md)) as configured for Bohol already
provides:

| Page | Content |
| --- | --- |
| **Projects** (`/`) | 2027 headline figures, DPWH offices in scope, every project with NEP vs House bill, six statuses, filters in the URL, CSV |
| **Budgets 2020–2026** (`/gaa`) | Each DEO's whole budget by year (grouped by Congress) with 2027 beside it; programs in any department whose name names the place; year totals; CSV |
| **A project** (`/projects/:program/:id`) | Every version's amount with a link to the exact PDF page, match method, notes |
| **About the data** (`/about`) | Every query with counts, exclusions with reasons, source documents, terms, notices |

Phase 1 gets Bukidnon to this level by **config alone**.

## What Bukidnon adds

All from bettergov.ph sources (see [data-sources/](data-sources/README.md)).

| # | Feature | Source | Why it matters here |
| --- | --- | --- | --- |
| F1 | **Overview home**: Bukidnon at a glance, with 2027 headline, 2020–2026 DEO trend, education, SUCs, top agencies, per-resident figure | Budget API, statistics | One place to start; the template opens straight into a project table |
| F2 | **District pages ×4** with the representative, the DEO that serves it (numbers don't match), its 2020–2027 money, the FY2027 bridge, its towns | Budget API district cards, officials | The 1st District ↔ 3rd DEO mismatch confuses everyone |
| F3 | **Town pages ×22** (2 cities, 20 municipalities): lines naming the town (2027 and 2020–2026), DPWH contracts in the town, schools, officials elected in 2025 | Budget API (name search + namesake rules), DPWH API, officials | The template's municipality mode depends on titles; we add contracts and officials, and publish the method |
| F4 | **Infrastructure tracker**: 4,229 DPWH contracts with status, progress, contract amount, contractor, dates; filters; map; "past completion date and under 100%" view | DPWH projects API (snapshot) | Shows what was built, not only what was budgeted |
| F5 | **Education**: 3 DepEd divisions (NEP 2027 vs GAA 2026, plus 2020–2026 history), schools with their own allotment, CMU / BukSU / NBSC 2020–2027 | Budget API NEP rollups and GAA hierarchy | The Division of Bukidnon alone was ₱8.17B enacted in 2026, more than the four DEOs combined (₱4.62B), yet the template doesn't show it |
| F6 | **Other national offices**: PENRO Bukidnon, PARO Bukidnon, Malaybalay TRC; DA farm-to-market roads (75 program families) | Budget API | National money reaching Bukidnon beyond roads and schools |
| F7 | **Bukidnon in the budget hearings**: hearing topics that mention Bukidnon, Malaybalay, Valencia, CMU, BukSU, with summaries and video timestamps | Budget API `/hearings` | Connects money to what officials said in Congress |
| F8 | **Region X context**: Bukidnon beside Northern Mindanao by department | Budget API NEP region rollup | Scale and comparison |
| F9 | **Downloads and data dictionary**: every table as CSV, every snapshot as JSON with its requests | All | Reuse by media and researchers |
| F10 | **Citizen reports link** (when the central service opens) | budget.bettergov.ph/report | Template contract; we only switch it on |
| F11 *(conditional)* | **LGU finances**: province and town income/expenditure, NTA dependence | BLGF via data.bettergov.ph | Needs decision D2 |
| F12 *(conditional)* | **Procurement**: PhilGEPS awards delivered to Bukidnon | search2 key or PhilGEPS files | Needs a key from BetterGov or decision D2 |

## Site map

```text
/                         Overview (F1)                      ← Projects moves to /projects in Phase 2
/projects                 2027 projects (template)
/projects/:program/:id    One 2027 project (template)
/gaa                      Budgets 2020–2026 (template + charts)
/districts                The 4 districts; /districts/:n one district (F2)
/places                   The 22 LGUs; /places/:slug one town (F3)
/infrastructure           Contract tracker + map (F4); /infrastructure/:contractId one contract
/education                Divisions, schools, SUCs (F5)
/agencies                 Other national offices (F6)
/hearings                 Bukidnon in the budget hearings (F7)
/downloads                CSV/JSON + data dictionary (F9)
/about                    Sources, queries, counts, exclusions, notices (template + additions)
```

## Phases

Each phase ends with a deployable portal. Agents are from `.claude/agents/`
([agents.md](agents.md)).

### Phase 0: Foundations

- [ ] Merge the template into this folder with an `upstream` remote ([architecture.md](architecture.md#repository-setup-phase-0)). Node ≥ 22.12.
- [ ] Settle open decisions D1–D7 (below).
- [ ] Ask BetterGov (about.bettergov.ph / GitHub): may a third-party portal depend on
  `api.dpwh.bettergov.ph` and `officials.bettergov.ph`? CORS? Rate limits? Can we get a
  search2 key for PhilGEPS? Is there map geometry on a bettergov.ph host?
- [ ] Verify CORS on the DPWH, officials and statistics APIs. Find the DPWH API's accepted
  `status` values.
- [ ] CI: `npm ci → check → build` on every push; Cloudflare preview deploys.
- [ ] Optional for development: register the bettergov.ph MCP servers (budget, data,
  statistics, officials) in `.mcp.json`.

**Exit:** the template builds and runs locally from this repo, CI is green, and the
decisions are recorded in this file.

### Phase 1: Bohol parity for Bukidnon (config only)

- [ ] `portal.config.ts`: `id: bukidnon-province`, `kind: province`, the 4 published DEO
  names, place `{ label: 'Bukidnon', region: 'X' }`, districts `leg:bukidnon:1st…4th`,
  operator per D1.
- [ ] `npm run check -- --verbose`: review lines found only by name under another office
  (e.g. "Davao–Bukidnon Road"); add exclusions with reasons.
- [ ] Branding (name, colours, logo only if D1 allows), `siteUrl`, `wrangler.jsonc` name.
- [ ] Deploy.

**Exit:** live portal; the About page counts match
[bukidnon-reference.md](bukidnon-reference.md) (57 office lines; 183/8/5/0 by name);
`/gaa` shows 2020–2026 for "Bukidnon". *Agents: code-reviewer, deployment-engineer.*

### Phase 2: Bukidnon pages on the Budget API

- [ ] `src/bukidnon/` scaffolding, routes, navigation.
- [ ] F1 Overview, F2 Districts, F5 Education, F6 Agencies, F7 Hearings, F8 Region context.
- [ ] F3 Towns, first pass: Budget API name search per town with the namesake rules
  ([data-rules.md](data-rules.md#namesakes)); every row shows its reason.
- [ ] SVG chart components with table views; CSV for every table (F9).
- [ ] `check-bukidnon.ts`: DepEd division vs unit guard, SUC totals per year, operating-unit
  allowlist still resolves, town queries reconciled against `meta.matched_amount`.
- [ ] Vitest for `src/bukidnon/lib/`.

**Exit:** every new figure links to its request on the About page; check passes;
accessibility audit has no serious issues. *Agents: react-specialist, typescript-pro,
ui-designer, data-analyst, accessibility-tester, test-automator.*

### Phase 3: other bettergov.ph sources

- [ ] `scripts/snapshot.ts` with the bettergov.ph host guard; nightly CI rebuild.
- [ ] F4 Infrastructure tracker (DPWH API snapshot): table, filters, contract page, map per D4.
- [ ] F3 Towns, second pass: contracts per town (from `components[].province` + town in
  description), officials elected in 2025, district per town (officials API).
- [ ] Per-resident figures (statistics API population), with the population year.
- [ ] F11 / F12 only if D2 or a BetterGov key allows.

**Exit:** snapshot provenance on the About page; CSP `connect-src` limited to
`*.bettergov.ph`; contract counts reconcile with the API summary (4,229 at survey time).
*Agents: node-specialist, data-analyst, performance-engineer, security-auditor.*

### Phase 4: quality and launch

- [ ] Accessibility (WCAG 2.2 AA), keyboard and screen-reader pass.
- [ ] Performance on a mid-range Android over 3G; bundle budget in CI.
- [ ] Plain-language review of every label and empty state; Binisaya/Cebuano labels if D6
  says so.
- [ ] SEO and link previews; security headers.
- [ ] Content and neutrality review (no allegation words; disclaimers on every figure page).
- [ ] Submit to the BetterLGU directory ([lgu.bettergov.ph](https://lgu.bettergov.ph) lists
  no Bukidnon portal yet).

**Exit:** launch. *Agents: ui-ux-tester, ux-microcopy-reviewer, seo-specialist,
qa-expert, content-quality-editor.*

### Ongoing

- Nightly snapshot + check + deploy; alert when a check fails.
- Monthly `git merge upstream/main`.
- When the FY2027 GAA is enacted and the API publishes it: add the enacted 2027 column and
  move 2027 into the enacted series.
- When `/hgab/2027/places/{psgc}` ships upstream: switch town pages from title search to it.

## Open decisions

| # | Decision | Options | Recommendation |
| --- | --- | --- | --- |
| D1 | **Who operates the portal?** (footer, contact, logo, tone) | Independent/civil society · provincial or city government · a school or university | Decide before Phase 1. If not run by the LGU, no official seals and keep the "independent and unofficial" notice. |
| D2 | **Do BetterGov-published files count as "from bettergov.ph"?** Every file in data.bettergov.ph is hosted elsewhere. | Strict (bettergov.ph hosts only) · also allow `huggingface.co/datasets/bettergovph/*` and `github.com/bettergovph/*` | Strict by default, as instructed. Allowing BetterGov's own mirrors would unlock PhilGEPS, the DPWH bulk data and flood control, but not BLGF, boundaries or COA. |
| D3 | **Depend on the undocumented DPWH API before BetterGov confirms?** | Wait · build behind a flag | Build F4 behind a flag; launch it only after confirmation. |
| D4 | **Maps** | No basemap (SVG points, outlines if bettergov.ph serves them) · a tile provider (an off-domain request) | No basemap at launch. It respects the rule and is lighter. |
| D5 | **Show political-family ("bloc") data** from the officials API? | Officials list only · include blocs | Officials list only at launch. Blocs are an editorial layer that needs a methodology page. |
| D6 | **Languages** | English · English + Binisaya/Cebuano labels · + Filipino | English at launch; Binisaya for navigation and key labels in Phase 4. |
| D7 | **Domain and hosting account** | `*.workers.dev` · own domain | Start on workers.dev; add a domain at launch. |

## Risks

| Risk | Mitigation |
| --- | --- |
| Undocumented or volunteer-run APIs change or go down (open-congress-api is already suspended) | Snapshots keep the last good data; checks fail loudly; pages degrade with a notice, never with blank tables |
| Name matching pulls in namesakes or misses towns | Namesake rules, region codes, allowlists, `check --verbose` review, published exclusions |
| Figures read as accusations (e.g. DEO NEP 2027 ₱0.91B vs GAA 2026 ₱4.62B; House-only candidates ₱390.75M) | Template wording ("candidate", "compared, never added"), disclaimers from the API, no allegation words, methodology on About |
| Mixing appropriations with contract amounts | Separate pages, separate axes, rule 14 in data-rules.md |
| Rate limits (data portal returns 429; others undocumented) | Snapshot lane, edge caching, backoff in scripts |
| Upstream template diverges | Additions in `src/bukidnon/`; small edits to template files; monthly merges |
| Political sensitivity around officials and elections | Public-role data only; "elected in" wording; no rankings of people |

## Success measures

- Every figure on every page traces to a bettergov.ph request listed on the About page.
- `npm run check` passes nightly; no silent drops.
- Accessibility: no serious axe findings; Lighthouse accessibility ≥ 95.
- First load on mobile 3G under 3 s for the overview.
- Listed on lgu.bettergov.ph and used by at least one local newsroom or school.
