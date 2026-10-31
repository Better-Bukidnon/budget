# BetterGov.ph Budget API (primary source)

| | |
| --- | --- |
| Base URL | `https://budget.bettergov.ph/api/v1` |
| Docs | <https://budget.bettergov.ph/docs> · OpenAPI: `/api/v1/openapi.json` (snapshot in [specs/budget-api-openapi.json](specs/budget-api-openapi.json)) |
| Auth | None. CORS open (`Access-Control-Allow-Origin: *`). Edge-cached. Fair-use rate limits may apply. |
| MCP | `https://budget.bettergov.ph/mcp` (same data as tools, handy during development) |
| Bulk source | Hugging Face `bettergovph/gaa` (named in the spec, **not used**: off-domain) |
| Status | ✅ Documented and public. The template portal is built entirely on it. |

## Datasets inside the API

| Prefix | What | Years | Grain |
| --- | --- | --- | --- |
| `/gaa` | Enacted budgets (General Appropriations Act) | 2020–2026 | Department → agency → program/activity/project (FPAP) → operating unit → fund → UACS object |
| `/nep/2027` | National Expenditure Program, compared with GAA 2026 (`base_amount`) | 2027 | Rollups by agency, program, expense_class, fund, **region**, object, **operating_unit**, **division** |
| `/hgab/2027` | House bill HB 10858 vs NEP, project by project, for 4 programs: `dpwh`, `fmr`, `hfep`, `nia`; DPWH money by district office; legislative district cards | 2027 | Project row, with PDF page links |
| `/budget-cycle` | Allotments and appropriations for selected departments (current new appropriations only) | 2018–2025 | Department/agency. **Not comparable 1:1 with GAA.** |
| `/hearings` | House budget hearings: topics, summaries, timelines, transcripts | FY2027 | Hearing → topic → transcript segment |

## Conventions (read before writing a client)

- **Envelope:** `{ meta, disclaimers, data }`. `meta` carries `notice`, `source_repo`,
  `source_commit` and `built_at`. Print `meta.notice` and `disclaimers` as they come.
- **Money:** exact integer pesos (`currency: PHP`, `scale: pesos`).
- **`null` ≠ 0:** `null` means "no such line in this document".
- **Paging, two styles:**
  - Cursor: the response has a **top-level** `next_cursor` (not inside `data` or `meta`);
    pass it back as `cursor`. Cursors are tied to the filters. Used by GAA programs and
    objects, GAA hierarchy, and NEP department rollups.
  - Offset: `limit` + `offset`, with `data.next_offset` (hgab projects at 200 rows a page,
    districts, hearings).
- **Caps:** national NEP rollups (`/nep/2027/rollups/{dim}`) return the top `limit` rows
  with no cursor. For complete lists use the department rollup
  (`/nep/2027/departments/{id}/rollups/{dim}`) and follow `next_cursor`. Example: DepEd
  has 11,716 operating units (`meta.total_items`).
- **Department ids:** GAA ids are two digits (`07` DepEd, `08` SUCs, `18` DPWH). The NEP
  adds synthetic `SPF` and `AUTO` (`AUTO` is not GAA `04`).

## Requests this portal makes

### Inherited from the template (2027 projects and 2020–2026 enacted budgets)

| Request | Use |
| --- | --- |
| `GET /hgab/2027` | Program names, status wording, plain terms, documents, rules |
| `GET /hgab/2027/datasets/dpwh/projects?office=Bukidnon {n} District Engineering Office` | Every DPWH line under each of the 4 DEOs (35 / 9 / 6 / 7 rows) |
| `GET /hgab/2027/datasets/{program}/projects?q=Bukidnon` | Lines whose title names Bukidnon (dpwh 183, fmr 8, hfep 5, nia 0) |
| `GET /hgab/2027/datasets/{program}/projects/{id}` | One project: every version, PDF pages, match labels |
| `GET /hgab/2027/districts/leg:bukidnon:{1st..4th}` | District card: representative, DEO, `years[]` 2020–2027, `by_congress`, FY2027 bridge |
| `GET /gaa/departments` | The 38 departments to search |
| `GET /gaa/departments/{id}/programs?q=…` | Program families naming a place, with amount per year 2020–2026 (500 a page) |

### Added for Bukidnon

