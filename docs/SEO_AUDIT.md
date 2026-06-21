# SECURITY & SEO AUDIT REPORT: Convoke
**Auditor:** Elite SEO Critic
**Target:** Next.js App Router SEO Implementation (sitemap.ts, obots.ts, layout.tsx, Dynamic Meta Generation)
**Verdict:** Fundamentally broken for social growth and organic discovery. 

---

## 1. THE SITEMAP IS A GHOST TOWN
**File:** src/app/sitemap.ts
**Flaw:** Complete neglect of core acquisition loops.

Your sitemap.ts correctly pulls dynamic URLs for spaces, orgs, and profiles. However, you have completely omitted **Events**, **Opportunities**, **Challenges**, and **Projects**. 

**Why this is brutal:** 
Events and Opportunities are the highest-intent, most searchable entities on a platform like Convoke. By omitting them from the sitemap, you are praying that Googlebot magically stumbles upon them through perfect internal linking. You are actively strangling your organic acquisition pipeline. 

**Required Action:** 
Query prisma.event, prisma.opportunity, prisma.challenge, and prisma.project in sitemap.ts and inject them into the sitemap array immediately. 

---

## 2. OPEN GRAPH IS DEAD ON ARRIVAL
**Files:** src/app/events/[id]/page.tsx, src/app/opportunities/[id]/page.tsx, src/app/spaces/[id]/page.tsx
**Flaw:** Shallow generateMetadata overrides.

You implemented generateMetadata like an amateur. You only return 	itle and description:
`	ypescript
return {
  title: \\ | Event\,
  description: event.description || \\ on Convoke.\,
};
`
**Why this is brutal:** 
Next.js deeply merges metadata. Because your layout.tsx hardcodes the base openGraph and 	witter objects to generic brand copy ("Where ambitious people gather."), **every single dynamic page will fallback to the homepage's OpenGraph tags.**

If a user shares a highly specific, visually stunning Event or Opportunity on Twitter or LinkedIn, the preview card will **not** show the event name, it will **not** show the event description, and it absolutely will **not** show the annerUrl (which you have in the database but forgot to inject into images). It will just look like a generic link to the homepage. Your social click-through rate (CTR) will flatline.

**Required Action:** 
Explicitly return openGraph and 	witter objects inside *every* generateMetadata function. Inject the dynamic 	itle, description, and images (using annerUrl or logoUrl). 

---

## 3. ZERO CANONICAL PROTECTION
**Files:** All dynamic routes
**Flaw:** Missing lternates.canonical in metadata.

**Why this is brutal:**
When your users or marketing team inevitably share links like https://www.theconvoke.xyz/events/xyz?ref=twitter or ?utm_source=newsletter, search engines will crawl these parameterized URLs and index them as separate pages. This leads to rampant duplicate content issues, diluting whatever little PageRank these dynamic routes manage to accumulate.

**Required Action:**
Set lternates: { canonical: '/events/123' } inside generateMetadata using the metadataBase.

---

## 4. ROBOTS.TXT: BARE MINIMUM EFFORT
**File:** src/app/robots.ts
**Flaw:** Standard boilerplate.

Your obots.ts blocks /workspace, /messages, /notifications, /settings, and /api/. This is acceptable, but it's the absolute bare minimum. It prevents disaster (indexing private routes), but does nothing clever for crawl budget optimization.

---

## SUMMARY
Are dynamic routes actually indexable? **Technically yes, practically no.** 
Without being in the sitemap.xml, they rely entirely on internal links for discovery. Without custom OpenGraph configurations, they are functionally useless for social virality. 

**Fix your metadata pipeline immediately if you expect anyone to find Convoke outside of direct links.**
