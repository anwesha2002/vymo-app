/**
 * Source of truth for layout breakpoints (px).
 * CSS media queries cannot read custom properties, so the same values are
 * written literally in the *.module.css files (768px, 1024px).
 *
 * - below `mobile`: phone, single column, sticky submit
 * - `mobile`..`desktop`: tablet, single column in a centered container
 * - above `desktop`: two-column grid
 */
export const BREAKPOINTS = { mobile: 768, desktop: 1024 } as const;
