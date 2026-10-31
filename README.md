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
<<<<<<< HEAD
- The frontend uses `VITE_API_URL` for API requests (default: `https://leancode.onrender.com`). For local testing create `frontend/.env` with `VITE_API_URL=http://localhost:5000`.
- This archive does not include `node_modules`; `npm install` recreates dependencies for your machine.


## Cross-device sync

Progress (roadmaps, learning state, submissions, Beginner Zone/Daily Challenge, AI Assistant chats) is stored on the account via `/api/learning-data`, with per-field versions so two devices never overwrite each other. Frontend logic is in `frontend/src/cloudSync.js`.

## Troubleshooting "Network Error" on login

1. Run the backend first: `cd backend && npm install && npm start`. Wait for `Learn Code backend running on http://localhost:5000`.
2. Open http://localhost:5000/api/health in the browser. It must show JSON with `"mongoConnected": true`.
3. Then run the frontend: `cd frontend && npm install && npm run dev` (restart it after any `.env` change).
4. If `mongoConnected` is false: MongoDB Atlas -> Network Access -> add your current IP (or 0.0.0.0/0 for testing).
=======
- The frontend currently uses `http://https://leancode.onrender.com` for API requests, so run the backend locally while testing.
- This archive does not include `node_modules`; `npm install` recreates dependencies for your machine.
>>>>>>> 7df38613cfab271ca06fbd9a37f3dbf66220a2f3
