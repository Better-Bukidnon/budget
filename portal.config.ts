/**
 * This portal's configuration: the only file a fork needs to edit.
 * What each field means: src/config.ts. Generate one with `npm run setup`;
 * check it against the live API with `npm run check`.
 *
 * The Province of Bukidnon (Region X). Its four DPWH district engineering
 * offices bring in every DPWH line listed under them; the place name brings in
 * lines from all four programs whose title names Bukidnon (Central Office
 * projects, farm-to-market roads, health facilities, irrigation).
 *
 * The DEO numbers do not match the district numbers: the 3rd DEO serves the
 * 1st District, the 1st DEO the 2nd, the 2nd DEO the 3rd, and the 4th DEO the
 * 4th. See docs/bukidnon-reference.md.
 */
import { defineConfig } from './src/config';
import { exclusions } from './src/bukidnon/exclusions';

export default defineConfig({
  id: 'bukidnon-province',
  kind: 'province',
  name: 'Province of Bukidnon',
  shortName: 'Bukidnon',
  // Independent / civil society, not the provincial government (decision D1).
  // No link or contact yet: betterbukidnon.org is not a site yet.
  operator: { name: 'Better Bukidnon' },
  // Branding (#9). No logo: D1 rules out official seals and LGU logos. The canonical
  // URL is the public domain, which the production Worker serves (D7, wrangler.jsonc).
  siteUrl: 'https://budget.betterbukidnon.org',
  // Link previews say up front that this is not the provincial government's site (D1),
  // in the words of the Budget API's own notice.
  description:
    'Independent and unofficial. Every FY 2027 project for Bukidnon in the NEP and the House bill (House Bill 10858), with the source page for each, and the enacted budgets 2020–2026. Data from the BetterGov.ph Budget API.',
  // The template's "Create your own transparency portal" strip is for LGUs and offices,
  // not residents. The masthead's "Build your own" link and the footer still credit it.
  buildYourOwnStrip: false,
  scope: {
    offices: [
      'Bukidnon 1st District Engineering Office',
      'Bukidnon 2nd District Engineering Office',
      'Bukidnon 3rd District Engineering Office',
      'Bukidnon 4th District Engineering Office',
    ],
    places: [{ label: 'Bukidnon', region: 'X' }],
    districts: ['leg:bukidnon:1st', 'leg:bukidnon:2nd', 'leg:bukidnon:3rd', 'leg:bukidnon:4th'],
    // Namesakes: lines found by name that are elsewhere, each with its reason (#8).
    exclude: exclusions,
  },
  reporting: { enabled: false },
});
