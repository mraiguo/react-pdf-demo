import React from 'react'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PdfViewer from './pdfViewer/index.js';
import { ConfigDrawer } from './configPanel/index.js';
import { transPageToPdfCoords } from './utils.js';
import { useStore } from './context/useStore.js';

// TODO: 转换坐标为 pdf 坐标
// TODO: 拖过去后内容稍微不跟随鼠标
// TODO: 需要支持form表单的使用方式
// TODO: 加载 pdf的loading态
// TODO: pdf的高度为 841  正常是842
// TODO: 二期，可以拖拽变量改变变量宽度



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
  const {
    file,
    varsCoords,
    defaultVarCoords,
    onChange,
  } = props

  if (Array.isArray(varsCoords)) {
    useStore.setState({
      pdfBoxes: transPageToPdfCoords(varsCoords) || [],
    })
  }



  // const [pdfBoxes, setPdfBoxes] = useMergedState(null, {
    // value: transPageToPdfCoords(varsCoords),
    // defaultValue: transPageToPdfCoords(defaultVarCoords) || [],
  // })


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <PdfViewer onChange={onChange} file={file} />
        <ConfigDrawer />
      </DndProvider>
    </div>
  );
}

export default PdfEdit;
