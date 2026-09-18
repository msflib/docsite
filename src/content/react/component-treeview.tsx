import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactTreeView() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>TreeView</C> is a standalone, accessible tree component (roving tabindex,
        keyboard navigation) built to replace MUI X <C>RichTreeView</C> when you need lazy
        loading without the Pro plan. Pair it with <C>useLazyTreeData</C> from{' '}
        <C>@msflib/react-ux</C> for zero-glue lazy loading.
      </p>
      <p>
        The problem: hierarchical data (drive folders, document categories, org charts)
        needs WAI-ARIA tree semantics — <C>role="tree"/"treeitem"</C>,{' '}
        <C>aria-expanded</C>, <C>aria-selected</C>, arrow/Home/End keyboard movement with a
        roving tabindex — and none of the free MUI X components do lazy loading per node.{' '}
        <C>TreeView</C> implements the full keyboard + a11y pattern over plain{' '}
        <C>{'<ul>'}</C> markup, with items as a prop so the data can come from anywhere.
      </p>
      <p>
        How it works: a generic <C>{'<TItem>'}</C> component. By default it reads{' '}
        <C>{'{ id, label, children, expandable?, disabled?, extension?, icon? }'}</C>, but
        every accessor is overridable (<C>getItemId</C>, <C>getItemLabel</C>,{' '}
        <C>getItemChildren</C>, <C>isItemExpandable</C>…), so it renders raw API objects
        directly. Expansion and selection support both controlled and uncontrolled modes;
        per-node loading spinners appear when <C>isItemLoading(id)</C> returns true — which
        is exactly what <C>useLazyTreeData</C>'s <C>isLoading</C> feeds.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A lazy-loading file browser</B> — DriveLink folders expand on demand via{' '}
          <C>useLazyTreeData</C> + <C>listNodes({'{ parent_id }'})</C>.
        </li>
        <li>
          <B>Accessible navigation panes</B> — full keyboard support and ARIA attributes
          out of the box, no MUI X Pro dependency.
        </li>
        <li>
          <B>Rendering arbitrary item shapes</B> — adapters instead of data mapping;{' '}
          <C>renderLabel</C>/<C>renderItemEndAdornment</C> for badges, retry buttons, file
          sizes.
        </li>
        <li>
          <B>Single or multi selection</B> — <C>multiSelect</C> with controlled or
          uncontrolled <C>selectedItems</C>.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { TreeView } from '@msflib/react-components'
import { useLazyTreeData } from '@msflib/react-ux/tree-view'

const { items, isLoading, onItemExpansionToggle } = useLazyTreeData({
  adapter: {
    getId: (n) => String(n.id),
    getLabel: (n) => n.name,
    isExpandable: (n) => n.kind === 'folder',
  },
  fetchChildren: (parentId) => listNodes({ parent_id: Number(parentId) }),
})

<TreeView
  items={items}
  onItemExpansionToggle={onItemExpansionToggle}
  isItemLoading={isLoading}
  showIcons
  aria-label="Files"
