# Open Data Portal (`data.bettergov.ph`)

| | |
| --- | --- |
| Base URL | `https://data.bettergov.ph/api/v1` |
| Docs | <https://data.bettergov.ph/docs> · OpenAPI `/openapi.json` · `/llms.txt` |
| Auth | None. Rate-limited per IP (HTTP 429 with `retry-after`). Envelope: `{ success, data, pagination, error }`. |
| MCP | `https://data.bettergov.ph/mcp` (`search_datasets`, `get_dataset`, `list_resources`, …) |
| Status | ✅ The catalogue API is on bettergov.ph. ⚠️ **None of the files it lists are hosted on bettergov.ph** (checked 2026-10-31). See "Hosting" below. |

## Endpoints

| Request | Returns |
| --- | --- |
| `GET /datasets?search=&category_id=&publisher_id=&format=&limit=&offset=` | Dataset list |
| `GET /datasets/{id}` | Description, tags, licence, attribution, latest version date |
| `GET /resources?dataset_id=` | Files: `name`, `mime_type`, `size_bytes`, `download_url`, `source_url`, `last_mod_ts` |
| `GET /publishers`, `/categories`, `/stats`, `/ping` | Lookups and totals (25 datasets, 439 files, 14 publishers, ~18.3 GB) |

`search=Bukidnon` returns nothing. Datasets are national and get filtered to Bukidnon
inside the file.

## Hosting: where the files actually live

| Host of `download_url` | Datasets |
| --- | --- |
| `huggingface.co/datasets/bettergovph/*` (BetterGov's own org) | DPWH Infrastructure Transparency (parquet) · Open PhilGEPS (5 parquet: awardees, area of deliveries, organizations, business categories, …) · BIR Tax Collection (incl. "GAA by Region") · Open Budget GAA 2020–2025 parquet · Raw Philippine Data (persons, memberships) · Legal Documents Library · Open Customs · Project NOAH hazard PMTiles |
| `github.com/bettergovph/*` and `raw.githubusercontent.com/bettergovph/*` (BetterGov's own org) | Flood Control Projects JSON · Open Congress Data · Open Budget NEP zips |
| GitHub, third parties | Barangay Boundaries GeoJSON (bendlikeabamboo) · OpenHalalan elections (RobertRLeung) · Philippines GeoJSON (OSSPhilippines) |
| Government sites | BLGF LGU Fiscal Data (`blgf.gov.ph`, 43 xlsx/pdf) · Treasury (debt, cash ops, securities) · BIR regional collections and zonal values · CSC HR inventory · COA audit lists · PSA SDG Watch |
| Other | DOF bulletin (`docs.google.com`) · APC dynasties (`inclusivedemocracy.ph`) |

**Under the project rule ("data only from bettergov.ph"), none of these files can be used
as-is.** Decision D2 in [plan.md](../plan.md#open-decisions) chose option 1, strict
(2026-10-31). The options were:

1. **Strict:** use the catalogue for discovery only. Features that need these files wait
   until BetterGov serves the data from a bettergov.ph API.
2. **BetterGov-published:** also allow files BetterGov itself publishes under its own
   organisations (`huggingface.co/datasets/bettergovph/*`, `github.com/bettergovph/*`).
   That opens PhilGEPS procurement, the DPWH bulk dataset and flood-control data, but not
   BLGF, boundaries or COA.

## Datasets that would matter for Bukidnon

| Dataset | What it would add | Host class |
| --- | --- | --- |
| BLGF Local Government Unit Fiscal Data | The province's and towns' own income (incl. NTA dependence) and spending | Government (blgf.gov.ph) |
| Open PhilGEPS Data | Procurement awards with Bukidnon as the area of delivery; procuring entities such as the provincial government and cities | BetterGov HF |
| DPWH Infrastructure Transparency Dataset | Bulk copy of the [DPWH projects API](dpwh-projects-api.md) | BetterGov HF |
| Flood Control Projects Dashboard data | Flood-control contracts in Bukidnon | BetterGov GitHub |
| Project NOAH Hazard Maps | Flood and landslide hazard layer under the infrastructure map | BetterGov HF |
| Philippine Barangay Boundaries | Municipal and barangay outlines for maps | Third-party GitHub |
| List of Audit Agencies with AARs (COA) | Which Bukidnon LGUs and SUCs have audit reports | Government (coa.gov.ph) |
| BIR Regional Collection Statistics | Taxes collected in Bukidnon by year | Government (bir-cdn.bir.gov.ph) |