| Request | Use |
| --- | --- |
| `GET /nep/2027/rollups/division?limit=500` | DepEd division totals: Bukidnon, Malaybalay City, Valencia City |
| `GET /nep/2027/departments/07/rollups/operating_unit?limit=2000&cursor=…` | DepEd units: division offices and schools with their own allotment (filter on the region digits `10`) |
| `GET /gaa/years/{y}/departments/07/children?level=fpaps&parent=07-001` → `level=operating_units&parent=<fpap>` | 2020–2026 history per division and school |
| `GET /gaa/years/{y}/departments/08/children?level=agencies` | SUC totals per year: CMU `08-091`, BukSU `08-089`, NBSC `08-116` |
| `GET /nep/2027/departments/08/rollups/agency` | SUC NEP 2027 (codes `091`, `089`, `116`) |
| `GET /nep/2027/departments/{10,13,…}/rollups/operating_unit` | PENRO Bukidnon, PARO Bukidnon, Malaybalay TRC (allowlisted codes) |
| `GET /nep/2027/rollups/region?code=10&by=department` | Region X by department, as context for "Bukidnon within Northern Mindanao" |
| `GET /hearings/search?q=…` | What was said about Bukidnon, Malaybalay, Valencia, CMU and BukSU in budget hearings, with video links |
| `GET /hearings/{video_id}/topics/{index}` | One topic's record, for the hearing detail view |
| `GET /gaa/years/{y}/departments/18/children?level=fpaps&parent=18-001` → `level=operating_units&parent=<fpap>` | Namesake review only (not at runtime): which DPWH office a 2020–2026 line naming Bukidnon is listed under. See [DPWH lines by office](#dpwh-lines-by-office-20202026) |

The hgab `office` filter takes the **published** name ("Bukidnon 1st District Engineering
Office"), not the card name ("Bukidnon 1st DEO").

## Known limits (from the template's notes and our probing)

1. **No municipality code on project lines.** Places are found by title text. Upstream
   plans `GET /hgab/2027/places/{psgc}/projects`; when it ships, municipality pages
   should switch to it.
2. **GAA has no place or office filter.** DPWH money per office per year comes from the
   district card's `years[]`, not from GAA routes. One line's office can be looked up in
   the hierarchy route ([below](#dpwh-lines-by-office-20202026)), but not filtered on.
3. **Use `programs`, not `/gaa/search`** for place searches. Search caps at 100 results
   with no paging.
4. **In GAA program `years`, a year counts only where `amount > 0`.** `count` carries old
   lines forward at ₱0.
5. **The GAA `objects` text search doesn't see operating-unit names.** `q=Bukidnon` on
   DepEd objects returns 0. Use the hierarchy route instead.
6. **FY2027 GAA isn't enacted yet** (House bill at third reading as of this writing).
   Plan for a `/gaa` 2027 year to appear and for the House-vs-NEP pages to gain an
   enacted column.

## DPWH lines by office (2020–2026)

The GAA has no office filter (limit 2), but the hierarchy route does say which office one
line is listed under. That's enough to check where a line found by name sits, one line at a
time. Used by `scripts/bukidnon/review-namesakes.ts` at review time, never by pages.

```text
GET /gaa/years/{y}/departments/18/children?level=fpaps&parent=18-001&limit=500[&cursor=…]
    → every DPWH program/activity/project (FPAP) that year with amount > 0
      (about 25,000 a year, 37–57 pages; no text filter, so filter client-side)
GET /gaa/years/{y}/departments/18/children?level=operating_units&parent=<fpap id>
    → the office(s) it is listed under, with the amount under each
```

- **What it returns for Bukidnon** (checked 2026-10-31): 3,526 FPAP-years whose description
  contains "Bukidnon". Offices seen: Bukidnon 1st–4th DEOs (codes `1800147`, `1800148`,
  `1800149`, `1800199`), Central Office (`0100000`), Regional Office X and IX, and DEOs
  outside the province: Davao City 2nd (`1800161`), Davao City, Davao del Norte,
  Cotabato 1st–3rd, Cagayan de Oro City 1st and 2nd, Misamis Oriental 1st and 2nd,
  Agusan del Norte, Lanao del Norte 2nd.
- **Joining to program families:** a family (`/gaa/departments/18/programs`) is one name in
  one agency; its `fam_key` is `<agency>|<name>` with whitespace collapsed, lower case, and
  everything but letters, digits and spaces removed. FPAP descriptions normalised the same
  way match all 3,296 Bukidnon families.
- **Caveats:** about 4,000 requests for one full review (pages are sequential per year;
  the script caches them under `node_modules/.cache/`). `include_zero=true` adds ₱0 lines
  and once returned HTTP 500 mid-way through 2025; it isn't needed, since a GAA year only
  counts where the amount is above zero. The page size caps at 500.
- **Central Office lines** carry no place: the office only says DPWH headquarters manages
  them. Their names, and the offices that list other sections of the same road, decide
  (see [bukidnon-reference.md](../bukidnon-reference.md#namesake-review)).

## Example: one district card

```bash
curl -s "https://budget.bettergov.ph/api/v1/hgab/2027/districts/leg%3Abukidnon%3A2nd" \
  | jq '.data.offices[0] | {name, tier, years: [.years[] | {fy, stage, php}]}'
```
