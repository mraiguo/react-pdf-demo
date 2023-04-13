import React from 'react'
import { debounce } from 'lodash-es'
import { useStore } from './context/useStore.js';

export default function SearchText() {
  const [searchPageNum, setSearchPageNum] = React.useState([])

  const pdfDocument = useStore(state => state.pdfDocument);

  const searchTask = debounce((searchText) => {
    const numPages = pdfDocument.numPages;
      const pagePromises = [];
      for (let i = 1; i <= numPages; i++) {
        pagePromises.push(pdfDocument.getPage(i));
      }
      const pageNumbers = [];

      Promise.all(pagePromises).then(pages => {
        Promise.all(pages.map(page => page.getTextContent())).then(textContents => {
          textContents.forEach((textContent, index) => {
            const textItems = textContent.items;
            for (let j = 0; j < textItems.length; j++) {
              const text = textItems[j].str;

              if (text.includes(searchText)) {
                pageNumbers.push(index);
                break;
              }
            }
          })
        }).then(() => {
          setSearchPageNum(pageNumbers)
        })
      })
  }, 300)

  return (
    <div>
      搜索文本并高亮:
      <input
        placeholder='搜索文本并高亮'
        onChange={(e) => {
          useStore.setState({ searchText: e.target.value })
          searchTask(e.target.value)
        }}
      />
      <br />
      文本在这些页面有出现：
      <br />
      {searchPageNum.join(',')}
    </div>
  )
}
