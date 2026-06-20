# SEO Architecture

**Source of Truth Version:** 1.0.0

## 1. Static Metadata
Convoke establishes a strong SEO baseline via Next.js Metadata API in the root layout (`src/app/layout.tsx`).
- **Title**: "Convoke — Where ambitious people gather"
- **Description**: "Events, communities, opportunities and projects in one editorial feed."
- This guarantees that every page, even if lacking specific overrides, will render highly descriptive `<title>` and `<meta name="description">` tags for web crawlers.

## 2. Server-Side Rendering (SSR) Benefits
Because Convoke utilizes Next.js App Router Server Components for its dynamic pages (`/profile/[handle]`, `/org/[slug]`, `/`), the HTML is fully rendered on the server before reaching the client.
- **Indexability**: Googlebot and other crawlers do not need to execute JavaScript to read the content of a user's portfolio or an organization's job postings. The text is immediately present in the raw HTTP response.

## 3. Semantic Structure
- The heavy reliance on proper HTML tags (specifically strict `<h1>` and `<h2>` hierarchies in profiles and articles) ensures search engines can build accurate topic maps of the content.

## 4. Known Missing Features (Tech Debt)
While the baseline is strong, several advanced SEO features are currently missing:
- **Dynamic OpenGraph Images**: Profiles and Organizations do not currently generate dynamic `og:image` tags (e.g., via `@vercel/og`), meaning social sharing links default to generic text previews.
- **Dynamic Metadata**: The `/profile/[handle]` and `/org/[slug]` routes do not currently export a `generateMetadata` function. They rely on the fallback root metadata, meaning Google search results will not show the specific user's name as the page title.
- **Canonical URLs**: Explicit `<link rel="canonical">` tags are not being dynamically injected.
- **Sitemap/Robots**: There is no `sitemap.xml` or `robots.txt` generation implemented in the `src/app` directory.
