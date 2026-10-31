# Bukidnon reference: IDs, codes and figures in each API

Everything a developer needs to point a query at Bukidnon. All figures were read from the
live APIs on **2026-10-31** (Budget API build `a0caa77`, built 2026-10-26) and are here
to check builds against, not to hard-code into pages. Pages always read live or
snapshotted data.

## How each source spells "Bukidnon / Region X"

| Source | Province | Region |
| --- | --- | --- |
| Budget API, FY2027 House bill (`/hgab/2027`) | `jurisdiction: "Bukidnon"`, district ids `leg:bukidnon:1st`…`4th` | `region_key: "X"`, `region: "Region X"` (FMR rows: `"REGION X - NORTHERN MINDANAO"`; NIA rows: none) |
| Budget API, NEP 2027 rollups | none (no province dimension) | `region` code `"10"`, `"Region X - Northern Mindanao"` |
| Budget API, GAA 2020–2026 | none (no place field; search names with `q`) | none |
| Budget API, operating-unit codes | DepEd: digits 3–4 of the 7-digit code are the region (`08`**`10`**`001`) | `10` |
| DPWH projects API (`api.dpwh.bettergov.ph`) | `province=Bukidnon` filter; `location.province` holds the **DEO name** (`"Bukidnon 2nd DEO"`); `components[].province` holds the real province | `"Region X"` |
| Officials API (`officials.bettergov.ph`) | slug `bukidnon`, name `"BUKIDNON"` (upper case) | `region_slug: "region-x"`, `"REGION X"` |
| Statistics API (`statistics.bettergov.ph`) | PSGC `1001300000` in PSGC and the 2024 census tables; a per-table row index elsewhere (`77` in the 2023 poverty tables, `106` in yearbook Table 1.1). Look it up per dataset. | PSGC `1000000000`; `76` in the 2023 poverty tables |
| Map shapes (`dynasties.bettergov.ph/data/geo/`) | `slug: "bukidnon"`, `psgc: 1001300000` (a number) | `"REGION X"`, `psgc: 1000000000` |

## Legislative districts and DPWH district engineering offices

**The DEO numbers do not match the district numbers.** Each office serves exactly one
district (Tier A), so an office's figures can be read as its district's.

| District id | Representative (20th Congress) | DEO serving it | Office id | Published office name (use in `office=` filters) | NEP 2027 operating-unit code |
| --- | --- | --- | --- | --- | --- |
| `leg:bukidnon:1st` | Alba, Jose Manuel F. | **Bukidnon 3rd DEO** | `office:bukidnon-3rd-deo` | Bukidnon 3rd District Engineering Office | `1800149` |
| `leg:bukidnon:2nd` | Flores, Jonathan Keith T. | **Bukidnon 1st DEO** | `office:bukidnon-1st-deo` | Bukidnon 1st District Engineering Office | `1800147` |
| `leg:bukidnon:3rd` | Zubiri, Audrey Kay T. | **Bukidnon 2nd DEO** | `office:bukidnon-2nd-deo` | Bukidnon 2nd District Engineering Office | `1800148` |
| `leg:bukidnon:4th` | Roque, Laarni Lavin | **Bukidnon 4th DEO** | `office:bukidnon-4th-deo` | Bukidnon 4th District Engineering Office | `1800199` |

Representatives come from `GET /api/v1/hgab/2027/districts?q=Bukidnon`. Each card also
carries a portrait (public domain, with attribution), a House profile link, and a bill
count.

### DEO money by year (pesos, as published)

GAA 2020–2026 and the NEP 2027 cover the **whole office**. The House bill covers **named
projects only**, so it is not comparable to the whole-office figures. `—` means the
office is not in that year's data (the 4th DEO was created in 2025), never zero.

