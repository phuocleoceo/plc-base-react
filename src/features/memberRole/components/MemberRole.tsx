import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'

import { ProjectRoleApi } from '~/features/admin/features/projectRole/apis'
import { MemberRoleApi } from '~/features/memberRole/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { Modal } from '~/common/components'

interface Props {
  projectMemberId: number
  isShowing: boolean
  onClose: () => void
}

export default function ProjectMemberRow(props: Props) {
  const { projectMemberId, isShowing, onClose } = props

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const { data: projectRoleData, isLoading: projectRoleLoading } = useQuery({
    queryKey: [QueryKey.AllProjectRoles],
    queryFn: () => ProjectRoleApi.getAllProjectRoles(),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1000
  })

  const projectRoles = projectRoleData?.data.data

  const { data: memberRoleData, isLoading: memberRoleLoading } = useQuery({
    queryKey: [QueryKey.MemberRoles, projectMemberId],
    queryFn: () => MemberRoleApi.getMemberRoles(projectMemberId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1000
  })

  const memberRoles = memberRoleData?.data.data.map((memberRole) => memberRole.projectRoleId) || []

  return (
    <Modal isLoading={projectRoleLoading || memberRoleLoading} {...{ isShowing, onClose }}>
      <>
        {projectRoles && projectRoles.length !== 0 ? (
          <div className='mt-1 border-t-2 border-c-3'>
            {projectRoles.map((projectRole) => (
              <p key={projectRole.id}>{projectRole.name}</p>
            ))}
          </div>
        ) : (
          <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_project_roles_found')} 🚀</div>
        )}

        <div className='mt-8 flex justify-end gap-x-3'>
          <button onClick={onClose} className='btn-gray'>
            {t('cancle')}
          </button>
        </div>
      </>
    </Modal>
  )
}
