import {
  GetPersonalProfileResponse,
  GetAnonymousProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse
} from '~/features/profile/models'
import { HttpHelper } from '~/shared/helpers'

const profileApi = {
  getPersonalProfile() {
    return HttpHelper.get<GetPersonalProfileResponse>('user/personal')
  },
  getAnonymousProfile(userId: number) {
    return HttpHelper.get<GetAnonymousProfileResponse>(`user/anonymous/${userId}`)
  },
  updateProfile(body: UpdateProfileRequest) {
    return HttpHelper.put<UpdateProfileResponse>('user/personal', body)
  }
}

export default profileApi