| Office (serves) | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | NEP 2027 | House bill 2027 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1st DEO (2nd Dist.) | 1,168,503,000 | 1,567,151,000 | 1,602,665,000 | 1,684,033,000 | 1,732,401,000 | 1,129,416,000 | 936,198,000 | 487,858,000 | 800,600,000 |
| 2nd DEO (3rd Dist.) | 1,044,428,000 | 1,227,173,000 | 1,964,173,000 | 1,524,437,000 | 2,716,631,000 | 1,315,105,000 | 1,695,272,000 | 205,819,000 | 156,860,000 |
| 3rd DEO (1st Dist.) | 1,005,280,000 | 1,207,641,000 | 1,185,626,000 | 1,358,402,000 | 1,286,857,000 | 780,115,000 | 1,017,924,000 | 75,702,000 | 58,950,000 |
| 4th DEO (4th Dist.) | — | — | — | — | — | 50,000,000 | 973,300,000 | 137,140,000 | 100,176,000 |
| **All four DEOs** | 3,218,211,000 | 4,001,965,000 | 4,752,464,000 | 4,566,872,000 | 5,735,889,000 | 3,274,636,000 | 4,622,694,000 | 906,519,000 | *(not additive with NEP)* |

This is DEO money only. DPWH Central Office and Regional Office lines that build in
Bukidnon sit outside these figures; the 2027 place search below picks up many of them.

### FY2027: NEP vs House bill on the same project rows

| Office | NEP rows | NEP ₱ | House rows | House ₱ | In the House bill only (candidates) | Unchanged |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| 1st DEO | 15 | 440,600,000 | 35 | 800,600,000 | 20 rows, ₱360,000,000 | 15 rows, ₱440,600,000 |
| 2nd DEO | 9 | 156,860,000 | 9 | 156,860,000 | 0 | 9 rows, ₱156,860,000 |
| 3rd DEO | 4 | 28,200,000 | 6 | 58,950,000 | 2 rows, ₱30,750,000 | 4 rows, ₱28,200,000 |
| 4th DEO | 7 | 100,176,000 | 7 | 100,176,000 | 0 | 7 rows, ₱100,176,000 |

No rows were "NEP only", increased, decreased or under scope review. "In the House bill
only" rows are candidates to check, not confirmed insertions.

## FY2027 project lines (Budget API, `/hgab/2027/datasets/{program}/projects`)

| Query | Rows |
| --- | ---: |
| `dpwh?office=Bukidnon 1st District Engineering Office` | 35 |
| `dpwh?office=Bukidnon 2nd District Engineering Office` | 9 |
| `dpwh?office=Bukidnon 3rd District Engineering Office` | 6 |
| `dpwh?office=Bukidnon 4th District Engineering Office` | 7 |
| `dpwh?q=Bukidnon` (title names Bukidnon; includes Central Office lines) | 183 |
| `fmr?q=Bukidnon` (farm-to-market roads) | 8 |
| `hfep?q=Bukidnon` (health facilities) | 5 |
| `nia?q=Bukidnon` (irrigation) | 0 |

Office rows and place rows overlap. The template merges them and records why each row is
in the portal.

## GAA 2020–2026: program families whose name contains the search

