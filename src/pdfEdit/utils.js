export function transPageToPdfCoords(pageCoords) {
  if (!pageCoords) {
    return
  }

  const pdfCoords = pageCoords.map((item) => {
    const { page = 1, top, ...rest } = item
    const newItem = {
      top: top + (page - 1) * 842,
      ...rest
    }
    return newItem
  })

  return pdfCoords
}

/**
 * 把有 page 参数的坐标转换绝对位置的坐标
 */
export function transPdfToPageCoords(pdfCoords) {
  if (!pdfCoords) {
    return
  }

  const pageCoords = pdfCoords.map((item) => {
    const { top, ...rest } = item
    const page = Math.floor(top / 842) + 1
    const newItem = {
      page,
      top: top - (page - 1) * 842,
      ...rest
    }
    return newItem
  })

  return pageCoords
}

export function getScrollbarWidth() {

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}


export function asyncMap(
  arr, fn,
) {
  return new Promise((resolve, reject) => {
    Promise.all(arr.map(fn)).then(resolve).catch(reject);
  });
}
