# Bukidnon Transparency Portal: documentation

A budget transparency portal for the Province of Bukidnon, built on the
[BetterGov.ph transparency-portal template](https://github.com/bettergovph/transparency-portal)
(sample: [Bohol](https://transparency-portal.bettergov.workers.dev/gaa)) and **only on
bettergov.ph data**.

| Read | For |
| --- | --- |
| [plan.md](plan.md) | Goals, features, site map, phases, **open decisions**, risks |
| [data-sources/](data-sources/README.md) | Every bettergov.ph source: requests, Bukidnon results, caveats, gaps |
| [bukidnon-reference.md](bukidnon-reference.md) | IDs, codes and figures for Bukidnon in each API |
| [data-rules.md](data-rules.md) | Rules every figure on every page keeps |
| [architecture.md](architecture.md) | Repo setup, code layout, data flow, quality gates, deploy |
| [agents.md](agents.md) | The 28 Claude Code subagents in `.claude/agents/` |

## Template docs (from upstream)

These come from [bettergovph/transparency-portal](https://github.com/bettergovph/transparency-portal)
and are updated by `git merge upstream/main`. Don't edit them here; put Bukidnon notes in
our own files instead.

| Read | For |
| --- | --- |
| [../README.md](../README.md) | The template's own README: setup, config, scripts |
| [api.md](api.md) | The Budget API requests the template makes |
| [deploy.md](deploy.md) | Static build and hosting (Cloudflare, Vercel, Netlify), `npm run check` as a gate |
| [reporting.md](reporting.md) | The citizen-report link contract with budget.bettergov.ph |
| [poster/](poster/) | "Create your own transparency portal" poster images |

Survey date for all figures: **2026-10-31**.
