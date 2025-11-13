// AsyncStorage Utility Functions
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to AsyncStorage
 */
export const saveData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Get data from AsyncStorage
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Clear all AsyncStorage data
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    throw error;
  }
};

/**
 * Get multiple items from AsyncStorage
 */
export const getMultiple = async (keys: string[]): Promise<Record<string, any>> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result: Record<string, any> = {};

    values.forEach(([key, value]) => {
      result[key] = value ? JSON.parse(value) : null;
    });

    return result;
  } catch (error) {
    console.error('Error getting multiple values:', error);
    throw error;
  }
};

/**
 * Set multiple items in AsyncStorage
 */
export const setMultiple = async (keyValuePairs: [string, any][]): Promise<void> => {
  try {
    const pairs: [string, string][] = keyValuePairs.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Error setting multiple values:', error);
    throw error;
  }
};
