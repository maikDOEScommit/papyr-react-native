// PAPYR App Configuration
import Constants from 'expo-constants';

// Supabase Configuration
export const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || '';
export const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Wolf Hour Configuration (20:00 - 02:00)
export const WOLF_HOUR_START = 20; // 8 PM
export const WOLF_HOUR_END = 2;    // 2 AM

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
} as const;

// Subscription Prices (in cents)
export const SUBSCRIPTION_PRICES = {
  BASIC: 99,  // €0.99
  PRO: 299,   // €2.99
} as const;

// Joker Configuration
export const JOKER_LIMITS = {
  FREE: 0,
  BASIC: 1,
  PRO: 2,
} as const;

// App Configuration
export const APP_CONFIG = {
  name: 'PAPYR',
  version: '1.0.0',
  defaultLanguage: 'de',
  supportedLanguages: ['de', 'en'],
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: '@papyr_user_data',
  AUTH_TOKEN: '@papyr_auth_token',
  LANGUAGE: '@papyr_language',
  STREAK_DATA: '@papyr_streak_data',
  COMMITMENTS: '@papyr_commitments',
  JOKER_USAGE: '@papyr_joker_usage',
} as const;
