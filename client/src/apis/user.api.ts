import { User, UserEdit } from 'src/types/user.type'
import { SuccessResponseAPi } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = '/users'
const userAPI = {
  getUser: function (id: string) {
    return http.get<SuccessResponseAPi<User>>(`${URL}/${id}`)
  },
  editUser: function (body: UserEdit) {
    return http.put<SuccessResponseAPi<string>>(`${URL}`, body)
  }
}

export default userAPI
