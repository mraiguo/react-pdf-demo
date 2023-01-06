import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PdfViewer from './pdfViewer/index.js';
import { ConfigDrawer } from './configPanel/index.js';
import { PdfBoxesContext } from './context/pdfBoxesContext.js';

// TODO: 转换坐标为pdf坐标
// TODO: 拖过去后内容稍微不跟随鼠标
// TODO: 需要支持form表单的使用方式
// TODO: 加载 pdf的loading态 
// TODO: 滚动加载pdf
// TODO: 可以拖拽变量改变变量宽度

/**
 * @param {varsCoords} 变量坐标 
 * @param {sealCoords} 印章坐标 
 * @param {pdf} pdf url 或者流
 * 参考 upload, 提供一个 onChange 事件，将坐标信息传递出去
 * 返回值为 { pdf, varsCoords, sealCoords }
 * pdf 为 pdf 的流或者 pdfUrl
 * varsCoords 为变量坐标
 * sealCoords 为印章坐标
 */
function PdfEdit(props) {
  const [pdfBoxes, setPdfBoxes] = React.useState([
    { top: 20, left: 80, title: '公司联系人', page: 1 },
    { top: 180, left: 20, title: '公司地址', page: 2 },
  ])

  const { file } = props

  return (
    <PdfBoxesContext.Provider
      value={{
        pdfBoxes,
        setPdfBoxes
      }}
    >
        <div
          style={{ 
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <DndProvider backend={HTML5Backend}>
              <PdfViewer file={file} />
              <ConfigDrawer />
          </DndProvider>
        </div>
    </PdfBoxesContext.Provider>
  );
}

export default PdfEdit;
