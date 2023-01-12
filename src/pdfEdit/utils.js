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