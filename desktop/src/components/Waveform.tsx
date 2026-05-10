import React, { useEffect, useRef, useState, useMemo } from 'react';

interface WaveformProps {
  bars?: number;
  height?: number;
  color?: string;
  animated?: boolean;
  opacity?: number;
}

export default function Waveform({ bars = 48, height = 36, color = '#c8ff3a', animated = true, opacity = 1 }: WaveformProps) {
  const seed = useMemo(() => Array.from({ length: bars }, (_, i) => {
    const r = Math.sin(i * 12.9898) * 43758.5453;
    return 0.25 + (r - Math.floor(r)) * 0.75;
  }), [bars]);

  const [t, setT] = useState(0);
  const rafRef = useRef<number>();
  const startRef = useRef<number>();

  useEffect(() => {
    if (!animated) return;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      setT((ts - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animated]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height, opacity }}>
      {seed.map((s, i) => {
        const wave = animated ? (0.6 + 0.4 * Math.sin(t * 3 + i * 0.4)) : 1;
        const h = Math.max(2, height * s * wave);
        return <div key={i} style={{ width: 2, height: h, borderRadius: 1, background: color }} />;
      })}
    </div>
  );
}
