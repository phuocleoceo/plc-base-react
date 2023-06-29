import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { useContext } from 'react'

import { ProjectPermissionApi } from '~/features/admin/features/projectPermission/apis'
import ProjectPermissionRow from './ProjectPermissionRow'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { Modal } from '~/common/components'

interface Props {
  projectRoleId: number
  isShowing: boolean
  onClose: () => void
}

export default function ProjectPermissionModal(props: Props) {
  const { projectRoleId, isShowing, onClose } = props

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const { data: projectPermissionData, isLoading: projectPermissionLoading } = useQuery({
    queryKey: [QueryKey.ProjectPermissions, projectRoleId],
    queryFn: () => ProjectPermissionApi.getProjectPermission(projectRoleId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  })

  const projectPermissions = projectPermissionData?.data.data

  return (
    <Modal
      className='max-w-[40rem] max-h-[45rem] overflow-y-auto'
      isLoading={projectPermissionLoading}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='flex items-center justify-between text-[16px] mb-4 ml-3'>
          <div>
            <span className='text-[22px] font-[600] text-c-text'>{t('update_permission')}</span>
          </div>

          <div className='text-black'>
            <button onClick={onClose} title='Close' className='btn-icon text-lg'>
              <Icon width={22} icon='akar-icons:cross' />
            </button>
          </div>
        </div>

        {projectPermissions && projectPermissions.length !== 0 ? (
          <div className='mt-1 ml-3'>
            {projectPermissions.map((projectPermissionGroup, idx) => (
              <div key={idx} className='border border-gray-300 rounded mb-4'>
                <div className='text-center text-xl font-bold border-b border-gray-300 p-1'>
                  {projectPermissionGroup.module}
                </div>
                {projectPermissionGroup.children.map((projectPermission) => (
                  <ProjectPermissionRow key={projectPermission.key} {...{ projectRoleId, projectPermission }} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_project_roles_found')} 🚀</div>
        )}
      </>
    </Modal>
  )
}
