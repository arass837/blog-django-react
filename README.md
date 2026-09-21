# ReactoDjango — jeden projekt lokalnie i na produkcji

Ten sam kod działa w dwóch środowiskach bez podmieniania plików.

## Lokalnie w VS Code

1. Otwórz `blog-django-react.code-workspace` w Visual Studio Code.
2. Skopiuj `backend/.env.example` jako `backend/.env.local`.
3. W `backend/.env.local` wpisz hasło do lokalnego PostgreSQL (`DB_PASSWORD`). Domyślna baza to `oski`.
4. Backend:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

5. Frontend w drugim terminalu:

```powershell
cd frontend
npm install
npm start
```

Lokalne adresy:
- React: `http://localhost:3000`
- Django API: `http://127.0.0.1:8000/api/`
- Django admin: `http://127.0.0.1:8000/admin/`

Możesz też w VS Code uruchomić zadanie **Terminal → Run Task → Start local project**.

## Produkcja na Render

Backend i frontend korzystają z dokładnie tego samego repozytorium.

Backend Render:
- `ENVIRONMENT=production`
- `DEBUG=False`
- `DATABASE_URL=<Neon connection string>`
- `ALLOWED_HOSTS=blog-django-react-r6eq.onrender.com`
- `CORS_ALLOWED_ORIGINS=https://blog-django-react-frontend.onrender.com`
- `SECRET_KEY=<secret>`

Frontend Render Static Site:
- `REACT_APP_API_URL=https://blog-django-react-r6eq.onrender.com/api/`

Render wykonuje `backend/build.sh`, a frontend buduje się przez `npm ci && npm run build`.

## Ważne

- `backend/.env.local` nie trafia do GitHub.
- Neon jest używany tylko wtedy, gdy na Renderze istnieje `DATABASE_URL`.
- Lokalnie, bez `DATABASE_URL`, Django używa lokalnego PostgreSQL z `DB_*`.
- `settings_neon.py` nie jest już potrzebny do normalnej pracy.
