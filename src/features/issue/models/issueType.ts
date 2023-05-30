export type Issue = {
  id: number
  title: string
  description: string
  storyPoint: number
  priority: string
  type: string
  reporterId: number
  reporterName: string
  reporterAvatar: string
  assigneeId: number
  assigneeName: string
  assigneeAvatar: string
  projectStatusId: number
}

export type IssueInBacklog = Issue & {
  projectStatusName: string
}

export type IssueDetail = Issue & {
  projectStatusName: number
}

export type IssueInBoard = Issue & {
  projectStatusIndex: number
}

export type IssueGroupedInBoard = {
  projectStatusId: number
  issues: Array<IssueInBoard>
}
