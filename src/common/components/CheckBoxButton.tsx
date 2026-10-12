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
    <div className='flex items-center'>
      <input
        type='checkbox'
        aria-label='Select item'
        className='form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out'
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </div>
  )
}
