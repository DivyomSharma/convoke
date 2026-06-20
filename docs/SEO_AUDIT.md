# SEO Audit

**Score: 4/10**

## 1. Dynamic Metadata
- **Current State:** The root layout has a static title, but dynamic routes (`/profile`, `/org`) do not generate unique `<title>` tags.
- **Problems:** If someone shares an organization's page on Twitter, the preview will just say "Convoke" rather than "Lumen Labs | Convoke". This destroys viral loop sharing potential.
- **Severity:** High.
- **Recommendation:** Implement `generateMetadata` on all dynamic routes.
- **Priority:** Critical.
- **Estimated Effort:** 1 Day.

## 2. OpenGraph / Twitter Cards
- **Current State:** Non-existent.
- **Problems:** Without `og:image`, shared links look like spam on social networks.
- **Severity:** High.
- **Recommendation:** Use `@vercel/og` to dynamically generate branded OpenGraph images for events, organizations, and user profiles.
- **Priority:** High.
- **Estimated Effort:** 3 Days.

## 3. Indexability (Sitemap/Robots)
- **Current State:** Missing.
- **Problems:** Search engines will struggle to discover deep public profiles.
- **Severity:** Medium.
- **Recommendation:** Create `src/app/sitemap.ts` to dynamically generate an XML sitemap of all public profiles and spaces.
- **Priority:** Medium.
- **Estimated Effort:** 1 Day.
