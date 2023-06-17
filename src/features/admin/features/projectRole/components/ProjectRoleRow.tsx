import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { lazy, Suspense } from 'react'
import { Icon } from '@iconify/react'

import { ProjectRoleApi } from '~/features/admin/features/projectRole/apis'
import { ProjectRole } from '~/features/admin/features/projectRole/models'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

const UpdateProjectRole = lazy(() => import('~/features/admin/features/projectRole/components/UpdateProjectRole'))
const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  idx: number
  projectRole: ProjectRole
}

export default function ProjectRoleRow(props: Props) {
  const { idx, projectRole } = props

  const { isShowing: isShowingUpdateProjectRole, toggle: toggleUpdateProjectRole } = useToggle()
  const { isShowing: isShowingDeleteProjectRole, toggle: toggleDeleteProjectRole } = useToggle()

  const queryClient = useQueryClient()

  const deleteProjectRoleMutation = useMutation({
    mutationFn: () => ProjectRoleApi.deleteProjectRole(projectRole.id)
  })

  const handleDeleteProjectRole = async () => {
    deleteProjectRoleMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('delete_project_role_success')
        queryClient.invalidateQueries([QueryKey.ProjectRoles])
        toggleDeleteProjectRole()
      }
    })
  }

  return (
    <>
      <div
        key={projectRole.id}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent pt-1 pb-3 hover:border-t-2 hover:border-blue-400'
      >
        <div className='w-32 text-center'>{idx + 1}</div>
        <div className='w-56'>{projectRole.name}</div>
        <div className='w-64'>{projectRole.description}</div>
        <div className='flex-grow flex'>
          <div className='flex'>
            <button title='update_project_role' onClick={toggleUpdateProjectRole} className='btn-icon bg-c-1'>
              <Icon width={22} icon='ic:baseline-edit' className='text-blue-500' />
            </button>

            <button title='delete_project_role' onClick={toggleDeleteProjectRole} className='btn-icon bg-c-1'>
              <Icon width={22} icon='bx:trash' className='text-red-500' />
            </button>
          </div>
        </div>
      </div>

      {isShowingUpdateProjectRole && (
        <Suspense>
          <UpdateProjectRole
            isShowing={isShowingUpdateProjectRole}
            onClose={toggleUpdateProjectRole}
            projectRoleId={projectRole.id}
          />
        </Suspense>
      )}

      {isShowingDeleteProjectRole && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteProjectRole}
            onClose={toggleDeleteProjectRole}
            onSubmit={handleDeleteProjectRole}
            isMutating={deleteProjectRoleMutation.isLoading}
            confirmMessage={`submit_delete_project_role` + `: ${projectRole.name}`}
            closeLabel='cancle'
            submittingLabel='deleting_project_role...'
            submitLabel='delete_project_role'
            submitClassName='btn-alert'
            className='max-w-[20rem]'
          />
        </Suspense>
      )}
    </>
  )
}
