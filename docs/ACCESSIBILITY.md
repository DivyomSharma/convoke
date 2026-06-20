# Accessibility Architecture

**Source of Truth Version:** 1.0.0

## 1. Headless UI Foundation
The vast majority of Convoke's interactive primitives (Buttons, Avatars, Modals) are built on top of **`@base-ui/react`**.
- This library handles all complex W3C ARIA specifications out of the box.
- It automatically manages semantic HTML roles, focus trapping within dialogs, and keyboard event listeners without requiring manual implementation by the product team.

## 2. Keyboard Navigation
- **The Command Palette (`⌘K`)**: The primary navigation paradigm for power users. It is fully accessible via keyboard. Users hit `⌘K` or `Ctrl+K`, type their destination, use the arrow keys to navigate the filtered list, and press `Enter` to route. The `Escape` key natively closes the overlay.
- **Focus Rings**: Focus states are preserved. The design system explicitly defines `focus-visible:ring` utilities on inputs and buttons to ensure keyboard users have clear visual indicators of their current DOM position.

## 3. Visual Accessibility
- **Contrast Ratios**: The strict adherence to the Oklch-based Monochrome Editorial System ensures mathematically perfect contrast. The `--ink` on `--paper` contrast passes WCAG AAA standards. 
- **Grayscale Dark Mode**: Because dark mode is a literal lightness inversion of the Oklch spectrum, there is zero risk of introducing inaccessible color combinations (such as dark blue text on a black background) commonly found in SaaS applications.
- **Legibility**: The base CSS applies `text-rendering: optimizeLegibility` and utilizes `Inter Tight`, a font specifically designed for maximum readability at dense UI sizes.

## 4. Semantic HTML
- The application makes proper use of semantic HTML5 tags (`<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<blockquote>`) to ensure screen readers can accurately interpret the layout hierarchy without relying purely on CSS visual cues.
