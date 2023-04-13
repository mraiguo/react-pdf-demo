import React, { useState, useEffect } from 'react'
import { Document } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { VariableSizeList as List } from "react-window";
import { DragDropPage } from './DragDropPage';
import { getScrollbarWidth, asyncMap } from '../utils';
import { useStore } from '../context/useStore';

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
  const pdfDocument = useStore(state => state.pdfDocument);
  const [pageViewports, setPageViewports] = useState(null);

  /**
   * React-Window cannot get item size using async getter, therefore we need to
   * calculate them ahead of time.
   */
  useEffect(() => {
    setPageViewports(null);

    if (!pdfDocument) {
      return;
    }

    (async () => {
      const pageNumbers = Array.from(new Array(pdfDocument.numPages)).map(
        (_, index) => index + 1
      );

      const nextPageViewports = await asyncMap(pageNumbers, (pageNumber) =>
        pdfDocument.getPage(pageNumber).then((page) => {
          return page.getViewport({ scale: 1 })
        })
      );

      // 获取每一页的高度，宽度等信息
      setPageViewports(nextPageViewports);
    })();
  }, [pdfDocument]);

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
          onLoadSuccess={(pdfDocument) => {
            useStore.setState({ pdfDocument })
          }}
          file={file}
        >
          {
            (pdfDocument && pageViewports) ? (
              <List
                width={pageViewports[0].width + scrollbarWidth}
                // width={595}
                height={pageViewports[0].height}
                estimatedItemSize={pageViewports[0].height}
                itemCount={pdfDocument.numPages}
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
