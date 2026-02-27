export type ChallengeType = 'yoga_30_days' | 'running_100km' | 'gym_streak' | 'custom';
export type ChallengeStatus = 'active' | 'completed' | 'failed';

export interface Challenge {
  id?: string;
  userId: string;
  type: ChallengeType;
  title: string;
  description: string;
  goal: number;
  progress: number;
  status: ChallengeStatus;
  startDate: Date;
  endDate: Date;
  completedAt?: Date;
  reward?: string;
  icon: string;
}