import { create } from 'youtube-dl-exec';
import type { VideoMeta } from '../../../shared/src/types';
import { formatViews } from '../../../shared/src/formatters';
import { getYtDlpPath } from '../utils/ffPaths';

export async function fetchMetadata(url: string): Promise<VideoMeta> {
  const info = await create(getYtDlpPath())(url, {
    dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
  }) as Record<string, unknown>;

  return {
    title: String(info.title ?? 'Unknown title'),
    channel: String(info.uploader ?? info.channel ?? 'Unknown channel'),
    durationSecs: Number(info.duration ?? 0),
    views: formatViews(Number(info.view_count ?? 0)),
    thumbnailUrl: String(info.thumbnail ?? ''),
    uploadDate: formatUploadDate(String(info.upload_date ?? '')),
  };
}

function formatUploadDate(raw: string): string {
  if (!raw || raw.length !== 8) return '';
  const y = raw.slice(0, 4), m = raw.slice(4, 6), d = raw.slice(6, 8);
  const date = new Date(`${y}-${m}-${d}`);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
