import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { Socket } from 'socket.io-client'
import { AppContext } from 'src/Context/app.context'
import cameraAPI from 'src/apis/camera.api'
import Button from 'src/components/Button'
import { direction, keyBoard } from 'src/constants/constants'
import { Camera } from 'src/types/camera.type'

interface Props {
  socket: Socket
}

function CardControl({ socket }: Props) {
  const { isConnected, setIsConnected, setActionCamera, currentIdCam, setCurrentIdCam } = useContext(AppContext)
  const [isLoadingConnect, setIsLoadingConnect] = useState<boolean>(false)
  const [btnActive, setBtnActive] = useState<string | null>(null)
  const [isShowListCamera, setIsShowListCamera] = useState<boolean>(false)
  const { setIsShowModalCamera } = useContext(AppContext)
  const listCameraRef = useRef<HTMLDivElement>(null)
  const btnListCameraRef = useRef<HTMLDivElement>(null)

  //Lấy list camera của user
  var cameras: Camera[] | [] = []
  let user_id = JSON.parse(localStorage.getItem('profile') as string).id
  if (user_id) {
    const { data: cameraData } = useQuery({
      queryKey: ['cameras', user_id],
      queryFn: () => cameraAPI.getAllCamera(user_id as string)
    })
    if (cameraData?.data.data) cameras = cameraData?.data.data
  }

  const handleConnectCamera = () => {
    setIsShowListCamera((prev) => !prev)
  }

  // handle close list camera
  const handleClickOutside = (event: MouseEvent) => {
    if (
      listCameraRef.current &&
      !listCameraRef.current.contains(event.target as Node) &&
      btnListCameraRef.current &&
      !btnListCameraRef.current.contains(event.target as Node)
    ) {
      setIsShowListCamera(false)
    }
  }

  useEffect(() => {
    // Xác nhận esp32 joined room
    socket.on('response_from_esp32', (message) => {
      if (message === 'Joined') {
        setIsConnected(true)
        setIsLoadingConnect(false)
      }
      if (message === 'Leave') {
        setIsConnected(false)
        setIsLoadingConnect(false)
      }
    })
    socket.on('response_data_sensor_to_client', (data) => {
      console.log(data)
      // handle data sensor:
    })

    // handle key board:
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(isConnected)
      if (!isConnected) return
      const pressedKey = event.key
      if (keyBoard.go.includes(pressedKey)) {
        socket.emit('send_direction', direction.go)
        setBtnActive(direction.go)
      } else if (keyBoard.back.includes(pressedKey)) {
        socket.emit('send_direction', direction.back)
        setBtnActive(direction.back)
      } else if (keyBoard.right.includes(pressedKey)) {
        socket.emit('send_direction', direction.right)
        setBtnActive(direction.right)
      } else if (keyBoard.left.includes(pressedKey)) {
        socket.emit('send_direction', direction.left)
        setBtnActive(direction.left)
      }
    }

    const handleKeyUp = () => {
      setBtnActive(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isConnected])

  const handleControl = (directionInput: string) => {
    if (!isConnected) return
    switch (directionInput) {
      case direction.go:
        socket.emit('send_direction', directionInput)
        break
      case direction.back:
        socket.emit('send_direction', directionInput)
        break
      case direction.right:
        socket.emit('send_direction', directionInput)
        break
      case direction.left:
        socket.emit('send_direction', directionInput)
        break
      default:
        return
    }
  }

  const handleSelectCamera = (camera: Camera) => {
    if (!camera.ip_address) return
    setIsLoadingConnect(true)

    if (currentIdCam) {
      console.log('stop')
      socket.emit('stop_video_real_time', currentIdCam)
    }
    socket.emit('start_video_real_time', camera.ip_address)
    setCurrentIdCam(camera.ip_address)
  }

  const handleClickAddCamera = () => {
    setActionCamera('ADD')
    setIsShowModalCamera(true)
  }
  return (
    <div className='relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white shadow-lg'>
      <div className='mb-0 rounded-t bg-transparent px-4 pt-2'>
        <div className='flex flex-wrap items-center'>
          <div className='relative w-full max-w-full flex-1 flex-grow'>
            <h6 className='mb-1 text-xs font-semibold uppercase text-blueGray-400'>Điều khiển</h6>
          </div>
        </div>
      </div>
      <div className='flex flex-auto flex-col p-4'>
        {/* btn connect */}
        <div className='flex flex-row items-center justify-between'>
          <div className='relative' ref={btnListCameraRef}>
            <Button
              className={classNames(`rounded px-6 py-3 font-medium uppercase text-white hover:shadow`, {
                'bg-cam': isConnected,
                'bg-xanh': !isConnected
              })}
              isLoading={isLoadingConnect}
              // disabled={isLoadingConnect}
              onClick={handleConnectCamera}
            >
              {isConnected ? 'Ngắt kết nối' : 'Kết nối thiết bị'}{' '}
              <svg
                className='ml-2 h-4 w-4'
                aria-hidden='true'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
              </svg>
            </Button>

            <div
              id='dropdownUsers'
              ref={listCameraRef}
              className={classNames(
                ' absolute z-10 mt-2 w-60 rounded-lg border border-gray-100 bg-white shadow-xl dark:bg-gray-700',
                {
                  hidden: !isShowListCamera
                }
              )}
            >
              <ul
                className='h-48 overflow-y-auto py-2 text-gray-700 dark:text-gray-200'
                aria-labelledby='dropdownUsersButton'
              >
                {cameras &&
                  cameras.map((camera) => {
                    return (
                      <li key={camera.id} className='cursor-pointer' onClick={() => handleSelectCamera(camera)}>
                        <div className='flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                          <span className='flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0  p-4 px-6 text-left align-middle text-xs'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className={classNames('h-8 w-8 rounded-full border-2 p-2', {
                                'border-lime-400': currentIdCam === camera.ip_address && isConnected
                              })}
                            >
                              <path
                                strokeLinecap='round'
                                d='M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z'
                              />
                            </svg>{' '}
                            <span className={'ml-3 font-bold text-blueGray-600'}>{camera.name}</span>
                          </span>
                        </div>
                      </li>
                    )
                  })}
              </ul>
              <div
                className='flex cursor-pointer items-center rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 text-sm font-medium text-blue-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-gray-600'
                onClick={handleClickAddCamera}
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
                    d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Thêm camera
              </div>
            </div>
          </div>
        </div>
        {/* controls */}
        <div className='m-auto my-5 w-full content-center rounded border border-gray-200 py-5'>
          <div className='m-auto flex max-h-[200px] max-w-[200px] flex-col'>
            <div className='flex items-center justify-center'>
              <button
                className='flex cursor-pointer items-center justify-center overflow-hidden hover:shadow active:shadow-lg'
                title={!isConnected ? 'Chưa kết nối thiết bị' : ''}
                onClick={() => handleControl(direction.go)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={classNames('h-14 w-14 rounded p-4 text-white active:bg-cam ', {
                    'bg-cam': btnActive === direction.go,
                    'bg-xanh': btnActive !== direction.go,
                    'cursor-not-allowed': !isConnected
                  })}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 15.75l7.5-7.5 7.5 7.5' />
                </svg>
              </button>
            </div>
            <div className='item-center flex justify-between py-4'>
              <button
                className='overflow-hidden  hover:shadow active:shadow-lg'
                title={!isConnected ? 'Chưa kết nối thiết bị' : ''}
                onClick={() => handleControl(direction.left)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={classNames('h-14 w-14 rounded p-4 text-white active:bg-cam', {
                    'bg-cam': btnActive === direction.left,
                    'bg-xanh': btnActive !== direction.left,
                    'cursor-not-allowed': !isConnected
                  })}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </button>
              <button
                className='overflow-hidden hover:shadow active:shadow-lg'
                title={!isConnected ? 'Chưa kết nối thiết bị' : ''}
                onClick={() => handleControl(direction.right)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={classNames('h-14 w-14 rounded p-4 text-white active:bg-cam', {
                    'bg-cam': btnActive === direction.right,
                    'bg-xanh': btnActive !== direction.right,
                    'cursor-not-allowed': !isConnected
                  })}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </button>
            </div>
            <div className='flex items-center justify-center'>
              <button
                className='item-center flex cursor-pointer justify-center overflow-hidden hover:shadow active:shadow-lg'
                title={!isConnected ? 'Chưa kết nối thiết bị' : ''}
                onClick={() => handleControl(direction.back)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={classNames('h-14 w-14 rounded p-4 text-white active:bg-cam', {
                    'bg-cam': btnActive === direction.back,
                    'bg-xanh': btnActive !== direction.back,
                    'cursor-not-allowed': !isConnected
                  })}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* controls pump */}
        <Button className={classNames('bg-xanh rounded px-6 py-3 font-medium uppercase text-white hover:shadow')}>
          Bật máy bơm
        </Button>
      </div>
    </div>
  )
}

export default CardControl
