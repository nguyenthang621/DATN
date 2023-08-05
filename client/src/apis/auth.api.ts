import { authenticationPath } from 'src/constants/paths'
import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

const auth = {
  loginAccount: function (body: { email: string; password: string }) {
    return http.post<AuthResponse>(authenticationPath.login, body)
  },
  registerAccount: function (body: { email: string; password: string }) {
    return http.post<AuthResponse>(authenticationPath.register, body)
  },
  logoutAccount: function () {
    return http.post('/logout')
  },
  refreshToken: function () {
    try {
      const refresh_token = localStorage.getItem('refresh_token')
      return http.post('/refresh-token', { refresh_token })
    } catch (error) {
      localStorage.clear()
      throw error
    }
  }
}

export default auth
