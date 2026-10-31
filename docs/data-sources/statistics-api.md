# Philippine Data Explorer (`statistics.bettergov.ph`)

| | |
| --- | --- |
| Base URL | `https://statistics.bettergov.ph/api/v1` |
| Docs | `/llms.txt`, `/api.md` (API guide), `/api/v1/openapi.json` |
| Auth | None. Limits per `/coverage`: 5,000 points per query, 64 matching chunks, 2 concurrent queries per process. |
| MCP | `https://statistics.bettergov.ph/mcp` |
| What it is | Saved snapshots of PSA OpenSTAT (3,678 datasets, 3,661 mirrored; inventory checked 2026-10-02). Not official, not live. PSA remains the authority. |
| Status | ✅ Public and documented. |

## Workflow (from its llms.txt)

1. Find a dataset: `GET /datasets?q=…` (search by topic; titles don't contain province
   names, so `q=Bukidnon` returns 0).
2. Read its metadata and dimensions (e.g. `Region/Province`, 103 codes in the poverty
   tables).
3. Look up the dimension **code** for Bukidnon. Use source codes, not display labels.
4. Query an exact `release` and selection.
5. Cite: official source URL, dataset title, release, retrieval date.

Also: `/api/v1/topics`, `/api/v1/coverage`, `/api/classification` (nine PSA
classification systems; check whether **PSGC** is one, which would give official LGU
codes from a bettergov.ph host), and `/regional/inventory.csv` (metadata only).

## What we want from it

| Indicator | Use | Note |
| --- | --- | --- |
| Population by province and city/municipality | Per-capita views ("₱ per resident") on the overview and town pages | Find the census dataset and its latest year |
| Poverty incidence by province | Context next to budget figures | Some poverty tables found so far end in 2015 (`latestYear`). Pick the most recent series and show its year. |
| Regional GDP (GRDP) for Region X | Context only | Region level, not province |

## Rules (from the source, adopted here)

- Missing values are null, not zero.
- Don't sum overlapping geographies or mix quarterly and annual figures.
- Show the release and retrieval date beside every figure.
- A per-capita figure divides an appropriation by population. Label it "budget per
  resident", never "spent per resident".
