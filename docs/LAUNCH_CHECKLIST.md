# Pre-Flight Launch Checklist

**Source of Truth Version:** 1.0.0

Before Convoke can be officially launched to the public, the following critical items must be verified and resolved.

## 1. Database & Seeding
- [ ] Ensure the production PostgreSQL database is provisioned and linked via `DATABASE_URL`.
- [ ] Run the `/api/seed?secret=convoke123` endpoint on production to populate the initial taxonomy (Organizations, Spaces, base Events).
- [ ] **Critical**: Change or remove the hardcoded `convoke123` seed secret from the API route before launching.

## 2. Authentication
- [ ] Swap Supabase API keys from Development projects to Production projects in Vercel environment variables.
- [ ] In the Supabase Dashboard, configure the OAuth Consent Screens for Google, Apple, LinkedIn, and Discord.
- [ ] Ensure the Supabase Email SMTP settings are configured (default Supabase limits email sending heavily in production).
- [ ] Verify the `/auth/callback` route successfully sets cookies on the production domain.

## 3. SEO & Metadata
- [ ] Implement `generateMetadata` on `/profile/[handle]/page.tsx` so users have proper titles when sharing profiles.
- [ ] Implement `generateMetadata` on `/org/[slug]/page.tsx`.
- [ ] Generate and place a production `robots.txt` and `sitemap.xml`.
- [ ] Create a default OpenGraph social sharing image and add it to `src/app/layout.tsx`.

## 4. Legal & Compliance
- [ ] Replace the placeholder text in `src/app/terms/page.tsx` with actual legally binding Terms of Service.
- [ ] Replace the placeholder text in `src/app/privacy/page.tsx` with an actual Privacy Policy.

## 5. Security
- [ ] Verify Prisma logging is set to `["error"]` only in production to prevent leaking PII.
- [ ] Remove legacy Clerk webhook endpoints (`src/app/api/webhooks/clerk`) if no longer used.

## 6. UX / Polish
- [ ] Replace any remaining mock data in `/workspace` and `/explore` with live Prisma queries.
- [ ] Ensure `loading.tsx` and `error.tsx` boundary files are created for core routes to prevent full-page crashes.
