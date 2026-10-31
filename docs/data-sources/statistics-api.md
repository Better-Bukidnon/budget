# Philippine Data Explorer (`statistics.bettergov.ph`)

| | |
| --- | --- |
| Base URL | `https://statistics.bettergov.ph/api/v1` (datasets); `https://statistics.bettergov.ph/api/classification` (PSA classifications, including PSGC) |
| Docs | `/llms.txt`, `/api.md` (API guide), `/api/v1/openapi.json`, [Terms of Use](https://statistics.bettergov.ph/terms-of-service) |
| Auth | None. |
| CORS | ✅ Open. `Access-Control-Allow-Origin: *` on `GET`, on the `POST /datasets/{id}/query` call, and on `/api/classification`. The `OPTIONS` preflight answers `204` and allows `Content-Type`, so a browser can send the JSON query. Checked 2026-10-31. |
| Caching | `/api/v1` responses: `Cache-Control: no-store`. `/api/classification`: `public, max-age=300`. |
| Limits | Per `/coverage`: 5,000 points, 64 matching chunks and 32 MiB of source data per query; 2 concurrent observation queries per server process. When busy: HTTP 503 with `Retry-After`. A stale `release` returns HTTP 409. |
| MCP | `https://statistics.bettergov.ph/mcp` (dataset tools only; classifications aren't in it) |
| What it is | Saved snapshots of PSA OpenSTAT (3,678 datasets, 3,661 mirrored; inventory checked 2026-10-02). Not official, not live. PSA remains the authority. |
| Status | ✅ Public, documented, CORS-open. |

## Workflow (from its llms.txt)

1. Find a dataset: `GET /datasets?q=…&ready=true` (search by topic; titles don't contain
   province names, so `q=Bukidnon` returns 0).
2. Read its metadata (`GET /datasets/{id}`): dimensions, current `release`, a
   `sampleQuery`.
3. Look up the dimension **code** for Bukidnon:
   `GET /datasets/{id}/values?dimension=…&release=…&q=Bukidnon`. Use source codes, not
   display labels.
4. Query an exact `release` and selection: `POST /datasets/{id}/query` with
   `{ release, selection: { <dimension>: [codes] } }`. Every dimension needs at least one
   code.
5. Cite: official source URL, dataset title, release, retrieval date. The query response
   carries `source`, `sourceUpdated`, `retrieved` and `release`.

## Bukidnon's code is different in each dataset

| Kind of dataset | Bukidnon's code | Example |
| --- | --- | --- |
| 2024 Census of Population tables | The 10-digit **PSGC** code, `1001300000`; towns too (`1001312000` = City of Malaybalay) | `05c931eaecec498f9756`, `86770de57684804b7a80` |
| Older PSA tables (poverty, yearbook) | A **row index** for that table only: `77` in the 2023 poverty tables, `106` in yearbook Table 1.1 | `b4a71a27b4e4189c79a8`, `ad916a257572af037d2b` |

Look the code up per dataset and per release at build time. Never reuse one table's
index in another table.

## PSGC (official LGU codes)

PSGC is one of the nine systems under `/api/classification`. Saved versions: `Q2_2024`
(latest), `April_2024`, `Q4_2023`, `Q2_2021`. Each version has `regions`, `provinces`,
`municipalities`, `barangays`, `income_classification`, `urban_rural` and `city_class`.
"PSGC all" is not available. Snapshot fetched 2026-09-17 (`/api/classification/manifest.json`).

Requests:

```text
GET /api/classification/psgc/Q2_2024/provinces?reg=10
GET /api/classification/psgc/Q2_2024/municipalities?reg=10&prv=13
GET /api/classification/psgc/Q2_2024/barangays?reg=10&prv=13&mun=12&page_size=1000
```

Filters are `reg`, `prv`, `mun`, `bgy`. Paging is `page` (from 1) and `page_size`
(1–1000, default 1000), with `count`, `next`, `previous`, `results`.

**Bukidnon:** `code: "1001300000"`, `correspondence_code: "101300000"`, `reg: 10`,
`prv: 13`, income class 1st. `municipalities?reg=10&prv=13` returns **22 rows**: 20
municipalities (`geographic_level: "Mun"`) and 2 component cities (`"City"`, `city_class:
"CC"`): City of Malaybalay (`status: "Capital"`) and City of Valencia. Codes run
`1001301000` (Baungon) to `1001322000` (Cabanglasan); the full list is in
[bukidnon-reference.md](../bukidnon-reference.md#lgus-2-component-cities-20-municipalities).

Each row also has a `populations[]` array (2015, 2020, 2024). Don't use it for figures:
the values are padded strings (`" 1,415,226 "`) and some carry notes in the value
(`"(excluding CITY OF ILIGAN) 676,395"`). Use the census dataset below. The 2024 values
agree with it for all 22 towns.

Caveats: these are saved versions, not a promise of PSA's latest release. Codes are
strings; keep the leading zeros for regions 01–09. Names can have trailing spaces
(`"City of Malaybalay "`); trim them. **Use `Q2_2024`, not `Q4_2023`:** the `Q4_2023`
snapshot is incomplete (1,499 cities and municipalities nationally, with Lantapan and
Talakag missing), and its `mun` field doesn't follow the code (Baungon has `mun: 10`).
`Q2_2021` and `April_2024` also list all 22 Bukidnon LGUs.

## Population

**Dataset `05c931eaecec498f9756`**: "Population, Land Area, Population Density, and Percent
Change in Population Density by Region, Province/Highly Urbanized City, and
City/Municipality: 2015, 2020, and 2024". Release `2026-08-12T09-17-54-9f184c8f2d6c`,
source updated 2026-08-12, retrieved 2026-09-09.

- `Geographic Location`: PSGC codes (`1001300000` and the 22 town codes).
- `Parameter`: `0` = 2015 Population, `1` = 2020 Population, `2` = 2024 Population,
  `3` = land area (km²), `4`–`6` = density, `7`–`9` = percent change in density.

```json
POST /api/v1/datasets/05c931eaecec498f9756/query
{ "release": "2026-08-12T09-17-54-9f184c8f2d6c",
  "selection": { "Geographic Location": ["1001300000", "1001301000", "…", "1001322000"],
                 "Parameter": ["0", "1", "2"] } }
```

Bukidnon: **1,415,226 (2015), 1,541,308 (2020), 1,601,902 (2024)**. The 22 towns' 2024
figures add up to the province figure exactly; no nulls. Town figures are in
[bukidnon-reference.md](../bukidnon-reference.md#lgus-2-component-cities-20-municipalities).
The 2024 figures are as of 1 July 2024 (2024 Census of Population). Land area comes back
with float noise (`9360.569999999998`); round it for display only.

Other population tables:

- `86770de57684804b7a80`: 2024 census for Region X down to **barangay** (total population,
  household population, number of households), PSGC-coded. For town pages later.
- `ad916a257572af037d2b`: Philippine Statistical Yearbook Table 1.1, province level,
  census years 2000–2024 (Bukidnon = `106`).

## Poverty

The latest full-year series is **2018, 2021 and 2023**, by region and province
(`latestYear: 2023`). PSA publishes no town-level poverty here.

| Dataset | Table | Bukidnon code | Release |
| --- | --- | --- | --- |
| `b4a71a27b4e4189c79a8` | Table 2. Poverty incidence among **population** | `Geolocation: 77` (Region X = `76`) | `2026-08-03T13-44-03-02580de20be9` |
| `d4aac603f5dc8c5cdb21` | Table 1. Poverty incidence among **families** | `Geolocation: 77` | `2026-08-03T13-40-35-d9c83a2f8f56` |

Dimensions in Table 2: `Parameters` (`0` threshold in ₱, `1` incidence %, `2` coefficient
of variation, `3` standard error, `4`/`5` 95% interval) and `Year` (`0` = 2018, `1` = 2021,
`2` = 2023). Table 1 calls its parameter dimension `Threshold/Incidence/Measures of
Precision`.

| Bukidnon | 2018 | 2021 | 2023 |
| --- | ---: | ---: | ---: |
| Poverty incidence among population (%) | 27.6 | 29.2 | 27.0 |
| Coefficient of variation | 7.1 | 8.5 | 8.2 |
| Poverty incidence among families (%) | 22.3 | 22.8 | 20.2 |
| Coefficient of variation | 7.3 | 9.2 | 8.9 |
| Annual per capita poverty threshold (₱) | 25,624.44 | 29,040.30 | 32,991.98 |

Region X (population): 23.1, 26.1, 25.3. The officials API's `poverty: 20.2` is the 2023
families figure.

Caveats: say which measure (population or families) and which year. Province figures are
survey estimates: show the coefficient of variation, or at least call the figure an
estimate. Older poverty tables found by search stop at 2015. Region labels carry footnote markers
(`"..Region X (Northern Mindanao) 1/"`); strip the dots and markers for display, and read
the footnote at the source.

## What we want from it

| Indicator | Use | Source found |
| --- | --- | --- |
| Population by province and city/municipality | Per-capita views ("₱ per resident") on the overview and town pages | ✅ `05c931eaecec498f9756` (2015, 2020, 2024) |
| Poverty incidence by province | Context next to budget figures | ✅ `b4a71a27b4e4189c79a8` / `d4aac603f5dc8c5cdb21` (2018, 2021, 2023) |
| Official LGU list and codes | Join key for town pages | ✅ PSGC `Q2_2024` |
| Regional GDP (GRDP) for Region X | Context only | Not looked up yet. Region level, not province. |

## How we'll use it

Snapshot lane. The API is CORS-open, but `/api/v1` is `no-store` and each server process
runs only two queries at a time, so visitors shouldn't each query it. At build time:
look up the current `release` for each dataset, look up the codes, run the queries one
after another, and write the rows with `release`, `source`, `sourceUpdated` and
`retrieved`. Retry once on 503 after `Retry-After`. On 409, fetch the metadata again.

## Rules (from the source, adopted here)

- Missing values are null, not zero.
- Don't sum overlapping geographies or mix quarterly and annual figures.
- Show the release and retrieval date beside every figure.
- A per-capita figure divides an appropriation by population. Label it "budget per
  resident", never "spent per resident".
- The site's licence covers its own material, not PSA's data. Cite PSA for every figure.
