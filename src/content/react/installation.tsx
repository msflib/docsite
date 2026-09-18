import { B, C, CodeBlock, H2, Note, Table, H3 } from '../../components/md'

export default function ReactInstallation() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        This page takes an app from zero to a working MSFLib stack: registry access,
        peer-dependency choices, the one-time <C>configureApplication</C> call, provider
        wiring and the styling prerequisites of the UI kit. Every step shows copy-pasteable
        code; the module-key list in step 3 is the map for customizing any module's
        endpoints later.
      </p>

      <H2>1. Registry access</H2>
      <p>
        All <C>@msflib/*</C> packages publish to <B>GitHub Packages</B> (access is
        restricted). Add an <C>.npmrc</C> to your project:
      </p>
      <CodeBlock lang="ini">{`@msflib:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN`}</CodeBlock>
      <p>Install what you need — packages are standalone:</p>
      <CodeBlock lang="bash">{`npm install @msflib/core @msflib/react-auth @msflib/react-components`}</CodeBlock>

      <H2>2. Peer dependencies</H2>
      <Table
        head={['Requirement', 'Applies to']}
        rows={[
          [<C>react / react-dom ^18 || ^19</C>, 'all packages'],
          [<C>@tanstack/react-query ^5</C>, 'all data modules'],
          [<C>@msflib/core + @msflib/react-shared</C>, 'all data modules (peers)'],
          [<C>react-hook-form ^7</C>, <><C>@msflib/react-components</C> only</>],
        ]}
      />

      <Note>
        Most data packages also declare a runtime dependency on{' '}
        <B><C>@msflib/typescript</C></B> (published separately from this repo) — it provides{' '}
        <C>createApiClient</C> and friends and must be resolvable from your registry.
      </Note>

      <H2>3. Configure the application core</H2>
      <p>
        <C>configureApplication</C> is <B>idempotent — call it once</B> before rendering. It
        throws if <C>baseURL</C> or <C>accessTokenKey</C> is missing.
      </p>
      <CodeBlock lang="ts">{`import { configureApplication } from '@msflib/core'
import { workspaceHookDecorator } from '@msflib/react-workspace'

const multiTenant = { enabled: true, strategy: 'path' as const }

configureApplication({
  // required
  baseURL: import.meta.env.VITE_API_URL ?? 'https://api.msflib.com/v1',
  accessTokenKey: 'msflib_token',
  // optional
  workspace: multiTenant.enabled ? 'acme' : undefined,
  endpoints: {
    auth: { login: '/login', register: '/open', me: '/me' },
    profile: { profile: '/profile' },
    // …one key per module: notification, workspaces, users, …
  },
  // multi-tenancy: prefix paths or set a header automatically
  apiClientDecorator: multiTenant.enabled
    ? workspaceHookDecorator(multiTenant.strategy) // 'path' | 'header'
    : undefined,
})`}</CodeBlock>
      <p>
        <C>endpoints</C> entries override each module's <C>DEFAULT_ENDPOINTS</C> — the
        module keys are <C>auth</C>, <C>notification</C>, <C>profile</C>, <C>workspaces</C>,{' '}
        <C>support</C>, <C>certificate</C>, <C>users</C>, <C>categories</C>, <C>tasks</C>,{' '}
        <C>students</C>, <C>trainers</C>, <C>courses</C>, <C>documents</C>,{' '}
        <C>drivelink</C>, <C>ai</C>.
      </p>

      <H2>Examples</H2>

      <H3>4. Wire providers</H3>
      <p>
        Providers must be <B>inside <C>QueryClientProvider</C></B>; in Next.js App Router
        they must be client components (<C>'use client'</C>).
      </p>
      <CodeBlock lang="tsx">{`'use client'
// app/Providers.tsx (Next.js) — mirrors apps/playground
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@msflib/react-auth'
import { WorkspaceProvider, workspaceHookDecorator } from '@msflib/react-workspace'
import { configureApplication } from '@msflib/core'

export function Providers({ children }) {
  const [ready, setReady] = useState(false)
  const [client] = useState(() => new QueryClient())

  useEffect(() => {
    configureApplication({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.msflib.com/v1',
      accessTokenKey: 'msflib_token',
      apiClientDecorator: workspaceHookDecorator('path'),
    })
    setReady(true)
  }, [])

  if (!ready) return null
  return (
    <QueryClientProvider client={client}>
      <AuthProvider options={{ isWorkspaceScoped: false }}>
        <WorkspaceProvider options={{ requireAuth: true }}>{children}</WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}`}</CodeBlock>

      <H3>5. Styling prerequisites for react-components</H3>
      <p>
        <C>@msflib/react-components</C> is MUI v9 + Emotion, but several components
        (skeletons, <C>GoogleAuthButton</C>, <C>DraggableList</C> wrappers) hard-code{' '}
        <B>Tailwind</B> utility classes — have Tailwind configured in the host app or those
        pieces render unstyled. No CSS file ships in <C>dist</C>.
      </p>

      <H2>Version pinning tip</H2>
      <p>
        All packages release in lockstep via changesets (one changeset lists every module).
        Pin matching <C>0.0.x</C> versions across data modules to avoid drift.
      </p>
    </>
  )
}
