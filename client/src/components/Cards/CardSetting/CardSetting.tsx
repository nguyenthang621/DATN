import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import userAPI from 'src/apis/user.api'
import Input from 'src/components/Input'
import { User, UserEdit } from 'src/types/user.type'
import { schemaUser } from 'src/utils/rules'
import * as yup from 'yup'
import { useContext, useEffect } from 'react'
import { AppContext } from 'src/Context/app.context'
import { PATH_FOLDER_FIREBASE } from 'src/constants/constants'
import { uploadFileToFirebase } from 'src/firebase/uploadFire'
import { isEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'

type FormData = yup.InferType<typeof schemaUser>
interface FormPayLoad extends FormData {
  avatar: string | null
}
export default function CardSetting() {
  const { currentAvatar, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schemaUser) })

  let user_id = JSON.parse(localStorage.getItem('profile') as string).id
  var dataUser: User | null = null

  const { data: responseDataUser, refetch } = useQuery({
    queryKey: ['get-user'],
    queryFn: () => userAPI.getUser(user_id as string)
  })
  if (responseDataUser?.data.data) {
    setProfile(responseDataUser?.data.data)
    dataUser = responseDataUser?.data.data
  }

  const editUserMutation = useMutation({
    mutationFn: async (body: UserEdit) => userAPI.editUser(body)
  })

  const onSubmit = handleSubmit(async (data) => {
    const payload: FormPayLoad = { ...data, avatar: null }
    if (currentAvatar) {
      let url = await uploadFileToFirebase(PATH_FOLDER_FIREBASE.AVATAR, currentAvatar)
      payload.avatar = url
    }
    editUserMutation.mutate(payload, {
      onSuccess(response) {
        toast.info(response.data.data)
        refetch()
      },
      onError(error) {
        if (isEntityError<ErrorResponseApi>(error)) {
          const errorForm = error.response?.data
          if (errorForm) {
            setError('email', {
              message: errorForm.message.split(': ')[1],
              type: 'Server'
            })
          }
        }
      }
    })
  })
  useEffect(() => {
    setValue('fullName', dataUser?.fullName || '')
    setValue('email', dataUser?.email || '')
    setValue('address', dataUser?.address || '')
    setValue('phoneNumber', dataUser?.phoneNumber || '')
  }, [dataUser])
  return (
    <>
      <div className='relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 bg-blueGray-100 shadow-lg'>
        <form onSubmit={onSubmit}>
          <div className='mb-0 rounded-t bg-white px-6 py-6'>
            <div className='flex justify-between text-center'>
              <h6 className='text-xl font-bold text-blueGray-700'>Tài khoản của tôi</h6>
              <button
                className='mr-1 flex items-center rounded bg-lightBlue-500 px-6 py-3 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-lightBlue-600'
                type='submit'
              >
                {editUserMutation.isLoading && (
                  <svg
                    aria-hidden='true'
                    className='mr-2 h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                )}
                Lưu
              </button>
            </div>
          </div>
          <div className='flex-auto px-4 py-10 pt-0 lg:px-10'>
            <form>
              <h6 className='mb-6 mt-3 text-sm font-bold uppercase text-blueGray-400'>Thông tin</h6>
              <div className='flex flex-wrap'>
                <div className='w-full px-4 lg:w-6/12'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      Họ tên
                    </label>
                    <Input
                      name='fullName'
                      placeholder='Họ tên'
                      register={register}
                      type='text'
                      classNameNew='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      errorMessage={errors.fullName?.message}
                    ></Input>
                  </div>
                </div>
                <div className='w-full px-4 lg:w-6/12'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      Email
                    </label>
                    <Input
                      name='email'
                      placeholder='Email'
                      register={register}
                      type='text'
                      classNameNew='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      errorMessage={errors.email?.message}
                    ></Input>
                  </div>
                </div>
                <div className='w-full px-4 lg:w-6/12'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      Địa chỉ
                    </label>
                    <Input
                      name='address'
                      placeholder='Địa chỉ'
                      register={register}
                      type='text'
                      classNameNew='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      errorMessage={errors.address?.message}
                    ></Input>
                  </div>
                </div>
                <div className='w-full px-4 lg:w-6/12'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      Số điện thoại
                    </label>
                    <Input
                      name='phoneNumber'
                      placeholder='Số điẹn thoại'
                      register={register}
                      type='text'
                      classNameNew='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      errorMessage={errors.phoneNumber?.message}
                    ></Input>
                  </div>
                </div>
              </div>
              <hr className='border-b-1 mt-6 border-blueGray-300' />

              {/* <h6 className='mb-6 mt-3 text-sm font-bold uppercase text-blueGray-400'>Thông tin liên hệ</h6>
              <div className='flex flex-wrap'>
                <div className='lg:w-12/12 w-full px-4'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      Address
                    </label>
                    <input
                      type='text'
                      className='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      defaultValue='Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09'
                    />
                  </div>
                </div>
                <div className='w-full px-4 lg:w-4/12'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      City
                    </label>
                    <input
                      type='email'
                      className='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      defaultValue='New York'
                    />
                  </div>
                </div>
                <div className='w-full px-4 lg:w-4/12'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      Country
                    </label>
                    <input
                      type='text'
                      className='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      defaultValue='United States'
                    />
                  </div>
                </div>
                <div className='w-full px-4 lg:w-4/12'>
                  <div className='relative mb-3 w-full'>
                    <label className='mb-2 block text-xs font-bold uppercase text-blueGray-600' htmlFor='grid-password'>
                      Postal Code
                    </label>
                    <input
                      type='text'
                      className='w-full rounded border-0 bg-white px-3 py-3 text-sm text-blueGray-600 placeholder-blueGray-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring'
                      defaultValue='Postal Code'
                    />
                  </div>
                </div>
              </div> */}
            </form>
          </div>
        </form>
      </div>
    </>
  )
}
