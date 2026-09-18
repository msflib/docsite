import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactTableWidget() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        The React <C>TableWidget</C> wraps MUI X DataGrid with MSFLib conveniences: a title
        bar with optional search, a kebab action column, avatar auto-rendering and optional
        drag-to-reorder rows.
      </p>
      <p>
        It solves the "every admin page needs the same grid" problem: MUI X's{' '}
        <C>DataGrid</C> requires a fair amount of ceremony (columns pre-processing, toolbar,
        menu wiring), and MSFLib pages additionally need avatar cells for profile pictures,
        a per-row action menu, and a search field that filters across every cell value.{' '}
        <C>TableWidget</C> bundles all of that while keeping the escape hatches —{' '}
        <C>columns</C> are still <C>GridColDef[]</C> and <C>styles</C> still accepts{' '}
        <C>SystemStyleObject</C> per grid part.
      </p>
      <p>
        How it works: rows are kept in local state so drag-reorder can <C>arrayMove</C>{' '}
        them (via <C>@dnd-kit/core</C> + <C>@dnd-kit/sortable</C>, with a 150 ms{' '}
        <C>PointerSensor</C> activation delay), search is a client-side filter over{' '}
        <C>Object.values(row)</C>, and the action column is appended only when{' '}
        <C>menuItem</C> is set. Your mutations stay outside — call a provider mutation from{' '}
        <C>handleMenuClick</C> and refresh the rows.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Admin CRUD tables</B> fed by <C>@msflib/react-*</C> lists (users, students,
          trainers, tasks) with pagination and selection.
        </li>
        <li>
          <B>Row actions</B> — a kebab menu per row driven by{' '}
          <C>{'{ key, label }'}</C> items and a single handler.
        </li>
        <li>
          <B>Searchable toolbars</B> — a title plus client-side search with one prop, no
          external filter state.
        </li>
        <li>
          <B>Ordering UI</B> — drag rows to reorder and persist the new order through{' '}
          <C>onRowsReorder</C>.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { TableWidget } from '@msflib/react-components'

<TableWidget
  rows={userRows}
  columns={userColumns}
  pageSize={10}
  pageSizeOptions={[5, 10, 20]}
  tableTitle="Workspace users"
  enableSearch
  checkboxSelection
  onRowClick={(params) => console.log(params.row)}
/>`}</CodeBlock>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>rows</C>, <C>array</C>, '—', 'Data rows'],
          [<C>columns</C>, <C>GridColDef[]</C>, '—', 'MUI X column definitions'],
          [<C>pageSize</C>, <C>number</C>, <C>5</C>, 'Initial page size'],
          [<C>pageSizeOptions</C>, <C>number[]</C>, '—', 'Page-size choices'],
          [<C>tableTitle</C>, <C>string</C>, '—', 'Title in the toolbar'],
          [<C>enableSearch</C>, <C>boolean</C>, '—', 'Toolbar search field'],
          [<C>checkboxSelection</C>, <C>boolean</C>, <C>true</C>, 'Selection column'],
          [<C>loading</C>, <C>boolean</C>, '—', 'Loading overlay'],
          [<C>onRowClick</C>, <C>(params) =&gt; void</C>, '—', 'Row click handler'],
          [<C>onRowSelectionModelChange</C>, <C>(model) =&gt; void</C>, '—', 'Selection changes'],
          [<C>menuItems</C>, <C>MenuActionItem[]</C>, '—', <>Adds a kebab action column — <C>{'{ key, label }'}</C></>],
          [<C>handleMenuClick</C>, <C>(item, selectedRow) =&gt; void</C>, '—', 'Menu action handler'],
          [<C>styles</C>, <C>object</C>, '—', <>Per-part <C>SystemStyleObject&lt;Theme&gt;</C> overrides: <C>body</C>, <C>header</C>, <C>cell</C>, <C>row</C>, <C>rowHover</C>, <C>headers</C>, <C>root</C></>],
          [<C>autoHeight</C>, <C>boolean</C>, '—', 'Grow with content'],
          [<C>draggable + onRowsReorder</C>, <C>boolean, (rows) =&gt; void</C>, '—', 'dnd-kit sortable rows (150 ms PointerSensor delay)'],
        ]}
      />

      <H2>Behaviors</H2>
      <ul>
        <li>
          <B>Avatar columns</B>: <C>processedColumns</C> auto-renders an MUI <C>Avatar</C>{' '}
          for columns named <C>avatar</C>, <C>image</C>, <C>picture</C> or <C>img</C>.
        </li>
        <li>
          <B>Row menus</B>: pass <C>menuItems</C> to get a trailing kebab column;{' '}
          <C>handleMenuClick(item, selectedRow)</C> receives the chosen action.
        </li>
        <li>
          <B>Drag reorder</B> requires unique, stable row ids.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. A basic directory table</H3>
      <p>
        The minimal useful grid: MUI X columns over rows you already have, with the title +
        search toolbar enabled and selection turned off. <C>checkboxSelection</C> defaults
        to true, so pass <C>{'{ false }'}</C> explicitly for read-only tables.
      </p>
      <CodeBlock lang="tsx">{`import { TableWidget } from '@msflib/react-components'

