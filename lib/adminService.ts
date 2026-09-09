import { supabase } from './supabase';
import { Storage } from './storage';
import { ORACLE_CARDS } from '@/data/cards';
import { UserProfile, ReadingAnalysis, SpreadType } from '@/types/oracle';

export interface AdminSystemConfig {
  welcomeTokens: number;
  spreadCost: number;
  dailyFreeLimit: number;
  announcementTitle: string;
  announcementContent: string;
  announcementActive: boolean;
  maintenanceMode: boolean;
}

export interface AdminUserRecord {
  id: string;
  username: string;
  nickname: string;
  tokens: number;
  totalDraws: number;
  streak: number;
  gender: string;
  birthDate: string;
  birthPlace: string;
  zodiac: string;
  mainElement: string;
  createdAt: string;
  email?: string;
}

export interface AdminOrderRecord {
  id: string;
  userId: string;
  username: string;
  productName: string;
  tokens: number;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
}

const ADMIN_STORAGE_SESSION_KEY = 'tianji_admin_session_v1';
const ADMIN_CONFIG_KEY = 'tianji_admin_system_config_v1';
const ADMIN_ORDERS_KEY = 'tianji_admin_orders_v1';

export const DEFAULT_ADMIN_CONFIG: AdminSystemConfig = {
  welcomeTokens: 150,
  spreadCost: 10,
  dailyFreeLimit: 3,
  announcementTitle: '甲辰龙年 · 天机显化',
  announcementContent: '天机52神谕系统全量开放，心财生玄四界能量充盈。',
  announcementActive: false,
  maintenanceMode: false,
};

