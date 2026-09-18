import { B, C, CodeBlock, H2, H3, Note, Table, Tip, Warning } from '../../components/md'

export default function ReactWorkspace() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-workspace</C> (v0.0.11) is both a feature module (workspace CRUD)
        and the home of the multi-tenancy mechanics used across the stack.
      </p>
      <p>
        In msflib, a workspace is a tenant: every workspace-scoped endpoint is namespaced
        by the active workspace slug (path prefix <C>/{'{workspace}'}</C> by default, or an
        <C> X-Workspace</C>-style header). This package supplies the data side —{' '}
        <C>GET /workspaces</C>, <C>GET /workspaces/available</C> (an explicit unscoped
        exception), single fetch, and multipart create/update/delete via{' '}
        <C>apiFormDataClient</C> since the endpoints accept a logo upload — and the
        request-rewriting side: <C>workspaceHookDecorator</C> plugs into{' '}
        <C>configureApplication({'{ apiClientDecorator }'})</C> and prefixes or headers
        every outgoing request based on the active workspace from <C>@msflib/core</C>'s
        singleton.
      </p>
      <p>
        The provider follows the standard pattern: two queries (owned workspaces and
        available workspaces) keyed by the active workspace, mutations that update the
        cache, and loading flags per operation. <C>useGetWorkspace(id)</C> is a standalone
        query for detail views outside the provider lists.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A tenant switcher</B> — combine <C>availableWorkspaces</C> with{' '}
          <C>setActiveWorkspace(slug)</C>; every workspace-scoped provider re-keys
          automatically.
        </li>
        <li>
          <B>Workspace administration</B> — create/rename/delete workspaces with logo
          uploads (FormData payloads).
        </li>
        <li>
          <B>Path- or header-based tenancy</B> — <C>workspaceHookDecorator('path' | 'header')</C>{' '}
          wired into the core client decorator.
        </li>
        <li>
          <B>Detail views</B> — <C>useGetWorkspace(id)</C> fetches and caches one
          workspace without the full provider.
        </li>
      </ul>

      <H2>Provider & hooks</H2>
      <CodeBlock lang="tsx">{`import { WorkspaceProvider, useWorkspace, useGetWorkspace } from '@msflib/react-workspace'
import { getActiveWorkspace, setActiveWorkspace } from '@msflib/core'

<WorkspaceProvider options={{ requireAuth: true }}>
  <TenantSwitcher />
</WorkspaceProvider>

function TenantSwitcher() {
  const { workspaces, availableWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace()
  const active = getActiveWorkspace()

  return (
    <select value={active ?? ''} onChange={(e) => setActiveWorkspace(e.target.value)}>
      {(availableWorkspaces ?? []).map((w) => (
        <option key={w.slug} value={w.slug}>{w.name}</option>
      ))}
    </select>
  )
}`}</CodeBlock>

      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>workspaces</C>, 'Owned workspaces query'],
          [<C>availableWorkspaces</C>, <>/workspaces/available — registered as a workspace-<B>unscoped</B> exception by default</>],
          [<C>getWorkspace(id)</C>, 'Single workspace (mutation-style; caches the detail)'],
          [<C>createWorkspace(formData)</C>, 'Multipart create'],
          [<C>updateWorkspace(id, payload) / deleteWorkspace(id)</C>, 'Mutations'],
          [<C>useGetWorkspace(id)</C>, 'Direct standalone query (usable outside the provider lists)'],
        ]}
      />
      <p>
        Endpoint defaults: <C>/workspaces</C>, <C>/workspaces/available</C> (module key{' '}
        <C>workspaces</C>).
      </p>

      <Tip>
        The playground's <C>TenantSwitcher</C> combines <C>availableWorkspaces</C> with{' '}
        <C>setActiveWorkspace(slug)</C> from <C>@msflib/core</C> and <C>me.workspaces</C>{' '}
        from <C>useAuth()</C> — that trio is the canonical tenant-switching UX.
      </Tip>

      <H2>Multi-tenancy decorators</H2>
      <CodeBlock lang="ts">{`import { workspaceHookDecorator, PathBasedDecorator, HeaderBasedDecorator } from '@msflib/react-workspace'

configureApplication({
  apiClientDecorator: workspaceHookDecorator('path'), // or 'header'
})`}</CodeBlock>
      <ul>
        <li>
          <B><C>workspaceHookDecorator(strategy: 'path' | 'header' = 'path')</C></B> —
          composes with any existing decorator; wire it into{' '}
          <C>configureApplication({'{ apiClientDecorator })'}</C>.
        </li>
        <li>
          <B><C>PathBasedDecorator</C></B> — prepends <C>/&lt;workspace&gt;</C> to request
          paths when <C>isWorkspaceScopedEndpoint(path)</C> and no prefix exists yet.
        </li>
        <li>
          <B><C>HeaderBasedDecorator</C></B> — sets the workspace header (name from{' '}
          <C>wsHeaderName</C>, default <C>X-Workspace</C>) with the active workspace slug.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. A tenant switcher from available workspaces</H3>
      <p>
        The core UX: list <C>availableWorkspaces</C>, write the selected slug with{' '}
        <C>setActiveWorkspace</C>, and let <C>useSyncExternalStore</C>-based consumers and
        workspace-scoped query keys follow. <C>availableWorkspaces</C> is fetched without
        a tenant prefix (registered unscoped), so it works before a workspace is chosen.
      </p>
      <CodeBlock lang="tsx">{`import { WorkspaceProvider, useWorkspace, type Workspace } from '@msflib/react-workspace'
import { useActiveWorkspace } from '@msflib/react-shared'
import { setActiveWorkspace } from '@msflib/core'

export function TenantSwitcher() {
  return (
    <WorkspaceProvider options={{ requireAuth: true }}>
      <Switcher />
    </WorkspaceProvider>
  )
}

function Switcher() {
  const { availableWorkspaces, loading } = useWorkspace()
  const active = useActiveWorkspace()

  return (
    <select
      value={active ?? ''}
      disabled={loading.availableWorkspaces}
      onChange={(e) => setActiveWorkspace(e.target.value || null)}
    >
      <option value="">No workspace</option>
      {availableWorkspaces.map((w: Workspace) => (
        <option key={w.slug} value={w.slug}>
          {w.label || w.name}
        </option>
      ))}
    </select>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: workspace admin with FormData create/update</H3>
      <p>
        Create and update are <B>multipart</B> — build a <C>FormData</C> with the logo file
        plus regular fields, exactly as <C>WorkspaceFormPayload = FormData</C> demands. The
        provider's mutations already invalidate the list and available queries; user{' '}
        <C>onSuccess</C>/<C>onError</C> options are forwarded through{' '}
        <C>createCallbackHandler</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { WorkspaceProvider, useWorkspace } from '@msflib/react-workspace'

export function WorkspaceAdmin() {
  return (
    <WorkspaceProvider>
      <Admin />
    </WorkspaceProvider>
  )
}

function Admin() {
  const { workspaces, createWorkspace, updateWorkspace, deleteWorkspace, loading } = useWorkspace()
  const [error, setError] = useState<string | null>(null)

  const onCreate = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    const form = new FormData(formEvent.currentTarget)
    const file = form.get('logo')
    const fd = new FormData()
    fd.append('name', String(form.get('name') ?? ''))
    fd.append('label', String(form.get('label') ?? ''))
    if (file instanceof File && file.size > 0) fd.append('logo', file)

    try {
      await createWorkspace(fd, { onSuccess: (w) => console.log('created', w.slug) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    }
  }

  const onRename = (id: number, label: string) => {
    const fd = new FormData()
    fd.append('label', label)
    void updateWorkspace(id, fd)
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}

      <ul>
        {workspaces.map((w) => (
          <li key={w.id}>
            {w.logo_url && <img src={w.logo_url} width={24} height={24} alt="" />}
            {w.label || w.name} · {w.status} {/* 'locked' | 'readonly' | 'restricted' | 'open' */}
            <button onClick={() => onRename(w.id, \`\${w.label} (edited)\`)} disabled={loading.update}>
              Rename
            </button>
            <button onClick={() => deleteWorkspace(w.id)} disabled={loading.delete}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={onCreate}>
        <input name="name" placeholder="name" required />
        <input name="label" placeholder="display label" />
        <input name="logo" type="file" accept="image/*" />
        <button disabled={loading.create}>{loading.create ? 'Creating…' : 'Create workspace'}</button>
      </form>
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: choosing the tenancy strategy at boot</H3>
      <p>
        The playground resolves its strategy from env: <C>'path'</C> (rewrite the URL
        prefix) or <C>'header'</C> (send the slug in <C>wsHeaderName</C>). The decorator is
        a factory over the client's own decorator, so custom tracing/auth decorators
        compose with tenancy in a defined order. Path-based rewriting only touches URLs
        that start with the configured <C>baseURL</C>.
      </p>
      <CodeBlock lang="ts">{`// lib/msflib.config.ts — the playground's real bootstrap (condensed)
import { configureApplication } from '@msflib/core'
import { workspaceHookDecorator } from '@msflib/react-workspace'

export type MsfTenancyStrategy = 'path' | 'header'

export function initMsflib(strategy: MsfTenancyStrategy = 'path') {
  configureApplication({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.msflib.com/v1',
    accessTokenKey: 'msflib_token',
    workspace: process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE?.trim() || 'demo',
    wsHeaderName: 'X-Workspace', // used by the header strategy
    apiClientDecorator: workspaceHookDecorator(strategy),
  })
}

// header strategy at a glance:
//   init.headers['X-Workspace'] = getActiveWorkspace()
// path strategy at a glance:
//   GET /tasks → GET /{workspace}/tasks   (only for registered scoped paths)`}</CodeBlock>

      <H3>4. Detail view with useGetWorkspace + status badges</H3>
      <p>
        <C>useGetWorkspace(id)</C> is a standalone <C>useQuery</C> that works without the
        provider (it builds its own unscoped API instance and caches under the workspace
        detail key). Render a settings page from it and branch on{' '}
        <C>Workspace.status</C>, which the backend types as{' '}
        <C>'locked' | 'readonly' | 'restricted' | 'open'</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useGetWorkspace } from '@msflib/react-workspace'

export function WorkspaceSettings({ id }: { id?: number }) {
  const { data: workspace, isPending, error } = useGetWorkspace(id)

  if (!id) return <p>Pick a workspace.</p>
  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>

  return (
    <article>
      <h1>{workspace?.label || workspace?.name}</h1>
      <p>{workspace?.description}</p>
      <p>
        Status: {workspace?.status}
        {workspace?.status !== 'open' && (
          <strong> — this workspace is {workspace?.status}</strong>
        )}
      </p>
      {workspace?.is_default && <span>Default workspace</span>}
      {workspace?.registration_link && (
        <a href={workspace.registration_link}>Invite link</a>
      )}
      <dl>
        <dt>Starts</dt><dd>{workspace?.start_date}</dd>
        <dt>Ends</dt><dd>{workspace?.end_date}</dd>
      </dl>
    </article>
  )
}`}</CodeBlock>

      <Note>
        Single fetches, updates and deletes pass <C>{'{ matchPath: \'/workspaces\' }'}</C>
        so their sub-paths inherit the parent's scope registration — that's how{' '}
        <C>/workspaces/42</C> gets the tenant prefix without being registered explicitly.
      </Note>

      <Warning>
        With the path strategy, an empty active workspace means requests go out unscoped —
        every module's queries still run. Gate protected routes on{' '}
        <C>useActiveWorkspace() !== null</C> when your API requires a tenant.
      </Warning>
    </>
  )
}
