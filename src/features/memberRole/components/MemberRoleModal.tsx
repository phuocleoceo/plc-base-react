import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'

import { ProjectRoleApi } from '~/features/admin/features/projectRole/apis'
import { MemberRoleApi } from '~/features/memberRole/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import MemberRoleRow from './MemberRoleRow'
import { Modal } from '~/common/components'

interface Props {
  projectMemberId: number
  isShowing: boolean
  onClose: () => void
}

export default function MemberRoleModal(props: Props) {
  const { projectMemberId, isShowing, onClose } = props

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const { data: projectRoleData, isLoading: projectRoleLoading } = useQuery({
    queryKey: [QueryKey.AllProjectRoles],
    queryFn: () => ProjectRoleApi.getAllProjectRoles(),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  })

  const projectRoles = projectRoleData?.data.data

  const { data: memberRoleData, isLoading: memberRoleLoading } = useQuery({
    queryKey: [QueryKey.MemberRoles, projectMemberId],
    queryFn: () => MemberRoleApi.getMemberRoles(projectMemberId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000
  })

  const memberRoles = memberRoleData?.data.data.map((memberRole) => memberRole.projectRoleId) || []

  return (
    <Modal className='max-w-[23rem]' isLoading={projectRoleLoading || memberRoleLoading} {...{ isShowing, onClose }}>
      <>
        <div className='mb-4 ml-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('update_member_role')}</span>
        </div>

        {projectRoles && projectRoles.length !== 0 ? (
          <div className='mt-1'>
            {projectRoles.map((projectRole) => (
              <MemberRoleRow
                key={projectRole.id}
                isMemberGranted={memberRoles.includes(projectRole.id)}
                {...{ projectRole, projectMemberId }}
              />
            ))}
          </div>
        ) : (
          <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_project_roles_found')} 🚀</div>
        )}

        <div className='mt-4 flex justify-end gap-x-3'>
          <button onClick={onClose} className='btn-gray'>
            {t('close')}
          </button>
        </div>
      </>
    </Modal>
  )
}
