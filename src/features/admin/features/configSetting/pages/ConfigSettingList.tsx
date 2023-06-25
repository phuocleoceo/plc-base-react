import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'

import { ConfigSettingApi } from '~/features/admin/features/configSetting/apis'
import { SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import ConfigSettingRow from '../components/ConfigSettingRow'

export default function ConfigSettingList() {
  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const { data: configSettingData, isLoading: isLoadingConfigSetting } = useQuery({
    queryKey: [QueryKey.ConfigSettings],
    queryFn: () => ConfigSettingApi.getConfigSettings(),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })

  const configSettings = configSettingData?.data.data ?? []

  if (isLoadingConfigSetting)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 {t('loading_config_settings')}...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 pb-5 pt-5 text-c-5'>
        <div className='flex min-w-[43rem] justify-between p-4'>
          <span className='text-2xl font-semibold tracking-wide'>{t('config_settings')}</span>
        </div>

        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-56'>{t('key')}</div>
            <div className='w-60'>{t('description')}</div>
            <div className='w-40'>{t('value')}</div>
            <div className='flex-grow'>{t('action')}</div>
          </div>
          {configSettings && configSettings.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {configSettings.map((configSetting, idx) => (
                <ConfigSettingRow key={configSetting.id} {...{ idx, configSetting }} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_config_settings_found')} 🚀</div>
          )}
        </div>
      </div>
    </>
  )
}
