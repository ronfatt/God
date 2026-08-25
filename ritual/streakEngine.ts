export interface StreakReward {
  dayThreshold: number;
  tokens: number;
  label: string;
  isClaimed: boolean;
}

export interface StreakState {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  longestStreak: number;
  rewards: StreakReward[];
}

export const DEFAULT_STREAK_REWARDS: StreakReward[] = [
  { dayThreshold: 3, tokens: 5, label: '3日初显恒心', isClaimed: false },
  { dayThreshold: 7, tokens: 15, label: '7日乾坤感应', isClaimed: false },
  { dayThreshold: 14, tokens: 25, label: '14日通神精进', isClaimed: false },
  { dayThreshold: 30, tokens: 50, label: '30日天机大成', isClaimed: false },
];

export function checkAndUpdateStreak(
  currentState: StreakState,
  todayStr = new Date().toISOString().split('T')[0]
): { nextState: StreakState; rewardEarned?: number } {
  const { currentStreak, lastActiveDate, longestStreak, rewards } = currentState;

  if (lastActiveDate === todayStr) {
    return { nextState: currentState };
  }

  let newStreak = currentStreak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActiveDate === yesterdayStr) {
    newStreak = currentStreak + 1;
  } else if (!lastActiveDate) {
    newStreak = 1;
  } else {
    // Break streak
    newStreak = 1;
  }

  let rewardEarned: number | undefined = undefined;
  const updatedRewards = rewards.map((r) => {
    if (newStreak >= r.dayThreshold && !r.isClaimed) {
      rewardEarned = (rewardEarned || 0) + r.tokens;
      return { ...r, isClaimed: true };
    }
    return r;
  });

  const nextState: StreakState = {
    currentStreak: newStreak,
    lastActiveDate: todayStr,
    longestStreak: Math.max(longestStreak, newStreak),
    rewards: updatedRewards,
  };

  return { nextState, rewardEarned };
}
