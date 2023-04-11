import React from 'react'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './App.css';
import PdfEdit from './pdfEdit/index.js';
import pdfFile from './150page.pdf'

// todo: 支持拖动到 pdf 上
// todo: 拖动到pdf上后，需要在pdf上一个副本
// todo: 在pdf上的支持拖动
// todo: 在pdf上的支持删除（右上角有一个删除小图标或者高亮后按删除键）

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return blob
  // return new File([blob], fileName, { type: 'image/png' });
}

function App() {
  const file = pdfFile

  const varsCoords = [
    { top: 20, left: 80, title: '默认-公司联系人', page: 1 },
    { top: 180, left: 20, title: '默认-公司地址', page: 2 },
  ]

  const [nativeFile, setNativeFile] = React.useState(null)

  return (
    <div className="App" style={{
      width: '100%',
    }}>
      <PdfEdit
        defaultVarCoords={varsCoords}
        file={file}
        // file={nativeFile} // 测试base64转换文件
        onChange={(v) => {
          console.log('onChange:', v)
        }}
      />
      <input
        type="file"
        onChange={async (e) => {
        //  form.append('file', e.files);
        const f = await toBase64(e.target.files[0])
        const f1 = await dataUrlToFile(f, e.target.files[0].name)
         setNativeFile(f1)
        }}
      />
    </div>
  );
}

export default App;
