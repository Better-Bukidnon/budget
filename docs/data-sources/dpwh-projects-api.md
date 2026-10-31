# DPWH projects API (contract level)

| | |
| --- | --- |
| Base URL | `https://api.dpwh.bettergov.ph` |
| Docs | **None published.** No OpenAPI, `/docs` or `llms.txt`. Found through `transparency.bettergov.ph`, which links to `api.dpwh.bettergov.ph/projects/{contractId}`. |
| Auth | None. |
| CORS | ✅ Open. `Access-Control-Allow-Origin: *` on `GET` with or without an `Origin` header; the `OPTIONS` preflight answers `204`. (It also sends `Access-Control-Allow-Credentials: true`, which browsers ignore next to `*`. Don't send credentials.) Checked 2026-10-31. |
| Caching | None. `cf-cache-status: DYNAMIC`, no `Cache-Control`. List calls took 0.5–8 s. |
| Rate limits | None seen. No rate-limit headers; a burst of 30 concurrent requests all returned `200`. Not a promise: the terms are unpublished. |
| Terms | None published. `robots.txt` is Cloudflare's managed file: `Content-Signal: search=yes,ai-train=no,use=reference`, and it blocks AI crawlers by name. |
| Bulk alternative | "DPWH Infrastructure Transparency Dataset" on [data.bettergov.ph](open-data-portal.md) |
| Status | ⚠️ Works and is CORS-open, but undocumented. Confirm with BetterGov that third-party portals may depend on it before launch (Phase 0). |

## Why it matters

The Budget API says what was **appropriated**. This API says what DPWH **contracted**:
contractor, status, progress, amount paid, dates, coordinates, bidders, satellite
imagery, livestreams and citizen report counts. That makes an infrastructure tracker and
map possible.

## Endpoints observed

### `GET /projects`

List with a summary. Response: `{ status, code, data: { data: [...], summary, pagination } }`.

| Param | Behaviour observed (2026-10-31) |
| --- | --- |
| `province=Bukidnon` | ✅ Filters to 4,229 Bukidnon contracts |
| `region=Region X` | ✅ Filters to 17,094 Region X contracts |
| `search=…` | ✅ Full-text on description (`search=Bukidnon` also returns e.g. "Davao–Bukidnon Road" under Davao City 2nd DEO, a namesake) |
| `status=…` | ✅ Exact and **case-sensitive**. Five values: `Completed`, `On-Going`, `Not Yet Started`, `For Procurement`, `Terminated`. Any other spelling (`Ongoing`, `ongoing`, `On-going`, `for_procurement`) returns 0 rows with no error. |
| `year=2025` | ✅ Filters on `infraYear`. Bukidnon has contracts for 2016–2026, and the per-year counts add up to 4,229 (table below). `year=abc` returns 0 rows. |
| `category=Flood Control` | ✅ Filters on `category` (122 Bukidnon contracts) |
| `limit`, `page` | ✅ `pagination: { page, limit, totalCount, totalPages, hasNext, hasPrev }`. **No maximum**: `limit=5000` returned all 4,229 rows (3 MB) in one call. `limit=0` returns no rows, `totalPages: null` and `hasNext: true`. `limit=-1` returns HTTP 500. A page past the end returns 0 rows. |
| Filters combine | ✅ e.g. `year=2025&status=On-Going` → 105 |
| `infraYear`, `infra_year`, `fundingYear`, `fiscalYear`, `startDate`, `dateFrom`, `sourceOfFunds`, `contractor` | ❌ Ignored (same total as without them) |
| `sort`, `sortBy`/`sortOrder`, `orderBy` | ❌ Ignored. Rows always come back in the same order; sort after fetching. |
| `province=Bukidnon 1st DEO` | ❌ Returned 0 |
| `q`, `location`, `implementingOffice` | ❌ Ignored |

An ignored parameter fails silently: the response is the unfiltered set. Check
`totalCount` against an expected figure whenever a new filter is added.

`summary` covers the whole filtered set: `totalProjects`, `completed`, `ongoing`,
`notStarted`, `forProcurement`, `terminated`, `totalBudget`.

**Bukidnon (2026-10-31):** 4,229 contracts. 3,520 completed, 211 ongoing,
494 for procurement, 4 terminated, 0 not started. Total contract amount
₱63,053,405,735.13. (Nationally, 2,466 contracts are `Not Yet Started`; Bukidnon has none.)

**Bukidnon by `infraYear`** (`year=…&limit=1`, read `summary`):

| Year | Contracts | Completed | On-going | For procurement | Terminated | Contract amount (₱) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2016 | 165 | 165 | 0 | 0 | 0 | 1,953,060,772.69 |
| 2017 | 377 | 377 | 0 | 0 | 0 | 3,318,234,219.29 |
| 2018 | 337 | 337 | 0 | 0 | 0 | 4,970,626,431.25 |
| 2019 | 393 | 393 | 0 | 0 | 0 | 7,337,620,281.18 |
| 2020 | 408 | 408 | 0 | 0 | 0 | 6,574,003,717.46 |
| 2021 | 384 | 384 | 0 | 0 | 0 | 3,254,351,508.80 |
| 2022 | 393 | 391 | 1 | 0 | 1 | 8,198,595,323.90 |
| 2023 | 473 | 471 | 1 | 0 | 1 | 8,913,515,297.73 |
| 2024 | 482 | 410 | 41 | 29 | 2 | 10,221,222,532.15 |
| 2025 | 428 | 182 | 105 | 141 | 0 | 6,125,717,897.63 |
| 2026 | 389 | 2 | 63 | 324 | 0 | 2,186,457,753.05 |

`infraYear` is DPWH's programme year, not a GAA year. Don't line it up against Budget API
years without saying so.

List row fields: `contractId`, `description`, `category`, `componentCategories`,
`status`, `budget`, `amountPaid`, `progress`, `location{province, region}`, `contractor`,
`startDate`, `completionDate`, `infraYear`, `programName`, `sourceOfFunds`, `isLive`,
`livestreamUrl`, `livestreamVideoId`, `livestreamDetectedAt`, `latitude`, `longitude`,
`reportCount`, `hasSatelliteImage`.

### `GET /projects/{contractId}`

Detail adds: `infraType`, `contractEffectivityDate`, `expiryDate`, `nysReason`,
`isVerifiedByDpwh`, `isVerifiedByPublic`, `components[]` (each with `componentId`,
`typeOfWork`, real `region` and `province`, `coordinates{latitude, longitude, source,
locationVerified}`), `winnerNames`, `bidders[]` (with PCAB id), `procurement`, `links`,
`coordinates`, `imageSummary`. CORS-open and uncached, like the list.

An unknown id returns HTTP 404 with
`{ "status": 404, "code": "GET_PROJECT_DETAILS_FAILED", "message": "Project not found" }`.
So does any unknown path under `/projects/` (`/projects/summary`, `/projects/filters`).

### Other routes

`GET /health` answers (`service: "flood-control-core"`). It is not a data-freshness
signal. No route lists filter values, provinces or categories (`/filters`, `/provinces`,
`/regions`, `/categories` → 404).

## Caveats to carry into the UI

- `location.province` holds the **DEO name** ("Bukidnon 2nd DEO"). The real province is
  in `components[].province`. A contract can have components in more than one place.
- `budget` is in pesos **with centavos** (floats). Budget API figures are integer pesos.
  Never add the two together or show them as one series. A contract amount is not an
  appropriation.
- **`For Procurement` rows have `budget: 0`, `contractor: null` and no dates** (all 494
  Bukidnon rows). The 0 means "no contract amount yet", not ₱0. Show "not yet awarded",
  and leave these rows out of averages and amount rankings. They add nothing to
  `summary.totalBudget`.
- `amountPaid: 0` on a completed contract may mean "not reported", not "unpaid". Label it
  so.
- Coordinates are often unverified (`locationVerified: false`). Show that on the map.
- "For procurement", "terminated" and a late `completionDate` are statuses, not findings
  of wrongdoing. Use the template's neutral language.
- `sourceOfFunds` (e.g. "Regular Infra - GAA 2021 LP") is the only link back to a
  budget year. It doesn't give a Budget API line id, so any matching to 2027 project rows
  is by title and must be labelled as a match candidate.
- Status values are display strings from the source (`On-Going` with a hyphen). Map them
  to the portal's own labels once, in one place.

## How we'll use it

Build-time snapshot (see [architecture.md](../architecture.md#data-flow)). CORS is open,
so a browser *could* call it, but it is uncached and slow (seconds per call), and it is
undocumented. The snapshot lane stays the plan.

Page through `province=Bukidnon` at `limit=500` (9 requests). The API allows one
`limit=5000` call, but smaller pages are kinder to a volunteer-run service and fail more
cheaply. Run them one after another, not in parallel. Check that the summed rows equal
`summary.totalProjects` and that the status counts match `summary`. Fetch details only
for open contracts (`On-Going`, `For Procurement`) if BetterGov agrees. Write
`public/data/dpwh-contracts.json` with `retrieved_at` and the request list, and publish
the counts on the About page.
