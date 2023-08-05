export interface User {
  id: string
  fullName: string
  email: string
  avatar?: string | null
  createAt?: string | null
  gender?: string | null
  address?: string | null
  phoneNumber?: string | null
  role?: string | null
  token?: string | null
  updateAt?: string | null
}

export interface UserEdit {
  fullName: string
  email: string
  phoneNumber?: string | null
  address?: string | null
  avatar?: string | null
}
