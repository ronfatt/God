import { supabase } from './supabase';
import { UserProfile, ReadingAnalysis } from '@/types/oracle';
import { BirthProfile, calculateZodiacFromBirthDate } from '@/personal/birthProfile';

/**
 * Supabase Cloud Service for Tianji 52
 * Provides real-time synchronization between LocalStorage and Supabase Cloud.
 */
export const SupabaseService = {
  // 1. Check if Supabase is connected & configured
  isConfigured(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  },

  // 2. User Sign Up (Supabase Auth + Profile row)
  async register(params: {
    username: string;
    email?: string;
    password?: string;
    nickname?: string;
    birthDate?: string;
    gender?: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Supabase 未配置' };
    }

    try {
      // Ensure email format for Supabase Auth (fallback to username@tianji.internal if empty)
      const userEmail = params.email && params.email.includes('@')
        ? params.email.trim()
        : `${params.username.trim().toLowerCase()}@tianji.me`;

      const userPassword = params.password || 'TianJi52_Pass_Auto';

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
          data: {
            username: params.username.trim(),
            nickname: params.nickname || params.username.trim(),
          },
        },
      });

      if (authError) {
        // If already registered, suggest login
        if (authError.message.includes('already registered')) {
          return { success: false, message: '该道号/邮箱已存在，请直接登录' };
        }
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: '注册异常，未返回用户' };
      }

      const { zodiac, mainElement } = calculateZodiacFromBirthDate(params.birthDate || '1996-08-18');

      // Upsert profile record
      const newProfile: Partial<UserProfile> = {
        id: authData.user.id,
        name: params.nickname || params.username.trim(),
        tokens: 150,
        streak: 1,
        totalDraws: 0,
        birthDate: params.birthDate || '1996-08-18',
        birthTime: '10:30',
        gender: params.gender || '坤造 (女)',
        birthPlace: '吉隆坡 (Kuala Lumpur)',
        zodiac,
        mainElement,
        collectedCardIds: ['H-A', 'D-A', 'C-A', 'S-A'],
      };

      try {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          username: params.username.trim(),
          nickname: newProfile.name,
          tokens: 150,
          streak: 1,
          birth_date: newProfile.birthDate,
          birth_place: newProfile.birthPlace,
          gender: newProfile.gender,
        });
      } catch (dbErr) {
        console.warn('Profiles table sync warning (run schema.sql in Supabase if table missing):', dbErr);
      }

      const fullUser: UserProfile = {
        id: authData.user.id,
        name: newProfile.name || params.username.trim(),
        avatar: '☯',
        tokens: 150,
        streak: 1,
        totalDraws: 0,
        birthDate: newProfile.birthDate,
        birthTime: '10:30',
        gender: newProfile.gender,
        birthPlace: newProfile.birthPlace,
        zodiac: '丙子鼠',
        mainElement: 'water',
        collectedCardIds: ['H-A', 'D-A', 'C-A', 'S-A'],
        account: {
          id: authData.user.id,
          username: params.username.trim(),
          email: params.email,
          isRegistered: true,
          registeredAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
      };

      return { success: true, message: '恭喜！天机缘籍已成功开辟', user: fullUser };
    } catch (e: any) {
      return { success: false, message: e.message || '注册网络异常' };
    }
  },

  // 3. User Sign In (Supabase Auth)
  async login(identifier: string, password?: string): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Supabase 未配置' };
    }

    try {
      const cleanId = identifier.trim();
      const userEmail = cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@tianji.me`;
      const userPassword = password || 'TianJi52_Pass_Auto';

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

      if (authError) {
        return { success: false, message: authError.message.includes('Invalid login') ? '账号或密码不匹配' : authError.message };
      }

      if (!authData.user) {
        return { success: false, message: '登录失败' };
      }

      // Fetch Profile from Cloud
      let cloudProfile: any = null;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        cloudProfile = data;
      } catch (err) {
        console.warn('Could not fetch cloud profile:', err);
      }

      const fullUser: UserProfile = {
        id: authData.user.id,
        name: cloudProfile?.nickname || cloudProfile?.username || authData.user.user_metadata?.nickname || cleanId,
        avatar: cloudProfile?.avatar || '☯',
        tokens: cloudProfile?.tokens ?? 150,
        streak: cloudProfile?.streak ?? 1,
        totalDraws: cloudProfile?.total_draws ?? 0,
        birthDate: cloudProfile?.birth_date || '1996-08-18',
        birthTime: cloudProfile?.birth_time || '10:30',
        gender: cloudProfile?.gender || '坤造 (女)',
        birthPlace: cloudProfile?.birth_place || '浙江 · 杭州',
        zodiac: cloudProfile?.zodiac || '丙子鼠',
        mainElement: cloudProfile?.main_element || 'water',
        collectedCardIds: cloudProfile?.collected_card_ids || ['H-A', 'D-A', 'C-A', 'S-A'],
        account: {
          id: authData.user.id,
          username: cleanId,
          email: authData.user.email,
          isRegistered: true,
          registeredAt: authData.user.created_at,
          lastLoginAt: new Date().toISOString(),
        },
      };

      return { success: true, message: `欢迎归来，${fullUser.name}`, user: fullUser };
    } catch (e: any) {
      return { success: false, message: e.message || '登录网络异常' };
    }
  },

  // 4. User Sign Out
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
  },

  // 5. Sync Reading to Supabase Cloud
  async syncReading(reading: ReadingAnalysis, userId?: string): Promise<void> {
    if (!this.isConfigured() || !userId) return;
    try {
      await supabase.from('readings').insert({
        id: reading.id,
        user_id: userId,
        question: reading.question,
        category: reading.category,
        spread_type: reading.spreadType,
        cards: reading.cards,
        overall_score: reading.overallScore,
        wealth_score: reading.wealthScore,
        career_score: reading.careerScore,
        love_score: reading.loveScore,
        nobleman_score: reading.noblemanScore,
        oracle_quote: reading.oracleQuote,
        dominant_element: reading.dominantElement,
        element_trend: reading.elementTrend,
        action_advices: reading.actionAdvices,
        overall_manifestation: reading.overallManifestation,
      });
    } catch (e) {
      console.warn('Reading cloud sync warning:', e);
    }
  },

  // 6. Fetch User Readings from Cloud
  async fetchUserReadings(userId: string): Promise<ReadingAnalysis[]> {
    if (!this.isConfigured() || !userId) return [];
    try {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((row) => ({
        id: row.id,
        date: row.created_at.slice(0, 10),
        timestamp: new Date(row.created_at).getTime(),
        question: row.question,
        category: row.category,
        spreadType: row.spread_type,
        cards: row.cards,
        overallScore: row.overall_score,
        wealthScore: row.wealth_score,
        careerScore: row.career_score,
        loveScore: row.love_score,
        noblemanScore: row.nobleman_score,
        oracleQuote: row.oracle_quote,
        elementTrend: row.element_trend,
        dominantElement: row.dominant_element,
        actionAdvices: row.action_advices,
        timeline: { near: '', mid: '', far: '' },
        luckyElements: { color: '', direction: '', time: '', element: '', number: 8 },
        overallManifestation: row.overall_manifestation,
      }));
    } catch (e) {
      console.warn('Fetch readings warning:', e);
      return [];
    }
  },
};
