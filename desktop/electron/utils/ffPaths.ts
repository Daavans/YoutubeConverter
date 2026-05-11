import path from 'path';

function inNodeModules(...parts: string[]): string {
  if (process.env.VITE_DEV_SERVER_URL) {
    // Dev: dist-electron/ → ../../node_modules/
    return path.join(__dirname, '../../node_modules', ...parts);
  }
  // Packaged: binaries are in app.asar.unpacked/node_modules/
  return path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', ...parts);
}

export function getFfmpegPath(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const raw: string = require('ffmpeg-static');
  return raw.replace(
    'app.asar' + path.sep,
    'app.asar.unpacked' + path.sep,
  );
}

export function getFfprobePath(): string {
  const ext = process.platform === 'win32' ? '.exe' : '';
  return inNodeModules(`@ffprobe-installer/${process.platform}-${process.arch}`, `ffprobe${ext}`);
}

export function getFfmpegDir(): string {
  return path.dirname(getFfmpegPath());
}

export function getYtDlpPath(): string {
  const ext = process.platform === 'win32' ? '.exe' : '';
  return inNodeModules('youtube-dl-exec', 'bin', `yt-dlp${ext}`);
}
