import { Outlet, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import HeaderStats from 'src/components/Headers/HeaderStats'
import ModalCamera from 'src/components/Modal/ModalCamera'
import ModalConfirm from 'src/components/Modal/ModalConfirm/ModalConfirm'
import NavbarAdmin from 'src/components/Navbar/NavbarAdmin'
import Sidebar from 'src/components/Sidebar/Sidebar'
import env from 'src/constants/env'
import { useContext, useEffect } from 'react'
import { AppContext } from 'src/Context/app.context'
import ModalAdvance from 'src/components/Modal/ModalAdvance'

function Admin() {
  const { setSocket } = useContext(AppContext)
  const location = useLocation()
  const currentPath = location.pathname
  useEffect(() => {
    const socket = io(env.BASE_SOCKET)
    if (socket) setSocket(socket)
  }, [])
  return (
    <div className='relative'>
      <ModalConfirm />
      <ModalCamera />
      <ModalAdvance />

      <Sidebar currentPath={currentPath} />
      <div className='relative bg-blueGray-100 md:ml-64'>
        <NavbarAdmin />
        {/* Header */}
        <HeaderStats currentPath={currentPath} />
        <h1 className='-m-24 mx-auto w-full px-4 md:px-10'>
          <Outlet />
        </h1>
      </div>
    </div>
  )
}

export default Admin
