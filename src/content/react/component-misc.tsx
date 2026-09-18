import { A, C, CodeBlock, H2, H3, Note, Table, Tip, B } from '../../components/md'

export default function ReactMisc() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        This page collects the smaller single-purpose components of{' '}
        <C>@msflib/react-components</C>: <B>DraggableList</B>, <B>CustomSvg</B>, the{' '}
        <B>Google auth</B> helpers, the <B>skeleton family</B> and <B>ResizablePane</B>.
      </p>
      <p>
        None of them talk to the backend or need a provider — they are self-contained UI
        primitives you can drop anywhere. They cover the recurring "small but fiddly"
        needs of an msflib app: reordering lists with dnd-kit, theming third-party SVG
        icons, redirect-based Google sign-in against the FastAPI auth module, loading
        placeholders that match your card layouts, and split panes that are keyboard
        accessible. Together with <A to="/react/component-formbuilder">FormBuilder</A>,{' '}
        <A to="/react/component-tablewidget">TableWidget</A>,{' '}
        <A to="/react/component-chatbox">ChatBox</A> and{' '}
        <A to="/react/component-treeview">TreeView</A> they make up the whole component
        package (v0.0.40).
      </p>
      <p>Reach for them when you want:</p>
      <ul>
        <li>
          <B>Drag-to-reorder without building dnd contexts</B> — <C>DraggableList</C> for
          lists, <C>TableWidget draggable</C> for grids.
        </li>
        <li>
          <B>Brand-colored inline SVGs</B> — <C>CustomSvg</C> normalizes any remote or
          bundled SVG to <C>currentColor</C>.
        </li>
        <li>
          <B>"Sign in with Google"</B> — button + callback handler against{' '}
          <C>/google/login</C> and <C>/google/callback</C>.
        </li>
        <li>
          <B>Loading states that match real layouts</B> — the <C>AppSkeleton</C> family and{' '}
          <C>SkeletonLoaderWrapper</C>.
        </li>
      </ul>

      <H2>DraggableList</H2>
      <p>
        Vertical drag-to-reorder list on <C>@dnd-kit</C> (250 ms drag delay).
      </p>
      <CodeBlock lang="tsx">{`import { DraggableList } from '@msflib/react-components'

<DraggableList
  items={sections}            // each item needs { id }
  onDragEnd={(reordered) => setSections(reordered)}
  renderItem={(item) => <SectionCard section={item} />}
  itemClassName="rounded-xl"
/>`}</CodeBlock>
      <Table
        head={['Prop', 'Description']}
        rows={[
          [<C>items</C>, <>T[] where <C>{'T extends { id: string }'}</C></>],
          [<C>onDragEnd</C>, <C>(reorderedItems) =&gt; void</C>],
          [<C>renderItem</C>, <C>(item) =&gt; ReactNode</C>],
          [<C>itemClassName</C>, 'Class for each row wrapper'],
        ]}
      />

      <H2>CustomSvg</H2>
      <p>
        Fetches an SVG (URL or <C>?raw</C> import), strips its <C>width</C>/<C>height</C>/
        <C>style</C>, swaps <C>fill</C>/<C>stroke</C> to <C>currentColor</C> unless
        overridden, and inlines it — perfect for theming third-party icons.
      </p>
      <CodeBlock lang="tsx">{`<CustomSvg src={logoUrl} className="w-6 h-6" fill="#38bdf8" />`}</CodeBlock>

      <H2>Google auth</H2>
      <p>
        Redirect-based Google sign-in helpers that pair with the FastAPI auth module's{' '}
        <C>/google/login</C> + <C>/google/callback</C> endpoints.
      </p>
      <CodeBlock lang="tsx">{`import { GoogleAuthButton, GoogleAuthHandler, useGoogleCallback } from '@msflib/react-components'

// 1) Trigger
<GoogleAuthButton apiBaseUrl="https://api.example.com" redirectUrl="https://app.example.com/auth/google" />

// 2) Handle the redirect
function GoogleCallbackScreen() {
  return <GoogleAuthHandler apiBaseUrl="https://api.example.com" modalComponent={<Spinner />} />
}

// …or drive it yourself
const { isLoading } = useGoogleCallback({
  apiBaseUrl: 'https://api.example.com',
  callbackEndpoint: '/google/callback', // default
  onSuccess: (res) => saveToken(res),
  onError: (err) => toast(err.message),
})`}</CodeBlock>
      <p>
        <C>GoogleAuthButton</C> extends MUI <C>ButtonProps</C> with <C>label</C> (default
        "Sign in with Google"), <C>apiBaseUrl</C>, <C>redirectUrl</C>,{' '}
        <C>googleLoginPath</C> (default <C>/google/login</C>), <C>iconSize</C>,{' '}
        <C>fullWidth</C> and <C>onRedirect</C>. It redirects to{' '}
        <C>{'`${apiBaseUrl}${googleLoginPath}?redirect_uri=...`'}</C>.
      </p>

      <H2>Skeletons</H2>
      <CodeBlock lang="tsx">{`import { AppSkeleton, SkeletonLoaderWrapper, SkeletonCardLayout } from '@msflib/react-components'

// composable base with static subcomponents (all accept MUI SkeletonProps)
<AppSkeleton.Avatar size={64} />
<AppSkeleton.Text height={20} lines={3} />
<AppSkeleton.Image width="100%" height={180} />
<AppSkeleton.Button width="80%" />

// list-loading wrapper: renders N copies of the layout while loading
<SkeletonLoaderWrapper loading={isLoading} layout={<RowSkeleton />} skeletonLength={5}>
  <RealRows />
</SkeletonLoaderWrapper>

// fixed card-shaped layout (275×356)
<SkeletonCardLayout />`}</CodeBlock>

      <Note>
        The skeleton family (and <C>GoogleAuthButton</C>) use Tailwind utility classes —
        your app needs Tailwind configured.
      </Note>

      <H2>ResizablePane</H2>
      <p>
        Keyboard-accessible resizable split panes (arrow keys, 10 px step; drag divider).
      </p>
      <CodeBlock lang="tsx">{`<ResizablePane
  direction="horizontal"
  panes={[
    { initialSize: 260, minSize: 180, render: () => <Sidebar /> },
    { initialSize: '70%', render: () => <Editor /> },
  ]}
/>`}</CodeBlock>
      <p>
        Defaults: initial 200 px, min 50 px. Pane config:{' '}
        <C>{'{ minSize?, maxSize?, initialSize? (px or %), render? }'}</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. An ordering UI with DraggableList + persistence</H3>
      <p>
        Sections of a course page that admins can reorder: the list is local state, and{' '}
        <C>onDragEnd</C> receives the reordered array which you persist through any API.
        The 250 ms activation delay means clicks on row content still work.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { DraggableList } from '@msflib/react-components'

