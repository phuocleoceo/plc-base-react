import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ProjectPermission, CreateProjectPermissionRequest } from '~/features/admin/features/projectPermission/models'
import { ProjectPermissionApi } from '~/features/admin/features/projectPermission/apis'
import { SwitchToggle } from '~/common/components'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectRoleId: number
  projectPermission: ProjectPermission
}

export default function ProjectPermissionRow(props: Props) {
  const { projectRoleId, projectPermission } = props

  const queryClient = useQueryClient()

  const createProjectPermissionMutation = useMutation({
    mutationFn: (body: CreateProjectPermissionRequest) =>
      ProjectPermissionApi.createProjectPermission(projectRoleId, body)
  })

  const deleteProjectPermissionMutation = useMutation({
    mutationFn: () => ProjectPermissionApi.deleteProjectPermission(projectRoleId, projectPermission.key)
  })

  const handleToggle = (isEnable: boolean) => {
    if (isEnable) {
      const data: CreateProjectPermissionRequest = {
        key: projectPermission.key
      }

      createProjectPermissionMutation.mutate(data, {
        onSuccess: () => queryClient.invalidateQueries([QueryKey.ProjectPermissions])
      })
      return
    }

    deleteProjectPermissionMutation.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries([QueryKey.ProjectPermissions])
    })
  }

  return (
    <div key={projectPermission.key} className='flex justify-between p-3 ml-3'>
      <p>
        {projectPermission.key} - {projectPermission.description}
      </p>
      <SwitchToggle defaultValue={projectPermission.isGranted} onClick={handleToggle} />
    </div>
  )
}
