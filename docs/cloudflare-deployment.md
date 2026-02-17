# Cloudflare Workers Deployment

This project can be deployed to Cloudflare Workers using the OpenNext adapter.

## Prerequisites

- Cloudflare account
- Wrangler CLI authenticated (`wrangler login` or `wrangler whoami` to verify)
- Node.js 18+ and pnpm

## Configuration Files

- `wrangler.jsonc` - Cloudflare Worker configuration (account ID, worker name, compatibility settings)
- `open-next.config.ts` - OpenNext adapter configuration

## Local Development

```bash
# Standard Next.js development server
pnpm dev

# Build and run with Wrangler locally (simulates Cloudflare Workers environment)
pnpm preview
```

The preview command will:
1. Build the Next.js app using OpenNext
2. Start a local Wrangler dev server at http://localhost:8787

## Deployment

```bash
# Build and deploy to Cloudflare Workers
pnpm deploy
```

This will:
1. Build the Next.js app for Cloudflare Workers
2. Deploy to your Cloudflare account

## Architecture Notes

### Static Data Loading

Ramadan data is loaded via static imports from the TypeScript data file:

- Data files: `public/content/ramadan/*.json`
- Static loader: `src/utils/ramadan-data.ts`

### Adding New Ramadan Years

To add a new Ramadan year (e.g., 2027):

1. Create the JSON file: `public/content/ramadan/2027.json`

   ```json
   {
     "year": "2027",
     "ramadanStart": "2027-02-07",
     "ramadanEnd": "2027-03-08",
     "eidAlFitr": "2027-03-09"
   }
   ```

2. Update `src/utils/ramadan-data.ts` to import the new file:

   ```typescript
   import ramadan2027 from "../../public/content/ramadan/2027.json";

   const rawData = [ramadan2023, ramadan2024, ramadan2025, ramadan2026, ramadan2027];
   ```

### Content Management

To manage Ramadan dates:

1. Edit the `ramadanData` array in `src/data/ramadan.ts`
2. Add or update entries with the correct dates
3. Commit and push changes to trigger redeployment

## Troubleshooting

### Build Errors

If you encounter build errors related to workerd:

```bash
# Approve build scripts for workerd
pnpm approve-builds
```

### Worker Size Limits

Cloudflare Workers have size limits:
- Free plan: 1MB
- Paid plans: 10MB (with 50MB for startup)

Monitor your bundle size during builds. If the bundle is too large, consider:
- Using `lodash-es` instead of full `lodash`
- Removing unused dependencies
- Code splitting

### API Routes

All API routes work on Cloudflare Workers:
- `/api/countdown` - Returns countdown data
- `/api/history` - Returns historical Ramadan dates
- `/api/ramadan` - Returns current Ramadan data

## Environment Variables

To add environment variables for production:

1. Add to `wrangler.jsonc`:

   ```jsonc
   {
     "vars": {
       "MY_VAR": "value"
     }
   }
   ```

2. Or use Wrangler CLI:

   ```bash
   wrangler secret put MY_SECRET
   ```

## Useful Commands

```bash
# Check Wrangler authentication
wrangler whoami

# View deployment logs
wrangler tail

# List deployments
wrangler deployments list
```
