import React from 'react';
import styles from './StepProgress.module.css';

export type Step = 'idle' | 'transcribing' | 'translating' | 'synthesizing' | 'done' | 'error';

interface Props {
  step: Step;
}

const STEPS = [
  { key: 'transcribing', label: 'Transcribing', icon: '🎙️', desc: 'Whisper-1' },
  { key: 'translating', label: 'Translating', icon: '🌐', desc: 'GPT-4o' },
  { key: 'synthesizing', label: 'Generating', icon: '🔊', desc: 'TTS-1' },
];

const ORDER = ['transcribing', 'translating', 'synthesizing', 'done'];

export const StepProgress: React.FC<Props> = ({ step }) => {
  if (step === 'idle') return null;

  const currentIdx = ORDER.indexOf(step);

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {STEPS.map((s, i) => {
          const idx = ORDER.indexOf(s.key);
          const isActive = step === s.key;
          const isDone = currentIdx > idx || step === 'done';
          const isPending = currentIdx < idx && step !== 'done';

          return (
            <React.Fragment key={s.key}>
              <div className={`${styles.step} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''} ${isPending ? styles.pending : ''}`}>
                <div className={styles.iconWrap}>
                  {isDone ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{s.icon}</span>
                  )}
                  {isActive && <div className={styles.ring} />}
                </div>
                <div className={styles.labels}>
                  <span className={styles.label}>{s.label}</span>
                  <span className={styles.desc}>{s.desc}</span>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.connector} ${isDone ? styles.connectorDone : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {step !== 'done' && step !== 'error' && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} />
        </div>
      )}
    </div>
  );
};
