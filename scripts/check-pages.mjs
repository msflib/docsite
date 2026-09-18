// Per-page validation used by docs content authors:
//  1. every primitive used in JSX must be imported from ../../components/md
//  2. every page must parse (syntax check via an in-memory rolldown build)
import fs from 'node:fs'
import path from 'node:path'
import { rolldown } from 'rolldown'

const used = ['C', 'B', 'A', 'H2', 'H3', 'H4', 'CodeBlock', 'Table', 'PropsTable', 'Callout', 'Note', 'Tip', 'Warning', 'Danger', 'HR', 'slugify']

function* pages(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) yield* pages(p)
    else if (p.endsWith('.tsx')) yield p
  }
}

async function parses(src) {
  // Stub the md primitives import so only syntax is checked.
  const stubbed = src.replace(
    /import \{[^}]*\} from '\.\.\/\.\.\/components\/md'/,
    'const { C: _c } = {}; void _c;',
  )
  try {
    const bundle = await rolldown({
      input: 'entry.tsx',
      logLevel: 'silent',
      transform: { jsx: 'react' },
      plugins: [
        {
          name: 'virtual',
          resolveId: (id) => (id === 'entry.tsx' ? 'entry.tsx' : null),
          load: (id) => (id === 'entry.tsx' ? stubbed : null),
        },
      ],
    })
    await bundle.generate({ format: 'esm' })
    await bundle.close()
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e).split('\n').slice(0, 5).join(' | ') }
  }
}

let bad = 0
for (const p of pages('src/content')) {
  const src = fs.readFileSync(p, 'utf8')
  const importMatch = src.match(/import \{([^}]*)\} from '\.\.\/\.\.\/components\/md'/)
  const imported = new Set(importMatch ? importMatch[1].split(',').map((s) => s.trim()) : [])
  for (const u of used) {
    if (new RegExp('<' + u + '(?=[\\s>/])').test(src) && !imported.has(u)) {
      console.log(`MISSING IMPORT: ${u} in ${p}`)
      bad++
    }
  }
  const res = await parses(src)
  if (!res.ok) {
    console.log(`SYNTAX ERROR in ${p}: ${res.error}`)
    bad++
  }
}
console.log(bad === 0 ? 'ALL PAGES OK' : `${bad} problem(s)`)
process.exit(bad === 0 ? 0 : 1)
