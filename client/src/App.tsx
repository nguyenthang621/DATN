import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './layouts/Auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Welcome from './pages/Welcome/Welcome'
import Admin from './layouts/Admin'
import Dashboard from './pages/Dashboard'
import { withProtectedRoute, withRejectedRoute } from './hoc/useRoute'
import NotFound from './pages/NotFound'
import SettingPage from './pages/SettingPage'
import { path } from './constants/paths'
import ManageCameras from './pages/ManageCameras'

const ProtectedDashboard = withProtectedRoute(Dashboard)
const ProtectedSettingPage = withProtectedRoute(SettingPage)
const ProtectedManageCameras = withProtectedRoute(ManageCameras)

const RejectedLogin = withRejectedRoute(Login)
const RejectedRegister = withRejectedRoute(Register)

function App() {
  return (
    <>
      <Routes>
        {/* add routes with layouts */}
        <Route path={path.home} element={<Admin />} />
        <Route path={path.auth} element={<Auth />}>
          <Route path={path.login} element={<RejectedLogin />} />
          <Route path={path.register} element={<RejectedRegister />} />
          <Route path={path.auth} element={<Navigate to={path.login} replace />} />
        </Route>

        <Route path={path.admin} element={<Admin />}>
          <Route path={path.controls} element={<ProtectedDashboard />} />
          <Route path={path.settings} element={<ProtectedSettingPage />} />
          <Route path={path.manage_cameras} element={<ProtectedManageCameras />} />
          <Route path={path.admin} element={<Navigate to={path.controls} replace />} />
        </Route>
        {/* add routes without layouts */}

        <Route path='*' element={<NotFound />} />
        {/* add redirect for first page */}
      </Routes>
    </>
  )
}

export default App
