import React, { useEffect, useRef, useState } from 'react';
import styles from './AudioResult.module.css';

interface Props {
  audioBlob: Blob;
  translatedText: string;
  targetLanguage: string;
  voice: string;
}

export const AudioResult: React.FC<Props> = ({ audioBlob, translatedText, targetLanguage, voice }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioUrl = useRef<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(audioBlob);
    audioUrl.current = url;
    if (audioRef.current) {
      audioRef.current.src = url;
    }
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = audioUrl.current;
    a.download = `translated_${targetLanguage.toLowerCase()}_${voice}.mp3`;
    a.click();
  };

  return (
    <div className={`${styles.card} fade-up`}>
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      <div className={styles.header}>
        <div className={styles.badge}>
          <span>✅</span>
          <span>Translation Complete</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.tag}>{targetLanguage}</span>
          <span className={styles.tag}>{voice}</span>
        </div>
      </div>

      {translatedText && (
        <div className={styles.textBox}>
          <p className={styles.textLabel}>Translated Text</p>
          <p className={styles.translatedText}>{translatedText}</p>
        </div>
      )}

      <div className={styles.player}>
        <button className={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="5" y="4" width="4" height="12" rx="1.5" fill="white"/>
              <rect x="11" y="4" width="4" height="12" rx="1.5" fill="white"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 4.5l10 5.5-10 5.5V4.5z" fill="white"/>
            </svg>
          )}
        </button>

        <div className={styles.seekArea}>
          <div className={styles.seekBar} onClick={handleSeek}>
            <div className={styles.seekFill} style={{ width: `${progress}%` }}>
              <div className={styles.seekThumb} />
            </div>
          </div>
          <div className={styles.times}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.waveform}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`${styles.bar} ${isPlaying ? styles.barActive : ''}`}
              style={{ animationDelay: `${i * 0.06}s`, height: `${Math.random() * 16 + 8}px` }}
            />
          ))}
        </div>
      </div>

      <button className={styles.downloadBtn} onClick={handleDownload}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2v10M5 8l4 4 4-4M3 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Download Audio
      </button>
    </div>
  );
};
