import { lazy, Suspense } from 'react'
import { Icon } from '@iconify/react'

import { ProjectRole } from '~/features/admin/features/projectRole/models'
import { useToggle } from '~/common/hooks'

const UpdateProjectRole = lazy(() => import('~/features/admin/features/projectRole/components/UpdateProjectRole'))

interface Props {
  idx: number
  projectRole: ProjectRole
}

export default function ProjectRoleRow(props: Props) {
  const { idx, projectRole } = props

  const { isShowing: isShowingUpdateProjectRole, toggle: toggleShowingUpdateProjectRole } = useToggle()

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
          <button
            title='update_project_role'
            onClick={toggleShowingUpdateProjectRole}
            className='btn-icon absolute ml-2 bg-c-1'
          >
            <Icon width={22} icon='ic:baseline-edit' className='text-blue-500' />
          </button>
        </div>
      </div>

      {isShowingUpdateProjectRole && (
        <Suspense>
          <UpdateProjectRole
            isShowing={isShowingUpdateProjectRole}
            onClose={toggleShowingUpdateProjectRole}
            {...{ projectRole }}
          />
        </Suspense>
      )}
    </>
  )
}
