import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { SubmitPaymentRequest } from '~/features/profile/models'
import { SpinningCircle } from '~/common/components'
import { PaymentApi } from '~/features/profile/apis'
import { useQueryParams } from '~/common/hooks'

import StarIMG from '~/assets/img/star.png'
import SadIMG from '~/assets/img/sad.png'

export default function PaymentCallback() {
  // Avoid call api 2 times
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isHandling, setIsHandling] = useState<boolean>(true)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const queryParams = useQueryParams()
  const { t } = useTranslation()

  const submitPaymentMutation = useMutation({
    mutationFn: (body: SubmitPaymentRequest) => PaymentApi.submitPayment(body)
  })

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (isMounted) {
      const paymentData: SubmitPaymentRequest = {
        vnp_Amount: parseFloat(queryParams.vnp_Amount),
        vnp_BankCode: queryParams.vnp_BankCode,
        vnp_BankTranNo: queryParams.vnp_BankTranNo,
        vnp_CardType: queryParams.vnp_CardType,
        vnp_OrderInfo: queryParams.vnp_OrderInfo,
        vnp_PayDate: parseFloat(queryParams.vnp_PayDate),
        vnp_ResponseCode: queryParams.vnp_ResponseCode,
        vnp_TmnCode: queryParams.vnp_TmnCode,
        vnp_TransactionNo: queryParams.vnp_TransactionNo,
        vnp_TransactionStatus: queryParams.vnp_TransactionStatus,
        vnp_TxnRef: parseFloat(queryParams.vnp_TxnRef),
        vnp_SecureHash: queryParams.vnp_SecureHash
      }

      window.history.pushState({}, '', 'payment/callback')

      submitPaymentMutation.mutate(paymentData, {
        onSettled: () => setIsHandling(false),
        onSuccess: () => setIsSuccess(true),
        onError: () => setIsSuccess(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  return (
    <div className='mb-12 w-96 max-w-[24rem]'>
      <div className='w-full rounded-md bg-white py-12 px-6 block'>
        <div className='h-[48vh] place-items-center grid'>
          {isHandling && (
            <>
              <h2 className='text-center text-3xl font-medium text-gray-800 mb-10'>{t('handling_payment')}...</h2>
              <SpinningCircle height={200} width={200} />
            </>
          )}

          {!isHandling && (
            <>
              {isSuccess ? (
                <>
                  <h2 className='text-center text-3xl font-medium text-gray-800 mb-10'>{t('payment_success')}</h2>
                  <img width='70%' height='auto' src={StarIMG} alt='star' />
                </>
              ) : (
                <>
                  <h2 className='text-center text-3xl font-medium text-gray-800 mb-10'>{t('payment_failed')}</h2>
                  <img width='70%' height='auto' src={SadIMG} alt='sad' />
                </>
              )}

              <hr className='mt-6 border-t-[.5px] border-gray-400' />
              <Link className='btn mt-4 w-full bg-[#321898] py-2' to='/'>
                <span className='block text-center'>{t('go_back')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
