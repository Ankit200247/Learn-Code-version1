# CodeMentor AI — cleaned project

This project is organized into separate `frontend` and `backend` folders. Dependency folders, Git internals, merge-backup text files, temporary files, and the original secret `.env` file are not included.

## Folder structure

- `frontend/` — React + Vite application
- `backend/` — Express API, MongoDB models, AI endpoints, and code-execution endpoints
- `backend/.env.example` — template for local environment configuration

## First-time setup

### 1. Configure backend environment

Open `backend/.env.example`, copy it to `backend/.env`, and fill in your own values:
- `GEMINI_API_KEY` — Google Gemini API key
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — a long random secret
- Optional SMTP and Judge0 values, if those features are needed

The original archive used `AI_API_KEY`, while the backend code reads `GEMINI_API_KEY`. Put your Gemini key under `GEMINI_API_KEY` in `backend/.env`.

### 2. Install dependencies

Open two terminals in VS Code.

Backend terminal:
```bash
cd backend
npm install
npm start
```

Frontend terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Important

- The project code has been preserved as much as possible. The `backend/server.js` Git conflict sections were resolved by keeping the existing `HEAD` implementation and removing the duplicated conflicting branch.
- The original `server/.env` was intentionally not copied into this archive to avoid bundling private API/database credentials. Copy its values into the new `backend/.env` yourself, especially `MONGODB_URI`, `JWT_SECRET`, and your Gemini key.
- The frontend currently uses `http://localhost:5000` for API requests, so run the backend locally while testing.
- This archive does not include `node_modules`; `npm install` recreates dependencies for your machine.
