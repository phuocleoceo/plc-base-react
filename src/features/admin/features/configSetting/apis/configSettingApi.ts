import {
  GetConfigSettingsResponse,
  GetConfigSettingResponse,
  UpdateConfigSettingRequest,
  UpdateConfigSettingResponse
} from '~/features/admin/features/configSetting/models'
import { HttpHelper } from '~/shared/helpers'

const configSettingApi = {
  getConfigSettings() {
    return HttpHelper.get<GetConfigSettingsResponse>('config-setting')
  },
  getConfigSettingDetail(key: string) {
    return HttpHelper.get<GetConfigSettingResponse>(`config-setting/${key}`)
  },
  updateConfigSetting(key: string, body: UpdateConfigSettingRequest) {
    return HttpHelper.put<UpdateConfigSettingResponse>(`config-setting/${key}`, body)
  }
}

export default configSettingApi
