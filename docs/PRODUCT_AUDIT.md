# Product Audit

**Score: 6/10**

## 1. Landing Page (`/`)
- **Current State:** A highly editorial, static representation of the platform.
- **Problems:** It effectively acts as a brochure but lacks a dynamic hook. Unauthenticated users cannot preview the actual "Explore Feed" without logging in.
- **Severity:** High.
- **Recommendation:** Expose a read-only version of the `/explore` feed to unauthenticated users to drive organic signups.
- **Priority:** High.
- **Estimated Effort:** 2 Days (Adjusting middleware and creating a public variant of the feed).

## 2. Workspace Dashboard (`/workspace`)
- **Current State:** Displays identity, momentum sparklines, and a daily timeline.
- **Problems:** It relies entirely on hardcoded mock data (`src/lib/data.ts`). The "Momentum" metric lacks a mathematical definition or backend tracking.
- **Severity:** Critical.
- **Recommendation:** Implement real Prisma queries to fetch the user's actual accepted applications and RSVP'd events. Define the formula for "Momentum" (e.g., login streak + vouches).
- **Priority:** Critical.
- **Estimated Effort:** 4 Days.

## 3. Explore Feed (`/explore`)
- **Current State:** A robust client-side filtering system for events and roles.
- **Problems:** The filtering is purely client-side React state. If the database grows to thousands of events, this will crash the browser. Empty states are non-existent; if a filter returns 0 results, it just shows a blank white space.
- **Severity:** Medium.
- **Recommendation:** Move filtering to the server using URL Search Params (`?category=events`). Design a beautiful "No results found" empty state matching the monochrome aesthetic.
- **Priority:** High.
- **Estimated Effort:** 3 Days.

## 4. Profile (`/profile/[handle]`)
- **Current State:** Displays the user's heatmap, bio, and vouches.
- **Problems:** The GitHub-style contribution heatmap has no mechanism to actually record daily data. 
- **Severity:** Low.
- **Recommendation:** Build a background cron job or hook into the `Activity` table to accurately increment the heatmap blocks.
- **Priority:** Low.
- **Estimated Effort:** 5 Days.

## 5. Navigation & Search (⌘K)
- **Current State:** The Command Palette is fast and mimics native OS behavior.
- **Problems:** It uses a hardcoded array of `items`. You cannot currently search for a live user or space that isn't in that hardcoded array.
- **Severity:** High.
- **Recommendation:** Wire the `<input>` to a debounced Server Action that queries the `User` and `Space` tables via Prisma.
- **Priority:** High.
- **Estimated Effort:** 2 Days.
