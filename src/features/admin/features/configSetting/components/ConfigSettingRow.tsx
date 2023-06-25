import { Suspense, lazy } from 'react'

import { ConfigSetting } from '~/features/admin/features/configSetting/models'
import { useToggle } from '~/common/hooks'
import { Icon } from '@iconify/react'

const UpdateConfigSetting = lazy(() => import('~/features/admin/features/configSetting/components/UpdateConfigSetting'))

interface Props {
  idx: number
  configSetting: ConfigSetting
}

export default function ConfigSettingRow(props: Props) {
  const { idx, configSetting } = props

  const { isShowing: isShowingUpdateConfigSetting, toggle: toggleUpdateConfigSetting } = useToggle()

  return (
    <>
      <div
        key={configSetting.id}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        tabIndex={configSetting.id}
        role='button'
      >
        <div className='w-32 text-center'>{idx + 1}</div>
        <div className='w-56'>{configSetting.key}</div>
        <div className='w-60'>{configSetting.description}</div>
        <div className='w-40'>{configSetting.value}</div>
        <div className='w-56 flex-grow'>
          <div className='flex'>
            <button title='update_project_role' onClick={toggleUpdateConfigSetting} className='btn-icon bg-c-1'>
              <Icon width={22} icon='ic:baseline-edit' className='text-blue-500' />
            </button>
          </div>
        </div>
      </div>

      {isShowingUpdateConfigSetting && (
        <Suspense>
          <UpdateConfigSetting
            configSettingKey={configSetting.key}
            isShowing={isShowingUpdateConfigSetting}
            onClose={toggleUpdateConfigSetting}
          />
        </Suspense>
      )}
    </>
  )
}