type Section = { id: string; title: string; duration: number }

export function SectionOrderer({ initial }: { initial: Section[] }) {
  const [sections, setSections] = useState(initial)
  const [saving, setSaving] = useState(false)

  const persist = async (reordered: Section[]) => {
    setSaving(true)
    try {
      await api.updateSectionOrder(reordered.map((s, i) => ({ id: s.id, order: i })))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ opacity: saving ? 0.6 : 1 }}>
      <DraggableList
        items={sections}
        onDragEnd={(reordered) => {
          setSections(reordered)
          void persist(reordered)
        }}
        renderItem={(section) => (
          <div style={{ padding: 12, border: '1px solid #eee' }}>
            {section.title} — {section.duration} min
          </div>
        )}
        itemClassName="mb-2"
      />
    </div>
  )
}`}</CodeBlock>

      <H3>2. Google sign-in end to end, integrated with useAuth</H3>
      <p>
        The full flow: the button navigates the whole page to{' '}
        <C>{'${apiBaseUrl}/google/login?redirect_uri=…'}</C>; when Google returns to your
        callback route with <C>?code=…</C>, <C>useGoogleCallback</C> (used by{' '}
        <C>GoogleAuthHandler</C>) posts the code to <C>/google/callback</C> and hands the
        payload to <C>onSuccess</C> — where you typically store the token and continue with{' '}
        <C>useAuth()</C> state.
      </p>
      <CodeBlock lang="tsx">{`import { GoogleAuthButton, GoogleAuthHandler } from '@msflib/react-components'
import { useAuth } from '@msflib/react-auth'

const API = 'https://api.msflib.com/v1'

