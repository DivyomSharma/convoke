# Progressive Web App (PWA) Architecture

**Source of Truth Version:** 1.0.0

## 1. Core Technology
Convoke utilizes **Serwist** (`@serwist/next`, `@serwist/precaching`) to power its PWA capabilities. Serwist is a modern, maintained alternative to Workbox, fully compatible with Next.js App Router and Turbopack.

## 2. Service Worker (`src/app/sw.ts`)
The custom service worker file governs runtime caching and offline behavior:
- **Immediate Takeover**: Configured with `skipWaiting: true` and `clientsClaim: true`. When a new deployment occurs, the updated service worker immediately assumes control over all open tabs without requiring a hard refresh.
- **Navigation Preload**: `navigationPreload: true` is enabled to speed up the perceived performance of navigation requests by allowing the browser to fetch the network response while the service worker boots up.
- **Runtime Caching**: Imports `defaultCache` from `@serwist/next/worker` which implements robust caching strategies (Network First for HTML, Cache First for static images/fonts, Stale While Revalidate for JS/CSS).
- **Precaching**: Injects the `__SW_MANIFEST` to precache critical Next.js build assets.

## 3. Integration (`next.config.ts`)
The Next.js configuration is wrapped by `withSerwist`:
- It maps the source `swSrc` (`src/app/sw.ts`) to the compiled `swDest` (`public/sw.js`).
- PWA generation is intentionally **disabled in development** (`disable: process.env.NODE_ENV !== "production"`) to prevent aggressive caching from interfering with hot module reloading (HMR).

## 4. Web App Manifest (`public/manifest.json`)
The manifest configures the OS-level installation properties:
- **Standalone Mode**: `display: "standalone"` forces the app to open in a dedicated window without browser UI when installed on iOS/Android or desktop.
- **Theming**: The theme color is strictly set to `#5865F2` (Discord Blurple) with a background color of `#F7F7F5` (matching the light mode `--paper` Oklch value).
- **Icons**: Standard 192x192 and 512x512 maskable PNG icons are provided for the home screen shortcut.
