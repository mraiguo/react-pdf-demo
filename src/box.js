import { useDrag } from 'react-dnd'
import { ItemTypes } from './ItemTypes.js'
const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}
export const Box = function Box(props) {
  const { name, pdfDives, setPdfDives } = props

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: {
      name,
      test: 'aaaaa'
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()

      if (item && dropResult) {
        alert(`You dropped ${item.name} into ${dropResult.name}!`)
        pdfDives.push({ name })
        setPdfDives(pdfDives)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
      {name}
    </div>
  )
}
