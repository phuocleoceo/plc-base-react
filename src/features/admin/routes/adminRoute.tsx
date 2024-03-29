import { Navigate, RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { RequiredAdminRoute } from '~/common/routings/guardRoute'
import { AdminLayout } from '~/features/admin/layouts'

const UserAccountList = lazy(() => import('~/features/admin/features/user/pages/UserAccountList'))
const ConfigSettingList = lazy(() => import('~/features/admin/features/configSetting/pages/ConfigSettingList'))
const ProjectRoleList = lazy(() => import('~/features/admin/features/projectRole/pages/ProjectRoleList'))

export const adminRoute: RouteObject[] = [
  {
    path: 'admin',
    element: <RequiredAdminRoute />,
    children: [
      {
        path: '',
        element: <Navigate to='setting' />
      },
      {
        path: 'user',
        element: (
          <AdminLayout>
            <Suspense>
              <UserAccountList />
            </Suspense>
          </AdminLayout>
        )
      },
      {
        path: 'project-role',
        element: (
          <AdminLayout>
            <Suspense>
              <ProjectRoleList />
            </Suspense>
          </AdminLayout>
        )
      },
      {
        path: 'setting',
        element: (
          <AdminLayout>
            <Suspense>
              <ConfigSettingList />
            </Suspense>
          </AdminLayout>
        )
      }
    ]
  }
]
