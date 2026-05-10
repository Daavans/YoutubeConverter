import { app, BrowserWindow, ipcMain, shell, dialog, clipboard } from 'electron';
import path from 'path';
import { fetchMetadata } from './services/metadata';
import { startDownload, cancelDownload } from './services/downloader';
import { getHistory, addHistory, clearHistory } from './services/history';
import { getStorage } from './services/storage';

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    backgroundColor: '#0e1014',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // FFmpeg check
  const { execSync } = require('child_process');
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch {
    dialog.showErrorBox(
      'FFmpeg Not Found',
      'FFmpeg was not found in your PATH.\n\nInstall it:\n  Windows: https://ffmpeg.org/download.html\n  macOS: brew install ffmpeg\n  Linux: sudo apt install ffmpeg',
    );
    app.quit();
    return;
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ─── Window controls ───────────────────────────────────────────────────────
ipcMain.handle('window:minimize', () => win?.minimize());
ipcMain.handle('window:maximize', () => {
  if (win?.isMaximized()) win.unmaximize();
  else win?.maximize();
});
ipcMain.handle('window:close', () => win?.close());
ipcMain.handle('window:isMaximized', () => win?.isMaximized() ?? false);

// ─── Metadata ──────────────────────────────────────────────────────────────
ipcMain.handle('metadata:fetch', async (_e, url: string) => {
  return fetchMetadata(url);
});

// ─── Download ──────────────────────────────────────────────────────────────
ipcMain.handle('download:start', async (_e, opts) => {
  return startDownload(opts, (event, data) => {
    win?.webContents.send(event, data);
  });
});
ipcMain.handle('download:cancel', () => cancelDownload());

// ─── History ───────────────────────────────────────────────────────────────
ipcMain.handle('history:get', () => getHistory());
ipcMain.handle('history:add', (_e, entry) => addHistory(entry));
ipcMain.handle('history:clear', () => clearHistory());

// ─── Storage ───────────────────────────────────────────────────────────────
ipcMain.handle('storage:get', () => getStorage());

// ─── File ops ──────────────────────────────────────────────────────────────
ipcMain.handle('file:reveal', (_e, filePath: string) => {
  shell.showItemInFolder(filePath);
});
ipcMain.handle('file:chooseDir', async () => {
  const result = await dialog.showOpenDialog(win!, {
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

// ─── System ────────────────────────────────────────────────────────────────
ipcMain.handle('system:platform', () => process.platform);
ipcMain.handle('clipboard:read', () => clipboard.readText());
