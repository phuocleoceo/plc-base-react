import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

type Props = {
  register: UseFormRegisterReturn
  error?: FieldError
  placeholder?: string
  label: string
  defaultValue?: string
  readOnly?: boolean
  autoFocus?: boolean
  inputClass?: string
  type?: string
}

export default function InputValidation(props: Props) {
  const { register, error, placeholder, label, defaultValue, readOnly, autoFocus, inputClass, type } = props

  return (
    <div>
      <label htmlFor={label} className='text-sm tracking-wide text-gray-800'>
        {label}
      </label>
      <input
        id={label}
        defaultValue={defaultValue ?? ''}
        className={`mt-2 block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue 
          bg-slate-100 hover:border-gray-400 ${inputClass ?? ' border-transparent'} ${
          readOnly ? 'pointer-events-none' : ''
        }`}
        {...{ placeholder, readOnly, autoFocus, type }}
        {...register}
      />
      <span
        className='text-[13px] text-red-400'
        dangerouslySetInnerHTML={{ __html: error?.message?.toString() as TrustedHTML }}
      ></span>
    </div>
  )
}
