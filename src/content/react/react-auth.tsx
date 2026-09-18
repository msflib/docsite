import { B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function ReactAuth() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-auth</C> (v0.0.19) is the reference implementation of the
        data-module pattern: an <C>AuthProvider</C>, a <C>useAuth()</C> hook with every
        auth flow, and endpoint defaults you can override globally.
      </p>
      <p>
        It solves the whole session lifecycle in one place: credentials and OTP login,
        registration, password recovery, two-step authentication, three flavors of SSO, and
        logout — each wired to TanStack Query mutations that persist the access token into
        <C> storage</C> (under your configured <C>accessTokenKey</C>), invalidate the{' '}
        <C>me</C> query, and expose per-operation <C>loading</C> flags. The <C>me</C>{' '}
        query only fires when a token exists in storage (or when{' '}
        <C>{'options.requireAuth'}</C> sees <C>isAuthenticated</C>), so a cold app with no
        session makes no auth request at all.
      </p>
      <p>
        Under the hood, <C>createAuthApi(isWorkspaceScoped)</C> builds its endpoints from{' '}
        <C>{'{...DEFAULT_ENDPOINTS, ...(cfg.endpoints.auth ?? {})}'}</C> and sends requests
        through <C>configuredApiClient</C> from <C>@msflib/core</C> — so token injection,
        error dispatch and tenancy behave exactly like every other module. <C>login</C>{' '}
        maps <C>{'{ email, password }'}</C> onto the backend's{' '}
        <C>{'{ username, password }'}</C> form client, and <C>ssoRedirect</C> posts{' '}
        <C>application/x-www-form-urlencoded</C> by hand because no generic client sends
        that content type.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A session you don't manage</B> — token storage, <C>me</C> caching, logout
          cleanup and <C>status</C> derivation are all handled by the provider.
        </li>
        <li>
          <B>Guarded routes</B> — derive <C>isAuthenticated = status === 'authenticated'</C>
          and pass it to nested providers' <C>{'{ requireAuth, isAuthenticated }'}</C>
          options to gate their queries.
        </li>
        <li>
          <B>Modern auth flows</B> — two-step OTP login (<C>authenticate</C> →{' '}
          <C>verifyOtp</C>), availability checks, password recovery with token
          verification, and SSO redirect/retrieve.
        </li>
        <li>
          <B>Override-ready endpoints</B> — every auth route can be remapped globally via{' '}
          <C>configureApplication({'{ endpoints: { auth } }'})</C> without touching the
          provider.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { AuthProvider } from '@msflib/react-auth'

<AuthProvider options={{ isWorkspaceScoped: false }}>
  <App />
</AuthProvider>`}</CodeBlock>

      <Warning title="Keep auth endpoints unscoped">
        Auth endpoints (<C>/login</C>, <C>/register</C>, SSO paths) must be{' '}
        <B>unscoped</B> — create the provider with{' '}
        <C>{'options={{ isWorkspaceScoped: false }}'}</C> (this builds the API with{' '}
        <C>createAuthApi(false)</C>), exactly as the playground does.
      </Warning>

      <H2>useAuth()</H2>
      <CodeBlock lang="tsx">{`const { login, loading } = useAuth()

const handleLogin = async (data) => {
  await login(data, {
    onSuccess: (user) => {
      setActiveWorkspace(user.account?.currentWorkspace?.slug || '')
      router.push('/dashboard')
    },
  })
}`}</CodeBlock>

      <H3>Session state</H3>
      <Table
        head={['Member', 'Type / behavior']}
        rows={[
          [<C>status</C>, <C>'loading' | 'authenticated' | 'unauthenticated'</C>],
          [<C>me</C>, <><C>Me | null</C> — cached with <C>staleTime: 60_000</C>, <C>retry: false</C></>, 'only fetched when a token exists (or requireAuth && isAuthenticated)'],
          [<C>loading</C>, <>Object of per-operation booleans: <C>loading.login</C>, <C>loading.register</C>, …, <C>loading.ssoRetrieve</C></>],
        ]}
      />

      <H3>Flows</H3>
      <Table
        head={['Member', 'Signature', 'Notes']}
        rows={[
          [<C>login(data, options?)</C>, <C>Promise&lt;AuthUser&gt;</C>, <>Posts via <C>loginClient</C> (maps <C>email → username</C>); stores <C>access_token</C>, invalidates <C>me</C></>],
          [<C>register(data, options?)</C>, <C>Promise&lt;RegisterResponse&gt;</C>, 'Invalidates me on success'],
          [<C>recoverPassword / verifyToken / resetPassword / resendCode</C>, <C>Promise&lt;{'{ msg }'}&gt;</C> / <C>{'{ sent }'}</C>, 'Password recovery chain'],
          [<C>verifyAvailability(data)</C>, <C>{'{ field, value }'}</C>, <>Pre-signup uniqueness check — <C>field</C> is <C>'email' | 'username' | 'phone'</C></>],
          [<C>authenticate(data) / verifyOtp(data)</C>, 'two-step OTP login', <><C>{'{ email, password }'}</C> → <C>{'{ code, email }'}</C>; <C>verifyOtp</C> stores the token</>],
          [<C>ssoLogin({'{ token }'}) / ssoRedirect / ssoRetrieve</C>, 'SSO handshake', <>ssoRedirect posts <C>application/x-www-form-urlencoded</C>; login/retrieve store the token</>],
          [<C>logout(options?)</C>, <C>DELETE /logout</C>, 'Removes token, clears me, invalidates'],
          [<C>updateMe(payload)</C>, <C>PUT /me</C>, 'Writes result into the query cache'],
        ]}
      />

      <H2>Endpoint defaults</H2>
      <p>
        All overridable via <C>configureApplication({'{ endpoints: { auth: {...} } })'}</C>:
      </p>
      <CodeBlock lang="ts">{`{
  login: '/login',
  register: '/open',
  recoverPassword: '/password-recovery',
  verifyToken: '/verify-token',
  resendCode: '/resend-code',
  resetPassword: '/reset-password',
  me: '/me',
  logout: '/logout',
  verifyAvailability: '/verify-availability',
  authenticate: '/authenticate',
  verifyOtp: '/verify-otp',
  ssoLogin: '/sso-login',
  ssoRedirect: '/sso-redirect',
  ssoRetrieve: '/sso-retrieve',
}`}</CodeBlock>
      <p>
        Query keys: <C>authQueryKeys.me()</C> = <C>['msflib', 'auth', 'me']</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. Login form wired to the provider (playground pattern)</H3>
      <p>
        This mirrors <C>apps/playground/app/(auth)/login/components/Login.tsx</C>: call{' '}
        <C>login</C>, read the returned <C>AuthUser</C> for the current workspace slug, set
        it as the active tenant, then navigate. Errors are caught from{' '}
        <C>mutateAsync</C>'s rejection — user callbacks passed in <C>options</C> are
        forwarded safely through <C>createCallbackHandler</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { useAuth } from '@msflib/react-auth'
import { setActiveWorkspace } from '@msflib/core'
import { FormBuilder } from '@msflib/react-components'

export function Login() {
  const { login, loading, status } = useAuth()
  const [error, setError] = useState<string | null>(null)

  if (status === 'authenticated') return <p>You are signed in.</p>

  const handleLogin = async (data: { email: string; password: string }) => {
    setError(null)
    try {
      const user = await login(data, {
        onSuccess: (u) => {
          const account = u.account as { currentWorkspace?: { slug?: string } } | undefined
          setActiveWorkspace(account?.currentWorkspace?.slug || '')
          window.location.assign('/dashboard')
        },
      })
      console.log('token type', user.token_type) // 'bearer'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin({ email: '', password: '' }) }}>
      {error && <p role="alert">{error}</p>}
      <button disabled={loading.login}>{loading.login ? 'Signing in…' : 'Sign in'}</button>
    </form>
  )
}`}</CodeBlock>

      <H3>2. Two-step OTP authentication</H3>
      <p>
        For OTP-enabled accounts: <C>authenticate({'{ email, password }'})</C> returns{' '}
        <C>{'{ msg }'}</C> (the code is emailed), then <C>verifyOtp({'{ code, email }'})</C>{' '}
        returns an <C>AuthUser</C> whose <C>access_token</C> the provider stores and uses
        to invalidate <C>me</C>. Use <C>resendCode</C> for re-delivery and{' '}
        <C>loading.authenticate</C>/<C>loading.verifyOtp</C>/<C>loading.resendCode</C> to
        drive the UI.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { useAuth } from '@msflib/react-auth'

