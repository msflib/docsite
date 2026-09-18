import { B, C, CodeBlock, H2, H3, Note, Table, Tip } from '../../components/md'

export default function ReactNotification() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-notification</C> (v0.0.9) manages the signed-in account's
        notification inbox.
      </p>
      <p>
        It wraps the <C>/notifications</C> backend collection in a <C>useQuery</C> (cached
        under a workspace-scoped key) and exposes the three mutations every inbox needs —
        mark one read/unread (<C>PATCH /notifications/&#123;id&#125;/mark</C>), mark all
        read/unread (<C>PATCH /notifications/mark-all</C>) and delete one. Deletes update
        the cached list directly (optimistic-style cache filtering, no refetch wait);
        toggle mutations invalidate the list so unread counts stay truthful.
      </p>
      <p>
        The module follows the standard provider architecture: <C>NotificationProvider</C>{' '}
        builds <C>createNotificationApi(isWorkspaceScoped)</C> once, keys its query by the
        active workspace from <C>useActiveWorkspace()</C>, and hands a flat context object
        to <C>useNotification()</C> — throwing if called outside the provider.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>An inbox UI</B> — list, unread state, mark-all and delete with loading flags
          per operation.
        </li>
        <li>
          <B>A badge counter</B> — derive unread counts from{' '}
          <C>notifications.filter((n) =&gt; !n.is_read).length</C>; the query refreshes
          after any toggle.
        </li>
        <li>
          <B>Tenant-correct data</B> — when <C>isWorkspaceScoped</C> (the default),
          requests ride the active workspace prefix automatically.
        </li>
        <li>
          <B>Auth-gated fetching</B> — set <C>{'{ requireAuth: true, isAuthenticated }'}</C>{' '}
          so the query stays disabled until the session is real (see the playground's
          protected layout).
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { NotificationProvider, useNotification } from '@msflib/react-notification'

<NotificationProvider>
  <Inbox />
</NotificationProvider>

function Inbox() {
  const { notifications, loading, toggleStatus, toggleAllStatus, removeNotification } = useNotification()

  return (
    <ul>
      {notifications?.map((n) => (
        <li key={n.id} data-read={n.is_read}>
          <button onClick={() => toggleStatus({ id: n.id, status: !n.is_read })}>Toggle</button>
          <button onClick={() => removeNotification(n.id)}>Delete</button>
        </li>
      ))}
      <button onClick={() => toggleAllStatus(true)}>Mark all read</button>
    </ul>
  )
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>notifications</C>, <>Query result list of <C>Notification</C> records (<C>notification_id</C>, <C>is_read</C>, nested <C>notification</C> detail)</>],
          [<C>toggleStatus({'{ id, status }'})</C>, 'Mark one notification read/unread — invalidates the list'],
          [<C>toggleAllStatus(bool)</C>, 'Mark all read/unread — invalidates the list'],
          [<C>removeNotification(id)</C>, 'Delete one — filters it out of the cached list immediately'],
          [<C>getNotification(id)</C>, 'Single fetch (mutation-style)'],
          [<C>loading.notifications</C>, 'Mutation/query loading flags'],
        ]}
      />

      <H2>Wiring</H2>
      <ul>
        <li>
          Endpoint default: <C>/notifications</C> (module key <C>notification</C>).
        </li>
        <li>
          Wrap consumers in <C>&lt;NotificationProvider /&gt;</C> inside{' '}
          <C>QueryClientProvider</C>; <C>useNotification</C> throws outside the provider.
        </li>
        <li>
          Override endpoints via{' '}
          <C>configureApplication({'{ endpoints: { notification: {...} } })'}</C>.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. A basic inbox with unread state</H3>
      <p>
        The smallest useful inbox: render the list, mark items read/unread, delete them,
        and show a spinner from <C>loading.notifications</C>. Note the record shape — the
        receiver row is <C>{'{ notification_id, is_read, notification: { title, message, … } }'}</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useNotification } from '@msflib/react-notification'

