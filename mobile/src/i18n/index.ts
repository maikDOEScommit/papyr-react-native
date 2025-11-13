// i18n Configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getData, saveData } from '../utils/storage';
import { STORAGE_KEYS, APP_CONFIG } from '../constants/config';
import de from './locales/de.json';
import en from './locales/en.json';

// Initialize i18n
const initI18n = async () => {
  // Get saved language or use default
  const savedLanguage = await getData<string>(STORAGE_KEYS.LANGUAGE);
  const language = savedLanguage || APP_CONFIG.defaultLanguage;

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        de: { translation: de },
        en: { translation: en },
      },
      lng: language,
      fallbackLng: APP_CONFIG.defaultLanguage,
      interpolation: {
        escapeValue: false,
      },
    });
};

// Change language and persist
export const changeLanguage = async (lng: string) => {
  await i18n.changeLanguage(lng);
  await saveData(STORAGE_KEYS.LANGUAGE, lng);
};

// Initialize on import
initI18n();

export default i18n;
