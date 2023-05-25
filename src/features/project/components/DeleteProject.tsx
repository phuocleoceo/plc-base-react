interface Props {
  isShowing: boolean
  onClose: () => void
}

export default function DeleteProject(props: Props) {
  const { isShowing, onClose } = props

  return <>{isShowing ? 'abc' : ''}</>
}
