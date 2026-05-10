import fs from 'fs';
import path from 'path';
import os from 'os';
import type { HistoryEntry } from '../../../shared/src/types';

const CONFIG_DIR = path.join(os.homedir(), '.yoink');
const HISTORY_FILE = path.join(CONFIG_DIR, 'history.json');

function ensureDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

export function getHistory(): HistoryEntry[] {
  ensureDir();
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistory(entry: HistoryEntry): void {
  ensureDir();
  const history = getHistory();
  history.unshift(entry);
  // Keep last 100 entries
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 100)), 'utf-8');
}

export function clearHistory(): void {
  ensureDir();
  fs.writeFileSync(HISTORY_FILE, '[]', 'utf-8');
}
