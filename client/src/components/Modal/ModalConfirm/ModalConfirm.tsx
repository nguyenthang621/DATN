import classNames from 'classnames'
import { useContext } from 'react'
import { AppContext } from 'src/Context/app.context'
import cameraAPI from 'src/apis/camera.api'

function ModalConfirm() {
  const { currentCameraPick, setCurrentCameraPick, actionCamera, setActionCamera } = useContext(AppContext)

  const handleCancel = () => {
      setActionCamera(null)
      setCurrentCameraPick(null)
  }

  const handleDestroy = async () => {
    try {
      if (!currentCameraPick) throw 'Lỗi !'
      let response = await cameraAPI.deleteCamera(currentCameraPick?.id)
      if (response.status === 200 && response?.data?.success === true) {
        setActionCamera(null)
        setCurrentCameraPick(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className={classNames(
        'absolute bottom-0 left-0 right-0 top-0 z-50 max-h-full w-full overflow-y-auto overflow-x-hidden bg-gray-800/50 p-4 md:inset-0',
        {
          hidden: actionCamera !== 'DELETE'
        }
      )}
    >
      {/* main*/}
      <div className='absolute left-1/2 top-1/2 h-full w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform p-4 md:h-auto'>
        {/* content*/}
        <div className='relative rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800 sm:p-5'>
          <button
            type='button'
            className='absolute right-2.5 top-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
            data-modal-toggle='deleteModal'
            onClick={handleCancel}
          >
            <svg
              aria-hidden='true'
              className='h-5 w-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              ></path>
            </svg>
            <span className='sr-only'>Close modal</span>
          </button>
          <svg
            className='mx-auto mb-3.5 h-11 w-11 text-gray-400 dark:text-gray-500'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
              clipRule='evenodd'
            ></path>
          </svg>
          <p className='mb-4 text-gray-500 dark:text-gray-300'>
            Bạn chắc chắn muốn xoá camera {currentCameraPick && currentCameraPick.name}
          </p>
          <div className='flex items-center justify-center space-x-4'>
            <button
              data-modal-toggle='deleteModal'
              type='button'
              className='focus:ring-primary-300 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600'
              onClick={handleCancel}
            >
              Huỷ
            </button>
            <button
              type='submit'
              className='rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900'
              onClick={handleDestroy}
            >
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirm
