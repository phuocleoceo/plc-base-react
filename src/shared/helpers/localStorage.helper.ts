import { EventConstant, LocalStorageConstant } from '~/shared/constants'

export const LocalStorageEventTarget = new EventTarget()

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(LocalStorageConstant.AccessToken, accessToken)
}

export const getAccessToken = (): string => {
  return localStorage.getItem(LocalStorageConstant.AccessToken) || ''
}

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(LocalStorageConstant.RefreshToken, refreshToken)
}

export const getRefreshToken = (): string => {
  return localStorage.getItem(LocalStorageConstant.RefreshToken) || ''
}

export const setUserInfo = (userInfor: { id: number; email: string; roleId: number }) => {
  localStorage.setItem(LocalStorageConstant.UserInformation, JSON.stringify(userInfor))
}

export const getUserInfo = (): { id: number; email: string; roleId: number } => {
  const result = localStorage.getItem(LocalStorageConstant.UserInformation)
  return result ? JSON.parse(result) : null
}

export const clear = () => {
  localStorage.removeItem(LocalStorageConstant.AccessToken)
  localStorage.removeItem(LocalStorageConstant.RefreshToken)
  localStorage.removeItem(LocalStorageConstant.UserInformation)

  const clearLSEvent = new Event(EventConstant.ClearLocalStorage)
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
