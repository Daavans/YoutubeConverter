import React from 'react';
import { T } from '../styles/tokens';
import { fmtTime } from '@yoink/shared';
import type { VideoMeta } from '@yoink/shared';
import TrimSlider from './TrimSlider';
import Icon from './Icon';

interface VideoCardProps {
  meta: VideoMeta;
  trim: [number, number];
  onTrimChange: (t: [number, number]) => void;
}

export default function VideoCard({ meta, trim, onTrimChange }: VideoCardProps) {
  return (
    <div style={{
      borderRadius: T.r14, background: T.panel, border: `1px solid ${T.border}`,
      padding: 16, display: 'flex', gap: 16,
    }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: 216, height: 122, borderRadius: 10, overflow: 'hidden', background: '#1a1d24' }}>
          {meta.thumbnailUrl ? (
            <img
              src={meta.thumbnailUrl}
              alt={meta.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <ThumbPlaceholder />
          )}
        </div>

        <div style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 19,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            display: 'grid', placeItems: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <Icon name="play" size={14} stroke="#fff" />
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 6, right: 6,
          background: 'rgba(0,0,0,0.65)', padding: '2px 6px', borderRadius: 4,
          fontFamily: T.mono, fontSize: 10.5, color: '#fff',
        }}>
          {fmtTime(meta.durationSecs)}
        </div>
      </div>

      {/* Meta + trim */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.text, lineHeight: 1.3, marginBottom: 6 }}>
          {meta.title}
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: T.text }}>{meta.channel}</span>
          <span>·</span>
          <span>{meta.views}</span>
          <span>·</span>
          <span>{meta.uploadDate}</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <TrimSlider trim={trim} durationSecs={meta.durationSecs} onChange={onTrimChange} />
        </div>
      </div>
    </div>
  );
}

function ThumbPlaceholder() {
  return (
    <svg width="216" height="122" viewBox="0 0 216 122" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b2a4d" />
          <stop offset="55%" stopColor="#c75a3a" />
          <stop offset="100%" stopColor="#f1b86a" />
        </linearGradient>
      </defs>
      <rect width="216" height="122" fill="url(#sky)" />
      <circle cx="153" cy="63" r="15" fill="#ffd58a" opacity="0.95" />
      <path d="M0 84 L26 70 L52 80 L84 63 L119 78 L149 65 L181 82 L216 71 L216 122 L0 122 Z" fill="#5b3a4a" opacity="0.7" />
      <path d="M0 100 L32 86 L67 97 L99 80 L134 93 L168 84 L203 97 L216 90 L216 122 L0 122 Z" fill="#2a1520" />
    </svg>
  );
}
