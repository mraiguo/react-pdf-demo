import React, { useState, useEffect } from 'react'
import { Document } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { VariableSizeList as List } from "react-window";
import { DragDropPage } from './DragDropPage';
import { getScrollbarWidth, asyncMap } from '../utils';

const scrollbarWidth = getScrollbarWidth()

/**
 * pdf 显示区域
 */
function PdfViewer(props) {
  const { file, onChange } = props
  const [pdf, setPdf] = useState(null);
  const [pageViewports, setPageViewports] = useState(null);
  const [pageHeight, setPageHeight] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)
  console.log('[ pageViewports ]:', pageViewports)

  /**
   * React-Window cannot get item size using async getter, therefore we need to
   * calculate them ahead of time.
   */
  useEffect(() => {
    setPageViewports(null);

    if (!pdf) {
      return;
    }

    (async () => {
      const pageNumbers = Array.from(new Array(pdf.numPages)).map(
        (_, index) => index + 1
      );

      const nextPageViewports = await asyncMap(pageNumbers, (pageNumber) =>
        pdf.getPage(pageNumber).then((page) => page.getViewport({ scale: 1 }))
      );

      // 获取每一页的高度，宽度等信息
      setPageViewports(nextPageViewports);
    })();
  }, [pdf]);


  function onDocumentLoadSuccess(pdf) {
    setPdf(pdf)
  }

  function Row({ index, style }) {
    function onPageRenderSuccess(page) {
      setPageHeight(page.height)
      setPageWidth(page.width)
    }

    return (
      <div style={style}>
        <DragDropPage
          allowedDropEffect="any"
          pageNumber={index + 1}
          renderTextLayer={false} // 不渲染文本选择层
          renderAnnotationLayer={false} // 不渲染注释层
          onPageRenderSuccess={onPageRenderSuccess}
        />
      </div>
    );
  }

  function getPageHeight(pageIndex) {
    if (!pageViewports) {
      throw new Error("getPageHeight() called too early");
    }

    const pageViewport = pageViewports[pageIndex];
    const actualHeight = pageViewport.height;

    return actualHeight;
  }

  return (
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          height: '841px',
          width: '595px',
        }}
      >
        <Document
          onLoadSuccess={onDocumentLoadSuccess}
          file={file}
        >
          <div
            style={{
              position: 'relative',
              // overflowX: 'hidden',
              // overflowY: 'scroll',
            }}
          >
            {
              (pdf && pageViewports) ? (
                <List
                  width={pageWidth + scrollbarWidth}
                  // width={595}
                  height={pageHeight}
                  estimatedItemSize={pageHeight}
                  itemCount={pdf.numPages}
                  itemSize={getPageHeight}
                >
                {Row}
              </List>
              ) : null
            }
          </div>
        </Document>
      </div>
  );
}

export default PdfViewer;
