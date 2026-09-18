import { B, C, CodeBlock, H2, H3, Table } from '../../components/md'

export default function ReactUx() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-ux</C> (v0.0.2) contains zero visual components on purpose: it
        holds the headless logic behind file explorers, popovers and lazy tree views so any
        UI layer (MUI, custom, or <C>@msflib/react-components</C>) can render it. Subpath
        exports: <C>./file-explorer</C>, <C>./interactions</C>, <C>./tree-view</C>.
      </p>
      <p>
        The package exists because the interesting parts of those UIs are not the pixels —
        they are the state machines. Turning a flat list of <C>file_path</C> strings into
        nested folder rows with aggregated sizes, deduplicating in-flight lazy tree
        requests per parent id, or closing a popover on pointer-down-outside <B>and</B>{' '}
        Escape are all fiddly, framework-free logic. <C>@msflib/react-ux</C> owns that
        logic; your components just render what it computes.
      </p>
      <p>
        It has no dependencies beyond React itself and no provider — every export is a
        hook, a pure function or a type. Functions come in hook flavors
        (<C>useExplorerRowClick</C>) and non-React flavors
        (<C>createExplorerRowClickHandler</C>) so the same behavior can be reused in
        events, tests or other frameworks.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A virtual file explorer</B> over a flat backend list (DriveLink, documents) —
          <C>buildExplorerRows</C> computes folders, extensions and per-row metadata for
          you.
        </li>
        <li>
          <B>Lazy tree loading</B> — <C>useLazyTreeData</C> fetches children per expanded
          node, caches them, dedupes concurrent loads and surfaces per-node errors without
          react-query.
        </li>
        <li>
          <B>Dismissable widgets</B> — <C>useCloseOnOutsideInteraction</C> implements the
          outside-click + Escape contract for menus, popovers and comboboxes.
        </li>
        <li>
          <B>Rendering freedom</B> — pair the computed data with <C>TreeView</C> from{' '}
          <C>@msflib/react-components</C>, a table, or entirely custom markup.
        </li>
      </ul>

      <H2>File explorer</H2>
      <CodeBlock lang="tsx">{`import {
  buildExplorerRows,
  useExplorerRowClick,
  buildExplorerIcon,
  normalizeExplorerPath,
  joinExplorerPath,
} from '@msflib/react-ux/file-explorer'

const rows = buildExplorerRows(files, { currentPath: '/reports' })
// → [{ entryType: 'folder'|'file', name, extension, file_size, created_at, updated_at, … }]
// folders aggregate child file_size (bytes), earliest created_at, latest updated_at

const { handleRowClick } = useExplorerRowClick({
  onFolderClick: (row) => navigate(joinExplorerPath(currentPath, row.name)),
  onFileClick: (row) => download(row.file_path),
})

const icon = buildExplorerIcon(row, { icons: myIconMap })
// icon type resolved from extension: folder, pdf, image, video, audio, document fallback`}</CodeBlock>
      <Table
        head={['Export', 'Notes']}
        rows={[
          [<C>buildExplorerRows(files, {'{ currentPath? }'})</C>, <>Flat backend list → rows with computed <C>entryType</C></>],
          [<C>useExplorerRowClick({'{ onFolderClick, onFileClick, onRowClick }'})</C>, 'Hook flavor of the click handler'],
          [<C>createExplorerRowClickHandler(...)</C>, 'Non-React flavor'],
          [<C>buildExplorerIcon(row, {'{ icons, fallback }'})</C>, 'Icon resolution'],
          [<C>getExplorerIconType(ext)</C>, 'Extension → icon type mapping'],
          [<C>normalizeExplorerPath / joinExplorerPath</C>, 'Path helpers'],
        ]}
      />

      <H2>Interactions</H2>
      <CodeBlock lang="tsx">{`import { useCloseOnOutsideInteraction } from '@msflib/react-ux/interactions'

useCloseOnOutsideInteraction({
  ref: menuRef,
  enabled: open,
  onClose: () => setOpen(false),
  closeOnEscape: true,             // default
  closeOnPointerDownOutside: true, // default
})`}</CodeBlock>
      <p>Closes menus/popovers on outside pointer-down and Escape.</p>

      <H2>Tree view (lazy loading)</H2>
      <CodeBlock lang="tsx">{`import { useLazyTreeData } from '@msflib/react-ux/tree-view'
import { TreeView } from '@msflib/react-components'

const { items, isLoading, onItemExpansionToggle } = useLazyTreeData<DrivelinkNode>({
  adapter: {
    getId: (n) => String(n.id),
    getLabel: (n) => n.name,
    isExpandable: (n) => n.kind === 'folder',
  },
  fetchChildren: (parentId) => listNodes({ parent_id: parentId ? Number(parentId) : undefined }),
  autoLoadRoot: true,
})

<TreeView
  items={items}
  onItemExpansionToggle={onItemExpansionToggle}
  isItemLoading={isLoading}
  showIcons
/>`}</CodeBlock>
      <p>
        <C>useLazyTreeData</C> returns{' '}
        <C>{'{ items, isLoading(parentId), getError(parentId), loadChildren(parentId, { force? }), refreshChildren(parentId), onItemExpansionToggle, reset }'}</C>.
        It fetches each parent once, dedupes concurrent requests, and is designed to feed{' '}
        <C>@msflib/react-components</C>'s <C>TreeView</C> — avoiding the MUI X Pro plan that{' '}
        <C>RichTreeView</C> lazy loading requires. A non-hook version,{' '}
        <C>buildLazyTreeItems</C>, is also exported.
      </p>

      <H2>Examples</H2>

      <H3>1. A full file explorer over DriveLink nodes</H3>
      <p>
        A realistic combination: keep the current folder path in state, compute rows with{' '}
        <C>buildExplorerRows</C> (folders are derived from file paths, not from a separate
        endpoint), and wire navigation with <C>useExplorerRowClick</C>. Icons are resolved
        per row from your own map, with a fallback.
      </p>
      <CodeBlock lang="tsx">{`import { useState, useMemo } from 'react'
import {
  buildExplorerRows,
  useExplorerRowClick,
  buildExplorerIcon,
  joinExplorerPath,
  type ExplorerIconType,
} from '@msflib/react-ux/file-explorer'
import { useDrivelink } from '@msflib/react-drivelink'

const icons: Partial<Record<ExplorerIconType, string>> = {
  folder: '📁',
  pdf: '📕',
  image: '🖼️',
  video: '🎬',
  audio: '🎵',
  document: '📄',
}

function FileExplorer() {
  const { nodes, loading } = useDrivelink()
  const [path, setPath] = useState('/')

  const rows = useMemo(
    () => buildExplorerRows(nodes, { currentPath: path }),
    [nodes, path],
  )

  const handleRowClick = useExplorerRowClick({
    onFolderClick: (row) => setPath(row.file_path),
    onFileClick: (file) => window.open(file.url, '_blank'),
  })

  return (
    <ul>
      {path !== '/' && <li><button onClick={() => setPath('/')}>…up</button></li>}
      {loading.nodes
        ? <li>Loading…</li>
        : rows.map((row) => (
            <li key={row.id ?? row.file_path} onClick={() => handleRowClick(row)}>
              {buildExplorerIcon(row, { icons, fallback: '📄' })}
              {row.name}
            </li>
          ))}
    </ul>
  )
}`}</CodeBlock>

      <H3>2. Lazy tree with per-node error retry</H3>
      <p>
        <C>useLazyTreeData</C> caches children per parent id, dedupes concurrent requests
        for the same parent, and stores per-parent errors. Here a failed expansion shows
        an inline error whose click calls <C>refreshChildren</C> (a forced reload), and a
        manual root reload uses <C>loadChildren(null, {'{ force: true }'})</C> semantics via{' '}
        <C>refreshChildren(null)</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useLazyTreeData } from '@msflib/react-ux/tree-view'
