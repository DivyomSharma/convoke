# PWA Audit

**Score: 5/10**

## 1. Offline Support & Service Worker
- **Current State:** Serwist is successfully implemented and intercepts requests. The manifest enables standalone app installation.
- **Problems:** The fallback offline experience is completely unstyled or non-existent. If a user is on the subway and opens Convoke, and the `defaultCache` has expired, they get a browser dinosaur instead of a cached version of `/workspace`.
- **Severity:** High.
- **Recommendation:** Implement a custom offline fallback page (`src/app/~offline/page.tsx`) that Serwist can serve when the network is completely down.
- **Priority:** High.
- **Estimated Effort:** 2 Days.

## 2. Installation Prompts
- **Current State:** The browser native "Add to Home Screen" mini-infobar appears on Android.
- **Problems:** There is no custom in-app install prompt or onboarding flow encouraging iOS users to "Share > Add to Home Screen".
- **Severity:** Medium.
- **Recommendation:** Create a subtle dismissible banner in the `/explore` feed prompting mobile web users to install the PWA for the best experience.
- **Priority:** Low.
- **Estimated Effort:** 1 Day.

## 3. Background Sync & Push
- **Current State:** Not implemented.
- **Problems:** If a user RSVPs to an event while on a flaky 3G connection and the request fails, the RSVP is lost forever.
- **Severity:** Medium.
- **Recommendation:** Implement the Workbox/Serwist Background Sync plugin to queue failed Prisma POST requests and replay them when the network returns.
- **Priority:** Low.
- **Estimated Effort:** 3 Days.