From `GET /api/v1/gaa/departments/{id}/programs?q=…` (`meta.matched` = number of program
families). Raw counts, **before** namesake review; for what the portal keeps, see
[Namesake review](#namesake-review).

| `q` | DPWH (18) | DA (05) | Others |
| --- | ---: | ---: | --- |
| `Bukidnon` | 3,296 | 75 | BSGC (35) 10 · DND (17) 1 · PCO (25) 1 · OEOs (26) 1 · DOTr (38) 1 |
| `Malaybalay` | 429 | 10 | — |
| `Valencia` | 632 | 17 | OEOs (26) 1 · ALGU (36) 2 (both are namesakes: Estero de Valencia, Manila; Valencia Creek, QC) |

`Valencia` already shows the namesake problem: there are towns named Valencia in Bohol
and Negros Oriental too. Use `Valencia City` or require `Bukidnon` (see
[data-rules.md](data-rules.md#namesakes)).

## Namesake review

Reviewed 2026-10-31 (#8). The exclusions live in
[`src/bukidnon/exclusions.ts`](../src/bukidnon/exclusions.ts) (2027, by hand) and
[`src/bukidnon/exclusions-gaa.ts`](../src/bukidnon/exclusions-gaa.ts) (2020–2026, generated
by [`scripts/bukidnon/review-namesakes.ts`](../scripts/bukidnon/review-namesakes.ts)). The
About page lists every one with its reason.

### FY2027 lines (place search `q=Bukidnon`)

| Step | DPWH rows |
| --- | ---: |
| Title names Bukidnon | 183 |
| Dropped by the template's region rule (region given and not X): XI 23, XII 14, XIII 5, NCR 1 | −43 |
| Kept: under a Bukidnon DEO 57, Central Office in Region X 82, another DEO 1 | 140 |
| Excluded by hand: `dpwh:house-reading:2551`, CDO–Airport–Bukidnon Rd under the Cagayan de Oro City 1st DEO (House bill only, ₱50,000,000) | −1 |
| **In the portal** | **139** |

FMR 8 and HFEP 5 rows all name a Bukidnon town or facility and stay. NIA has none.

- **Davao–Bukidnon Road (decision):** its 2027 lines are under the Davao City 2nd DEO or
  Central Office, tagged Region XI, so the region rule already drops them. No hand
  exclusion is needed. The same goes for the Bukidnon–Cotabato Rd and Paco–Roxas–Arakan
  lines (XII) and the East–West lateral road in Agusan and Surigao (XIII).
- **One line the region rule drops wrongly:** `dpwh:house-reading:16124`, "Construction of
  Materials Recovery Facility (MRF), Bukidnon 4th District Engineering Office" (Central
  Office, ₱600,000 in both versions), is tagged NCR. The config can't add a line back, so it
  is logged in [not-usable-yet.md](data-sources/not-usable-yet.md) to report to BetterGov.

### Enacted budgets 2020–2026 (`q=Bukidnon`, every department)

**Outside DPWH (90 families): all kept.** DA 75 (farm-to-market roads, each naming a
Bukidnon town), BSGC 10 (NIA Talakag irrigation; NEA lines and NHA resettlement for Bukidnon
Airport, Don Carlos, Maramag, Quezon, Pangantucan), DND 1 (Kibaritan Military Reservation,
Kalilangan), PCO 1 (Government Communication Academy, Manolo Fortich), OEOs 1 (Bukidnon
Museum), DOTr 1 (Bukidnon Airport).

**DPWH (3,296 families): 417 excluded.** The GAA has no region, so the region rule can't
help. Each family was joined to the office its lines are listed under (hierarchy route, see
[budget-api.md](data-sources/budget-api.md#dpwh-lines-by-office-20202026)):

| Outcome | Families |
| --- | ---: |
| Kept: listed under a Bukidnon DEO in some year | 1,926 |
| Kept: Central Office or a regional office, and the name places it in Bukidnon (`…, <town>, Bukidnon`), or names a Bukidnon district, office or institution | 847 |
| Kept: a section or bridge of a road whose DEO-listed sections are all under Bukidnon DEOs (Bukidnon–Davao City Rd, Sayre Highway to the Cotabato boundary, Misamis Oriental–Bukidnon–Agusan Rd, Kapalong–Talaingod–Valencia Rd from K1538) | 88 |
| **Excluded:** listed only under DEOs outside Bukidnon (Davao City 2nd 94, Cotabato 2nd 33, Cagayan de Oro City 1st 18, Cotabato 3rd 14, Davao del Norte 13, …) | 193 |
| **Excluded:** Central Office, and the name places the work outside (Davao City, Agusan del Sur/Norte, Butuan City, Surigao del Sur, Misamis Oriental, Davao del Norte, Davao de Oro, Cotabato) | 129 |
| **Excluded:** Central Office sections of roads whose DEO-listed sections are all outside Bukidnon (Paco–Roxas–Arakan 30, CDO–Airport–Bukidnon 21, Davao–Bukidnon 20, Bukidnon–Cotabato 19) | 90 |
| **Excluded:** studies filed under Region XI or XII (3); Calinan Section feeder road whose other entries say Davao City (2) | 5 |
| Unresolved, kept: no evidence either way (see below) | 18 |

What the exclusions take out of the `/gaa` totals (programs with an amount that year):

| Year | Before | Excluded | Shown now |
| --- | ---: | ---: | ---: |
| 2020 | ₱17.22B · 459 | ₱6.03B · 82 | ₱11.18B · 377 |
| 2021 | ₱24.91B · 658 | ₱7.34B · 110 | ₱17.56B · 548 |
| 2022 | ₱23.87B · 489 | ₱5.11B · 65 | ₱18.76B · 424 |
| 2023 | ₱28.09B · 548 | ₱5.35B · 63 | ₱22.73B · 485 |
| 2024 | ₱30.72B · 591 | ₱4.27B · 54 | ₱26.45B · 537 |
| 2025 | ₱23.55B · 437 | ₱2.73B · 34 | ₱20.82B · 403 |
| 2026 | ₱12.15B · 433 | ₱3.24B · 66 | ₱8.91B · 367 |

**Unresolved, kept (18):** all Central Office, with no DEO-listed section to compare:
Bukidnon Bdry–North Cotabato Rd (11 sections and bridges; no DEO lists any part of it);
Kapalong–Talaingod–Valencia Rd K1520–K1528 (2, between the Davao del Norte DEO's
K1486–K1523 and the Bukidnon DEOs' K1538 onward); and bridges on that road with no DEO entry
(Bonacao ×2, Kalagutay, Mawi-i, New Batangan). A name match stays in unless the data places
it elsewhere. Re-run the script with `--list` to see every family's class.

Re-run the review when the API rebuilds or a new GAA year appears. `npm run check` fails
when an exclusion stops matching a family, which is the signal.

## LGUs (2 component cities, 20 municipalities)

City of Malaybalay (capital), City of Valencia; Baungon, Cabanglasan, Damulog, Dangcagan,
Don Carlos, Impasug-ong, Kadingilan, Kalilangan, Kibawe, Kitaotao, Lantapan, Libona,
Malitbog, Manolo Fortich, Maramag, Pangantucan, Quezon, San Fernando, Sumilao, Talakag.

In PSGC order. Population is the 2024 Census of Population (as of 1 July 2024) and
earlier censuses, from statistics.bettergov.ph dataset `05c931eaecec498f9756`, release
`2026-08-12T09-17-54-9f184c8f2d6c`. The 22 towns add up to the province figure.

| PSGC code | LGU | Kind | Officials slug | District (2025) | Pop. 2015 | Pop. 2020 | Pop. 2024 |
| --- | --- | --- | --- | --- | ---: | ---: | ---: |
| `1001301000` | Baungon | Municipality | `baungon` | 1st | 34,336 | 37,111 | 39,151 |
| `1001302000` | Damulog | Municipality | `damulog` | 3rd | 30,302 | 39,322 | 38,564 |
| `1001303000` | Dangcagan | Municipality | `dangcagan` | 3rd | 23,723 | 26,076 | 27,128 |
| `1001304000` | Don Carlos | Municipality | `don-carlos` | 3rd | 66,959 | 69,273 | 73,592 |
| `1001305000` | Impasug-ong | Municipality | `impasug-ong` | 2nd | 47,859 | 53,863 | 55,901 |
| `1001306000` | Kadingilan | Municipality | `kadingilan` | 3rd | 33,778 | 33,735 | 35,432 |
| `1001307000` | Kalilangan | Municipality | `kalilangan` | 4th | 41,601 | 43,711 | 44,108 |
| `1001308000` | Kibawe | Municipality | `kibawe` | 3rd | 39,612 | 41,897 | 43,491 |
| `1001309000` | Kitaotao | Municipality | `kitaotao` | 3rd | 50,260 | 53,796 | 57,364 |
| `1001310000` | Lantapan | Municipality | `lantapan` | 2nd | 61,776 | 65,974 | 68,777 |
| `1001311000` | Libona | Municipality | `libona` | 1st | 43,969 | 48,965 | 51,555 |
| `1001312000` | City of Malaybalay | Component city | `malaybalay` | 2nd | 174,625 | 190,712 | 195,046 |
| `1001313000` | Malitbog | Municipality | `malitbog` | 1st | 24,453 | 26,741 | 28,666 |
| `1001314000` | Manolo Fortich | Municipality | `manolo-fortich` | 1st | 100,210 | 113,200 | 118,075 |
| `1001315000` | Maramag | Municipality | `maramag` | 3rd | 102,089 | 108,293 | 109,864 |
| `1001316000` | Pangantucan | Municipality | `pangantucan` | 4th | 53,126 | 56,580 | 60,162 |
| `1001317000` | Quezon | Municipality | `quezon` | 3rd | 104,116 | 109,624 | 114,521 |
| `1001318000` | San Fernando | Municipality | `san-fernando` | 2nd | 56,138 | 63,045 | 65,494 |
| `1001319000` | Sumilao | Municipality | `sumilao` | 1st | 27,660 | 29,531 | 31,094 |
| `1001320000` | Talakag | Municipality | `talakag` | 1st | 71,644 | 77,027 | 81,932 |
| `1001321000` | City of Valencia | Component city | `valencia` | 4th | 192,993 | 216,546 | 223,620 |
| `1001322000` | Cabanglasan | Municipality | `cabanglasan` | 2nd | 33,997 | 36,286 | 38,365 |
| `1001300000` | **Bukidnon (province)** | Province | `bukidnon` | | **1,415,226** | **1,541,308** | **1,601,902** |

- **Official list and codes:** PSGC `Q2_2024`,
  `GET https://statistics.bettergov.ph/api/classification/psgc/Q2_2024/municipalities?reg=10&prv=13`
  (22 rows). Not `Q4_2023`, which is missing Lantapan and Talakag. See
  [statistics-api.md](data-sources/statistics-api.md#psgc-official-lgu-codes).
- **Election town list:** `GET https://officials.bettergov.ph/api/v1/places/bukidnon`
  (`towns[]` with `name` and `slug`; note `IMPASUG ONG` without the hyphen, and
  `MALAYBALAY`/`VALENCIA` without "City of").
- **Slug ↔ PSGC:** the dynasties town shapes carry both
  ([map-shapes.md](data-sources/map-shapes.md)). All 22 match.
- **Which district each town is in:** `GET
  https://officials.bettergov.ph/api/v1/contests?year=2025&province=bukidnon&position=representative`
  → `district` (`FIRST`…`FOURTH`) and `district_towns[]` on each of the 4 rows. Read it at
  build time, not from this table.
- **Which DEO builds in a town:** normally the DEO serving its district (table above).
  DPWH contract rows agree, e.g. Kadingilan and Maramag (3rd District) → 2nd DEO; Malaybalay (2nd
  District) → 1st DEO.

## Education

### DepEd schools divisions (NEP 2027, `base_amount` = GAA 2026)

| Division | Code | `division` rollup (whole division) | `operating_unit` rollup (division office as a unit) |
| --- | --- | ---: | ---: |
| Division of Bukidnon | `0810001` | 9,110,570,000 (base 8,174,076,000; +11.5%) | 7,016,044,000 |
| Division of Malaybalay City | `0810010` | 1,815,661,000 (base 1,616,447,000; +12.3%) | 1,226,402,000 |
| Division of Valencia City | `0810014` | 1,704,333,000 (base 1,446,073,000; +17.9%) | 1,241,719,000 |

The `division` total is the larger, whole-division figure. The gap between the two
columns is roughly what schools with their own allotment receive. **Do not add the two
columns.**

Requests: `GET /api/v1/nep/2027/rollups/division?limit=500` (national, one page) and
`GET /api/v1/nep/2027/departments/07/rollups/operating_unit?limit=2000&cursor=…`
(11,716 units, cursor-paged).

GAA 2020–2026 history for each division sits in the hierarchy route:
`/gaa/years/{year}/departments/07/children?level=operating_units&parent=<fpap id>`.
Example: 2026 "Operation of Schools – Elementary" gives Division of Bukidnon ₱5,304,711,000
(unit id `07-001-310400100002000-0810001`).

### Schools with their own allotment (NEP 2027, found by name; incomplete)

37 Region X units (`09` + `10` + nnn) whose names name a Bukidnon place. Schools whose
names don't name a town are **missing** from this list. A school-to-division map is a
gap (see [not-usable-yet.md](data-sources/not-usable-yet.md)).

| Code | School | NEP 2027 ₱ |
| --- | --- | ---: |
| 0910270 | Bukidnon National High School | 268,948,000 |
| 0910318 | Valencia National High School | 258,242,000 |
| 0910008 | Bukidnon National School of Home Industries | 126,424,000 |
| 0910041 | Manolo Fortich National High School | 87,220,000 |
| 0910047 | Quezon National High School | 84,765,000 |
| 0910024 | Kalilangan National High School | 70,404,000 |
| 0910037 | Libona National High School | 65,359,000 |
| 0910036 | Lantapan National High School | 63,759,000 |
| 0910021 | Impasug-ong National High School | 54,670,000 |
| 0910046 | Pangantucan National High School | 51,987,000 |
| 0910013 | Dangcagan National High School | 48,938,000 |
| 0910003 | Baungon National High School | 47,465,000 |
| 0910058 | Talakag National High School | 46,289,000 |
| 0910030 | Kitaotao National High School | 43,450,000 |
| 0910044 | Old Damulog National High School | 42,576,000 |
| 0910056 | Sumilao National High School | 38,655,000 |
| 0910271 | Malaybalay City National Science High School (BNHS – Aglayan Annex) | 34,430,000 |
| 0910026 | Kibawe National High School | 29,553,000 |
| 0910018 | Don Carlos National High School | 28,534,000 |
| 0910029 | Kinawe National High School (Libona NHS – Kinawe Annex) | 18,907,000 |
| 0910322 | Tongantongan National High School (Valencia NHS – Tongantongan Annex) | 17,316,000 |
| 0910272 | Casisang National High School (BNHS – Casisang Annex) | 15,335,000 |
| 0910358 | Dagumbaan Integrated School, Talakag | 13,505,000 |
| 0910275 | Malaybalay City National High School (BNHS – San Jose Annex) | 12,883,000 |
| 0910319 | Catumbalon National High School (Valencia NHS – Catumbalon Annex) | 8,589,000 |
| 0910616 | Kibawe National High School Poblacion Campus | 7,119,000 |
| 0910010 | Cabanglasan National High School | 5,226,000 |
| 0910620 | Dagumbaan Integrated School, Maramag | 4,515,000 |
| 0910615 | Poblacion Kadingilan National High School | 4,080,000 |
| 0910274 | Kalasungay National High School (BNHS – Kalasungay Extension) | 4,029,000 |
| 0910321 | Guinoyoran National High School (Valencia NHS – Guinoyoran Annex) | 3,837,000 |
| 0910424 | Quezon Integrated School | 2,817,000 |
| 0910009 | Bukidnon National School of Home Industries – San Miguel Annex | 2,370,000 |
| 0910320 | Concepcion National High School (Valencia NHS – Concepcion Annex) | 1,963,000 |
| 0910351 | Kitaotao National High School – Digongan Annex | 1,781,000 |
| 0910548 | Malaybalay City Senior High School | 1,741,000 |
| 0910057 | Sumilao National High School – Vista Villa Annex | 1,573,000 |

Namesake trap: `0907549 Don Carlos Gothong Memorial National High School` matches
"Don Carlos" but is in Region VII (Cebu). The region digits catch it.

### State universities and colleges (GAA department `08`)

| Agency id | SUC | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | NEP 2027 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `08-091` | Central Mindanao University | 781,490,000 | 867,632,000 | 971,425,000 | 908,261,000 | 963,421,000 | 1,029,338,000 | 1,212,916,000 | 1,289,743,000 |
| `08-089` | Bukidnon State University | 674,454,000 | 885,483,000 | 951,754,000 | 940,305,000 | 940,096,000 | 950,129,000 | 1,182,691,000 | 1,240,046,000 |
| `08-116` | Northern Bukidnon State College | — | 50,000,000 | 201,399,000 | 282,341,000 | 290,351,000 | 196,035,000 | 299,924,000 | 309,354,000 |

GAA: `/gaa/years/{year}/departments/08/children?level=agencies`. NEP:
`/nep/2027/departments/08/rollups/agency` (codes `091`, `089`, `116`).

## Other national offices in Bukidnon (NEP 2027 operating units)

Codes differ by department, so keep an explicit allowlist instead of a region rule.

| Dept | Code | Unit | NEP 2027 ₱ | GAA 2026 ₱ |
| --- | --- | --- | ---: | ---: |
| DENR (10) | `0500058` | PENRO Bukidnon | 214,615,000 | 203,127,000 |
| DAR | `0500059` | PARO – Bukidnon | 128,113,000 | 122,124,000 |
| DOH (13) | `1500017` | Malaybalay, Bukidnon Treatment and Rehabilitation Center | 75,622,000 | 70,400,000 |
| DPWH (18) | `1800147` `1800148` `1800149` `1800199` | Bukidnon 1st–4th DEOs | see above | see above |

Namesakes to reject: PENRO Quezon, PARO Quezon I/II, Quezon National Agricultural
School (DOLE/TESDA), Revenue Region 7A Quezon City, Port of San Fernando, San Fernando
La Union TRC.

## DPWH contracts (`api.dpwh.bettergov.ph`)

`GET /projects?province=Bukidnon&limit=1` → `data.summary`:

| Total | Completed | Ongoing | For procurement | Terminated | Not started | Total contract amount |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 4,229 | 3,520 | 211 | 494 | 4 | 0 | ₱63,053,405,735.13 |

All of Region X (`region=Region X`) has 17,094 contracts totalling ₱483,413,721,591.91.

Status filter values are exact and case-sensitive: `Completed`, `On-Going`,
`Not Yet Started`, `For Procurement`, `Terminated`. `year=` filters on `infraYear`;
Bukidnon's contracts run from 2016 to 2026. The 494 `For Procurement` rows all have
`budget: 0` (not yet awarded). The per-year table is in
[data-sources/dpwh-projects-api.md](data-sources/dpwh-projects-api.md).

## Officials and context

- `officials.bettergov.ph/api/v1/places/bukidnon`: towns with seat counts, `poverty: 20.2`.
  That is PSA's 2023 poverty incidence among **families**. Display it from the statistics
  API instead, which gives the year and precision.
- Poverty (statistics.bettergov.ph, 2018 / 2021 / 2023): among population 27.6 / 29.2 /
  27.0%; among families 22.3 / 22.8 / 20.2%. Region X population: 23.1 / 26.1 / 25.3%. See
  [data-sources/statistics-api.md](data-sources/statistics-api.md#poverty).
- `officials.bettergov.ph/api/v1/national/2025/provinces/bukidnon`: 2025 national and
  party-list results in the province.
- Budget hearings that mention Bukidnon: `GET /api/v1/hearings/search?q=Bukidnon` (for
  example, the DOT briefing of 2026-09-07 on tourism road maps for Bukidnon).
