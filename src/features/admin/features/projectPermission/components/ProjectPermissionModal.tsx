import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'

import { ProjectPermissionApi } from '~/features/admin/features/projectPermission/apis'
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
    <Modal className='max-w-[23rem]' isLoading={projectPermissionLoading} {...{ isShowing, onClose }}>
      <>
        <div className='mb-3 ml-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('update_permission')}</span>
        </div>

        {projectPermissions && projectPermissions.length !== 0 ? (
          <div className='mt-1 ml-3'>
            {projectPermissions.map((projectPermission, idx) => (
              <div key={idx}>
                <div>{projectPermission.module}</div>
              </div>
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