const columns = [
  { field: 'firstName', headerName: 'First name', flex: 1 },
  { field: 'lastName', headerName: 'Last name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
  {
    field: 'createdAt',
    headerName: 'Joined',
    flex: 1,
    valueGetter: (row: any) => new Date(row.created_at).toLocaleDateString(),
  },
]

export function DirectoryTable({ members }: { members: any[] }) {
  return (
    <TableWidget
      rows={members}
      columns={columns}
      tableTitle="Members"
      enableSearch
      checkboxSelection={false}
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      autoHeight
    />
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: rows from a provider, actions wired to mutations</H3>
      <p>
        Feed the grid from <C>@msflib/react-users</C> and wire the kebab menu to provider
        mutations. The <C>loading</C> overlay is driven by the provider's query flag, and{' '}
        <C>handleMenuClick</C> receives <C>{'{ key, label }'}</C> plus the full row, so a
        single handler can dispatch every action.
      </p>
      <CodeBlock lang="tsx">{`import { TableWidget, type MenuActionItem } from '@msflib/react-components'
import { useWorkspace } from '@msflib/react-workspace'
import { useActiveWorkspace } from '@msflib/react-shared'

const actions: MenuActionItem[] = [
  { key: 'open', label: 'Open workspace' },
  { key: 'rename', label: 'Rename…' },
  { key: 'delete', label: 'Delete' },
]

export function WorkspaceTable() {
  const { workspaces, deleteWorkspace, loading } = useWorkspace()
  const active = useActiveWorkspace()

  const rows = workspaces.map((w) => ({
    id: w.id,
    name: w.label || w.name,
    slug: w.slug,
    status: w.status as string,
    logo: w.logo_url, // a column named 'logo' renders as an Avatar
    isCurrent: w.slug === active,
  }))

  const columns = [
    { field: 'logo', headerName: '', width: 64 },
    { field: 'name', headerName: 'Workspace', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
  ]

  return (
    <TableWidget
      rows={rows}
      columns={columns}
      loading={loading.workspaces}
      tableTitle="Workspaces"
      enableSearch
      menuItem
      menuItems={actions}
      handleMenuClick={(item, row) => {
        if (item.key === 'open') window.location.assign(\`/w/\${row.slug}\`)
        if (item.key === 'delete') deleteWorkspace(row.id, {
          onSuccess: () => console.log('deleted', row.slug),
        })
      }}
      onRowClick={(params) => console.log('row', params.row)}
      styles={{
        rowHover: { cursor: 'pointer' },
        header: { fontWeight: 700 },
      }}
    />
  )
}`}</CodeBlock>

      <H3>3. Advanced: drag-to-reorder with persistence and a loading skeleton</H3>
      <p>
        With <C>draggable</C>, rows become dnd-kit sortable items (press-and-hold 150 ms to
        start a drag). The widget reorders internally and hands the full reordered array to{' '}
        <C>onRowsReorder</C> — persist it however you like. Combine with{' '}
        <C>SkeletonLoaderWrapper</C> from the same package for a first-load placeholder.
      </p>
      <CodeBlock lang="tsx">{`import { useEffect, useState } from 'react'
import { TableWidget, SkeletonLoaderWrapper } from '@msflib/react-components'
import { useTasks } from '@msflib/react-tasks'

export function TaskOrdering() {
  const { tasks, loading, updateTask, getTask } = useTasks()
  const [rows, setRows] = useState<any[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!loading.tasks && tasks.length) {
      setRows(tasks.map((t, i) => ({ id: t.id, title: t.title, points: t.points, order: i })))
      setHydrated(true)
    }
  }, [loading.tasks, tasks])

  const persistOrder = async (reordered: any[]) => {
    // sequential updates — swap for a batch endpoint if you have one
    await Promise.all(
      reordered.map((row, index) =>
        updateTask(row.id, { order: index }, { onError: console.error }),
      ),
    )
    console.log('order saved')
  }

  if (!hydrated) {
    return <SkeletonLoaderWrapper loading layout={<div style={{ height: 48 }} />} skeletonLength={5} />
  }

  return (
    <TableWidget
      rows={rows}
      columns={[
        { field: 'title', headerName: 'Task', flex: 2 },
        { field: 'points', headerName: 'Points', width: 120 },
      ]}
      draggable
      onRowsReorder={persistOrder}
      pageSize={20}
      autoHeight
    />
  )
}`}</CodeBlock>

      <H3>4. Advanced integration: detail view driven by getTask + selection</H3>
      <p>
        A master–detail pattern: the grid stays dumb, selection changes fetch the full
        record through the provider's <C>getTask</C> mutation (whose result lands in the
        query cache), and the detail pane renders from the query state. Note{' '}
        <C>disableRowSelectionOnClick</C> is set internally — selection happens via
        checkboxes while <C>onRowClick</C> stays free for navigation.
      </p>
      <CodeBlock lang="tsx">{`import { TableWidget } from '@msflib/react-components'
import { useTasks } from '@msflib/react-tasks'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export function TaskExplorer() {
  const { tasks, getTask, loading } = useTasks()
  const [selectedIds, setSelectedIds] = useState<any>([])
  const [detail, setDetail] = useState<any>(null)

  const openDetail = async (params: any) => {
    const task = await getTask(params.row.id)
    setDetail(task) // full TaskRead: level, track, stage, owner, submissions…
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <TableWidget
        rows={tasks}
        columns={[{ field: 'title', headerName: 'Title', flex: 1 }, { field: 'due_date', headerName: 'Due', width: 140 }]}
        loading={loading.tasks}
        onRowClick={openDetail}
        onRowSelectionModelChange={(model) => setSelectedIds(model)}
        checkboxSelection
      />
      <aside>{detail ? <h3>{detail.title}</h3> : <p>Select a task…</p>}</aside>
    </div>
  )
}`}</CodeBlock>

      <Note>
        Search filters <B>every</B> value of each row via{' '}
        <C>value?.toString().toLowerCase().includes(query)</C> — including numbers and
        booleans — but only client-side over the rows you passed in; there is no
        server-side search integration.
      </Note>
    </>
  )
}
