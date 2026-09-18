import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiDrivelink() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-drivelink</C> (v0.1.0) is a Drive-style virtual filesystem: folders and
        files with soft-delete/trash, search, starring, recents, batch operations, quotas
        and storage backends. Depends on: msflib, msflib-account, python-multipart.
      </p>
      <p>
        Everything is a <C>DrivelinkNode</C>: a row with <C>kind</C> (
        <C>folder</C>/<C>file</C>), a materialized <C>path</C>, a <C>parent_id</C>, and —
        for files — storage fields pointing at a blob managed through{' '}
        <C>DrivelinkService</C>. Nodes belong to an <C>account_id</C> and optionally to a{' '}
        <C>workspace_id</C> (when the host app passes a workspace dependency, the router
        scopes every operation to it). Deletes are soft by default: nodes land in trash
        with <C>deleted_at</C>/<C>trash_expires_at</C> and can be restored; hard deletes
        only fire when you pass <C>permanent=true</C> and decrement the storage blob
        reference count.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A file browser</B> — folders, upload, download, rename/move, star, search,
          recents and batch ops out of the box (pairs with{' '}
          <C>@msflib/react-drivelink</C>).
        </li>
        <li>
          <B>Trash semantics</B> — reversible deletes with a retention window (
          <C>TRASH_RETENTION_DAYS</C>) instead of instant data loss.
        </li>
        <li>
          <B>Upload guardrails</B> — max upload size, per-account quotas, MIME prefix
          allowlists, path-depth and children-per-folder limits.
        </li>
        <li>
          <B>Backend-agnostic blobs</B> — the same node shape fronts local storage or
          cloud buckets via the core upload utilities.
        </li>
      </ul>

      <H2>Settings (namespace DRIVELINK)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[
          [<C>ENABLED</C>, 'Module switch'],
          [<C>MAX_UPLOAD_BYTES / QUOTA_MAX_BYTES</C>, 'Size limits'],
          [<C>ALLOWED_MIME_PREFIXES</C>, <>e.g. <C>["image/", "application/pdf"]</C></>],
          [<C>TRASH_RETENTION_DAYS</C>, 'Auto-purge window'],
          [<C>MAX_PATH_DEPTH / MAX_CHILDREN_PER_FOLDER</C>, 'Tree guards'],
          [<C>STORAGE_PARENT_FOLDER / STORAGE_BUCKET_PREFIX</C>, 'Storage layout'],
          [<C>SHARING_ENABLED / MULTIPART_UPLOAD_ENABLED</C>, 'Feature flags'],
        ]}
      />

      <H2>Endpoints (key subset)</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['GET', <C>/drivelink/nodes</C>, 'List children'],
          ['GET', <C>/drivelink/nodes/search</C>, 'Search nodes'],
          ['GET', <C>/drivelink/nodes/&#123;id&#125;</C>, 'Get node'],
          ['POST', <C>/drivelink/nodes/folders</C>, 'Create folder'],
          ['PATCH', <C>/drivelink/nodes/&#123;id&#125;</C>, 'Rename / move / star'],
          ['POST', <C>/drivelink/nodes/&#123;id&#125;/copy</C>, 'Copy node'],
          ['DELETE', <C>/drivelink/nodes/&#123;id&#125;</C>, 'Soft delete (trash)'],
          ['POST', <C>/drivelink/nodes/&#123;id&#125;/restore</C>, 'Restore from trash'],
          ['GET', <C>/drivelink/trash</C>, 'List trash'],
          ['POST', <C>/drivelink/nodes/&#123;parent_id&#125;/files</C>, 'Upload file'],
          ['PUT', <C>/drivelink/nodes/&#123;id&#125;/content</C>, 'Replace file content'],
          ['GET', <C>/drivelink/nodes/&#123;id&#125;/download</C>, 'Download'],
          ['GET', <C>/drivelink/recents</C> / <C>/drivelink/starred</C>, 'Recents / starred'],
          ['POST', <C>/drivelink/batch</C>, 'Batch operations'],
        ]}
      />

      <H2>Key model</H2>
      <p>
        <C>DrivelinkNode</C> — <C>account_id</C>, <C>workspace_id</C>, <C>parent_id</C>,{' '}
        <C>kind</C>, <C>name</C>, <C>path</C>, storage fields (
        <C>storage_method/url/folder/bucket/filename</C>), <C>mime_type</C>,{' '}
        <C>size_bytes</C>, <C>checksum_sha256</C>, <C>original_filename</C>,{' '}
        <C>deleted_at</C>, <C>trash_expires_at</C>, <C>version</C>, <C>is_starred</C>,{' '}
        <C>color_label</C>, <C>custom_properties</C>. Reads expose computed{' '}
        <C>is_trashed</C>, <C>thumbnail_url</C>, <C>capabilities</C>.
      </p>

      <H2>Services</H2>
      <ul>
        <li>
          <C>DrivelinkAction</C> — full CRUD with path management, soft/hard delete,
          descendant path rewriting, quota enforcement, sibling name uniqueness and storage
          blob reference counting.
        </li>
        <li>
          <C>DrivelinkService</C> — <C>create_storage_blob()</C>, <C>create_file()</C>,{' '}
          <C>replace_file_content()</C>.
        </li>
      </ul>
      <p>
        Pair with <C>@msflib/react-drivelink</C> on the frontend and the{' '}
        <C>TreeView</C> + <C>useLazyTreeData</C> combo for a complete file browser.
      </p>

      <H2>Examples</H2>

      <H3>1. Configure the module in settings</H3>
      <p>
        Mix <C>DrivelinkSettings</C> into the app settings class and set guardrails —
        every field also accepts a scoped env var like{' '}
        <C>DRIVELINK__MAX_UPLOAD_BYTES</C>:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py
from msflib.core.config import SettingsBase, CoreSettings
from msflib.account.config import AccountSettings
from msflib.drivelink.config import DrivelinkSettings


class AppSettings(DrivelinkSettings, AccountSettings, CoreSettings, SettingsBase):
    ENABLED: bool = True
    MAX_UPLOAD_BYTES: int = 50 * 1024 * 1024        # 50 MB per file
    QUOTA_MAX_BYTES: int = 2 * 1024 * 1024 * 1024   # 2 GB per account
    ALLOWED_MIME_PREFIXES: list[str] = ["image/", "application/pdf", "text/"]
    TRASH_RETENTION_DAYS: int = 30
    STORAGE_PARENT_FOLDER: str = "drivelink"
    SHARING_ENABLED: bool = False`}</CodeBlock>

      <H3>2. Mount the router (account-only or workspace-scoped)</H3>
      <p>
        The router factory takes an optional workspace dependency. Without it every node
        is account-scoped; with it, the workspace id rides along and isolates trees per
        workspace:
      </p>
      <CodeBlock lang="python">{`# app/api/api.py
from msflib.drivelink.router import router as drivelink_router
from app.api.deps import auth_deps

# account-scoped drive
api_router.include_router(drivelink_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    settings=settings,
    prefix="/drivelink",
    tags=["drivelink"],
))

# workspace-scoped drive: pass the workspace dependency
api_router.include_router(drivelink_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    get_current_workspace=user_deps.get_current_workspace,
    settings=settings,
    prefix="/drivelink",
    tags=["drivelink"],
))`}</CodeBlock>
      <Note>
        Domain rule violations become meaningful status codes: 404 for missing nodes, 409
        for name collisions, 413 for quota/size overruns, 400 for structural problems
        (e.g. wrong parent kind).
      </Note>

      <H3>3. Create a folder, upload, download (curl flow)</H3>
      <p>
        The bread-and-butter flow: make a folder, upload a file into it (the node row
        comes back with storage metadata and computed <C>capabilities</C>), then fetch a
        download URL:
      </p>
      <CodeBlock lang="bash">{`# 1) create a folder at the drive root (parent_id omitted)
curl -s -X POST http://localhost:8000/api/v1/drivelink/nodes/folders \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"name": "Invoices"}'
# → {"id": 10, "kind": "folder", "name": "Invoices", "path": "/Invoices", ...}

# 2) upload a file into that folder (multipart/form-data)
curl -s -X POST http://localhost:8000/api/v1/drivelink/nodes/10/files \\
  -H "Authorization: Bearer $TOKEN" \\
  -F "file=@q3-report.pdf;type=application/pdf"
# → {"id": 11, "kind": "file", "name": "q3-report.pdf",
#    "size_bytes": 184213, "mime_type": "application/pdf",
#    "checksum_sha256": "9f2c...", "capabilities": {"can_download": true, ...}}

# 3) browse children, search, and star
curl -s "http://localhost:8000/api/v1/drivelink/nodes?parent_id=10" \\
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:8000/api/v1/drivelink/nodes/search?q=report" \\
  -H "Authorization: Bearer $TOKEN"
curl -s -X PATCH http://localhost:8000/api/v1/drivelink/nodes/11 \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"is_starred": true}'

# 4) download — 302 redirect to a signed URL (pass redirect=false for JSON)
curl -sL http://localhost:8000/api/v1/drivelink/nodes/11/download \\
  -H "Authorization: Bearer $TOKEN" -o q3-report.pdf`}</CodeBlock>

      <H3>4. Trash, restore and batch operations</H3>
      <p>
        Deleting without <C>permanent</C> sends nodes to trash (including descendant path
        rewriting); the trash listing exposes <C>trash_expires_at</C>, restore brings the
        subtree back, and <C>POST /batch</C> applies many ops in one round trip — batch
        ops are <C>{"{ id, op, node_id, parent_id, name }"}</C> objects:
      </p>
      <CodeBlock lang="bash">{`# rename one node and move another in one atomic call
# (op kinds: "move" | "delete" | "rename" | "copy", all-or-nothing)
curl -s -X POST http://localhost:8000/api/v1/drivelink/batch \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"ops": [{"id": "a", "op": "rename", "node_id": 11, "name": "q3-final.pdf"},
               {"id": "b", "op": "move", "node_id": 12, "parent_id": 10}]}'
# → {"results": [{"id": "a", "status": "ok", "node_id": 11}, ...]}

# trash two nodes (batch "delete" is the soft delete)
curl -s -X POST http://localhost:8000/api/v1/drivelink/batch \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"ops": [{"id": "c", "op": "delete", "node_id": 11},
               {"id": "d", "op": "delete", "node_id": 12}]}'

# inspect the trash, then restore
curl -s http://localhost:8000/api/v1/drivelink/trash -H "Authorization: Bearer $TOKEN"
curl -s -X POST http://localhost:8000/api/v1/drivelink/nodes/11/restore \\
  -H "Authorization: Bearer $TOKEN"

# permanent deletion actually removes the blob (permanent=true query param)
curl -s -X DELETE "http://localhost:8000/api/v1/drivelink/nodes/12?permanent=true" \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
      <Note>
        File bodies can also be replaced in place with{' '}
        <C>PUT /drivelink/nodes/&#123;id&#125;/content</C> — the node keeps its identity,
        storage fields and <C>version</C> are updated, and the checksum is recomputed.
      </Note>
    </>
  )
}
