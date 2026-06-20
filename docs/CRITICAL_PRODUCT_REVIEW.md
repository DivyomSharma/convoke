# Critical Product Review

**Date:** June 20, 2026
**Reviewer:** Convoke Critical Product Reviewer Subagent
**Goal:** Launch-ready quality. Break it before users do.

---

## 1. The "/workspace" Mock Data Illusion
- **Route:** `/workspace`
- **Category:** UX / Data
- **Severity:** Critical
- **Issue:** The user's timeline and momentum graph render hardcoded data. If I log in, I see "my" events, but they aren't mine. They are John Doe's hardcoded mock events.
- **Friction:** Immediate loss of trust. "Why does it say I'm attending a Hackathon in SF when I live in London?"
- **Better UX:** Show a beautifully designed Empty State: "Your timeline is quiet. Join a Space to start building momentum."
- **Suggested Fix:** Delete `src/lib/data.ts` import. Query `prisma.eventAttendance` where `userId = currentUser.id`.

## 2. The "/explore" Client-Side Freeze
- **Route:** `/explore`
- **Category:** Performance / Scalability
- **Severity:** High
- **Issue:** The feed fetches a massive JSON array and filters it using `useState`. If there are 2,000 events and 500 opportunities, the browser will lock up during render.
- **Friction:** Scrolling will jitter. Mobile devices will overheat or crash the tab.
- **Better UX:** Instant, paginated loads. URL-based filtering so users can share links to specific views (e.g., `convoke.com/explore?tab=hackathons`).
- **Suggested Fix:** Convert `/explore` to a Server Component. Use `searchParams` to pass filters directly into Prisma `where` clauses.

## 3. The Unforgiving Database Deployment
- **Route:** N/A (CI/CD Pipeline)
- **Category:** Security / DevEx
- **Severity:** Critical
- **Issue:** `postinstall` runs `prisma db push --accept-data-loss`.
- **Friction:** If an engineer renames a column from `userName` to `name`, Vercel will drop the `userName` column and erase every user's name in production during the build.
- **Better UX:** Zero-downtime, predictable schema evolution.
- **Suggested Fix:** Change `postinstall` to `prisma generate`. Add a GitHub Action or Vercel Build Step that strictly runs `prisma migrate deploy`.

## 4. The ⌘K Search Dead End
- **Route:** Global (`<Shell>`)
- **Category:** UX
- **Severity:** High
- **Issue:** Typing a real user's name into the Command Palette returns zero results because the palette only searches a hardcoded array of static links.
- **Friction:** Power users expect OS-level search. A dead search breaks the "fast, keyboard-first" promise.
- **Better UX:** Typing "Sarah" instantly shows a loading spinner for 50ms, then populates with Sarah's profile, Spaces named Sarah, and events Sarah is hosting.
- **Suggested Fix:** Connect `CommandK.tsx` to a Server Action that queries Prisma across multiple tables using full-text search or `contains` matching.

## 5. The Blank Empty States
- **Route:** `/opportunities`, `/spaces`
- **Category:** Visual Design / UX
- **Severity:** Medium
- **Issue:** If no results are found, the page is just a blank white screen.
- **Friction:** Users think the site is broken or their internet died.
- **Better UX:** A quiet, minimalist empty state conveying intent. "No opportunities found. Try adjusting your filters or check back later."
- **Suggested Fix:** Create a reusable `<EmptyState title="..." description="..." />` component matching the editorial design system.

## 6. The Missing Safety Nets (Error Boundaries)
- **Route:** Global
- **Category:** UX / Resilience
- **Severity:** High
- **Issue:** There are no `error.tsx` or `loading.tsx` files. If the database connection times out, the user gets a generic Next.js 500 error stack trace.
- **Friction:** It feels like a college project, not an Apple/Linear tier product.
- **Better UX:** If a section fails to load, the rest of the page remains interactive while the broken section shows a polite error boundary: "Unable to load timeline. [Retry]".
- **Suggested Fix:** Implement granular `<Suspense>` boundaries and `error.tsx` files for `/workspace`, `/explore`, and `/profile/[handle]`.

## 7. The Unoptimized Login Background
- **Route:** `/login`
- **Category:** Performance / LCP
- **Severity:** Medium
- **Issue:** The split-screen login uses a massive background image via an arbitrary Tailwind class (bg-url-placeholder).
- **Friction:** On 3G connections, the image will load slowly, chunk by chunk, ruining the premium feel.
- **Better UX:** Instant paint with blurred placeholder, resolving to a highly compressed WebP image.
- **Suggested Fix:** Use Next.js `<Image priority />` with a `placeholder="blur"`.

## 8. Hardcoded Secrets in Seed Route
- **Route:** `/api/seed`
- **Category:** Security
- **Severity:** Critical
- **Issue:** `?secret=convoke123` is hardcoded in the repository.
- **Friction:** Anyone crawling GitHub can find it and nuke/re-seed the production database.
- **Suggested Fix:** Update `src/app/api/seed/route.ts` to strictly check `process.env.SEED_SECRET`.

## 9. Lack of Social Sharing Identity (SEO)
- **Route:** `/profile/[handle]`, `/org/[slug]`
- **Category:** SEO / Growth
- **Severity:** High
- **Issue:** Sharing a profile link on Twitter/iMessage yields a generic "Convoke" title with no image.
- **Friction:** Growth loop is severed. Users want to show off their beautiful heatmaps and vouches.
- **Better UX:** Sharing a link generates a beautiful, monochrome OpenGraph image with the user's name, handle, and a snapshot of their momentum.
- **Suggested Fix:** Implement `generateMetadata` on dynamic routes. Use `@vercel/og` to generate the image.

## 10. The Offline Dinosaur
- **Route:** PWA / Serwist
- **Category:** PWA / UX
- **Severity:** Medium
- **Issue:** If offline and navigating to an uncached route, the browser shows the standard "No Internet" dinosaur page.
- **Friction:** Breaks the illusion of a native app.
- **Better UX:** A custom offline page in the Convoke aesthetic: "You're offline. Check your connection to sync your timeline."
- **Suggested Fix:** Create `src/app/~offline/page.tsx` and configure Serwist to serve it as the fallback.
