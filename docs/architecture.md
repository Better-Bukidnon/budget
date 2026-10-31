# Architecture

## Starting point: the template

[bettergovph/transparency-portal](https://github.com/bettergovph/transparency-portal) is a
static single-page app: React 19, TypeScript, Vite 8, React Router 7, three runtime
dependencies, about 95 KB gzipped. No backend and no database. The browser calls the
CORS-open Budget API directly. One file, `portal.config.ts`, points it at a place, and
`npm run check` validates that config against the live API (it doubles as a CI gate).

```text
portal.config.ts      the one file a fork edits
src/config.ts         config contract and checks
src/api/              Budget API client + response types
src/lib/scope.ts      config → 2027 project rows, each with its reasons
src/lib/gaa.ts        config → 2020–2026 program families naming the places
src/pages/            Home (projects), Enacted (/gaa), Project, About
scripts/setup.ts      npm run setup   scripts/check.ts  npm run check
```

## Repository setup (Phase 0)

This folder already holds our `docs/`, `.claude/` and `CLAUDE.md`. Merge the template in
under it so upstream fixes can keep flowing:

The repository is `github.com/DMNCDLPRT/bukidnon-transparency-portal` (private), with
`develop` as the default branch and `main` as production. Bring the template in on a
branch off `develop`:

```bash
git switch develop && git switch -c chore/merge-template
git remote add upstream https://github.com/bettergovph/transparency-portal.git
git fetch upstream
git merge upstream/main --allow-unrelated-histories   # no filename collisions: template docs are api.md, deploy.md, reporting.md, poster/
# open a PR into develop
```

Later updates: `git fetch upstream && git merge upstream/main`, on a branch off `develop`.

Once the `upstream` remote exists, the GitHub CLI may pick
`bettergovph/transparency-portal` as its target, and `gh pr create` or `gh issue` would then
act on the template repo. Pin it once per clone:

```bash
gh repo set-default DMNCDLPRT/bukidnon-transparency-portal
```

### Branches and environments

| Branch | Role | Deploys to |
| --- | --- | --- |
| `develop` (default) | Integration; every PR targets it | Preview / staging (e.g. a `-staging` Worker or Cloudflare preview URL) |
| `main` | Production; changes only arrive by a release PR from `develop` | The public portal |
| `feature/*`, `fix/*`, `docs/*`, `chore/*` | Short-lived work branches off `develop` | Per-PR preview |

The nightly data refresh (`snapshot → check → build → deploy`) runs against `main` for
production and `develop` for staging.

## Code layout for Bukidnon additions

Keep template files as close to upstream as possible. New code goes in new files:

```text
portal.config.ts               Bukidnon values in the template's own shape (offices, places, districts, exclusions)
src/bukidnon/config.ts         Bukidnon-only settings: DepEd division codes, SUC agency ids,
                               operating-unit allowlist, town slugs ↔ display names, namesake rules
src/bukidnon/api/              Clients for the extra sources: nep.ts (rollups), gaa-tree.ts (hierarchy),
                               hearings.ts, dpwh.ts, officials.ts, statistics.ts
src/bukidnon/lib/              Pure functions: namesake filter, region-code filter, rollup guards,
                               per-capita, trend series builders
src/bukidnon/pages/            Overview, Districts, Places (towns), Infrastructure, Education,
                               Agencies, Hearings, Downloads
src/bukidnon/components/       Charts (SVG), map, stat tiles, "why is this here" badges
scripts/snapshot.ts            npm run snapshot → public/data/*.json
scripts/check-bukidnon.ts      extra reconciliations, chained into npm run check
```

Template files we expect to touch (keep the edits small): `src/App.tsx` (routes),
`src/components/Chrome.tsx` (navigation), `src/pages/About.tsx` (list the extra
sources), `package.json` (scripts), `wrangler.jsonc` (name).

## Data flow

Two lanes:

```text
                    ┌──────────────── runtime lane (browser) ────────────────┐
 budget.bettergov.ph ─────────────────────────────────────────────► pages
   (documented, CORS-open, edge-cached)                              ▲
                                                                     │ static JSON
 api.dpwh.bettergov.ph ┐                                             │
 officials.bettergov.ph├─► scripts/snapshot.ts ─► public/data/*.json ┘
 statistics.bettergov.ph┘    (build time, nightly CI)
                    └──────────────── snapshot lane (build) ─────────────────┘
```

- **Runtime lane** for the Budget API, as the template does. It's documented, CORS-open and
  cached, and figures stay as fresh as budget.bettergov.ph.
- **Snapshot lane** for everything else:
  - the DPWH API is undocumented (CORS and rate limits unknown);
  - 4,229 contracts take about 43 paged requests, too many for each visitor;
  - officials and statistics change rarely;
  - snapshots are reproducible and can be reconciled in CI.

  Each file carries `{ source, requests[], retrieved_at, counts }`, and the About page
  prints them.
- A source that fails during a snapshot keeps the last good file and the build warns. A
  source that fails at runtime shows an inline "couldn't load from budget.bettergov.ph"
  notice, never an empty table.

## Enforcing the bettergov.ph-only rule

- **Content-Security-Policy** in `public/_headers` (served by Cloudflare static assets):
  `connect-src 'self' https://*.bettergov.ph; img-src 'self' data: https://*.bettergov.ph`.
  A fetch to any other host fails in the browser.
- `scripts/snapshot.ts` refuses any URL whose host doesn't end in `.bettergov.ph`.
- `npm run check` lists every host the build touched.

## Charts and maps

- **Charts:** small hand-written SVG components (bar, line, small multiples, stat tiles),
  following the dataviz guidance, to stay near the template's 95 KB budget. Every chart
  has a table view and a CSV download.
- **Maps:** depend on decision D4 in [plan.md](plan.md#open-decisions). The default
  assumes no third-party tiles: an SVG point map of contract coordinates, projected
  locally, with town outlines only if a bettergov.ph host serves them. Unverified
  coordinates get a different mark.

## Quality gates (CI)

| Gate | Tool |
| --- | --- |
| Config and query reconciliation | `npm run check` (template) + `check-bukidnon.ts` |
| Types and lint | `tsc -b`, `eslint` |
| Unit tests for pure functions (namesakes, region filter, rollup guards) | Vitest (to add) |
| Smoke test of every route | Playwright (`playwright-core` is already a dev dependency) |
| Accessibility | axe on each route; target WCAG 2.2 AA |
| Bundle budget | Fail the build if initial JS exceeds a set size (proposed: 150 KB gzip) |

## Deploy

Cloudflare Workers static assets, as the Bohol sample is deployed. `wrangler.jsonc`
`name: "bukidnon-transparency-portal"`, SPA fallback already configured. A nightly GitHub
Action runs `snapshot → check → build → deploy`, so budget figures and contract statuses
refresh daily. Set `siteUrl` for link previews once the domain is known.
