import youtubeDl from 'youtube-dl-exec';
import path from 'path';
import os from 'os';
import type { DownloadOpts } from '../../../shared/src/types';
import { AUDIO_FORMAT_IDS, QUALITY_FORMAT_MAP } from '../../../shared/src/constants';
import { isPlaylistUrl } from '../../../shared/src/validators';

type Emitter = (event: string, data: unknown) => void;

let activeProcess: { kill: () => void } | null = null;

export async function startDownload(opts: DownloadOpts, emit: Emitter): Promise<string> {
  const { url, format, quality, trim, outputDir, durationSecs } = opts;
  const isAudio = AUDIO_FORMAT_IDS.has(format);
  const isPlaylist = isPlaylistUrl(url);

  let ydlFormat: string;
  if (isAudio) {
    ydlFormat = 'bestaudio/best';
  } else {
    ydlFormat = QUALITY_FORMAT_MAP[quality] ?? 'bestvideo+bestaudio/best';
  }

  const postprocessors: Record<string, string>[] = [];
  if (isAudio) {
    postprocessors.push({ key: 'FFmpegExtractAudio', preferredcodec: format });
  } else if (format !== 'webm') {
    postprocessors.push({ key: 'FFmpegVideoConvertor', preferedformat: format });
  }

  const extraArgs: string[] = ['--no-warnings'];
  if (!isPlaylist) extraArgs.push('--no-playlist');

  // Trim args
  if (durationSecs > 0 && (trim[0] > 0 || trim[1] < 1)) {
    const startSecs = Math.floor(trim[0] * durationSecs);
    const endSecs = Math.floor(trim[1] * durationSecs);
    extraArgs.push('--download-sections', `*${startSecs}-${endSecs}`);
  }

  const outputPath = path.join(outputDir || os.homedir() + '/Downloads', '%(title)s.%(ext)s');
  let lastFile = '';

  const subprocess = youtubeDl.exec(url, {
    output: outputPath,
    format: ydlFormat,
    noCheckCertificates: true,
    noWarnings: true,
    quiet: false,
    noProgress: false,
    noPlaylist: !isPlaylist,
    addHeader: ['referer:youtube.com'],
  });

  activeProcess = subprocess;

  return new Promise((resolve, reject) => {
    let lastPct = 0;

    subprocess.stdout?.on('data', (chunk: Buffer) => {
      const line = chunk.toString();
      // Parse yt-dlp progress output
      const pctMatch = line.match(/(\d+\.?\d*)%/);
      if (pctMatch) {
        const pct = Math.min(99, parseFloat(pctMatch[1]));
        if (pct > lastPct) {
          lastPct = pct;
          const etaMatch = line.match(/ETA\s+(\S+)/);
          emit('download:progress', { pct, eta: etaMatch?.[1] ?? '' });
        }
      }
      const destMatch = line.match(/\[(?:download|Merger|ExtractAudio)\]\s+Destination:\s+(.+)/);
      if (destMatch) lastFile = destMatch[1].trim();
    });

    subprocess.on('close', (code: number | null) => {
      activeProcess = null;
      if (code === 0 || code === null) {
        emit('download:progress', { pct: 100, eta: '' });
        emit('download:done', { outputPath: lastFile });
        resolve(lastFile);
      } else {
        const err = 'Download failed or was cancelled';
        emit('download:error', err);
        reject(new Error(err));
      }
    });

    subprocess.on('error', (err: Error) => {
      activeProcess = null;
      emit('download:error', err.message);
      reject(err);
    });
  });
}

export function cancelDownload(): void {
  activeProcess?.kill();
  activeProcess = null;
}
