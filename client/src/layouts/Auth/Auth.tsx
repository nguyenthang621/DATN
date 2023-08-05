import { Outlet } from 'react-router-dom'
import NavbarAuth from 'src/components/Navbar/NavbarAuth/NavbarAuth'

function Auth() {
  return (
    <>
      <NavbarAuth />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Auth
