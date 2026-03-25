import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { transcribeAudio, translateText, textToSpeech, TtsVoice } from '../services/openai';

const router = Router();

// Store uploaded audio in memory (max 25 MB — same as OpenAI's limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

const VALID_VOICES: TtsVoice[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

// ── POST /api/transcribe ──────────────────────────────────────────────────────
// Body: multipart/form-data  { audio: <file> }
// Returns: { text: string }
router.post(
  '/transcribe',
  upload.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No audio file provided' });
        return;
      }

      const text = await transcribeAudio(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      res.json({ text });
    } catch (err) {
      next(err);
    }
  },
);

// ── POST /api/translate ───────────────────────────────────────────────────────
// Body: application/json  { text: string, targetLanguage: string }
// Returns: { translatedText: string }
router.post('/translate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, targetLanguage } = req.body as { text?: string; targetLanguage?: string };

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'text is required' });
      return;
    }
    if (!targetLanguage || typeof targetLanguage !== 'string') {
      res.status(400).json({ error: 'targetLanguage is required' });
      return;
    }

    const translatedText = await translateText(text, targetLanguage);
    res.json({ translatedText });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/tts ─────────────────────────────────────────────────────────────
// Body: application/json  { text: string, voice: TtsVoice }
// Returns: audio/mpeg binary stream
router.post('/tts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, voice } = req.body as { text?: string; voice?: string };

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'text is required' });
      return;
    }
    if (!voice || !VALID_VOICES.includes(voice as TtsVoice)) {
      res.status(400).json({ error: `voice must be one of: ${VALID_VOICES.join(', ')}` });
      return;
    }

    const audioBuffer = await textToSpeech(text, voice as TtsVoice);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-store',
    });

    res.send(audioBuffer);
  } catch (err) {
    next(err);
  }
});

export default router;
