import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AppContext } from 'src/Context/app.context'
import cameraAPI from 'src/apis/camera.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { formDataCamera } from 'src/types/camera.type'
import { ErrorResponseApi } from 'src/types/utils.type'
import { schemaCamera } from 'src/utils/rules'
import { isEntityError } from 'src/utils/utils'
import * as yup from 'yup'

type formData = yup.InferType<typeof schemaCamera>

function ModalCamera() {
  const { isShowModalCamera, setIsShowModalCamera, setActionCamera, actionCamera, currentCameraPick } =
    useContext(AppContext)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(schemaCamera)
  })

  const insertCameraMutation = useMutation({
    mutationFn: (body: formDataCamera) => cameraAPI.insertCamera(body)
  })
  const editCameraMutation = useMutation({
    mutationFn: (body: formDataCamera) => cameraAPI.editCamera(body)
  })

  const onSubmit = handleSubmit((body) => {
    let profile = JSON.parse(localStorage.getItem('profile') as string)
    if (!profile || profile === null) return
    body.user_id = profile.id as string
    if (actionCamera === 'ADD') {
      insertCameraMutation.mutate(body as formDataCamera, {
        onSuccess(data) {
          toast.info(data.data.data.message)
          reset()
          setIsShowModalCamera(false)
          setActionCamera(null)
        },
        onError(error) {
          if (isEntityError<ErrorResponseApi<FormData>>(error)) {
            const errorForm = error.response?.data
            if (errorForm && errorForm.form) {
              let form = errorForm.form
              setError(form as any, {
                message: errorForm.message.split('&')[1],
                type: 'Server'
              })
            }
          }
        }
      })
    } else if (actionCamera === 'EDIT') {
      body.camera_id = currentCameraPick?.id
      editCameraMutation.mutate(body as formDataCamera, {
        onSuccess(data) {
          toast.info(data.data.data.message)
          reset()
          setIsShowModalCamera(false)
          setActionCamera(null)
        },
        onError(error) {
          if (isEntityError<ErrorResponseApi<FormData>>(error)) {
            const errorForm = error.response?.data
            if (errorForm && errorForm.form) {
              let form = errorForm.form
              setError(form as any, {
                message: errorForm.message.split('&')[1],
                type: 'Server'
              })
            }
          }
        }
      })
    }
  })

  useEffect(() => {
    if (currentCameraPick && actionCamera === 'EDIT') {
      setValue('ip_address', currentCameraPick.ip_address as string)
      setValue('name', currentCameraPick.name as string)
      setValue('location', currentCameraPick.location as string)
    }
  }, [currentCameraPick])

  const handleCloseModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsShowModalCamera(false)
    reset()
  }
  return (
    <div
      className={classNames(
        'absolute bottom-0 left-0 right-0 top-0 z-50 max-h-full w-full overflow-y-auto overflow-x-hidden bg-gray-800/50 p-4 md:inset-0',
        {
          hidden: !isShowModalCamera
        }
      )}
    >
      <div className='max-w-2xln absolute left-1/2 top-1/2 max-h-full -translate-x-1/2 -translate-y-1/2 transform'>
        {/* <modal content /> */}
        <div className='relative rounded-lg bg-white shadow dark:bg-gray-700 '>
          {/* <TableDropdown /> */}
          <div className='flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>Thêm mới Camera</h3>
            <button
              type='button'
              className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
              data-modal-hide='defaultModal'
              onClick={handleCloseModal}
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
          </div>
          {/* modal body> */}
          <form onSubmit={onSubmit}>
            <div className='-mx-3 flex flex-wrap p-6'>
              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/3'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  IP Camera (*)
                </label>
                <Input
                  name='ip_address'
                  placeholder='192.168.1.6'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  errorMessage={errors.ip_address?.message}
                ></Input>
              </div>
              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/3'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  Tên Camera (*)
                </label>
                <Input
                  name='name'
                  placeholder='Camera'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  errorMessage={errors.name?.message}
                ></Input>
              </div>

              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/3'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-zip'
                >
                  Vị trí
                </label>
                <Input
                  name='location'
                  placeholder='Hà Nội'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  errorMessage={errors.location?.message}
                ></Input>
              </div>
            </div>
            {/* modal footer*/}
            <div className='flex items-center justify-end space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600'>
              <Button
                isLoading={insertCameraMutation.isLoading}
                disabled={insertCameraMutation.isLoading}
                className='rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Lưu
              </Button>
              <Button
                className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600'
                onClick={(e) => handleCloseModal(e)}
              >
                Huỷ
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalCamera
