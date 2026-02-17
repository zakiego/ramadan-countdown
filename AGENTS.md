# AGENTS.md

## Project Overview

Ramadan Countdown is a Next.js 14 application that provides a countdown to the next Ramadan. Ramadan dates are stored directly in TypeScript code at `src/data/ramadan.ts`.

## Setup & Development

- **Install dependencies**: `pnpm install`
- **Start dev server**: `pnpm dev`
- **Build project**: `pnpm build`
- **Start production server**: `pnpm start`

## Code Style & Linting

- **Formatter/Linter**: This project uses [Biome](https://biomejs.dev/) for formatting and linting.
  - Run check: `pnpm biome check .`
  - Apply fixes: `pnpm biome check --apply .`
- **Linting (Next.js)**: `pnpm lint`
- **TypeScript**: Strict mode is enabled. Use Zod for schema validation (see `src/app/(home)/utils.ts`).
- **Styles**: Tailwind CSS for styling.
- **Conventions**:
  - Use App Router (files in `src/app`).
  - Keep logic in `utils.ts` or `src/utils`.
  - Data types are defined in `src/data/ramadan.ts`.
  - Prefer functional components and React Hooks.

## Testing

- **Framework**: Vitest.
- **Run tests**: `pnpm vitest`
- **Note**: Test files should follow the `*.test.ts` or `*.spec.ts` naming convention. TSConfig includes `vitest/globals`.

## Data Structure

- Ramadan data is stored in `src/data/ramadan.ts` as a TypeScript array.
- Each entry contains: year, hijriYear, ramadanStart, ramadanEnd, and eidAlFitr dates.
- To add a new year, simply add a new entry to the `ramadanData` array.

## API Endpoints

- `/api/countdown`: Returns current countdown data.
- `/api/history`: Returns historical Ramadan dates.
- `/api/ramadan`: General Ramadan data endpoint.
