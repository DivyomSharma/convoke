# Design System

## Core Aesthetic
Convoke's design language is strictly defined as **"Timely & Timeless"**.
It relies entirely on high-contrast monochrome palettes, rigorous typography, and extreme minimalism. It avoids loud brand colors, relying instead on structure and whitespace to communicate premium quality.

## Typography
- **Sans-serif (UI)**: `Inter`. Used for navigation, buttons, small tags, and utility text.
- **Serif (Editorial)**: `Newsreader`. Used exclusively for large headers, article titles, and prominent numbers to give an editorial, newspaper-like feel.

*Hierarchy Example*:
- `text-8xl font-serif tracking-tight`: Hero Headers
- `text-xs uppercase tracking-widest font-mono`: Eyebrow tags and meta information.

## Color Palette
Defined entirely in Tailwind v4 CSS variables (`src/app/globals.css`).
- **Background**: `hsl(0 0% 100%)` (Light) / `hsl(240 10% 3.9%)` (Dark)
- **Foreground**: `hsl(240 10% 3.9%)` (Light) / `hsl(0 0% 98%)` (Dark)
- **Muted**: Very subtle grays used for secondary text and disabled states.
- **Borders**: Sharp, 1px solid lines using `border-border/50` for structure without heaviness.

## Structural Elements
- **Spacing**: Generous. Standard paddings are `py-12`, `py-24`, `gap-6`, and `space-y-12`.
- **Radius**: `rounded-sm`. Avoid heavily rounded corners. The design favors sharp, architectural geometry over soft, bubbly interfaces.
- **Shadows**: Almost non-existent. Elevation is communicated through borders and background dimming rather than drop shadows.
- **Glass**: Used sparingly for sticky navbars via `bg-background/80 backdrop-blur-md`.

## Animation Timing
Animations rely on Framer Motion and Tailwind `transition-all`.
Standard timing: `duration-200 ease-out`. Focus on micro-interactions (hover states, slight opacity shifts) rather than dramatic sweeping motions.
