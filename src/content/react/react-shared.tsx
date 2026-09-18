import { B, C, CodeBlock, H2, H3, Table } from '../../components/md'

export default function ReactShared() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-shared</C> (v0.0.4) is deliberately tiny: two runtime exports and
        one type re-export, used by all data modules.
      </p>
      <p>
        Its job is to break the circular-dependency problem of a module family. Every
        feature provider (<C>AuthProvider</C>, <C>TasksProvider</C>, <C>ProfileProvider</C>…)
        needs two things: a reactive read of the active workspace from <C>@msflib/core</C>'s
        non-React singleton, and a safe way to forward caller-supplied{' '}
        <C>onSuccess</C>/<C>onError</C>/<C>onSettled</C> callbacks into TanStack Query's{' '}
        <C>mutateAsync</C>. Both live here so no data package has to depend on another data
        package.
      </p>
      <p>
        It has <B>no provider and no endpoints</B> — import it for the hook and the helper,
        not for wiring. Everything it reads is backed by{' '}
        <C>subscribeActiveWorkspace</C> / <C>getActiveWorkspace</C> from{' '}
        <C>@msflib/core</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Tenant-reactive UI</B> — any component that must re-render when{' '}
          <C>setActiveWorkspace()</C> fires, without a context provider or prop drilling.
        </li>
        <li>
          <B>Building your own provider</B> in the msflib style — wrap user{' '}
          <C>MutateOptions</C> with <C>createCallbackHandler</C> before{' '}
          <C>mutateAsync</C> so callbacks are always forwarded even when{' '}
          <C>options</C> is <C>undefined</C>.
        </li>
        <li>
          <B>The <C>MutateOptions</C> type</B> without adding a direct react-query
          dependency to your own module's public types.
        </li>
      </ul>

      <H2>useActiveWorkspace</H2>
      <CodeBlock lang="tsx">{`import { useActiveWorkspace } from '@msflib/react-shared'

function TenantBanner() {
  const workspace = useActiveWorkspace()
  return <span>Current tenant: {workspace ?? '—'}</span>
}`}</CodeBlock>
      <p>
        A <C>useSyncExternalStore</C> binding over <C>@msflib/core</C>'s workspace singleton
        — any <C>setActiveWorkspace()</C> anywhere in the app re-renders every consumer
        synchronously. No context, no prop drilling. This is what powers tenant switchers.
      </p>

      <H2>createCallbackHandler</H2>
      <CodeBlock lang="ts">{`import { createCallbackHandler } from '@msflib/react-shared'

const callbacks = createCallbackHandler({ onSuccess: (data) => toast('Saved!') })
await someMutation.mutateAsync(payload, callbacks)`}</CodeBlock>
      <p>
        Wraps TanStack Query's <C>MutateOptions</C> so <C>onSuccess</C> / <C>onError</C> /{' '}
        <C>onSettled</C> are always safely forwarded even when <C>options</C> is{' '}
        <C>undefined</C>. Every module provider runs user callbacks through this before
        calling <C>mutateAsync()</C>. You rarely import it yourself — but it's why you can
        pass <C>{'{ onSuccess }'}</C> to any <C>useX</C> mutation without guarding.
      </p>

      <H2>Types</H2>
      <p>
        Re-exports <C>MutateOptions</C> from <C>@tanstack/react-query</C> so consumers don't
        need to depend on react-query just for that type.
      </p>

      <H2>Examples</H2>

      <H3>1. A tenant-aware dashboard header</H3>
      <p>
        The canonical <C>useActiveWorkspace</C> consumer: show the current slug and a
        prompt when no workspace is active. Because the hook is a{' '}
        <C>useSyncExternalStore</C> over the core singleton, switching tenants from{' '}
        <C>setActiveWorkspace('globex')</C> re-renders this header instantly — even though
        no React state changed.
      </p>
      <CodeBlock lang="tsx">{`import { useActiveWorkspace } from '@msflib/react-shared'
import { setActiveWorkspace } from '@msflib/core'

function WorkspaceHeader() {
  const workspace = useActiveWorkspace()

  if (!workspace) {
    return (
      <button onClick={() => setActiveWorkspace('acme')}>
        Select a workspace to get started
      </button>
    )
  }

  return <h1>Acme LMS — workspace “{workspace}”</h1>
}`}</CodeBlock>

      <H3>2. Reacting to a tenant switch with effects</H3>
      <p>
        Combine the hook with <C>useEffect</C> to refetch per-tenant data that doesn't go
        through a workspace-scoped query key (e.g. your own plain react-query calls). The
        hook returns the slug itself, so it can be a dependency like any other value.
      </p>
      <CodeBlock lang="tsx">{`import { useEffect, useState } from 'react'
import { useActiveWorkspace } from '@msflib/react-shared'
import { configuredApiClient } from '@msflib/core'

const { apiClient } = configuredApiClient()

function TenantMetrics() {
  const workspace = useActiveWorkspace()
  const [revenue, setRevenue] = useState<number | null>(null)

  useEffect(() => {
    if (!workspace) return
    // resolve the workspace prefix by hand for a custom endpoint
    apiClient<{ total: number }>('GET', \`/\${workspace}/metrics/revenue\`)
      .then(setRevenue)
      .catch(() => setRevenue(null))
  }, [workspace])

  return <p>Revenue: {revenue ?? 'loading…'}</p>
}`}</CodeBlock>

      <H3>3. Building a custom provider in the msflib style</H3>
      <p>
        If you write your own data provider, mirror what every <C>@msflib/react-*</C>{' '}
        module does: resolve the workspace with <C>useActiveWorkspace()</C> for the query
        key, and route caller callbacks through <C>createCallbackHandler</C> so{' '}
        <C>undefined</C> options never break <C>mutateAsync</C>.
      </p>
      <CodeBlock lang="tsx">{`import React, { createContext, useContext, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCallbackHandler, useActiveWorkspace } from '@msflib/react-shared'
import type { MutateOptions } from '@msflib/react-shared'

type Board = { id: number; title: string }

function useBoardsApi() {
  const { apiClient } = configuredApiClient()
  return useMemo(
    () => ({
      list: () => apiClient<Board[]>('GET', '/boards'),
      create: (title: string) => apiClient<Board>('POST', '/boards', { title }),
    }),
    [],
  )
}

export function BoardsProvider({ children }: { children: React.ReactNode }) {
  const api = useBoardsApi()
  const workspace = useActiveWorkspace() // workspace-scoped cache key
  const queryClient = useQueryClient()
  const QUERY_KEY = [workspace ?? '__no_workspace__', 'boards'] as const

  const listQuery = useQuery({ queryKey: QUERY_KEY, queryFn: api.list, retry: false })

  const createMutation = useMutation({
    mutationFn: (title: string) => api.create(title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const createBoard = (
    title: string,
    options?: MutateOptions<Board, Error, string>,
  ) => createMutation.mutateAsync(title, createCallbackHandler(options))

  return (
    <BoardsContext.Provider value={{ boards: listQuery.data ?? [], createBoard }}>
      {children}
    </BoardsContext.Provider>
  )
}

const BoardsContext = createContext<{ boards: Board[]; createBoard: (
  title: string,
  options?: MutateOptions<Board, Error, string>,
) => Promise<Board> } | null>(null)

export function useBoards() {
  const ctx = useContext(BoardsContext)
  if (!ctx) throw new Error('useBoards must be used inside <BoardsProvider />')
  return ctx
}`}</CodeBlock>

      <Table
        head={['Export', 'Kind', 'Signature']}
        rows={[
          [<C>useActiveWorkspace</C>, 'hook', <C>() =&gt; string | null</C>],
          [<C>createCallbackHandler</C>, 'helper', <C>(options?: MutateOptions) =&gt; MutateOptions</C>],
          [<C>MutateOptions</C>, 'type', 're-export from @tanstack/react-query'],
        ]}
      />
    </>
  )
}
