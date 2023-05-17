import { BaseResponse } from '~/shared/types'

export type GetProvincesResponse = BaseResponse<
  Array<{
    id: number
    name: string
  }>
>

export type GetDistrictsOfProvinceResponse = BaseResponse<
  Array<{
    id: number
    name: string
  }>
>

export type GetWardsOfDistrictResponse = BaseResponse<
  Array<{
    id: number
    name: string
  }>
>

export type GetFullAddressForWardResponse = BaseResponse<{
  ward: string
  district: string
  province: string
}>