import { TreeView } from '@msflib/react-components'
import { createDrivelinkApi } from '@msflib/react-drivelink'

const api = createDrivelinkApi(true)

function LazyDriveTree() {
  const tree = useLazyTreeData({
    adapter: {
      getId: (n) => String(n.id),
      getLabel: (n) => n.name,
      isExpandable: (n) => n.kind === 'folder',
    },
    fetchChildren: (parentId) =>
      api.listNodes({ parent_id: parentId ? Number(parentId) : undefined }),
    autoLoadRoot: true,
  })

  return (
    <div>
      <button onClick={() => tree.refreshChildren(null)}>Reload root</button>
      <button onClick={() => tree.reset()}>Clear cache</button>

      <TreeView
        items={tree.items}
        onItemExpansionToggle={tree.onItemExpansionToggle}
        isItemLoading={(id) => tree.isLoading(id)}
        renderItemEndAdornment={(meta) =>
          meta.expandable && tree.getError(meta.itemId) ? (
            <button onClick={() => tree.refreshChildren(meta.itemId)}>
              retry
            </button>
          ) : null
        }
        showIcons
      />
    </div>
  )
}`}</CodeBlock>

      <H3>3. A dismissable combobox with the interaction hook</H3>
      <p>
        <C>useCloseOnOutsideInteraction</C> attaches a <C>pointerdown</C> and{' '}
        <C>keydown</C> listener on <C>document</C> while enabled. The ref must point at the
        container that includes both the trigger and the popup, otherwise clicking the
        trigger closes it immediately.
      </p>
      <CodeBlock lang="tsx">{`import { useRef, useState } from 'react'
import { useCloseOnOutsideInteraction } from '@msflib/react-ux/interactions'

function WorkspaceCombobox({ workspaces }: { workspaces: { slug: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useCloseOnOutsideInteraction({
    ref: containerRef,
    enabled: open,
    onClose: () => setOpen(false),
    closeOnEscape: true,
    closeOnPointerDownOutside: true,
  })

  return (
    <div ref={containerRef}>
      <button onClick={() => setOpen((v) => !v)}>
        {selected ?? 'Pick a workspace'}
      </button>
      {open && (
        <ul role="listbox">
          {workspaces.map((w) => (
            <li key={w.slug}>
              <button
                onClick={() => {
                  setSelected(w.slug)
                  setOpen(false)
                }}
              >
                {w.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`}</CodeBlock>

      <H3>4. Exploring rows without React</H3>
      <p>
        The pure-function flavors make the same behavior available outside hooks — useful
        in event handlers, tests or when building a shared row-handler factory for several
        screens.
      </p>
      <CodeBlock lang="ts">{`import {
  createExplorerRowClickHandler,
  getExplorerIconType,
  normalizeExplorerPath,
  buildExplorerRows,
} from '@msflib/react-ux/file-explorer'

// pure handler — no component needed
const onRow = createExplorerRowClickHandler({
  onFolderClick: (path, row) => history.push('/files' + path),
  onFileClick: (file) => startDownload(file),
})

// classify an extension
getExplorerIconType('mov') // 'video'
getExplorerIconType('pdf') // 'pdf'
getExplorerIconType('xlsx') // 'document' (fallback)

// normalize before comparing or storing paths
normalizeExplorerPath('reports/2024//q3/') // '/reports/2024/q3'`}</CodeBlock>
    </>
  )
}
