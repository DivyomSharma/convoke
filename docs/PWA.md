# PWA Architecture

## Overview
Convoke is a Progressive Web App (PWA), meaning it can be installed on iOS, Android, and Desktop environments directly from the browser, functioning like a native application.

## Library
We use `@serwist/next` (the modern successor to `next-pwa`).

## Configuration
**`next.config.ts`**:
The `withSerwist` plugin wraps the Next.js config, mapping the service worker entry point (`swSrc: "src/app/sw.ts"`) to the output destination (`swDest: "public/sw.js"`).

**`src/app/sw.ts`**:
The core Service Worker file.
- It imports `defaultCache` from `@serwist/next/worker`.
- It installs itself via `serwist.addEventListeners()`.
- It precaches static assets using `self.__SW_MANIFEST`.

## Manifest
The `public/manifest.json` (or dynamic `manifest.ts`) defines the standalone behavior, theme colors, and icons.
- **Display**: `standalone` (removes browser chrome).
- **Theme Color**: Matches the monochrome aesthetic (Black/White depending on preference).

## Offline Strategy
Currently, Serwist's `defaultCache` implements a standard `NetworkFirst` approach for HTML navigation requests and a `CacheFirst` approach for static assets (images, fonts, CSS). 
- **Future Work**: Create a dedicated `/offline` fallback page for when users attempt to navigate without a connection. Implement Background Sync for actions like "RSVP to Event" while riding the subway.
