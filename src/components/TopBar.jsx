import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { searchIndex } from '../lib/content'
import { IconClose, IconMenu, IconMoon, IconSearch, IconSun } from '../lib/icons'

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('msflib-theme', next ? 'dark' : 'light')
    } catch {
      /* private mode */
    }
  }

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label="Toggle dark mode" title="Toggle theme">
      {dark ? <IconSun /> : <IconMoon />}
    </button>
  )
}

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function SearchModal({ onClose }) {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = (() => {
    const t = query.trim().toLowerCase()
    if (!t) return []
    const scored = []
    for (const item of searchIndex) {
      const title = item.title.toLowerCase()
      let score = 0
      if (title.startsWith(t)) score = 100
      else if (title.includes(t)) score = 65
      if (item.description && item.description.toLowerCase().includes(t)) score += 18
      if (item.text.includes(t)) score += 10
      if (item.libName.toLowerCase().includes(t)) score += 6
      if (score > 0) scored.push({ item, score })
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, 12)
  })()

  useEffect(() => setSel(0), [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const go = (hit) => {
    onClose()
    navigate(`/${hit.libId}/${hit.pageId}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && results[sel]) {
      go(results[sel].item)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const snippet = (item) => {
    const t = query.trim().toLowerCase()
    const idx = item.text.toLowerCase().indexOf(t)
    if (idx === -1) return item.description || item.text.slice(0, 120)
    const start = Math.max(0, idx - 40)
    return (start > 0 ? '…' : '') + item.text.slice(start, idx + 110) + '…'
  }

  return (
    <div className="search-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-box" role="dialog" aria-label="Search documentation">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search the docs…"
          spellCheck="false"
        />
        <div className="search-results">
          {query.trim() === '' && (
            <div className="search-empty">
              Type to search across all three MSFLib libraries.
            </div>
          )}
          {query.trim() !== '' && results.length === 0 && (
            <div className="search-empty">No results for “{query}”.</div>
          )}
          {results.map((r, i) => (
            <a
              key={`${r.item.libId}/${r.item.pageId}`}
              className={`search-hit${i === sel ? ' sel' : ''}`}
              style={{ '--lib': r.item.color, '--lib-soft': `${r.item.color}1f` }}
              href={`/${r.item.libId}/${r.item.pageId}`}
              onClick={(e) => {
                e.preventDefault()
                go(r.item)
              }}
              onMouseEnter={() => setSel(i)}
            >
              <div className="sh-title">
                <span className="sh-lib">{r.item.libId}</span>
                {highlight(r.item.title, query.trim())}
              </div>
              <div className="sh-text">{snippet(r.item)}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TopBar({ lib, onMenu }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-badge">M</span>
          <span>
            MSFLib
            {lib && (
              <span className="brand-lib">
                {' '}
                / {lib.pkg}
              </span>
            )}
          </span>
        </Link>
        <span className="spacer" />
        <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)}>
          <IconSearch />
          <span className="st-label">Search docs…</span>
          <kbd>⌘K</kbd>
        </button>
        <ThemeToggle />
        {onMenu && (
          <button type="button" className="icon-btn hamburger" onClick={onMenu} aria-label="Open navigation">
            <IconMenu />
          </button>
        )}
      </header>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
