# Cloudflare Workers Deployment

This project deploys to Cloudflare Workers using TanStack Start with the official [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/).

## Why this architecture

The app previously ran Next.js via OpenNext, where **every page view invoked the Worker** — with ~100k daily visitors during Ramadan season, that blew through the free plan's 100k requests/day limit.

Now:

1. `vite build` prerenders the pages (`/` and `/eid`) to static HTML at build time. A prebuild script also writes `public/sitemap.xml` with a fresh `lastmod`.
2. `wrangler deploy` uploads `dist/client` as **static assets** and `dist/server` as the Worker. `html_handling: "drop-trailing-slash"` makes `eid/index.html` serve at `/eid`, matching the canonical URLs.
3. Requests are matched against static assets **first** — pages, JS/CSS bundles, fonts, icons, `robots.txt`, `sitemap.xml` are all served without invoking the Worker. Static asset requests are **free and unlimited** on every Workers plan.
4. Only `/api/*` (and stray 404 paths) invoke the Worker.

So daily page traffic costs zero Worker requests; only API calls count.

### Consequence: rebuild to refresh SEO metadata

All SEO copy (title, description, JSON-LD, the "N days from today" answer, and the FAQ text) is computed at build time from `__BUILD_DATE__` (see `src/utils/seo.ts`). CI runs a daily scheduled rebuild so the prerendered day counts stay current, the sitemap `lastmod` updates, and the copy switches phases automatically (countdown before Ramadan, day tracker during, Eid greetings on the day). Deploy manually only when adding a new year to `src/data/ramadan.ts` or shipping code changes.

## Configuration Files

- `wrangler.jsonc` — Worker name, account id, compatibility settings. `main` points at `@tanstack/react-start/server-entry`; the Cloudflare Vite plugin resolves the final config to `dist/server/wrangler.json` during build (see `.wrangler/deploy/config.json`).
- `vite.config.ts` — TanStack Start + Cloudflare + Tailwind plugins, prerender settings. The prerender filter excludes `/api/*` so the API endpoints stay dynamic.
- `public/_headers` — long-lived immutable cache headers for hashed assets.

## Local Development

```bash
pnpm dev       # Vite dev server (Worker runtime emulated via workerd)
pnpm preview   # Build output served in workerd — closest to production
```

## Deployment

The Worker runs on the **personal** Cloudflare account (Zakiego Lab). Locally:

```bash
XDG_CONFIG_HOME="$HOME/.wrangler-accounts/personal" pnpm run deploy
# or interactively: pnpm run build && wrangler-personal deploy
```

CI (`.github/workflows/deploy.yml`) deploys `main` automatically via `cloudflare/wrangler-action`. It needs a `CLOUDFLARE_API_TOKEN` repository secret with **Workers Scripts: Edit** permission for the account (the account id is pinned in `wrangler.jsonc`).

## Custom domain

The Worker serves `ramadan-countdown.<subdomain>.workers.dev` out of the box. To attach `ramadan.zakiego.com`, either:

- Dashboard: Worker → Settings → Domains & Routes → Add → Custom domain, or
- Add to `wrangler.jsonc` and redeploy:

  ```jsonc
  "routes": [{ "pattern": "ramadan.zakiego.com", "custom_domain": true }]
  ```

Custom-domain traffic gets the same assets-first handling as workers.dev.

## Verifying the limits behavior

After deploying, confirm page views bypass the Worker: in the dashboard, Workers & Pages → ramadan-countdown → Metrics. Load the home page repeatedly — the request count should only rise when `/api/*` is called.

## Useful Commands

```bash
XDG_CONFIG_HOME="$HOME/.wrangler-accounts/personal" wrangler whoami
XDG_CONFIG_HOME="$HOME/.wrangler-accounts/personal" wrangler tail ramadan-countdown
XDG_CONFIG_HOME="$HOME/.wrangler-accounts/personal" wrangler deployments list
```
