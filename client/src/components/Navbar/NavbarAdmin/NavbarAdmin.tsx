import Popover from 'src/components/Popover'
import { handleGenTitleNavbar } from '../../../utils/utils'
import { Link } from 'react-router-dom'
import { path } from 'src/constants/paths'
import { useMutation } from '@tanstack/react-query'
import auth from 'src/apis/auth.api'
import { useContext } from 'react'
import { AppContext } from 'src/Context/app.context'

export default function NavbarAdmin() {
  const { setIsAuthenticated, profile } = useContext(AppContext)
  const logoutMutate = useMutation({
    mutationFn: auth.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
    }
  })
  const handleLogout = () => {
    logoutMutate.mutate()
  }

  return (
    <>
      {/* Navbar */}
      <nav className='absolute left-0 top-0 z-10 flex w-full items-center bg-transparent p-4 md:flex-row md:flex-nowrap md:justify-start'>
        <div className='mx-autp flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10'>
          {/* Brand */}
          <a
            className='hidden text-sm font-semibold uppercase text-white lg:inline-block'
            href='#pablo'
            onClick={(e) => e.preventDefault()}
          >
            {handleGenTitleNavbar()}
          </a>
          {/* Form */}
          <form className='mr-3 hidden flex-row flex-wrap items-center md:flex lg:ml-auto'>
            <div className='relative flex w-full flex-wrap items-stretch'>
              <span className='absolute z-10 h-full w-8 items-center justify-center rounded bg-transparent py-3 pl-3 text-center text-base font-normal leading-snug text-blueGray-300'>
                <i className='fas fa-search'></i>
              </span>
              <input
                type='text'
                placeholder='Search here...'
                className='relative w-full rounded border-0 bg-white px-3 py-3 pl-10 text-sm text-blueGray-600 placeholder-blueGray-300 shadow outline-none focus:outline-none focus:ring'
              />
            </div>
          </form>
          {/* User */}
          {/* <UserDropdown /> */}
          <Popover
            offsetInput={4}
            renderPopover={
              <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                <Link
                  to={path.settings}
                  className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to={path.manage_cameras}
                  className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Camera của tôi
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className='h-12 w-12 cursor-pointer overflow-hidden rounded-full bg-slate-400'>
              <div className='flex h-full w-full items-center justify-center'>
                {profile?.avatar ? (
                  <img src={profile.avatar} alt='avatar' className='h-full w-full object-cover' />
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6 text-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                    />
                  </svg>
                )}
              </div>
            </div>
          </Popover>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  )
}
