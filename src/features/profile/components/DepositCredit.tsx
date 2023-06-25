import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { useTranslation } from 'react-i18next'

import { CreatePaymentRequest } from '~/features/profile/models'
import { InputValidation, Modal } from '~/common/components'
import { PaymentApi } from '~/features/profile/apis'
import { ValidationHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'

interface Props {
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreatePaymentRequest, 'amount'>

export default function DepositCredit(props: Props) {
  const { isShowing, onClose } = props

  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const createPaymentMutation = useMutation({
    mutationFn: (body: CreatePaymentRequest) => PaymentApi.createPayment(body)
  })

  const handleCreatePayment = handleSubmit((form: FormData) => {
    const paymentData: CreatePaymentRequest = {
      ...form
    }

    createPaymentMutation.mutate(paymentData, {
      onSuccess: () => {
        toast.success(t('create_invitation_success'))
        queryClient.invalidateQueries([QueryKey.ProjectInvitations])
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
      onSubmit={handleCreatePayment}
      isMutating={createPaymentMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('making_payment...')}
      submitLabel={t('make_payment')}
      {...{ isShowing, onClose }}
      className='max-w-[25rem]'
    >
      <>
        <div className='mb-4'>
          <span className='text-[22px] font-[600] text-c-text'>{t('create_payment')}</span>
        </div>
        <div className='flex flex-col gap-4'>
          <InputValidation
            label={t('amount')}
            placeholder={t('amount...')}
            register={register('amount', {
              required: {
                value: true,
                message: t('amount_required')
              }
            })}
            error={errors.amount as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </div>
      </>
    </Modal>
  )
}
