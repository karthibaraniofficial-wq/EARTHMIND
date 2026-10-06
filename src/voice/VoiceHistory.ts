import { VoiceHistoryItem } from './VoiceTypes';

const HISTORY_STORAGE_KEY = 'earthmind_voice_history_v1';
const MAX_HISTORY_ITEMS = 100;

export function getVoiceHistory(): VoiceHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[EARTHMIND VOICE] Error reading voice history', e);
  }
  return [];
}

export function addVoiceHistoryItem(item: Omit<VoiceHistoryItem, 'id' | 'timestamp'>): VoiceHistoryItem {
  const newItem: VoiceHistoryItem = {
    ...item,
    id: `vh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };

  try {
    const list = getVoiceHistory();
    const updated = [newItem, ...list].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[EARTHMIND VOICE] Error saving voice history item', e);
  }

  return newItem;
}

export function clearVoiceHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.warn('[EARTHMIND VOICE] Error clearing voice history', e);
  }
}

export function exportVoiceHistoryJson(): string {
  const history = getVoiceHistory();
  return JSON.stringify(history, null, 2);
}

export function exportVoiceHistoryCsv(): string {
  const history = getVoiceHistory();
  if (history.length === 0) return 'ID,Timestamp,User Transcript,Intent,Confidence,Result,Response\n';

  const headers = ['ID', 'Timestamp', 'User Transcript', 'Intent', 'Confidence', 'Result', 'Response'];
  const rows = history.map((h) => [
    h.id,
    h.timestamp,
    `"${h.userTranscript.replace(/"/g, '""')}"`,
    h.recognizedIntent,
    h.confidence.toFixed(2),
    h.executionResult,
    `"${h.earthMindResponse.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
