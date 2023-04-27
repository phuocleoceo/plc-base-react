import i18n, { locales } from '~/common/locales/i18n'

export function translate(key: string | undefined) {
  if (!key) return ''

  return i18n.t(key as unknown as TemplateStringsArray)
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
