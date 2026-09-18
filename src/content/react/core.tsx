import { A, B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function ReactCore() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/core</C> (v0.0.7) is the framework-agnostic foundation every other
        package builds on: app configuration, storage helpers, the configured API client and
        the workspace (multi-tenancy) runtime. No React inside.
      </p>
      <p>
        The problem it solves is <B>application bootstrap without duplication</B>. In a
        typical msflib app you have one backend, one auth token and (often) one active
        tenant, yet a dozen data modules (<C>@msflib/react-auth</C>,{' '}
        <C>@msflib/react-tasks</C>, …) each need to make HTTP calls. Instead of every module
        taking its own base URL, token store and tenancy rules, they all call{' '}
        <C>configuredApiClient()</C>, which reads a single module-level singleton created by{' '}
        <C>configureApplication()</C> — once, at startup — and shared everywhere.
      </p>
      <p>
        How it works: <C>configureApplication({'{ baseURL, accessTokenKey, ... }'})</C>{' '}
        stores an <C>ApplicationConfig</C> in memory. <C>configuredApiClient()</C> builds
        fetch clients from <C>@msflib/typescript</C>'s <C>createApiClient</C> where the
        access token is pulled from <C>storage</C> (localStorage, or any{' '}
        <C>StorageLike</C> adapter) via <C>accessTokenKey</C>, and where{' '}
        <C>apiClientDecorator</C> can rewrite every request before it leaves and every
        response after it returns. Every request passes through{' '}
        <C>resolveWorkspaceScopedEndpoint()</C>, which maintains a registry of
        workspace-scoped and explicitly unscoped endpoint paths that the tenant decorators
        (see <A to="/react/react-workspace">react-workspace</A>) consult at request time.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>One place to configure the API</B> — base URL, token key, endpoint overrides
          and the client decorator are set once and consumed by every <C>@msflib/react-*</C>
          module.
        </li>
        <li>
          <B>Multi-tenancy plumbing</B> — the workspace singleton (<C>setActiveWorkspace</C>,{' '}
          <C>getActiveWorkspace</C>, <C>subscribeActiveWorkspace</C>) plus the scoped-path
          registry drive path-prefix or header tenant strategies.
        </li>
        <li>
          <B>Direct HTTP access with the same rules</B> — call <C>apiClient</C>,{' '}
          <C>loginClient</C> or <C>apiFormDataClient</C> for custom endpoints and still get
          token injection, tenant scoping and error dispatch.
        </li>
        <li>
          <B>Testable storage</B> — <C>createStorage(adapter)</C> swaps localStorage for any{' '}
          <C>StorageLike</C> implementation (session storage, in-memory, React Native).
        </li>
      </ul>

      <H2>Installation</H2>
      <CodeBlock lang="bash">{`npm install @msflib/core`}</CodeBlock>
      <p>
        Subpath exports: <C>@msflib/core</C> (root), <C>./storage</C>, <C>./types</C>,{' '}
        <C>./core</C>, <C>./utils</C>.
      </p>

      <H2>configureApplication</H2>
      <CodeBlock lang="ts">{`import { configureApplication, getApplicationConfig, getApplicationEndpoints } from '@msflib/core'

configureApplication({
  baseURL: 'https://api.msflib.com/v1',    // required
  accessTokenKey: 'msflib_token',          // required — storage key holding the bearer token
  workspace: 'acme',                       // optional initial active workspace
  endpoints: { auth: { login: '/login' } }, // optional per-module overrides
  wsHeaderName: 'X-Workspace',             // optional header name for header-based scoping
  apiClientDecorator: myDecorator,         // optional ApiClientDecoratorFactory
})`}</CodeBlock>
      <ul>
        <li>
          <B>Idempotent</B>: subsequent calls are silently ignored — configure once at
          startup.
        </li>
        <li>Throws if <C>baseURL</C> or <C>accessTokenKey</C> is missing.</li>
        <li>
          <C>getApplicationConfig()</C> / <C>getApplicationEndpoints()</C> read the state
          back.
        </li>
      </ul>

      <H2>HTTP client</H2>
      <CodeBlock lang="ts">{`import { configuredApiClient } from '@msflib/core'

const { apiClient, loginClient, apiFormDataClient } = configuredApiClient()

// JSON requests — every endpoint goes through workspace scoping resolution
const user = await apiClient('GET', '/users/42')
await apiClient('POST', '/users', { name: 'Ada' })

// form-encoded login
await loginClient('/login', { username: 'ada', password: 's3cret' })

// multipart uploads
await apiFormDataClient('POST', '/profile/avatar', formData)`}</CodeBlock>
      <ul>
        <li>
          The token is read from <C>storage</C> using <C>accessTokenKey</C> on every
          request.
        </li>
        <li>
          Errors are dispatched as browser <C>CustomEvent</C>s via{' '}
          <C>dispatchBrowserEvent</C> (<C>ClientErrorDispatch</C>) — pass a custom{' '}
          <C>errorEmitter</C> to change that.
        </li>
        <li>
          <C>loginClient</C> and <C>apiFormDataClient</C> set the correct content types for
          you.
        </li>
      </ul>

      <H2>Workspace runtime</H2>
      <CodeBlock lang="ts">{`import {
  setActiveWorkspace,
  getActiveWorkspace,
  subscribeActiveWorkspace,
  isWorkspaceScopedEndpoint,
} from '@msflib/core'

setActiveWorkspace('acme')        // normalizes (trim; '' → null), notifies listeners
const ws = getActiveWorkspace()   // 'acme' | null
const unsubscribe = subscribeActiveWorkspace((ws) => console.log('now', ws))`}</CodeBlock>
      <p>Endpoint scoping registry:</p>
      <Table
        head={['Function', 'Purpose']}
        rows={[
          [<C>addWorkspaceScopedEndpoint(s)</C>, 'Register paths that should be prefixed with the workspace'],
          [<C>addWorkspaceUnscopedEndpoint(s)</C>, <>Exceptions that must never be prefixed (e.g. <C>/workspaces/available</C> under <C>/workspaces</C>)</>],
          [<C>isWorkspaceScopedEndpoint(path)</C>, 'Check with scope + exception awareness'],
          [<C>resolveWorkspaceScopedEndpoint(endpoint, opts)</C>, 'The resolver every request passes through'],
          [<C>removeWorkspaceScopedEndpoint / clearWorkspaceScopedEndpoints</C>, 'Registry management'],
          [<C>resetApplicationConfig()</C>, 'Test helper — wipes config & registry'],
        ]}
      />

      <H2>Storage</H2>
      <CodeBlock lang="ts">{`import { storage, createStorage } from '@msflib/core'

storage.getItem('msflib_token')   // SSR-safe: returns null when 'window' is undefined
storage.setItem('k', 'v')
storage.removeItem('k')
const custom = createStorage(myStorageLike) // swap in any StorageLike`}</CodeBlock>

      <H2>Types</H2>
      <p>
        <C>ApplicationConfig</C>, <C>ApiClientDecoratorFactory</C>,{' '}
        <C>ClientErrorDispatch</C> and friends are exported from the root — see{' '}
        <C>src/types/config.types.ts</C> in the package for the exact shapes.
      </p>

      <H2>Examples</H2>

      <H3>1. Bootstrap a single-tenant app</H3>
      <p>
        The minimal setup every msflib app needs: configure once before any provider mounts
        (the playground does this inside a <C>useEffect</C> that gates rendering until{' '}
        <C>initMsflib()</C> has run), then verify the state readback.
      </p>
      <CodeBlock lang="ts">{`import { configureApplication, getApplicationConfig } from '@msflib/core'

export function initMsflib() {
  configureApplication({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.msflib.com/v1',
    accessTokenKey: 'msflib_token',
    workspace: process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE?.trim() || 'demo',
  })
}

// later — anywhere in the app
const cfg = getApplicationConfig()
cfg.baseURL            // 'https://api.msflib.com/v1'
cfg.accessTokenKey     // 'msflib_token'`}</CodeBlock>

      <H3>2. Client variants: JSON, login, multipart and query strings</H3>
      <p>
        <C>configuredApiClient</C> returns three clients. <C>apiClient</C> accepts{' '}
        <C>RequestInit</C> options plus a <C>query</C> record (arrays become repeated
        params); <C>loginClient</C> posts <C>application/x-www-form-urlencoded</C> credentials
        without a token; <C>apiFormDataClient</C> streams <C>FormData</C>. A per-call{' '}
        <C>isWorkspaceScoped: false</C> opts an endpoint out of tenant scoping and records it
        in the unscoped registry.
      </p>
      <CodeBlock lang="ts">{`import { configuredApiClient } from '@msflib/core'

const { apiClient, loginClient, apiFormDataClient } = configuredApiClient({
  isWorkspaceScoped: true,
})

// GET with query params → GET /tasks?offset=0&limit=20
const page = await apiClient('GET', '/tasks', null, { query: { offset: 0, limit: 20 } })

// custom errorEmitter instead of window CustomEvents
import { dispatchBrowserEvent } from '@msflib/core'
const { apiClient: audited } = configuredApiClient({ errorEmitter: dispatchBrowserEvent })

// one-off unscoped call (never gets the /workspace prefix)
const publicCourses = await apiClient('GET', '/courses/search', null, {
  isWorkspaceScoped: false,
})

// multipart upload with a progress-free body
const fd = new FormData()
fd.append('file', file)
const saved = await apiFormDataClient('PUT', '/profile/avatar', fd, {
  matchPath: '/profile', // register /profile so tenant scoping matches the parent path
})`}</CodeBlock>

      <H3>3. Workspace registry: scoped defaults and unscoped exceptions</H3>
      <p>
        A realistic multi-tenant setup: tenant switching happens at runtime via{' '}
        <C>setActiveWorkspace</C>, most endpoints are workspace-scoped, but{' '}
        <C>/workspaces/available</C> and <C>/users/join</C> must stay unscoped. Note that{' '}
        <C>configureApplication</C> is idempotent, so <C>resetApplicationConfig()</C> is
        needed between test runs (or HMR) before re-configuring.
      </p>
      <CodeBlock lang="ts">{`import {
  configureApplication,
  setActiveWorkspace,
  getActiveWorkspace,
  addWorkspaceScopedEndpoints,
  addWorkspaceUnscopedEndpoints,
  isWorkspaceScopedEndpoint,
  subscribeActiveWorkspace,
} from '@msflib/core'

configureApplication({
  baseURL: 'https://api.msflib.com/v1',
  accessTokenKey: 'msflib_token',
  workspace: 'acme',
  endpoints: {
    auth: { login: '/login', me: '/me' },
    workspaces: { workspaces: '/workspaces', available: '/workspaces/available' },
  },
  wsHeaderName: 'X-Workspace',
})

// seed the registry (each @msflib/react-* module also registers its own paths
// automatically the first time an API factory runs)
addWorkspaceScopedEndpoints(['/tasks', '/students', '/courses', '/notifications'])
addWorkspaceUnscopedEndpoints(['/workspaces/available', '/users/join', '/users/switch'])

isWorkspaceScopedEndpoint('/tasks')                 // true
isWorkspaceScopedEndpoint('/workspaces/available')  // false — explicit exception

// tenant switch: notifies every subscriber (providers, decorators) synchronously
const unsubscribe = subscribeActiveWorkspace(() => {
  console.log('tenant changed →', getActiveWorkspace())
})
setActiveWorkspace('globex')`}</CodeBlock>

      <H3>4. A custom apiClientDecorator (tracing + error hook)</H3>
      <p>
        <C>apiClientDecorator</C> is an <B>extension point</B>, not just a hook: it is a
        factory receiving the client's own decorator and returning one to compose with it.
        Here we add a trace id to every request and log API errors — the same composition
        pattern <C>workspaceHookDecorator</C> uses internally.
      </p>
      <CodeBlock lang="ts">{`import { configureApplication } from '@msflib/core'
import type { ApiClientDecoratorFactory } from '@msflib/core'

const tracingDecorator: ApiClientDecoratorFactory = (client) => ({
  preRequest: ({ input, init }) => {
    init.headers = { ...(init.headers ?? {}), 'x-trace-id': crypto.randomUUID() }
    client.preRequest?.({ input, init })
  },
  postRequest: (ctx) => {
    if (!ctx.response.ok) console.error('API error', ctx.response.status, ctx.input)
    return client.postRequest?.(ctx) ?? ctx.response
  },
})

configureApplication({
  baseURL: 'https://api.msflib.com/v1',
  accessTokenKey: 'msflib_token',
  apiClientDecorator: tracingDecorator,
})`}</CodeBlock>

      <Note>
        <C>configuredApiClient(defaultApiOptions)</C> also accepts <C>isWorkspaceScoped</C>
        as a default for every call it makes — this is exactly how each data module's{' '}
        <C>createXApi(isWorkspaceScoped)</C> factory passes its provider option down.
      </Note>

      <Warning title="README drift">
        The package README documents a <C>buildWorkspacePath()</C> helper that <B>no longer
        exists</B> — path resolution happens inside <C>configuredApiClient</C> via{' '}
        <C>resolveWorkspaceScopedEndpoint</C>.
      </Warning>
    </>
  )
}
