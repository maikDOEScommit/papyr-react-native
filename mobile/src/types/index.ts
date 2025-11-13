// PAPYR TypeScript Type Definitions

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  subscription: SubscriptionTier;
}

export type SubscriptionTier = 'free' | 'basic' | 'pro';

export interface Commitment {
  id: string;
  userId: string;
  imageUri: string;
  imageUrl?: string; // Supabase storage URL
  goalText: string;
  createdAt: string;
  uploadedAt: string;
  isDuringWolfHour: boolean;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCommitmentDate: string;
  totalCommitments: number;
}

export interface JokerUsage {
  userId: string;
  jokersAvailable: number;
  jokersUsed: number;
  lastJokerUsedAt?: string;
  resetDate: string; // Weekly reset
}

export interface DailyQuestion {
  id: string;
  date: string;
  questionDe: string;
  questionEn: string;
  answer?: string;
  answeredAt?: string;
}

export interface WeeklyReflection {
  id: string;
  userId: string;
  weekNumber: number;
  year: number;
  reflectionText: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface WolfHourStatus {
  isWolfHour: boolean;
  timeUntilStart?: number;
  timeUntilEnd?: number;
  nextWolfHourStart: Date;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  CommitmentUpload: undefined;
  Camera: undefined;
  CommitmentDetail: { commitmentId: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Archive: undefined;
  Profile: undefined;
};
