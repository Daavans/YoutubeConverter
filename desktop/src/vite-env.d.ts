/// <reference types="vite/client" />

interface Window {
  yoink: {
    metadata: { fetch(url: string): Promise<import('@yoink/shared').VideoMeta> };
    download: {
      start(opts: import('@yoink/shared').DownloadOpts): void;
      cancel(): void;
      onProgress(cb: (data: unknown) => void): () => void;
      onDone(cb: (data: unknown) => void): () => void;
      onError(cb: (msg: string) => void): () => void;
    };
    history: {
      get(): Promise<import('@yoink/shared').HistoryEntry[]>;
      add(e: import('@yoink/shared').HistoryEntry): Promise<void>;
      clear(): Promise<void>;
    };
    storage: { get(): Promise<import('@yoink/shared').StorageInfo> };
    file: { reveal(path: string): void; chooseDir(): Promise<string | null> };
    window: { minimize(): void; maximize(): void; close(): void; isMaximized(): Promise<boolean> };
    system: { platform(): Promise<string> };
    clipboard: { read(): Promise<string> };
  };
}
