import { useState } from 'react'

interface Props {
  onChange: (isChecked: boolean) => void
}

export default function CheckBoxButton(props: Props) {
  const { onChange } = props

  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    setIsChecked(!isChecked)
    onChange(!isChecked)
  }

  return (
    <label className='flex items-center'>
      <input
        type='checkbox'
        className='form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out'
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </label>
  )
}
