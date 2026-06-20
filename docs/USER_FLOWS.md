# User Flows

**Source of Truth Version:** 1.0.0

## 1. Onboarding & Authentication
1. **Landing**: Unauthenticated user visits `/`. They view the editorial masthead, public events, and featured spaces.
2. **Action**: User clicks any "Join" or protected navigation link.
3. **Redirection**: Next.js Middleware intercepts the request, notes the original URL, and redirects to `/login`.
4. **Authentication**: User selects Google, Apple, Discord, LinkedIn, or enters an email for a Magic Link.
5. **Callback**: The provider redirects to `/auth/callback`. Supabase exchanges the code for a secure session.
6. **Completion**: The user is redirected to `/workspace` (or their originally intended URL).

## 2. Discovery & Navigation
1. **The Workspace (`/workspace`)**: Upon login, the user lands here. They see their daily timeline and recommended actions.
2. **Command Palette (⌘K)**: A power-user bypasses standard navigation by pressing `⌘K`. They type "Early Builders" and hit Enter, jumping instantly to the `/spaces` directory filtered for that group.
3. **The Feed (`/explore`)**: A user browsing casually visits the Explore feed. They click the "Roles" filter chip, instantly re-rendering the feed to only show Opportunities via client-side React state.

## 3. Engagement Flow
1. **Finding an Event**: A user finds a Hackathon event in the `/explore` feed.
2. **Viewing Details**: They click the event, opening a detailed view (potentially rendering a modal or navigating to a specific event page).
3. **Action**: They click "RSVP". The system creates an `EventAttendance` record in PostgreSQL.
4. **Feedback**: A toast notification confirms the RSVP, and the event is added to their `/workspace` timeline.
