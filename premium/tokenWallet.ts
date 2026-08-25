export interface WalletTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  timestamp: number;
  dateStr: string;
}

export interface TianjiWallet {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  transactions: WalletTransaction[];
}

export const TOKEN_COSTS = {
  clarifier1Card: 10,
  followUp3Cards: 20,
  spreadSix: 20,
  spreadNine: 50,
  aiDeepReading: 30,
};

export function createInitialWallet(initialTokens = 120): TianjiWallet {
  const dateStr = new Date().toLocaleDateString('zh-CN');
  return {
    balance: initialTokens,
    lifetimeEarned: initialTokens,
    lifetimeSpent: 0,
    transactions: [
      {
        id: 'tx_init',
        type: 'earn',
        amount: initialTokens,
        reason: '初始结缘天机令礼包',
        timestamp: Date.now(),
        dateStr,
      },
    ],
  };
}
