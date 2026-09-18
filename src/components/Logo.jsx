import { libById } from '../lib/docs'

const SVG_LOGO = {
  vue: (
    <>
      <polygon points="13.5,3 3.8,21 9.5,21 12,15.5 14.5,21 20.2,21" fill="#fff" />
      <polygon points="13.5,3 12,7 15.5,14.5 14.5,21 20.2,21" fill="#fff" opacity="0.5" />
    </>
  ),
  react: (
    <>
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#fff" strokeWidth="1.5" transform="rotate(0,12,12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#fff" strokeWidth="1.5" transform="rotate(60,12,12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#fff" strokeWidth="1.5" transform="rotate(120,12,12)" />
      <circle cx="12" cy="12" r="2" fill="#fff" />
    </>
  ),
  fastapi: (
    <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" fill="#fff" />
  ),
}

function LibIcon({ libId, size = 24, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      {SVG_LOGO[libId]}
    </svg>
  )
}

export function LibDot({ libId, size = 34 }) {
  const lib = libById[libId]
  return (
    <span className="lib-dot" style={{ background: lib?.color ?? '#666', width: size, height: size, borderRadius: size * 0.3 }}>
      <LibIcon libId={libId} size={size * 0.55} />
    </span>
  )
}

export function LibCardLogo({ libId, size = 52 }) {
  const lib = libById[libId]
  return (
    <span className="lib-logo" style={{ background: lib?.color ?? '#666', width: size, height: size, borderRadius: size * 0.3 }}>
      <LibIcon libId={libId} size={size * 0.5} />
    </span>
  )
}

export default function Logo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}