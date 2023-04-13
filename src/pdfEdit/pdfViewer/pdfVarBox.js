import { useDrag } from 'react-dnd'
import update from 'immutability-helper'
import { ItemTypes } from '../ItemTypes.js'
import { useStore } from '../context/useStore.js';

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
export const PdfVarBox = ({ index, left, top, page = 1, width, hideSourceOnDrag, children }) => {
  const pdfBoxes = useStore((state) => state.pdfBoxes)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { index, left, top, page },
      hideSourceOnDrag: true,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, left, top, page],
  )
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />
  }

  const handleDelete = () => {
    const newPdfBoxes = update(pdfBoxes, {
      $splice: [[index, 1]],
    })

    useStore.setState({ pdfBoxes: newPdfBoxes })
  }

  return (
    <div
      ref={drag}
      style={{ ...style, left, top: top + ((page - 1) * 841), width }}
      data-testid="box"
    >
      {children}
      <span
        style={{
          cursor: 'pointer'
        }}
        onClick={handleDelete}
      >X</span>
    </div>
  )
}
