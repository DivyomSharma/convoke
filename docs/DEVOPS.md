# DevOps & Deployment

**Source of Truth Version:** 1.0.0

## 1. Hosting Environment
Convoke is designed to be hosted entirely on **Vercel**.
- **Compute**: Next.js Serverless Edge Functions.
- **Routing**: Handled natively by Vercel's routing infrastructure (Middleware execution at the Edge).

## 2. Database Infrastructure
- **Provider**: PostgreSQL (Typically hosted via Supabase given the auth alignment).
- **ORM Synchronization**: The `package.json` relies on a critical `postinstall` script:
  `prisma generate && prisma db push --accept-data-loss`
- **Implication**: When Vercel clones the repository and runs `npm install`, it automatically generates the Prisma client and forcefully pushes the `schema.prisma` structure to the remote database. This ensures the database is *always* perfectly aligned with the deployed code, but risks dropping tables/columns if they are removed from the schema.

## 3. Build Tooling
- **TypeScript**: Strict type checking is enforced. The build will fail if TS errors exist.
- **Linting**: ESLint checks are integrated into the Next.js build process.
- **Turbopack**: Enabled locally for fast iterations.

## 4. Environment Variables
The following environment variables are strictly required for a successful deployment:
- `NEXT_PUBLIC_SUPABASE_URL`: The URL of the Supabase instance.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public anonymized key for client-side Auth.
- `DATABASE_URL`: The direct PostgreSQL connection string for Prisma.
