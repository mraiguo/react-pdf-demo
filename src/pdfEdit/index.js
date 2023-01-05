import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PdfViewer from './pdfViewer/index.js';
import { ConfigDrawer } from './configPanel/index.js';
import { PdfBoxesContext } from './context/pdfBoxesContext.js';

// TODO: 转换坐标为pdf坐标
// TODO: 拖过去后内容稍微不跟随鼠标
// TODO: 拖动过去后的pdf上的变量需要变成预设的宽度

function PdfEdit() {
  const [pdfBoxes, setPdfBoxes] = React.useState([
    { top: 20, left: 80, title: '公司联系人' },
    { top: 180, left: 20, title: '公司地址' },
  ])

  return (
    <PdfBoxesContext.Provider value={{
      pdfBoxes,
      setPdfBoxes
    }}>
      <DndProvider backend={HTML5Backend}>
        <div
          style={{ 
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <PdfViewer  />
          <ConfigDrawer />
        </div>
      </DndProvider>
    </PdfBoxesContext.Provider>
  );
}

export default PdfEdit;
