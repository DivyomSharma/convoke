# Database Architecture

**Source of Truth Version:** 1.0.0

## 1. Technology
- **Engine:** PostgreSQL
- **ORM:** Prisma (`v5.22.0`)
- **Schema Location:** `prisma/schema.prisma`

## 2. Core Models & Relations

### Users & Identity
- **`User`**: Primary identity model.
  - *Key Fields*: `id`, `email`, `name`, `handle`, `role`, `clerkId`.
  - *Relations*: Linked to `Settings` (1:1), `Membership` (1:M), `EventAttendance` (1:M), `Vouch` (self-referencing 1:M).
- **`Settings`**: User preferences (theme, notification toggles).
- **`Session`**: Auth sessions tracking (managed primarily by Supabase now, but historically tracked in Prisma).

### Organizations & Communities
- **`Organization`**: Represents companies, DAOs, or clubs.
  - *Relations*: Hosts multiple `Space` and `Opportunity` entities. 
- **`Membership`**: Junction table mapping `User` to `Organization` with a `role` (e.g., ADMIN, MEMBER).
- **`Space`**: A sub-community within an Organization.
  - *Relations*: Contains `Event` and `Message` entities.

### Content & Interaction
- **`Event`**: A gathering in a `Space` (`startTime`, `endTime`, `location`).
- **`EventAttendance`**: Junction between `User` and `Event` (`status`: GOING, INTERESTED).
- **`Opportunity`**: A job, grant, or hackathon.
- **`Application`**: Junction tracking a `User` applying to an `Opportunity` (`status`: PENDING, ACCEPTED).
- **`Project` & `Research`**: Portfolio models linked to `User`.
- **`Message`**: Chat payload linked to a `Space` and `User`.
- **`Vouch`**: A peer endorsement (`giverId`, `receiverId`).

### Utility Models
- **`Notification`**: System alerts generated for users.
- **`Bookmark`**: A polymorphic table (`itemId`, `itemType`) allowing users to save events or opportunities.
- **`Activity`**: Audit log for user actions (`metadata` stored as JSON).

## 3. Sync & Seeding Strategy
- **Deployment Sync**: The `package.json` contains a `postinstall` script (`prisma db push --accept-data-loss`). This automatically synchronizes the remote database schema with Prisma during Vercel builds. 
- **Seeding**: 
  - Executed locally via `tsx prisma/seed.ts`.
  - Executed remotely via the `/api/seed?secret=convoke123` API route, which mirrors the local seed logic safely.

## 4. Known Issues / Tech Debt
- **Supabase vs Clerk Legacy**: The `User` model still contains a `clerkId` field and there is a `webhooks/clerk` endpoint, despite the recent migration to Supabase Auth. This field should be repurposed or removed in a future database migration.
