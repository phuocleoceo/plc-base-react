import { Draggable } from '@hello-pangea/dnd'

interface Props {
  children: React.ReactNode
  className?: string
  draggableId: string
  index: number
  isDragDisabled: boolean
}

const DraggableWrapper = (props: Props) => {
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

export default DraggableWrapper
