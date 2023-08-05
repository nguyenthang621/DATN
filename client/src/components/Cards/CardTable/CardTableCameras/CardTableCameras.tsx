import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { AppContext } from 'src/Context/app.context'
import cameraAPI from 'src/apis/camera.api'
import Button from 'src/components/Button'
import Popover from 'src/components/Popover'
import { Camera } from 'src/types/camera.type'

interface Props {
  color: 'light' | 'dark'
}

export default function CardTableCameras({ color }: Props) {
  const { setIsShowModalCamera, setCurrentCameraPick, currentCameraPick, isShowModalCamera, setActionCamera } =
    useContext(AppContext)

  var cameras: Camera[] | [] = []
  let user_id = JSON.parse(localStorage.getItem('profile') as string).id
  if (user_id) {
    const { data: cameraData } = useQuery({
      queryKey: ['cameras', [user_id, currentCameraPick, isShowModalCamera]],
      queryFn: () => cameraAPI.getAllCamera(user_id as string)
    })
    if (cameraData?.data.data) cameras = cameraData?.data.data
  }

  const handleDelete = (camera: Camera) => {
    setCurrentCameraPick(camera)
    setActionCamera('DELETE')
  }

  const handleEdit = (camera: Camera) => {
    setCurrentCameraPick(camera)
    setActionCamera('EDIT')
    setIsShowModalCamera(true)
  }

  const handleClickAddCamera = () => {
    setCurrentCameraPick(null)
    setActionCamera('ADD')
    setIsShowModalCamera(true)
  }

  const handleShowAdvance = (camera: Camera) => {
    setCurrentCameraPick(camera)
    setActionCamera('ADVANCE')
  }

  return (
    <div>
      <div
        className={
          'relative mb-6 flex w-full min-w-0 flex-col break-words rounded shadow-lg ' +
          (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')
        }
      >
        <div className='mb-0 rounded-t border-0 px-4 py-5'>
          <div className='flex flex-wrap items-center'>
            <div className='px-4s relative w-full max-w-full flex-1 flex-grow'>
              <h3 className={'text-lg font-semibold ' + (color === 'light' ? 'text-blueGray-700' : 'text-white')}>
                Camera của bạn
              </h3>
            </div>
            <Button
              className='font-font-medium bg-xanh rounded px-4 py-2 uppercase text-white hover:shadow'
              isLoading={false}
              disabled={false}
              onClick={handleClickAddCamera}
            >
              Thêm camera
            </Button>
          </div>
        </div>
        <div className='block h-[65vh] w-full overflow-x-auto'>
          {/* Projects table */}
          <table className='w-full border-collapse items-center bg-transparent'>
            <thead className='shadowTop sticky top-0'>
              <tr>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Cameras
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Địa chỉ IP
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Vị trí
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  user
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Ngày tạo
                </th>

                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                ></th>
              </tr>
            </thead>
            <tbody className='pt-2'>
              {cameras &&
                cameras.map((camera) => (
                  <tr className='border border-b hover:bg-gray-100' key={camera.id}>
                    <th className='flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='hh-8 w-8 rounded-full border-2 p-2'
                      >
                        <path
                          strokeLinecap='round'
                          d='M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z'
                        />
                      </svg>{' '}
                      <span className={'ml-3 font-bold ' + +(color === 'light' ? 'text-blueGray-600' : 'text-white')}>
                        {camera.name}
                      </span>
                    </th>
                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      {camera.ip_address}
                    </td>
                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <i className='fas fa-circle mr-2 text-orange-500'></i> {camera.location}
                    </td>
                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <div className='flex items-center'>
                        {camera.user_follow}{' '}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='h-3 w-3'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
                          />
                        </svg>
                      </div>
                    </td>
                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <div className='flex'>{camera.createAt}</div>
                    </td>
                    <td className='cursor-pointer whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs'>
                      <Popover
                        offsetInput={1}
                        isArrow={false}
                        renderPopover={
                          <div className='relative overflow-hidden rounded-sm border border-gray-200 bg-white shadow-md'>
                            <div
                              className='block w-full cursor-pointer bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-700'
                              onClick={() => handleEdit(camera)}
                            >
                              Sửa
                            </div>
                            <div
                              className='block w-full cursor-pointer bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-700'
                              onClick={() => handleDelete(camera)}
                            >
                              Xoá
                            </div>
                            <div
                              className='block w-full cursor-pointer bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-700'
                              onClick={() => handleShowAdvance(camera)}
                            >
                              Nâng cao
                            </div>
                          </div>
                        }
                      >
                        {/* <TableDropdown /> */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='h-5 w-5'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                          />
                        </svg>
                      </Popover>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
