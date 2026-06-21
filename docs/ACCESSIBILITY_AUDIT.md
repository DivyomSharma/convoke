# Accessibility Audit Report: Convoke

**Status:** FAIL  
**Auditor:** Elite Accessibility Auditor

## Executive Summary
This codebase is an accessibility nightmare. While it may look modern and feature "deep dark mode with a metallic gold accent," it completely alienates users relying on assistive technologies and keyboard navigation. The implementation prioritizes visual aesthetics over fundamental web standards. You have built a black box that screen readers cannot parse and keyboard users cannot navigate.

## 1. Missing ARIA Labels & Accessible Names

You are repeatedly using icon-only buttons without providing any accessible name. A screen reader encountering these elements will only read "button", leaving visually impaired users with zero context about what the button does.

- **Close Buttons Everywhere:** Across almost every list/drawer component (`ChallengesList.tsx`, `EventsList.tsx`, `OpportunitiesList.tsx`, `OrganizationsList.tsx`, `ProjectsList.tsx`, `SpacesList.tsx`, `ResearchList.tsx`), you use `<button><X size={18} /></button>`. None of these have an `aria-label="Close"`.
- **Empty Link Wrappers:** In `src/app/explore/page.tsx`, you wrap an image with an empty alt text inside a Next.js `<Link href={...}>` (line 209). An anchor tag containing no text and an image with `alt=""` is completely invisible/unintelligible to screen readers. It will read the raw URL or simply "link".
- **Decorative Images:** The codebase is littered with `<img alt="" />` on meaningful images like banners and logos.

## 2. Abysmal Focus Management

Your application actively discriminates against keyboard-only users by stripping away or ignoring focus states.

- **Missing Focus Rings:** Across 74+ components, there are barely 60 instances of the `focus:` utility class. Interactive elements, including primary buttons and custom interactive cards, lack explicit `:focus-visible` or `:focus` states.
- **Invisible Navigation:** Relying entirely on browser defaults in a highly custom "deep dark mode" UI means focus rings are either completely invisible against the dark backgrounds or have been reset entirely. Keyboard users will tab through the app and have absolutely no idea where they are.

## 3. Keyboard Navigation & Semantic HTML Violations

You are treating `div` and `motion.div` elements as buttons, which is a textbook accessibility violation. 

- **Unreachable Interactive Divs:** In `src/components/Shell.tsx` and `src/app/research/ResearchList.tsx`, you attach `onClick` handlers to `div` and `motion.div` backdrops to close modals/drawers. These elements lack `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers. While clicking outside to close is fine, if the modal doesn't trap focus and allow the `Escape` key to close it, keyboard users are trapped.
- **Div-itis:** If it acts like a button, use a `<button>`. Slapping `onClick` on a `<div className="cursor-pointer">` without keyboard support is amateurish and unacceptable for a production application.

## 4. Form Accessibility & Broken Labels

Your forms are visually styled but semantically broken.

- **Disconnected Labels:** In `ChallengesList.tsx` (e.g., line 222), you use `<label>` elements before inputs, but you completely failed to use the `htmlFor` attribute to link the label to the input's `id`. A screen reader will not announce the label when the input receives focus.
- **Placeholder Abuse:** In `EventsList.tsx` (line 176) and `OpportunitiesList.tsx` (line 162), your search inputs rely entirely on `placeholder` attributes or empty labels (containing only an icon). Placeholders are NOT accessible names. These inputs must have an `aria-label` or a visually hidden label (`sr-only`).
- **Unlabeled Selects:** In `EventsList.tsx`, your `<select>` dropdowns for timeframe and sorting have absolutely no associated labels.

## Conclusion
The current state of the UI is hostile to users with disabilities. Stop relying purely on visual cues and start writing semantic, standard-compliant HTML. Fix your forms, add your ARIA labels, and ensure every interactive element can be reached and visibly focused via the keyboard.
