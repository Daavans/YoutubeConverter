import React from 'react';
import { T } from '../styles/tokens';
import { FORMATS } from '@yoink/shared';
import type { HistoryEntry, Stage } from '@yoink/shared';
import Icon from './Icon';
import Waveform from './Waveform';

interface RecentPanelProps {
  stage: Stage;
  progress: number;
  fmt: string;
  quality: string;
  history: HistoryEntry[];
}

export default function RecentPanel({ stage, progress, fmt, quality, history }: RecentPanelProps) {
  const format = FORMATS.find((f) => f.id === fmt) ?? FORMATS[0];

  return (
    <div style={{
      width: 320, flexShrink: 0, borderLeft: `1px solid ${T.border}`,
      padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 14,
      background: T.sidebar,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: T.text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="history" size={14} stroke={T.text} />
          Recent
        </div>
        <span style={{ fontSize: 11, color: T.muted }}>Today</span>
      </div>

      {/* In-progress card */}
      {stage === 'converting' && (
        <div style={{
          padding: 12, borderRadius: 12,
          background: T.accentBg, border: `1px solid rgba(200,255,58,0.25)`,
        }}>
          <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, letterSpacing: 0.8, marginBottom: 8 }}>
            ● IN PROGRESS
          </div>
          <Waveform bars={36} height={20} color={T.accent} />
          <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.muted, marginTop: 6 }}>
            {Math.floor(progress)}% · {format.label} · {quality}
          </div>
        </div>
      )}

      {/* History rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
        {history.length === 0 ? (
          <div style={{ fontSize: 12, color: T.faint, textAlign: 'center', marginTop: 24 }}>
            No conversions yet
          </div>
        ) : (
          history.slice(0, 20).map((entry) => (
            <HistoryRow key={entry.id} entry={entry} />
          ))
        )}
      </div>

      {/* Tip card */}
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
        <div style={{
          padding: 12, borderRadius: 10,
          background: 'rgba(255,255,255,0.03)', border: `1px dashed ${T.borderStrong}`,
        }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="sparkle" size={11} stroke={T.muted} />
            TIP
          </div>
          <div style={{ fontSize: 11.5, color: T.text, lineHeight: 1.4 }}>
            Press Enter after pasting a URL to start sniffing automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ entry }: { entry: HistoryEntry }) {
  const fmtId = entry.format.toLowerCase();
  const fmt = FORMATS.find((f) => f.id === fmtId) ?? FORMATS[0];
  const when = relativeTime(entry.completedAt);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px',
      borderRadius: 8, cursor: 'pointer',
    }}
    onClick={() => window.yoink?.file?.reveal(entry.outputPath)}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'rgba(255,255,255,0.05)', color: T.muted,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <Icon name={fmt.kind === 'audio' ? 'audio' : fmt.kind === 'image' ? 'image' : 'video'} size={16} stroke={T.muted} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, color: T.text, fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{entry.title}</div>
        <div style={{ fontSize: 10.5, color: T.muted, fontFamily: T.mono, marginTop: 2 }}>
          {entry.format} · {entry.quality} · {entry.sizeMB} MB · {when}
        </div>
      </div>
      <Icon name="check" size={13} stroke={T.accent} strokeWidth={2.2} />
    </div>
  );
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}
