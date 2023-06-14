import { useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

import { useToggle } from '~/common/hooks'

interface Props {
  options?: Array<{
    label: string
    onClick?: () => void
  }>
}

export default function DropDownMenu(props: Props) {
  const { options } = props

  const { isShowing, toggle } = useToggle()

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        toggle()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [toggle])

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      <button className='btn-gray rounded-md px-2 py-1' onClick={toggle}>
        <Icon width={17} icon='bi:three-dots' className='text-black inline-block cursor-pointer' />
      </button>

      {isShowing && (
        <div className='absolute right-0 mt-2 py-2 w-44 bg-white shadow-lg rounded-md z-50'>
          <ul>
            {options &&
              options.length > 0 &&
              options.map((option, idx) => (
                <li key={idx}>
                  <div
                    onClick={option.onClick}
                    onKeyDown={option.onClick}
                    role='button'
                    tabIndex={0}
                    className='block px-4 py-2 hover:bg-gray-200'
                  >
                    {option.label}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