export function LoginPage() {
  return (
    <div>
      <PasswordForm />
      <div style={{ margin: '24px 0', textAlign: 'center' }}>or</div>
      <GoogleAuthButton
        apiBaseUrl={API}
        redirectUrl={\`\${window.location.origin}/auth/google\`} // your callback route
        fullWidth
        size="large"
        onRedirect={() => console.log('leaving for Google…')}
      />
    </div>
  )
}

// route: /auth/google
export function GoogleCallbackPage() {
  const { ssoRetrieve } = useAuth()

  return (
    <GoogleAuthHandler
      apiBaseUrl={API}
      onSuccess={(res) => {
        // the backend responds with the session payload — keep whatever it returns
        localStorage.setItem('msflib_token', res.access_token ?? res.token)
        // then bootstrap the regular session
        void ssoRetrieve({ onSuccess: () => (window.location.href = '/dashboard') })
      }}
      onError={(err) => (window.location.href = '/login?error=google')}
    />
  )
}`}</CodeBlock>

      <H3>3. Skeleton loading for a dashboard fed by providers</H3>
      <p>
        A realistic loading state: <C>SkeletonLoaderWrapper</C> renders five{' '}
        <C>SkeletonCardLayout</C> copies while the providers' queries are pending, then
        swaps in the real content. Compose <C>AppSkeleton</C> parts inside your own layout
        component when the stock card doesn't match.
      </p>
      <CodeBlock lang="tsx">{`import { AppSkeleton, SkeletonLoaderWrapper, SkeletonCardLayout } from '@msflib/react-components'
import { useNotification } from '@msflib/react-notification'
import { useProfile } from '@msflib/react-profile'

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-zinc-100">
      <AppSkeleton.Avatar size={40} />
      <div className="flex-1">
        <AppSkeleton.Text height={16} />
      </div>
      <AppSkeleton.Button width={80} height={32} />
    </div>
  )
}

export function NotificationCenter() {
  const { notifications, loading } = useNotification()

  return (
    <SkeletonLoaderWrapper
      loading={loading.notifications}
      layout={<NotificationSkeleton />}
      skeletonLength={5}
    >
      <ul>
        {notifications.map((n) => (
          <li key={n.notification_id} data-read={n.is_read}>
            {n.notification.title}
          </li>
        ))}
      </ul>
    </SkeletonLoaderWrapper>
  )
}`}</CodeBlock>

      <H3>4. A custom SVG icon set + ResizablePane workbench</H3>
      <p>
        Two small building blocks combined: <C>CustomSvg</C> inlines brand SVGs recolored
        via <C>fill</C> (note it renders <C>{'<null>'}</C> until the fetch resolves), and{' '}
        <C>ResizablePane</C> splits a code-review style workbench — sidebar, editor and a
        vertical preview strip — each pane clamped by min/max sizes, dividers draggable
        and arrow-key resizable.
      </p>
      <CodeBlock lang="tsx">{`import { CustomSvg, ResizablePane } from '@msflib/react-components'

export function Workbench() {
  return (
    <div style={{ height: '80vh' }}>
      <ResizablePane
        direction="horizontal"
        panes={[
          {
            initialSize: 240, minSize: 180, maxSize: 400,
            render: () => (
              <nav className="flex flex-col gap-2 p-3">
                <CustomSvg src="/icons/folder.svg" className="w-5 h-5" />
                <CustomSvg src="/icons/file.svg" className="w-5 h-5" fill="#6366f1" />
                <span>Sidebar</span>
              </nav>
            ),
          },
          {
            initialSize: '65%',
            render: () => (
              <ResizablePane
                direction="vertical"
                panes={[
                  { initialSize: '70%', render: () => <Editor /> },
                  { initialSize: '30%', minSize: 120, render: () => <Preview /> },
                ]}
                paneDividerStyle={{ background: '#e5e7eb' }}
              />
            ),
          },
        ]}
      />
    </div>
  )
}`}</CodeBlock>

      <Tip>
        All of these are exported from the package root,{' '}
        <C>@msflib/react-components</C> — <C>DraggableList</C>, <C>CustomSvg</C>,{' '}
        <C>GoogleAuthButton</C>/<C>GoogleAuthHandler</C>/<C>useGoogleCallback</C>,{' '}
        <C>AppSkeleton</C>, <C>SkeletonLoaderWrapper</C>, <C>SkeletonCardLayout</C> and{' '}
        <C>ResizablePane</C>.
      </Tip>
    </>
  )
}
