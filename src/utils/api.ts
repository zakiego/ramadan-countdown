export const REPOSITORY_URL = "https://github.com/zakiego/ramadan-countdown";

/**
 * Shared headers for the public JSON API endpoints.
 * CORS is wide open on purpose — these are read-only public data endpoints.
 */
export const jsonHeaders = {
  "access-control-allow-origin": "*",
} as const;
