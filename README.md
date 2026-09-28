# Portfolio-Yohannes

Personal developer portfolio with a marketing site and a single-admin dashboard. All content lives in **Supabase PostgreSQL** and is managed through `/admin`—no redeploy needed for copy, projects, or media updates.

## What it includes

- **Public site** — Hero (optional background video), about, services, skills, resume timeline, projects, testimonials, contact form, `/resume` PDF page
- **Admin** — CRUD for every section, reorder lists, publish toggles, enquiry inbox, review approval
- **Uploads** — Images, resume PDF, hero video via backend → Supabase Storage

## Tech stack

| Part | Tools |
|------|--------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend | Express, Zod, Prisma |
| Platform | Supabase (Postgres, Auth, Storage) |

The browser never gets the service-role key. The frontend uses Supabase **only to sign in**; all reads/writes go through the Express API.

## Repository layout

```
frontend/                 Public SPA + admin UI
backend/                  REST API, validators, upload handlers
backend/prisma/           Prisma models
database/migrations/      SQL run in Supabase (schema, RLS, buckets)
postman/                  Optional Postman collection (local API testing)
README-local.md           Full setup, env, API list, deployment
.env.example              Template for backend/.env and frontend/.env
```

## Quick start

**Prerequisites:** Node.js 18+, a Supabase project.

1. **Database** — In Supabase **SQL Editor**, run migrations `0001` through `0006` under `database/migrations/` (order matters). Details in [README-local.md](./README-local.md).
2. **Environment** — Copy `.env.example` to `backend/.env` and `frontend/.env`. Set `DATABASE_URL`, `DIRECT_URL`, Supabase URL/keys, `ADMIN_EMAIL`, `VITE_API_URL=http://localhost:4000/api`, and `CORS_ORIGIN` (include your Vite port if not 5173).
3. **Admin user** — Create the user in Supabase **Authentication**. `ADMIN_EMAIL` must match that email.
4. **Run**

```bash
cd backend
npm install
npm run dev          # http://localhost:4000

cd frontend
npm install
npm run dev          # http://localhost:5173 (or next free port)
```

5. **Optional** (from `backend/`):

```bash
npm run storage:ensure        # create Storage buckets if missing
npm run db:social-platforms   # extend social_links platforms (WhatsApp, Telegram, …)
```

| URL | Purpose |
|-----|---------|
| `http://localhost:5173` | Public portfolio |
| `http://localhost:5173/admin/login` | Admin panel |
| `http://localhost:4000/health` | API health check |

**Branding:** replace `frontend/public/logo.png` (header/footer). **Tab title:** Admin → **Website Content** → **Site Title** and **SEO Meta Description**.

## npm scripts

| Directory | Command | Description |
|-----------|---------|-------------|
| `frontend/` | `npm run dev` | Development server |
| `frontend/` | `npm run build` | Production build → `dist/` |
| `backend/` | `npm run dev` | API with file watch |
| `backend/` | `npm start` | Production API |
| `backend/` | `npm run db:studio` | Prisma Studio |
| `backend/` | `npm run db:migrate` | Prisma migrate deploy (if baselined) |

## API overview

- **Public:** `GET /api/site-content`, `/services`, `/skills`, `/projects`, resume routes, `/reviews`, etc.
- **Public write:** `POST /api/enquiries`, `POST /api/reviews` (rate-limited)
- **Admin:** `GET|POST|PUT|DELETE /api/admin/...` — requires `Authorization: Bearer <Supabase access_token>` and email = `ADMIN_EMAIL`
- **Upload:** `POST /api/admin/upload/:bucket` (multipart field `file`)

Full route list: [README-local.md § API overview](./README-local.md#api-overview).

## Production

Build the frontend, host `frontend/dist` statically, run the backend on Node, and align `VITE_API_URL` with your API base URL and `CORS_ORIGIN` with your site origin. See [README-local.md § Production build](./README-local.md#production-build).

## Security

- Keep `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SECRET_KEY`) in `backend/.env` only.
- Do not commit `backend/.env`, `frontend/.env`, or secrets.

---

**Detailed guide:** [README-local.md](./README-local.md)
