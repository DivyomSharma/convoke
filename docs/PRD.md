# CONVOKE — MASTER CODEBASE CONTEXT, ARCHITECTURE & SYSTEM AUDIT

# VERSION
Convoke v1.0 (Fresh Start)

This document is the **single source of truth** for every AI agent, engineer, designer, product manager, and autonomous workflow working on Convoke.
Nothing outside this document should override its principles.

---

# PRODUCT DEFINITION
Convoke is a **Progressive Web App (PWA)** for ambitious people.
It is where: Students, Founders, Developers, Designers, Creators, Researchers, Recruiters, Alumni, Investors, Communities gather to build their future together.
Convoke is NOT: LinkedIn, Discord, Meetup, Unstop, Slack, Reddit.
Convoke is a completely new category: **The Operating System for Builders.**

---

# PRODUCT PRINCIPLES
Identity > Resume
Participation > Followers
Proof > Claims
Community > Audience
Momentum > Engagement
Action > Content
Craft > Noise

---

# EXPERIENCE
Users should feel: "I belong here."
The platform should feel alive, create FOMO, feel handcrafted.
The platform should never feel AI generated, like a dashboard, or like a CRUD app.

---

# DESIGN PHILOSOPHY
Editorial. Minimal. Human. Quiet.
Apple craftsmanship. Discord belonging. Linear polish. Read.cv elegance. Luma storytelling. Financial Times typography.
No gradients. No bronze. No orange. No fake SaaS cards. No oversized shadows. No AI blob illustrations.
Whitespace is design. Typography is hierarchy. Photography is emotion.

---

# COLOR SYSTEM
**Light:** Background #F7F7F5, Primary #111111, Secondary #666666, Border #E5E5E5, Accent Discord Blurple #5865F2
**Dark:** Background #0A0A0A, Surface #111111, Primary #F5F5F5, Secondary #A0A0A0, Border #262626, Accent Discord Blurple

---

# TYPOGRAPHY
Editorial serif for large headings. Neutral sans for UI. Large spacing, margins, whitespace. Comfortable reading width. Magazine layouts. No cramped grids.

---

# PHOTOGRAPHY
Every page uses realistic documentary photography. Real founders, students, hackers, offices, campuses, meetups, discussions, coworking, research labs.
Never use AI vectors, blobs, or abstract shapes.

---

# GLOBAL UX
Everything scrolls vertically. No horizontal carousels. No giant dashboard widgets. No unnecessary charts. Reads like an editorial publication. Every screen feels intentional.

---

# INFORMATION ARCHITECTURE
Home, Explore, Spaces, Events, Opportunities, Workspace, Messages, Notifications, Profile, Settings, Search, Organization, Onboarding, Authentication.

---

# CORE ROUTES
- **HOME:** Editorial landing page. Large documentary hero.
- **EXPLORE:** Unified ecosystem feed (Events, Projects, Communities, Roles, etc.). Chronological, infinite scroll.
- **SPACES:** Community pages. Large photography, members, projects, pinned posts.
- **EVENTS:** Narrative pages. Photography, timeline, agenda, QR tickets, calendar sync.
- **OPPORTUNITIES:** Editorial listings. No job cards. Large typography.
- **WORKSPACE:** Private OS. Timeline, Today, This Week, Calendar, Applications, Momentum. No dashboard feel.
- **PROFILE:** Living proof of work. Bio, Projects, Research, Events, GitHub, Momentum graph, Vouches.

---

# ARCHITECTURE & INFRASTRUCTURE
- **AUTHENTICATION:** Supabase (Email/Password), Clerk (OAuth APIs). Custom UI, branded.
- **DATABASE:** Supabase PostgreSQL, Prisma ORM. RLS enabled, indexed, foreign keys.
- **STORAGE:** Supabase Storage (avatars, covers, events, spaces, etc.).
- **REALTIME:** Supabase Realtime (Messages, Notifications, Typing, Presence).
- **AI:** Groq (Optional. Cold message rewrite, summaries. Never core dependency).
- **PWA:** Installable, offline workspace, splash screen, native feel.
- **PERFORMANCE:** Server Components, Streaming, AVIF/WebP, Edge runtime. Lighthouse 95+.
- **SECURITY:** Rate limits, RLS, CSRF, Zod, Prisma, Audit logs.
- **ANALYTICS:** PostHog.
- **EMAIL:** Resend.
- **MAPS:** Mapbox.
- **PAYMENTS:** Stripe, Razorpay.
- **BACKGROUND JOBS:** Inngest.
- **CACHE:** Vercel Cache, Upstash Redis.
- **OBSERVABILITY:** Sentry, BetterStack.

---

# DEPLOYMENT POLICY
Every completed feature: Lint -> Typecheck -> Test -> Build -> Audit -> Deploy -> Verify -> Generate report.
Push only to main. Never leave main broken. Always keep Vercel production deployable.

---

# FINAL MISSION
Build a timeless digital place where ambitious people discover each other, collaborate, learn, launch, get hired, and build companies together.
Every interaction should make the user feel one thing: **"This is where I want to build my future."**
