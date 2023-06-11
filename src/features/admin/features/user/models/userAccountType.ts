export type UserAccount = {
  id: number
  userAccountId: number
  email: string
  displayName: string
  phoneNumber: string
  identityNumber: string
  avatar: string
  address: string
  addressWard: string
  addressDistrict: string
  addressProvince: string
}

export type UserAccountDetail = {
  email: string
  isVerified: boolean
  isActived: boolean
  roleId: number
  roleName: string
}
