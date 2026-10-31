/**
 * Lines the place search finds that are not in Bukidnon. portal.config.ts passes
 * them to the template as `scope.exclude`; the About page lists each one with its
 * reason, and `npm run check` fails if a key stops matching a line.
 *
 * Reviewed 2026-10-31 (#8). How: docs/bukidnon-reference.md#namesake-review.
 */
import type { Exclusion } from '../config';
import { gaaNamesakes } from './exclusions-gaa';

/** FY2027 lines (NEP and House bill), reviewed by hand from `npm run check -- --verbose`. */
const lines2027: Exclusion[] = [
  {
    key: 'dpwh:house-reading:2551',
    reason:
      'Listed under the Cagayan de Oro City 1st District Engineering Office, not a Bukidnon office. "Bukidnon" is part of the road\'s name (CDO–Airport–Bukidnon Road); the title names no place in Bukidnon.',
  },
];

export const exclusions: Exclusion[] = [...lines2027, ...gaaNamesakes];
