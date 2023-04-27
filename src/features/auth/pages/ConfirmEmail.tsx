import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { ConfirmEmailRequest } from '~/features/auth/models'
import { SpinningCircle } from '~/common/components'
import { useQueryParams } from '~/common/hooks'
import { AuthAPI } from '~/features/auth/apis'

import StarIMG from '~/assets/img/star.png'
import SadIMG from '~/assets/img/sad.png'

export default function ConfirmEmail() {
  // Avoid call api 2 times
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(true)
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

  const queryParams = useQueryParams()
  const { t } = useTranslation()

  const confirmEmailMutation = useMutation({
    mutationFn: (body: ConfirmEmailRequest) => AuthAPI.confirmEmail(body)
  })

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (isMounted) {
      confirmEmailMutation.mutate(
        { userId: parseInt(queryParams.userId), code: queryParams.code },
        {
          onSettled: () => setIsVerifying(false),
          onSuccess: () => setIsConfirmed(true),
          onError: () => setIsConfirmed(false)
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  return (
    <div className='mb-12 w-96 max-w-[24rem]'>
      <div className='w-full rounded-md bg-white py-12 px-6 block'>
        <div className='h-[48vh] place-items-center grid'>
          {isVerifying && (
            <>
              <h2 className='text-center text-3xl font-medium text-gray-800 mb-10'>{t('verifying')}</h2>
              <SpinningCircle height={200} width={200} />
            </>
          )}

          {!isVerifying && (
            <>
              {isConfirmed ? (
                <>
                  <h2 className='text-center text-3xl font-medium text-gray-800 mb-10'>{t('verification_success')}</h2>
                  <img width='70%' height='auto' src={StarIMG} alt='star' />
                </>
              ) : (
                <>
                  <h2 className='text-center text-3xl font-medium text-gray-800 mb-10'>{t('verification_failed')}</h2>
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
