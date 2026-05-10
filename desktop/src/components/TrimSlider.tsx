import React, { useRef, useMemo } from 'react';
import { T } from '../styles/tokens';
import { fmtTime } from '@yoink/shared';

interface TrimSliderProps {
  trim: [number, number];
  durationSecs: number;
  onChange: (trim: [number, number]) => void;
}

export default function TrimSlider({ trim, durationSecs, onChange }: TrimSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<'a' | 'b' | null>(null);

  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const r = Math.sin(i * 12.9898) * 43758.5453;
    return 0.25 + (r - Math.floor(r)) * 0.75;
  }), []);

  const onDown = (which: 'a' | 'b') => (e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = which;
    const move = (ev: PointerEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
      onChange(
        which === 'a'
          ? [Math.min(x, trim[1] - 0.05), trim[1]]
          : [trim[0], Math.max(x, trim[0] + 0.05)],
      );
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11, color: T.muted, marginBottom: 6,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
            <path d="m20 4-12 12"/><path d="m8 8 12 12"/>
          </svg>
          Trim
        </span>
        <span style={{ fontFamily: T.mono, color: T.text }}>
          {fmtTime(trim[0] * durationSecs)} → {fmtTime(trim[1] * durationSecs)}
        </span>
      </div>

      <div ref={ref} style={{ position: 'relative', height: 32, cursor: 'crosshair', userSelect: 'none' }}>
        {/* Bars */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
          {ticks.map((t, i) => {
            const p = i / ticks.length;
            const inRange = p >= trim[0] && p <= trim[1];
            return (
              <div key={i} style={{
                flex: 1, height: 22 * t, borderRadius: 1,
                background: inRange ? T.accent : 'rgba(255,255,255,0.10)',
              }} />
            );
          })}
        </div>

        {/* Handles */}
        {([0, 1] as const).map((i) => (
          <div key={i} onPointerDown={onDown(i === 0 ? 'a' : 'b')} style={{
            position: 'absolute', top: 0, bottom: 0, width: 10,
            left: `calc(${trim[i] * 100}% - 5px)`,
            background: T.text, borderRadius: 3, cursor: 'ew-resize',
            boxShadow: `0 0 0 2px ${T.bg}`,
          }} />
        ))}
      </div>
    </div>
  );
}
