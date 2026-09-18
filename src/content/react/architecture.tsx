import { B, C, CodeBlock, H2, H3 } from '../../components/md'

export default function ReactArchitecture() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        Understanding msflib-react is mostly understanding one repeating pattern: fifteen
        data modules that share the same folder layout, the same provider/hook contract and
        the same tenancy mechanics. This page maps the workspace, dissects that pattern, and
        explains how workspace scoping threads through every HTTP request — the background
        you need before the per-module pages make full sense.
      </p>

      <H2>Workspace layout</H2>
      <CodeBlock lang="text">{`msflib-react/
├─ packages/
│  ├─ core/               # @msflib/core — config, storage, API client, tenancy
│  ├─ react-shared/       # @msflib/react-shared — shared React utilities
│  ├─ react-ux/           # @msflib/react-ux — UI-agnostic interaction utilities
│  ├─ react-components/   # @msflib/react-components — MUI UI kit
│  ├─ react-auth/         # …one folder per data module
│  └─ …
├─ apps/playground/       # Next.js demo + internal docs
├─ configs/               # tsconfig.base.json (strict, Bundler resolution)
└─ scripts/               # gen-module.mjs scaffolder, pack helpers`}</CodeBlock>
      <p>
        Builds use <B>tsup</B> (<C>--format esm,cjs --dts</C>); data modules call it from a
        package script, <C>react-components</C>/<C>react-ux</C>/<C>testing</C> use a{' '}
        <C>tsup.config.ts</C>. Versions move via Changesets from the <C>dev</C> branch.
      </p>

      <H2>The data-module pattern (15 packages)</H2>
      <p>
        Every data module has the same five-folder source layout and the same architecture —
        learn one and you know them all:
      </p>
      <CodeBlock lang="text">{`src/
├─ api/       # createXApi() factory + DEFAULT_ENDPOINTS
├─ context/   # XProvider + context definition
├─ hooks/     # useX() consumer hook
├─ types/     # payload/result types
└─ utils/     # queryKeys etc.`}</CodeBlock>
      <ol>
        <li>
          <B><C>createXApi(isWorkspaceScoped = true)</C></B> reads{' '}
          <C>getApplicationConfig()</C> and builds API methods on top of{' '}
          <C>configuredApiClient()</C> — the tenant scoping decision happens here.
        </li>
        <li>
          <B><C>XProvider</C></B> wires each API method into{' '}
          <C>useMutation</C>/<C>useQuery</C> and exposes a typed context. User callbacks
          flow through <C>createCallbackHandler</C> so <C>onSuccess</C>/<C>onError</C> are
          always safe to pass.
        </li>
        <li>
          <B><C>useX()</C></B> throws <C>useX must be used inside &lt;XProvider /&gt;</C>{' '}
          outside the provider.
        </li>
        <li>
          <B><C>xQueryKeys</C></B> centralize cache keys for invalidation.
        </li>
        <li>
          Endpoint defaults are overridable per module via{' '}
          <C>configureApplication({'{ endpoints: { <module>: {...} } })'}</C>.
        </li>
      </ol>

      <H2>Workspace scoping</H2>
      <p>Multi-tenancy is path/header based, not query-key based:</p>
      <ul>
        <li>
          <C>@msflib/core</C> keeps a registry of workspace-scoped endpoints and an{' '}
          <C>activeWorkspace</C> singleton (<C>setActiveWorkspace</C> /{' '}
          <C>subscribeActiveWorkspace</C>).
        </li>
        <li>
          <C>configuredApiClient</C> routes <B>every</B> request through{' '}
          <C>resolveWorkspaceScopedEndpoint</C>, so scoping is self-registering.
        </li>
        <li>
          The decorator from <C>@msflib/react-workspace</C> —{' '}
          <C>workspaceHookDecorator('path' | 'header')</C> — either prepends{' '}
          <C>/&lt;workspace&gt;</C> to scoped paths or sets the workspace header
          (<C>wsHeaderName</C>, default <C>X-Workspace</C>).
        </li>
        <li>
          "Unscoped" endpoints (e.g. <C>/workspaces/available</C>) are registered
          exceptions that never get prefixed.
        </li>
      </ul>
      <p>
        Auth endpoints like <C>/login</C>, <C>/register</C> and SSO paths must be created{' '}
        <B>unscoped</B> — the playground does this via{' '}
        <C>{'<AuthProvider options={{ isWorkspaceScoped: false }} />'}</C> (which internally
        builds its API with <C>createAuthApi(false)</C>).
      </p>

      <H2>Examples</H2>

      <H3>1. Tenancy end-to-end in three steps</H3>
      <p>
        The whole multi-tenant story in one snippet: pick a strategy once, switch tenants
        anywhere, and every scoped request follows automatically:
      </p>
      <CodeBlock lang="ts">{`// 1 — configure once at startup
configureApplication({
  baseURL: 'https://api.msflib.com/v1',
  accessTokenKey: 'msflib_token',
  apiClientDecorator: workspaceHookDecorator('path'),
})

// 2 — switch tenant from anywhere (e.g. a <TenantSwitcher />)
import { setActiveWorkspace } from '@msflib/core'
setActiveWorkspace('acme')

// 3 — every scoped call is now prefixed: GET /acme/notifications
const { apiClient } = configuredApiClient()
await apiClient('GET', '/notifications')`}</CodeBlock>

      <H3>2. Testing a module with the shared factories</H3>
      <p>
        A data-module test using <C>@msflib/testing</C> — hoisted mocks keep the module's
        storage/config/api seams isolated:
      </p>
      <CodeBlock lang="ts">{`import { describe, expect, it, vi } from 'vitest'
import { createHoisedMocks } from '@msflib/testing'

const { storage, coreConfig, api } = vi.hoisted(() => createHoisedMocks())

vi.mock('@msflib/core', () => ({
  storage,
  getApplicationConfig: () => coreConfig,
  configuredApiClient: () => api,
}))

describe('profile module', () => {
  it('exposes the profile query through the provider', async () => {
    api.getProfile.mockResolvedValueOnce({ first_name: 'Ada' })
    // render <ProfileProvider><Probe /></ProfileProvider> and assert on profile
    expect(api.getProfile).toHaveBeenCalledTimes(1)
  })
})`}</CodeBlock>

      <H2>Testing story</H2>
      <ul>
        <li>
          Data modules + <C>react-ux</C> test with <B>Vitest v4</B>.
        </li>
        <li>
          <C>react-components</C> uses <B>Jest</B> plus <B>Storybook 10</B> (a11y/docs/vitest
          addons).
        </li>
        <li>
          <C>@msflib/testing</C> shares vitest config factories (
          <C>createJsdomConfig</C>, <C>createNodeConfig</C>) and hoisted mock factories
          (<C>createHoisedMocks</C>, <C>createMockStorage</C>, <C>createMockCoreConfig</C>).
        </li>
      </ul>
    </>
  )
}
