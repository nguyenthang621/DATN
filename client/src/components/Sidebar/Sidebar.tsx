import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from 'src/Context/app.context'
import auth from 'src/apis/auth.api'
import { path } from 'src/constants/paths'

interface Props {
  currentPath: string
}

export default function Sidebar({ currentPath }: Props) {
  const [collapseShow, setCollapseShow] = useState('hidden')
  const { setIsAuthenticated } = useContext(AppContext)
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
      <nav className='relative z-10 flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-xl md:fixed md:bottom-0 md:left-0 md:top-0 md:block md:w-64 md:flex-row md:flex-nowrap md:overflow-hidden md:overflow-y-auto'>
        <div className='mx-auto flex w-full flex-wrap items-center justify-between px-0 md:min-h-full md:flex-col md:flex-nowrap md:items-stretch'>
          {/* Toggler icon */}
          <button
            className='cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none text-black opacity-50 md:hidden'
            type='button'
            onClick={() => setCollapseShow('bg-white m-2 py-3 px-6')}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5'
              />
            </svg>
          </button>
          <Link
            className='mr-0 inline-block whitespace-nowrap p-4 px-0 text-left text-sm font-bold uppercase text-blueGray-600 md:block md:pb-2'
            to='/'
          >
            DASHBOARD
          </Link>
          <div
            className={
              'absolute left-0 right-0 top-0 z-40 h-auto flex-1 items-center overflow-y-auto overflow-x-hidden rounded shadow md:relative md:mt-4 md:flex md:flex-col md:items-stretch md:opacity-100 md:shadow-none ' +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className='mb-4 block border-b border-solid border-blueGray-200 pb-4 md:hidden md:min-w-full'>
              <div className='flex flex-wrap'>
                <div className='w-6/12'>
                  <Link
                    className='mr-0 inline-block whitespace-nowrap p-4 px-0 text-left text-sm font-bold uppercase text-blueGray-600 md:block md:pb-2'
                    to='/'
                  >
                    Notus React
                  </Link>
                </div>
                <div className='flex w-6/12 justify-end'>
                  <button
                    type='button'
                    className='cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none text-black opacity-50 md:hidden'
                    onClick={() => setCollapseShow('hidden')}
                  >
                    <i className='fas fa-times'></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className='mb-4 mt-6 md:hidden'>
              <div className='mb-3 pt-0'>
                <input
                  type='text'
                  placeholder='Search'
                  className='h-12 w-full rounded border border-solid  border-blueGray-500 bg-white px-3 py-2 text-base font-normal leading-snug text-blueGray-600 placeholder-blueGray-300 shadow-none outline-none focus:outline-none'
                />
              </div>
            </form>

            {/* Divider */}
            <hr className='my-4 md:min-w-full' />
            {/* Heading */}
            <h6 className='block pb-4 pt-1 text-xs font-bold uppercase text-blueGray-500 no-underline md:min-w-full'>
              Admin
            </h6>
            {/* Navigation */}

            <ul className='flex list-none flex-col md:min-w-full md:flex-col'>
              <li className='items-center'>
                <Link
                  className={
                    'block py-3 text-xs font-bold uppercase ' +
                    (currentPath.indexOf(path.controls) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                  to={path.controls}
                >
                  <i
                    className={
                      'fas fa-tv mr-2 text-sm ' +
                      (currentPath.indexOf(path.controls) !== -1 ? 'opacity-75' : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Điều khiển
                </Link>
              </li>

              <li className='items-center'>
                <Link
                  className={
                    'block py-3 text-xs font-bold uppercase ' +
                    (currentPath.indexOf(path.settings) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                  to={path.settings}
                >
                  <i
                    className={
                      'fas fa-tools mr-2 text-sm ' +
                      (currentPath.indexOf(path.settings) !== -1 ? 'opacity-75' : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Cài đặt
                </Link>
              </li>
              {/* 
              <li className='items-center'>
                <Link
                  className={
                    'block py-3 text-xs font-bold uppercase ' +
                    (currentPath.indexOf(path.manage_users) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                  to={path.manage_users}
                >
                  <i
                    className={
                      'fas fa-table mr-2 text-sm ' +
                      (currentPath.indexOf(path.manage_users) !== -1 ? 'opacity-75' : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Người dùng
                </Link>
              </li> */}
              <li className='items-center'>
                <Link
                  className={
                    'block py-3 text-xs font-bold uppercase ' +
                    (currentPath.indexOf(path.manage_cameras) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                  to={path.manage_cameras}
                >
                  <i
                    className={
                      'fas fa-table mr-2 text-sm ' +
                      (currentPath.indexOf(path.manage_cameras) !== -1 ? 'opacity-75' : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Cameras
                </Link>
              </li>

              <li className='items-center'>
                <Link
                  className={
                    'block py-3 text-xs font-bold uppercase ' +
                    (currentPath.indexOf(path.maps) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                  to={path.maps}
                >
                  <i
                    className={
                      'fas fa-map-marked mr-2 text-sm ' +
                      (currentPath.indexOf(path.maps) !== -1 ? 'opacity-75' : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Định vị
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className='my-4 md:min-w-full' />
            {/* Heading */}
            <h6 className='block pb-4 pt-1 text-xs font-bold uppercase text-blueGray-500 no-underline md:min-w-full'>
              Auth
            </h6>
            {/* Navigation */}

            <ul className='flex list-none flex-col md:mb-4 md:min-w-full md:flex-col'>
              <li className='items-center'>
                <Link
                  className='block py-3 text-xs font-bold uppercase text-blueGray-700 hover:text-blueGray-500'
                  to={path.login}
                >
                  <i className='fas fa-fingerprint mr-2 text-sm text-blueGray-400'></i> Đăng nhập
                </Link>
              </li>

              <li className='items-center'>
                <Link
                  className='block py-3 text-xs font-bold uppercase text-blueGray-700 hover:text-blueGray-500'
                  to={path.register}
                >
                  <i className='fas fa-clipboard-list mr-2 text-sm text-blueGray-300'></i> Đăng ký
                </Link>
              </li>
              <li className='items-center'>
                <div
                  className='block cursor-pointer py-3 text-xs font-bold uppercase text-blueGray-700 hover:text-blueGray-500'
                  onClick={handleLogout}
                >
                  <i className='fas fa-clipboard-list mr-2 text-sm text-blueGray-300'></i> Đăng xuất
                </div>
              </li>
            </ul>

            {/* Divider */}
            <hr className='my-4 md:min-w-full' />
            {/* Heading */}
            <h6 className='block pb-4 pt-1 text-xs font-bold uppercase text-blueGray-500 no-underline md:min-w-full'>
              Author
            </h6>
            {/* Navigation */}

            <ul className='flex list-none flex-col md:mb-4 md:min-w-full md:flex-col'>
              <li className='items-center'>
                <a
                  className='block py-3 text-xs font-bold uppercase text-blueGray-700 hover:text-blueGray-500'
                  href='https://github.com/'
                >
                  <i className='fas fa-newspaper mr-2 text-sm text-blueGray-400'></i> github
                </a>
              </li>

              <li className='items-center'>
                <a
                  className='block py-3 text-xs font-bold uppercase text-blueGray-700 hover:text-blueGray-500'
                  href='https://www.facebook.com/profile.php?id=100007193716408'
                >
                  <i className='fas fa-user-circle mr-2 text-sm text-blueGray-400'></i> Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
