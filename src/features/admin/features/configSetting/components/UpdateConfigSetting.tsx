import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { UpdateConfigSettingRequest } from '~/features/admin/features/configSetting/models'
import { ConfigSettingApi } from '~/features/admin/features/configSetting/apis'
import { InputValidation, Modal } from '~/common/components'
import { ValidationHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

interface Props {
  configSettingKey: string
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<UpdateConfigSettingRequest, 'description' | 'value'>

export default function UpdateConfigSetting(props: Props) {
  const { configSettingKey, isShowing, onClose } = props

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data: configSettingData, isLoading: isLoadingConfigSetting } = useQuery({
    queryKey: [QueryKey.ConfigSettingDetail, configSettingKey],
    queryFn: () => ConfigSettingApi.getConfigSettingDetail(configSettingKey),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const configSetting = configSettingData?.data.data

  const updateConfigSettingMutation = useMutation({
    mutationFn: (body: UpdateConfigSettingRequest) => ConfigSettingApi.updateConfigSetting(configSettingKey, body)
  })

  const handleUpdateConfigSetting = handleSubmit((form: FormData) => {
    const configSettingData: UpdateConfigSettingRequest = {
      ...form
    }

    updateConfigSettingMutation.mutate(configSettingData, {
      onSuccess: () => {
        toast.success(t('update_config_setting_success'))
        queryClient.invalidateQueries([QueryKey.ConfigSettings])
        queryClient.invalidateQueries([QueryKey.ConfigSettingDetail, configSettingKey])
        reset()
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

  return (
    <Modal
      isLoading={isLoadingConfigSetting}
      onSubmit={handleUpdateConfigSetting}
      isMutating={updateConfigSettingMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('updating_config_setting...')}
      submitLabel={t('update_config_setting')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('update_config_setting')}</span>
        </div>

        <div className='flex flex-col gap-4'>
          <InputValidation
            label={t('description')}
            placeholder={t('description...')}
            register={register('description', {
              required: {
                value: true,
                message: t('description_required')
              }
            })}
            error={errors.description as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            defaultValue={configSetting?.description}
          />

          <InputValidation
            label={t('value')}
            placeholder={t('value...')}
            register={register('value', {
              required: {
                value: true,
                message: t('value_required')
              }
            })}
            error={errors.value as FieldError}
            defaultValue={configSetting?.value.toString()}
          />
        </div>
      </>
    </Modal>
  )
}
