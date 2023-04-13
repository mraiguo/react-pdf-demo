import React, { useCallback } from 'react'
import update from 'immutability-helper'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../ItemTypes.js'
import { PdfVarBox } from './pdfVarBox';
import { useStore } from '../context/useStore.js';
import { Page } from 'react-pdf/dist/esm/entry.webpack5';
import { transPdfToPageCoords } from '../utils.js';


const style = {
  position: 'relative',
}

export const DragDropPage = ({
  pageNumber,
  onChange,
  onPageRenderSuccess
}) => {
  const pdfBoxes = useStore((state) => state.pdfBoxes)
  const searchText = useStore((state) => state.searchText)

  const pageRef = React.useRef(null)

  const moveBox = useCallback(
    ({ index, left, top }) => {
      pdfBoxes[index] = { ...pdfBoxes[index], left, top }

      const newPdfBoxes = update(pdfBoxes, {
        [index]: {
          $merge: { left, top },
        },
      })

      useStore.setState({ pdfBoxes: newPdfBoxes })

      if (onChange) {
        onChange(transPdfToPageCoords(newPdfBoxes))
      }
    },
    [pdfBoxes, onChange],
  )

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

          const newPdfBoxesRes = update(pdfBoxes, {
            $push: [{ title: name, top, left, width, page: pageNumber }],
          })

          useStore.setState({ pdfBoxes: newPdfBoxesRes })

          if (onChange) {
            onChange(transPdfToPageCoords(pdfBoxes))
          }
          return
        }

        moveBox({ item, index:item.index, left, top, page: pageNumber })

        return undefined
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    // 需要加这个，否则 pdfBoxes 会被闭包变成旧值
    [pdfBoxes]
  )

  console.log('dragDropPage render')

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
        pageNumber={pageNumber}
        renderTextLayer // 不渲染文本选择层
        renderAnnotationLayer={false} // 不渲染注释层
        onRenderSuccess={onPageRenderSuccess}
        customTextRenderer={({ str }) => {
          let text = str

          if (searchText) {
            console.log('[ searchText ]:', searchText)
            text = text.replace(searchText, () => `<div style='color: red'">${searchText}</div>`)
          }
          return text
        }}
      />
      {
        Array.isArray(pdfBoxes) && Object.keys(pdfBoxes).map((key) => {
          // TODO: 优化
          const { left, top, title, width, page } = pdfBoxes[key]

          // 只渲染当前页的变量
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
