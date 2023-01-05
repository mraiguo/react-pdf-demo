import React, { useState, useCallback, useContext } from 'react'
import update from 'immutability-helper'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../ItemTypes';
import { PdfVarBox } from './pdfVarBox';
import { PdfBoxesContext } from '../context/pdfBoxesContext';

function PdfViewer(props) {
  const pdfPageRef = React.useRef(null)
  const { pdfBoxes, setPdfBoxes } = useContext(PdfBoxesContext)

  const moveBox = useCallback(
    (id, left, top) => {
      // 从 配置抽屉 中拖拽到 pdfViewer 时，id 为 undefined
      if (!id) {
        return
      }
      setPdfBoxes(
        update(pdfBoxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      )
    },
    [pdfBoxes, setPdfBoxes],
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
          pdfBoxes.push({ title: name, top, left, width, page: pageNumber })
          setPdfBoxes(pdfBoxes)
          return
        }

        moveBox(item.id, left, top)
        return undefined
      },
    }),
    [moveBox],
  )

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

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
    borderColor = '1px solid darkkhaki'
  }

  return (
      <div style={{
        flexGrow: 1,
      }}>
        <Document
          inputRef={drop}
          style={{ border: borderColor }}
          onLoadSuccess={onDocumentLoadSuccess}
          file="https://aiguo-fuzhou.oss-cn-fuzhou.aliyuncs.com/%E4%BA%8C%E6%89%8B%E6%88%BF%E6%97%A0%E4%B8%AD%E4%BB%8B%E4%B9%B0%E5%8D%96%E5%90%88%E5%90%8C.pdf">
            <Page
              // canvasRef={drop}
              inputRef={(ref) => {
                pdfPageRef.current = ref
                return pdfBoxDrop(ref)
              }}
              // inputRef={pdfBoxDrop}
              renderTextLayer={false} // 不渲染文本选择层
              renderAnnotationLayer={false} // 不渲染注释层
              pageNumber={pageNumber}
            >
              {Object.keys(pdfBoxes).map((key) => {
                // TODO: 优化
                const { left, top, title, width, page } = pdfBoxes[key]

                if (page !== pageNumber) {
                  return null
                }

                return (
                  <PdfVarBox
                    key={key}
                    id={key}
                    left={left}
                    top={top}
                    width={width}
                  >
                    {title}
                  </PdfVarBox>
                )
              })}
            </Page>
        </Document>
        <div style={{ textAlign: 'center' }}>
          <p>
            <button
              onClick={() => {
                setPageNumber(pageNumber - 1)
              }}
            >
              上一页
            </button>
            <button
              onClick={() => {
                setPageNumber(pageNumber + 1)
              }}
            >
              下一页
            </button>
          </p>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      </div>
  );
}

export default PdfViewer;
