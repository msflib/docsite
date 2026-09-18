import { libById } from './docs'
import { pageRegistry } from './pages'

// Search index built from the page registry (no markdown pipeline).
export const searchIndex = Object.values(pageRegistry).map((p) => {
  const lib = libById[p.libId]
  return {
    libId: p.libId,
    libName: lib?.pkg ?? p.libId,
    color: lib?.color ?? '#888',
    pageId: p.pageId,
    group: p.title,
    title: p.title,
    description: p.description,
    text: p.text,
  }
})
