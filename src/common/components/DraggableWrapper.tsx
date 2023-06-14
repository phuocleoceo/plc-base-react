import { Draggable } from '@hello-pangea/dnd'

interface Props {
  index: number
  children: React.ReactNode
  className?: string
  draggableId: string
  isDragDisabled: boolean
}

export default function DraggableWrapper(props: Props) {
  const { index, draggableId, isDragDisabled, className, children } = props
  return (
    <Draggable {...{ index, draggableId, isDragDisabled }}>
      {({ innerRef, dragHandleProps, draggableProps }) => (
        <div className={className} ref={innerRef} {...dragHandleProps} {...draggableProps}>
          {children}
        </div>
      )}
    </Draggable>
  )
}
