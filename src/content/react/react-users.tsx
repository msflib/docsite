import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactUsers() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-users</C> (v0.0.2) is the workspace-membership module (module
        key <C>users</C>, endpoint default <C>/users</C>).
      </p>
      <p>
        Unlike the auth module (which is about the account), this module is about the{' '}
        <B>user record inside a workspace</B>: <C>GET /users/me</C> returns the{' '}
        <C>UserRecord</C> for the signed-in account in the current workspace —{' '}
        <C>{'{ id, account_id, workspace_id, type, status, workspace_slug }'}</C> where{' '}
        <C>type</C> is <C>'learner' | 'trainer'</C>. On top of that read it owns the two
        tenancy mutations: <C>POST /users/join</C> (enroll into a workspace, optionally
        with level/track/stage and an <C>info</C> survey payload) and{' '}
        <C>POST /users/switch</C> (move the account to another workspace).
      </p>
      <p>
        Both mutations are registered as workspace-<B>unscoped</B> endpoints (they pass{' '}
        <C>{'{ isWorkspaceScoped: false }'}</C> to the client) because joining and
        switching cannot depend on a tenant you're not in yet. Their{' '}
        <C>onSuccess</C> calls <C>setActiveWorkspace(user.workspace_slug)</C> from{' '}
        <C>@msflib/core</C> — so the mutation itself flips the active tenant and every
        workspace-scoped provider re-keys. A standalone <C>useGetUser(userId)</C> query
        exists for directory-style detail views.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>The current membership record</B> — role, status and workspace slug for the
          signed-in user in the active tenant.
        </li>
        <li>
          <B>Onboarding/enrollment</B> — join a workspace with user type, level/track
          selection and survey data.
        </li>
        <li>
          <B>Multi-tenant switching</B> — <C>switchWorkspace</C> updates the server-side
          membership and the client's active workspace in one call.
        </li>
        <li>
          <B>Role-aware UI</B> — gate trainer-only screens on{' '}
          <C>user?.type === 'trainer'</C>.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { UsersProvider, useUsers } from '@msflib/react-users'

<UsersProvider>
  <Directory />
</UsersProvider>

