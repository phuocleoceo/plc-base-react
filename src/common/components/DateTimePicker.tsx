import DatePicker from 'react-datepicker'
import { useState } from 'react'
import { Controller } from 'react-hook-form'

interface Props {
  control?: any
  controlField?: string
  defaultValue?: Date
  readonly?: boolean
  className?: string
}

export default function DateTimePicker(props: Props) {
  const { control, controlField, defaultValue, readonly, className } = props

  const [startDate, setStartDate] = useState<Date | null>(defaultValue ? new Date(defaultValue) : null)

  if (!control || !controlField) return null

  return (
    <Controller
      name={controlField}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange } }) => (
        <DatePicker
          showIcon={false}
          showTimeSelect={true}
          dateFormat='dd/MMMM/yy hh:mm a'
          className={`block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue 
                     bg-slate-100 hover:border-gray-400 ${className}`}
          readOnly={readonly}
          selected={startDate}
          onChange={(date: Date) => {
            setStartDate(date)
            onChange(date.toISOString())
          }}
        />
      )}
    />
  )
}
