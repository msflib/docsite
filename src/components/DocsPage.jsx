import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { firstPageOf, getPage, prevNext } from '../lib/docs'
import { getPageEntry } from '../lib/pages'
import { IconArrowLeft, IconArrowRight, IconChevronRight, IconClose } from '../lib/icons'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

function useScrollSpy(containerRef, deps) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const rootEl = containerRef.current
    if (!rootEl) return
    const headings = Array.from(rootEl.querySelectorAll('h2[id], h3[id]'))
    if (headings.length === 0) return
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const line = window.innerHeight * 0.32
        let current = ''
        for (const h of headings) {
          if (h.getBoundingClientRect().top <= line) current = h.id
        }
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return active
}

/** Build the "On this page" TOC from the rendered headings. */
function useTocFromDom(containerRef, key) {
  const [toc, setToc] = useState([])
  useEffect(() => {
    setToc([])
    const t = setTimeout(() => {
      const rootEl = containerRef.current
      if (!rootEl) return
      const heads = Array.from(rootEl.querySelectorAll('h2[id], h3[id]'))
      setToc(
        heads.map((h) => ({
          id: h.id,
          text: h.textContent,
          level: h.tagName === 'H2' ? 2 : 3,
        })),
      )
    }, 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return toc
}

function TocList({ toc, contentRef }) {
  const active = useScrollSpy(contentRef, [toc.map((t) => t.id).join(',')])
  return (
    <nav aria-label="On this page">
      {toc.map((h, i) => (
        <a
          key={`${h.id}-${i}`}
          href={`#${h.id}`}
          className={`${h.level === 2 ? 'toc-h2' : 'toc-h3'}${active === h.id ? ' toc-active' : ''}`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )
}

export default function DocsPage() {
  const { libId, pageId } = useParams()
  const page = useMemo(() => getPage(libId ?? '', pageId ?? ''), [libId, pageId])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const contentRef = useRef(null)
  const toc = useTocFromDom(contentRef, page ? `${page.lib.id}/${page.page.id}` : 'none')

  const knownLib = libId && libId in { vue: 1, react: 1, fastapi: 1 }
  if (!page && knownLib) {
    return <Navigate to={`/${libId}/${firstPageOf(libId)}`} replace />
  }
  if (!page) return <Navigate to="/" replace />

  const { lib: L, group, page: pg } = page
  const entry = getPageEntry(L.id, pg.id)
  const { prev, next } = prevNext(L, pg.id)

  const PageComp = entry?.Component

  return (
    <div className="lib-root" data-lib={L.id}>
      <TopBar lib={L} onMenu={() => setDrawerOpen(true)} />
      <div className={`docs-shell${toc.length > 0 ? ' toc-open' : ''}`}>
        <aside className="sidebar">
          <Sidebar lib={L} />
        </aside>
        <main className="docs-main">
          <article className="doc-content" ref={contentRef}>
            <nav className="doc-crumb" aria-label="Breadcrumb">
              <Link to="/">MSFLib</Link>
              <IconChevronRight />
              <Link to={`/${L.id}/${firstPageOf(L.id)}`}>{L.pkg}</Link>
              <IconChevronRight />
              <span className="crumb-current">{group}</span>
            </nav>
            <h1 className="doc-title">{entry?.title ?? pg.title}</h1>
            {entry?.description && <p className="doc-description">{entry.description}</p>}
            <div className="md-body">
              {PageComp ? <PageComp /> : <p>This page has no content yet.</p>}
            </div>
            <div className="doc-pager">
              {prev ? (
                <Link to={`/${prev.libId}/${prev.pageId}`}>
                  <div className="pager-label">
                    <IconArrowLeft /> Previous
                  </div>
                  <div className="pager-title">{prev.title}</div>
                </Link>
              ) : (
                <span style={{ flex: 1 }} />
              )}
              {next && (
                <Link to={`/${next.libId}/${next.pageId}`} className="pager-next">
                  <div className="pager-label">
                    Next <IconArrowRight />
                  </div>
                  <div className="pager-title">{next.title}</div>
                </Link>
              )}
            </div>
          </article>
        </main>
        {toc.length > 0 && (
          <aside className="toc-col">
            <p className="toc-label">On this page</p>
            <TocList toc={toc} contentRef={contentRef} />
          </aside>
        )}
      </div>

      {drawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="drawer" role="dialog" aria-label="Documentation navigation">
            <div className="drawer-head">
              <strong style={{ fontSize: 14 }}>{L.pkg}</strong>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
              >
                <IconClose />
              </button>
            </div>
            <Sidebar lib={L} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
