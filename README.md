# MSFLib Documentation Site

A GitBook-style documentation website for the three MSFLib libraries, built with
React 19 + Vite.

- **Landing page** — introduces `@msflib/vue`, `msflib-react` and `msflib-fastapi`
  with cards linking into each documentation section.
- **Docs sections** — each library gets its own section with grouped sidebar
  navigation, breadcrumbs, an in-page TOC, prev/next paging and full-text search
  (⌘K / `/`).
- **Content as React** — every documentation page is a `.tsx` component under
  `src/content/<library>/`, rendered with a small primitives library
  (`src/components/md.tsx`: code blocks with a mini syntax highlighter and copy
  button, tables, callouts, anchored headings). There is no markdown pipeline.

## Develop

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the build
```

## Adding a page

1. Create `src/content/<library>/<page-id>.tsx` — default-export a component
   using the primitives from `components/md`.
2. Register it in `src/lib/pages.tsx` (imports + entry with title/description/
   search text).
3. Add it to the library's nav in `src/lib/docs.js`.
