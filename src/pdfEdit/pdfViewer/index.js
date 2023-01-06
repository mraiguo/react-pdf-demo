import React, { useState, useCallback, useContext } from 'react'
import update from 'immutability-helper'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../ItemTypes';
import { PdfVarBox } from './pdfVarBox';
import { PdfBoxesContext } from '../context/pdfBoxesContext';

/**
 * pdf 显示区域
 */
function PdfViewer(props) {
  const { file } = props
  const pdfPageRef = React.useRef(null)
  const { pdfBoxes, setPdfBoxes } = useContext(PdfBoxesContext)

  /**
   * pdf 内部的 box 移动更新位置
   */
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
  /**
   * end
   */

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
          style={{ border: borderColor }}
          onLoadSuccess={onDocumentLoadSuccess}
          file={file}
        >
          <div
            style={{
              position: 'relative',
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
                const { left, top, title, width, page } = pdfBoxes[key]

                return (
                  <PdfVarBox
                    page={page}
                    key={key}
                    id={key}
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
            {/* <Page
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
            </Page> */}
        </Document>
        {/* <div style={{ textAlign: 'center' }}>
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
        </div> */}
      </div>
  );
}

export default PdfViewer;
