import React, {useEffect } from 'react'
import { VarBox } from './varBox'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const ConfigDrawer = () => {
  // 配置面板上的模板变量
  const [pdfVars, setPdfVars] = React.useState([])

  useEffect(() => {
    // 模拟异步获取模板变量配置信息
    sleep(1000).then(() => {
      setPdfVars([
        { type: '企业信息', name: '合同主体',  value: 'packSubject', width: '100px' },
        { type: '企业信息', name: '公司法人',  value: 'CorporateLegalPerson', width: '150px' },
      ])
    })
  }, [])

  return (
    <div
      style={{
        width: '200px',
        minHeight: '100%',
        overflow: 'hidden',
        border: '1px solid red'
      }}>
      {
        pdfVars.map((item) => {
          return <VarBox key={item.name} name={item.name} width={item.width} />
        })
      }
    </div>
  )
}