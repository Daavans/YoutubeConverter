const YOUTUBE_PATTERNS = [
  /youtube\.com\/watch\?.*v=/,
  /youtu\.be\//,
  /youtube\.com\/shorts\//,
  /youtube\.com\/playlist\?.*list=/,
];

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_PATTERNS.some((p) => p.test(url));
}

export function isPlaylistUrl(url: string): boolean {
  return /youtube\.com\/playlist\?.*list=/.test(url);
}
