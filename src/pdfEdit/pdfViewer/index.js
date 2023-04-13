import React, { useState, useEffect } from 'react'
import { Document } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { VariableSizeList as List } from "react-window";
import { DragDropPage } from './DragDropPage';
import { getScrollbarWidth, asyncMap } from '../utils';

const scrollbarWidth = getScrollbarWidth()

const Row = ({ onChange }) => ({ index, style }) => {
  function onPageRenderSuccess(page) {
    console.log(`渲染了第${page.pageNumber}页`)
  }

  return (
    <div style={style}>
      <DragDropPage
        onChange={onChange}
        allowedDropEffect="any"
        pageNumber={index + 1}
        renderTextLayer={false} // 不渲染文本选择层
        renderAnnotationLayer={false} // 不渲染注释层
        onPageRenderSuccess={onPageRenderSuccess}
      />
    </div>
  );
}

/**
 * pdf 显示区域
 */
function PdfViewer(props) {
  const { file, onChange } = props
  const [pdf, setPdf] = useState(null);
  const [pageViewports, setPageViewports] = useState(null);

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

  function getPageHeight(pageIndex) {
    if (!pageViewports) {
      throw new Error("getPageHeight 调用太早了");
    }

    return pageViewports[pageIndex]?.height;;
  }

  console.log('pdfViewer render')

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
          onLoadSuccess={(pdf) => {
            setPdf(pdf)
          }}
          file={file}
        >
          {
            (pdf && pageViewports) ? (
              <List
                width={pageViewports[0].width + scrollbarWidth}
                // width={595}
                height={pageViewports[0].height}
                estimatedItemSize={pageViewports[0].height}
                itemCount={pdf.numPages}
                itemSize={getPageHeight}
              >
                {Row({ onChange })}
              </List>
            ) : null
          }
        </Document>
      </div>
  );
}

export default PdfViewer;
