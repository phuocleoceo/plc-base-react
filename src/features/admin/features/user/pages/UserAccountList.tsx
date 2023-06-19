import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'

import { GetUserAccountsParams } from '~/features/admin/features/user/models'
import { UserAccountApi } from '~/features/admin/features/user/apis'
import { UserRow } from '~/features/admin/features/user/components'
import { Pagination, SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function UserAccountList() {
  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const [userAccountParams, setUserAccountParams] = useState<GetUserAccountsParams>({
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
    queryKey: [QueryKey.UserAccounts, userAccountParams],
    queryFn: () => UserAccountApi.getUserAccounts(userAccountParams),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const users = userData?.data.data.records ?? []
  const userCount = userData?.data.data.totalRecords ?? 0

  if (isLoadingUser)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 {t('loading_user_accounts')}...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 pb-5 pt-5 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <span className='text-2xl font-semibold tracking-wide'>{t('users')}</span>
        </div>
        <div className='mt-3'>
          <div className='relative'>
            <input
              className='w-44 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={userAccountParams.searchValue}
              placeholder={t('search_users')}
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-16'></div>
            <div className='w-60'>{t('email')}</div>
            <div className='w-56'>{t('name')}</div>
            <div className='w-32'>{t('phone_number')}</div>
            <div className='w-32'>{t('identity_number')}</div>
            <div className='flex-grow'>{t('address')}</div>
          </div>
          {users && users.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {users.map((user, idx) => (
                <UserRow key={idx} {...{ idx, user }} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_users_found')} 🚀</div>
          )}
        </div>

        <Pagination pageSize={userAccountParams.pageSize} totalRecords={userCount} onChangePage={handleChangePage} />
      </div>
    </>
  )
}
