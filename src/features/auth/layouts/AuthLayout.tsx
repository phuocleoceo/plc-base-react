import { useTranslation } from 'react-i18next'

interface Props {
  children?: React.ReactNode
}
export default function AuthLayout({ children }: Props) {
  const { t } = useTranslation()

  return (
    <div className='bg-jira-gradient flex h-fit min-h-screen w-full flex-col items-center'>
      <div className='mx-auto my-12 w-11/12 max-w-[40rem] tracking-wide text-white'>
        <h1 className='text-center text-xl font-medium sm:text-2xl lg:text-4xl lg:font-semibold'>
          {t('welcome_message')}
        </h1>
      </div>
      {children}
    </div>
  )
}
