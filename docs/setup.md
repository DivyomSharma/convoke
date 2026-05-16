# Convoke Setup

## 1. Environment Variables

Create `.env.local` from `.env.example`.

```env
DATABASE_URL="postgresql://postgres:<password>@<host>:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:<password>@<host>:5432/postgres"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/workspace"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/workspace"

NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase anon key>"
SUPABASE_SERVICE_ROLE_KEY="<supabase service role key>"

RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RESEND_API_KEY="re_..."
UPLOADTHING_TOKEN="..."
```

## 2. Clerk OAuth

In Clerk Dashboard:

1. Enable Google, Apple, Facebook, GitHub, and Discord OAuth.
2. Add redirect URL: `http://localhost:3000/sso-callback`.
3. Add production redirect URL: `https://convoke.xyz/sso-callback`.
4. Set sign-in URL to `/auth/sign-in`.
5. Set after sign-in and after sign-up URL to `/workspace`.

The custom buttons in `/auth/sign-in` call Clerk's SSO flow directly.

## 3. Supabase Email/Password

In Supabase:

1. Authentication -> Providers -> enable Email.
2. Authentication -> URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/workspace`, `https://convoke.xyz/workspace`
3. Project Settings -> API: copy `NEXT_PUBLIC_SUPABASE_URL`, anon key, and service role key.

Email/password sign-in and account creation are wired on `/auth/sign-in`.

## 4. Database

Recommended Prisma path:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Supabase SQL editor path:

1. Open Supabase SQL Editor.
2. Paste and run `supabase/schema.sql`.
3. Run `npx prisma generate` locally after the tables exist.

## 5. Local Run

```bash
npm install
npm run lint
npm run build
npm run dev
```

Open `http://127.0.0.1:3000`.

## 6. Production Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, or `RESEND_API_KEY` to the browser.
- Add the same env vars to Vercel Project Settings.
- Use Supabase pooled connection string for `DATABASE_URL` and direct connection string for migrations when available.
