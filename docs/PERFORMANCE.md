# Performance Audit

## Metrics & Rendering Strategy
Because Convoke utilizes Next.js App Router, the baseline performance is exceptional due to **React Server Components (RSCs)** rendering non-interactive UI on the server and stripping JavaScript from the client bundle.

### Bundle Size
- By defaulting to RSCs, heavy libraries (like Prisma) never reach the browser.
- Client bundles are restricted entirely to interactive islands (e.g., Lucide icons inside client buttons, Radix primitives).
- **Turbopack** handles local dev performance, drastically reducing HMR (Hot Module Replacement) times.

### Caching
- **Vercel Edge Network**: Next.js automatically caches static pages (like the landing page `/`) at the Edge.
- **Data Fetching**: Prisma queries inside RSCs should be wrapped in Next.js caching layers or utilize Prisma Accelerate where necessary, though currently direct DB calls are made.

### Image Optimization
- Recommending `next/image` (`<Image />`) for all avatars, logos, and feed attachments to automatically handle WebP conversion, resizing, and lazy loading.

### Lighthouse Expectations
- **LCP (Largest Contentful Paint)**: High risk if feed images are not optimized. Crucial to prioritize Above-The-Fold images via the `priority` prop.
- **CLS (Cumulative Layout Shift)**: Avoided by explicitly defining dimensions on all `<Image>` tags and skeleton loaders.
- **INP (Interaction to Next Paint)**: Minimized by ensuring large state updates are wrapped in `startTransition` or Next.js `useOptimistic`.
