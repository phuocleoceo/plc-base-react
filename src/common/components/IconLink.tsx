import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

interface Props {
  icon: string
  text: string
  iconSize?: number
  to: string
  rotate?: number
}

export default function IconLink(props: Props) {
  const { icon, text, iconSize, to, rotate } = props

  return (
    <li className='list-none'>
      <Link
        to={to}
        className='flex cursor-pointer items-center rounded-[3px] px-3 py-[10px] text-left text-c-5 duration-200 hover:bg-c-2 active:bg-c-2'
      >
        <Icon className='' width={iconSize ?? 22} icon={icon} style={{ transform: `rotate(${rotate ?? 0}deg)` }} />
        <span className='ml-3 text-[15px]'>{text}</span>
      </Link>
    </li>
  )
}
