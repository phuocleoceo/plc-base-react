import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '@iconify/react'
import { useContext } from 'react'

import { ProjectApi } from '~/features/project/apis'
import { AppContext } from '~/common/contexts'

export default function Breadcrumbs() {
  const location = useLocation()
  const fragments = location.pathname.slice(1).split('/')

  const { isAuthenticated } = useContext(AppContext)

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => ProjectApi.getProjectById(Number(fragments[1]) ?? -1),
    enabled: isAuthenticated
  })

  const project = data?.data.data

  return (
    <div className='mt-8 mb-4 min-w-max px-8 text-c-text sm:px-10'>
      <Link to='/project' className='hover:underline'>
        project
      </Link>
      {fragments[1] && (
        <>
          <Icon className='mx-2 inline text-xl' icon='ei:chevron-right' />
          <Link to={'/project/' + fragments[1]} className='hover:underline'>
            {project?.name ?? 'undefined'}
          </Link>
        </>
      )}
      {fragments[2] && (
        <>
          <Icon className='mx-2 inline text-xl' icon='ei:chevron-right' />
          <Link to={`/project/${fragments[1]}/board`} className='hover:underline'>
            Kanban board
          </Link>
        </>
      )}
    </div>
  )
}
