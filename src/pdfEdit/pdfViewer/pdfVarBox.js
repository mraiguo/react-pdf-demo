import { useContext } from 'react';
import { useDrag } from 'react-dnd'
import update from 'immutability-helper'
import { ItemTypes } from '../ItemTypes.js'
import { PdfBoxesContext } from '../context/pdfBoxesContext';

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
  const { pdfBoxes, setPdfBoxes } = useContext(PdfBoxesContext)

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
        onClick={() => {
          setPdfBoxes(
            update(pdfBoxes, {
              $splice: [[index, 1]],
            }),
          )
        }}
      >X</span>
    </div>
  )
}
