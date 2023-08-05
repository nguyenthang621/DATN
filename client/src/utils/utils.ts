import axios, { AxiosError, HttpStatusCode } from 'axios'
import { useLocation } from 'react-router-dom'
import { titleNavbar } from 'src/constants/constants'

// type predicate
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isUnauthorizedError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return (
    isAxiosError(error) &&
    (error.response?.status === HttpStatusCode.BadRequest ||
      error.response?.status === HttpStatusCode.Unauthorized ||
      error.response?.status === HttpStatusCode.Forbidden ||
      error.response?.status === HttpStatusCode.Conflict)
  )
}

export function generateUUID() {
  let d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() // sử dụng hiệu năng hiện tại nếu có
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

type keyTitle = 'maps' | 'manage_users' | 'settings' | 'controls' | 'manage_cameras'
export const handleGenTitleNavbar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  let keyTitle: string[] = currentPath.split('admin/')
  return titleNavbar[keyTitle[1] as keyTitle]
}
