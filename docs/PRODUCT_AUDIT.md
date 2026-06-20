# Convoke Product Audit

## Current Product Vision
Convoke is a timeless platform where students, founders, creators, developers, researchers, recruiters, alumni, and communities gather to build their future together. It is not a job board, social network, or event platform. It is a highly curated, signal-rich digital campus emphasizing Apple-level craftsmanship, Discord-level belonging, and Linear-level polish.

## Current Information Architecture (IA)
The app is structured around 5 core navigation pillars:
1. **Explore**: The global feed of high-signal activities (launches, events, roles, vouches).
2. **Opportunities**: A curated board of roles, fellowships, grants, and hackathons.
3. **Spaces**: Community-centric environments for organizations.
4. **Workspace**: The authenticated user's personal dashboard for managing their projects, applications, and settings.
5. **Profile**: Public-facing portfolios showcasing user achievements, vouches, and history.

## Current UX
The UX relies on a minimalist, monochrome palette with highly deliberate typography (Inter for UI, Newsreader for editorial headers). It features large touch targets, glassmorphic navbars, and subtle Framer Motion animations to feel "timely and timeless."

## Current User Journey
1. **Discovery**: Lands on `/` (minimal landing page with real-time stats).
2. **Browsing**: Redirects to `/explore` (unauthenticated read-only view).
3. **Onboarding**: Uses Clerk `/login` modal to seamlessly authenticate via OAuth or OTP.
4. **Engagement**: User joins a `Space`, RSVPs to an `Event`, or applies to an `Opportunity`.
5. **Growth**: User earns a `Vouch` or bookmarks an item for later.

## Ratings & Risk Assessment (Out of 10)

| Category | Score | Notes |
|----------|-------|-------|
| Vision Alignment | 9/10 | Foundation strictly adheres to the editorial/monochrome constraint. |
| Feature Completeness | 2/10 | Scaffolded routes exist, but internal data fetching and mutations are pending. |
| Technical Debt | 1/10 | Clean Next.js 15 App Router scaffold. No legacy code. |
| UX Debt | 3/10 | Placeholder data needs replacing. Empty states are missing. |
| Design Debt | 2/10 | Tailwind v4 setup is clean, but some component variants lack dark-mode specificity. |
| Business Risks | 6/10 | High dependency on curating high-signal content to avoid becoming a generic social feed. |
| Scaling Risks | 4/10 | Supabase Postgres + Prisma scales well, but heavy JOINs on the feed will need caching. |
| Security Risks | 2/10 | Clerk + Supabase RLS is solid. Webhook sync must remain perfectly atomic. |
| Accessibility Risks | 5/10 | Radix UI primitives provide a baseline, but contrast ratios and focus rings need manual tuning. |
| Performance Risks | 3/10 | RSCs keep bundle size low. Primary risk is unoptimized user-uploaded images. |
| SEO Risks | 8/10 | Missing dynamic OpenGraph generation and canonical tags on dynamic routes. |
| PWA Risks | 2/10 | Serwist is integrated and functional. Offline fallback pages are needed. |
| Mobile Risks | 4/10 | Responsive Tailwind handles most, but complex data tables (Opportunities) need mobile-specific views. |
| Developer Experience | 1/10 | Excellent. Turbopack, Prisma, Tailwind v4, and strict linting. |

## Recommendations
1. **Implement Skeleton Loaders**: Replace SSR blank screens with React Suspense boundaries on `/explore`.
2. **Flesh out Empty States**: Design editorial "Nothing here yet" illustrations for Workspace and Bookmarks.
3. **Dynamic SEO**: Implement Next.js `generateMetadata` for `/profile/[handle]` and `/org/[slug]`.
