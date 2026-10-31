# Officials / Dynasties API

| | |
| --- | --- |
| Base URL | `https://officials.bettergov.ph/api/v1` (the same API also answers at `https://dynasties.bettergov.ph/api/v1`) |
| Docs | The root (`GET /api/v1`) lists the endpoints. No OpenAPI file (`/api/v1/openapi.json` → 404). |
| Auth | None observed. CORS not yet checked. |
| MCP | `POST https://officials.bettergov.ph/mcp` (streamable HTTP) |
| Coverage | Local and national elections 2001–2025 (`/coverage`: winners, candidacies, contests, towns per year; vote counts from 2010) |
| Status | ✅ Public and self-describing. Confirm CORS and terms in Phase 0. |

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

## What it gives Bukidnon

| Request | Use in the portal |
| --- | --- |
| `GET /places/bukidnon` | **Authoritative town list** (name, slug, seats across all years), region, a `poverty` figure (20.2; confirm source and year before showing) |
| `GET /places/bukidnon/{town}` | Each town's officials over time, for municipality pages |
| `GET /contests?year=2025&province=bukidnon&position=…` | Current governor, vice governor, board members, mayors; which district each town votes in |
| `GET /national/2025/provinces/bukidnon` | How the province voted nationally in 2025 (senators, party lists) |
| `GET /blocs?province=bukidnon` | Political-family blocs. **Editorial decision D5:** show or not |

## Caveats

- Names are upper case (`BUKIDNON`, `IMPASUG ONG`). Map slugs to display names once, in
  config.
- Election winners ≠ current office holders (successions, vacancies). Label pages "elected
  in 2025".
- "Dynasty" and "bloc" framings are BetterGov's analysis. If shown, link to their
  methodology and keep the template's no-allegations tone.
