import React, { useContext } from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../ItemTypes.js'
import { PdfVarBox } from './pdfVarBox';
import { PdfBoxesContext } from '../context/pdfBoxesContext';
import { Page } from 'react-pdf/dist/esm/entry.webpack5';

const style = {
  position: 'relative',
}

export const DragDropPage = ({
  pageNumber,
  onPageRenderSuccess
}) => {

  const { pdfBoxes, setPdfBoxes } = useContext(PdfBoxesContext)
  const pageRef = React.useRef(null)

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset()

        const { x, y } = monitor.getClientOffset()
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)

        const pdfViewerRect = pageRef.current.getBoundingClientRect()

        // 从配置面板拖动过来后，需要将配置面板中的数据同步到 pdfBoxes 中
        if (item?.source === 'var') {
          const name = item?.name
          const width = item?.width
          const left = Math.round(item.left + x - pdfViewerRect.x)
          const top = Math.round(item.top + y - pdfViewerRect.y)
          pdfBoxes.push({ title: name, top, left, width, page: pageNumber })
          setPdfBoxes(pdfBoxes)

          // onChange(transPdfToPageCoords(pdfBoxes))
          return
        }

        // moveBox({ item, index:item.index, left, top })
        return undefined
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
  )

  return (
    <div
      key={pageNumber}
      ref={(ref) => {
        pageRef.current = ref
        return drop(ref)
      }}
      style={{ ...style }}
    >
      <Page
        // key={key}
        pageNumber={pageNumber}
        renderTextLayer={false} // 不渲染文本选择层
        renderAnnotationLayer={false} // 不渲染注释层
        onRenderSuccess={onPageRenderSuccess}
      />
      {
        Array.isArray(pdfBoxes) && Object.keys(pdfBoxes).map((key) => {
          // TODO: 优化
          const { left, top, title, width, page } = pdfBoxes[key]

          if (page !== pageNumber) {
            return null
          }

          return (
            <PdfVarBox
              index={key}
              key={key}
              left={left}
              top={top}
              width={width}
            >
              {title}
            </PdfVarBox>
          )
        })
      }
    </div>
  )
}
