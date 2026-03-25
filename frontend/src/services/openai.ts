const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type TtsVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// ── Step 1: Audio → Text (via backend → Whisper-1) ───────────────────────────
export async function transcribeAudio(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('audio', file);

  const res = await fetch(`${BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Transcription failed');
  }

  const data = await res.json() as { text: string };
  return data.text;
}

// ── Step 2: Text → Translated Text (via backend → GPT-4o) ────────────────────
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Translation failed');
  }

  const data = await res.json() as { translatedText: string };
  return data.translatedText;
}

// ── Step 3: Translated Text → Audio (via backend → TTS-1) ────────────────────
export async function textToSpeech(text: string, voice: TtsVoice): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Text-to-speech failed');
  }

  return await res.blob();
}
