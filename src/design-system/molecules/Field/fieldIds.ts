export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;

/** The control points at the error while one shows, otherwise at the hint. */
export function describedById(id: string, hasError: boolean, hasHint: boolean): string | undefined {
  if (hasError) return errorId(id);
  if (hasHint) return hintId(id);
  return undefined;
}
