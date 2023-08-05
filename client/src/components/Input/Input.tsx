import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { generateUUID } from 'src/utils/utils'

interface InputProps {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder: string
  name: string
  auth?: boolean
  register: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
  classNameNew?: string
}

function Input({
  type,
  placeholder,
  classNameNew,
  auth = false,
  name,
  register,
  errorMessage,
  rules,
  ...rest
}: InputProps) {
  const idInput = generateUUID()
  return (
    <>
      {!auth ? (
        <div className='mt-2'>
          <input
            type={type}
            placeholder={placeholder}
            className={
              classNameNew
                ? classNameNew
                : 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
            }
            {...register(name, rules)}
            {...rest}
          />
          <div className='mt-1 min-h-[1.25rem] text-xs text-red-600'>{errorMessage}</div>
        </div>
      ) : (
        <div className='relative mt-3'>
          <input
            autoComplete='off'
            {...register(name, rules)}
            type={type}
            className='focus:borer-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none'
            placeholder={placeholder}
            id={idInput}
          />
          <label
            className='peer-placeholder-shown:text-gray-440 absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600'
            htmlFor={idInput}
          >
            {placeholder}
          </label>
          <div className='mt-1 min-h-[1.25rem] text-end text-xs text-red-600'>{errorMessage}</div>
        </div>
      )}
    </>
  )
}

export default Input
