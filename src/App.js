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
// todo: 在pdf上的支持删除

function App() {
  const [pdfDives, setPdfDives] = React.useState([])

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <PdfDocument pdfDives={pdfDives} />
        <div>
          <div style={{ overflow: 'hidden', clear: 'both' }}>
            <Box pdfDives={pdfDives} setPdfDives={setPdfDives} name="Glass" />
            <Box pdfDives={pdfDives} setPdfDives={setPdfDives} name="Banana" />
            <Box pdfDives={pdfDives} setPdfDives={setPdfDives} name="Paper" />
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
