import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PdfViewer from './pdfViewer/index.js';
import { ConfigDrawer } from './configDrawer/index.js';
import { PdfBoxesContext } from './context/pdfBoxesContext.js';

function PdfEdit() {
  const [pdfBoxes, setPdfBoxes] = React.useState({
    a: { top: 20, left: 80, title: '公司联系人' },
    b: { top: 180, left: 20, title: '公司地址' },
  })

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
