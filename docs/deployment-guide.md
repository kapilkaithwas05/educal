# Educal Production Deployment Guide

Educal is configured for fast, reliable deployment across modern cloud platforms. The codebase includes ready-to-use configuration files for **Render**, **Vercel**, **Netlify**, and **Docker**.

---

## Step 1: Push Code to GitHub

First, create a new GitHub repository (e.g. `educal`), then run:

```bash
cd /Users/kapilkaithwas/ADITYA-MP/educal

# If your default branch is main
git branch -M main

# Link to your remote GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# Push to GitHub
git push -u origin main
```

---

## Option A: 1-Click Full-Stack on Render (Recommended)

Educal includes an Infrastructure-as-Code file (`render.yaml`) that configures both the backend API and frontend in one step.

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will detect `render.yaml` and provision:
   - **`educal-backend-api`**: Python Web Service running FastAPI on Uvicorn.
   - **`educal-frontend`**: Static Site building React with Vite and proxying API calls.
5. Click **Apply**. Both services will build and deploy automatically!

---

## Option B: Vercel (Frontend) + Render (Backend)

### Part 1: Deploy Backend on Render / Railway
1. In Render, select **New +** → **Web Service**.
2. Connect your repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `SECRET_KEY`: `<Generate a random 32-character string>`
   - `CORS_ORIGINS`: `*` (or your Vercel frontend URL)
   - `DATABASE_URL`: `sqlite+aiosqlite:///./educal.db` (or your PostgreSQL URL)
5. Copy your backend URL once live: e.g. `https://educal-backend.onrender.com`.

### Part 2: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   - `VITE_API_URL` = `https://educal-backend.onrender.com`
6. Click **Deploy**. Vercel will build and serve your app globally on an SSL domain.

---

## Option C: Self-Hosted Docker / VPS

For deploying to an AWS EC2, DigitalOcean Droplet, Linode, or any Linux server:

```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/educal.git
cd educal

# Start the full stack with Docker Compose
docker-compose up -d --build
```

- **Frontend** will be accessible at: `http://<YOUR_SERVER_IP>:5173`
- **Backend API** will be accessible at: `http://<YOUR_SERVER_IP>:8000`
- **Swagger Docs**: `http://<YOUR_SERVER_IP>:8000/docs`

---

## Production Database Configuration (PostgreSQL)

By default, Educal uses async SQLite for zero-config operation. For high-concurrency production deployments with PostgreSQL (Supabase, Railway, Neon, AWS RDS):

1. Set the `DATABASE_URL` environment variable:
   ```env
   DATABASE_URL=postgresql+asyncpg://<USER>:<PASSWORD>@<HOST>:5432/<DATABASE>
   ```
2. The backend automatically auto-detects `postgresql+asyncpg` and runs schema creation and question seed migration upon startup.
