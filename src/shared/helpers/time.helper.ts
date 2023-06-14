import moment from 'moment'

import { EnvConfig } from '~/configs'

export const howLongFromNow = (s: Date | undefined) => {
  if (!s) return ''
  return moment.utc(s).fromNow()
}

export const howDayRemainFromNow = (s: Date | undefined) => {
  if (!s) return ''

  return moment.utc(s).diff(moment(), 'days')
}

export const format = (s: Date | undefined, formatter: string) => {
  if (!s) return ''

  return moment.utc(s).utcOffset(EnvConfig.TimeZoneUTC).format(formatter)
}

export const toLocal = (s: Date | undefined) => {
  if (!s) return

  return moment.utc(s).utcOffset(EnvConfig.TimeZoneUTC).toDate()
}
