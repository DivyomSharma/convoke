# Performance Audit

**Score: 8/10**

## 1. First Input Delay / INP
- **Current State:** Excellent. By relying on Server Components and headless `@base-ui` primitives, the main thread is rarely blocked.
- **Problems:** None currently, though the hardcoded `⌘K` palette might degrade if loaded with thousands of un-paginated DOM nodes.
- **Recommendation:** Virtualize the `CommandK` list using `@tanstack/react-virtual` if the searchable item list grows beyond 100 items.

## 2. Cumulative Layout Shift (CLS)
- **Current State:** Perfect 0.0. Fonts are pre-loaded via `next/font`, and layout structural elements have explicit dimensions.
- **Problems:** Avatar images lacking explicit `width` and `height` properties in the custom wrapper could theoretically cause micro-shifts during slow network conditions.
- **Recommendation:** Ensure all `<img />` or Next.js `<Image />` tags explicitly declare dimensions.

## 3. Largest Contentful Paint (LCP)
- **Current State:** Very fast, owing to RSC HTML streaming.
- **Problems:** The massive background image on the `/login` page is loaded via an inline Tailwind arbitrary class `bg-url-placeholder`. This bypasses Next.js Image optimization entirely, serving a potentially massive unoptimized JPEG.
- **Severity:** High.
- **Recommendation:** Replace the CSS background with a `<Image priority src="..." />` from `next/image` to leverage WebP compression and aggressive caching.
- **Priority:** High.
- **Estimated Effort:** 2 Hours.
