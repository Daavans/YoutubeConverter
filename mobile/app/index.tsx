import React from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FORMATS, QUALITIES_VIDEO, QUALITIES_AUDIO, AUDIO_FORMAT_IDS, isValidYouTubeUrl } from '@yoink/shared';

const T = {
  bg:     '#0e1014', panel:  '#16191f', border: 'rgba(255,255,255,0.06)',
  text:   '#e7e9ee', muted:  '#8a8f9c', faint:  '#5b6070',
  accent: '#c8ff3a', mono:   'monospace',
};

export default function HomeScreen() {
  const [url, setUrl] = React.useState('');
  const [fmt, setFmt] = React.useState('mp4');
  const [quality, setQuality] = React.useState('1080p');
  const [stage, setStage] = React.useState<'idle' | 'ready'>('idle');

  const isAudio = AUDIO_FORMAT_IDS.has(fmt);
  const qualities = isAudio ? [...QUALITIES_AUDIO] : [...QUALITIES_VIDEO];

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setUrl(text.trim());
    if (isValidYouTubeUrl(text?.trim() ?? '')) setStage('ready');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.container}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>What are we{'\n'}yoinking today?</Text>
            <Text style={[s.sub, { color: T.muted }]}>Drop a link from any video site below.</Text>
          </View>
        </View>

        {/* URL input */}
        <View style={s.inputRow}>
          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="Paste a video link…"
            placeholderTextColor={T.faint}
            autoCapitalize="none"
            autoCorrect={false}
            style={[s.input, { color: T.text, fontFamily: T.mono }]}
          />
          <TouchableOpacity onPress={handlePaste} style={s.pasteBtn}>
            <Text style={{ color: T.text, fontSize: 12 }}>Paste</Text>
          </TouchableOpacity>
        </View>

        {/* Format chips */}
        {stage === 'ready' && (
          <>
            <Text style={s.sectionLabel}>FORMAT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll}>
              {FORMATS.map((f) => {
                const active = f.id === fmt;
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => {
                      setFmt(f.id);
                      setQuality(AUDIO_FORMAT_IDS.has(f.id) ? '320 kbps' : '1080p');
                    }}
                    style={[s.chip, active && s.chipActive]}
                  >
                    <Text style={[s.chipLabel, { color: active ? T.accent : T.text }]}>{f.label}</Text>
                    <Text style={[s.chipSub, { color: T.muted }]}>{f.sub.split('·')[0].trim()}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Quality grid */}
            <Text style={s.sectionLabel}>{isAudio ? 'BITRATE' : 'RESOLUTION'}</Text>
            <View style={s.qualityGrid}>
              {qualities.map((q) => {
                const active = q === quality;
                return (
                  <TouchableOpacity key={q} onPress={() => setQuality(q)} style={[s.qBtn, active && s.qBtnActive]}>
                    <Text style={[s.qLabel, { color: active ? T.accent : T.text }]}>{q}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Convert button */}
        {stage === 'ready' && (
          <TouchableOpacity style={s.convertBtn}>
            <Text style={s.convertLabel}>Yoink as {fmt.toUpperCase()} · {quality}</Text>
          </TouchableOpacity>
        )}

        {stage === 'idle' && (
          <View style={s.emptyState}>
            <Text style={{ color: T.faint, fontSize: 13, textAlign: 'center' }}>
              Paste a YouTube URL above to get started.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { padding: 20, paddingBottom: 120 },
  header:       { marginBottom: 20 },
  greeting:     { fontSize: 26, fontWeight: '700', color: '#e7e9ee', lineHeight: 32, marginBottom: 6 },
  sub:          { fontSize: 13 },
  inputRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16191f', borderRadius: 14, padding: 12, marginBottom: 20, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.06)', gap: 10 },
  input:        { flex: 1, fontSize: 13 },
  pasteBtn:     { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.04)' },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.8, color: '#5b6070', marginBottom: 10, marginTop: 4 },
  chipScroll:   { marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 20 },
  chip:         { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#16191f', marginRight: 8 },
  chipActive:   { borderColor: 'rgba(200,255,58,0.4)', backgroundColor: 'rgba(200,255,58,0.10)' },
  chipLabel:    { fontSize: 12.5, fontWeight: '600' },
  chipSub:      { fontSize: 9.5, marginTop: 2 },
  qualityGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  qBtn:         { flex: 1, minWidth: '30%', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 11, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#16191f', alignItems: 'center' },
  qBtnActive:   { borderColor: 'rgba(200,255,58,0.4)', backgroundColor: 'rgba(200,255,58,0.10)' },
  qLabel:       { fontSize: 13, fontWeight: '600' },
  convertBtn:   { backgroundColor: '#c8ff3a', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8, shadowColor: '#c8ff3a', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  convertLabel: { color: '#0e1014', fontSize: 15, fontWeight: '700' },
  emptyState:   { marginTop: 60, alignItems: 'center' },
});
