import { Direction, Droppable } from '@hello-pangea/dnd'

interface Props {
  children: React.ReactNode
  className?: string
  droppableId: string
  type: string
  direction?: Direction
}

export default function DroppableWrapper(props: Props) {
  const { children, className, droppableId, type, direction } = props

  return (
    <Droppable direction={direction} type={type} droppableId={droppableId}>
      {(provided) => (
        <div className={className} ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
