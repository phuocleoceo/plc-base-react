import moment from 'moment'

export const howLongFromNow = (s: Date | undefined) => {
  if (!s) return ''
  return moment(s).fromNow()
}