export function OtpLogin() {
  const { authenticate, verifyOtp, resendCode, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'credentials' | 'otp'>('credentials')
  const [error, setError] = useState<string | null>(null)

  const submitCredentials = async () => {
    try {
      await authenticate({ email, password }) // → { msg: '...' }
      setStage('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  const submitOtp = async () => {
    try {
      const user = await verifyOtp({ code, email }) // token stored by the provider
      console.log('signed in as', user.account?.username)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
    }
  }

  return stage === 'credentials' ? (
    <button onClick={submitCredentials} disabled={loading.authenticate}>
      {loading.authenticate ? 'Checking…' : 'Continue'}
    </button>
  ) : (
    <div>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" />
      <button onClick={submitOtp} disabled={loading.verifyOtp}>Verify</button>
      <button onClick={() => resendCode({ email })} disabled={loading.resendCode}>
        Resend code
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}`}</CodeBlock>

      <H3>3. SSO: redirect out, retrieve back</H3>
      <p>
        Three SSO entry points exist. <C>ssoLogin({'{ token }'})</C> exchanges a token you
        already hold (GET with a query param). <C>ssoRedirect({'{ token, path_location? }'})</C>{' '}
        posts <C>application/x-www-form-urlencoded</C> (it bypasses the JSON clients on
        purpose). <C>ssoRetrieve()</C> is called on the landing route after the external
        identity provider sends the user back — it fetches the session and, on success, the
        provider stores the token and refreshes <C>me</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useEffect } from 'react'
import { useAuth } from '@msflib/react-auth'

// Route A — start of the handshake, e.g. from a "SSO portal" click
export function SsoPortalLink() {
  const { ssoRedirect, loading } = useAuth()
  return (
    <button
      disabled={loading.ssoRedirect}
      onClick={() =>
        ssoRedirect({ token: portalToken, path_location: '/dashboard' }).catch(console.error)
      }
    >
      Continue with identity provider
    </button>
  )
}

// Route B — the callback page the provider redirects back to
export function SsoCallback() {
  const { ssoRetrieve, loading, status } = useAuth()

  useEffect(() => {
    ssoRetrieve({
      onSuccess: (user) => {
        // access_token is already in storage; user.path_location says where to go
        window.location.assign(user.path_location ?? '/dashboard')
      },
    }).catch(() => window.location.assign('/login'))
  }, [ssoRetrieve])

  if (loading.ssoRetrieve || status === 'loading') return <p>Signing you in…</p>
  return <p>Redirecting…</p>
}`}</CodeBlock>

      <H3>4. Route guards + connecting downstream providers</H3>
      <p>
        <C>status</C> is the guard primitive. When <C>requireAuth: true</C>, the provider
        computes <C>'loading'</C> until you tell it <C>isAuthenticated</C> — that flag is
        also forwarded to nested data providers so their queries stay disabled until the
        session is real. The <C>me</C> query additionally only runs when a token exists in
        storage, so an anonymous visitor produces zero auth traffic.
      </p>
      <CodeBlock lang="tsx">{`import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@msflib/react-auth'
import { ProfileProvider } from '@msflib/react-profile'
import { NotificationProvider } from '@msflib/react-notification'
import type { ReactNode } from 'react'

function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') return <p>Restoring session…</p>
  if (status === 'unauthenticated') return <p>Please sign in.</p>
  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider options={{ isWorkspaceScoped: false }}>
        {/* isAuthenticated mirrors the session for every nested provider */}
        <ProtectedShell>{children}</ProtectedShell>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function ProtectedShell({ children }: { children: ReactNode }) {
  const { status, me, logout, loading, updateMe } = useAuth()
  const isAuthenticated = status === 'authenticated'

  return (
    <ProfileProvider
      options={{ requireAuth: true, isAuthenticated, isWorkspaceScoped: true }}
    >
      <NotificationProvider
        options={{ requireAuth: true, isAuthenticated, isWorkspaceScoped: true }}
      >
        <RequireAuth>
          <button onClick={() => logout()} disabled={loading.logout}>
            Sign out ({me?.email})
          </button>
          {/* partial profile update — result is written straight into the me cache */}
          <button onClick={() => updateMe({ phone: '+2348012345678' })}>
            Update phone
          </button>
          {children}
        </RequireAuth>
      </NotificationProvider>
    </ProfileProvider>
  )
}`}</CodeBlock>

      <H3>5. Registration with availability checks and recovery</H3>
      <p>
        The remaining flows fit a sign-up/reset screen naturally: check uniqueness before
        submitting with <C>verifyAvailability</C>, register, and run the recovery chain
        (<C>recoverPassword</C> → email token → <C>verifyToken</C> →{' '}
        <C>resetPassword</C>).
      </p>
      <CodeBlock lang="tsx">{`import { useAuth } from '@msflib/react-auth'

export function SignupForm() {
  const { verifyAvailability, register, loading } = useAuth()

  const submit = async (form: { username: string; email: string; password: string }) => {
    await verifyAvailability({ field: 'email', value: form.email })
      .catch(() => { throw new Error('Email already in use') })
    await verifyAvailability({ field: 'username', value: form.username })
      .catch(() => { throw new Error('Username taken') })

    await register({
      username: form.username,
      email: form.email,
      password: form.password,
      profile: { firstname: 'Ada', lastname: 'Lovelace', date_of_birth: '1990-12-10', gender: 'female', marital_status: 'single' },
    }, { onSuccess: () => console.log('registered') })
  }

  return <button disabled={loading.register || loading.verifyAvailability}>Create account</button>
}

export function ResetPasswordFlow() {
  const { recoverPassword, verifyToken, resetPassword, loading } = useAuth()

  const run = async (email: string, token: string, new_password: string) => {
    await recoverPassword({ email })            // emails a token
    await verifyToken({ email, token })         // validate the token from the email
    await resetPassword({ email, token, new_password })
  }

  return <button disabled={loading.resetPassword}>Reset</button>
}`}</CodeBlock>

      <Note>
        <C>logout()</C> runs <C>onSettled</C> cleanup: the token is removed, the <C>me</C>{' '}
        cache is set to <C>null</C> and invalidated — so even if the <C>DELETE /logout</C>{' '}
        request fails, the client session is gone.
      </Note>

      <Warning title="README drift">
        The package README claims workspace-first query keys
        (<C>[workspace, 'msflib', 'auth', 'me']</C>) — that's outdated. Cache keys are
        workspace-agnostic; tenant isolation comes from path prefixes in the HTTP layer.
      </Warning>
    </>
  )
}
