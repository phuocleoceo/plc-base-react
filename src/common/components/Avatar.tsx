interface Props {
  src?: string
  name?: string
  title?: string
  className?: string
  onClick?: () => void
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: {}
}

export default function Avatar(props: Props) {
  const { src, name, title, className, onClick, style } = props

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={`relative grid shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full bg-green-600 ${
        className ?? 'h-8 w-8 border-[1px]'
      }`}
      title={title ?? name}
      {...{ style, onClick }}
    >
      <div>{name?.at(0)}</div>
      {src && <img src={src} alt={name} className='absolute block h-full w-full object-cover' />}
    </div>
  )
}
