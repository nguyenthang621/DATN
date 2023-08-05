import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AppContext } from 'src/Context/app.context'
import cameraAPI from 'src/apis/camera.api'
import Button from 'src/components/Button'
import { ErrorResponseApi } from 'src/types/utils.type'
import { schemaEmail } from 'src/utils/rules'
import { isEntityError } from 'src/utils/utils'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type formData = yup.InferType<typeof schemaEmail>

interface receiverCamera {
  camera_id: string
  receiver_email: string
}

function ModalAdvance() {
  const { currentCameraPick, setActionCamera, setCurrentCameraPick, actionCamera } = useContext(AppContext)
  if (!currentCameraPick) return <></>

  const [showDrop, setShowDrop] = useState<'email' | 'location' | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(schemaEmail)
  })

  useEffect(() => {
    if (currentCameraPick.receiver) setValue('receiver_email', currentCameraPick.receiver)
  }, [currentCameraPick])

  const receiverEmailMutation = useMutation({
    mutationFn: (body: receiverCamera) => cameraAPI.changeReceiverCamera(body)
  })

  const onSubmit = handleSubmit((body) => {
    if (!currentCameraPick) return
    body.camera_id = currentCameraPick.id
    console.log(body)
    receiverEmailMutation.mutate(body as receiverCamera, {
      onSuccess(data) {
        toast.info(data.data.data.message)
      },
      onError(error) {
        if (isEntityError<ErrorResponseApi>(error)) {
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
  })

  const handleClose = () => {
    setCurrentCameraPick(null)
    setActionCamera(null)
  }

  const handleShowDrop = (drop: 'email' | 'location') => {
    if (showDrop === drop) {
      setShowDrop(null)
      return
    }
    setShowDrop(drop)
  }

  return (
    <>
      <div
        id='crypto-modal'
        className={classNames(
          'absolute bottom-0 left-0 right-0 top-0 z-40 max-h-full w-full overflow-y-auto overflow-x-hidden bg-gray-800/50 p-4 md:inset-0',
          {
            hidden: !(actionCamera === 'ADVANCE' && currentCameraPick)
          }
        )}
      >
        <div className='absolute left-1/2 top-1/2 flex h-full max-h-full w-full max-w-lg -translate-x-1/2 -translate-y-1/2 items-center'>
          {/* main */}
          <div className='absolute rounded-lg bg-white shadow dark:bg-gray-700 '>
            <button
              type='button'
              className='absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
              data-modal-hide='crypto-modal'
              onClick={() => handleClose()}
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
            {/* header */}
            <div className='min-w-[500px] rounded-t border-b px-6 py-4 dark:border-gray-600'>
              <h3 className='text-base font-semibold text-gray-900 dark:text-white lg:text-xl'>Cài đặt nâng cao</h3>
            </div>
            {/* body */}
            <div className='p-6'>
              <p className='text-sx font-normal text-gray-500 dark:text-gray-400'>
                Nâng cao cho thiết bị {currentCameraPick.name}
              </p>
              <ul className='my-4 space-y-3'>
                <li>
                  <span
                    className='group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
                    onClick={() => handleShowDrop('email')}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6 fill-red-500 text-gray-100'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                      />
                    </svg>

                    <span className='ml-3 flex-1 whitespace-nowrap'>Thêm email</span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                    </svg>
                  </span>
                  <div
                    className={classNames('mt-1 flex flex-col items-center justify-center rounded bg-gray-50', {
                      hidden: showDrop !== 'email'
                    })}
                  >
                    <span className='mt-2 h-[3px] w-20 rounded bg-gray-300'></span>
                    <div className='h-auto  w-full rounded-lg bg-gray-50 p-2'>
                      <ul className='my-1'>
                        <form onSubmit={onSubmit}>
                          <li className='mt-4' id='1'>
                            <span className='flex gap-2'>
                              <div className='flex h-12 w-9/12 items-center justify-start rounded-[7px] bg-[#e0ebff] px-3'>
                                <div className='w-full'>
                                  <input
                                    autoComplete='off'
                                    {...register('receiver_email')}
                                    type='text'
                                    className='peer h-10 w-full border-gray-300 bg-[#e0ebff] text-gray-900 focus:outline-none'
                                    placeholder='abc@gmail.com'
                                  />
                                </div>
                              </div>

                              <Button
                                // isLoading={true}
                                // disabled={true}
                                className='flex h-12 w-1/4 cursor-pointer items-center justify-center rounded-[7px] bg-[#e0ebff] text-sm font-semibold text-[#5b7a9d]'
                              >
                                Lưu
                              </Button>
                            </span>
                            <div className='ml-1 mt-1 min-h-[1.25rem] text-start text-xs text-red-600'>
                              {errors.receiver_email?.message}
                            </div>
                          </li>
                        </form>
                      </ul>
                    </div>
                    <p className='item mb-2 inline-flex items-center text-xs font-normal text-gray-900 dark:text-gray-400'>
                      Thông báo về email khi phát hiện đám cháy
                    </p>
                  </div>
                </li>
                <li>
                  <span
                    className='group flex cursor-pointer items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
                    onClick={() => handleShowDrop('location')}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='text-gray-100s h-6 w-6 fill-red-500 text-gray-100'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525'
                      />
                    </svg>

                    <span className='ml-3 flex-1 whitespace-nowrap'>Định vị</span>
                  </span>
                  <div
                    className={classNames(
                      'mt-1 flex flex-col items-center justify-center overflow-hidden rounded bg-gray-50',
                      {
                        hidden: showDrop !== 'location'
                      }
                    )}
                  >
                    <span className='mt-2 h-[3px] w-20 rounded bg-gray-300'></span>
                    <div className='h-auto  w-full rounded-lg bg-gray-50 p-2'></div>
                    <p className='item mb-2 inline-flex items-center text-xs font-normal text-gray-400 dark:text-gray-400'>
                      Chưa hỗ trợ chức năng định vị
                    </p>
                  </div>
                </li>
              </ul>
              <div>
                <p className='inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='mr-1 h-4 w-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
                    />
                  </svg>
                  Lưu ý cài đặt nâng cao có thể gây tốn tài nguyên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalAdvance
