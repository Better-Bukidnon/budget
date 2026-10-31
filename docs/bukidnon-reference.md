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
| Statistics API (`statistics.bettergov.ph`) | a code in each dataset's `Region/Province` dimension (look it up per dataset) | same |

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
families). Raw counts, **before** namesake review.

| `q` | DPWH (18) | DA (05) | Others |
| --- | ---: | ---: | --- |
| `Bukidnon` | 3,296 | 75 | BSGC (35) 10 · DND (17) 1 · PCO (25) 1 · OEOs (26) 1 · DOTr (38) 1 |
| `Malaybalay` | 429 | 10 | — |
| `Valencia` | 632 | 17 | OEOs (26) 1 · ALGU (36) 2 (both are namesakes: Estero de Valencia, Manila; Valencia Creek, QC) |

`Valencia` already shows the namesake problem: there are towns named Valencia in Bohol
and Negros Oriental too. Use `Valencia City` or require `Bukidnon` (see
[data-rules.md](data-rules.md#namesakes)).

## LGUs (2 component cities, 20 municipalities)

Malaybalay City (capital), Valencia City; Baungon, Cabanglasan, Damulog, Dangcagan,
Don Carlos, Impasug-ong, Kadingilan, Kalilangan, Kibawe, Kitaotao, Lantapan, Libona,
Malitbog, Manolo Fortich, Maramag, Pangantucan, Quezon, San Fernando, Sumilao, Talakag.

- **Source of truth at build time:** `GET https://officials.bettergov.ph/api/v1/places/bukidnon`
  (`towns[]` with `name` and `slug`; note `IMPASUG ONG` without the hyphen). PSA's PSGC
  may also be on `statistics.bettergov.ph/api/classification` (to verify).
- **Which district each town is in:** derive from
  `officials.bettergov.ph/api/v1/contests?province=bukidnon&position=…&district=…`, not
  from memory.
- **Which DEO builds in a town:** DPWH contract rows show it, e.g. Kadingilan and Maramag
  → 2nd DEO; Malaybalay → 1st DEO.

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
See [data-sources/dpwh-projects-api.md](data-sources/dpwh-projects-api.md).

## Officials and context

- `officials.bettergov.ph/api/v1/places/bukidnon`: towns with seat counts, `poverty: 20.2`
  (source and year to confirm before display).
- `officials.bettergov.ph/api/v1/national/2025/provinces/bukidnon`: 2025 national and
  party-list results in the province.
- Budget hearings that mention Bukidnon: `GET /api/v1/hearings/search?q=Bukidnon` (for
  example, the DOT briefing of 2026-09-07 on tourism road maps for Bukidnon).
