import React, { useEffect } from 'react';
import { T } from './styles/tokens';
import { useConverter } from './hooks/useConverter';
import { useHistory } from './hooks/useHistory';
import Titlebar from './components/Titlebar';
import Sidebar from './components/Sidebar';
import LinkInput from './components/LinkInput';
import VideoCard from './components/VideoCard';
import FormatPicker from './components/FormatPicker';
import QualityPicker from './components/QualityPicker';
import ConvertBar from './components/ConvertBar';
import RecentPanel from './components/RecentPanel';

export default function App() {
  const { state, setUrl, setFormat, setQuality, setTrim, sniff, convert, cancel, reset, reveal } = useConverter();
  const { history, refresh } = useHistory();
  const [activeView, setActiveView] = React.useState('new');

  // Refresh history when a conversion completes
  useEffect(() => {
    if (state.stage === 'done') refresh();
  }, [state.stage, refresh]);

  // Show error as alert
  useEffect(() => {
    if (state.error) alert(state.error);
  }, [state.error]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: T.bg, color: T.text,
      fontFamily: T.font,
    }}>
      <Titlebar />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Main column */}
        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0, overflowY: 'auto' }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>New conversion</div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 4 }}>Paste a link, pick a format, hit convert.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: T.muted }}>
              <span style={{ fontFamily: T.mono }}>↵</span>
              <span>to sniff after pasting</span>
            </div>
          </div>

          <LinkInput
            url={state.url}
            stage={state.stage}
            onChange={setUrl}
            onPaste={() => sniff()}
          />

          {(state.stage === 'ready' || state.stage === 'converting' || state.stage === 'done') && state.meta && (
            <VideoCard meta={state.meta} trim={state.trim} onTrimChange={setTrim} />
          )}

          {state.stage !== 'idle' && state.stage !== 'sniffing' && (
            <div style={{ display: 'flex', gap: 14 }}>
              <FormatPicker selected={state.fmt} onChange={setFormat} />
              <QualityPicker selected={state.quality} format={state.fmt} onChange={setQuality} />
            </div>
          )}

          <div style={{ flex: 1 }} />

          <ConvertBar
            stage={state.stage}
            fmt={state.fmt}
            quality={state.quality}
            progress={state.progress}
            durationSecs={state.meta?.durationSecs ?? 0}
            outputPath={state.outputPath}
            onConvert={convert}
            onCancel={cancel}
            onReveal={reveal}
            onReset={reset}
          />

          <style>{`
            @keyframes ykspin { to { transform: rotate(360deg); } }
          `}</style>
        </div>

        <RecentPanel
          stage={state.stage}
          progress={state.progress}
          fmt={state.fmt}
          quality={state.quality}
          history={history}
        />
      </div>
    </div>
  );
}