/>`}</CodeBlock>

      <H2>Props</H2>
      <Table
        head={['Group', 'Props']}
        rows={[
          ['Data', <>items, accessor overrides: <C>getItemId</C>, <C>getItemLabel</C>, <C>getItemChildren</C>, <C>isItemExpandable</C>, <C>isItemDisabled</C>, <C>getItemIcon</C>, <C>getItemExtension</C></>],
          ['Expansion', <>controlled/uncontrolled: <C>expandedItems</C> / <C>defaultExpandedItems</C>, <C>onExpandedItemsChange</C>, <C>onItemExpansionToggle</C></>],
          ['Selection', <><C>multiSelect</C>, <C>selectedItems</C> / <C>defaultSelectedItems</C>, <C>onSelectedItemsChange</C>, <C>onItemClick</C>, <C>onItemFocus</C></>],
          ['Loading', <><C>isItemLoading(id)</C> — shows a spinner row</>],
          ['Icons', <>showIcons, folderIcon, fileIconMap, icons; helpers <C>defaultFileIconMap</C>, <C>defaultFolderIcon</C>, <C>defaultDocumentIcon</C></>],
          ['Layout', <>itemGap, indentSize (<C>'xs'…'xl'</C> or number), styles, class names</>],
          ['Rendering', <>renderLabel, renderItem, renderItemEndAdornment</>],
          ['A11y', <>aria-label</>],
        ]}
      />

      <H2>Keyboard support</H2>
      <p>
        Arrow keys move focus and expand/collapse, Home/End jump to first/last visible
        item, and typing selects — full WAI-ARIA tree pattern.{' '}
        <C>flattenVisibleItems</C> is exported for building "jump to item" logic.
      </p>

      <H2>Examples</H2>

      <H3>1. A static tree with the default item shape</H3>
      <p>
        No data source needed to start: pass items shaped{' '}
        <C>{'{ id, label, children }'}</C> and the defaults take over. Expansion is
        uncontrolled, icons are on, and <C>defaultExpandedItems</C> opens one branch.
      </p>
      <CodeBlock lang="tsx">{`import { TreeView } from '@msflib/react-components'

const items = [
  {
    id: 'root',
    label: 'Course materials',
    children: [
      { id: 'week-1', label: 'Week 1 — Intro', children: [
        { id: 'w1-lesson', label: 'Lesson.pdf', extension: 'pdf' },
        { id: 'w1-quiz', label: 'Quiz', children: [] },
      ]},
      { id: 'week-2', label: 'Week 2 — Data types' },
      { id: 'spec', label: 'spec.docx', extension: 'docx', disabled: true },
    ],
  },
]

