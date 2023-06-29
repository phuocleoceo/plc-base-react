export type ProjectPermissionGroup = {
  module: string
  children: Array<ProjectPermission>
}

export type ProjectPermission = {
  key: string
  description: string
  isGranted: boolean
}
