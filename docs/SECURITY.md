# Security Architecture

**Source of Truth Version:** 1.0.0

## 1. Authentication Security
Convoke relies entirely on **Supabase Auth**.
- Passwords are never stored or processed directly by the Next.js application.
- OAuth flows utilize secure server-to-server code exchanges (`/auth/callback/route.ts`).
- Magic Link OTPs prevent credential stuffing attacks.

## 2. Route Protection & Authorization
- **Edge Middleware (`src/middleware.ts`)**: Acts as a blanket security layer. It operates on an "allow-list" principle. If a route is not explicitly marked public (e.g., `/`, `/login`, `/api/seed`), the middleware blocks access and redirects to `/login`.
- **Session Refresh**: The middleware guarantees that expired sessions are automatically refreshed. If a user's token is revoked in the database, the middleware will immediately detect the invalid token on the next page navigation and log them out.

## 3. Database Security
- **Prisma**: Usage of the Prisma ORM inherently protects against SQL Injection attacks. All dynamic parameters are parameterized before execution against PostgreSQL.
- **Logging**: Production Prisma logging is strictly limited to `["error"]` to prevent sensitive user data or API keys from leaking into the Vercel server logs.

## 4. API Security
- **Seeding Endpoint (`/api/seed`)**: The database seeding route is protected by a static URL secret (`?secret=convoke123`). While this is functional for early stages, it is a known vulnerability if the URL is leaked or logged in access proxies.
- **Webhooks (`/api/webhooks/*`)**: Incoming webhooks (e.g., from Svix) must be cryptographically verified using `Webhook.verify()` to ensure the payload actually originated from the trusted provider.

## 5. Client-Side Security
- **Strict TypeScript**: The project runs TypeScript 5 in strict mode (`"strict": true`), severely reducing the surface area for runtime null-reference vulnerabilities and logic bypasses.
- **Environment Variables**: Sensitive keys (like `SUPABASE_SERVICE_ROLE_KEY` or database URLs) are strictly omitted from the `NEXT_PUBLIC_` prefix, guaranteeing they are never bundled into the client-side JavaScript.
