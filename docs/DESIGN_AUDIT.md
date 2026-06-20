# Design Audit

**Score: 8/10**

## 1. Typography & Hierarchy
- **Current State:** Exceptional use of `Inter Tight` and `Instrument Serif`. 
- **Problems:** Occasionally, the `text-[13px]` and `text-[14px]` utility classes are applied haphazardly rather than standardizing on a strict semantic class (e.g., `.text-body-sm`).
- **Severity:** Low.
- **Recommendation:** Refactor ad-hoc text sizes into strict Tailwind `@utility` abstractions in `globals.css`.
- **Priority:** Low.
- **Estimated Effort:** 1 Day.

## 2. Monochrome Cohesion
- **Current State:** The strict adherence to Oklch grayscale (`--paper`, `--ink`, `--g1` to `--g6`) is brilliant and creates a highly premium, Apple-level editorial feel.
- **Problems:** Discord's brand color (`#5865F2`) is hardcoded on the login page button. While acceptable for a brand logo, using it as a solid background breaks the immersion of the monochrome system.
- **Severity:** Medium.
- **Recommendation:** Change the Discord login button to use the standard `variant="outline"` style with only the Discord *icon* in color.
- **Priority:** Medium.
- **Estimated Effort:** 1 Hour.

## 3. Structural Elements (Hairlines)
- **Current State:** Using `hairline-b` and `hairline-t` (1px solid `--g3`) instead of varying background surfaces is a fantastic brutalist/editorial choice.
- **Problems:** Some cards in the `/explore` feed lack hairlines on all sides, causing them to bleed into the `--paper` background unexpectedly on extra-wide monitors.
- **Severity:** Low.
- **Recommendation:** Ensure all interactive cards have a full `.hairline` wrapper.
- **Priority:** Medium.
- **Estimated Effort:** 2 Hours.

## 4. Motion & Interaction
- **Current State:** Very static. No loading skeletons, no micro-interactions on hover beyond a simple color shift.
- **Problems:** The application lacks the "Discord-level warmth" requested in the design directive. It feels a bit *too* sterile.
- **Severity:** Medium.
- **Recommendation:** Integrate Framer Motion to add subtle spring animations to the `⌘K` palette entrance and hover scaling to the Avatar elements.
- **Priority:** High.
- **Estimated Effort:** 2 Days.
