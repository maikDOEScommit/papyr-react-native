import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Commitment {
  id: string;
  date: string;
  imageData: string;
  goals: string;
  isDeveloping: boolean;
  timestamp: number;
  signatureInitials: string | null;
  completed: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  morning: boolean; // 9:30
  afternoon: boolean; // 15:00
  evening: boolean; // 19:00
}

export interface AppState {
  hasCompletedOnboarding: boolean;
  hasPaid: boolean;
  isPro: boolean;
  userName: string;
  commitments: Commitment[];
  currentStreak: number;
  lastCommitmentDate: string | null;
  tenYearVision: string | null;
  hasCompletedSevenDayReflection: boolean;
  jokers: number;
  lastShownPopupDay: number | null;
  totalCommitments: number;
  notificationSettings: NotificationSettings;
  shownOnboardingDays?: number[];
}

const STORAGE_KEY = 'papyr_state';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  morning: false,
  afternoon: false,
  evening: false,
};

const getDefaultState = (): AppState => ({
  hasCompletedOnboarding: false,
  hasPaid: false,
  isPro: false,
  userName: '',
  commitments: [],
  currentStreak: 0,
  lastCommitmentDate: null,
  tenYearVision: null,
  hasCompletedSevenDayReflection: false,
  jokers: 0,
  lastShownPopupDay: null,
  totalCommitments: 0,
  notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
});

export const getAppState = async (): Promise<AppState> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultState();
    }

    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      userName: parsed.userName || '',
      tenYearVision: parsed.tenYearVision || null,
      hasCompletedSevenDayReflection: parsed.hasCompletedSevenDayReflection || false,
      jokers: parsed.jokers || 0,
      lastShownPopupDay: parsed.lastShownPopupDay || null,
      totalCommitments: parsed.totalCommitments || parsed.commitments?.length || 0,
      notificationSettings: parsed.notificationSettings || DEFAULT_NOTIFICATION_SETTINGS,
      commitments: parsed.commitments?.map((c: any) => ({
        ...c,
        completed: c.completed ?? false,
      })) || [],
    };
  } catch (error) {
    console.error('Error getting app state:', error);
    return getDefaultState();
  }
};

export const saveAppState = async (state: AppState): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving app state:', error);
  }
};

export const addCommitment = async (
  imageData: string,
  goals: string,
  signWithInitials: boolean = false
): Promise<{ commitment: Commitment; jokersUsed: number }> => {
  const state = await getAppState();
  const today = new Date().toISOString().split('T')[0];

  // Calculate streak with Joker system
  let newStreak = state.currentStreak;
  let jokersUsed = 0;

  if (state.lastCommitmentDate) {
    const lastDate = new Date(state.lastCommitmentDate);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day - continue streak
      newStreak += 1;
    } else if (diffDays === 2 && state.jokers > 0) {
      // Missed exactly 1 day - use Joker automatically
      jokersUsed = 1;
      newStreak += 1; // Continue streak
    } else if (diffDays > 1) {
      // Missed more than 1 day or no Joker available - reset streak
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  // Award Joker every 7 days of streak
  let newJokers = state.jokers - jokersUsed;
  if (newStreak > 0 && newStreak % 7 === 0) {
    newJokers += 1;
  }

  // Extract initials from userName
  const initials = signWithInitials && state.userName
    ? state.userName
        .split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .join('')
    : null;

  const newCommitment: Commitment = {
    id: Date.now().toString(),
    date: today,
    imageData,
    goals,
    isDeveloping: true,
    timestamp: Date.now(),
    signatureInitials: initials,
    completed: false,
  };

  state.commitments.unshift(newCommitment);
  state.currentStreak = newStreak;
  state.jokers = newJokers;
  state.lastCommitmentDate = today;
  state.totalCommitments += 1;

  await saveAppState(state);
  return { commitment: newCommitment, jokersUsed };
};

export const markCommitmentDeveloped = async (id: string): Promise<void> => {
  const state = await getAppState();
  const commitment = state.commitments.find(c => c.id === id);
  if (commitment) {
    commitment.isDeveloping = false;
    await saveAppState(state);
  }
};

export const isWithinWolfHour = (): boolean => {
  // TESTING MODE: Always return true to allow uploads anytime
  return true;

  // PRODUCTION CODE (commented out):
  // const now = new Date();
  // const hour = now.getHours();
  // // 20:00 (8 PM) to 02:00 (2 AM) - Die Stunde des Wolfs
  // return hour >= 20 || hour < 2;
};

export const canCommitToday = async (): Promise<boolean> => {
  // TESTING MODE: Always return true to allow multiple uploads per day
  return true;

  // PRODUCTION CODE (commented out):
  // const state = await getAppState();
  // const today = new Date().toISOString().split('T')[0];
  // return state.lastCommitmentDate !== today;
};

export const needsPaywall = async (): Promise<boolean> => {
  const state = await getAppState();
  // 14 Tage Free Trial (nicht 7!)
  return state.commitments.length >= 14 && !state.hasPaid;
};

export const needsSevenDayReflection = async (): Promise<boolean> => {
  const state = await getAppState();
  return state.currentStreak === 7 && !state.hasCompletedSevenDayReflection;
};

export const completeSevenDayReflection = async (vision: string, hasPaid: boolean): Promise<void> => {
  const state = await getAppState();
  state.tenYearVision = vision;
  state.hasCompletedSevenDayReflection = true;
  state.hasPaid = hasPaid;
  await saveAppState(state);
};

export const deleteCommitment = async (id: string): Promise<void> => {
  const state = await getAppState();
  state.commitments = state.commitments.filter(c => c.id !== id);
  await saveAppState(state);
};

export const markCommitmentCompleted = async (id: string): Promise<void> => {
  const state = await getAppState();
  const commitment = state.commitments.find(c => c.id === id);
  if (commitment) {
    commitment.completed = true;
    await saveAppState(state);
  }
};

// Aliases for MainContainer compatibility
export const shouldShow7DayReflection = needsSevenDayReflection;
export const markReflectionShown = async (): Promise<void> => {
  const state = await getAppState();
  state.hasCompletedSevenDayReflection = true;
  await saveAppState(state);
};

// Re-export from dailyQuestions for convenience
export { hasAnsweredQuestion, saveAnswer } from './dailyQuestions';

// Complete onboarding
export const completeOnboarding = async (userName: string): Promise<void> => {
  const state = await getAppState();
  state.hasCompletedOnboarding = true;
  state.userName = userName;
  await saveAppState(state);
};
