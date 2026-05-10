import { execSync } from 'child_process';
import os from 'os';
import type { StorageInfo } from '../../../shared/src/types';

export function getStorage(): StorageInfo {
  try {
    const home = os.homedir();
    if (process.platform === 'win32') {
      const drive = home.slice(0, 2);
      const out = execSync(`wmic logicaldisk where "DeviceID='${drive}'" get FreeSpace,Size /format:csv`, {
        encoding: 'utf-8',
        timeout: 3000,
      });
      const lines = out.trim().split('\n').filter((l) => l.includes(','));
      const parts = lines[lines.length - 1].trim().split(',');
      if (parts.length >= 3) {
        const free = parseInt(parts[1]);
        const total = parseInt(parts[2]);
        return {
          usedGB: Math.round(((total - free) / 1e9) * 10) / 10,
          totalGB: Math.round((total / 1e9) * 10) / 10,
        };
      }
    } else {
      const out = execSync(`df -k "${home}"`, { encoding: 'utf-8', timeout: 3000 });
      const line = out.split('\n')[1];
      const parts = line.trim().split(/\s+/);
      const total = parseInt(parts[1]) * 1024;
      const used = parseInt(parts[2]) * 1024;
      return {
        usedGB: Math.round((used / 1e9) * 10) / 10,
        totalGB: Math.round((total / 1e9) * 10) / 10,
      };
    }
  } catch {}
  return { usedGB: 0, totalGB: 0 };
}
