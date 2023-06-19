import { TranslateHelper } from '~/shared/helpers'

interface Props {
  text: string
  icon?: string
  size: string
  className?: string
  variant?: 'ROUND' | 'SQUARE'
}

export default function Item(props: Props) {
  const { text, icon, size, className, variant = 'SQUARE' } = props

  return (
    <div className={`flex items-center truncate font-normal ${className}`}>
      {icon && (
        <img
          src={icon}
          alt={text}
          className={`mr-4 ${size} ${variant === 'ROUND' ? 'rounded-full object-cover' : ''}`}
        />
      )}
      {TranslateHelper.translate(text)}
    </div>
  )
}
