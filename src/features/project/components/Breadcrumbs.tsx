import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

import { useCurrentProject } from '~/features/project/hooks'

export default function Breadcrumbs() {
  const location = useLocation()
  const fragments = location.pathname.slice(1).split('/')
  const projectId = Number(fragments[1])

  const { t } = useTranslation()

  const { currentProject } = useCurrentProject(projectId)

  return (
    <div className='mt-5 min-w-max px-8 text-c-text sm:px-10'>
      <Link to='/project' className='hover:underline'>
        {t('project')}
      </Link>

      {fragments[1] && (
        <>
          <Icon className='mx-2 inline text-xl' icon='ei:chevron-right' />
          <Link to={`/project/${fragments[1]}/setting`} className='hover:underline'>
            {currentProject?.name ?? 'undefined'}
          </Link>
        </>
      )}
      {fragments[2] && (
        <>
          <Icon className='mx-2 inline text-xl' icon='ei:chevron-right' />
          <Link to={`/project/${fragments[1]}/board`} className='hover:underline'>
            {t('kanban_board')}
          </Link>
        </>
      )}
    </div>
  )
}
