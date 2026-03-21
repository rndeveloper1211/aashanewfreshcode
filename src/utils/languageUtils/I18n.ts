import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Language Files Import
import en from './en.json';
import gj from './gj.json';
import hi from './hi.json';
import kn from './kn.json';
import mh from './mh.json';
import tl from './tl.json';
import tn from './tn.json';
import bn from './bn.json';

// 1. I18n Instance Configuration
const i18n = new I18n({
  en, gj, hi, kn, mh, tl, tn, bn,
});

// 2. Missing Translation Settings
i18n.enableFallback = true;
i18n.defaultLocale = 'en'; 

i18n.missingBehavior = 'guess'; 

i18n.missingTranslation = (scope) => {
  return scope; 
};

// --- FIX: Initial Locale ko English ('en') set kiya ---
i18n.locale = 'en'; 

// --- FUNCTIONS ---

/**
 * App start hote waqt saved language load karne ke liye
 */
export const loadLocale = async () => {
  try {
    const savedLang = await AsyncStorage.getItem('@app_language');
    if (savedLang) {
      i18n.locale = savedLang;
      return savedLang;
    }
    // --- FIX: Agar kuch na mile toh 'en' default ---
    i18n.locale = 'en';
    return 'en'; 
  } catch (error) {
    console.error('Error loading language from storage', error);
    i18n.locale = 'en';
    return 'en';
  }
};

/**
 * Language change karne aur save karne ke liye
 */
export const setLocale = async (langCode: string) => {
  try {
    i18n.locale = langCode;
    await AsyncStorage.setItem('@app_language', langCode);
  } catch (error) {
    console.error('Error saving language preference', error);
  }
};

/**
 * Main Translation Function
 */
export const translate = (key: string, options?: any) => {
  return i18n.t(key, { defaultValue: key, ...options });
};

loadLocale();

export default i18n;
