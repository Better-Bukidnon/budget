# Bukidnon Transparency Portal

A citizen-facing budget transparency portal for the **Province of Bukidnon (Region X)**.
It is a fork of [bettergovph/transparency-portal](https://github.com/bettergovph/transparency-portal),
whose default config is the Province of Bohol
([live sample](https://transparency-portal.bettergov.workers.dev/gaa)). Our version adds
Bukidnon-specific pages on top of it.

**Status:** Phase 0. Repo: `github.com/DMNCDLPRT/bukidnon-transparency-portal`
(private). The template is merged in (still the Bohol default config), with an `upstream`
remote for `bettergovph/transparency-portal`. Next steps: the rest of Phase 0 in
[docs/plan.md](docs/plan.md).

Commands (Node ≥ 22.12): `npm install`, `npm run dev` (http://localhost:5132),
`npm run check` (queries the live API), `npm run lint`, `npm run build`.

## Hard rules

1. **Data comes only from bettergov.ph services**, meaning any `*.bettergov.ph` host
   (budget, data, statistics, officials/dynasties, api.dpwh, …). No other APIs, scrapes,
   or third-party datasets. If something is missing, log it as a gap in
   [docs/data-sources/not-usable-yet.md](docs/data-sources/not-usable-yet.md) and ask
   BetterGov; don't fill it from elsewhere.
2. **Never reuse keys or tokens taken from another site's bundle** (e.g. the
   `search2.bettergov.ph` search key). Use only public, unauthenticated endpoints, or keys
   BetterGov issues to this project.
3. **Document before you build.** A new source or endpoint gets a page in
   [docs/data-sources/](docs/data-sources/) first: what it is, the exact requests, what it
   returns for Bukidnon, and its caveats.
4. **Keep the template's data rules** ([docs/data-rules.md](docs/data-rules.md)): amounts
   exactly as published, versions compared and never added, disclaimers printed from the
   API response, every exclusion published with a reason, no allegations.
5. **Stay mergeable with upstream.** Put Bukidnon additions in new files (`src/bukidnon/`,
   new pages, new API clients). Keep edits to template files small so
   `git merge upstream/main` stays easy.

## Branches

| Branch | Role |
| --- | --- |
| `develop` | **Default branch.** Integration: all work lands here first. |
| `main` | **Production.** Only release merges from `develop`; production deploys build from `main`. |
| `feature/*`, `fix/*`, `docs/*` | Short-lived, branched from `develop`, merged back by pull request. |

Never commit directly to `main`. Merge template updates (`upstream/main`) into `develop`,
never straight into `main`.

## Bukidnon facts that trip people up

- DEO numbers do **not** match district numbers: 1st District ↔ **3rd** DEO,
  2nd ↔ **1st** DEO, 3rd ↔ **2nd** DEO, 4th ↔ 4th DEO. See
  [docs/bukidnon-reference.md](docs/bukidnon-reference.md).
- Town names collide with places elsewhere (Quezon, San Fernando, Valencia, Malitbog,
  Don Carlos). A name match is a lead, not a location.
- In the NEP, DepEd's `division` rollup and `operating_unit` rollup overlap. Never add
  them together.

## Map

| Path | What |
| --- | --- |
| `docs/plan.md` | Goals, pages, phases, open decisions, risks |
| `docs/architecture.md` | How the fork is structured and how data flows |
| `docs/data-sources/` | One page per bettergov.ph source, plus the catalogue and the gaps |
| `docs/bukidnon-reference.md` | IDs, codes, names and figures for Bukidnon in each API |
| `docs/data-rules.md` | Presentation rules every page must keep |
| `docs/agents.md` | The project's Claude Code subagents and when to use each |
| `.claude/agents/` | 28 subagents curated from VoltAgent/awesome-claude-code-subagents |