function Directory() {
  const { user, getUser, joinWorkspace, switchWorkspace } = useUsers()
  // user comes from GET /users/me — the current account inside its workspace context
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>user</C>, <><C>UserRecord | null</C> from <C>GET /users/me</C> — <C>{'{ id, account_id, workspace_id, type, status, workspace_slug }'}</C></>],
          [<C>getUser(id)</C>, 'Single user record (mutation-style fetch)'],
          [<C>joinWorkspace(payload)</C>, <>POST <C>/users/join</C> — <C>{'{ workspace_id, user_type, level_id?, track_id?, stage_id?, info? }'}</C>; sets the active workspace on success</>],
          [<C>switchWorkspace(payload)</C>, <>POST <C>/users/switch</C> — <C>{'{ workspace_id }'}</C> (string); sets the active workspace on success</>],
          [<C>refetchUser()</C>, 'Re-run the /users/me query'],
          [<C>loading.user / getUser / joinWorkspace / switchWorkspace</C>, 'Per-operation flags'],
        ]}
      />
      <p>
        Standalone hook: <C>useGetUser(userId?)</C> — a <C>useQuery</C> keyed by workspace
        + user id, disabled until an id is passed.
      </p>

      <H2>Wiring</H2>
      <p>
        Standard provider wiring applies; override endpoints via{' '}
        <C>configureApplication({'{ endpoints: { users: {...} } })'}</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic role-aware header</H3>
      <p>
        The smallest useful consumer: read <C>user</C> and branch on <C>type</C>. The query
        only fires when the provider is mounted and (with <C>requireAuth</C>) the session
        is real; with a workspace-scoped provider it re-runs per tenant.
      </p>
      <CodeBlock lang="tsx">{`import { UsersProvider, useUsers } from '@msflib/react-users'

export function UserHeader() {
  return (
    <UsersProvider>
      <Header />
    </UsersProvider>
  )
}

function Header() {
  const { user, loading, refetchUser } = useUsers()

  if (loading.user) return <p>Loading membership…</p>

  return (
    <header>
      <span>
        {user?.type === 'trainer' ? 'Trainer' : 'Learner'} · {user?.status}
      </span>
      <span>Workspace #{user?.workspace_id} ({user?.workspace_slug})</span>
      <button onClick={() => refetchUser()}>Refresh</button>
    </header>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: onboarding enrollment with the join mutation</H3>
      <p>
        The enrollment wizard: collect workspace, user type and optional level/track, then
        <C> joinWorkspace</C>. On success the provider sets the active workspace to the
        returned <C>workspace_slug</C>, so subsequent workspace-scoped providers (tasks,
        courses, notifications) query the right tenant immediately — no manual{' '}
        <C>setActiveWorkspace</C> call needed.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { UsersProvider, useUsers } from '@msflib/react-users'

export function EnrollmentWizard() {
  return (
    <UsersProvider>
      <Wizard />
    </UsersProvider>
  )
}

function Wizard() {
  const { joinWorkspace, loading, user } = useUsers()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const enroll = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    setError(null)
    const form = new FormData(formEvent.currentTarget)

    try {
      const record = await joinWorkspace({
        workspace_id: Number(form.get('workspace_id')),
        user_type: String(form.get('user_type') || 'learner'),
        level_id: form.get('level_id') ? Number(form.get('level_id')) : undefined,
        track_id: form.get('track_id') ? Number(form.get('track_id')) : undefined,
        info: {
          employment_status: String(form.get('employment') ?? ''),
          information_source: String(form.get('source') ?? ''),
          survey_data: { referral: form.get('referral') },
        },
      })
      setDone(true)
      console.log('joined', record.workspace_slug) // active workspace already switched
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enrollment failed')
    }
  }

  if (done || user) return <p>You are enrolled in {user?.workspace_slug}.</p>

  return (
    <form onSubmit={enroll}>
      {error && <p role="alert">{error}</p>}
      <input name="workspace_id" type="number" placeholder="Workspace id" required />
      <select name="user_type" defaultValue="learner">
        <option value="learner">Learner</option>
        <option value="trainer">Trainer</option>
      </select>
      <input name="level_id" type="number" placeholder="Level (optional)" />
      <input name="track_id" type="number" placeholder="Track (optional)" />
      <input name="source" placeholder="How did you hear about us?" />
      <button disabled={loading.joinWorkspace}>
        {loading.joinWorkspace ? 'Joining…' : 'Join workspace'}
      </button>
    </form>
  )
}`}</CodeBlock>

      <H3>3. Advanced: tenant switching via switchWorkspace</H3>
      <p>
        Where the workspace module's <C>TenantSwitcher</C> changes tenants client-side,{' '}
        <C>switchWorkspace</C> changes the server-side membership too and mirrors it into
        the client singleton. Note the payload's <C>workspace_id</C> is a <B>string</B>.
        Pair it with <C>useActiveWorkspace</C> so the dropdown reflects the switch the
        moment the mutation resolves.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { UsersProvider, useUsers } from '@msflib/react-users'
import { useActiveWorkspace } from '@msflib/react-shared'

type Membership = { workspace_id: string; label: string }

export function AccountSwitcher({ memberships }: { memberships: Membership[] }) {
  return (
    <UsersProvider>
      <Switcher memberships={memberships} />
    </UsersProvider>
  )
}

function Switcher({ memberships }: { memberships: Membership[] }) {
  const { switchWorkspace, loading, refetchUser } = useUsers()
  const active = useActiveWorkspace()
  const [error, setError] = useState<string | null>(null)

  const switchTo = async (workspaceId: string) => {
    setError(null)
    try {
      const record = await switchWorkspace({ workspace_id: workspaceId })
      // record.workspace_slug is now the active workspace everywhere:
      // all workspace-scoped providers re-key and refetch automatically.
      void refetchUser()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Switch failed')
    }
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <select
        value={active ?? ''}
        disabled={loading.switchWorkspace}
        onChange={(e) => switchTo(e.target.value)}
      >
        <option value="">—</option>
        {memberships.map((m) => (
          <option key={m.workspace_id} value={m.workspace_id}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  )
}`}</CodeBlock>

      <H3>4. Detail view with useGetUser</H3>
      <p>
        <C>useGetUser(userId)</C> is a standalone query that builds its own API instance —
        handy for admin pages rendering one member without mounting the provider. It stays
        disabled until an id is passed, and its result is cached under{' '}
        <C>[workspace, 'msflib', 'users', 'detail', userId]</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useGetUser } from '@msflib/react-users'

export function MemberCard({ userId }: { userId?: number }) {
  const { data: member, isPending, error } = useGetUser(userId)

  if (!userId) return <p>No member selected.</p>
  if (isPending) return <p>Loading member…</p>
  if (error) return <p role="alert">{error.message}</p>

  return (
    <article>
      <h3>#{member?.id} — {member?.type}</h3>
      <p>Account #{member?.account_id} · workspace {member?.workspace_slug}</p>
      <p>Status: {member?.status}</p>
    </article>
  )
}`}</CodeBlock>

      <Note>
        The <C>user</C> query is keyed per workspace (<C>[workspace, 'msflib', 'users',
        'user']</C>), so after <C>joinWorkspace</C>/<C>switchWorkspace</C> set a new
        active workspace, the membership record refetches for that tenant automatically.
      </Note>
    </>
  )
}
