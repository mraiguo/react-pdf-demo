import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PdfViewer from './pdfViewer/index.js';
import { ConfigDrawer } from './configPanel/index.js';
import { PdfBoxesContext } from './context/pdfBoxesContext.js';

// TODO: 转换坐标为pdf坐标
// TODO: 拖过去后内容稍微不跟随鼠标
// TODO: 删除变量

function PdfEdit() {
  const [pdfBoxes, setPdfBoxes] = React.useState([
    { top: 20, left: 80, title: '公司联系人', page: 1 },
    { top: 180, left: 20, title: '公司地址', page: 2 },
  ])

  return (
    <PdfBoxesContext.Provider value={{
      pdfBoxes,
      setPdfBoxes
    }}>
        <div
          style={{ 
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <DndProvider backend={HTML5Backend}>
              <PdfViewer  />
              <ConfigDrawer />
          </DndProvider>
        </div>
    </PdfBoxesContext.Provider>
  );
}

export default PdfEdit;
