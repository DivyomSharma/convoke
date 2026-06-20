# Convoke Roadmap

## Q3 2026: The "Live Data" Phase
- **Mock Data Elimination:** Completely remove `@/lib/data.ts`. Replace the Explore Feed and Workspace Timeline with real-time Prisma queries.
- **Dynamic Routing:** Build out the individual `/event/[id]` and `/opportunity/[id]` detail pages.
- **Authentication Polish:** Enable full custom domain setup for Supabase to remove the "localhost" redirect warnings during OAuth.

## Q4 2026: The "Interaction" Phase
- **Messaging (v1):** Implement the `/messages` route using Supabase Realtime subscriptions.
- **Notifications (v1):** Wire up the `/notifications` route to push alerts when a user is invited to an Opportunity or receives a Vouch.
- **PWA Polish:** Implement full offline support for reading the Workspace using Serwist caching strategies.

## Q1 2027: The "Scale" Phase
- **Migration Strategy:** Move away from `prisma db push` to a strict `prisma migrate deploy` pipeline for safer schema migrations.
- **Global Search:** Enhance the `⌘K` palette to query the PostgreSQL database directly via a fast edge-cached API instead of hardcoded client state.
