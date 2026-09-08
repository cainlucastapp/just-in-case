![Just In Case](client/src/assets/images/justincase-logo.webp)

Just In Case exists so that when the person who runs a household — bills, mortgage, HOA, banking, income — suddenly can't anymore, their family isn't left guessing. No warning, no handoff, just everything that person carried in their head, gone with them. Just In Case gives that knowledge a secure home ahead of time, and a way to hand it to the right people the moment it's needed.

## Features

- **Account & auth** — signup/login backed by short-lived access tokens and a rotating refresh token, rate-limited against brute force; profile edits, password changes, and account deletion, with sensitive actions re-verified server-side.
- **Items** — create, edit, and delete personal items (bank accounts, mortgages, insurance, and the like); content is encrypted at rest.
- **Cases** — group related items into a case (e.g. "Household Essentials"); the same item can belong to more than one case without duplicating it.
- **Sharing** — share a case with another user by email; they can view it or drop access themselves, and the owner can revoke access at any time.

## Tech stack

- **Frontend:** React 19, Vite, React Router. CSS.
- **Backend:** Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-Limiter, Flask-Bcrypt, Flask-CORS.
- **Database:** SQLite.
- **Required packages:** `lucide-react` for icons.

## Project structure

```
client/   React frontend (Vite)
api/      Flask backend (REST API)
```

## Getting started

### Backend (api/)

```
cd api
pipenv install
pipenv run flask db upgrade
pipenv run python seed.py
pipenv run flask run
```

The API runs at `http://localhost:5555`.

Environment variables (see `api/.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Flask session/signing secret | — |
| `JWT_SECRET_KEY` | Signs access/refresh tokens | — |
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///just_in_case.db` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `http://localhost:5173` |
| `ENCRYPTION_KEY` | Symmetric key for encrypting item content at rest | — |
| `JWT_COOKIE_SECURE` | Require HTTPS for the refresh-token cookie | `false` |
| `FLASK_DEBUG` | Enable Flask debug mode | `false` |

### Frontend (client/)

```
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Environment variables (see `client/.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the API | `/api` |

### Test login

After running `pipenv run python seed.py`:

- **Email:** alice@example.com
- **Password:** password123

(`bob@example.com` and `carol@example.com` are also seeded, same password — useful for testing case sharing.)

## Future Improvements / Deployment Goals
- Testing Suite
- Enterprise-level encryption
- Email validation
- Password Reset (Via Email)
- Production Grade DB