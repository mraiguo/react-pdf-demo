import React, { useState, useCallback, useContext } from 'react'
import update from 'immutability-helper'
import { VariableSizeList as List } from "react-window";

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../ItemTypes';
import { PdfVarBox } from './pdfVarBox';
import { PdfBoxesContext } from '../context/pdfBoxesContext';
import { transPdfToPageCoords } from '../utils';

/**
 * Page 显示区域,负责拖拽合变量的显示
 */
function DragDropPage(props) {
  const { pdfBoxes, setPdfBoxes } = useContext(PdfBoxesContext)

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: () => ({ name: 'Dustbin', page: 1 }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  function Row({ index, style }) {
    const [currentPage, setCurrentPage] = useState()

    function onPageRenderSuccess(page) {
      setCurrentPage(page.pageNumber)
      console.log(`Page ${page.pageNumber} rendered`);
    }

    return (
      <div style={style}>
        {
          Array.isArray(pdfBoxes) && Object.keys(pdfBoxes).map((key) => {
            // TODO: 优化
            const { left, top, title, width, page: pdfBoxPage } = pdfBoxes[key]
            console.log('[ pdfBoxPage ]:', pdfBoxPage, currentPage)

            // if (pdfBoxPage !== currentPage) {
            //   return null
            // }

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
        <Page
          inputRef={drop}
          onRenderSuccess={onPageRenderSuccess}
          pageIndex={index}
          width={595}
        />
      </div>
    );
  }

  return (
      <>{Row}</>
  );
}

export default DragDropPage;
