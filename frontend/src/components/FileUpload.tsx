import React, { useRef, useState, useCallback } from 'react';
import { ACCEPTED_AUDIO_TYPES, MAX_FILE_SIZE_MB } from '../constants';
import styles from './FileUpload.module.css';

interface Props {
  file: File | null;
  onFileSelect: (file: File) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<Props> = ({ file, onFileSelect, onError, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const validate = useCallback((f: File): boolean => {
    if (!ACCEPTED_AUDIO_TYPES.includes(f.type) && !f.name.match(/\.(mp3|wav|m4a|ogg|flac|aac|webm|mp4)$/i)) {
      onError('Please upload an audio file (MP3, WAV, M4A, OGG, FLAC, AAC)');
      return false;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      onError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    return true;
  }, [onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f && validate(f)) onFileSelect(f);
  }, [disabled, onFileSelect, validate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && validate(f)) onFileSelect(f);
    e.target.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ''} ${file ? styles.hasFile : ''} ${disabled ? styles.disabled : ''}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {file ? (
        <div className={styles.fileInfo}>
          <div className={styles.fileIcon}>🎵</div>
          <div className={styles.fileMeta}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>{formatSize(file.size)}</span>
          </div>
          <button
            className={styles.changeBtn}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            disabled={disabled}
          >
            Change
          </button>
        </div>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.uploadIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="url(#grad)" strokeWidth="1.5" strokeDasharray="4 2" />
              <path d="M20 26V14M14 20l6-6 6 6" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa"/>
                  <stop offset="1" stopColor="#38bdf8"/>
                </linearGradient>
                <linearGradient id="grad2" x1="14" y1="14" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa"/>
                  <stop offset="1" stopColor="#38bdf8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className={styles.mainText}>Drop your audio file here</p>
          <p className={styles.subText}>or click to browse · MP3, WAV, M4A, OGG, FLAC · Max {MAX_FILE_SIZE_MB}MB</p>
        </div>
      )}
    </div>
  );
};
