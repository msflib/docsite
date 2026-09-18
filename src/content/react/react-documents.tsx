import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactDocuments() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-documents</C> (v0.0.1) handles document storage and the ingestion
        pipeline (chunking/embedding workers live on the backend) — module key{' '}
        <C>documents</C>.
      </p>
      <p>
        Documents are indexed by <C>record_id</C> and scoped to a{' '}
        <C>workspace_id</C> and optionally a <C>conversation_id</C>/<C>sub_thread_id</C>{' '}
        (chat attachments) or <C>private_to_account_id</C> (personal files). The module
        covers the whole lifecycle: multipart upload (<C>POST /documents/upload</C>,
        returning a <C>record_id</C> and a queued <C>job_id</C>), listing with filters
        (status, conversation, pagination), metadata fetch, blob download (an authenticated
        fetch that bypasses the JSON client), delete, promotion of private/conversation
        files into the workspace library, and the admin plumbing — worker runs, reindexing
        and ingestion status/jobs.
      </p>
      <p>
        The download path is worth knowing: <C>downloadDocument</C> calls{' '}
        <C>fetchDocumentDownloadBlob</C>, which resolves the workspace prefix itself and
        adds the bearer token (and workspace header when configured) before returning a{' '}
        <C>Blob</C> — pair it with the exported <C>downloadBlob(blob, filename)</C>{' '}
        helper to trigger a browser save. The provider keys its queries by workspace and
        exposes per-operation loading flags, including a dedicated{' '}
        <C>loading.download</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A document library</B> — list, filter by status/conversation, upload and
          delete with cache updates.
        </li>
        <li>
          <B>Authenticated downloads</B> — a <C>Blob</C> fetch with the token and tenant
          prefix handled.
        </li>
        <li>
          <B>Chat/RAG attachments</B> — conversation-scoped uploads promoted into the
          workspace library via <C>promoteDocument</C>.
        </li>
        <li>
          <B>Pipeline observability</B> — ingestion status, job queues and a manual
          worker run/reindex trigger.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { DocumentsProvider, useDocuments, downloadBlob } from '@msflib/react-documents'

<DocumentsProvider>
  <DocumentLibrary />
</DocumentsProvider>

