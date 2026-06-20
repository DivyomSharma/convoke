# Design System

**Source of Truth Version:** 1.0.0

## 1. The Monochrome Editorial Philosophy
Convoke abandons traditional SaaS branding (vibrant primary colors, heavy gradients, drop shadows) in favor of a strictly structured **Monochrome Editorial System**. The UI is designed to mimic high-end physical print media, relying entirely on typography, hairlines, and highly calibrated grayscale steps to establish hierarchy.

## 2. Color Palette (Oklch)
All colors are defined using the modern Oklch color space in `src/app/globals.css`, ensuring perceptually uniform contrast across light and dark modes.

- **`--paper`**: The foundation background. (Light: `oklch(0.985 0.002 95)` / Dark: `oklch(0.13 0 0)`).
- **`--ink`**: The primary foreground/text color. (Light: `oklch(0.16 0 0)` / Dark: `oklch(0.97 0 0)`).
- **`--ink-2`**: Secondary focus, slightly softer than pure ink.
- **`--g1` through `--g6`**: A mathematically calibrated 6-step gray scale.
  - `--g1`: Extremely subtle hover surfaces.
  - `--g3`: Structural borders and hairlines.
  - `--g5`: Secondary metadata text.
  - `--g6`: Tertiary deep text.

## 3. Typography
Hierarchy is established primarily through strict typographic choices defined via `next/font/google`:
- **Sans (`--font-sans`)**: *Inter Tight*. Used globally for all standard interface text, buttons, and body copy. Highly legible at small sizes.
- **Serif (`--font-serif`)**: *Instrument Serif*. Used exclusively for major expressive headers, blockquotes, and the brand logo ("Convoke.").
- **Mono (`--font-mono`)**: *JetBrains Mono*. Used for metadata labels, keyboard shortcut hints (e.g., `⌘K`), and technical data (e.g., dates).

## 4. Spacing, Borders, and Radii
- **Radii Constraints**: The system aggressively limits border-radius. The base `--radius` is `4px`. It scales from `sm` (2px) to a strict maximum of `4xl` (8px). There are no "pill" shaped buttons outside of specific auth components. Elements must feel sharp and structural.
- **Hairlines**: Traditional borders are replaced by "hairlines". Custom Tailwind v4 utility directives (`@utility hairline`, `@utility hairline-b`, etc.) apply an exact `1px solid var(--g3)` stroke. Layouts are divided by these hairlines rather than varied background surfaces.

## 5. Dark Mode Implementation
Handled by `next-themes` (`<ThemeProvider>`). The system relies on CSS variable overriding inside the `.dark` class block in `globals.css`. Because the design is entirely grayscale, dark mode is achieved through a near-perfect mathematical inversion of the Oklch lightness values, ensuring absolute consistency in contrast.
