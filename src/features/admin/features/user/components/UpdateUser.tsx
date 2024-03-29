import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { LabelWrapper, Modal, SelectBox, SwitchToggle } from '~/common/components'
import { UpdateUserAccountRequest } from '~/features/admin/features/user/models'
import { RoleApi } from '~/features/admin/features/accessControl/apis'
import { UserAccountApi } from '~/features/admin/features/user/apis'
import { ValidationHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { SelectItem } from '~/shared/types'

interface Props {
  userId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<UpdateUserAccountRequest, 'roleId' | 'isActived'>

export default function UpdateUser(props: Props) {
  const { userId, isShowing, onClose } = props

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const {
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>()

  const updateUserMutation = useMutation({
    mutationFn: (body: UpdateUserAccountRequest) => UserAccountApi.updateUserAccount(userId, body)
  })

  const handleUpdateUser = handleSubmit((form: FormData) => {
    const userData: UpdateUserAccountRequest = {
      ...form
    }

    updateUserMutation.mutate(userData, {
      onSuccess: () => {
        toast.success(t('update_user_success'))
        queryClient.invalidateQueries([QueryKey.UserAccounts])
        queryClient.invalidateQueries([QueryKey.UserAccountDetail, userId])
        onClose()
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: [QueryKey.UserAccountDetail, userId],
    queryFn: () => UserAccountApi.getUserAccountDetail(userId),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const user = userData?.data.data

  const { data: roleData, isLoading: isLoadingRole } = useQuery({
    queryKey: [QueryKey.Roles],
    queryFn: () => RoleApi.getRoles(),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const roles: SelectItem[] =
    roleData?.data.data.map((r) => ({
      label: `${r.name} - ${r.description}`,
      value: r.id.toString()
    })) || []

  return (
    <>
      <Modal
        isLoading={isLoadingUser || isLoadingRole}
        onSubmit={handleUpdateUser}
        isMutating={updateUserMutation.isLoading || isSubmitting}
        closeLabel={t('cancle')}
        submittingLabel={t('updating_user...')}
        submitLabel={t('update_user')}
        {...{ isShowing, onClose }}
        className='max-w-[30rem]'
      >
        <>
          <div className='mt-1 mb-6'>
            <span className='text-[20px] font-[600] text-c-text'>{`${t('update_user')} ${user?.email}`}</span>
          </div>

          <div className='flex justify-around'>
            <LabelWrapper label={t('role')} margin='mt-0'>
              <SelectBox
                control={control}
                controlField='roleId'
                selectList={roles}
                defaultValue={user?.roleId.toString()}
                className='w-full'
              />
            </LabelWrapper>

            <LabelWrapper label={t('is_actived')} margin='mt-0'>
              <SwitchToggle
                control={control}
                controlField='isActived'
                defaultValue={user?.isActived}
                className='mt-2'
              />
            </LabelWrapper>

            <LabelWrapper label={t('is_verified')} margin='mt-0'>
              <SwitchToggle defaultValue={user?.isVerified} readonly={true} className='mt-2' />
            </LabelWrapper>
          </div>
        </>
      </Modal>
    </>
  )
}
