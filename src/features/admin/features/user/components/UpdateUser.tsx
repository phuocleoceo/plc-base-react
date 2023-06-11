import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { UpdateUserAccountRequest } from '~/features/admin/features/user/models'
import { RoleApi } from '~/features/admin/features/accessControl/apis'
import { UserAccountApi } from '~/features/admin/features/user/apis'
import { ValidationHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { Modal } from '~/common/components'

interface Props {
  userId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<UpdateUserAccountRequest, 'roleId' | 'isActived'>

export default function IssueDetail(props: Props) {
  const { userId, isShowing, onClose } = props

  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const {
    control,
    setError,
    register,
    handleSubmit,
    formState: { errors }
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
        toast.success('update_user_success')
        queryClient.invalidateQueries([QueryKey.UserAccounts])
        // queryClient.invalidateQueries([QueryKey.UserAccountDetail])
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

  const roles = roleData?.data.data

  return (
    <>
      <Modal isLoading={isLoadingUser || isLoadingRole} {...{ isShowing, onClose }} className='max-w-[65rem]'>
        <>{user?.email}</>
      </Modal>
    </>
  )
}
