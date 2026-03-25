# VoiceFlow — Audio Translator

AI-powered audio translation using OpenAI APIs.
**Pipeline:** Audio → Whisper-1 (transcribe) → GPT-4o (translate) → TTS-1 (speak)

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Create a `.env` file in the root:
```
VITE_OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

### 3. Run the app
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Features
- Upload audio (MP3, WAV, M4A, OGG, FLAC, AAC) up to 25MB
- Choose from 18 output languages
- Pick from 6 TTS voices (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- Live step progress indicator
- Audio player with seek bar and waveform
- One-click download of translated audio

## Tech Stack
- React 18 + TypeScript
- Vite
- OpenAI Whisper-1, GPT-4o, TTS-1
- CSS Modules

## Build for production
```bash
npm run build
```
