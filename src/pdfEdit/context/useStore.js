import { create } from 'zustand'
export const useStore = create(set => ({
  pdfBoxes: [],
  pdfDocument: null,
  searchText: ''
}))
