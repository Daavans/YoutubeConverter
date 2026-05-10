import React from 'react';
import { T } from '../styles/tokens';
import Icon from './Icon';

interface LinkInputProps {
  url: string;
  stage: string;
  onChange: (url: string) => void;
  onPaste: () => void;
}

export default function LinkInput({ url, stage, onChange, onPaste }: LinkInputProps) {
  const handlePaste = async () => {
    try {
      const text = await window.yoink.clipboard.read();
      if (text) onChange(text.trim());
    } catch {
      // fallback — just trigger the sniff with current url
    }
    onPaste();
  };

  return (
    <div style={{
      borderRadius: T.r14, background: T.panel, border: `1px solid ${T.border}`,
      padding: 14, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center',
        color: T.muted,
      }}>
        <Icon name="link" size={17} stroke={T.muted} />
      </div>

      <input
        value={url}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onPaste(); }}
        placeholder="Paste a video link…"
        spellCheck={false}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: T.text, fontSize: 15, fontFamily: T.mono, letterSpacing: 0.1,
        }}
      />

      {stage === 'sniffing' && (
        <span style={{ color: T.muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Spinner accent={T.accent} />
          Sniffing metadata…
        </span>
      )}

      <button onClick={handlePaste} style={{
        padding: '8px 14px', borderRadius: 9, border: `1px solid ${T.borderStrong}`,
        background: 'rgba(255,255,255,0.04)', color: T.text, fontFamily: T.font,
        fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name="paste" size={13} stroke={T.text} />
        Paste
      </button>
    </div>
  );
}

function Spinner({ accent }: { accent: string }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 12, height: 12, borderRadius: 6,
      border: `2px solid ${accent}`, borderTopColor: 'transparent',
      animation: 'ykspin 0.9s linear infinite',
    }} />
  );
}
