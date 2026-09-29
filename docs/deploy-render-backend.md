# Deploy backend to Render

Host the Express API at `backend/`. Supabase stays as-is (same project as local dev).

## Option A — Dashboard (manual)

1. [render.com](https://render.com) → **New** → **Web Service** → connect your Git repo.
2. Settings (**most failures are wrong root directory or missing env vars**):

   | Field | Value |
   |-------|--------|
   | **Root directory** | `backend` **(recommended)** — or leave empty and use repo root `package.json` proxy |
   | **Runtime** | Node **20** (or 18+) |
   | **Build command** | `npm install && npx prisma generate` |
   | **Start command** | `npm start` |
   | **Health check path** | `/health` |

   If **Root directory** is blank, Render uses the repo root: the root `package.json` runs `build` / `start` in `backend/`. Still set **all env vars** below on the service.

3. **Environment variables** (copy values from local `backend/.env`; do not commit them):

   | Key | Notes |
   |-----|--------|
   | `DATABASE_URL` | Supabase pooler, transaction mode (port **6543**, `pgbouncer=true`) |
   | `DIRECT_URL` | Session pooler (port **5432**) |
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` | Backend only |
   | `ADMIN_EMAIL` | Same admin user as Supabase Auth |
   | `CORS_ORIGIN` | Your **frontend** URL(s), comma-separated, no trailing slash |

   Example after you deploy the frontend on Vercel:

   ```env
   CORS_ORIGIN=https://your-site.vercel.app
   ```

   Do **not** set `PORT` — Render sets it automatically.

4. **Create Web Service** → wait for deploy → open  
   `https://YOUR-SERVICE.onrender.com/health`  
   should return `{"ok":true,...}`.

5. Test API:  
   `https://YOUR-SERVICE.onrender.com/api/site-content`

6. Set frontend build env:

   ```env
   VITE_API_URL=https://YOUR-SERVICE.onrender.com/api
   ```

## Option B — Blueprint

Repo includes [`render.yaml`](../render.yaml). **New** → **Blueprint** → select repo → fill secret env vars when prompted.

## Free tier notes

- Service **spins down** after idle; first request can take ~30–60s (cold start).
- For production traffic, use a paid instance or another host.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| **Build failed** — `npm ERR! enoent` / no `package.json` | Set **Root directory** = `backend`, or push latest repo (root `package.json` proxy) |
| **Deploy failed** / health check | Service crashed on boot — open **Logs** tab. Usually **missing env vars** (`DATABASE_URL`, `ADMIN_EMAIL`, …). Add them, **Save**, **Manual Deploy** |
| Build fails on Prisma | Build command: `npm install && npx prisma generate` |
| `Missing required environment variable` | Add all keys listed above in Render **Environment** before deploy |
| Browser CORS errors | `CORS_ORIGIN` must exactly match frontend origin (`https://…`) |
| `503` / DB errors | Check `DATABASE_URL` password (URL-encoded), Supabase not paused |
| Admin 401 | Token expired; login again. `ADMIN_EMAIL` must match Supabase user |

## After deploy

- Run SQL migrations on Supabase if this is a **new** DB (not your current dev project).
- Optional once: `npm run storage:ensure` locally against production Supabase keys if buckets are missing.
