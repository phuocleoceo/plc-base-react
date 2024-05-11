import { EventConstant, LocalStorageKey } from '~/shared/constants'

export const LocalStorageEventTarget = new EventTarget()

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(LocalStorageKey.AccessToken, accessToken)
}

export const getAccessToken = (): string => {
  return localStorage.getItem(LocalStorageKey.AccessToken) || ''
}

export const removeAccessToken = () => {
  localStorage.removeItem(LocalStorageKey.AccessToken)
}

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(LocalStorageKey.RefreshToken, refreshToken)
}

export const getRefreshToken = (): string => {
  return localStorage.getItem(LocalStorageKey.RefreshToken) || ''
}

export const removeRefreshToken = () => {
  localStorage.removeItem(LocalStorageKey.RefreshToken)
}

export const setUserRole = (role: string) => {
  localStorage.setItem(LocalStorageKey.Role, role)
}

export const getUserRole = (): string => {
  const result = localStorage.getItem(LocalStorageKey.Role)
  return result || ''
}

export const setUserInfo = (userInfor: { id: number; email: string; roleId: number }) => {
  localStorage.setItem(LocalStorageKey.UserInformation, JSON.stringify(userInfor))
}

export const getUserInfo = (): { id: number; email: string; roleId: number } => {
  const result = localStorage.getItem(LocalStorageKey.UserInformation)
  return result ? JSON.parse(result) : null
}

export const clear = () => {
  localStorage.removeItem(LocalStorageKey.AccessToken)
  localStorage.removeItem(LocalStorageKey.RefreshToken)
  localStorage.removeItem(LocalStorageKey.UserInformation)

  const clearLSEvent = new Event(EventConstant.ClearLocalStorage)
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
