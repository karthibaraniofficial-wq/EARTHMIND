import { SimulationParameters } from '../../types';

export interface InvestigationSession {
  hotspotId: string;
  hotspotName: string;
  lastView: string;
  lastUpdated: string;
  notes: string[];
  lastParams?: SimulationParameters;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  hotspotId: string;
  timestamp: string;
}

const STORAGE_KEY_SESSIONS = 'earthmind_memory_sessions_v1';
const STORAGE_KEY_NOTES = 'earthmind_memory_notes_v1';

export class EarthMindMemoryService {
  static saveSession(session: InvestigationSession): void {
    try {
      const all = this.getAllSessions();
      const updated = [session, ...all.filter((s) => s.hotspotId !== session.hotspotId)];
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated.slice(0, 20)));
    } catch (e) {
      console.warn('Unable to persist EarthMind memory session', e);
    }
  }

  static getSession(hotspotId: string): InvestigationSession | null {
    const all = this.getAllSessions();
    return all.find((s) => s.hotspotId === hotspotId) || null;
  }

  static getAllSessions(): InvestigationSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (!raw) return [];
      return JSON.parse(raw) as InvestigationSession[];
    } catch {
      return [];
    }
  }

  static addNote(title: string, content: string, hotspotId: string): ResearchNote {
    const newNote: ResearchNote = {
      id: `NOTE-${Date.now()}`,
      title,
      content,
      hotspotId,
      timestamp: new Date().toISOString(),
    };

    try {
      const notes = this.getNotes();
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify([newNote, ...notes]));
    } catch (e) {
      console.warn('Unable to persist research note', e);
    }

    return newNote;
  }

  static getNotes(): ResearchNote[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NOTES);
      if (!raw) {
        return [
          {
            id: 'NOTE-INIT-01',
            title: 'Amazon Canopy Evapotranspiration Baseline',
            content: 'Southern arc fragmentations correlate directly with the delayed onset of the spring monsoon rain band.',
            hotspotId: 'amazon',
            timestamp: new Date().toISOString(),
          },
        ];
      }
      return JSON.parse(raw) as ResearchNote[];
    } catch {
      return [];
    }
  }

  static getLatestSession(): InvestigationSession | null {
    const all = this.getAllSessions();
    return all.length > 0 ? all[0] : null;
  }
}
