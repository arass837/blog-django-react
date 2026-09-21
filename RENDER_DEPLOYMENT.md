# Render deployment

Projekt ma jeden zestaw kodu dla VS Code i Rendera. Produkcja jest sterowana zmiennymi środowiskowymi, a lokalne dane są w `backend/.env.local`.

## Backend Web Service

- Root Directory: `backend`
- Build Command: `./build.sh`
- Start Command: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`

Environment:

```text
ENVIRONMENT=production
DEBUG=False
DATABASE_URL=<Neon pooled connection string>
ALLOWED_HOSTS=blog-django-react-r6eq.onrender.com
CORS_ALLOWED_ORIGINS=https://blog-django-react-frontend.onrender.com
SECRET_KEY=<secret>
```

## Frontend Static Site

- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `build`
- Rewrite: `/*` -> `/index.html`

Environment:

```text
REACT_APP_API_URL=https://blog-django-react-r6eq.onrender.com/api/
```

The backend root `/` is a JSON health check. API endpoints are under `/api/`, and JWT login is available at `/api/token/`.
