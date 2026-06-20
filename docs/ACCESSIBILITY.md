# Accessibility (a11y) Audit

## Strategy
Convoke relies heavily on **Radix UI** primitives (via shadcn/ui) to ensure a robust accessibility foundation.

### Keyboard Navigation & ARIA
- All Radix primitives (Dialogs, Dropdowns, Accordions) come with full WAI-ARIA compliance, focus management, and keyboard navigation built-in.
- Focus rings are explicitly styled via Tailwind's `focus-visible:ring` to maintain visual aesthetics without sacrificing navigability for keyboard users.

### Contrast
- The strict monochrome palette (Black/White with subtle grays) naturally lends itself to high contrast ratios. 
- *Risk*: `text-muted-foreground` (used for secondary tags and dates) must be actively monitored to ensure it meets WCAG 2.1 AA contrast requirements (4.5:1) against both Light and Dark backgrounds.

### Semantic HTML
- The UI strictly adheres to semantic structure. `main` for primary content, `article` for feed items, `nav` for navigation, and hierarchical heading tags (`h1` through `h6`) without skipping levels.

### Reduced Motion
- Framer Motion animations and Tailwind transitions should respect `prefers-reduced-motion`. This is achievable using Tailwind's `motion-safe:` and `motion-reduce:` modifiers for intense animations.
