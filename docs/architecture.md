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
| `develop` (default) | Integration; every PR targets it | Development: the `bukidnon-transparency-portal` Worker ([Deploy](#deploy)) |
| `main` | Production; changes only arrive by a release PR from `develop` | The public portal: the `bukidnon-transparency-portal-production` Worker, created at the first release |
| `feature/*`, `fix/*`, `docs/*`, `chore/*` | Short-lived work branches off `develop` | Nothing yet (CI only). Workers Builds preview URLs can be turned on later. |

The nightly data refresh (`snapshot → check → build → deploy`) runs against `main` for
production and `develop` for development.

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
  - the DPWH API is undocumented and uncached (CORS is open, but each call takes seconds
    and its terms are unpublished);
  - 4,229 contracts are about 3 MB (9 requests at `limit=500`), too much for each visitor;
  - officials and statistics change rarely, and the statistics API is `no-store` with two
    queries at a time per server;
  - the dynasties map files have no CORS, so a browser can't load them at all;
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

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on every push and pull
request to `develop` and `main`, on Node 22: `npm ci`, `npm run lint`, `tsc -b`,
`npm run build`, then `npm run check` last because it calls the live Budget API. A red run
means don't merge. Branch protection would need GitHub Pro or a public repo, so this is a
team rule. `npm audit` is not a gate: on 2026-10-31 its only finding was in the template's
lint tooling (minimatch via eslint), with 0 in production dependencies.

| Gate | Tool |
| --- | --- |
| Config and query reconciliation | `npm run check` (template) + `check-bukidnon.ts` |
| Types and lint | `tsc -b`, `eslint` |
| Unit tests for pure functions (namesakes, region filter, rollup guards) | Vitest (to add) |
| Smoke test of every route | Playwright (`playwright-core` is already a dev dependency) |
| Accessibility | axe on each route; target WCAG 2.2 AA |
| Bundle budget | Fail the build if initial JS exceeds a set size (proposed: 150 KB gzip) |

## Deploy

Cloudflare Workers static assets, as the Bohol sample is deployed: no Worker code, no
bindings, SPA fallback in `wrangler.jsonc`. Hosted on `*.workers.dev` (decision D7).
**Cloudflare Workers Builds** (the dashboard's Git integration) builds and deploys, so the
repository holds no Cloudflare token and no deploy workflow.

| Worker | Role | Production branch | Build command | Deploy command | URL |
| --- | --- | --- | --- | --- | --- |
| `bukidnon-transparency-portal` | Development | `develop` | `npm run build && npm run check` | `npx wrangler deploy --env=""` | <https://bukidnon-transparency-portal.dmncdlprt.workers.dev> |
| `bukidnon-transparency-portal-production` | Public portal | `main` | `npm run build && npm run check` | `npx wrangler deploy --env production` | Not created yet (see below) |

Both connect to `DMNCDLPRT/bukidnon-transparency-portal` with root directory `/`. Builds
for other branches are off.

- `wrangler.jsonc` names the development Worker at the top level and the production Worker
  under `env.production`. A plain `wrangler deploy` (or the template's
  `npm run deploy:cloudflare`) therefore goes to development, never to the public portal.
- Keep those names equal to the Workers' names in the dashboard. When they differ,
  Workers Builds opens a pull request to rename them.
- `npm run check` is part of the build command, so a failed check stops the deploy. It
  queries the live Budget API, so a Budget API outage also blocks deploys.
- `--env=""` selects the top-level (development) config. Without it, wrangler warns that
  an `env` block exists but no environment was chosen.
- The build image runs Node 24 by default and CI runs Node 22. Both satisfy `engines`.
- The development portal is not for the public: until Phase 1 (#7) it still shows the
  template's Province of Bohol config.
- Workers Builds has no schedule. The nightly refresh (`snapshot → check → build →
  deploy`, #25) needs a scheduled trigger, chosen in #25.
- Set `siteUrl` for link previews once the domain is known.

To create the production Worker, at the first release (#10), once `main` has the app code:
in the dashboard go to **Workers & Pages → Create → Import a repository**, pick this
repository, name the Worker `bukidnon-transparency-portal-production`, and use the
commands above. Check that the production branch is `main` under **Settings → Builds →
Branch control**. The public domain goes on this Worker at launch (#36).

To deploy development by hand (rarely needed): `npx wrangler login`, then
`npm run build && npx wrangler deploy --env=""`.
