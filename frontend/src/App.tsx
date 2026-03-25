import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { StepProgress, type Step } from './components/StepProgress';
import { AudioResult } from './components/AudioResult';
import { LANGUAGES, VOICES } from './constants';
import { transcribeAudio, translateText, textToSpeech, type TtsVoice } from './services/openai';
import styles from './App.module.css';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('Hindi');
  const [voice, setVoice] = useState<TtsVoice>('alloy');
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [translatedText, setTranslatedText] = useState('');

  const isRunning = step !== 'idle' && step !== 'done' && step !== 'error';

  const handleTranslate = async () => {
    if (!file) return;
    setError(null);
    setAudioBlob(null);
    setTranslatedText('');

    try {
      setStep('transcribing');
      const transcript = await transcribeAudio(file);

      setStep('translating');
      const translated = await translateText(transcript, language);
      setTranslatedText(translated);

      setStep('synthesizing');
      const blob = await textToSpeech(translated, voice);
      setAudioBlob(blob);

      setStep('done');
    } catch (e: unknown) {
      setStep('error');
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    }
  };

  const handleReset = () => {
    setStep('idle');
    setAudioBlob(null);
    setTranslatedText('');
    setError(null);
  };

  return (
    <div className={styles.app}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Header */}
      <header className={`${styles.header} fade-up`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="url(#lg1)" strokeWidth="1.5"/>
              <path d="M9 14c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5" stroke="url(#lg2)" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="14" cy="14" r="2.5" fill="url(#lg3)"/>
              <defs>
                <linearGradient id="lg1" x1="1" y1="1" x2="27" y2="27" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa"/><stop offset="1" stopColor="#38bdf8"/>
                </linearGradient>
                <linearGradient id="lg2" x1="9" y1="9" x2="19" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f472b6"/><stop offset="1" stopColor="#a78bfa"/>
                </linearGradient>
                <linearGradient id="lg3" x1="11.5" y1="11.5" x2="16.5" y2="16.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8"/><stop offset="1" stopColor="#34d399"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>VoiceFlow</span>
        </div>
        <p className={styles.tagline}>AI-powered audio translation in seconds</p>
      </header>

      {/* Main card */}
      <main className={styles.card}>

        {/* Pipeline badges */}
        <div className={`${styles.pipeline} fade-up fade-up-delay-1`}>
          {['🎙️ Whisper-1', '→', '🌐 GPT-4o', '→', '🔊 TTS-1'].map((item, i) => (
            <span key={i} className={item === '→' ? styles.arrow : styles.pipelineBadge}>{item}</span>
          ))}
        </div>

        {/* Upload */}
        <section className={`${styles.section} fade-up fade-up-delay-1`}>
          <label className={styles.sectionLabel}>
            <span className={styles.labelDot} style={{ background: '#a78bfa' }} />
            Audio Input
          </label>
          <FileUpload
            file={file}
            onFileSelect={setFile}
            onError={setError}
            disabled={isRunning}
          />
        </section>

        {/* Settings row */}
        <div className={`${styles.settingsRow} fade-up fade-up-delay-2`}>

          {/* Language selector */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>
              <span className={styles.labelDot} style={{ background: '#38bdf8' }} />
              Output Language
            </label>
            <div className={styles.selectWrap}>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className={styles.select}
                disabled={isRunning}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} — {l.nativeName}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>▾</div>
            </div>
          </section>

          {/* Voice selector */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>
              <span className={styles.labelDot} style={{ background: '#f472b6' }} />
              TTS Voice
            </label>
            <div className={styles.voiceGrid}>
              {VOICES.map(v => (
                <button
                  key={v.id}
                  className={`${styles.voiceBtn} ${voice === v.id ? styles.voiceActive : ''}`}
                  onClick={() => setVoice(v.id)}
                  disabled={isRunning}
                  title={v.description}
                >
                  <span>{v.emoji}</span>
                  <span className={styles.voiceLabel}>{v.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Error */}
        {error && (
          <div className={`${styles.errorBox} fade-up`}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Progress */}
        {step !== 'idle' && (
          <div className="fade-up">
            <StepProgress step={step} />
          </div>
        )}

        {/* Result */}
        {audioBlob && translatedText && step === 'done' && (
          <AudioResult
            audioBlob={audioBlob}
            translatedText={translatedText}
            targetLanguage={language}
            voice={voice}
          />
        )}

        {/* CTA */}
        <div className={`${styles.cta} fade-up fade-up-delay-3`}>
          {step === 'done' || step === 'error' ? (
            <button className={styles.resetBtn} onClick={handleReset}>
              ↺ &nbsp;Start Over
            </button>
          ) : (
            <button
              className={`${styles.translateBtn} ${isRunning ? styles.running : ''}`}
              onClick={handleTranslate}
              disabled={!file || isRunning}
            >
              {isRunning ? (
                <span className={styles.runningContent}>
                  <span className={styles.spinner} />
                  Processing…
                </span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Translate Audio
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer note */}
        <p className={styles.footerNote}>
          Powered by OpenAI Whisper-1 · GPT-4o · TTS-1
        </p>
      </main>
    </div>
  );
}
