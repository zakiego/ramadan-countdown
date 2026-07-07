# AGENTS.md

## Project Overview

Ramadan Countdown is a [TanStack Start](https://tanstack.com/start) application that provides a countdown to the next Ramadan, deployed to Cloudflare Workers. Ramadan dates are stored directly in TypeScript code at `src/data/ramadan.ts`.

### Architecture: static-first for traffic spikes

The site historically gets ~100k visitors/day around Ramadan. To stay within Cloudflare Workers request limits:

- The home page is **prerendered at build time** (`prerender` in `vite.config.ts`) and served as a static asset. Static asset requests are free and unlimited on Workers and never invoke the Worker.
- Only `/api/*` requests invoke the Worker.
- Because prerendering bakes in "the next Ramadan" for SEO metadata, the site must be **redeployed after each Eid** (CI has a monthly scheduled rebuild for this) and whenever a new year is added to the data.

## Setup & Development

- **Install dependencies**: `pnpm install`
- **Start dev server**: `pnpm dev` (http://localhost:3000)
- **Build project**: `pnpm run build` (vite build + prerender + `tsc --noEmit`)
- **Preview production build**: `pnpm preview` (runs in workerd via the Cloudflare Vite plugin)
- **Deploy**: `pnpm run deploy` (requires Wrangler auth for the personal Cloudflare account)

## Code Style & Linting

- **Formatter/Linter**: [Biome](https://biomejs.dev/)
  - Run check: `pnpm lint`
  - Apply fixes: `pnpm exec biome check --apply .`
- **TypeScript**: Strict mode. Use Zod for input validation (see the API routes).
- **Styles**: Tailwind CSS v4 (configured in `src/styles/app.css` via `@theme`, no tailwind.config file).
- **Conventions**:
  - File-based routes live in `src/routes` (TanStack Router). `src/routeTree.gen.ts` is generated — never edit it.
  - Page routes use `component`; API routes use `server.handlers`.
  - Keep logic in `src/utils`; data types in `src/data/ramadan.ts`.
  - Prefer functional components and React hooks.

## Testing

- **Framework**: Vitest.
- **Run tests**: `pnpm test`
- Test files follow the `*.test.ts` naming convention (see `src/utils/ramadan-state.test.ts`).

## Data Structure

- Ramadan data is stored in `src/data/ramadan.ts` as a TypeScript array.
- Each entry contains: year, hijriYear, ramadanStart, ramadanEnd, and eidAlFitr dates.
- To add a new year, add a new entry to the `ramadanData` array and deploy.

## API Endpoints

Defined as TanStack Start server routes in `src/routes/api/`:

- `/api/countdown`: Returns current countdown data (accepts `?timezoneOffset=`).
- `/api/ramadan`: Returns whether today is Ramadan (accepts `?timezoneOffset=`).
- `/api/history`: Returns all known Ramadan dates.

These are public JSON APIs with open CORS — keep response shapes backward compatible.
