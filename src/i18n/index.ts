import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import rw from './locales/rw.json';

const savedLanguage = localStorage.getItem('appLanguage') || 'en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, rw: { translation: rw } },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
