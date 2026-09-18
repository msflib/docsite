import { B, C, CodeBlock, H2, H3, Table } from '../../components/md'

export default function ReactTesting() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/testing</C> (v0.0.1) standardizes the test setup across the monorepo.
        Peer requirement: <B>Vitest ≥ 4</B>. Subpath exports: <C>./vitest-config</C>,{' '}
        <C>./test-setup</C>.
      </p>
      <p>
        Every msflib data module follows the same test recipe: jsdom (or node) Vitest
        config, a shared setup file that registers <C>@testing-library/jest-dom</C>{' '}
        matchers, and a set of mock factories for the two things every module touches — the
        core <C>storage</C> singleton and the application config read by every API factory
        via <C>getApplicationConfig()</C>. This package packages that recipe so modules
        don't copy-paste it.
      </p>
      <p>
        The mock factories are designed to be used inside <C>vi.hoisted()</C>, which runs
        before the module's own top-level <C>vi.mock</C> factory — that's why{' '}
        <C>createHoisedMocks</C> exists as one call returning{' '}
        <C>{'{ storage, coreConfig, api }'}</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>One-line Vitest config</B> in a jsdom or node package with the include glob
          and setup file already wired.
        </li>
        <li>
          <B>Consistent module mocks</B> — mock <C>@msflib/core</C> storage and config the
          same way in every package, so tests read the same.
        </li>
        <li>
          <B>jest-dom matchers</B> (<C>toBeInTheDocument()</C>…) available in every
          jsdom suite automatically.
        </li>
        <li>
          <B>API-mock scaffolding</B> — pre-declared <C>vi.fn()</C>s keyed by method name
          for a module's API factory.
        </li>
      </ul>

      <H2>Vitest config factories</H2>
      <CodeBlock lang="ts">{`// vitest.config.ts in a data module
import { createJsdomConfig } from '@msflib/testing/vitest-config'

export default createJsdomConfig({
  // optional overrides — merged into the base config
})`}</CodeBlock>
      <Table
        head={['Factory', 'Environment', 'Notes']}
        rows={[
          [<C>createJsdomConfig(overrides?)</C>, 'jsdom', 'Auto-adds the shared test-setup file and the src/test/**/*.test.ts?(x) include glob'],
          [<C>createNodeConfig(overrides?)</C>, 'node', 'For pure-logic packages'],
        ]}
      />

      <H2>Mock factories</H2>
      <CodeBlock lang="ts">{`import { vi } from 'vitest'
import { createHoisedMocks, createMockStorage, createMockCoreConfig } from '@msflib/testing'

const { storage, coreConfig, api } = vi.hoisted(() => createHoisedMocks())`}</CodeBlock>
      <Table
        head={['Export', 'Purpose']}
        rows={[
          [<C>createHoisedMocks({'{ apiMethods?, coreConfig? }'})</C>, <>Builds <C>{'{ storage, coreConfig, api }'}</C> mock objects safe to use inside <C>vi.hoisted()</C></>],
          [<C>createMockStorage()</C>, 'Standalone storage mock'],
          [<C>createMockCoreConfig()</C>, 'Standalone application-config mock'],
        ]}
      />

      <H2>Test setup</H2>
      <p>
        The <C>./test-setup</C> subpath imports <C>@testing-library/jest-dom/vitest</C> —
        the jsdom config wires it in automatically, giving you <C>toBeInTheDocument()</C>{' '}
        and friends in every package that uses the shared config.
      </p>

      <H2>Examples</H2>

      <H3>1. Wire up a new package's test suite</H3>
      <p>
        All a new data module needs is a <C>vitest.config.ts</C> using the jsdom factory
        and tests placed under <C>src/test</C> — the setup file, environment and include
        glob come from the shared package.
      </p>
      <CodeBlock lang="ts">{`// packages/react-widget/vitest.config.ts
import { createJsdomConfig } from '@msflib/testing/vitest-config'

export default createJsdomConfig()

// packages/react-widget/src/test/smoke.test.ts
import { describe, it, expect } from 'vitest'

describe('react-widget', () => {
  it('renders', () => {
    const el = document.createElement('div')
    expect(el).toBeInTheDocument() // jest-dom matcher, wired by the shared setup
  })
})`}</CodeBlock>

      <H3>2. Mock @msflib/core for a data-module unit test</H3>
      <p>
        The classic pattern: hoist the mocks, then alias <C>@msflib/core</C> so every API
        factory sees a mock config and storage. The <C>api</C> record gives you one{' '}
        <C>vi.fn()</C> per API method you'll assert against.
      </p>
      <CodeBlock lang="ts">{`import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createHoisedMocks } from '@msflib/testing'

const { storage, coreConfig, api } = vi.hoisted(() =>
  createHoisedMocks({
    apiMethods: ['login', 'me', 'logout'],
    coreConfig: { baseURL: 'https://api.test', accessTokenKey: 'test_token' },
  }),
)

vi.mock('@msflib/core', () => ({
  storage,
  getApplicationConfig: () => coreConfig,
  configuredApiClient: () => ({ apiClient: vi.fn(), loginClient: vi.fn() }),
}))

vi.mock('../api/auth.api', () => ({ createAuthApi: () => api }))

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores the access token on login success', async () => {
    api.login.mockResolvedValue({ access_token: 'jwt-123', token_type: 'bearer' })
    // render AuthProvider, call login(), then:
    // expect(storage.setItem).toHaveBeenCalledWith('test_token', 'jwt-123')
  })
})`}</CodeBlock>

      <H3>3. Pure-logic tests with the node config</H3>
      <p>
        Packages without DOM needs (utils, api factories, the workspace registry) use{' '}
        <C>createNodeConfig</C> — no setup file, faster startup, and the same include glob.
      </p>
      <CodeBlock lang="ts">{`// vitest.config.ts — node flavor for non-DOM logic
import { createNodeConfig } from '@msflib/testing/vitest-config'

export default createNodeConfig({
  test: {
    coverage: { provider: 'v8', reporter: ['text'] },
  },
})

// src/test/workspace.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  configureApplication,
  resetApplicationConfig,
  setActiveWorkspace,
  getActiveWorkspace,
} from '@msflib/core'

describe('workspace singleton', () => {
  beforeEach(() => {
    resetApplicationConfig() // wipe config + registry between tests
    configureApplication({ baseURL: 'https://api.test', accessTokenKey: 't' })
  })

  it('normalizes empty slugs to null', () => {
    setActiveWorkspace('   ')
    expect(getActiveWorkspace()).toBeNull()
  })

  it('notifies subscribers on change', () => {
    let calls = 0
    setActiveWorkspace('acme')
    const unsub = subscribeActiveWorkspace(() => calls++)
    setActiveWorkspace('acme')      // same value → no notification
    setActiveWorkspace('globex')    // changed → notification
    expect(calls).toBe(1)
    unsub()
  })
})`}</CodeBlock>
    </>
  )
}
