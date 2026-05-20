-- Enhanced Schema for Convoke Relational Ecosystem
-- Building upon the existing schema with relational, dynamic systems

-- ===========================================
-- EXTENDING USER ROLES
-- ===========================================

-- Update UserRole enum to include more specific roles
ALTER TYPE "UserRole" RENAME TO "UserRole_Old"; 
CREATE TYPE "UserRole" AS ENUM (
  'ATTENDEE', 
  'ORGANIZER', 
  'VOLUNTEER', 
  'SPONSOR', 
  'NGO', 
  'CREATOR', 
  'STARTUP_COMMUNITY', 
  'ADMIN',
  'COMMUNITY_ADMIN',
  'STARTUP_FOUNDER',
  'MENTOR'
);

-- Migrate existing data
ALTER TABLE "User" 
  ALTER COLUMN "role" TYPE "UserRole" 
  USING "UserRole"::text::"UserRole";

DROP TYPE "UserRole_Old";

-- ===========================================
-- EXPERIENCE & EDUCATION SYSTEM
-- ===========================================

CREATE TABLE "Experience" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "location" TEXT,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "current" BOOLEAN NOT NULL DEFAULT false,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Education" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "institution" TEXT NOT NULL,
  "degree" TEXT NOT NULL,
  "fieldOfStudy" TEXT,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "grade" TEXT,
  "activities" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "url" TEXT,
  "technologies" TEXT[],
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- ===========================================
-- OPPORTUNITY SYSTEM (Unstop-style)
-- ===========================================

CREATE TYPE "OpportunityType" AS ENUM (
  'INTERNSHIP',
  'VOLUNTEER',
  'AMBASSADOR',
  'STARTUP_JOB',
  'CREATOR_COLLAB',
  'FREELANCE_GIG',
  'RESEARCH_POSITION',
  'MENTORSHIP',
  'CONTEST',
  'SCHOLARSHIP'
);

CREATE TYPE "ApplicationStatus" AS ENUM (
  'APPLIED',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFER',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN'
);

CREATE TABLE "Opportunity" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "type" "OpportunityType" NOT NULL,
  "description" TEXT NOT NULL,
  "requirements" TEXT[],
  "location" TEXT,
  "remote" BOOLEAN NOT NULL DEFAULT false,
  "stipend" INTEGER, -- in INR, null if unpaid
  "duration" TEXT, -- e.g., "3 months", "Summer 2026"
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "applicationDeadline" TIMESTAMP(3),
  "positionsAvailable" INTEGER NOT NULL DEFAULT 1,
  "applicationsCount" INTEGER NOT NULL DEFAULT 0,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Application" (
  "id" TEXT NOT NULL,
  "opportunityId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
  "coverLetter" TEXT,
  "resumeUrl" TEXT,
  "portfolioUrl" TEXT,
  "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "notes" TEXT, -- for organizer notes

  CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- ===========================================
-- ENHANCED EVENT SYSTEM
-- ===========================================

CREATE TYPE "TicketTypeCategory" AS ENUM (
  'GENERAL',
  'EARLY_BIRD',
  'VIP',
  'STUDENT',
  'GROUP'
);

CREATE TABLE "TicketType" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" "TicketTypeCategory",
  "priceInr" INTEGER NOT NULL DEFAULT 0,
  "capacity" INTEGER,
  "sold" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventSchedule" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "location" TEXT,
  "isBreak" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EventSchedule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventSpeaker" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "userId" TEXT, -- can be null for external speakers
  "name" TEXT NOT NULL,
  "title" TEXT,
  "organization" TEXT,
  "bio" TEXT,
  "avatarUrl" TEXT,
  "talkTitle" TEXT,
  "talkDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EventSpeaker_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventSponsor" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "organizationId" TEXT, -- links to Organization table
  "companyName" TEXT NOT NULL,
  "tier" TEXT NOT NULL, -- e.g., 'Platinum', 'Gold', 'Silver'
  "benefits" TEXT[],
  "logoUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EventSponsor_pkey" PRIMARY KEY ("id")
);

-- ===========================================
# COMMUNITY/ORGANIZATION ENHANCEMENTS
# ===========================================

CREATE TABLE "Announcement" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Gallery" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "eventId" TEXT, -- can be null for general org gallery
  "title" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GalleryItem" (
  "id" TEXT NOT NULL,
  "galleryId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "caption" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- ===========================================
# NOTIFICATION SYSTEM
# ===========================================

CREATE TYPE "NotificationType" AS ENUM (
  'EVENT_REMINDER',
  'APPLICATION_UPDATE',
  'NEW_OPPORTUNITY',
  'COMMUNITY_INVITE',
  'EVENT_UPDATE',
  'SPONSOR_RESPONSE',
  'MERCH_UPDATE',
  'SYSTEM_ANNOUNCEMENT'
);

