/**
 * Normalized shape every HTTP error is converted into before it
 * reaches a component. Keeps feature code decoupled from raw
 * HttpErrorResponse details.
 */
export interface ApiError {
  status: number;
  message: string;
  /** Original error, kept for debugging/logging only — never shown to users. */
  cause?: unknown;
}