export const AdminService = {
  // 1. Check Admin Session
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const session = localStorage.getItem(ADMIN_STORAGE_SESSION_KEY);
    return session === 'authenticated_tianji_master_2026';
  },

  // 2. Authenticate Admin
  login(passcode: string): boolean {
    // Standard management key for God_Poker Admin
    const validCodes = ['tianji888', 'god888', 'admin888', 'tianji2026'];
    if (validCodes.includes(passcode.trim())) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_SESSION_KEY, 'authenticated_tianji_master_2026');
      }
      return true;
    }
    return false;
  },

  // 3. Logout Admin
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_SESSION_KEY);
    }
  },

  // 4. Get System Configuration
  getSystemConfig(): AdminSystemConfig {
    if (typeof window === 'undefined') return DEFAULT_ADMIN_CONFIG;
    try {
      const stored = localStorage.getItem(ADMIN_CONFIG_KEY);
      if (stored) {
        return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse admin config:', e);
    }
    return DEFAULT_ADMIN_CONFIG;
  },

  // 5. Save System Configuration
  saveSystemConfig(config: AdminSystemConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save admin config:', e);
    }
  },

  // 6. Fetch All Registered Users (Supabase + Local fallback)
  async fetchUsers(): Promise<AdminUserRecord[]> {
    const isSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (isSupabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((row) => ({
            id: row.id,
            username: row.username || '道友',
            nickname: row.nickname || row.username || '天机道友',
            tokens: row.tokens ?? 150,
            totalDraws: row.total_draws ?? 0,
            streak: row.streak ?? 1,
            gender: row.gender || '坤造 (女)',
            birthDate: row.birth_date || '1996-08-18',
            birthPlace: row.birth_place || '吉隆坡 (Kuala Lumpur)',
            zodiac: row.zodiac || '丙子鼠',
            mainElement: row.main_element || 'water',
            createdAt: row.created_at || new Date().toISOString(),
            email: `${row.username || 'user'}@tianji.me`,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch profiles from Supabase, falling back to local storage:', err);
      }
    }

    // Fallback: local active user & sample data
    const localUser = Storage.getUser();
    const list: AdminUserRecord[] = [];

    if (localUser && localUser.account?.isRegistered) {
      list.push({
        id: localUser.id || 'u-local',
        username: localUser.account.username,
        nickname: localUser.name,
        tokens: localUser.tokens ?? 150,
        totalDraws: localUser.totalDraws ?? 0,
        streak: localUser.streak ?? 1,
        gender: localUser.gender || '坤造 (女)',
        birthDate: localUser.birthDate || '1996-08-18',
        birthPlace: localUser.birthPlace || '吉隆坡 (Kuala Lumpur)',
        zodiac: localUser.zodiac || '丙子鼠',
        mainElement: localUser.mainElement || 'water',
        createdAt: localUser.account.registeredAt || new Date().toISOString(),
        email: localUser.account.email,
      });
    }

    // Seed mock items if empty
    if (list.length === 0) {
      list.push(
        {
          id: 'u-1',
          username: 'ronfatt',
          nickname: '天机掌教',
          tokens: 150,
          totalDraws: 18,
          streak: 5,
          gender: '乾造 (男)',
          birthDate: '1988-06-12',
          birthPlace: '吉隆坡 (Kuala Lumpur)',
          zodiac: '戊辰龙',
          mainElement: 'wood',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          email: 'ronfatt@tianji.me',
        },
        {
          id: 'u-2',
          username: 'lingxi_99',
          nickname: '灵犀子',
          tokens: 280,
          totalDraws: 34,
          streak: 12,
          gender: '坤造 (女)',
          birthDate: '1995-11-20',
          birthPlace: '槟城 (Penang)',
          zodiac: '乙亥猪',
          mainElement: 'fire',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          email: 'lingxi@tianji.me',
        }
      );
    }

    return list;
  },

  // 7. Adjust User Tokens
  async adjustUserTokens(userId: string, deltaTokens: number, reason: string): Promise<{ success: boolean; message: string; newTokens?: number }> {
    try {
      // 1. If Supabase configured, update Supabase
      const isSupabase = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      let updatedTokens = 150;

      if (isSupabase) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tokens')
          .eq('id', userId)
          .single();

        const currentTokens = profile?.tokens ?? 150;
        updatedTokens = Math.max(0, currentTokens + deltaTokens);

        await supabase
          .from('profiles')
          .update({ tokens: updatedTokens })
          .eq('id', userId);
      }

      // 2. Also check if local user matches and update local storage
      const localUser = Storage.getUser();
      if (localUser && (localUser.id === userId || localUser.account?.id === userId)) {
        const currentTokens = localUser.tokens ?? 150;
        updatedTokens = Math.max(0, currentTokens + deltaTokens);
        localUser.tokens = updatedTokens;
        Storage.saveUser(localUser);

        // Update wallet
        const wallet = Storage.getWallet();
        wallet.balance = updatedTokens;
        if (!wallet.transactions) wallet.transactions = [];
        wallet.transactions.unshift({
          id: `tx-admin-${Date.now()}`,
          type: deltaTokens >= 0 ? 'earn' : 'spend',
          amount: Math.abs(deltaTokens),
          reason: `【天机司总枢调配】${reason || (deltaTokens >= 0 ? '管理员增发' : '管理员核扣')}`,
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('zh-CN'),
        });
        Storage.saveWallet(wallet);
      }

      return {
        success: true,
        message: `成功为用户调配灵石：${deltaTokens > 0 ? '+' : ''}${deltaTokens}（当前结余: ${updatedTokens} 灵石）`,
        newTokens: updatedTokens,
      };
    } catch (e: any) {
      return { success: false, message: e.message || '灵石调配失败' };
    }
  },

  // 8. Fetch All Divination Readings
  async fetchReadings(): Promise<ReadingAnalysis[]> {
    const isSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (isSupabase) {
      try {
        const { data, error } = await supabase
          .from('readings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          return data.map((row) => ({
            id: row.id,
            date: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
            timestamp: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
            question: row.question || '所问何事',
            category: row.category || 'wealth',
            spreadType: (row.spread_type as SpreadType) || 'three',
            cards: Array.isArray(row.cards)
              ? row.cards.map((c: any, i: number) => ({
                  positionId: c.positionId || `pos-${i + 1}`,
                  cardId: c.cardId || c.id || 'H-A',
                }))
              : [],
            overallScore: row.overall_score || 85,
            wealthScore: row.wealth_score || 80,
            careerScore: row.career_score || 80,
            loveScore: row.love_score || 80,
            noblemanScore: row.nobleman_score || 80,
            oracleQuote: row.oracle_quote || '天道酬勤，潜龙勿用。',
            elementTrend: typeof row.element_trend === 'object' && row.element_trend !== null ? row.element_trend : {
              sequence: ['wood', 'fire'],
              interaction: 'harmonious',
              description: String(row.element_trend || '五行和顺'),
            },
            dominantElement: row.dominant_element || 'fire',
            actionAdvices: Array.isArray(row.action_advices)
              ? (row.action_advices.slice(0, 3) as [string, string, string])
              : ['静待时机', '积聚力量', '随遇而安'],
            timeline: { near: '', mid: '', far: '' },
            luckyElements: { color: '', direction: '', time: '', element: '', number: 8 },
            overallManifestation: row.overall_manifestation,
          }));
        }
      } catch (err) {
        console.warn('Fetch readings warning:', err);
      }
    }

    // Fallback: local readings
    const local = Storage.getHistory();
    if (local && local.length > 0) {
      return local;
    }

    // Sample readings
    return [
      {
        id: 'rd-demo-1',
        date: new Date().toISOString().slice(0, 10),
        timestamp: Date.now() - 3600000 * 2,
        question: '今年下半年商业拓展与财运契机如何？',
        category: 'wealth',
        spreadType: 'three' as SpreadType,
        cards: [
          { positionId: 'pos-1', cardId: ORACLE_CARDS[0].id },
          { positionId: 'pos-2', cardId: ORACLE_CARDS[13].id },
          { positionId: 'pos-3', cardId: ORACLE_CARDS[26].id },
        ],
        overallScore: 92,
        wealthScore: 95,
        careerScore: 88,
        loveScore: 78,
        noblemanScore: 90,
        oracleQuote: '天地交泰，商机蕴于东方木火之际。',
        elementTrend: {
          sequence: ['wood', 'fire'],
          interaction: 'generate',
          description: '木火相生 · 财运亨通',
        },
        dominantElement: 'fire',
        actionAdvices: ['主动出击开辟新版图', '与南方或属火行业的贵人合谋', '修持心念以定大局'],
        timeline: { near: '一月内有萌动', mid: '季内成型', far: '年终大成' },
        luckyElements: { color: '赤红/金黄', direction: '正南', time: '巳午时', element: '火', number: 9 },
      },
    ];
  },

  // 9. Fetch Orders / Recharge Transactions
  fetchOrders(): AdminOrderRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ADMIN_ORDERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(e);
    }

    // Default sample orders
    return [
      {
        id: 'ord-88910',
        userId: 'u-1',
        username: 'ronfatt',
        productName: '【上善若水】灵石福袋 (100灵石)',
        tokens: 100,
        amount: 28.0,
        currency: 'MYR',
        status: 'paid',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: 'ord-88909',
        userId: 'u-2',
        username: 'lingxi_99',
        productName: '【紫气东来】灵石至尊包 (500灵石)',
        tokens: 500,
        amount: 128.0,
        currency: 'MYR',
        status: 'paid',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  },

  // 10. Compute Overview KPIs
  async getOverviewKPIs() {
    const users = await this.fetchUsers();
    const readings = await this.fetchReadings();
    const orders = this.fetchOrders();

    const totalUsers = users.length;
    const totalDraws = readings.length + users.reduce((acc, u) => acc + (u.totalDraws || 0), 0);
    const totalTokensInCirculation = users.reduce((acc, u) => acc + (u.tokens || 0), 0);
    const totalRevenue = orders
      .filter((o) => o.status === 'paid')
      .reduce((acc, o) => acc + o.amount, 0);

    const threeCardDraws = readings.filter((r) => r.spreadType === 'three' || (r.spreadType as any) === 'three_card').length;
    const oneCardDraws = readings.filter((r) => r.spreadType === 'one' || (r.spreadType as any) === 'single').length;

    return {
      totalUsers,
      totalDraws,
      totalTokensInCirculation,
      totalRevenue,
      threeCardDraws,
      oneCardDraws,
      totalCards: ORACLE_CARDS.length,
    };
  },
};
