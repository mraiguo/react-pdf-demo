import React, { useState, useCallback } from 'react'
import update from 'immutability-helper'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDrop } from 'react-dnd'
import './App.css';
import { ItemTypes } from './ItemTypes';
import { PdfBox } from './pdfBox';

function PdfDocument(props) {
  const { pdfBoxes, setPdfBoxes } = props

  const moveBox = useCallback(
    (id, left, top) => {
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
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
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
      <div>
        <Document
          // style={{position: 'relative'}}
          inputRef={drop}
          style={{ border: borderColor }}
          onLoadSuccess={onDocumentLoadSuccess}
          file="https://aiguo-fuzhou.oss-cn-fuzhou.aliyuncs.com/%E4%BA%8C%E6%89%8B%E6%88%BF%E6%97%A0%E4%B8%AD%E4%BB%8B%E4%B9%B0%E5%8D%96%E5%90%88%E5%90%8C.pdf">
            <Page
              // canvasRef={drop}
              inputRef={pdfBoxDrop}
              renderTextLayer={false} // 不渲染文本选择层
              renderAnnotationLayer={false} // 不渲染注释层
              pageNumber={pageNumber}
            >
              {Object.keys(pdfBoxes).map((key) => {
                const { left, top, title } = pdfBoxes[key]
                return (
                  <PdfBox
                    key={key}
                    id={key}
                    left={left}
                    top={top}
                  >
                    {title}
                  </PdfBox>
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

        {/* <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Dustbin />
        </div> */}

        
      </div>
  );
}

export default PdfDocument;
