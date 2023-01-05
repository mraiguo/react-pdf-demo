import { useDrag } from 'react-dnd'
import { ItemTypes } from '../ItemTypes.js'
const style = {
  position: 'absolute',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '5px',
  cursor: 'move',
  minWidth: "max-content",
  boxSizing: "border-box",
}

/**
 * pdf上可拖拽的变量和印章
 */
export const PdfVarBox = ({ id, left, top, width, hideSourceOnDrag, children }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top },
      hideSourceOnDrag: true,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top],
  )
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />
  }
  return (
    <div
      className="box"
      ref={drag}
      style={{ ...style, left, top, width }}
      data-testid="box"
    >
      {children}
    </div>
  )
}
