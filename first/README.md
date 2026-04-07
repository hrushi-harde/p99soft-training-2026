# Full-Stack Auth Starter (FastAPI + React + Vite)

This project is a minimal but production-ready authentication stack:

- FastAPI backend with JWT (access + refresh), bcrypt hashing, and SQLite
- React + Vite frontend with Tailwind CSS, React Router, Axios, and Context-based auth

## Backend (FastAPI)

### Requirements

- Python 3.10+

Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment

Copy the example env file and adjust values as needed:

```bash
cp .env.example .env
```

Key settings:

- `JWT_SECRET_KEY` – strong random secret
- `DATABASE_URL` – defaults to `sqlite:///./app.db`

### Run the API

From the project root:

```bash
npm run backend
```

Or run directly (PowerShell):

```bash
./scripts/dev-backend.ps1
```

Note (Windows): this repo may contain both `.venv/` and `venv/`. The backend script auto-detects one and will install `requirements.txt` into that venv if needed, which prevents the common `ModuleNotFoundError: No module named 'fastapi'` issue.

The main endpoints are:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /protected`

### Tests

Run the basic auth flow test:

```bash
python -m pytest app/tests.py
```

## Frontend (React + Vite)

### Install dependencies

From the project root:

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

The app expects the API at `http://localhost:8000` and runs by default at `http://localhost:5173`.

### Auth flow

1. Visit `/signup` to create an account.
2. You are automatically logged in and redirected to the protected home page (`/`).
3. Subsequent navigation uses the access token in the `Authorization` header.
4. When the access token expires, the Axios interceptor calls `/auth/refresh` using the HTTP-only refresh cookie.
5. Logout clears the refresh cookie server-side and client-side access token state.

Protected routes are enforced both in the backend (JWT dependency) and in the frontend via a `PrivateRoute` wrapper.
