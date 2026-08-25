export interface SharePrivacySettings {
  includeQuestion: boolean;
  includeScore: boolean;
  includeCards: boolean;
  includeNickname: boolean;
  isPrivateReading: boolean;
}

export const DEFAULT_SHARE_PRIVACY: SharePrivacySettings = {
  includeQuestion: false, // Default false as specified in prompt
  includeScore: true,
  includeCards: true,
  includeNickname: false,
  isPrivateReading: false,
};
