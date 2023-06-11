import { BaseResponse } from '~/shared/types'

export type GetRoleResponse = BaseResponse<
  Array<{
    id: number
    name: string
    description: string
  }>
>
