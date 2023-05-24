interface Props {
  text: string
  icon?: string
  size: string
  variant?: 'ROUND' | 'SQUARE'
}

export default function Item(props: Props) {
  const { text, icon, size, variant = 'SQUARE' } = props

  return (
    <div className='flex items-center truncate font-normal'>
      {icon && (
        <img
          src={icon}
          alt={text}
          className={`mr-4 ${size} ${variant === 'ROUND' ? 'rounded-full object-cover' : ''}`}
        />
      )}
      {text}
    </div>
  )
}
