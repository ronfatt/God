import { UserProfile, ReadingAnalysis } from '@/types/oracle';
import { BirthProfile, calculateProfileCompleteness } from '@/personal/birthProfile';
import { UserEntitlement } from '@/premium/entitlement';
import { TianjiWallet, createInitialWallet } from '@/premium/tokenWallet';
import { StreakState, DEFAULT_STREAK_REWARDS } from '@/ritual/streakEngine';
import { SharePrivacySettings, DEFAULT_SHARE_PRIVACY } from '@/sharing/sharePrivacy';

const USER_STORAGE_KEY = 'tianji_user_profile_v3';
const HISTORY_STORAGE_KEY = 'tianji_reading_history_v3';
const BIRTH_STORAGE_KEY = 'tianji_birth_profile_v3';
const WALLET_STORAGE_KEY = 'tianji_wallet_v3';
const STREAK_STORAGE_KEY = 'tianji_streak_v3';
const ENTITLEMENT_STORAGE_KEY = 'tianji_entitlement_v3';
const PRIVACY_STORAGE_KEY = 'tianji_privacy_v3';
const ONBOARDING_COMPLETED_KEY = 'tianji_onboarding_done';

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

export const DEFAULT_BIRTH_PROFILE: BirthProfile = {
  userId: 'user_tianji_01',
  nickname: '天机居士',
  birthDate: '1996-08-18',
  birthTime: '10:30',
  birthPlace: '浙江 · 杭州',
  gender: '坤造 (女)',
  zodiacAnimal: '鼠',
  zodiacElement: '水',
  birthYearElement: '水',
  profileCompleteness: 90,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_ENTITLEMENT: UserEntitlement = {
  tier: 'free',
  tierName: '缘起 · 基础版',
  features: ['daily_one', 'three_spread', 'history_7d'],
};

export const Storage = {
  // 1. User Profile & Data Migration (V1 -> V2 -> V3)
  getUser(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_USER;
    try {
      let data = localStorage.getItem(USER_STORAGE_KEY);
      if (!data) {
        // Try migrating from v1/v2 key
        data = localStorage.getItem('tianji_user_profile');
      }
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

  // 2. Birth Profile
  getBirthProfile(): BirthProfile {
    if (typeof window === 'undefined') return DEFAULT_BIRTH_PROFILE;
    try {
      const data = localStorage.getItem(BIRTH_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(BIRTH_STORAGE_KEY, JSON.stringify(DEFAULT_BIRTH_PROFILE));
        return DEFAULT_BIRTH_PROFILE;
      }
      return { ...DEFAULT_BIRTH_PROFILE, ...JSON.parse(data) };
    } catch {
      return DEFAULT_BIRTH_PROFILE;
    }
  },

  saveBirthProfile(profile: Partial<BirthProfile>): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getBirthProfile();
      const completeness = calculateProfileCompleteness(profile);
      const updated: BirthProfile = {
        ...current,
        ...profile,
        profileCompleteness: completeness,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(BIRTH_STORAGE_KEY, JSON.stringify(updated));

      // Also sync user profile
      const user = this.getUser();
      user.name = updated.nickname || user.name;
      user.birthDate = updated.birthDate || user.birthDate;
      user.birthTime = updated.birthTime || user.birthTime;
      user.birthPlace = updated.birthPlace || user.birthPlace;
      user.gender = updated.gender || user.gender;
      this.saveUser(user);
    } catch (e) {
      console.error('Failed to save birth profile', e);
    }
  },

  // 3. Onboarding Status
  isOnboardingCompleted(): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
  },

  setOnboardingCompleted(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  },

  // 4. Wallet & Tokens
  getWallet(): TianjiWallet {
    if (typeof window === 'undefined') return createInitialWallet(120);
    try {
      const data = localStorage.getItem(WALLET_STORAGE_KEY);
      if (!data) {
        const initial = createInitialWallet(this.getUser().tokens || 120);
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return createInitialWallet(120);
    }
  },

  saveWallet(wallet: TianjiWallet): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
      const user = this.getUser();
      user.tokens = wallet.balance;
      this.saveUser(user);
    } catch (e) {
      console.error('Failed to save wallet', e);
    }
  },

  consumeTokens(amount: number, reason = '起卦占验消耗'): boolean {
    const wallet = this.getWallet();
    if (wallet.balance < amount) return false;
    wallet.balance -= amount;
    wallet.lifetimeSpent += amount;
    wallet.transactions.unshift({
      id: 'tx_' + Date.now(),
      type: 'spend',
      amount,
      reason,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('zh-CN'),
    });
    this.saveWallet(wallet);
    return true;
  },

  addTokens(amount: number, reason = '签到或充值礼包'): void {
    const wallet = this.getWallet();
    wallet.balance += amount;
    wallet.lifetimeEarned += amount;
    wallet.transactions.unshift({
      id: 'tx_' + Date.now(),
      type: 'earn',
      amount,
      reason,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('zh-CN'),
    });
    this.saveWallet(wallet);
  },

  // 5. Entitlement & Subscription
  getEntitlement(): UserEntitlement {
    if (typeof window === 'undefined') return DEFAULT_ENTITLEMENT;
    try {
      const data = localStorage.getItem(ENTITLEMENT_STORAGE_KEY);
      if (!data) return DEFAULT_ENTITLEMENT;
      return JSON.parse(data);
    } catch {
      return DEFAULT_ENTITLEMENT;
    }
  },

  setEntitlement(entitlement: UserEntitlement): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(entitlement));
    } catch (e) {
      console.error('Failed to set entitlement', e);
    }
  },

  // 6. Streak State
  getStreak(): StreakState {
    if (typeof window === 'undefined') {
      return {
        currentStreak: 7,
        lastActiveDate: new Date().toISOString().split('T')[0],
        longestStreak: 12,
        rewards: DEFAULT_STREAK_REWARDS,
      };
    }
    try {
      const data = localStorage.getItem(STREAK_STORAGE_KEY);
      if (!data) {
        const init = {
          currentStreak: 7,
          lastActiveDate: new Date().toISOString().split('T')[0],
          longestStreak: 12,
          rewards: DEFAULT_STREAK_REWARDS,
        };
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(init));
        return init;
      }
      return JSON.parse(data);
    } catch {
      return {
        currentStreak: 7,
        lastActiveDate: new Date().toISOString().split('T')[0],
        longestStreak: 12,
        rewards: DEFAULT_STREAK_REWARDS,
      };
    }
  },

  saveStreak(state: StreakState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(state));
      const user = this.getUser();
      user.streak = state.currentStreak;
      this.saveUser(user);
    } catch (e) {
      console.error('Failed to save streak', e);
    }
  },

  // 7. Privacy Settings
  getSharePrivacy(): SharePrivacySettings {
    if (typeof window === 'undefined') return DEFAULT_SHARE_PRIVACY;
    try {
      const data = localStorage.getItem(PRIVACY_STORAGE_KEY);
      if (!data) return DEFAULT_SHARE_PRIVACY;
      return JSON.parse(data);
    } catch {
      return DEFAULT_SHARE_PRIVACY;
    }
  },

  saveSharePrivacy(settings: SharePrivacySettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save privacy settings', e);
    }
  },

  // 8. Card Collection
  addCollectedCards(cardIds: string[]): void {
    const user = this.getUser();
    const set = new Set([...user.collectedCardIds, ...cardIds]);
    user.collectedCardIds = Array.from(set);
    user.totalDraws = (user.totalDraws || 0) + 1;
    this.saveUser(user);
  },

  // 9. History
  getHistory(): ReadingAnalysis[] {
    if (typeof window === 'undefined') return [];
    try {
      let data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!data) {
        data = localStorage.getItem('tianji_reading_history');
      }
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
      const updated = [reading, ...history].slice(0, 100); // Keep last 100
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

      const cardIds = reading.cards.map((c) => c.cardId);
      this.addCollectedCards(cardIds);
    } catch (e) {
      console.error('Failed to save reading history', e);
    }
  },

  // 10. Daily Card Helper
  getDailyCard(): { cardId: string; date: string } | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('tianji_daily_card');
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
      localStorage.setItem('tianji_daily_card', JSON.stringify({ cardId, date: today }));
    } catch (e) {
      console.error('Failed to set daily card', e);
    }
  },

  // 11. Data Reset
  resetAllData(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      localStorage.removeItem(BIRTH_STORAGE_KEY);
      localStorage.removeItem(WALLET_STORAGE_KEY);
      localStorage.removeItem(STREAK_STORAGE_KEY);
      localStorage.removeItem(ENTITLEMENT_STORAGE_KEY);
      localStorage.removeItem(PRIVACY_STORAGE_KEY);
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem('tianji_daily_card');
      localStorage.removeItem('tianji_user_profile');
      localStorage.removeItem('tianji_reading_history');
    } catch (e) {
      console.error('Failed to reset data', e);
    }
  },
};
