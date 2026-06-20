# Convoke Launch Checklist

Before removing the waitlist and routing organic traffic to Convoke, the following absolute requirements must be satisfied to ensure scale, security, and the intended UX standard.

## 1. Security & Auth
- [ ] Ensure `WEBHOOK_SECRET` is set in Vercel Production and matches the Clerk webhook dashboard.
- [ ] Implement Application-Level Authorization in Server Actions (e.g., Verify `session.userId` before any DB `DELETE` or `UPDATE`).
- [ ] Configure Supabase Postgres connection pool correctly (use `directUrl` for migrations, pool URL for Prisma Client).

## 2. Architecture & Data
- [ ] Replace SSR dummy placeholders in `/explore` with active Prisma queries fetching from `Activity`, `Event`, `Opportunity`, and `Vouch`.
- [ ] Implement infinite scrolling or pagination on the main feed to prevent crushing the DB.
- [ ] Add Prisma indexes to heavily filtered fields (e.g., `createdAt` on feed tables, `organizationId` on Memberships).

## 3. UI & UX
- [ ] Flesh out empty states for the Workspace, Bookmarks, and Notifications.
- [ ] Validate Dark/Light mode color contrast manually across all shadcn primitives.
- [ ] Confirm typography (Inter/Newsreader) loads without FOUT (Flash of Unstyled Text) by leveraging `next/font`.

## 4. SEO & Social
- [ ] Implement `generateMetadata` for dynamic `/profile/[handle]` routes.
- [ ] Implement `generateMetadata` for dynamic `/org/[slug]` routes.
- [ ] Set up `@vercel/og` to generate dynamic Twitter/OpenGraph share cards.
- [ ] Deploy a dynamic `sitemap.ts` and `robots.txt`.

## 5. Performance & PWA
- [ ] Audit feed images to ensure they use Next.js `<Image>` for WebP compression.
- [ ] Test the PWA install flow on iOS Safari and Android Chrome.
- [ ] Ensure a custom `/offline` fallback page exists for the Serwist service worker to cache.

## 6. Legal & Trust
- [ ] Draft and link Privacy Policy.
- [ ] Draft and link Terms of Service.
- [ ] Setup a support/contact email route.

## 7. Observability
- [ ] Integrate a monitoring tool (Sentry/Axiom) for tracking uncaught exceptions in production RSCs and Server Actions.
- [ ] Ensure Vercel Analytics (or PostHog) is capturing active user journeys.
