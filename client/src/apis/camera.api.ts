import { CameraResponse, CameraResponsePost, formDataCamera } from 'src/types/camera.type'
import http from 'src/utils/http'

const cameraAPI = {
  insertCamera: function (body: formDataCamera) {
    return http.post<CameraResponsePost>('/camera', body)
  },
  editCamera: function (body: formDataCamera) {
    return http.patch<CameraResponsePost>('/camera', body)
  },
  getAllCamera: function (user_id: string) {
    return http.get<CameraResponse>(`/camera/${user_id}`)
  },
  deleteCamera: function (camera_id: string) {
    return http.delete<CameraResponsePost>(`/camera/${camera_id}`)
  },
  changeReceiverCamera: function (body: { camera_id: string; receiver_email: string }) {
    return http.post<CameraResponsePost>('/camera/receiver_mail', body)
  }
}

export default cameraAPI
