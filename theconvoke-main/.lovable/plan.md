
# Convoke — Full Rebuild

A complete teardown and rebuild. Monochrome (black/white/gray only), editorial typography, real photography, zero SaaS-template patterns. Every surface designed as if shipping a real product, not a marketing site.

## Visual System (built first, used everywhere)

- **Type**: Editorial serif display (Instrument Serif) paired with a precise grotesk (Inter Tight / GT-style fallback). No Poppins. No default Inter weights. Tracking and leading tuned per scale.
- **Color**: Pure monochrome tokens — paper (#FAFAF7 off-white), ink (#0A0A0A), 6 calibrated grays. One single restrained accent reserved only for active/selected state (a near-black "ink-2"). No gradients. No glow. No bronze.
- **Surfaces**: Hairline 1px borders, generous padding, no shadow-xl, no rounded-3xl card stacks. Radius scale capped at 8px.
- **Motion**: Subtle — opacity + 4–8px translate, 200–400ms. No parallax theater. One signature hover: link underline reveal.
- **Photography**: Real editorial photos generated per surface (students coding, hackathons, coworking, pitch nights, whiteboards, meetups). Grayscale-leaning, high contrast, documentary feel. No 3D, no abstract, no stock.

## Information Architecture

13 routes, each with its own designed empty/loading/error states:

```
/                  Landing — demonstrates the network, doesn't pitch it
/explore           One unified feed (events, jobs, hackathons, projects, people, drops)
/spaces            Communities directory + individual space view
/opportunities     Roles, grants, hackathons, fellowships
/workspace         Personal OS — timeline, applications, teams, momentum
/messages          DMs + space threads
/notifications     Activity stream
/profile/$handle   Identity, proof-of-work, momentum graph, vouches
/settings          Account, identity, notifications, integrations
/org/$slug         Organization page (host of spaces/events)
/recruiter         Recruiter inbox + sourcing
/builder           Builder console — projects, collaborators, drops
/admin             Platform admin
```

Plus shared shell: top nav (logo + Explore / Spaces / Opportunities / Workspace), command-K, profile menu, message + notification glyphs.

## Build Order

1. **Foundation** — `src/styles.css` tokens, typography (link Instrument Serif + Inter Tight in `__root.tsx`), reset Tailwind variants, shared `Shell` component with nav + footer, command-K stub.
2. **Photography** — generate ~14 editorial photos (hero collage, event covers, community cards, profile avatars, workspace, etc.) under `src/assets/`.
3. **Landing (`/`)** — no hero copy block. Opens directly on a live editorial wall: today's meetups, three featured spaces, two open roles, a builder shipping a project, an upcoming hackathon. Mixed-size editorial grid (broken-grid). Footer is a single line.
4. **Explore** — single chronological feed, mixed card types (event / role / project / drop / vouch / launch), filter chips, sticky day separators.
5. **Spaces** — directory grid + individual space page (about, members, threads, upcoming, projects).
6. **Opportunities** — list view with rich rows (role, org, location, comp, deadline), detail page.
7. **Workspace** — timeline-first personal OS: today, applications-in-flight, teams, momentum sparkline, recommended.
8. **Messages, Notifications** — two-pane minimalist mail-style.
9. **Profile** — editorial identity page: name in serif display, one-line bio, momentum graph, projects, spaces, vouches, activity.
10. **Settings, Org, Recruiter, Builder, Admin** — each with real, considered layouts (not stubs).
11. **Polish pass** — empty/loading/error states, mobile flows, command-K, keyboard nav, sitemap + robots, route-level SEO heads.

## Technical Notes

- File-based routes under `src/routes/`. Layout route for the authenticated shell so nav persists.
- All colors via CSS tokens in `src/styles.css`. Zero `text-white`/`bg-black` literals in components.
- Photography imported as ES6 from `src/assets/`. Generated at standard quality, JPG.
- No backend wiring in this pass — everything renders from typed in-file fixtures so the UI is the deliverable. Lovable Cloud can be enabled later when the user wants persistence.
- Sitemap + robots added at the end per template convention.

## Scope Confirmation

This is a very large build (~25–35 files, ~14 generated images, full nav shell). I'll execute it in one pass without stopping for incremental approval. If you want me to scope down (e.g. ship Landing + Explore + Profile + Workspace first and stub the rest), say so before approving.

Approve to proceed, or tell me what to cut.
