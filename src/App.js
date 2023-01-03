import React, { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
// import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './App.css';

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="App">
        <Document
          // style={{position: 'relative'}}
          onLoadSuccess={onDocumentLoadSuccess}
          file="https://aiguo-fuzhou.oss-cn-fuzhou.aliyuncs.com/%E9%99%84%E4%BB%B615%E3%80%81%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E5%90%88%E5%90%8C%EF%BC%88%E5%85%A5%E8%81%8C%EF%BC%89%E3%80%90%E6%97%A0%E7%AB%9E%E4%B8%9A%E9%99%90%E5%88%B6%E5%86%85%E5%AE%B9%E7%89%88%E6%9C%AC%E3%80%91202209.pdf">
            <Page
              renderTextLayer={false} // 不渲染文本选择层
              renderAnnotationLayer={false} // 不渲染注释层
              pageNumber={pageNumber}
            >
              <div style={{position: 'absolute', top: '0'  }}>11111</div> 
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

export default App;
