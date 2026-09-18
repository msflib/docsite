import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  IconCheck,
  IconCopy,
  IconDanger,
  IconLink,
  IconNote,
  IconTip,
  IconWarn,
} from '../lib/icons'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export function slugify(str: unknown): string {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function childrenToText(node: ReactNode): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(childrenToText).join('')
  if (typeof node === 'object' && 'props' in (node as any)) {
    return childrenToText((node as any).props?.children)
  }
  return ''
}

/* ------------------------------------------------------------------ */
/* inline primitives                                                   */
/* ------------------------------------------------------------------ */

export function C({ children }: { children: ReactNode }) {
  return <code>{children}</code>
}

export function B({ children }: { children: ReactNode }) {
  return <strong>{children}</strong>
}

/** Internal link (router) or external link. */
export function A({ to, children }: { to: string; children: ReactNode }) {
  if (to.startsWith('http') || to.startsWith('#') || to.startsWith('mailto:')) {
    return (
      <a href={to} target={to.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }
  return <Link to={to}>{children}</Link>
}

/* ------------------------------------------------------------------ */
/* headings with anchors                                               */
/* ------------------------------------------------------------------ */

function Heading({ level, children }: { level: 2 | 3 | 4; children: ReactNode }) {
  const text = childrenToText(children)
  const id = slugify(text)
  const Tag = (`h${level}` as const)
  return (
    <Tag id={id}>
      {children}
      <a className="anchor" href={`#${id}`} aria-label="Link to section">
        <IconLink />
      </a>
    </Tag>
  )
}

export function H2({ children }: { children: ReactNode }) {
  return <Heading level={2}>{children}</Heading>
}
export function H3({ children }: { children: ReactNode }) {
  return <Heading level={3}>{children}</Heading>
}
export function H4({ children }: { children: ReactNode }) {
  return <Heading level={4}>{children}</Heading>
}

/* ------------------------------------------------------------------ */
/* mini syntax highlighter (no external dependency)                    */
/* ------------------------------------------------------------------ */

const KEYWORDS = new Set(
  ('const let var function return if else for while do import from export default class extends new await async try catch finally throw typeof instanceof interface type as of in def self None True False elif lambda with pass raise not and or global nonlocal yield print echo cd npm pip pnpm python git sudo apt source run curl sleep ' +
    'SELECT INSERT UPDATE DELETE WHERE FROM VALUES public private static void int str bool float list dict set tuple True False')
    .split(' '),
)

const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*|#[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1 comment
    '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`)', // 2 string
    '(\\b\\d+(?:\\.\\d+)?\\b)', // 3 number
    '(<\\/?[A-Za-z][\\w.:-]*|\\/?>)', // 4 tag
    '([A-Za-z_$][\\w$]*(?=\\())', // 5 function call
    '(\\b[A-Z][\\w$]*\\b)', // 6 Type
    '(\\b[A-Za-z_$][\\w$-]*\\b)', // 7 word (keyword check)
    '([{}()\\[\\]=>=:,;.<>+*/%&|!?-])', // 8 punctuation
  ].join('|'),
  'g',
)

const TOKEN_CLASS: Record<number, string> = {
  1: 'hljs-comment',
  2: 'hljs-string',
  3: 'hljs-number',
  4: 'hljs-attr',
  5: 'hljs-title function_',
  6: 'hljs-type',
  8: 'hljs-punctuation',
}

function highlightCode(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  TOKEN_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TOKEN_RE.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    let cls: string | undefined
    for (let g = 1; g <= 8; g++) {
      if (m[g] !== undefined) {
        if (g === 7) {
          if (KEYWORDS.has(m[g])) cls = 'hljs-keyword'
        } else {
          cls = TOKEN_CLASS[g]
        }
        break
      }
    }
    out.push(
      cls ? (
        <span key={key++} className={cls}>
          {m[0]}
        </span>
      ) : (
        m[0]
      ),
    )
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

/* ------------------------------------------------------------------ */
/* code block                                                          */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return (
    <button type="button" className="copy-btn" onClick={onCopy} aria-label="Copy code">
      {copied ? <IconCheck /> : <IconCopy />}
    </button>
  )
}

export function CodeBlock({
  lang = 'code',
  children,
}: {
  lang?: string
  children: string
}) {
  const code = String(children).replace(/^\n+/, '').replace(/\s+$/, '')
  return (
    <pre>
      <div className="code-head">
        <span>{lang}</span>
        <CopyButton text={code} />
      </div>
      <code>{highlightCode(code)}</code>
    </pre>
  )
}

/* ------------------------------------------------------------------ */
/* tables                                                              */
/* ------------------------------------------------------------------ */

export function Table({
  head,
  rows,
}: {
  head: ReactNode[]
  rows: ReactNode[][]
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Props-table sugar: monospaced first column. */
export function PropsTable({
  rows,
  cols = ['Prop', 'Type', 'Default', 'Description'],
}: {
  rows: [ReactNode, ReactNode, ReactNode, ReactNode][]
  cols?: ReactNode[]
}) {
  return <Table head={cols} rows={rows} />
}

/* ------------------------------------------------------------------ */
/* callouts                                                            */
/* ------------------------------------------------------------------ */

const CALLOUT_ICONS = { note: IconNote, tip: IconTip, warning: IconWarn, danger: IconDanger }

export function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: 'note' | 'tip' | 'warning' | 'danger'
  title?: string
  children: ReactNode
}) {
  const Icon = CALLOUT_ICONS[kind]
  return (
    <div className={`callout co-${kind}`}>
      <span className="co-icon">
        <Icon />
      </span>
      <div>
        {title && <p style={{ fontWeight: 700, color: 'var(--text)' }}>{title}</p>}
        {children}
      </div>
    </div>
  )
}

export const Note = (p: { title?: string; children: ReactNode }) => <Callout kind="note" {...p} />
export const Tip = (p: { title?: string; children: ReactNode }) => <Callout kind="tip" {...p} />
export const Warning = (p: { title?: string; children: ReactNode }) => <Callout kind="warning" {...p} />
export const Danger = (p: { title?: string; children: ReactNode }) => <Callout kind="danger" {...p} />

export function HR() {
  return <hr />
}
