/**
 * Build timestamp injected by Vite `define` (see vite.config.ts).
 * Undefined in Vitest, where code paths must pass explicit dates instead.
 */
declare const __BUILD_DATE__: string | undefined;
