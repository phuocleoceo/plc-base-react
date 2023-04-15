import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

import LOCALE_EN from '~/common/locales/en/translation.json'
import LOCALE_VI from '~/common/locales/vi/translation.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: LOCALE_EN,
  vi: LOCALE_VI
} as const

export const defaultNS = 'product'

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['home', 'product'],
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false
  }
})
