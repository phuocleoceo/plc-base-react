import { BaseResponse } from '~/shared/types'

export type GetRoleResponse = BaseResponse<
  Array<{
    name: string
    description: string
  }>
>
