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
  // A placeholder: settle the real name and contact before the v0.1 release (#10).
  operator: { name: 'Independent volunteers' },
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
