# SEO Architecture

## Metadata Setup
Convoke utilizes Next.js 15's Metadata API to statically and dynamically generate `<head>` tags.

### Static Metadata
Defined in `src/app/layout.tsx`, covering the baseline application:
- Title template (`%s | Convoke`)
- General description.
- Icons and manifest links for PWA integration.

### Dynamic Metadata (Action Required)
For public profiles (`/profile/[handle]`), organizations (`/org/[slug]`), and individual feed items, SEO must be dynamically generated.
- **Implementation**: Export a `generateMetadata` function from the respective `page.tsx` file to fetch the resource from Prisma and return tailored Titles, Descriptions, and OpenGraph tags.

## OpenGraph & Twitter Cards
- Essential for sharing Convoke profiles on social media. 
- *Recommendation*: Implement Next.js `ImageResponse` (using `@vercel/og`) to programmatically generate beautiful, text-injected social cards for profiles and organizations.

## Canonical URLs & Sitemaps
- A `sitemap.ts` file should be added to the `app/` directory to programmatically list all public spaces, organizations, and profiles for indexing.
- Canonical URLs must be enforced to prevent duplicate content penalties, especially on paginated or filtered feeds.