export function Inbox() {
  const { notifications, loading, toggleStatus, removeNotification } = useNotification()

  if (loading.notifications) return <p>Loading inbox…</p>

  return (
    <ul>
      {(notifications ?? []).map((n) => (
        <li key={n.notification_id} style={{ fontWeight: n.is_read ? 400 : 700 }}>
          <strong>{n.notification.title}</strong> — {n.notification.message}
          <button onClick={() => toggleStatus({ id: n.notification_id, status: !n.is_read })}>
            Mark {n.is_read ? 'unread' : 'read'}
          </button>
          <button onClick={() => removeNotification(n.notification_id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: badge, mark-all and auth gating (playground pattern)</H3>
      <p>
        The playground's protected layout mounts the provider with{' '}
        <C>{'{ requireAuth: true, isAuthenticated, isWorkspaceScoped: true }'}</C>, so the
        query only runs once the session exists, and re-fetches per tenant. This screen is
        the notifications page: a header badge computed from the cached list, a "Mark all
        read" action, and per-row toggles that invalidate the query on success.
      </p>
      <CodeBlock lang="tsx">{`import { NotificationProvider, useNotification } from '@msflib/react-notification'
import { useAuth } from '@msflib/react-auth'

export function NotificationsRoute() {
  const { status } = useAuth()
  return (
    <NotificationProvider
      options={{
        requireAuth: true,
        isAuthenticated: status === 'authenticated',
        isWorkspaceScoped: true,
      }}
    >
      <NotificationCenter />
    </NotificationProvider>
  )
}

function NotificationCenter() {
  const { notifications, toggleAllStatus, loading } = useNotification()
  const unread = (notifications ?? []).filter((n) => !n.is_read).length

  return (
    <section>
      <header>
        <h1>Notifications {unread > 0 && <span>({unread} unread)</span>}</h1>
        <button disabled={loading.toggleAllStatus || unread === 0} onClick={() => toggleAllStatus(true)}>
          {loading.toggleAllStatus ? 'Marking…' : 'Mark all read'}
        </button>
      </header>

      {loading.notifications && <p>Refreshing…</p>}
      <InboxList />
    </section>
  )
}`}</CodeBlock>

      <H3>3. Advanced: workspace-reactive badge in the nav bar</H3>
      <p>
        Because the query key is workspace-scoped, mounting one provider instance above the
        app shell is enough: switching tenants via <C>setActiveWorkspace</C> swaps the key
        and the badge recomputes from the new tenant's list. Pair the delete flow with a
        local <C>aria-live</C> region to announce changes.
      </p>
      <CodeBlock lang="tsx">{`import { NotificationProvider, useNotification } from '@msflib/react-notification'
import { useActiveWorkspace } from '@msflib/react-shared'
import { setActiveWorkspace } from '@msflib/core'

function UnreadBadge() {
  const { notifications } = useNotification()
  const count = (notifications ?? []).filter((n) => !n.is_read).length
  return <span aria-live="polite">{count}</span>
}

export function AppNav() {
  const workspace = useActiveWorkspace()

  return (
    <nav>
      <NotificationProvider>
        <a href="/notifications">
          Inbox <UnreadBadge />
        </a>
      </NotificationProvider>

      {/* switching tenants re-keys the query — no manual refetch */}
      <select value={workspace ?? ''} onChange={(e) => setActiveWorkspace(e.target.value)}>
        <option value="acme">Acme</option>
        <option value="globex">Globex</option>
      </select>
    </nav>
  )
}`}</CodeBlock>

      <Tip>
        The playground dashboard demonstrates the full UX, including skeleton loading via{' '}
        <C>AppSkeleton</C> and per-row actions.
      </Tip>

      <Note>
        Deletes are the only optimistic mutation: the provider filters the deleted id out
        of the cached list in <C>onSuccess</C>. Toggles and mark-all invalidate the list
        query instead, trading a refetch for guaranteed unread-count correctness.
      </Note>
    </>
  )
}
