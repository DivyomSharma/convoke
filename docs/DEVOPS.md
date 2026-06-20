# DevOps & CI/CD

## Deployment Pipeline
Convoke is deployed exclusively on **Vercel**, leveraging its tight integration with Next.js for Edge routing, serverless functions, and static caching.

### Branch Strategy
- **`main`**: The canonical production branch. Any code merged into `main` triggers a production deployment.
- **Preview Branches**: Any PR or push to non-main branches triggers a Vercel Preview Deployment, allowing for visual regression testing and staging reviews before merging.

### Build Configuration
- **Package Manager**: `npm`.
- **Pre-requisites**: `npm run build` runs `next build`.
- **Crucial Hook**: A `postinstall` script (`prisma generate`) is strictly required in `package.json` to ensure the Prisma Client is rebuilt in the Vercel environment prior to Next.js compilation, as Vercel aggressively caches `node_modules`.

## Database Migrations
- Prisma acts as the source of truth for the Supabase schema.
- Migrations are pushed via the CLI (`npx prisma db push` or `npx prisma migrate deploy`).
- *Warning*: Schema changes must be applied to the database *before* the Vercel deployment completes if the new code relies on those schema changes.

## Environment Variables
- Handled via Vercel's Environment Variable manager.
- Segregated by environment: `Production`, `Preview`, and `Development`.
- Keys include Supabase connections, Clerk API keys, and Webhook secrets.

## Monitoring
- **Vercel Logs**: Used for runtime execution tracking.
- **Next Steps**: Integrate Sentry or Datadog for granular exception tracking and performance alerting.
