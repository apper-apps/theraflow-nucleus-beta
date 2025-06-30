import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import frTranslations from './locales/fr.json'

const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Set French as default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })

export default i18n