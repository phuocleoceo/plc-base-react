import { useContext, useState, lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'

import { GetInvitationForProjectParams } from '~/features/invitation/models'
import { ProjectInvitationRow } from '~/features/invitation/components'
import { Pagination, SpinningCircle } from '~/common/components'
import { useProjectPermission } from '~/features/project/hooks'
import { InvitationApi } from '~/features/invitation/apis'
import { InvitationPermission } from '~/shared/enums'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

const CreateProjectInvitation = lazy(() => import('~/features/invitation/components/CreateProjectInvitation'))

export default function ProjectInvitationList() {
  const projectId = Number(useParams().projectId)

  const { t } = useTranslation()
  const { hasPermission } = useProjectPermission(projectId)

  const { isShowing: isShowingCreateInvitation, toggle: toggleCreateInvitation } = useToggle()

  const { isAuthenticated } = useContext(AppContext)

  const [invitationParams, setInvitationParams] = useState<GetInvitationForProjectParams>({
    pageNumber: 1,
    pageSize: 10,
    searchValue: '',
    stillValid: false
  })

  const handleChangeParams = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvitationParams({
      ...invitationParams,
      [event.target.name]: event.target.value
    })
  }

  const handleChangePage = (newPage: number) => {
    setInvitationParams({
      ...invitationParams,
      pageNumber: newPage
    })
  }

  const { data: invitationData, isLoading: invitationLoading } = useQuery({
    queryKey: [QueryKey.ProjectInvitations, projectId, invitationParams],
    queryFn: () => InvitationApi.getInvitationForProject(projectId, invitationParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000
  })

  const invitations = invitationData?.data.data.records
  const invitationCount = invitationData?.data.data.totalRecords ?? 0

  if (invitationLoading)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 {t('loading_invitations')}...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 text-c-5 mt-6'>
        <div className='flex min-w-[43rem] justify-between'>
          <h1 className='text-xl font-semibold tracking-wide'>{t('invitations')}</h1>
          {hasPermission(InvitationPermission.Create) && (
            <button onClick={toggleCreateInvitation} className='btn'>
              {t('create_invitation')}
            </button>
          )}
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              className='w-44 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={invitationParams.searchValue}
              placeholder={t('search_invitations')}
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-60'>{t('recipient')}</div>
            <div className='w-72'>{t('email')}</div>
            <div className='w-64'>{t('status')}</div>
            <div className='flex-grow'>{t('action')}</div>
          </div>
          {invitations && invitations.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {invitations.map((invitation, idx) => (
                <ProjectInvitationRow key={idx} idx={idx} projectId={projectId} invitation={invitation} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_invitations_found')} 🚀</div>
          )}
        </div>

        <Pagination
          pageSize={invitationParams.pageSize}
          totalRecords={invitationCount}
          onChangePage={handleChangePage}
        />
      </div>

      {isShowingCreateInvitation && (
        <Suspense>
          <CreateProjectInvitation
            projectId={projectId}
            isShowing={isShowingCreateInvitation}
            onClose={toggleCreateInvitation}
          />
        </Suspense>
      )}
    </>
  )
}
