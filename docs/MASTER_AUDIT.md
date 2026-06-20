# Convoke: Master Audit

**Date:** June 20, 2026
**Role:** Founder, CEO, CTO, Principal Product Designer
**Mission:** Ship Convoke.

## 1. Current State
Convoke is a beautiful shell wrapped around a hollow core. The visual design is striking, strictly adhering to an editorial monochrome aesthetic, giving it the premium feel of an Apple or Linear product. However, the core product loop—Identity, Communities, Participation, Projects, Recognition, Opportunities, Career, Giving Back—is completely severed by a massive reliance on hardcoded mock data.

**Overall Score:** 45/100 (Unlaunchable)

## 2. Strengths (What We Keep)
- **Visual Aesthetic (95/100):** The strict Oklch monochrome system (`--paper`, `--ink`, `--g1`-`--g6`) is world-class. It is timeless, quiet, and highly legible.
- **Typography (90/100):** `Inter Tight`, `Instrument Serif`, and `JetBrains Mono` create perfect hierarchy.
- **Headless UI Foundation (85/100):** Using `@base-ui/react` ensures we have rock-solid accessibility primitives without fighting default styling.
- **Tech Stack Choices (85/100):** Next.js App Router, Prisma, PostgreSQL, and Supabase are the correct tools for a fast, modern, Server-First application.

## 3. Weaknesses (What We Must Destroy)
- **The Mock Data Delusion:** The most critical parts of the app (`/explore`, `/workspace`) render JSON arrays from `src/lib/data.ts`. Clicking an event does nothing. This is not an app; it's a wireframe.
- **State Management Anti-Patterns:** Fetching 100% of the mock dataset into the browser and using `useState` to filter it on `/explore`.
- **Dangerous Deployment:** The `postinstall` script runs `prisma db push --accept-data-loss`. One bad commit will wipe production data.
- **Legacy Clutter:** Vestigial Clerk webhooks and database columns (`clerkId`) confuse the authentication truth (Supabase).

## 4. Architecture (60/100)
- The skeleton is strong (Server Components + Prisma), but the actual implementation skips the database entirely for the most important routes.
- The Middleware correctly protects routes and refreshes Supabase sessions.
- **Action:** Enforce the RSC rule globally: Server -> Prisma -> RSC -> HTML -> Tiny Client Components.

## 5. Product (40/100)
- The Core Product Loop is broken. An ambitious student cannot currently join a Space, RSVP to an event, or apply for an opportunity because those actions do not exist in the backend.
- **Action:** Delete all mock data. Implement the full CRUD lifecycle for Events, Opportunities, and Spaces.

## 6. UX (65/100)
- The Command Palette (`⌘K`) provides an excellent power-user experience, but it searches static data.
- The lack of empty states, loading skeletons (`loading.tsx`), and error boundaries (`error.tsx`) results in a jarring experience if anything goes wrong.
- **Action:** Add Suspense boundaries, build beautiful monochrome empty states, and wire `⌘K` to a live database search.

## 7. UI (90/100)
- Visually stunning, but slightly sterile. It lacks the "motion creates delight" pillar.
- **Action:** Introduce Framer Motion for subtle layout spring animations and hover state fluidity. Fix hardcoded brand colors (e.g., Discord blue) to maintain the monochrome promise.

## 8. Performance (75/100)
- Server Components provide an excellent baseline LCP and INP.
- Font optimization is perfect.
- **Action:** Fix unoptimized massive background images on `/login`. Ensure connection pooling is configured for Prisma in production.

## 9. Security (50/100)
- Supabase Auth implementation is secure, but the database connection lacks Row Level Security (RLS) enforcement on the backend.
- The `/api/seed` endpoint uses a hardcoded secret (`convoke123`), which is a critical vulnerability.
- **Action:** Move secrets to `.env`, implement Server Action authorization checks (user ID matching), and remove legacy Clerk logic.

## 10. SEO (30/100)
- Static metadata exists, but dynamic metadata (`generateMetadata`) for profiles and organizations is missing.
- No OpenGraph images (`og:image`), making social sharing look like spam.
- No `sitemap.xml` or `robots.txt`.
- **Action:** Build a `@vercel/og` image generator and implement dynamic Next.js SEO tags.

## 11. Accessibility (85/100)
- Headless UI guarantees high baseline accessibility. Contrast is mathematically perfect.
- **Action:** Add a "Skip to content" hidden link for screen readers. Respect `prefers-reduced-motion` for all new Framer Motion animations.

## 12. PWA (50/100)
- The foundation (Serwist) is installed and manifest is configured.
- The offline experience is non-existent.
- **Action:** Build a custom `/~offline` route. Implement background sync for critical actions (like RSVPs on flaky networks).

## 13. Developer Experience (80/100)
- Strict TypeScript and Tailwind v4 provide an excellent DX.
- **Action:** Turbopack is enabled, but the reliance on `db push` creates developer anxiety regarding production deployments.

## 14. Scalability (40/100)
- The UI scales visually, but the data architecture does not. The `/explore` feed will crash the browser at scale.
- **Action:** Move filtering to the server (`searchParams`).

## 15. Maintainability (70/100)
- The codebase is clean and well-structured, but the mix of mock data and real Prisma calls creates extreme cognitive load for new engineers.
- **Action:** Delete `src/lib/data.ts`.

## 16. Technical Debt (Critical)
- **Database Push:** `prisma db push` in CI/CD.
- **Mock Data:** Deeply embedded in core features.
- **Legacy Auth:** `clerkId` and `/api/webhooks/clerk`.
- **Action:** Resolve all three before writing any new features.

## 17. Brutal Review & Final Verdict
Convoke is a Ferrari engine sitting on cinder blocks. The design language proves we understand our audience, but the engineering proves we are scared to build the hard backend systems required to support them. 

We will not launch a wireframe. We will delete the mock data, wire up Prisma, build the real Core Product Loop, and ship a category-defining operating system for the ambitious.
