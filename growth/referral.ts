import { Storage } from '@/lib/storage';

export interface ReferralProfile {
  referralCode: string;
  totalInvitedCount: number;
  totalTokensEarned: number;
  claimedDeviceIds: string[];
}

export function getOrCreateReferralCode(userName = 'RON'): ReferralProfile {
  if (typeof window === 'undefined') {
    return {
      referralCode: 'TJ52-RON7X',
      totalInvitedCount: 3,
      totalTokensEarned: 60,
      claimedDeviceIds: [],
    };
  }

  const stored = localStorage.getItem('tianji_referral_profile');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }

  const cleanName = userName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'TIAN';
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  const code = `TJ52-${cleanName}${randomSuffix}`;

  const profile: ReferralProfile = {
    referralCode: code,
    totalInvitedCount: 2,
    totalTokensEarned: 40,
    claimedDeviceIds: [],
  };

  localStorage.setItem('tianji_referral_profile', JSON.stringify(profile));
  return profile;
}

export function redeemReferralCode(codeToRedeem: string): { success: boolean; message: string; tokensAwarded: number } {
  const cleanCode = codeToRedeem.trim().toUpperCase();
  if (!cleanCode.startsWith('TJ52-') || cleanCode.length < 8) {
    return { success: false, message: '无效的邀请码格式', tokensAwarded: 0 };
  }

  // Award 10 tokens to new user
  Storage.addTokens(10, `兑换好友邀请码 [${cleanCode}] 奖励`);
  return {
    success: true,
    message: '成功兑换好友结缘礼！已获得 10 天机令。',
    tokensAwarded: 10,
  };
}
