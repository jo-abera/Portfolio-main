# Render checklist — Portfolio-main (fix failed deploy)

Your service URL: `https://portfolio-main-v6bd.onrender.com`

Pick **ONE** setup. Mixing root directory and start command is the most common cause of **~1 minute** failed deploys.

---

## Setup A — Root directory = `backend` (recommended)

**Settings → Build & Deploy**

| Field | Exact value |
|-------|-------------|
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Do **not** use `npm start --prefix backend` here.

---

## Setup B — Root directory empty (repo root)

| Field | Exact value |
|-------|-------------|
| Root Directory | *(leave blank)* |
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

---

## Environment variables (required)

**Environment** tab — add every row (values from local `backend/.env`):

```
DATABASE_URL
DIRECT_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_EMAIL
CORS_ORIGIN
```

Optional: `NODE_VERSION` = `20`

`CORS_ORIGIN` example: `https://your-frontend.vercel.app` (no trailing slash)

**Save** → **Manual Deploy** → **Clear build cache & deploy**

---

## Read the log

Open the failed deploy → **Logs** → scroll to the **bottom**.

| You see | Fix |
|---------|-----|
| `Missing required environment variable` | Add env vars above, redeploy |
| `npm start --prefix backend` / `ENOENT` | Wrong start command for Setup A — use `npm start` |
| `prisma package missing` | Build command must include `npm run build` after `npm install` |
| `Cannot find module '@prisma/client'` | Build did not run `npm run build` |
| Build succeeds, then exit | Env vars missing at **runtime** |

Copy the last **20 lines** of the log if it still fails.

---

## After success

```text
GET https://portfolio-main-v6bd.onrender.com/health
→ {"ok":true,"uptime":...}
```

Frontend: `VITE_API_URL=https://portfolio-main-v6bd.onrender.com/api`
