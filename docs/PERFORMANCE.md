# Performance Architecture

**Source of Truth Version:** 1.0.0

## 1. Server-Side Rendering (SSR) Default
The majority of Convoke is built using React Server Components (RSC).
- **Zero-JS by Default**: Pages like `/profile/[handle]`, `/org/[slug]`, and `/workspace` fetch data directly from Prisma on the server. This means the client receives pure HTML, drastically reducing the JavaScript bundle size and eliminating client-side loading spinners or network waterfalls.
- **Direct Database Access**: By bypassing intermediate REST API routes and connecting directly to PostgreSQL from the server component, total network latency is reduced.

## 2. Font Optimization
Fonts are critical to the editorial design system but can cause severe Cumulative Layout Shift (CLS) if loaded poorly.
- Convoke utilizes `next/font/google` in `src/app/layout.tsx`.
- The fonts (`Inter_Tight`, `Instrument_Serif`, `JetBrains_Mono`) are downloaded at build time and self-hosted. 
- They are injected into the `<head>` with `preload` tags and CSS variables, guaranteeing zero layout shift and no external network requests to Google servers during page load.

## 3. CSS & Styling Efficiency
- **Tailwind v4**: The modern Tailwind compiler generates only the exact CSS utilities used in the project, resulting in a microscopic CSS payload.
- **Class Merging**: The application heavily relies on `clsx` and `tailwind-merge` (`cn` utility). This ensures that dynamic styles do not bloat the DOM with conflicting classes, allowing the browser to parse styles slightly faster.

## 4. Turbopack & Tooling
- **Turbopack** is enabled in `next.config.ts`, utilizing Rust-based compilation for significantly faster Hot Module Replacement (HMR) during local development, reducing developer friction.

## 5. Database Connection Management
Serverless environments (like Vercel) can easily exhaust PostgreSQL database connections by spawning hundreds of short-lived Prisma clients.
- Convoke mitigates this using a **Singleton Pattern** (`src/lib/prisma.ts`). The Prisma client is cached on the `globalThis` object during development, ensuring only one connection pool is maintained across hot-reloads.
