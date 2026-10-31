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
| `data.bettergov.ph` files | Catalogue is on bettergov.ph; every file is hosted elsewhere (HF, GitHub, gov sites) | BetterGov serving the data on a bettergov.ph host. Decision D2 in [plan.md](../plan.md#open-decisions) (2026-10-31) is strict: BetterGov's copies on Hugging Face and GitHub don't count. |

## Data gaps (no bettergov.ph source has it)

| Gap | Effect on the portal | Ask |
| --- | --- | --- |
| **City/municipality code on budget lines** | Town pages rely on title text, which misses lines that don't spell the town out | `GET /api/v1/hgab/2027/places/{psgc}/projects` (on the upstream roadmap) |
| **GAA lines by operating unit for DPWH** | A DEO's 2020–2026 project lines can't be listed, only its yearly totals. One line's office can be looked up ([budget-api.md](budget-api.md#dpwh-lines-by-office-20202026)), which the namesake review uses, but listing by office takes ~4,000 requests | `/gaa/departments/18/objects?operating_unit=…` (upstream gap #2) |
| **Region on GAA lines; wrong region on some 2027 lines** | The GAA has no region, so 417 DPWH families outside Bukidnon are excluded by hand. In 2027, `dpwh:house-reading:16124` (an MRF at the Bukidnon 4th DEO, Central Office) is tagged NCR, so the region rule drops it and the config can't add it back | A region (or place) on GAA lines; a fix to that line's `region_key`, or a way for a config to include one line |
| **School-to-division mapping** | Schools are listed only when their name names a Bukidnon place | Division code on each DepEd operating unit, or a `parent_division` field |
| **Map geometry: permission, browser access, barangays** | Town and province outlines exist on `dynasties.bettergov.ph` ([map-shapes.md](map-shapes.md)), but as undocumented site files with no CORS, so build time only. No barangay outlines anywhere on bettergov.ph | Ask BetterGov whether third parties may depend on `/data/geo/*.json.gz` (or publish them as documented files); barangay outlines if town pages need them |
| **LGU own-source finances from an API** | Province and town income/expenditure (BLGF) is only on blgf.gov.ph | A BLGF endpoint on bettergov.ph |
| **Budget execution (obligations, disbursements) by place** | Only appropriations and contract amounts | Out of scope for the API today; `/budget-cycle` is department-level only |
| **FY2027 enacted GAA** | Not enacted yet | Expected once the budget is signed; the API will need a `/gaa` 2027 year |
| **DPWH API terms** | CORS is open and no rate limit showed, but nothing is published. Per decision D3 the infrastructure tracker, the contracts map and contracts on town pages wait for BetterGov's answer | Confirmation that third-party portals may depend on `api.dpwh.bettergov.ph`, and any request budget |

## Resolved

| Was | Resolved by | Date |
| --- | --- | --- |
| Official list of Bukidnon LGUs with codes | PSGC `Q2_2024` on `statistics.bettergov.ph/api/classification` ([statistics-api.md](statistics-api.md#psgc-official-lgu-codes)) | 2026-10-31 |
| Officials slug ↔ PSGC link | The dynasties town shapes carry both ([map-shapes.md](map-shapes.md)) | 2026-10-31 |
| Source and year of the officials API's `poverty: 20.2` | PSA 2023 poverty incidence among families, also on the statistics API ([officials-api.md](officials-api.md#the-poverty-figure)) | 2026-10-31 |
