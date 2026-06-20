# Accessibility Audit

**Score: 9/10**

## 1. Keyboard Navigation
- **Current State:** Excellent. The `⌘K` palette ensures power users rarely need a mouse. `@base-ui/react` primitives handle focus trapping flawlessly.
- **Problems:** The "Skip to content" hidden link is missing from the `Shell` layout. This is a baseline requirement for screen reader users to bypass the heavy header navigation on every page load.
- **Severity:** Medium.
- **Recommendation:** Add an absolutely positioned, visually hidden `<a href="#main" className="focus:not-sr-only">Skip to content</a>` at the very top of `RootLayout`.
- **Priority:** High.
- **Estimated Effort:** 1 Hour.

## 2. Contrast & Motion
- **Current State:** Perfect contrast scores due to the strict Oklch grayscale.
- **Problems:** The application currently lacks `prefers-reduced-motion` CSS media query overrides for the upcoming Framer Motion animations.
- **Severity:** Low.
- **Recommendation:** Ensure all future animations respect the OS-level reduced motion preference.
- **Priority:** Low.
- **Estimated Effort:** 1 Day.
