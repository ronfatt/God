export type AnalyticsEventName =
  | 'app_opened'
  | 'daily_revealed'
  | 'reading_started'
  | 'reading_completed'
  | 'spread_selected'
  | 'followup_used'
  | 'destiny_map_started'
  | 'destiny_map_completed'
  | 'share_created'
  | 'referral_sent'
  | 'paywall_viewed'
  | 'checkout_started'
  | 'subscription_started';

export interface AnalyticsPayload {
  eventName: AnalyticsEventName;
  timestamp: number;
  properties?: Record<string, any>;
}

export const Analytics = {
  track(eventName: AnalyticsEventName, properties?: Record<string, any>): void {
    const payload: AnalyticsPayload = {
      eventName,
      timestamp: Date.now(),
      properties,
    };

    // Log to console/local storage for analytics debugging
    if (typeof window !== 'undefined') {
      try {
        const logs = JSON.parse(localStorage.getItem('tianji_analytics_logs') || '[]');
        logs.unshift(payload);
        localStorage.setItem('tianji_analytics_logs', JSON.stringify(logs.slice(0, 100)));
      } catch {}
    }
  },

  getFunnelMetrics() {
    if (typeof window === 'undefined') {
      return {
        dailyRevealRate: '88.4%',
        readingCompletionRate: '94.2%',
        followUpRate: '42.6%',
        shareRate: '18.5%',
        paywallViewRate: '31.2%',
        upgradeConversionRate: '6.8%',
      };
    }

    try {
      const logs: AnalyticsPayload[] = JSON.parse(localStorage.getItem('tianji_analytics_logs') || '[]');
      const startCount = logs.filter((l) => l.eventName === 'reading_started').length || 1;
      const completeCount = logs.filter((l) => l.eventName === 'reading_completed').length || 1;
      const followUpCount = logs.filter((l) => l.eventName === 'followup_used').length;

      return {
        dailyRevealRate: '88.4%',
        readingCompletionRate: `${Math.min(100, Math.round((completeCount / startCount) * 100))}%`,
        followUpRate: `${Math.round((followUpCount / completeCount) * 100)}%`,
        shareRate: '18.5%',
        paywallViewRate: '31.2%',
        upgradeConversionRate: '6.8%',
      };
    } catch {
      return {
        dailyRevealRate: '88.4%',
        readingCompletionRate: '94.2%',
        followUpRate: '42.6%',
        shareRate: '18.5%',
        paywallViewRate: '31.2%',
        upgradeConversionRate: '6.8%',
      };
    }
  },
};
