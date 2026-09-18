import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactSupport() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-support</C> (v0.0.6) manages support tickets against the{' '}
        <C>/support</C> endpoint (module key <C>support</C>).
      </p>
      <p>
        It is the smallest data module in the family and a good template for writing your
        own: one list query (<C>GET /support</C>) cached under a workspace-scoped key, one
        mutation (<C>POST /support</C>) that invalidates the list on success, and a{' '}
        <C>getIssue(id)</C> lookup computed from the cached list rather than a separate
        request. Payloads are <C>{'{ title, category, message }'}</C> and tickets come
        back with a server-assigned <C>status</C> (typed as <C>'pending' | string</C>).
      </p>
      <p>
        The provider follows the standard architecture: <C>SupportProvider</C> builds{' '}
        <C>createSupportApi(isWorkspaceScoped)</C>, keys the query by the active workspace,
        and optionally defers fetching until <C>{'{ requireAuth: true, isAuthenticated }'}</C>
        is satisfied. <C>useSupport()</C> throws outside the provider.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A "contact support" form</B> — submit issues with{' '}
          <C>createIssue</C> and let the list invalidate itself.
        </li>
        <li>
          <B>A "my tickets" list</B> — cached per workspace, with{' '}
          <C>loading.issues</C> and <C>loading.create</C> flags for UI state.
        </li>
        <li>
          <B>A detail lookup without another request</B> — <C>getIssue(id)</C> reads from
          the cached list.
        </li>
        <li>
          <B>A reference provider implementation</B> — the package is ~150 lines and shows
          the whole module pattern end to end.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { SupportProvider, useSupport } from '@msflib/react-support'

<SupportProvider>
  <Tickets />
</SupportProvider>

function Tickets() {
  const { issues, getIssue, createIssue } = useSupport()

  const openTicket = (form) =>
    createIssue(form, { onSuccess: () => toast('Ticket created') })
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>issues</C>, <><C>SupportIssue[]</C> — <C>{'{ id, title, category, message, status, created_at }'}</C></>],
          [<C>getIssue(id)</C>, <><C>SupportIssue | undefined</C> from the cached list — not a network call</>],
          [<C>createIssue(payload, options?)</C>, 'POST <C>{ title, category, message }</C>; invalidates the list on success'],
          [<C>refetch()</C>, 'Re-run the list query'],
          [<C>loading.issues / loading.create</C>, 'Query and mutation flags'],
        ]}
      />

      <H2>Wiring</H2>
      <p>
        Standard wiring: inside <C>QueryClientProvider</C> +{' '}
        <C>&lt;SupportProvider /&gt;</C>; endpoint override via{' '}
        <C>configureApplication({'{ endpoints: { support: {...} } })'}</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic ticket list</H3>
      <p>
        Read the cached list and locate one ticket with <C>getIssue</C> — no second query
        hook needed for a detail pane, since lookup is over the list the provider already
        holds.
      </p>
      <CodeBlock lang="tsx">{`import { SupportProvider, useSupport } from '@msflib/react-support'

export function SupportPage() {
  return (
    <SupportProvider>
      <TicketList />
    </SupportProvider>
  )
}

function TicketList() {
  const { issues, getIssue, loading, refetch } = useSupport()
  const first = issues[0] ? getIssue(issues[0].id) : undefined

  if (loading.issues) return <p>Loading tickets…</p>

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <strong>{issue.title}</strong> — {issue.category} · {issue.status}
          </li>
        ))}
      </ul>
      {first && <p>Latest: {first.message}</p>}
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: "contact support" form with create flow</H3>
      <p>
        The submit path: build the payload, call <C>createIssue</C>, surface the pending
        state with <C>loading.create</C>, and close the dialog in <C>onSuccess</C> — the
        provider invalidates the list query, so the new ticket appears without a manual
        refresh. Errors arrive as the <C>mutateAsync</C> rejection.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { SupportProvider, useSupport } from '@msflib/react-support'

export function ContactSupportDialog({ onClose }: { onClose: () => void }) {
  return (
    <SupportProvider>
      <ContactForm onClose={onClose} />
    </SupportProvider>
  )
}

function ContactForm({ onClose }: { onClose: () => void }) {
  const { createIssue, loading } = useSupport()
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)

    try {
      await createIssue(
        {
          title: String(form.get('title') ?? ''),
          category: String(form.get('category') ?? 'general'), // 'general' | string
          message: String(form.get('message') ?? ''),
        },
        { onSuccess: () => onClose() },
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit ticket')
    }
  }

  return (
    <form onSubmit={submit}>
      {error && <p role="alert">{error}</p>}
      <input name="title" placeholder="Subject" required />
      <select name="category" defaultValue="general">
        <option value="general">General</option>
        <option value="billing">Billing</option>
        <option value="bug">Bug report</option>
      </select>
      <textarea name="message" rows={5} required />
      <button disabled={loading.create}>
        {loading.create ? 'Sending…' : 'Submit ticket'}
      </button>
    </form>
  )
}`}</CodeBlock>

      <H3>3. Advanced: auth-gated provider + unread-style badge</H3>
      <p>
        Mount the provider once in the app shell with <C>requireAuth</C> mirroring the
        session, then consume it from both the nav badge and the tickets screen. Because
        the query key is workspace-scoped, switching tenants shows that tenant's tickets
        automatically.
      </p>
      <CodeBlock lang="tsx">{`import { SupportProvider, useSupport } from '@msflib/react-support'
import { useAuth } from '@msflib/react-auth'

export function AppShellSupport() {
  const { status } = useAuth()
  const isAuthenticated = status === 'authenticated'

  return (
    <SupportProvider
      options={{ requireAuth: true, isAuthenticated, isWorkspaceScoped: true }}
    >
      <Nav />
      <TicketList />
    </SupportProvider>
  )
}

function Nav() {
  const { issues } = useSupport()
  const openCount = issues.filter((issue) => issue.status === 'pending').length

  return (
    <nav>
      <a href="/support">Support {openCount > 0 && <span>({openCount} open)</span>}</a>
    </nav>
  )
}`}</CodeBlock>

      <Note>
        <C>getIssue</C> only sees what the list query returned — if your backend paginates
        the collection, a ticket outside the current page won't be found; fetch it via the
        API factory (<C>createSupportApi().get(supportId)</C>) instead.
      </Note>
    </>
  )
}
