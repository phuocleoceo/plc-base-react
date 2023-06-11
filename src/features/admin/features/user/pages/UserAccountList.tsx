import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'

import { GetUserAccountListParams } from '~/features/admin/user/models'
import { UserAccountApi } from '~/features/admin/user/apis'
import { Pagination, SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function UserAccountList() {
  const { isAuthenticated } = useContext(AppContext)

  const [userAccountParams, setUserAccountParams] = useState<GetUserAccountListParams>({
    pageNumber: 1,
    pageSize: 10,
    searchValue: ''
  })

  const handleChangeParams = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAccountParams({
      ...userAccountParams,
      [event.target.name]: event.target.value
    })
  }

  const handleChangePage = (newPage: number) => {
    setUserAccountParams({
      ...userAccountParams,
      pageNumber: newPage
    })
  }

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: [QueryKey.Projects, userAccountParams],
    queryFn: () => UserAccountApi.getUserAccountListProject(userAccountParams),
    keepPreviousData: true,
    enabled: isAuthenticated
  })

  const users = userData?.data.data.records ?? []
  const userCount = userData?.data.data.totalRecords ?? 0

  if (isLoadingUser)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 loading_user_accounts...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 pb-10 pt-12 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <span className='text-2xl font-semibold tracking-wide'>users</span>
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              className='w-44 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={userAccountParams.searchValue}
              placeholder='search_users'
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-40'>image</div>
            <div className='w-40'>key</div>
            <div className='w-80'>name</div>
            <div className='flex-grow'>leader</div>
          </div>
          {/* {projects && projects.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {projects.map((project, idx) => (
                <ProjectRow key={idx} idx={idx} project={project} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>no_projects_found 🚀</div>
          )} */}
        </div>

        <Pagination pageSize={userAccountParams.pageSize} totalRecords={userCount} onChangePage={handleChangePage} />
      </div>
    </>
  )
}
