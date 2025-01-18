// i18n.ts
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: require('./English.json'),
  zh: require('./SimplifiedChinese.json'),
};

const i18n = new I18n(translations);

i18n.locale = getLocales()[0].languageCode ?? 'en';

i18n.enableFallback = true;

export default i18n;