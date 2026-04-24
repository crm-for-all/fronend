export type OnboardingData = {
  orgName: string;
  plan: 'free' | 'business';
  statuses: { name: string; color: string }[];
  tags: string[];
};
