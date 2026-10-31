# Officials / Dynasties API

| | |
| --- | --- |
| Base URL | `https://officials.bettergov.ph/api/v1` (the same API also answers at `https://dynasties.bettergov.ph/api/v1`) |
| Docs | The root (`GET /api/v1`) lists the endpoints and points to [dynasties.bettergov.ph/developers](https://dynasties.bettergov.ph/developers). The same text is in the site's repo: [bettergovph/officials-network-graph `docs/api.md`](https://github.com/bettergovph/officials-network-graph/blob/main/docs/api.md). No OpenAPI file (`/api/v1/openapi.json` → 404). |
| Auth | None. |
| CORS | ✅ Open. `Access-Control-Allow-Origin: *` on `GET`; the `OPTIONS` preflight answers `204` with `access-control-max-age: 86400`. The docs also say "CORS open". Checked 2026-10-31. |
| Caching | `Cache-Control: public, max-age=3600, s-maxage=86400`. The docs: "cached at the edge for a day; the data changes once per election". |
| Rate limits | None published or seen. |
| Licence | From every response's `meta.license`: "Derived data CC0 1.0 by BetterGov.ph; cite Open Halalan for election results and PSA for poverty incidence." `meta.source` names Open Halalan (Robert R. Leung). `meta.data_vintage`: `2026-09-14`. |
| MCP | `POST https://officials.bettergov.ph/mcp` (streamable HTTP, stateless) |
| Coverage | Local and national elections 2001–2025 (`/coverage`: winners, candidacies, contests, towns per year; vote counts from 2010) |
| Status | ✅ Public, documented, CORS-open. Usable from the browser or a snapshot. |

## Endpoints (as listed by the API)

```text
/api/v1/stats
/api/v1/coverage
/api/v1/places
/api/v1/places/{province}
/api/v1/places/{province}/{town}
/api/v1/contests?year&province&town&position&district&candidates=1&page&limit
/api/v1/contests/{id}
/api/v1/persons?q=&province
/api/v1/persons?province&min_runs&sort=wins|runs|losses&page
/api/v1/persons/{id}
/api/v1/national/{year}
/api/v1/national/{year}/provinces/{province}
/api/v1/blocs?year|all&province&region&min&surname&members=1&page
/api/v1/blocs/{id}
/api/v1/compare?province&town&position&district
```

### `/contests` parameters (checked 2026-10-31)

| Param | Behaviour |
| --- | --- |
| `province`, `town` | A slug (`bukidnon`, `impasug-ong`) or the name. A `town` query also returns the district seats the town votes in. |
| `position` | Aliases from the docs: `governor`, `vice governor`, `representative`, `board member`, `mayor`, `vice mayor`, `councilor`. The stored names also work (`MEMBER, HOUSE OF REPRESENTATIVES`, `PROVINCIAL BOARD MEMBER`). Case-insensitive. `mayor` returns mayors only, not vice mayors. |
| `district` | The **word** form: `FIRST`, `SECOND`, `THIRD`, `FOURTH`, case-insensitive. `district=1` returns 0 contests with no error. |
| `limit`, `page` | Default `limit` 50, **maximum 200** (`limit=1000` comes back as 200). The response has `page` and `limit` but **no total count**: keep paging until a page has fewer rows than `limit`. |

Bukidnon 2025 has 76 contests: governor 1, vice governor 1, representative 4, provincial
board member 4, mayor 22, vice mayor 22, councilor 22. All fit in one `limit=200` page.

## What it gives Bukidnon

| Request | Use in the portal |
| --- | --- |
| `GET /places/bukidnon` | The election town list (name, slug, seats across all years), region, and `poverty: 20.2` (see below) |
| `GET /places/bukidnon/{town}` | Each town's officials over time, for municipality pages |
| `GET /contests?year=2025&province=bukidnon&position=…` | Governor, vice governor, board members and mayors elected in 2025 |
| `GET /contests?year=2025&province=bukidnon&position=representative` | **Which district each town is in**: each of the 4 rows has `district` and `district_towns[]` |
| `GET /national/2025/provinces/bukidnon` | How the province voted nationally in 2025 (senators, party lists) |
| `GET /blocs?province=bukidnon` | Political-family blocs. **Not shown** (decision D5: officials list only) |

### District per town (2025)

From `position=representative`. The four lists cover all 22 towns, each exactly once.
The `board member` contests carry the same four lists.

| `district` | `district_towns` |
| --- | --- |
| `FIRST` | BAUNGON, LIBONA, MALITBOG, MANOLO FORTICH, SUMILAO, TALAKAG |
| `SECOND` | CABANGLASAN, IMPASUG ONG, LANTAPAN, MALAYBALAY, SAN FERNANDO |
| `THIRD` | DAMULOG, DANGCAGAN, DON CARLOS, KADINGILAN, KIBAWE, KITAOTAO, MARAMAG, QUEZON |
| `FOURTH` | KALILANGAN, PANGANTUCAN, VALENCIA |

Read this from the API at build time. The table is here to check builds against. The DEO
serving each district is in [bukidnon-reference.md](../bukidnon-reference.md#legislative-districts-and-dpwh-district-engineering-offices).

### The `poverty` figure

`poverty: 20.2` for Bukidnon equals PSA's **2023 poverty incidence among families**
(statistics.bettergov.ph dataset `d4aac603f5dc8c5cdb21`, Table 1, code `77`). The API's
licence line says to cite PSA for it. The API doesn't give the year or say whether it's
families or population, so don't display it from here. Read it from the statistics API,
which gives the year, release and coefficient of variation (see
[statistics-api.md](statistics-api.md#poverty)).

## Joining to other sources

The API has no PSGC codes. The town slugs match the `slug` property in the dynasties map
shapes, which also carry the PSGC code (see [map-shapes.md](map-shapes.md)). That gives
officials slug ↔ PSGC ↔ census population. Spelling differs between sources: `IMPASUG ONG`
here, `Impasug-ong` in PSGC; `MALAYBALAY` here, `City of Malaybalay` in PSGC.

## Caveats

- Names are upper case (`BUKIDNON`, `IMPASUG ONG`). Map slugs to display names once, in
  config.
- Election winners ≠ current office holders (successions, vacancies). Label pages "elected
  in 2025".
- "Dynasty" and "bloc" framings are BetterGov's analysis. If shown, link to their
  methodology and keep the template's no-allegations tone. The MCP server's own
  instructions say shared surnames "indicate, not prove, kinship".
