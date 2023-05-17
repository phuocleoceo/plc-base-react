import {
  GetProvincesResponse,
  GetDistrictsOfProvinceResponse,
  GetWardsOfDistrictResponse,
  GetFullAddressForWardResponse
} from '~/features/address/models'
import { HttpHelper } from '~/shared/helpers'

const addressApi = {
  getProvinces() {
    return HttpHelper.get<GetProvincesResponse>('address/provinces')
  },
  getDistrictsOfProvince(provinceId: number) {
    return HttpHelper.get<GetDistrictsOfProvinceResponse>(`address/provinces/${provinceId}/districts`)
  },
  getWardsOfDistrict(districtId: number) {
    return HttpHelper.get<GetWardsOfDistrictResponse>(`address/districts/${districtId}/wards`)
  },
  getFullAddressForWard(wardId: number) {
    return HttpHelper.get<GetFullAddressForWardResponse>(`address/full-address/${wardId}`)
  }
}

export default addressApi
