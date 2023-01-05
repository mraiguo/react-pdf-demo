import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './App.css';
import PdfEdit from './pdfEdit/index.js';

// todo: 支持拖动到 pdf 上
// todo: 拖动到pdf上后，需要在pdf上一个副本
// todo: 在pdf上的支持拖动
// todo: 在pdf上的支持删除（右上角有一个删除小图标或者高亮后按删除键）

function App() {
  return (
    <div className="App" style={{
      width: '100%',
    }}>
      <PdfEdit />
    </div>
  );
}

export default App;
