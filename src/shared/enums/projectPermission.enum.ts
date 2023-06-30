export enum EventPermission {
  GetAll = 'Event.GetAll',
  GetOne = 'Event.GetOne',
  Create = 'Event.Create',
  Update = 'Event.Update',
  Delete = 'Event.Delete'
}

export enum InvitationPermission {
  GetForProject = 'Invitation.GetForProject',
  Create = 'Invitation.Create',
  Delete = 'Invitation.Delete'
}

export enum IssuePermission {
  GetForBoard = 'Issue.GetForBoard',
  UpdateForBoard = 'Issue.UpdateForBoard',
  MoveToBacklog = 'Issue.MoveToBacklog',
  GetForBacklog = 'Issue.GetForBacklog',
  UpdateForBacklog = 'Issue.UpdateForBacklog',
  MoveToSprint = 'Issue.MoveToSprint',
  GetOne = 'Issue.GetOne',
  Create = 'Issue.Create',
  Update = 'Issue.Update',
  Delete = 'Issue.Delete'
}

export enum ProjectPermission {
  GetOne = 'Project.GetOne',
  Update = 'Project.Update',
  Delete = 'Project.Delete'
}

export enum ProjectMemberPermission {
  GetAll = 'ProjectMember.GetAll',
  Delete = 'ProjectMember.Delete'
}

export enum ProjectStatusPermission {
  Create = 'ProjectStatus.Create',
  Update = 'ProjectStatus.Update',
  Delete = 'ProjectStatus.Delete',
  UpdateForBoard = 'ProjectStatus.UpdateForBoard'
}

export enum SprintPermission {
  Create = 'Sprint.Create',
  Update = 'Sprint.Update',
  Delete = 'Sprint.Delete',
  Start = 'Sprint.Start',
  Complete = 'Sprint.Complete'
}

export enum MemberRolePermission {
  GetAll = 'MemberRole.GetAll',
  Create = 'MemberRole.Create',
  Delete = 'MemberRole.Delete'
}
