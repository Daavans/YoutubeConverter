import { useState, useEffect, useCallback } from 'react';
import type { HistoryEntry } from '@yoink/shared';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const load = useCallback(async () => {
    try {
      const entries = await window.yoink.history.get();
      setHistory(entries);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = useCallback(() => load(), [load]);

  return { history, refresh };
}
