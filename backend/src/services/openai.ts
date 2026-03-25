import OpenAI from 'openai';
import { Readable } from 'stream';
import { toFile } from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set in environment variables');
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

// ── Step 1: Audio → Text via Whisper-1 ───────────────────────────────────────
export async function transcribeAudio(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> {
  const client = getClient();

  // Convert Buffer to a File-compatible object that the SDK accepts
  const file = await toFile(Readable.from(buffer), originalName, { type: mimeType });

  const response = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });

  return response.text;
}

// ── Step 2: Text → Translated Text via GPT-4o ────────────────────────────────
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the user's text into ${targetLanguage}. Return ONLY the translated text with no explanations, notes, or extra formatting.`,
      },
      { role: 'user', content: text },
    ],
  });

  return response.choices[0].message.content ?? '';
}

// ── Step 3: Translated Text → Audio via TTS-1 ────────────────────────────────
export type TtsVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export async function textToSpeech(text: string, voice: TtsVoice): Promise<Buffer> {
  const client = getClient();

  const response = await client.audio.speech.create({
    model: 'tts-1',
    input: text,
    voice,
  });

  // SDK returns a Response — read it as an ArrayBuffer then convert to Buffer
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
