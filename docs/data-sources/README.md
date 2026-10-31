# Data sources

**Rule: every figure in this portal comes from a bettergov.ph service.** This folder
records each source, the exact requests we make, what they return for Bukidnon, and the
caveats. Surveyed on 2026-10-31.

Status: ✅ documented and public · ⚠️ works, but undocumented or conditional ·
❌ not usable now.

| Source | Host | Status | What it gives Bukidnon | Doc |
| --- | --- | --- | --- | --- |
| **Budget API** | `budget.bettergov.ph/api/v1` | ✅ | FY2027 NEP vs House bill project lines (57 under the 4 DEOs; 196 by name); DEO money 2020–2027; 4 district cards; GAA 2020–2026 programs naming Bukidnon; DepEd divisions and schools; SUCs; PENRO/PARO/TRC; budget hearings | [budget-api.md](budget-api.md) |
| **DPWH projects API** | `api.dpwh.bettergov.ph` | ⚠️ undocumented | 4,229 DPWH contracts in Bukidnon: status, progress, contractor, coordinates, bidders | [dpwh-projects-api.md](dpwh-projects-api.md) |
| **Officials / Dynasties API** | `officials.bettergov.ph/api/v1` | ✅ | Town list, local officials and elections 2001–2025, district per town | [officials-api.md](officials-api.md) |
| **Philippine Data Explorer** | `statistics.bettergov.ph/api/v1` | ✅ | PSA population and poverty, for per-capita context | [statistics-api.md](statistics-api.md) |
| **Open Data Portal** | `data.bettergov.ph/api/v1` | ⚠️ catalogue only | BLGF LGU finances, PhilGEPS, DPWH bulk, boundaries: all files hosted off bettergov.ph | [open-data-portal.md](open-data-portal.md) |
| search2, philgeps, open-congress-api, govchain, others | various | ❌ | — | [not-usable-yet.md](not-usable-yet.md) |

Spec snapshot: [specs/budget-api-openapi.json](specs/budget-api-openapi.json) (Budget API
v1.0.0, saved 2026-10-31). The live spec wins when they differ.

## Before adding a source or endpoint

1. Confirm the host ends in `.bettergov.ph`.
2. Write it up here: base URL, docs link, auth, CORS, paging, the exact request, the
   Bukidnon result, caveats.
3. Add it to the About page's list of queries and to `npm run check`.
4. If it is undocumented, record who at BetterGov confirmed we may depend on it.

## Contact

BetterGov.ph is volunteer-run: [about.bettergov.ph](https://about.bettergov.ph) and
[docs.bettergov.ph](https://docs.bettergov.ph). The portal template's issues are at
[github.com/bettergovph/transparency-portal](https://github.com/bettergovph/transparency-portal).
