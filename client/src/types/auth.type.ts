import { User } from './user.type'
import { SuccessResponseAPi } from './utils.type'

export type AuthResponse = SuccessResponseAPi<{
  access_token: string
  refresh_token: string
  user: User
}>

export interface refreshResponse {
  success: boolean
  access_token: string
  refresh_token: string
}
