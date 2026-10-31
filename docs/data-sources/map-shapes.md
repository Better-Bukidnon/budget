# Map shapes from `dynasties.bettergov.ph`

| | |
| --- | --- |
| What | Static GeoJSON files behind the map on [dynasties.bettergov.ph](https://dynasties.bettergov.ph). They are part of the site, not an API. |
| Files | `https://dynasties.bettergov.ph/data/geo/regions.json.gz`, `…/data/geo/provinces.json.gz`, `…/data/geo/cities/{province-slug}.json.gz` |
| Docs | None. Found in the site's JavaScript bundle (2026-10-31). |
| Auth | None. |
| CORS | ❌ **No `Access-Control-Allow-Origin` header.** A browser on our domain can't fetch these files. Build time only. |
| Caching | `Cache-Control: public, max-age=0, must-revalidate`, with an `ETag` |
| Provenance | The site's map credits "boundaries PSGC 2023" and links to [faeldon/philippines-json-maps](https://github.com/faeldon/philippines-json-maps) (MIT licence). BetterGov's copy appears to be simplified from it. |
| Status | ⚠️ Hosted on a bettergov.ph host, so it passes hard rule 1, but it is an undocumented site asset that could move without notice. Ask BetterGov before depending on it (Phase 0 question). Use depends on decision D4. |

## Format

- Each file is a **gzip file served as `Content-Type: application/gzip`**, not gzip
  transfer encoding. `fetch().json()` fails on it; decompress it first (`zlib.gunzipSync`
  in Node).
- Inside: a GeoJSON `FeatureCollection` in longitude/latitude (no `crs`, no `bbox`).
  Coordinates have at most 4 decimals (about 11 m), so outlines are simplified.
- **A missing file returns HTTP 200 with the site's HTML page** (single-page-app fallback),
  not a 404. Check `Content-Type: application/gzip` before parsing.

## What it gives Bukidnon

| Request | Result (2026-10-31) |
| --- | --- |
| `GET /data/geo/cities/bukidnon.json.gz` | 12,752 bytes (51,729 unzipped). **22 `Polygon` features**, one per city or municipality, 2,715 points in all. Properties: `name` (`"BAUNGON"`), `slug` (`"baungon"`), `label` (`"Baungon"`, `"City of Malaybalay"`), `psgc` (`1001301000`). |
| `GET /data/geo/provinces.json.gz` | 192,880 bytes. 88 provinces (29 `Polygon`, 59 `MultiPolygon`). Bukidnon: `{ name: "BUKIDNON", slug: "bukidnon", region: "REGION X", psgc: 1001300000 }`. |
| `GET /data/geo/regions.json.gz` | 105,999 bytes. 17 regions. Region X: `psgc: 1000000000`. |

No barangay outlines.

## Why it matters beyond maps

Each town feature carries both the **officials API slug** and the **PSGC code**. It is
the only bettergov.ph source found that links the two, so it joins officials data to
census population (see [officials-api.md](officials-api.md#joining-to-other-sources) and
[statistics-api.md](statistics-api.md#psgc-official-lgu-codes)). All 22 slugs match
`/places/bukidnon`, and all 22 codes match PSGC `Q2_2024`.

For Bukidnon the slug ↔ PSGC table is short and stable, so it can also live in
`src/bukidnon/` as a checked constant (see
[bukidnon-reference.md](../bukidnon-reference.md#lgus-2-component-cities-20-municipalities)).
A test can compare it with this file and with PSGC.

## Caveats

- `psgc` is a **number**, so codes for regions 01–09 lose their leading zero (Ilocos
  Norte is `102800000`, not `0102800000`). Bukidnon is unaffected (region 10), but convert
  to a 10-digit string anyway.
- The boundaries are labelled PSGC 2023. All 22 codes in the file exist, with the same
  towns, in PSGC `Q2_2024`.
- Outlines are for display. Don't use them to decide which town a DPWH contract is in;
  contract coordinates are often unverified (see [dpwh-projects-api.md](dpwh-projects-api.md)).
- Credit both BetterGov and faeldon/philippines-json-maps (MIT notice) on the About page if
  the shapes ship.

## How we'd use it

If D4 allows outlines: download `cities/bukidnon.json.gz` and `provinces.json.gz` in the
snapshot script, check the content type, unzip, keep the Bukidnon features, and write
`public/data/bukidnon-shapes.json` with `retrieved_at` and the source URLs. The page
draws it as SVG; no browser request goes to dynasties.bettergov.ph, so the
Content-Security-Policy is unaffected.
