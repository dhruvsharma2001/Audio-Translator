import type { TtsVoice } from '../services/openai';

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'Hindi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'French', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'Spanish', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'German', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'Japanese', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'Arabic', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'Portuguese', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'Russian', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'Chinese', name: 'Chinese (Simplified)', flag: '🇨🇳', nativeName: '中文' },
  { code: 'Korean', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'Italian', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'Dutch', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'Turkish', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'Polish', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'Swedish', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'Greek', name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
  { code: 'Thai', name: 'Thai', flag: '🇹🇭', nativeName: 'ภาษาไทย' },
  { code: 'Vietnamese', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
];

export interface VoiceOption {
  id: TtsVoice;
  label: string;
  description: string;
  emoji: string;
}

export const VOICES: VoiceOption[] = [
  { id: 'alloy', label: 'Alloy', description: 'Neutral & balanced', emoji: '⚖️' },
  { id: 'echo', label: 'Echo', description: 'Clear & crisp', emoji: '🔊' },
  { id: 'fable', label: 'Fable', description: 'Warm & expressive', emoji: '✨' },
  { id: 'onyx', label: 'Onyx', description: 'Deep & authoritative', emoji: '🖤' },
  { id: 'nova', label: 'Nova', description: 'Friendly & bright', emoji: '🌟' },
  { id: 'shimmer', label: 'Shimmer', description: 'Soft & gentle', emoji: '🌸' },
];

export const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave',
  'audio/mp4', 'audio/m4a', 'audio/ogg', 'audio/webm',
  'audio/flac', 'audio/aac',
];

export const MAX_FILE_SIZE_MB = 25;