export function MaterialsTree() {
  return (
    <TreeView
      items={items}
      defaultExpandedItems={['root']}
      showIcons
      aria-label="Course materials"
    />
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: lazy DriveLink browser</H3>
      <p>
        The flagship integration: <C>useLazyTreeData</C> caches children per parent and
        dedupes concurrent loads, while <C>TreeView</C> renders its <C>items</C> and asks{' '}
        <C>isItemLoading</C> which rows show the spinner. Root children load automatically
        (<C>{'{ autoLoadRoot: true }'}</C>); expanding a folder triggers{' '}
        <C>fetchChildren(id)</C> through <C>onItemExpansionToggle</C>.
      </p>
      <CodeBlock lang="tsx">{`import { TreeView } from '@msflib/react-components'
import { useLazyTreeData } from '@msflib/react-ux/tree-view'
import { DrivelinkProvider, useDrivelink } from '@msflib/react-drivelink'

export function DriveBrowser() {
  return (
    <DrivelinkProvider>
      <Browser />
    </DrivelinkProvider>
  )
}

function Browser() {
  const { listNodes } = useDrivelink()

  const tree = useLazyTreeData({
    adapter: {
      getId: (n) => String(n.id),
      getLabel: (n) => n.name,
      isExpandable: (n) => n.kind === 'folder',
      getExtension: (n) => n.name.split('.').pop()?.toLowerCase(),
    },
    fetchChildren: (parentId) =>
      listNodes({ parent_id: parentId ? Number(parentId) : undefined }),
    autoLoadRoot: true,
  })

  return (
    <TreeView
      items={tree.items}
      onItemExpansionToggle={tree.onItemExpansionToggle}
      isItemLoading={(itemId) => tree.isLoading(itemId)}
      getItemExtension={(item) => item.extension}
      showIcons
      indentSize="sm"
      itemGap={2}
      aria-label="Drive"
    />
  )
}`}</CodeBlock>

      <H3>3. Controlled selection with end adornments</H3>
      <p>
        Selection and expansion can be controlled: keep the selected id in state, render
        per-row end adornments (a file-size caption and a "download" action), and use{' '}
        <C>renderLabel</C> for rich labels. <C>onItemClick</C> still fires for custom row
        behavior on non-selectable interactions.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { TreeView, type TreeViewItemMeta } from '@msflib/react-components'

type Node = { id: number; name: string; kind: 'folder' | 'file'; size_bytes?: number }

export function SelectableTree({ nodes, onDownload }: {
  nodes: Node[]
  onDownload: (n: Node) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string[]>([])

  return (
    <TreeView<Node>
      items={nodes}
      getItemId={(n) => String(n.id)}
      getItemLabel={(n) => n.name}
      isItemExpandable={(n) => n.kind === 'folder'}
      multiSelect={false}
      selectedItems={selected}
      onSelectedItemsChange={(_, id) => setSelected(id)}
      expandedItems={expanded}
      onExpandedItemsChange={(_, ids) => setExpanded(ids)}
      renderLabel={(meta: TreeViewItemMeta<Node>) => (
        <span style={{ fontWeight: meta.selected ? 700 : 400 }}>{meta.item.name}</span>
      )}
      renderItemEndAdornment={(meta: TreeViewItemMeta<Node>) =>
        meta.item.kind === 'file' ? (
          <button onClick={(e) => { e.stopPropagation(); onDownload(meta.item) }}>
            ⬇ {Math.round((meta.item.size_bytes ?? 0) / 1024)} KB
          </button>
        ) : null
      }
      aria-label="Resources"
    />
  )
}`}</CodeBlock>

      <H3>4. Custom items, file-type icons and inline loading</H3>
      <p>
        <C>fileIconMap</C> keys by extension (no dot) and is merged over the built-in{' '}
        <C>defaultFileIconMap</C>; <C>getItemIcon</C> wins over everything for a specific
        item. Loading rows come from <C>isItemLoading</C>, so you can drive them from any
        state source — here a manual fetch that only fires for folders, simulating{' '}
        <C>useLazyTreeData</C> without the hook.
      </p>
      <CodeBlock lang="tsx">{`import { useEffect, useState } from 'react'
import { TreeView } from '@msflib/react-components'
import { FiFileText } from 'react-icons/fi'

type ApiNode = { node_id: string; node_name: string; has_children: boolean }

export function RawShapeTree({ fetchNodes }: {
  fetchNodes: (parentId: string | null) => Promise<ApiNode[]>
}) {
  const [roots, setRoots] = useState<ApiNode[]>([])
  const [childrenByParent, setChildrenByParent] = useState<Record<string, ApiNode[]>>({})
  const [loadingIds, setLoadingIds] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([])

  const load = async (parentId: string | null) => {
    setLoadingIds((prev) => (parentId ? [...prev, parentId] : prev))
    const nodes = await fetchNodes(parentId)
    if (parentId) setChildrenByParent((prev) => ({ ...prev, [parentId]: nodes }))
    else setRoots(nodes)
    setLoadingIds((prev) => prev.filter((id) => id !== parentId))
  }

  useEffect(() => { void load(null) /* eslint-disable-line react-hooks/exhaustive-deps */ }, [])

  const toItems = (nodes: ApiNode[]): any[] =>
    nodes.map((n) => ({
      id: n.node_id,
      label: n.node_name,
      expandable: n.has_children,
      children: childrenByParent[n.node_id]
        ? toItems(childrenByParent[n.node_id])
        : undefined,
    }))

  return (
    <TreeView
      items={toItems(roots)}
      expandedItems={expanded}
      onItemExpansionToggle={(_, itemId, isExpanded) => {
        setExpanded((prev) =>
          isExpanded ? [...prev, itemId] : prev.filter((id) => id !== itemId),
        )
        if (isExpanded && !childrenByParent[itemId]) void load(itemId)
      }}
      isItemLoading={(itemId) => loadingIds.includes(itemId)}
      showIcons
      fileIconMap={{ docx: <FiFileText />, csv: <FiFileText /> }}
      getItemExtension={(item) => item.label?.split('.').pop()?.toLowerCase()}
      aria-labelledby="tree-heading"
    />
  )
}`}</CodeBlock>

      <Note>
        A node is treated as expandable from its explicit <C>expandable</C> flag first, and
        falls back to "has children". For lazy loading that means your items should carry{' '}
        <C>{'{ expandable: true }'}</C> even before their children have been fetched.
      </Note>
    </>
  )
}
