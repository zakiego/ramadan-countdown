<p align="center">
  <a href="https://ramadan.zakiego.com/">
    <picture>
      <img src="https://raw.githubusercontent.com/zakiego/ramadan-countdown/main/public/icon.png" height="128">
    </picture>
    <h1 align="center">Ramadan Countdown</h1>
  </a>
</p>

This is a simple countdown app for Ramadan. It is built with [TanStack Start](https://tanstack.com/start) and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

The pages (the home countdown and the [Eid al-Fitr countdown](https://ramadan.zakiego.com/eid)) are prerendered to static HTML at build time and served as static assets — page views never invoke the Worker, so traffic spikes during Ramadan season don't count against Workers request limits. Only the JSON API endpoints below run in the Worker.

## API

```bash
curl "https://ramadan.zakiego.com/api/countdown?timezoneOffset=7"
```

Response:

```json
{
  "status": "countdown",
  "hijriYear": "1448H",
  "timezoneOffset": 7,
  "repository": "https://github.com/zakiego/ramadan-countdown",
  "countdown": {
    "days": 214,
    "hours": 12,
    "minutes": 26,
    "seconds": 5
  },
  "targetDate": "2027-02-07T00:00:00.000Z",
  "year": 2027
}
```

During Ramadan, `status` becomes `ramadan` (or `lailatul_qadr` in the last ten nights) with `day` / `totalDays`, and on Eid al-Fitr it becomes `eid`.

Other endpoints:

- `GET /api/ramadan` — is today Ramadan?
- `GET /api/history` — all known Ramadan dates

## Development

```bash
pnpm install
pnpm dev        # dev server at http://localhost:3000
pnpm test       # unit tests
pnpm run build  # build + prerender + typecheck
pnpm preview    # run the production build locally in workerd
```

## Adding a new Ramadan year

Edit `src/data/ramadan.ts` and add a new entry to the `ramadanData` array, then deploy.

## Deployment

```bash
pnpm run deploy
```

CI deploys `main` automatically (plus a daily scheduled rebuild so the prerendered day counts, sitemap `lastmod`, and seasonal SEO copy stay current). See `docs/cloudflare-deployment.md` for details.
