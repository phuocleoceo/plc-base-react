import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

interface Props {
  icon: string
  text: string
  iconSize?: number
  to: string
  rotate?: number
  isActive: boolean
  onClick?: () => void
}

export default function IconLink(props: Props) {
  const { icon, text, iconSize, to, rotate, isActive, onClick } = props

  return (
    <li className={`list-none ${isActive && 'bg-secondary border-transparent rounded'}`}>
      <Link
        onClick={onClick}
        to={to}
        className='flex cursor-pointer items-center rounded-[3px] px-3 py-[10px] text-left text-c-5 duration-200 active:bg-c-2'
      >
        <Icon
          className={`${isActive && 'text-white'}`}
          width={iconSize ?? 22}
          icon={icon}
          style={{ transform: `rotate(${rotate ?? 0}deg)` }}
        />
        <span className={`ml-3 text-[15px] ${isActive && 'text-white'}`}>{text}</span>
      </Link>
    </li>
  )
}