function DocumentLibrary() {
  const { documents, uploadDocument, downloadDocument, runWorker, reindexDocuments, ingestionStatus, ingestionJobs } = useDocuments()

  const onPick = (file) => {
    const fd = new FormData()
    fd.append('file', file)
    uploadDocument(fd)
  }

  const save = async (doc) => {
    const blob = await downloadDocument(doc.record_id)   // returns a Blob
    downloadBlob(blob, doc.name ?? 'document')           // helper to trigger a browser download
  }
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Endpoint default', 'Notes']}
        rows={[
          [<C>documents</C>, <C>/documents</C>, <><C>DocumentSummary[]</C> — <C>{'{ record_id, name, mime_type, size_bytes, status, current_version, workspace_id, conversation_id? }'}</C></>],
          [<C>getDocument(recordId)</C>, <C>/documents/&#123;id&#125;</C>, 'Single metadata fetch'],
          [<C>uploadDocument(formData)</C>, <C>/documents/upload</C>, <>Multipart; returns <C>{'{ record_id, job_id, status }'}</C></>],
          [<C>downloadDocument(recordId)</C>, <C>/documents/&#123;id&#125;/download</C>, <>Authenticated <C>Blob</C> fetch (bypasses the JSON client)</>],
          [<C>deleteDocument(recordId)</C>, <C>/documents/&#123;id&#125;</C>, <>Returns <C>{'{ record_id, job_id, status }'}</C></>],
          [<C>promoteDocument(recordId, {'{ clear_private? }'}?)</C>, <C>/documents/&#123;id&#125;/promote</C>, 'Unscoped call — moves a private/conversation doc into the workspace'],
          [<C>runWorker({'{ max_jobs? }'}?)</C>, <C>/documents/worker/run</C>, 'Unscoped; <C>{ processed, has_more }</C>'],
          [<C>reindexDocuments(payload?)</C>, <C>/documents/reindex</C>, <C>{'{ scanned, enqueued, skipped, purged_old_backend }'}</C>],
          [<C>ingestionStatus</C>, <C>/documents/ingestion/status</C>, 'Queue + record counts per status'],
          [<C>fetchIngestionJobs(params?)</C>, <C>/documents/ingestion/jobs</C>, 'Job rows with attempts and errors'],
          [<C>loading.*</C>, '—', 'Per-operation flags incl. <C>download</C>, <C>upload</C>, <C>worker</C>'],
        ]}
      />
      <p>
        Also exported: <C>downloadBlob(blob, filename)</C> — a small helper to force a
        browser download from a Blob. Standalone hooks:{' '}
        <C>useDocument(recordId?)</C>, <C>useDocumentIngestionStatus()</C>,{' '}
        <C>useDocumentIngestionJobs(params?)</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic upload-and-list library</H3>
      <p>
        The smallest useful screen: list documents, upload via <C>FormData</C>, and show
        the returned record/job ids. Uploads return immediately with{' '}
        <C>{'{ record_id, job_id, status }'}</C> — processing happens asynchronously on
        the backend, so new files may appear with a <C>pending</C>/<C>queued</C> status
        until the worker picks them up.
      </p>
      <CodeBlock lang="tsx">{`import { useRef, useState } from 'react'
import { DocumentsProvider, useDocuments } from '@msflib/react-documents'

export function LibraryPage() {
  return (
    <DocumentsProvider options={{ listParams: { limit: 50 } }}>
      <Library />
    </DocumentsProvider>
  )
}

function Library() {
  const { documents, uploadDocument, deleteDocument, loading } = useDocuments()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [lastUpload, setLastUpload] = useState<{ record_id: number; job_id: number } | null>(null)

  const onPick = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadDocument(fd)
    setLastUpload(res) // { record_id, job_id, status: 'queued', ... }
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        hidden
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
      />
      <button onClick={() => fileRef.current?.click()} disabled={loading.upload}>
        {loading.upload ? 'Uploading…' : 'Upload document'}
      </button>
      {lastUpload && <p>Queued record #{lastUpload.record_id} (job #{lastUpload.job_id})</p>}

      <ul>
        {documents.map((doc) => (
          <li key={doc.record_id}>
            <strong>{doc.name ?? doc.source_key}</strong> — {doc.mime_type ?? 'unknown'} ·{' '}
            {doc.status}
            <button onClick={() => deleteDocument(doc.record_id)} disabled={loading.deleteDocument}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: authenticated download + upload status refresh</H3>
      <p>
        Downloads return a <C>Blob</C> rather than a URL, because the endpoint needs the
        bearer token. Combine with <C>downloadBlob</C> for the save dialog, use{' '}
        <C>useDocumentIngestionStatus</C> to show queue health, and poll the list while a
        job is pending to flip statuses to <C>indexed</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useEffect } from 'react'
import {
  DocumentsProvider,
  useDocuments,
  useDocumentIngestionStatus,
  downloadBlob,
} from '@msflib/react-documents'

export function LibraryWithDownloads() {
  return (
    <DocumentsProvider>
      <Downloads />
    </DocumentsProvider>
  )
}

function Downloads() {
  const { documents, downloadDocument, loading } = useDocuments()
  const { data: status } = useDocumentIngestionStatus()

  const save = async (doc: (typeof documents)[number]) => {
    const blob = await downloadDocument(doc.record_id, {
      onError: (err) => console.error('download failed', err),
    })
    downloadBlob(blob, doc.name ?? \`document-\${doc.record_id}\`)
  }

  // simple polling while the pipeline is catching up
  const pending = documents.some((d) => d.status === 'pending' || d.status === 'queued')
  const { refetch } = useDocuments()
  useEffect(() => {
    if (!pending) return
    const timer = setInterval(() => void refetch(), 5000)
    return () => clearInterval(timer)
  }, [pending])

  return (
    <div>
      {status && (
        <p>
          Queue: {Object.entries(status.queue).map(([k, v]) => \`\${k}=\${v}\`).join(', ')}
        </p>
      )}
      <ul>
        {documents.map((doc) => (
          <li key={doc.record_id}>
            {doc.name ?? doc.source_key}
            <button onClick={() => save(doc)} disabled={loading.download}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: conversation-scoped uploads promoted into the workspace</H3>
      <p>
        The RAG/chat flow: upload with conversation context (list and upload accept{' '}
        <C>conversation_id</C>/<C>sub_thread_id</C> via <C>listParams</C> and the form
        data), then <C>promoteDocument</C> lifts the file into the shared workspace
        library — a deliberately unscoped call with an optional{' '}
        <C>{'{ clear_private: true }'}</C> param.
      </p>
      <CodeBlock lang="tsx">{`import { useRef, useState } from 'react'
import { DocumentsProvider, useDocuments } from '@msflib/react-documents'

export function ChatAttachments({ conversationId }: { conversationId: string }) {
  return (
    <DocumentsProvider options={{ listParams: { conversation_id: conversationId } }}>
      <Attachments conversationId={conversationId} />
    </DocumentsProvider>
  )
}

function Attachments({ conversationId }: { conversationId: string }) {
  const { documents, uploadDocument, promoteDocument, loading } = useDocuments()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const attach = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('conversation_id', conversationId)
    await uploadDocument(fd)
  }

  const shareWithWorkspace = async (recordId: number) => {
    await promoteDocument(recordId, { clear_private: true }, {
      onSuccess: (res) => console.log('promoted', res.record_id, res.status),
    })
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => e.target.files?.[0] && attach(e.target.files[0])}
      />
      <button onClick={() => inputRef.current?.click()} disabled={loading.upload}>
        Attach file
      </button>

      <ul>
        {documents.map((doc) => (
          <li key={doc.record_id}>
            {doc.name ?? doc.source_key}
            {doc.private_to_account_id || doc.conversation_id ? (
              <button onClick={() => shareWithWorkspace(doc.record_id)} disabled={loading.promote}>
                Share with workspace
              </button>
            ) : (
              <em> in library</em>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <H3>4. Advanced: admin pipeline console (worker, reindex, jobs)</H3>
      <p>
        The operations side: trigger a worker batch manually (<C>runWorker</C> — useful in
        dev/self-hosted setups where no cron hits the endpoint), request a reindex and
        inspect job failures with attempts and error strings via{' '}
        <C>fetchIngestionJobs({'{ status }'})</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { DocumentsProvider, useDocuments } from '@msflib/react-documents'

export function PipelineConsole() {
  return (
    <DocumentsProvider>
      <Console />
    </DocumentsProvider>
  )
}

function Console() {
  const { runWorker, reindexDocuments, fetchIngestionJobs, ingestionStatus, loading } = useDocuments()
  const [jobs, setJobs] = useState<any[] | null>(null)

  const drainQueue = async () => {
    const res = await runWorker({ max_jobs: 25 })
    console.log(\`processed \${res.processed}, more: \${res.has_more}\`)
  }

  const rebuildIndex = async () => {
    const res = await reindexDocuments({ purge_old_profile_id: null })
    console.log(\`scanned \${res.scanned}, enqueued \${res.enqueued}, skipped \${res.skipped}\`)
  }

  const showFailed = async () => {
    const res = await fetchIngestionJobs({ status: 'failed', limit: 20 })
    setJobs(res.jobs)
  }

  return (
    <div>
      <h1>Ingestion pipeline</h1>
      {ingestionStatus && <pre>{JSON.stringify(ingestionStatus.records, null, 2)}</pre>}

      <button onClick={drainQueue} disabled={loading.worker}>
        {loading.worker ? 'Running…' : 'Run worker'}
      </button>
      <button onClick={rebuildIndex} disabled={loading.reindex}>
        Reindex
      </button>
      <button onClick={showFailed} disabled={loading.jobs}>
        Show failed jobs
      </button>

      {jobs && (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              #{job.id} {job.status} ({job.attempts} attempts): {job.error ?? job.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`}</CodeBlock>

      <Note>
        Statuses worth branching on: records move{' '}
        <C>pending → queued → indexed</C> (or <C>failed</C>, <C>deleted</C>); ingestion
        jobs use <C>queued | processing | done | failed | superseded</C>. Both are typed
        as extensible strings, so unknown backend values still typecheck.
      </Note>
    </>
  )
}
