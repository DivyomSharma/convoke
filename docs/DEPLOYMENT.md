# Deployment Architecture

**Source of Truth Version:** 1.0.0

This document outlines the deployment strategy for Convoke.

## Platform: Vercel
Convoke is natively designed for deployment on Vercel, fully utilizing the Next.js App Router, Edge Middleware, and Server Components.

## Deployment Hooks
The `package.json` relies on the following scripts:
- `"build": "next build"`
- `"postinstall": "prisma generate && prisma db push --accept-data-loss"`

**Critical Warning:** The `postinstall` hook runs automatically on Vercel immediately after `npm install` and before `next build`. Using `prisma db push` guarantees the remote database schema exactly mirrors `schema.prisma`. However, the `--accept-data-loss` flag means if you delete a column or rename a table in development and push to `main`, Vercel will aggressively wipe that table/column in production without prompting.

## Environment Variables
Ensure these are configured in the Vercel Dashboard:
```
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```
