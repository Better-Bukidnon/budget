# Data rules

Every page that shows a figure keeps these rules. The first group comes from the template
(they're why budget.bettergov.ph can be trusted). The second group covers what Bukidnon's
data adds.

## Inherited from the template (do not weaken)

1. **Amounts exactly as published**, in integer pesos. A dash means "this document has no
   such line", never zero.
2. **NEP and House bill are two versions of one budget**: compared, never added.
3. **"In the House bill only" / "In the NEP only" are candidates**: leads to check, not
   confirmed insertions or deletions. Unconfirmed matches are flagged on every row.
4. **A DPWH office serving several districts is shown whole**, never split. (All four
   Bukidnon DEOs are Tier A, so this doesn't bite here yet.)
5. **Disclaimers print from the API response** (`meta.notice`, `disclaimers`) on every
   page with figures, so their wording can't drift.
6. **Nothing is hidden silently.** Hand exclusions are listed with reasons on the About
   page.
7. **Enacted amounts are appropriations** (authority to spend), not spending. A GAA year
   counts only where its amount is above zero. Years sit side by side; 2027 versions are
   never added to them.
8. **`npm run check` reconciles** every search against the API's own totals.

## Added for Bukidnon

### Namesakes

9. **A name match is a lead, not a location.** Every row says why it is in the portal
   (office, place name, operating-unit code, allowlist).
10. **Known namesakes.** Require `Bukidnon` in the title, a Region X code, or an allowlisted
    id for these:

    | Bukidnon name | Also matches |
    | --- | --- |
    | Quezon | Quezon Province, Quezon City, Quezon towns in other provinces (PENRO/PARO Quezon, Quezon National Agricultural School, Revenue Region 7A Quezon City) |
    | San Fernando | San Fernando City (La Union, Pampanga) and towns in Cebu, Camarines Sur, Masbate, Romblon |
    | Valencia | Valencia, Bohol; Valencia, Negros Oriental; Estero de Valencia (Manila); Valencia Creek (QC) |
    | Don Carlos | Don Carlos Gothong Memorial NHS (Cebu) |
    | Malitbog | Malitbog, Southern Leyte |
    | Bukidnon | Roads named after Bukidnon outside it: Davao–Bukidnon Rd (Davao City), Bukidnon–Cotabato Rd and Paco–Roxas–Arakan Valley–Jct Davao–Bukidnon Rd (Cotabato), CDO–Airport–Bukidnon Rd (Cagayan de Oro), the East–West lateral road "connecting Agusan del Sur to Bukidnon" (Agusan, Surigao del Sur), Bukidnon–Compostela Valley Rd packages in Davao del Norte and Davao de Oro |

    The 2027 lists carry a region, so the region rule drops most of these. The 2020–2026 GAA
    carries none, so they're excluded by hand, each with the office or name that places it
    elsewhere: [bukidnon-reference.md](bukidnon-reference.md#namesake-review).

11. **DEO numbers ≠ district numbers.** Always label an office with the district it serves
    ("Bukidnon 1st DEO, serving the 2nd District").

### Overlapping rollups

12. **DepEd `division` and `operating_unit` rollups overlap.** The division figure is the
    whole division; the unit figure is the division office alone; schools are separate
    units. Show one or the other in a total, never both.
13. **NEP `base_amount` is the FY2026 GAA.** Label it "2026 enacted", not "2026 NEP".

### Mixing sources

14. **Contract amounts (DPWH projects API) are not appropriations.** They have centavos,
    a different scope and a different year logic. Never add them to Budget API figures
    or chart them on the same axis.
15. **Contract status is DPWH's status, as BetterGov reports it.** "For procurement",
    "terminated", "behind schedule" are facts about a record, not findings. No
    allegation words (anomaly, ghost, overpriced) anywhere in the UI.
16. **Snapshots show their date.** Any figure from a build-time snapshot shows "as of
    {retrieved_at}" and links to the request that produced it.
17. **Per-capita means budget per resident**, from PSA population via
    statistics.bettergov.ph, with the population year shown.
18. **Officials' data is about public roles only.** No personal data beyond what the
    officials API publishes about candidates and office holders.
