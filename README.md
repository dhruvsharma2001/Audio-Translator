# VoiceFlow — AI Audio Translator

AI-powered audio translation using OpenAI Whisper-1, GPT-4o, and TTS-1.

```
🎙️ Audio File  →  Whisper-1 (transcribe)  →  GPT-4o (translate)  →  TTS-1 (speak)
```

## Project Structure

```
voiceflow-project/
├── backend/          # Node.js + Express API server (keeps your API key safe)
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── routes/translate.ts   # /api/transcribe, /api/translate, /api/tts
│   │   └── services/openai.ts    # OpenAI SDK calls (Whisper, GPT-4o, TTS)
│   ├── .env.example
│   └── package.json
│
├── frontend/         # React + Vite UI
│   ├── src/
│   │   ├── services/openai.ts    # Now calls YOUR backend (no API key exposed)
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
└── package.json      # Root convenience scripts
```

## Quick Start

### 1. Install dependencies

```bash
# From the voiceflow-project root:
npm run install:all

# Or individually:
cd backend && npm install
cd frontend && npm install
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-proj-your-real-key-here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Configure the frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Run both servers

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅  VoiceFlow backend running on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ➜  Local: http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

All endpoints are on `http://localhost:3001`.

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/health` | — | `{ status: "ok" }` |
| POST | `/api/transcribe` | `multipart/form-data` with `audio` file | `{ text: string }` |
| POST | `/api/translate` | `{ text, targetLanguage }` | `{ translatedText: string }` |
| POST | `/api/tts` | `{ text, voice }` | `audio/mpeg` binary |

### Voice options
`alloy` · `echo` · `fable` · `onyx` · `nova` · `shimmer`

---

## Why a Backend?

Previously the React app called OpenAI directly from the browser, which meant:
- ❌ Your `OPENAI_API_KEY` was visible to anyone opening DevTools
- ❌ Anyone could copy it and use it at your expense

Now:
- ✅ The API key lives only in `backend/.env` (never sent to the browser)
- ✅ The frontend calls your own backend (`/api/...`)
- ✅ The backend calls OpenAI on the server side

---

## Production Deployment

**Backend** — deploy to Railway / Render / Fly.io / EC2:
```bash
cd backend
npm run build      # compiles TypeScript → dist/
npm start          # runs node dist/index.js
```
Set `OPENAI_API_KEY`, `PORT`, and `FRONTEND_URL` as environment variables on your host.

**Frontend** — deploy to Vercel / Netlify:
```bash
cd frontend
npm run build      # outputs to dist/
```
Set `VITE_API_URL` to your deployed backend URL (e.g. `https://voiceflow-api.railway.app/api`).
