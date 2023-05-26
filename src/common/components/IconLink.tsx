import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

type Props = { icon: string; text: string; iconSize?: number; to: string }

export default function IconLink({ icon, text, iconSize, to }: Props) {
  return (
    <li className='list-none'>
      <Link
        to={to}
        className='flex cursor-pointer items-center rounded-[3px] px-3 py-[10px] text-left text-c-5 duration-200 hover:bg-c-2 active:bg-c-2'
      >
        <Icon className='' width={iconSize ?? 22} icon={icon} />
        <span className='ml-3 text-[15px]'>{text}</span>
      </Link>
    </li>
  )
}
