import { SuccessResponseAPi } from './utils.type'

export interface formDataCamera {
  user_id: string
  name: string
  ip_address: string
  camera_id?: string
  location?: string
}

export interface Camera {
  id: string
  name: string
  ip_address?: string
  location?: string
  createAt?: string
  receiver?: string
  user_follow?: number
}

export type CameraResponse = SuccessResponseAPi<Camera[]>

export type CameraResponsePost = SuccessResponseAPi<{
  message: string
}>
