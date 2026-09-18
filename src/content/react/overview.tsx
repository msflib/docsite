import { A, B, C, CodeBlock, H2, Table, H3 } from '../../components/md'

export default function ReactOverview() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <B>msflib-react</B> is a pnpm monorepo of standalone React modules published to
        GitHub Packages. Every package is scoped <C>@msflib/*</C>, versioned independently
        (currently <C>0.0.x</C>), built with <B>tsup</B> (ESM + CJS + <C>.d.ts</C>), and
        consumed by apps through a shared configuration core.
      </p>

      <H2>Package families</H2>
      <Table
        head={['Family', 'Packages', 'What they share']}
        rows={[
          [
            <B>Core & utilities</B>,
            <C>@msflib/core</C>, <C>@msflib/react-shared</C>, <C>@msflib/react-ux</C>, <C>@msflib/testing</C>,
            'Framework-agnostic — no MUI, no react-query',
          ],
          [
            <B>UI components</B>,
            <C>@msflib/react-components</C>,
            'MUI v9 + react-hook-form based component kit',
          ],
          [
            <B>Data modules</B>,
            <>react-auth, react-notification, react-profile, react-workspace, react-support, react-certificate, react-users, react-categories, react-tasks, react-students, react-trainers, react-courses, react-documents, react-drivelink, react-ai</>,
            'TanStack Query v5 + @msflib/core + provider/hook pattern',
          ],
        ]}
      />
      <p>
        All packages require <B>React ^18 || ^19</B>. Data modules additionally require{' '}
        <C>@tanstack/react-query ^5</C> and <C>@msflib/core</C> +{' '}
        <C>@msflib/react-shared</C> as peers.
      </p>

      <H2>Examples</H2>

      <H3>The one-minute mental model</H3>
      <ol>
        <li>
          Configure once, app-wide, with <C>configureApplication({'{...})'}</C> from{' '}
          <C>@msflib/core</C>.
        </li>
        <li>
          Wrap your tree in <C>QueryClientProvider</C> and the providers you need
          (<C>AuthProvider</C>, <C>WorkspaceProvider</C>, …).
        </li>
        <li>
          Consume state and mutations with the matching hooks (<C>useAuth</C>,{' '}
          <C>useProfile</C>, …).
        </li>
        <li>
          Customize every module's endpoints through{' '}
          <C>configureApplication({'{ endpoints: { auth: {...} } })'}</C>.
        </li>
      </ol>

      <CodeBlock lang="tsx">{`import { configureApplication } from '@msflib/core'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@msflib/react-auth'

configureApplication({
  baseURL: 'https://api.example.com/v1',
  accessTokenKey: 'msflib_token',
  endpoints: {
    auth: { login: '/login', register: '/open' },
  },
})

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider options={{ isWorkspaceScoped: false }}>
        <Session />
      </AuthProvider>
    </QueryClientProvider>
  )
}

function Session() {
  const { status, me } = useAuth()
  return <span>{status === 'authenticated' ? me?.email : 'Signed out'}</span>
}`}</CodeBlock>

      <H3>What's in the repo</H3>
      <ul>
        <li>
          <C>packages/*</C> — the publishable packages (one folder per <C>@msflib/*</C>{' '}
          package).
        </li>
        <li>
          <C>apps/playground</C> — a Next.js 16 demo + internal docs app wiring providers,
          FormBuilder login, tenant switcher and more.
        </li>
        <li>
          <C>configs/</C> — shared TypeScript base config (strict, ES2020,{' '}
          <C>moduleResolution: Bundler</C>).
        </li>
        <li>
          <C>scripts/</C> — module scaffolding (<C>gen-module.mjs</C>) and pack-to-tarball
          helpers.
        </li>
        <li>
          Changesets manage versions and releases (access: restricted, base branch:{' '}
          <C>dev</C>).
        </li>
      </ul>
    </>
  )
}
