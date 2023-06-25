import { BaseResponse } from '~/shared/types'
import { ConfigSetting } from './configSetttingType'

export type GetConfigSettingsResponse = BaseResponse<Array<ConfigSetting>>

export type GetConfigSettingResponse = BaseResponse<ConfigSetting>

export type UpdateConfigSettingRequest = {
  description: string
  value: number
}

export type UpdateConfigSettingResponse = BaseResponse<boolean>
