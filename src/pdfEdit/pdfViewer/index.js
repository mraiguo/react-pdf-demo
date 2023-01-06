import React, { useState, useCallback, useContext } from 'react'
import update from 'immutability-helper'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../ItemTypes';
import { PdfVarBox } from './pdfVarBox';
import { PdfBoxesContext } from '../context/pdfBoxesContext';
import { transPdfToPageCoords } from '../utils';

/**
 * pdf 显示区域
 */
function PdfViewer(props) {
  const { file, onChange } = props
  const pdfPageRef = React.useRef(null)
  const { pdfBoxes, setPdfBoxes } = useContext(PdfBoxesContext)

  /**
   * pdf 内部的 box 移动更新位置
   */
  const moveBox = useCallback(
    ({ index, left, top }) => {
      const newPdfBoxes = update(pdfBoxes, {
        [index]: {
          $merge: { left, top },
        },
      })

      setPdfBoxes(newPdfBoxes)
      onChange(transPdfToPageCoords(newPdfBoxes))
    },
    [pdfBoxes, setPdfBoxes, onChange],
  )

 
  const [, pdfBoxDrop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset()
        const { x, y } = monitor.getClientOffset()
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)

        const pdfViewerRect = pdfPageRef.current.getBoundingClientRect()

        // 从配置面板拖动过来后，需要将配置面板中的数据同步到 pdfBoxes 中
        if (item?.source === 'var') {
          const name = item?.name
          const width = item?.width
          const left = Math.round(item.left + x - pdfViewerRect.x)
          const top = Math.round(item.top + y - pdfViewerRect.y)
          pdfBoxes.push({ title: name, top, left, width })
          setPdfBoxes(pdfBoxes)

          onChange(transPdfToPageCoords(pdfBoxes))
          return
        }

        moveBox({ item, index:item.index, left, top })
        return undefined
      },
    }),
    [moveBox],
  )
  /**
   * end
   */

  const [numPages, setNumPages] = useState(null);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: () => ({ name: 'Dustbin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const isActive = canDrop && isOver
  let borderColor = '1px solid #222'
  if (isActive) {
    borderColor = '1px solid darkgreen'
  } else if (canDrop) {
    borderColor = '2px solid green'
  }

  return (
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          height: '841px',
          width: '595px',
          overflowY: 'scroll',
        }}
      >
        <Document
          inputRef={drop}
          onLoadSuccess={onDocumentLoadSuccess}
          file={file}
        >
          <div
            style={{
              position: 'relative',
              border: borderColor,
              overflowX: 'hidden',
              overflowY: 'scroll',
            }}
            ref={(ref) => {
              pdfPageRef.current = ref
              return pdfBoxDrop(ref)
            }}
          >
            {Array.from(
              new Array(numPages),
              (el, index) => {
                return (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    renderTextLayer={false} // 不渲染文本选择层
                    renderAnnotationLayer={false} // 不渲染注释层
                  />
                )
              },
            )}
            {
              Array.isArray(pdfBoxes) && Object.keys(pdfBoxes).map((key) => {
                // TODO: 优化
                const { left, top, title, width } = pdfBoxes[key]

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
        </Document>
      </div>
  );
}

export default PdfViewer;
