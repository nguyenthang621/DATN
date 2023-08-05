export interface SuccessResponseAPi<Data> {
  success: boolean
  data: Data
}

export interface ErrorResponseApi {
  success: boolean
  message: string
  error: string
  form?: string
}
