import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

import LOCALE_EN from '~/assets/i18n/en.json'
import LOCALE_VI from '~/assets/i18n/vi.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: { translation: { ...LOCALE_EN } },
  vi: { translation: { ...LOCALE_VI } }
} as const

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})
