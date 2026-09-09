import { UserProfile, ReadingAnalysis, UserAccount } from '@/types/oracle';
import { BirthProfile, calculateProfileCompleteness, calculateZodiacFromBirthDate } from '@/personal/birthProfile';
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
const ACCOUNTS_STORAGE_KEY = 'tianji_registered_accounts_v4';
const CURRENT_USER_ID_KEY = 'tianji_current_user_id';
const DAILY_ONE_CARD_KEY = 'tianji_daily_one_card_usage_v1';
export const MAX_DAILY_ONE_CARD_DRAWS = 3;

export const DEFAULT_USER: UserProfile = {
  name: '随喜居士',
  avatar: '☯',
  tokens: 0, // Unregistered guest starts with 0. Registering grants 150 one-time welcome tokens!
  streak: 1,
  totalDraws: 0,
  birthDate: '1996-08-18',
  birthTime: '10:30',
  gender: '坤造 (女)',
  birthPlace: '吉隆坡 (Kuala Lumpur)',
  zodiac: '丙子鼠',
  mainElement: 'water',
  collectedCardIds: ['H-A', 'D-A', 'C-A', 'S-A'],
};

export const DEFAULT_BIRTH_PROFILE: BirthProfile = {
  userId: 'user_tianji_01',
  nickname: '随喜居士',
  birthDate: '1996-08-18',
  birthTime: '10:30',
  birthPlace: '吉隆坡 (Kuala Lumpur)',
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
      window.dispatchEvent(new Event('storage'));
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

      if (updated.birthDate) {
        const { zodiac, zodiacAnimal, mainElement } = calculateZodiacFromBirthDate(updated.birthDate);
        updated.zodiacAnimal = zodiacAnimal;
        updated.zodiacElement = mainElement;
      }

      localStorage.setItem(BIRTH_STORAGE_KEY, JSON.stringify(updated));

      // Also sync user profile
      const user = this.getUser();
      user.name = updated.nickname || user.name;
      user.birthDate = updated.birthDate || user.birthDate;
      user.birthTime = updated.birthTime || user.birthTime;
      user.birthPlace = updated.birthPlace || user.birthPlace;
      user.gender = updated.gender || user.gender;
      if (updated.birthDate) {
        const { zodiac, mainElement } = calculateZodiacFromBirthDate(updated.birthDate);
        user.zodiac = zodiac;
        user.mainElement = mainElement;
      }
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
    if (typeof window === 'undefined') return createInitialWallet(0);
    try {
      const data = localStorage.getItem(WALLET_STORAGE_KEY);
      if (!data) {
        const user = this.getUser();
        const initial = createInitialWallet(user.tokens ?? 0);
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return createInitialWallet(0);
    }
  },

  saveWallet(wallet: TianjiWallet): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
      const user = this.getUser();
      user.tokens = wallet.balance;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('storage'));
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

  // 4.1 Daily One Card Limit Tracking (每日限 3 次)
  getDailyOneCardUsage(): { date: string; count: number } {
    if (typeof window === 'undefined') return { date: '', count: 0 };
    try {
      const today = new Date().toISOString().slice(0, 10);
      const data = localStorage.getItem(DAILY_ONE_CARD_KEY);
      if (!data) return { date: today, count: 0 };
      const parsed = JSON.parse(data);
      if (parsed.date !== today) {
        return { date: today, count: 0 };
      }
      return parsed;
    } catch {
      return { date: '', count: 0 };
    }
  },

  getDailyOneCardRemaining(): number {
    const usage = this.getDailyOneCardUsage();
    return Math.max(0, MAX_DAILY_ONE_CARD_DRAWS - (usage.count || 0));
  },

  canDrawOneCard(): boolean {
    return this.getDailyOneCardRemaining() > 0;
  },

  recordOneCardDraw(): boolean {
    if (typeof window === 'undefined') return true;
    try {
      const today = new Date().toISOString().slice(0, 10);
      const usage = this.getDailyOneCardUsage();
      const newCount = (usage.date === today ? (usage.count || 0) : 0) + 1;
      localStorage.setItem(DAILY_ONE_CARD_KEY, JSON.stringify({ date: today, count: newCount }));
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch {
      return false;
    }
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

  // 11. Member Accounts & Multi-User System
  getAllAccounts(): UserAccount[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  registerAccount(params: {
    username: string;
    email?: string;
    phone?: string;
    password?: string;
    nickname?: string;
    birthDate?: string;
    gender?: string;
  }): { success: boolean; message: string; user?: UserProfile } {
    if (typeof window === 'undefined') return { success: false, message: '环境异常' };
    try {
      const accounts = this.getAllAccounts();
      const cleanUsername = params.username.trim();

      if (accounts.some((a) => a.username.toLowerCase() === cleanUsername.toLowerCase())) {
        return { success: false, message: '该道号/用户名已被注册，请直接登录' };
      }
      const trimmedEmail = params.email ? params.email.trim() : undefined;
      const trimmedPhone = params.phone ? params.phone.trim() : undefined;

      if (trimmedEmail && accounts.some((a) => a.email === trimmedEmail)) {
        return { success: false, message: '该电子邮箱已被绑定' };
      }
      if (trimmedPhone && accounts.some((a) => a.phone === trimmedPhone)) {
        return { success: false, message: '该手机号码已被绑定' };
      }

      const newId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const newAccount: UserAccount = {
        id: newId,
        username: cleanUsername,
        email: params.email?.trim(),
        phone: params.phone?.trim(),
        passwordHash: params.password ? btoa(params.password) : undefined,
        isRegistered: true,
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      accounts.push(newAccount);
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      localStorage.setItem(CURRENT_USER_ID_KEY, newId);

      const newUserProfile: UserProfile = {
        id: newId,
        name: params.nickname || cleanUsername,
        avatar: '☯',
        tokens: 150, // One-time welcome registration bonus of 150 tokens!
        streak: 1,
        totalDraws: 0,
        birthDate: params.birthDate || '1996-08-18',
        birthTime: '10:30',
        gender: params.gender || '坤造 (女)',
        birthPlace: '吉隆坡 (Kuala Lumpur)',
        zodiac: '丙子鼠',
        mainElement: 'water',
        collectedCardIds: ['H-A', 'D-A', 'C-A', 'S-A'],
        account: newAccount,
      };

      const initWallet = createInitialWallet(150);
      this.saveWallet(initWallet);
      this.saveUser(newUserProfile);
      this.setOnboardingCompleted();
      return { success: true, message: '恭喜！天机缘籍已成功开辟，获赠150灵石', user: newUserProfile };
    } catch (e) {
      console.error(e);
      return { success: false, message: '注册失败，请稍后重试' };
    }
  },

  loginAccount(identifier: string, password?: string): { success: boolean; message: string; user?: UserProfile } {
    if (typeof window === 'undefined') return { success: false, message: '环境异常' };
    try {
      const accounts = this.getAllAccounts();
      const cleanId = identifier.trim().toLowerCase();

      const found = accounts.find(
        (a) =>
          a.username.toLowerCase() === cleanId ||
          (a.email && a.email.toLowerCase() === cleanId) ||
          (a.phone && a.phone === cleanId)
      );

      if (!found) {
        return { success: false, message: '未找到该缘籍账户，请先注册' };
      }

      if (found.passwordHash && password) {
        if (btoa(password) !== found.passwordHash) {
          return { success: false, message: '密码校验未通过，请核对' };
        }
      }

      found.lastLoginAt = new Date().toISOString();
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      localStorage.setItem(CURRENT_USER_ID_KEY, found.id);

      // Load or Create user profile for this user ID
      const userKey = `${USER_STORAGE_KEY}_${found.id}`;
      let userProfile = this.getUser();
      const savedUserStr = localStorage.getItem(userKey);
      if (savedUserStr) {
        userProfile = JSON.parse(savedUserStr);
      } else {
        userProfile = {
          ...userProfile,
          id: found.id,
          name: found.username,
          account: found,
        };
      }
      this.saveUser(userProfile);

      return { success: true, message: `欢迎归来，${userProfile.name}`, user: userProfile };
    } catch (e) {
      console.error(e);
      return { success: false, message: '登录失败，请重试' };
    }
  },

  logoutAccount(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(CURRENT_USER_ID_KEY);
      const guestUser: UserProfile = {
        ...DEFAULT_USER,
        name: '随喜访客',
        account: undefined,
      };
      this.saveUser(guestUser);
    } catch (e) {
      console.error('Logout error', e);
    }
  },

  isLoggedIn(): boolean {
    const user = this.getUser();
    return !!(user.account && user.account.isRegistered);
  },

  // 12. Data Reset
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
      localStorage.removeItem(CURRENT_USER_ID_KEY);
      localStorage.removeItem('tianji_daily_card');
      localStorage.removeItem('tianji_user_profile');
      localStorage.removeItem('tianji_reading_history');
    } catch (e) {
      console.error('Failed to reset data', e);
    }
  },
};
