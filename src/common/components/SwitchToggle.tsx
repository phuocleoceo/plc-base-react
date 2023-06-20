import { Controller } from 'react-hook-form'
import { useState } from 'react'

interface Prop {
  control?: any
  controlField?: string
  defaultValue?: boolean
  readonly?: boolean
  className?: string
  onClick?: (isEnable: boolean) => void
}

export default function SwitchToggle(props: Prop) {
  const { control, controlField, defaultValue, readonly, className, onClick } = props

  const [enabled, setEnabled] = useState<boolean>(defaultValue ?? false)

  const ToggleButton = (onChange: any) => (
    <div className='flex'>
      <label className={`inline-flex relative items-center cursor-pointer ${className}`}>
        <input type='checkbox' className='sr-only peer' checked={enabled} readOnly />
        <div
          onClick={() => {
            setEnabled(!enabled)
            if (onChange) onChange(!enabled)
          }}
          onKeyDown={() => {
            setEnabled(!enabled)
            if (onChange) onChange(!enabled)
          }}
          tabIndex={0}
          role='button'
          className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-green-300 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all ${
                          readonly ? 'pointer-events-none peer-checked:bg-green-150' : 'peer-checked:bg-green-600'
                        }`}
        ></div>
      </label>
    </div>
  )

  if (!control || !controlField) return onClick ? ToggleButton(onClick) : ToggleButton(null)

  return (
    <Controller
      name={controlField}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange } }) => ToggleButton(onChange)}
    />
  )
}
