import { IssueType, IssuePriority } from '~/shared/constants'

export function getIssueType(type: string) {
  return IssueType.find((it) => it.value === type)
}

export function getIssuePriority(priority: string) {
  return IssuePriority.find((ip) => ip.value === priority)
}
