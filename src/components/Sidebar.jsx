import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { firstPageOf } from '../lib/docs'
import { IconChevron } from '../lib/icons'
import { LibDot } from './Logo'

function storageKey(libId) {
  return `msflib-collapsed-${libId}`
}

function loadCollapsed(libId) {
  try {
    const raw = localStorage.getItem(storageKey(libId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function SidebarNav({ lib, currentPath, onNavigate }) {
  const [collapsed, setCollapsed] = useState(() => loadCollapsed(lib.id))

  // Ensure the group containing the current page is expanded.
  useEffect(() => {
    const activeGroup = lib.nav.find((g) => g.items.some((i) => `/${lib.id}/${i.id}` === currentPath))
    if (activeGroup && collapsed[activeGroup.title]) {
      setCollapsed((c) => ({ ...c, [activeGroup.title]: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath])

  const toggle = (title) => {
    setCollapsed((c) => {
      const next = { ...c, [title]: !c[title] }
      try {
        localStorage.setItem(storageKey(lib.id), JSON.stringify(next))
      } catch {
        /* private mode */
      }
      return next
    })
  }

  return (
    <nav className="side-nav" aria-label={`${lib.pkg} documentation`}>
      {lib.nav.map((group) => (
        <div key={group.title} className={`nav-group${collapsed[group.title] ? ' collapsed' : ''}`}>
          <button
            type="button"
            className="group-label"
            onClick={() => toggle(group.title)}
            aria-expanded={!collapsed[group.title]}
          >
            {group.title}
            <IconChevron />
          </button>
          {!collapsed[group.title] &&
            group.items.map((item) => {
              const to = `/${lib.id}/${item.id}`
              return (
                <Link
                  key={item.id}
                  to={to}
                  className={`nav-link${currentPath === to ? ' active' : ''}`}
                  aria-current={currentPath === to ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  {item.title}
                </Link>
              )
            })}
        </div>
      ))}
    </nav>
  )
}

export default function Sidebar({ lib, onNavigate }) {
  const location = useLocation()
  return (
    <>
      <Link className="lib-chip" to={`/${lib.id}`} onClick={onNavigate} style={{ '--lib': lib.color }}>
        <LibDot libId={lib.id} />
        <span>
          <span className="lc-name">{lib.pkg}</span>
          <br />
          <span className="lc-sub">{lib.tagline} · {lib.version}</span>
        </span>
      </Link>
      <SidebarNav lib={lib} currentPath={location.pathname} onNavigate={onNavigate} />
      <div style={{ height: 12 }} />
      <Link to="/" className="nav-link" onClick={onNavigate} style={{ color: 'var(--text-3)' }}>
        ← All MSFLib libraries
      </Link>
    </>
  )
}
