# HomeHub MVP

HomeHub is a production-ready MVP that connects homeowners with trusted home service professionals across Ireland. The platform supports directory search, quote requests, reviews, provider verification, and role-based dashboards.

## Tech stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- Prisma + PostgreSQL
- Cloudinary for image uploads
- Nodemailer for email notifications

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start Postgres with Docker:

```bash
docker compose up -d
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Run Prisma migrations and seed data:

```bash
npx prisma migrate dev
npm run seed
```

5. Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Seeded accounts

- Admin: `admin@homehub.ie` / `Admin123!`
- Providers: `provider1@homehub.ie` ... `provider60@homehub.ie` / `Provider123!`
- Customers: `customer1@homehub.ie` ... `customer10@homehub.ie` / `Customer123!`

## Product overview

### Roles

- **Visitor**: browse categories and provider profiles.
- **Customer**: request quotes, manage quote requests, leave reviews for completed jobs.
- **Provider**: manage leads and profile details.
- **Admin**: verify providers, moderate reviews, track quote volume.

### Core flows

- Directory search by category + location.
- Quote request broadcasting to providers in the same category + county.
- Review submission gated by completed quote requests.
- Admin verification workflow.

## SEO & analytics

- OpenGraph metadata and canonical URLs in the root layout.
- `sitemap.xml` and `robots.txt` powered by Next.js route handlers.
- Client analytics hook sends events to `/api/analytics`.

## Image uploads

Quote request photos upload to Cloudinary via `/api/upload`. The handler validates file type and size (max 5MB).

## Deployment (Vercel)

1. Create a new Vercel project and link this repository.
2. Set environment variables from `.env.example` in Vercel.
3. Add a Postgres database (Supabase, Neon, or RDS) and update `DATABASE_URL`.
4. Deploy.

### Custom domain

1. In Vercel, go to **Project Settings → Domains**.
2. Add `homehub.ie` and follow DNS instructions.
3. Ensure your DNS A/ALIAS records match Vercel's recommendations.

## Tests and CI

- `npm run lint` runs ESLint.
- `npm run test` runs Vitest.
- GitHub Actions CI runs lint, tests, and production build on PRs.

## Observability

Structured logs are emitted from the `logger` utility. Errors are captured by `app/error.tsx`.
