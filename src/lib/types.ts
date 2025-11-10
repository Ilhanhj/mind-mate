export type Mood = 'happy' | 'sad' | 'anxious' | 'tired' | 'angry' | 'neutral';

export interface MoodLog {
  id: string;
  date: string;
  mood: Mood;
  intensity: number;
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number;
  imageUrl: string;
  imageHint: string;
}

export interface Tip {
    id: string;
    category: 'breathing' | 'reflection' | 'mindfulness' | 'gratitude' | 'self-care';
    text: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}
