# Data sources

**Rule: every figure in this portal comes from a bettergov.ph service.** This folder
records each source, the exact requests we make, what they return for Bukidnon, and the
caveats. Surveyed on 2026-10-31.

Status: ✅ documented and public · ⚠️ works, but undocumented or conditional ·
❌ not usable now.

| Source | Host | Status | Browser CORS | What it gives Bukidnon | Doc |
| --- | --- | --- | --- | --- | --- |
| **Budget API** | `budget.bettergov.ph/api/v1` | ✅ | ✅ open, edge-cached | FY2027 NEP vs House bill project lines (57 under the 4 DEOs; 196 by name); DEO money 2020–2027; 4 district cards; GAA 2020–2026 programs naming Bukidnon; DepEd divisions and schools; SUCs; PENRO/PARO/TRC; budget hearings | [budget-api.md](budget-api.md) |
| **DPWH projects API** | `api.dpwh.bettergov.ph` | ⚠️ undocumented | ✅ open, not cached | 4,229 DPWH contracts in Bukidnon (2016–2026): status, progress, contractor, coordinates, bidders. Filters `status`, `year`, `category` verified; no page-size cap | [dpwh-projects-api.md](dpwh-projects-api.md) |
| **Officials / Dynasties API** | `officials.bettergov.ph/api/v1` | ✅ | ✅ open, edge-cached a day | Town list, local officials and elections 2001–2025, district per town (2025) | [officials-api.md](officials-api.md) |
| **Philippine Data Explorer** | `statistics.bettergov.ph/api/v1`, `/api/classification` | ✅ | ✅ open, `no-store` | PSGC codes for the 22 LGUs; census population 2015/2020/2024 by town; poverty incidence 2018/2021/2023 by province | [statistics-api.md](statistics-api.md) |
| **Map shapes** (dynasties site files) | `dynasties.bettergov.ph/data/geo/` | ⚠️ undocumented site asset | ❌ none: build time only | Outlines of the 22 towns and the province, each tagged with officials slug and PSGC code | [map-shapes.md](map-shapes.md) |
| **Open Data Portal** | `data.bettergov.ph/api/v1` | ⚠️ catalogue only | not checked | BLGF LGU finances, PhilGEPS, DPWH bulk, boundaries: all files hosted off bettergov.ph | [open-data-portal.md](open-data-portal.md) |
| search2, philgeps, open-congress-api, govchain, others | various | ❌ | — | — | [not-usable-yet.md](not-usable-yet.md) |

CORS was checked on 2026-10-31 with an `Origin` header on `GET` and an `OPTIONS`
preflight. "Open" means `Access-Control-Allow-Origin: *`. An open API can still belong in
the build-time snapshot lane (see [architecture.md](../architecture.md#data-flow)).

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
