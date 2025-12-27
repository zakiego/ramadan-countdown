# AGENTS.md

## Project Overview

Ramadan Countdown is a Next.js 14 application that provides a countdown to the next Ramadan. It uses Keystatic as a headless CMS, storing data locally in `public/content/ramadan/` as JSON files.

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
  - Content schemas are defined in `keystatic.config.ts`.
  - Prefer functional components and React Hooks.

## Testing

- **Framework**: Vitest.
- **Run tests**: `pnpm vitest`
- **Note**: Test files should follow the `*.test.ts` or `*.spec.ts` naming convention. TSConfig includes `vitest/globals`.

## Data Structure

- Ramadan data is stored in `public/content/ramadan/`.
- Each year has a `.json` file for structured data and a `.mdoc` file for notes.
- Schema is managed via Keystatic in `keystatic.config.ts`.

## API Endpoints

- `/api/countdown`: Returns current countdown data.
- `/api/history`: Returns historical Ramadan dates.
- `/api/ramadan`: General Ramadan data endpoint.
