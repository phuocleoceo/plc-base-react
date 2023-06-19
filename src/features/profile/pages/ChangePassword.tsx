import { FieldError, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { ChangePasswordRequest } from '~/features/auth/models'
import { InputValidation } from '~/common/components'
import { ValidationHelper } from '~/shared/helpers'
import { AuthAPI } from '~/features/auth/apis'
import { ProfileTab } from '~/shared/enums'

interface Props {
  onChangeTab: (newTab: ProfileTab) => void
}

type FormData = Pick<ChangePasswordRequest, 'oldPassword' | 'newPassword'>

export default function ChangePassword(props: Props) {
  const { onChangeTab } = props

  const { t } = useTranslation()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const changePasswordMutation = useMutation({
    mutationFn: (body: ChangePasswordRequest) => AuthAPI.changePassword(body)
  })

  const handleChangePassword = handleSubmit((form: FormData) => {
    const changePasswordData: ChangePasswordRequest = {
      ...form
    }

    changePasswordMutation.mutate(changePasswordData, {
      onSuccess: () => {
        toast.success(t('change_password_success'))
        onChangeTab(ProfileTab.ProfileDetail)
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  return (
    <form onSubmit={handleChangePassword}>
      <h2 className='mt-2 text-2xl text-c-text text-center'>{t('change_password')}</h2>

      <div className='mt-5 ml-2 flex w-[16.5rem] flex-col gap-4'>
        <InputValidation
          label={t('old_password')}
          placeholder={t('enter_old_password...')}
          register={register('oldPassword', {
            required: {
              value: true,
              message: t('old_password_required')
            }
          })}
          error={errors.oldPassword as FieldError}
          type='password'
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <InputValidation
          label={t('new_password')}
          placeholder={t('enter_new_password...')}
          register={register('newPassword', {
            required: {
              value: true,
              message: t('new_password_required')
            }
          })}
          error={errors.newPassword as FieldError}
          type='password'
        />
      </div>

      <div className='mt-5 text-center'>
        <button type='submit' className='btn w-40'>
          {isSubmitting ? t('changing_password...') : t('change_password')}
        </button>
        <button onClick={() => onChangeTab(ProfileTab.ProfileDetail)} className='mt-3 btn w-40'>
          {t('go_back')}
        </button>
      </div>
    </form>
  )
}
