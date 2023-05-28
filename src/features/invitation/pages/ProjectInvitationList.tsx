import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'

import { CreateProjectInvitation, ProjectInvitationRow } from '~/features/invitation/components'
import { GetInvitationForProjectParams } from '~/features/invitation/models'
import { Pagination, SpinningCircle } from '~/common/components'
import { InvitationApi } from '~/features/invitation/apis'
import { AppContext } from '~/common/contexts'
import { useShowing } from '~/common/hooks'

export default function ProjectInvitationList() {
  const projectId = Number(useParams().projectId)
  const { isShowing: isShowingCreateInvitation, toggle: toggleCreateInvitation } = useShowing()

  const { isAuthenticated } = useContext(AppContext)

  const [invitationParams, setInvitationParams] = useState<GetInvitationForProjectParams>({
    pageNumber: 1,
    pageSize: 10,
    searchValue: '',
    stillValid: true
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
    queryKey: ['projectInvitations', projectId, invitationParams],
    queryFn: () => InvitationApi.getInvitationForProject(projectId, invitationParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1000
  })

  const invitations = invitationData?.data.data.records
  const invitationCount = invitationData?.data.data.totalRecords ?? 0

  if (invitationLoading)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 loading_project_members...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <h1 className='text-xl font-semibold tracking-wide'>invitations</h1>
          <button onClick={toggleCreateInvitation} className='btn'>
            create_invitation
          </button>
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              className='w-44 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={invitationParams.searchValue}
              placeholder='search_invitations'
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-60'>name</div>
            <div className='w-72'>email</div>
            <div className='w-64'>status</div>
            <div className='flex-grow'>action</div>
          </div>
          {invitations && invitations.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {invitations.map((invitation, idx) => (
                <ProjectInvitationRow
                  key={idx}
                  idx={idx}
                  invitationId={invitation.invitationId}
                  recipientId={invitation.recipientId}
                  recipientName={invitation.recipientName}
                  recipientEmail={invitation.recipientEmail}
                  recipientAvatar={invitation.recipientAvatar}
                  acceptedAt={invitation.acceptedAt}
                  declinedAt={invitation.declinedAt}
                  projectId={projectId}
                />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>no_invitations_found 🚀</div>
          )}
        </div>

        <Pagination
          pageSize={invitationParams.pageSize}
          totalRecords={invitationCount}
          onChangePage={handleChangePage}
        />
      </div>
      <CreateProjectInvitation
        projectId={projectId}
        isShowing={isShowingCreateInvitation}
        onClose={toggleCreateInvitation}
      />
    </>
  )
}
