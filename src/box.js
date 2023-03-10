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

/**
 * 合同管理中存放变量和印章的盒子
 */
export const Box = function Box(props) {
  const { name, pdfBoxes, setPdfBoxes } = props

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
        pdfBoxes[name] = { title: name, top: 0, left: 0 }
        setPdfBoxes(pdfBoxes)
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
