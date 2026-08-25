export interface FeatureFlags {
  destinyMap90: boolean;
  payments: boolean;
  referrals: boolean;
  aiNarrative: boolean;
  motionCards: boolean;
  soundSynthesizer: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  destinyMap90: true,
  payments: false, // Default false for mock checkout; toggle to true for Stripe
  referrals: true,
  aiNarrative: true,
  motionCards: true,
  soundSynthesizer: true,
};

export function getFeatureFlag<K extends keyof FeatureFlags>(key: K): boolean {
  if (typeof window === 'undefined') return DEFAULT_FEATURE_FLAGS[key];
  try {
    const flags = JSON.parse(localStorage.getItem('tianji_feature_flags') || '{}');
    if (flags[key] !== undefined) return flags[key];
    return DEFAULT_FEATURE_FLAGS[key];
  } catch {
    return DEFAULT_FEATURE_FLAGS[key];
  }
}
