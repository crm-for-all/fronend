import { type StatusColor } from '../../types';

export type OnboardingData = {
  orgName: string;
  plan: 'free' | 'business';
  statuses: { name: string; color: StatusColor }[];
  tags: string[];
};
