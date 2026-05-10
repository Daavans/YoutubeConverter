import React, { useEffect, useState } from 'react';
import { T } from '../styles/tokens';

export default function Titlebar() {
  const [platform, setPlatform] = useState('win32');

  useEffect(() => {
    window.yoink.system.platform().then(setPlatform).catch(() => {});
  }, []);

  const isMac = platform === 'darwin';

  return (
    <div style={{
      height: 40, flexShrink: 0, display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: 14,
      borderBottom: `1px solid ${T.border}`,
      background: 'linear-gradient(180deg, #1a1d24 0%, #14171d 100%)',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      WebkitAppRegion: 'drag',
    } as React.CSSProperties}>
      {isMac && <div style={{ width: 60 }} />}

      {/* Logo + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <YoinkMark size={18} />
        <span style={{ fontSize: 12.5, letterSpacing: 0.5, fontWeight: 600, color: T.text }}>YOINK</span>
        <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.faint, marginLeft: 4 }}>v0.1.0</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Status + Windows controls */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        color: T.muted, fontSize: 12,
        WebkitAppRegion: 'no-drag',
      } as React.CSSProperties}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.accent, boxShadow: `0 0 8px ${T.accent}` }} />
          Online
        </span>

        {!isMac && (
          <div style={{ display: 'flex', gap: 0, marginLeft: 8 }}>
            {[
              { action: () => window.yoink.window.minimize(), label: '–', hover: T.borderStrong },
              { action: () => window.yoink.window.maximize(), label: '□', hover: T.borderStrong },
              { action: () => window.yoink.window.close(),    label: '×', hover: '#c42b2b' },
            ].map(({ action, label, hover }) => (
              <button key={label} onClick={action} style={{
                width: 46, height: 40, border: 'none', background: 'transparent',
                color: T.muted, fontSize: 16, lineHeight: 1, cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >{label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function YoinkMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block' }}>
      <rect x="0" y="0" width="40" height="40" rx="11" fill="#16181d" />
      <path d="M11 11 L20 22 L29 11" stroke={T.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 22 L20 30" stroke={T.accent} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="32.5" r="1.8" fill={T.accent} />
    </svg>
  );
}
