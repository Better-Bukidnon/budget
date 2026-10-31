# Not usable yet: unavailable sources and data gaps

Things we looked for on bettergov.ph (2026-10-31) and couldn't use. Each line says what to
ask BetterGov for. Add to this list rather than filling a gap from a non-bettergov.ph source.

## bettergov.ph services that exist but can't be used now

| Service | What we found | What would unblock it |
| --- | --- | --- |
| `search2.bettergov.ph` (Meilisearch) | Backs the [Transparency Dashboard](https://transparency.bettergov.ph). Indexes `gaa`, `dpwh`, `philgeps_awardees`, `philgeps_area_of_deliveries`, `philgeps_organizations`, `philgeps_business_categories`. Needs a key; no key is published for third parties. **We won't reuse the dashboard's embedded key.** | A key issued to this project, or a documented public procurement API. |
| `philgeps.bettergov.ph` | Cloudflare "Origin DNS error" | Service restored, with an API |
| `open-congress-api.bettergov.ph` | HTTP 503, "application is suspended due to usage limits" (Deno Deploy) | Service restored. Meanwhile, representatives come from Budget API district cards. |
| `govchain.bettergov.ph` | A Cosmos-SDK chain with OCDS/OC4IDS modules (`/govchain/procurement/v1/ocds/records/{ocid}`, `/govchain/infrastructure/v1/projects_by_region/{region}`). The REST paths return a 404 page on this host. Looks experimental. | A public REST/LCD endpoint with real data |
| `api.bettergov.ph/weather` | Only Manila, Cebu, Davao and Baguio | Not needed for the portal |
| `hotlines.bettergov.ph`, `saln.bettergov.ph`, `taxdirectory.bettergov.ph` | No public API found; no Bukidnon entries in the bundles | An API, if these become relevant |
| `data.bettergov.ph` files | Catalogue is on bettergov.ph; every file is hosted elsewhere (HF, GitHub, gov sites) | Decision D2 in [plan.md](../plan.md#open-decisions) |

## Data gaps (no bettergov.ph source has it)

| Gap | Effect on the portal | Ask |
| --- | --- | --- |
| **City/municipality code on budget lines** | Town pages rely on title text, which misses lines that don't spell the town out | `GET /api/v1/hgab/2027/places/{psgc}/projects` (on the upstream roadmap) |
| **GAA lines by operating unit for DPWH** | A DEO's 2020–2026 project lines can't be listed, only its yearly totals | `/gaa/departments/18/objects?operating_unit=…` (upstream gap #2) |
| **School-to-division mapping** | Schools are listed only when their name names a Bukidnon place | Division code on each DepEd operating unit, or a `parent_division` field |
| **Map geometry on a bettergov.ph host** | No town or barangay outlines for maps | Check whether `dynasties.bettergov.ph` serves its map shapes as a file; otherwise ask BetterGov to host boundaries |
| **LGU own-source finances from an API** | Province and town income/expenditure (BLGF) is only on blgf.gov.ph | A BLGF endpoint on bettergov.ph |
| **Budget execution (obligations, disbursements) by place** | Only appropriations and contract amounts | Out of scope for the API today; `/budget-cycle` is department-level only |
| **FY2027 enacted GAA** | Not enacted yet | Expected once the budget is signed; the API will need a `/gaa` 2027 year |
| **Official list of Bukidnon LGUs with codes** | Town list comes from the officials API (names and slugs, no PSGC) | Check `statistics.bettergov.ph/api/classification` for PSGC |
