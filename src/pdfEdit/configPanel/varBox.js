import { useDrag } from 'react-dnd'
import { ItemTypes } from '../ItemTypes.js'

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
export const VarBox = function Box(props) {
  const { name } = props

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: {
      source: 'var',
      name,
      left: 0,
      top: 0,
      test: 'aaaaa'
    },
    // options: {
    //   dropEffect: 'copy'
    // },
    drop: (item, monitor) => {
      // 获取拖拽结束后的坐标
      const clientOffset = monitor.getClientOffset()
      console.log(11111, clientOffset)

      return monitor.getClientOffset();
      // 根据坐标做一些事情，例如移动元素
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      // monitor.subscribeToOffsetChange(() => {
      //   console.log(1111122, monitor.getClientOffset())
      // })
      console.log(111222, monitor.getClientOffset())
      if (item && dropResult) {
        // alert(`You dropped ${item.name} into ${dropResult.name}!`)
        // pdfBoxes[name] = { title: name, top: 0, left: 0 }
        // setPdfBoxes(pdfBoxes)
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
