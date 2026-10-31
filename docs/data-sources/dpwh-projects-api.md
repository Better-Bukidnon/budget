# DPWH projects API (contract level)

| | |
| --- | --- |
| Base URL | `https://api.dpwh.bettergov.ph` |
| Docs | **None published.** No OpenAPI, `/docs` or `llms.txt`. Found through `transparency.bettergov.ph`, which links to `api.dpwh.bettergov.ph/projects/{contractId}`. |
| Auth | None observed. CORS, rate limits and terms **not yet confirmed**. |
| Bulk alternative | "DPWH Infrastructure Transparency Dataset" on [data.bettergov.ph](open-data-portal.md) |
| Status | ⚠️ Works, but undocumented. Confirm with BetterGov that third-party portals may depend on it before launch (Phase 0). |

## Why it matters

The Budget API says what was **appropriated**. This API says what DPWH **contracted**:
contractor, status, progress, amount paid, dates, coordinates, bidders, satellite
imagery, livestreams and citizen report counts. That makes an infrastructure tracker and
map possible.

## Endpoints observed

### `GET /projects`

List with a summary. Response: `{ status, code, data: { data: [...], summary, pagination } }`.

| Param | Behaviour observed |
| --- | --- |
| `province=Bukidnon` | ✅ Filters to 4,229 Bukidnon contracts |
| `region=Region X` | ✅ Filters to 17,094 Region X contracts |
| `search=…` | ✅ Full-text on description (`search=Bukidnon` also returns e.g. "Davao–Bukidnon Road" under Davao City 2nd DEO, a namesake) |
| `limit`, `page` | ✅ `pagination: { page, limit, totalCount, totalPages, hasNext, hasPrev }` |
| `status=Ongoing` | ❌ Returned 0. The value is probably spelled differently; find the accepted values. |
| `infraYear=2025` | ❌ Ignored (same total as without it) |
| `province=Bukidnon 1st DEO` | ❌ Returned 0 |
| `q`, `location`, `implementingOffice` | ❌ Ignored |

`summary` covers the whole filtered set: `totalProjects`, `completed`, `ongoing`,
`notStarted`, `forProcurement`, `terminated`, `totalBudget`.

**Bukidnon (2026-10-31):** 4,229 contracts. 3,520 completed, 211 ongoing,
494 for procurement, 4 terminated, 0 not started. Total contract amount
₱63,053,405,735.13.

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
`coordinates`, `imageSummary`.

## Caveats to carry into the UI

- `location.province` holds the **DEO name** ("Bukidnon 2nd DEO"). The real province is
  in `components[].province`. A contract can have components in more than one place.
- `budget` is in pesos **with centavos** (floats). Budget API figures are integer pesos.
  Never add the two together or show them as one series. A contract amount is not an
  appropriation.
- `amountPaid: 0` on a completed contract may mean "not reported", not "unpaid". Label it
  so.
- Coordinates are often unverified (`locationVerified: false`). Show that on the map.
- "For procurement", "terminated" and a late `completionDate` are statuses, not findings
  of wrongdoing. Use the template's neutral language.
- `sourceOfFunds` (e.g. "Regular Infra - GAA 2021 LP") is the only link back to a
  budget year. It doesn't give a Budget API line id, so any matching to 2027 project rows
  is by title and must be labelled as a match candidate.

## How we'll use it

Build-time snapshot (see [architecture.md](../architecture.md#data-flow)): page through
`province=Bukidnon` (about 43 pages at 100), fetch details for open contracts if allowed,
write `public/data/dpwh-contracts.json` with `retrieved_at` and the request list, and
publish counts on the About page.
