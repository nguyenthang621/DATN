import axios, { AxiosInstance, HttpStatusCode } from 'axios'
import env from 'src/constants/env'
import { User } from 'src/types/user.type'
import { LocalStorage } from './localStorage'
import { path } from 'src/constants/paths'
import { AuthResponse } from 'src/types/auth.type'
import { toast } from 'react-toastify'
import auth from 'src/apis/auth.api'

class Http {
  instance: AxiosInstance
  private accessToken: string | null
  private refreshToken: string | null
  private profile: User | null
  private refreshTokenRequest: any
  private handleLogout: () => void

  constructor() {
    this.accessToken = LocalStorage.getItemStorage('access_token')
    this.refreshToken = LocalStorage.getItemStorage('refresh_token')
    this.profile = JSON.parse(LocalStorage.getItemStorage('profile') as string)
    this.instance = axios.create({
      baseURL: env.BASE_API,
      timeout: 7000,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    this.refreshTokenRequest = null
    this.handleLogout = () => {
      this.accessToken = null
      this.refreshToken = null
      this.profile = null
      LocalStorage.clear()
      window.location.href = '/auth'
    }
    // Add a request interceptor
    this.instance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.authorization = this.accessToken
        return config
      }
      return config
    })

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          this.profile = data.data.user

          LocalStorage.setItemStorage('access_token', this.accessToken)
          LocalStorage.setItemStorage('refresh_token', this.refreshToken)
          LocalStorage.setItemStorage('profile', JSON.stringify(this.profile))
        } else if (url === path.logout) {
          this.handleLogout()
        }
        return response
      },
      (error) => {
        if (error?.response?.status === HttpStatusCode.InternalServerError) {
          const data: any | undefined = error.response?.data
          if (!data) {
            toast.error('Server có lỗi.')
            return Promise.reject(error)
          }
          const message = data.message || error.message
          toast.error(message)
        }
        // Xử lý refresh token
        else if (error.response.status === 401 && error.response.data.message === 'EXPIRED_ACCESS_TOKEN') {
          this.refreshTokenRequest = this.refreshTokenRequest
            ? this.refreshTokenRequest
            : auth.refreshToken().finally(() => {
                this.refreshTokenRequest = null
              })
          //
          return this.refreshTokenRequest
            .then((data: any) => {
              const { access_token, refresh_token } = data.data
              this.accessToken = access_token
              this.refreshToken = refresh_token
              localStorage.setItem('access_token', access_token)
              localStorage.setItem('refresh_token', refresh_token)

              error.response.config.Authorization = `Bearer ${access_token}`
              return this.instance(error.response.config) // tiếp tục gọi api
            })
            .catch((refreshTokenError: any) => {
              throw refreshTokenError
            })
        } else if (error.response.status === 401 && error.response.data.form === 'REDIRECT_LOGIN') {
          this.handleLogout()
          return
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
