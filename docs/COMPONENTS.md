# Components Documentation

## UI Library Index
Convoke utilizes `shadcn/ui` for its foundational component library. These are unstyled, accessible primitives provided by Radix UI, heavily customized via Tailwind v4 to match the Convoke design language.

### Installed Primitives (`src/components/ui/`)
- `avatar.tsx`: Used in Feed items and Profile headers.
- `button.tsx`: Core interaction primitive. Heavily uses standard variants (`default`, `outline`, `ghost`).
- *Note: As the Next.js scaffold is fresh, only `avatar` has been installed so far to support the `/explore` view. Additional primitives (Dialog, Dropdown, Form, Input, Popover, Sheet) must be generated via the shadcn CLI.*

## Component Guidelines
1. **Composition**: Favor composition over configuration. Use `children` and discrete sub-components (e.g., `<Card><CardHeader>...</CardHeader></Card>`) instead of massive configuration objects.
2. **Server vs Client**: Components must default to React Server Components (no `"use client"` directive) unless they require state (`useState`), effect (`useEffect`), or browser APIs.
3. **Styling**: Use `cn()` from `src/lib/utils.ts` to merge Tailwind classes cleanly without conflicts.

## Dead / Unused Components
Currently, the codebase is a fresh scaffold. There are no dead components. As development progresses, components that are no longer referenced in `src/app/` should be actively pruned to maintain a pristine library.
