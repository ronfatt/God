import { UserProfile, ReadingAnalysis } from '@/types/oracle';

const USER_STORAGE_KEY = 'tianji_user_profile';
const HISTORY_STORAGE_KEY = 'tianji_reading_history';
const DAILY_CARD_KEY = 'tianji_daily_card';

export const DEFAULT_USER: UserProfile = {
  name: '天机居士',
  avatar: '☯',
  tokens: 120,
  streak: 7,
  totalDraws: 14,
  birthDate: '1996-08-18',
  birthTime: '10:30',
  gender: '坤造 (女)',
  birthPlace: '浙江 · 杭州',
  zodiac: '丙子鼠',
  mainElement: 'water',
  collectedCardIds: [
    'H-A', 'H-Q', 'H-2', 'H-9',
    'D-A', 'D-3', 'D-5', 'D-K',
    'C-A', 'C-2', 'C-9', 'C-K',
    'S-A', 'S-3', 'S-4', 'S-Q', 'S-K'
  ],
};

export const Storage = {
  getUser(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_USER;
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
        return DEFAULT_USER;
      }
      return { ...DEFAULT_USER, ...JSON.parse(data) };
    } catch {
      return DEFAULT_USER;
    }
  },

  saveUser(user: UserProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },

  consumeTokens(amount: number): boolean {
    const user = this.getUser();
    if (user.tokens < amount) return false;
    user.tokens -= amount;
    this.saveUser(user);
    return true;
  },

  addCollectedCards(cardIds: string[]): void {
    const user = this.getUser();
    const set = new Set([...user.collectedCardIds, ...cardIds]);
    user.collectedCardIds = Array.from(set);
    user.totalDraws = (user.totalDraws || 0) + 1;
    this.saveUser(user);
  },

  getHistory(): ReadingAnalysis[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveReading(reading: ReadingAnalysis): void {
    if (typeof window === 'undefined') return;
    try {
      const history = this.getHistory();
      const updated = [reading, ...history].slice(0, 50); // Keep last 50
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

      // Also mark collected cards
      const cardIds = reading.cards.map((c) => c.cardId);
      this.addCollectedCards(cardIds);
    } catch (e) {
      console.error('Failed to save reading history', e);
    }
  },

  getDailyCard(): { cardId: string; date: string } | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(DAILY_CARD_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setDailyCard(cardId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(DAILY_CARD_KEY, JSON.stringify({ cardId, date: today }));
    } catch (e) {
      console.error('Failed to set daily card', e);
    }
  },
};
