# Educal Deployment Guide

## 1. Local Development Quickstart

### Backend
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm run dev
```
Web App will be live at: http://localhost:5173

---

## 2. Production Docker Deployment

A multi-stage `Dockerfile` and `docker-compose.yml` are provided in the project root:

```bash
docker-compose up --build -d
```

---

## 3. Cloud Deployment (Vercel / Render / Supabase)

- **Frontend**: Deploy `frontend/` on Vercel or Netlify with `VITE_API_URL` pointing to backend.
- **Backend**: Deploy `backend/` on Render or Railway with Python 3.11+.
- **Database**: Set `DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/educal` for production PostgreSQL.
