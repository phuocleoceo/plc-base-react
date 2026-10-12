import i18n, { locales } from '~/common/locales/i18n'

export function translate(key: string | undefined): string {
  if (!key) return ''

  // Keys are only known at runtime, so they can't be narrowed to i18next's typed key union.
  return i18n.t(key as never)
}

export function changeLanguage(lang: string) {
  i18n.changeLanguage(lang)
}

export function getCurrentLanguageKey(): string {
  return i18n.language
}

export function getCurrentLanguageValue(): string {
  return locales[i18n.language as keyof typeof locales]
}
