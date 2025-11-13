// Wolf Hour Utility Functions
import { WOLF_HOUR_START, WOLF_HOUR_END } from '../constants/config';
import { WolfHourStatus } from '../types';

/**
 * Check if current time is within Wolf Hour (20:00 - 02:00)
 */
export const isWolfHour = (date: Date = new Date()): boolean => {
  const hour = date.getHours();

  // Wolf Hour spans midnight (20:00 - 02:00)
  if (WOLF_HOUR_START > WOLF_HOUR_END) {
    return hour >= WOLF_HOUR_START || hour < WOLF_HOUR_END;
  }

  // Normal case (shouldn't happen with current config)
  return hour >= WOLF_HOUR_START && hour < WOLF_HOUR_END;
};

/**
 * Get time until Wolf Hour starts (in milliseconds)
 */
export const getTimeUntilWolfHourStart = (now: Date = new Date()): number => {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  // If we're in Wolf Hour, return 0
  if (isWolfHour(now)) {
    return 0;
  }

  // Calculate next Wolf Hour start
  const wolfHourStart = new Date(now);
  wolfHourStart.setHours(WOLF_HOUR_START, 0, 0, 0);

  // If we've passed today's Wolf Hour start, set to tomorrow
  if (currentHour >= WOLF_HOUR_END && currentHour < WOLF_HOUR_START) {
    // We're between 02:00 and 20:00, so next Wolf Hour is today at 20:00
  } else if (currentHour >= WOLF_HOUR_START) {
    // We're after 20:00 but before midnight
    wolfHourStart.setDate(wolfHourStart.getDate() + 1);
  }

  return wolfHourStart.getTime() - now.getTime();
};

/**
 * Get time until Wolf Hour ends (in milliseconds)
 */
export const getTimeUntilWolfHourEnd = (now: Date = new Date()): number => {
  if (!isWolfHour(now)) {
    return 0;
  }

  const wolfHourEnd = new Date(now);
  wolfHourEnd.setHours(WOLF_HOUR_END, 0, 0, 0);

  // If current time is past midnight but before 02:00
  if (now.getHours() < WOLF_HOUR_END) {
    // Wolf Hour end is today at 02:00
  } else {
    // Current time is after 20:00, so Wolf Hour ends tomorrow at 02:00
    wolfHourEnd.setDate(wolfHourEnd.getDate() + 1);
  }

  return wolfHourEnd.getTime() - now.getTime();
};

/**
 * Get next Wolf Hour start time
 */
export const getNextWolfHourStart = (now: Date = new Date()): Date => {
  const currentHour = now.getHours();
  const nextStart = new Date(now);
  nextStart.setHours(WOLF_HOUR_START, 0, 0, 0);

  // If we're past Wolf Hour start today, move to tomorrow
  if (currentHour >= WOLF_HOUR_END && currentHour >= WOLF_HOUR_START) {
    nextStart.setDate(nextStart.getDate() + 1);
  } else if (currentHour >= WOLF_HOUR_END && currentHour < WOLF_HOUR_START) {
    // We're between 02:00 and 20:00, so next Wolf Hour is today
  }

  return nextStart;
};

/**
 * Get comprehensive Wolf Hour status
 */
export const getWolfHourStatus = (now: Date = new Date()): WolfHourStatus => {
  const isActive = isWolfHour(now);

  return {
    isWolfHour: isActive,
    timeUntilStart: isActive ? undefined : getTimeUntilWolfHourStart(now),
    timeUntilEnd: isActive ? getTimeUntilWolfHourEnd(now) : undefined,
    nextWolfHourStart: getNextWolfHourStart(now),
  };
};

/**
 * Format time remaining as HH:MM:SS
 */
export const formatTimeRemaining = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Check if a date was during Wolf Hour
 */
export const wasUploadedDuringWolfHour = (uploadDate: string | Date): boolean => {
  const date = typeof uploadDate === 'string' ? new Date(uploadDate) : uploadDate;
  return isWolfHour(date);
};
