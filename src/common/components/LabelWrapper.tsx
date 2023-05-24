type Props = {
  label: string
  labelClass?: string
  children: JSX.Element
  margin?: string
}

export default function LabelWrapper(props: Props) {
  const { label, margin, labelClass, children } = props
  return (
    <div className={margin ?? 'mt-5'}>
      {label && <span className={'mb-2 block text-[14px] font-medium' + labelClass}>{label}</span>}
      {children}
    </div>
  )
}
