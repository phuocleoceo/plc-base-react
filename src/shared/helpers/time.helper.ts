import moment from 'moment'

export const howLongFromNow = (s: Date | undefined) => {
  if (!s) return ''
  return moment(s).fromNow()
}

export const howDayRemainFromNow = (s: Date | undefined) => {
  if (!s) return ''

  return moment(s).diff(moment(), 'days')
}

export const format = (s: Date | undefined, formatter: string) => {
  if (!s) return ''

  return moment(s).format(formatter)
}
