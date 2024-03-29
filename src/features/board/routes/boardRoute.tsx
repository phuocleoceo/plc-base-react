import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { ProjectLayout } from '~/features/project/layouts'
import { BoardProvider } from '~/features/board/contexts'

const ProjectBoard = lazy(() => import('~/features/board/pages/ProjectBoard'))

export const projectBoardRoute: RouteObject[] = [
  {
    path: 'board',
    element: (
      <ProjectLayout>
        <Suspense>
          <BoardProvider>
            <ProjectBoard />
          </BoardProvider>
        </Suspense>
      </ProjectLayout>
    )
  }
]
