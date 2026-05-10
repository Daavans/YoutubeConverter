export type Stage = 'idle' | 'sniffing' | 'ready' | 'converting' | 'done';
export type FormatKind = 'video' | 'audio' | 'image';

export interface Format {
  id: string;
  label: string;
  kind: FormatKind;
  sub: string;
}

export interface VideoMeta {
  title: string;
  channel: string;
  durationSecs: number;
  views: string;
  thumbnailUrl: string;
  uploadDate: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  format: string;
  quality: string;
  sizeMB: number;
  outputPath: string;
  completedAt: number;
}

export interface ConverterState {
  url: string;
  stage: Stage;
  fmt: string;
  quality: string;
  trim: [number, number];
  progress: number;
  meta: VideoMeta | null;
  outputPath: string | null;
  error: string | null;
}

export interface DownloadOpts {
  url: string;
  format: string;
  quality: string;
  trim: [number, number];
  outputDir: string;
  durationSecs: number;
}

export interface StorageInfo {
  usedGB: number;
  totalGB: number;
}
