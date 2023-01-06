import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './App.css';
import PdfEdit from './pdfEdit/index.js';

// todo: 支持拖动到 pdf 上
// todo: 拖动到pdf上后，需要在pdf上一个副本
// todo: 在pdf上的支持拖动
// todo: 在pdf上的支持删除（右上角有一个删除小图标或者高亮后按删除键）

function App() {
  const file = 'https://aiguo-fuzhou.oss-cn-fuzhou.aliyuncs.com/%E4%BA%8C%E6%89%8B%E6%88%BF%E6%97%A0%E4%B8%AD%E4%BB%8B%E4%B9%B0%E5%8D%96%E5%90%88%E5%90%8C.pdf'
  
  const varsCoords = [
    { top: 20, left: 80, title: '公司联系人', page: 1 },
    { top: 180, left: 20, title: '公司地址', page: 2 },
  ]

  
  return (
    <div className="App" style={{
      width: '100%',
    }}>
      <PdfEdit defaultVarCoords={varsCoords} file={file} />
    </div>
  );
}

export default App;