CREATE TYPE "NotificationStatus" AS ENUM (
  'UNREAD',
  'READ',
  'ARCHIVED'
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "data" JSONB, -- for additional data like eventId, opportunityId, etc.
  "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt" TIMESTAMP(3),

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- ===========================================
# BOOKMARK/SAVE SYSTEM
# ===========================================

CREATE TABLE "Bookmark" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "eventId" TEXT,
  "opportunityId" TEXT,
  "organizationId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id"),
  -- Ensure at least one reference is set
  CONSTRAINT "check_bookmark_reference" 
    CHECK (
      (eventId IS NOT NULL) + 
      (opportunityId IS NOT NULL) + 
      (organizationId IS NOT NULL) >= 1
    )
);

-- ===========================================
# CERTIFICATE SYSTEM
# ===========================================

CREATE TYPE "CertificateType" AS ENUM (
  'PARTICIPATION',
  'VOLUNTEER',
  'ORGANIZER',
  'SPEAKER',
  'WINNER',
  'MENTOR'
);

CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "eventId" TEXT,
  "organizationId" TEXT,
  "type" "CertificateType" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "certificateUrl" TEXT, -- URL to PDF/certificate image
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- ===========================================
# SOCIAL/FOLLOW SYSTEM
# ===========================================

CREATE TABLE "Follow" (
  "id" TEXT NOT NULL,
  "followerId" TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Follow_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Prevent self-following
ALTER TABLE "Follow" ADD CONSTRAINT "no_self_follow" 
  CHECK ("followerId" <> "followingId");

-- ===========================================
# COMMENT & REACTION SYSTEM
# ===========================================

CREATE TABLE "Comment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "eventId" TEXT,
  "opportunityId" TEXT,
  "organizationId" TEXT,
  "parentId" TEXT, -- for replies
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "commentId" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- e.g., 'like', 'celebrate', 'support', 'insightful'
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- ===========================================
# INDEXES FOR PERFORMANCE
# ===========================================

-- User indexes
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_username_idx" ON "User"("username");

-- Experience/Education indexes
CREATE INDEX "Experience_userId_idx" ON "Experience"("userId");
CREATE INDEX "Education_userId_idx" ON "Education"("userId");
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- Opportunity indexes
CREATE INDEX "Opportunity_organizationId_idx" ON "Opportunity"("organizationId");
CREATE INDEX "Opportunity_type_idx" ON "Opportunity"("type");
CREATE INDEX "Opportunity_active_idx" ON "Opportunity"("active");
CREATE INDEX "Opportunity_featured_idx" ON "Opportunity"("featured");
CREATE INDEX "Application_opportunityId_idx" ON "Application"("opportunityId");
CREATE INDEX "Application_userId_idx" ON "Application"("userId");
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- Event indexes
CREATE INDEX "Event_organizationId_idx" ON "Event"("organizationId");
CREATE INDEX "Event_city_idx" ON "Event"("city");
CREATE INDEX "Event_category_idx" ON "Event"("category");
CREATE INDEX "EventMode_idx" ON "Event"("mode");
CREATE INDEX "EventSchedule_eventId_idx" ON "EventSchedule"("eventId");
CREATE INDEX "EventSpeaker_eventId_idx" ON "EventSpeaker"("eventId");
CREATE INDEX "EventSponsor_eventId_idx" ON "EventSponsor"("eventId");

-- Notification indexes
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_status_idx" ON "Notification"("status");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- Bookmark indexes
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");
CREATE INDEX "Bookmark_eventId_idx" ON "Bookmark"("eventId");
CREATE INDEX "Bookmark_opportunityId_idx" ON "Bookmark"("opportunityId");
CREATE INDEX "Bookmark_organizationId_idx" ON "Bookmark"("organizationId");

-- Certificate indexes
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");
CREATE INDEX "Certificate_eventId_idx" ON "Certificate"("eventId");
CREATE INDEX "Certificate_organizationId_idx" ON "Certificate"("organizationId");

-- Follow indexes
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- Comment indexes
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX "Comment_eventId_idx" ON "Comment"("eventId");
CREATE INDEX "Comment_opportunityId_idx" ON "Comment"("opportunityId");
CREATE INDEX "Comment_organizationId_idx" ON "Comment"("organizationId");
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- Reaction indexes
CREATE INDEX "Reaction_userId_idx" ON "Reaction"("userId");
CREATE INDEX "Reaction_commentId_idx" ON "Reaction"("commentId");

-- ===========================================
# FOREIGN KEYS
# ===========================================

-- Experience FKs
ALTER TABLE "Experience" 
  ADD CONSTRAINT "Experience_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- Education FKs
ALTER TABLE "Education" 
  ADD CONSTRAINT "Education_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- Project FKs
ALTER TABLE "Project" 
  ADD CONSTRAINT "Project_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- Opportunity FKs
ALTER TABLE "Opportunity" 
  ADD CONSTRAINT "Opportunity_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE;

ALTER TABLE "Application" 
  ADD CONSTRAINT "Application_opportunityId_fkey" 
  FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE;

ALTER TABLE "Application" 
  ADD CONSTRAINT "Application_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- EventSchedule FKs
ALTER TABLE "EventSchedule" 
  ADD CONSTRAINT "EventSchedule_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE;

-- EventSpeaker FKs
ALTER TABLE "EventSpeaker" 
  ADD CONSTRAINT "EventSpeaker_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE;

ALTER TABLE "EventSpeaker" 
  ADD CONSTRAINT "EventSpeaker_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL;

-- EventSponsor FKs
ALTER TABLE "EventSponsor" 
  ADD CONSTRAINT "EventSponsor_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE;

ALTER TABLE "EventSponsor" 
  ADD CONSTRAINT "EventSponsor_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL;

-- Announcement FKs
ALTER TABLE "Announcement" 
  ADD CONSTRAINT "Announcement_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE;

-- Gallery FKs
ALTER TABLE "Gallery" 
  ADD CONSTRAINT "Gallery_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE;

ALTER TABLE "Gallery" 
  ADD CONSTRAINT "Gallery_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL;

ALTER TABLE "GalleryItem" 
  ADD CONSTRAINT "GalleryItem_galleryId_fkey" 
  FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE;

-- Notification FKs
ALTER TABLE "Notification" 
  ADD CONSTRAINT "Notification_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- Bookmark FKs
ALTER TABLE "Bookmark" 
  ADD CONSTRAINT "Bookmark_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Bookmark" 
  ADD CONSTRAINT "Bookmark_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL;

ALTER TABLE "Bookmark" 
  ADD CONSTRAINT "Bookmark_opportunityId_fkey" 
  FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL;

ALTER TABLE "Bookmark" 
  ADD CONSTRAINT "Bookmark_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL;

-- Certificate FKs
ALTER TABLE "Certificate" 
  ADD CONSTRAINT "Certificate_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Certificate" 
  ADD CONSTRAINT "Certificate_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL;

ALTER TABLE "Certificate" 
  ADD CONSTRAINT "Certificate_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL;

-- Comment FKs
ALTER TABLE "Comment" 
  ADD CONSTRAINT "Comment_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Comment" 
  ADD CONSTRAINT "Comment_eventId_fkey" 
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL;

ALTER TABLE "Comment" 
  ADD CONSTRAINT "Comment_opportunityId_fkey" 
  FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL;

ALTER TABLE "Comment" 
  ADD CONSTRAINT "Comment_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL;

ALTER TABLE "Comment" 
  ADD CONSTRAINT "Comment_parentId_fkey" 
  FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE;

-- Reaction FKs
ALTER TABLE "Reaction" 
  ADD CONSTRAINT "Reaction_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Reaction" 
  ADD CONSTRAINT "Reaction_commentId_fkey" 
  FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE;

-- ===========================================
# UPDATE EXISTING TABLES TO ADD MISSING COLUMNS
# ===========================================

-- Add slug to Organization if missing (should already exist from original schema)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Organization' AND column_name = 'slug') THEN
    ALTER TABLE "Organization" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';
    UPDATE "Organization" SET "slug" = lower(replace(name, ' ', '-')) WHERE slug = '';
    CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
  END IF;
END $$;

-- Update Event to remove blocks JSONB in favor of relational tables (optional migration)
-- Keeping blocks for backward compatibility but encouraging use of relational tables
COMMENT ON COLUMN "Event"."blocks" IS 'Legacy field - prefer relational tables (EventSchedule, EventSpeaker, EventSponsor) for new development';

-- ===========================================
# SAMPLE DATA FOR SEEDING (examples)
# ===========================================

-- Note: Actual seeding would be done via separate seed scripts
-- This is just to show the structure

/*
INSERT INTO "User" ("id", "email", "username", "name", "role") VALUES
('user_001', 'aryasen@example.com', 'aryasen', 'Arya Sen', 'ORGANIZER'),
('user_002', 'priyadesai@example.com', 'priyadesai', 'Priya Desai', 'ATTENDEE');

INSERT INTO "Organization" ("id", "slug", "name", "type", "description") VALUES
('org_001', 'north-grid', 'North Grid Societies', 'Community', 'Delhi NCR student collective'),
('org_002', 'zephyr-labs', 'Zephyr Labs', 'Startup', 'Developer tools company');

INSERT INTO "Event" ("id", "organizationId", "slug", "title", "category", "city", "mode", "startsAt", "endsAt") VALUES
('event_001', 'org_001', 'summit-zero', 'Summit Zero', 'Startups', 'Bengaluru', 'OFFLINE', '2026-08-24T10:00:00+05:30', '2026-08-25T18:00:00+05:30');

INSERT INTO "Opportunity" ("id", "organizationId", "title", "type", "description", "location", "stipend", "duration", "applicationDeadline", "positionsAvailable") VALUES
('opp_001', 'org_002', 'Frontend Internship', 'INTERNSHIP', 'React/Vue frontend development internship', 'Remote', 25000, '3 months', '2026-06-30T23:59:59+05:30', 3);
*/