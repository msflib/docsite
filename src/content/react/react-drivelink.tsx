import { A, B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactDrivelink() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-drivelink</C> (v0.0.1) is the client for the FastAPI DriveLink
        module — a virtual filesystem with folders, files, trash, starring and batch
        operations (module key <C>drivelink</C>).
      </p>
      <p>
        Everything in DriveLink is a <C>DrivelinkNode</C> — folders and files share one
        shape with <C>{'{ id, kind: "folder" | "file", name, path, parent_id, size_bytes, mime_type, is_starred, is_trashed, version, thumbnail_url, … }'}</C>.
        The module covers hierarchy browsing (<C>listNodes</C> with{' '}
        <C>parent_id</C>/sort/trash filters), full-text search, folder creation, node
        patch (rename/move/star/color), copy and restore, multipart upload into a parent
        and content replacement, downloads (a real <C>Blob</C> fetch or a short-lived{' '}
        <C>{'{ url, expires_in }'}</C> meta), trash/recents/starred views, and batch
        operations (<C>delete | restore | star | unstar | copy | move</C> across many node
        ids).
      </p>
      <p>
        The provider runs five queries on mount (health, nodes, trash, recents, starred),
        all keyed by workspace; every mutation invalidates those collections on success so
        the four views stay in sync. Downloads bypass the JSON client through{' '}
        <C>fetchDownloadBlob</C> (authenticated <C>Blob</C>), and{' '}
        <C>downloadBlob</C> is re-exported for triggering browser saves. Dedicated
        standalone hooks (<C>useDriveLinkNode</C>, <C>useDrivelinkTrash</C>,{' '}
        <C>useDrivelinkRecent</C>, <C>useDrivelinkStarred</C>) cover screens that don't
        mount the provider.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A file browser</B> — hierarchy listing with a tree UI via{' '}
          <C>useLazyTreeData</C> + <C>TreeView</C>, or flat rows via <C>buildExplorerRows</C>.
        </li>
        <li>
          <B>File management actions</B> — upload, replace content, rename/move/star,
          trash/restore, batch operations.
        </li>
        <li>
          <B>Downloads and share links</B> — blob download or{' '}
          <C>getNodeDownloadUrl</C> for expiring URLs.
        </li>
        <li>
          <B>Quick-access surfaces</B> — recents and starred views maintained by the
          provider's cache invalidation.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { DrivelinkProvider, useDrivelink } from '@msflib/react-drivelink'
import { useLazyTreeData } from '@msflib/react-ux/tree-view'
import { TreeView } from '@msflib/react-components'

<DrivelinkProvider>
  <FileBrowser />
</DrivelinkProvider>

function FileBrowser() {
  const { nodes, listNodes } = useDrivelink()

  const { items, isLoading, onItemExpansionToggle } = useLazyTreeData({
    adapter: {
      getId: (n) => String(n.id),
      getLabel: (n) => n.name,
      isExpandable: (n) => n.kind === 'folder',
    },
    fetchChildren: (parentId) =>
      listNodes({ parent_id: parentId ? Number(parentId) : undefined }),
  })

  return (
    <TreeView items={items} onItemExpansionToggle={onItemExpansionToggle} isItemLoading={isLoading} showIcons />
  )
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Endpoint default', 'Notes']}
        rows={[
          [<C>nodes</C>, <C>/drivelink/nodes</C>, <>Root-level listing from the provider's <C>listParams</C> (<C>{'{ parent_id?, trash?, sort?, order?, offset?, limit? }'}</C>)</>],
          [<C>listNodes(params)</C>, <C>/drivelink/nodes</C>, 'On-demand listing (tree data source)'],
          [<C>searchNodes({'{ q }'})</C>, <C>/drivelink/nodes/search</C>, 'Full-text search'],
          [<C>getNode(id) / patchNode(id, data)</C>, <C>/drivelink/nodes/&#123;id&#125;</C>, <C>{'{ name?, parent_id?, is_starred?, color_label?, custom_properties? }'}</C>],
          [<C>createFolder({'{ name, parent_id? }'})</C>, <C>/drivelink/nodes/folders</C>, 'Create a folder node'],
          [<C>uploadFile(parentId, formData)</C>, <C>/drivelink/nodes/&#123;parentId&#125;/files</C>, 'Multipart upload into a folder'],
          [<C>replaceContent(nodeId, formData)</C>, <C>/drivelink/nodes/&#123;id&#125;/content</C>, 'Multipart new version'],
          [<C>downloadNode(id, params?)</C>, <C>/drivelink/nodes/&#123;id&#125;/download</C>, <>Returns a <C>Blob</C>, or <C>{'{ url, expires_in }'}</C> meta when <C>{'{ redirect: false }'}</C></>],
          [<C>getNodeDownloadUrl(id)</C>, '—', 'Convenience wrapper returning just the expiring URL string'],
          [<C>copyNode(id, {'{ parent_id?, name? }'}?) / restoreNode(id)</C>, <C>/drivelink/nodes/…</C>, 'Copy and restore'],
          [<C>deleteNode(id, {'{ permanent? }'}?)</C>, <C>/drivelink/nodes/&#123;id&#125;</C>, 'Trash by default, permanent with the flag'],
          [<C>trash / recents / starred</C>, <C>/drivelink/trash | recents | starred</C>, 'Provider-maintained views'],
          [<C>runBatch({'{ operation, node_ids, parent_id?, values? }'})</C>, <C>/drivelink/batch</C>, 'delete | restore | star | unstar | copy | move'],
          [<C>health</C>, <C>/drivelink/health</C>, 'Unscoped service health'],
          [<C>loading.*</C>, '—', 'Per-operation flags'],
        ]}
      />
      <p>
        <C>downloadBlob</C> is re-exported for triggering browser downloads from blobs.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic file browser with folder navigation</H3>
      <p>
        Start flat: list children of a current folder, navigate into folders with{' '}
        <C>listNodes({'{ parent_id }'})</C>, and surface health. The provider's{' '}
        <C>listNodes</C> mutation returns the nodes directly and caches them, so the
        breadcrumb view stays consistent with other consumers.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { DrivelinkProvider, useDrivelink } from '@msflib/react-drivelink'

export function DrivePage() {
  return (
    <DrivelinkProvider>
      <Drive />
    </DrivelinkProvider>
  )
}

function Drive() {
  const { nodes, listNodes, createFolder, health, loading } = useDrivelink()
  const [current, setCurrent] = useState<number | null>(null) // null = root

  const open = async (node: (typeof nodes)[number]) => {
    if (node.kind !== 'folder') return
    setCurrent(node.id)
    await listNodes({ parent_id: node.id, sort: 'name', order: 'asc' })
  }

  const newFolder = async () => {
    await createFolder({ name: 'New folder', parent_id: current })
  }

  return (
    <div>
      <header>
        <button onClick={() => { setCurrent(null); void listNodes({}) }}>Root</button>
        <button onClick={newFolder} disabled={loading.createFolder}>+ Folder</button>
        {health && <span aria-live="polite">drive: {String(health.status ?? 'ok')}</span>}
      </header>

      <ul>
        {nodes.map((node) => (
          <li key={node.id} onDoubleClick={() => open(node)}>
            {node.kind === 'folder' ? '📁' : '📄'} {node.name}
            <small> {(node.size_bytes / 1024).toFixed(1)} KB</small>
            {node.is_starred && <em> ★</em>}
          </li>
        ))}
      </ul>
      {loading.nodes && <p>Loading…</p>}
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: upload, star, rename and blob download</H3>
      <p>
        The everyday management actions: upload a file into the current folder (multipart),
        toggle the star with <C>patchNode</C>, rename, and download via{' '}
        <C>downloadNode</C> + the re-exported <C>downloadBlob</C>. Every mutation
        invalidates the node collections, so the listing refreshes itself.
      </p>
      <CodeBlock lang="tsx">{`import { useRef } from 'react'
import { DrivelinkProvider, useDrivelink, downloadBlob } from '@msflib/react-drivelink'

function FileManager({ parentId }: { parentId: number }) {
  const { nodes, uploadFile, patchNode, downloadNode, loading } = useDrivelink()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onPick = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    await uploadFile(parentId, fd, { name: file.name })
  }

  const toggleStar = async (node: (typeof nodes)[number]) => {
    await patchNode(node.id, { is_starred: !node.is_starred })
  }

  const rename = async (node: (typeof nodes)[number]) => {
    const name = window.prompt('New name', node.name)
    if (name) await patchNode(node.id, { name })
  }

  const save = async (node: (typeof nodes)[number]) => {
    const blob = await downloadNode(node.id)
    if (blob instanceof Blob) {
      downloadBlob(blob, node.original_filename || node.name)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
      />
      <button onClick={() => inputRef.current?.click()} disabled={loading.upload}>
        {loading.upload ? 'Uploading…' : 'Upload here'}
      </button>

      <ul>
        {nodes
          .filter((n) => n.parent_id === parentId)
          .map((node) => (
            <li key={node.id}>
              {node.name}
              <button onClick={() => toggleStar(node)} disabled={loading.patch}>
                {node.is_starred ? '★' : '☆'}
              </button>
              <button onClick={() => rename(node)} disabled={loading.patch}>Rename</button>
              {node.kind === 'file' && (
                <button onClick={() => save(node)} disabled={loading.download}>
                  Download
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: lazy tree browser + expiring share links</H3>
      <p>
        The flagship integration pairs the provider with{' '}
        <A to="/react/react-ux">react-ux</A>'s <C>useLazyTreeData</C> and{' '}
        <A to="/react/component-treeview">TreeView</A> for on-demand folder expansion, and
        uses <C>getNodeDownloadUrl</C> to hand out short-lived share URLs (the{' '}
        <C>{'{ redirect: false }'}</C> path returns <C>{'{ url, expires_in }'}</C> instead
        of a blob).
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { DrivelinkProvider, useDrivelink } from '@msflib/react-drivelink'
import { useLazyTreeData } from '@msflib/react-ux/tree-view'
import { TreeView } from '@msflib/react-components'

function ShareableDrive() {
  const { listNodes, getNodeDownloadUrl } = useDrivelink()
  const [shareUrl, setShareUrl] = useState<string | null>(null)

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

  const share = async (itemId: string) => {
    const url = await getNodeDownloadUrl(Number(itemId), { expires_in: 900 }) // 15 min
    setShareUrl(url)
  }

  return (
    <div>
      <TreeView
        items={tree.items}
        onItemExpansionToggle={tree.onItemExpansionToggle}
        isItemLoading={(id) => tree.isLoading(id)}
        renderItemEndAdornment={(meta) =>
          !meta.expandable ? (
            <button onClick={(e) => { e.stopPropagation(); void share(meta.itemId) }}>
              Share link
            </button>
          ) : null
        }
        showIcons
        aria-label="Drive"
      />

      {shareUrl && (
        <p>
          Share link (expires soon):{' '}
          <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl.slice(0, 60)}…</a>
        </p>
      )}
    </div>
  )
}`}</CodeBlock>

      <H3>4. Advanced: trash, restore and batch operations</H3>
      <p>
        Deletion is soft by default — trashed nodes keep <C>trash_expires_at</C> and can
        be restored. The provider's <C>trash</C>/<C>starred</C>/<C>recents</C> views are
        invalidated by every mutation, and <C>runBatch</C> applies one operation to many
        nodes in a single request.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { DrivelinkProvider, useDrivelink } from '@msflib/react-drivelink'

export function TrashPage() {
  return (
    <DrivelinkProvider>
      <Trash />
    </DrivelinkProvider>
  )
}

function Trash() {
  const { trash, nodes, deleteNode, restoreNode, runBatch, loading } = useDrivelink()
  const [selected, setSelected] = useState<number[]>([])

  const softDelete = async (nodeId: number) => {
    await deleteNode(nodeId) // goes to trash
  }

  const purge = async (nodeId: number) => {
    await deleteNode(nodeId, { permanent: true }) // unrecoverable
  }

  const restoreSelected = async () => {
    await runBatch({ operation: 'restore', node_ids: selected })
    setSelected([])
  }

  const starSelected = async () => {
    await runBatch({ operation: 'star', node_ids: selected })
  }

  return (
    <div>
      <button onClick={restoreSelected} disabled={loading.batch || selected.length === 0}>
        Restore {selected.length}
      </button>
      <button onClick={starSelected} disabled={loading.batch || selected.length === 0}>
        Star {selected.length}
      </button>

      <h2>Trash</h2>
      <ul>
        {trash.map((node) => (
          <li key={node.id}>
            <input
              type="checkbox"
              checked={selected.includes(node.id)}
              onChange={(e) =>
                setSelected((prev) =>
                  e.target.checked ? [...prev, node.id] : prev.filter((id) => id !== node.id),
                )
              }
            />
            {node.name}
            <small> deleted {node.deleted_at} · purges {node.trash_expires_at}</small>
            <button onClick={() => restoreNode(node.id)} disabled={loading.restore}>
              Restore
            </button>
            <button onClick={() => purge(node.id)} disabled={loading.delete}>
              Delete forever
            </button>
          </li>
        ))}
      </ul>

      <h2>Starred ({nodes.filter((n) => n.is_starred).length})</h2>
    </div>
  )
}`}</CodeBlock>

      <Note>
        List requests accept <C>{'{ trash: "exclude" | "only" | "include" }'}</C> — the
        default listing excludes trashed nodes, which is why the provider exposes a
        separate <C>trash</C> view instead of filtering client-side.
      </Note>
    </>
  )
}
