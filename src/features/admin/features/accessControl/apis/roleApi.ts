import { GetRoleResponse } from '~/features/admin/features/accessControl/model'
import { HttpHelper } from '~/shared/helpers'

const roleApi = {
  getRoles() {
    return HttpHelper.get<GetRoleResponse>('roles')
  }
}

export default roleApi
