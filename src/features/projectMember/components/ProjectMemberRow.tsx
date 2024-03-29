import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'

import { MemberRolePermission, ProjectMemberPermission } from '~/shared/enums'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { ProjectMember } from '~/features/projectMember/models'
import { useProjectPermission } from '~/features/project/hooks'
import { LocalStorageHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useToggle } from '~/common/hooks'

const AnonymousProfileModal = lazy(() => import('~/features/profile/components/AnonymousProfileModal'))
const MemberRoleModal = lazy(() => import('~/features/memberRole/components/MemberRoleModal'))
const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  idx: number
  projectId: number
  projectMember: ProjectMember
}

export default function ProjectMemberRow(props: Props) {
  const { idx, projectId, projectMember } = props
  const { t } = useTranslation()

  const { hasPermission } = useProjectPermission(projectId)

  const { isShowing: isShowingMemberDetail, toggle: toggleMemberDetail } = useToggle()
  const { isShowing: isShowingDeleteMember, toggle: toggleDeleteMember } = useToggle()
  const { isShowing: isShowingMemberRole, toggle: toggleMemberRole } = useToggle()

  const queryClient = useQueryClient()
  const currentUser = LocalStorageHelper.getUserInfo()

  const handleClickDeleteProjectMember = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleDeleteMember()
  }

  const deleteProjectMemberMutation = useMutation({
    mutationFn: () => ProjectMemberApi.deleteProjectMember(projectId, projectMember.projectMemberId)
  })

  const handleDeleteProjectMember = async () => {
    deleteProjectMemberMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('delete_project_member_success'))
        queryClient.invalidateQueries([QueryKey.ProjectMembers])
        toggleDeleteMember()
      }
    })
  }

  const handleClickMemberRole = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleMemberRole()
  }

  const getMemberRoles = () => projectMember.memberRoles.join(', ')

  return (
    <>
      <div
        key={projectMember.id}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        onClick={toggleMemberDetail}
        onKeyDown={toggleMemberDetail}
        tabIndex={projectMember.id}
        role='button'
      >
        <div className='w-24 text-center'>{idx + 1}</div>
        <div className='w-60 flex'>
          <Avatar
            title={projectMember.name}
            src={projectMember.avatar}
            name={projectMember.name}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{projectMember.name}</span>
        </div>
        <div className='w-64'>{projectMember.email}</div>
        <div className='w-64'>{getMemberRoles()}</div>
        <div className='flex-grow flex'>
          {hasPermission(MemberRolePermission.GetAll) && (
            <button title='edit_member_role' onClick={handleClickMemberRole} className='btn-icon bg-c-1'>
              <Icon width={22} icon='iconoir:agile' className='text-blue-500' />
            </button>
          )}

          {hasPermission(ProjectMemberPermission.Delete) && currentUser.id !== projectMember.id && (
            <button title='delete_project_member' onClick={handleClickDeleteProjectMember} className='btn-icon bg-c-1'>
              <Icon width={22} icon='bx:trash' className='text-red-500' />
            </button>
          )}
        </div>
      </div>

      {isShowingDeleteMember && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteMember}
            onClose={toggleDeleteMember}
            onSubmit={handleDeleteProjectMember}
            isMutating={deleteProjectMemberMutation.isLoading}
            confirmMessage={t(`submit_delete_project_member`) + `: ${projectMember.name}`}
            closeLabel={t('cancle')}
            submittingLabel={t('deleting_project_member...')}
            submitLabel={t('delete_project_member')}
            submitClassName='btn-alert'
            className='max-w-[27rem]'
          />
        </Suspense>
      )}

      {isShowingMemberDetail && (
        <Suspense>
          <AnonymousProfileModal
            userId={projectMember.id}
            isShowing={isShowingMemberDetail}
            onClose={toggleMemberDetail}
          />
        </Suspense>
      )}

      {isShowingMemberRole && (
        <Suspense>
          <MemberRoleModal
            projectMemberId={projectMember.projectMemberId}
            isShowing={isShowingMemberRole}
            onClose={toggleMemberRole}
          />
        </Suspense>
      )}
    </>
  )
}
