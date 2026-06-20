# Component Library

**Source of Truth Version:** 1.0.0

## 1. Core Architecture
Convoke's component library merges standard headless accessibility patterns with completely custom visual overrides to match the monochrome editorial design system.

### Dependencies
- **`@base-ui/react`**: The primary headless component engine (replacing older Radix UI patterns). It provides robust accessibility, focus trapping, and ARIA attributes without injecting default styles.
- **`class-variance-authority` (CVA)**: Used for declarative variant management.
- **`clsx` + `tailwind-merge`**: Exposed as the `cn()` utility function in `src/lib/utils.ts`, used universally to merge Tailwind classes and resolve conflicts.

## 2. Standard Primitives (`src/components/ui/`)

### Button (`button.tsx`)
- Wraps `@base-ui/react`'s `ButtonPrimitive`.
- **Variants**: `default` (ink background), `outline` (hairline border), `ghost` (transparent background, g1 hover), `secondary`, `destructive`, `link`.
- **Sizes**: Extremely strict size scales (`xs`, `sm`, `default`, `lg`, `icon`).
- Handles semantic accessibility states natively (e.g., `data-[active]`, `data-[disabled]`).

### Avatar (`avatar.tsx`)
- Wraps `@base-ui/react`'s `AvatarPrimitive`.
- Highly complex compound component exporting `AvatarImage`, `AvatarFallback`, `AvatarBadge` (for online status/roles), `AvatarGroup`, and `AvatarGroupCount` (for stacked member lists).

## 3. Structural Components (`src/components/`)

### Shell (`Shell.tsx`)
The master application wrapper. Every standard route is wrapped in `<Shell>`.
- **Sticky Header**: Includes navigation, a responsive user menu, and specific custom SVG iconography (`NotifGlyph`, `MailGlyph`).
- **Command Palette (`CommandK`)**: An integrated, inline command search built into the shell. Invoked via `⌘K` or `Ctrl+K`. It renders an overlay mimicking native OS search (e.g., Raycast/Spotlight) allowing users to jump directly to profiles, spaces, or routes.
- **Footer**: A minimal, hairline-divided global footer.

### Local Avatar (`Avatar.tsx`)
A simplified, highly specific avatar wrapper used primarily in the `Shell` header for the current user's profile picture, distinct from the broader UI primitive.
