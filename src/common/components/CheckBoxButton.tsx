import { useState } from 'react'

export default function CheckBoxButton() {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    setIsChecked(!isChecked)
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
