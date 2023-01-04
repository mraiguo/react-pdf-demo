import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box } from './box.js'
import PdfDocument from './pdfDocument.js'
import './App.css';

// todo: 支持拖动到 pdf 上
// todo: 拖动到pdf上后，需要在pdf上一个副本
// todo: 在pdf上的支持拖动
// todo: 在pdf上的支持删除（右上角有一个删除小图标或者高亮后按删除键）

function App() {
  const [pdfBoxes, setPdfBoxes] = React.useState({
    a: { top: 20, left: 80, title: 'Drag me around' },
    b: { top: 180, left: 20, title: 'Drag me too' },
  })

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <PdfDocument pdfBoxes={pdfBoxes} setPdfBoxes={setPdfBoxes} />
        <div>
          <div style={{ overflow: 'hidden', clear: 'both' }}>
            <Box pdfBoxes={pdfBoxes} setPdfBoxes={setPdfBoxes} name="Glass" />
            <Box pdfBoxes={pdfBoxes} setPdfBoxes={setPdfBoxes} name="Banana" />
            <Box pdfBoxes={pdfBoxes} setPdfBoxes={setPdfBoxes} name="Paper" />
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
