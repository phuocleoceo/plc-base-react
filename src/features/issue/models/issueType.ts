export type IssueInBoard = {
  id: number
  title: string
  storyPoint: number
  priority: string
  type: string
  reporterId: number
  assigneeId: number
  assigneeName: string
  assigneeAvatar: string
  projectStatusId: number
  projectStatusIndex: number
}

export type IssueGroupedInBoard = {
  projectStatusId: number
  issues: Array<IssueInBoard>
}

export type IssueInBacklog = {
  id: number
  title: string
  storyPoint: number
  priority: string
  type: string
  assigneeId: number
  assigneeName: string
  assigneeAvatar: string
  backlogIndex: number
}

export type IssueDetail = {
  id: number
  title: string
  description: string
  storyPoint: number
  priority: string
  type: string
  backlogIndex: number
  sprintId: number
  reporterId: number
  reporterName: string
  reporterAvatar: string
  assigneeId: number
  assigneeName: string
  assigneeAvatar: string
  projectStatusId: number
  projectStatusName: string
  createdAt: Date
  updatedAt: Date
}
