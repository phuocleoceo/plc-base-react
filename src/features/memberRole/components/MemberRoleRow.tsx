import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { CreateMemberRoleRequest, DeleteMemberRoleParams } from '~/features/memberRole/models'
import { ProjectRole } from '~/features/admin/features/projectRole/models'
import { useProjectPermission } from '~/features/project/hooks'
import { MemberRoleApi } from '~/features/memberRole/apis'
import { MemberRolePermission } from '~/shared/enums'
import { SwitchToggle } from '~/common/components'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectMemberId: number
  projectRole: ProjectRole
  isMemberGranted: boolean
}

export default function MemberRoleModal(props: Props) {
  const projectId = Number(useParams().projectId)
  const { projectMemberId, projectRole, isMemberGranted } = props

  const { hasPermission } = useProjectPermission(projectId)
  const queryClient = useQueryClient()

  const createMemberRoleMutation = useMutation({
    mutationFn: (body: CreateMemberRoleRequest) => MemberRoleApi.createMemberRole(body)
  })

  const deleteMemberRoleMutation = useMutation({
    mutationFn: (params: DeleteMemberRoleParams) => MemberRoleApi.deleteMemberRole(params)
  })

  const handleToggle = (isEnable: boolean) => {
    const data: CreateMemberRoleRequest | DeleteMemberRoleParams = {
      projectMemberId,
      projectRoleId: projectRole.id
    }

    if (isEnable) {
      createMemberRoleMutation.mutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries([QueryKey.MemberRoles])
        }
      })
      return
    }

    deleteMemberRoleMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKey.MemberRoles])
      }
    })
  }

  return (
    <div key={projectRole.id} className='flex justify-between p-3'>
      <p>
        {projectRole.name} - {projectRole.description}
      </p>
      {hasPermission(MemberRolePermission.Create) && hasPermission(MemberRolePermission.Delete) && (
        <SwitchToggle defaultValue={isMemberGranted} onClick={handleToggle} />
      )}
    </div>
  )
}
