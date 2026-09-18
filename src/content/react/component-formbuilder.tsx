import { B, C, CodeBlock, H2, H3, Note, Table, Tip, Warning } from '../../components/md'

export default function ReactFormBuilder() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        The React <C>FormBuilder</C> renders a complete form from a <C>FormElement[]</C>{' '}
        schema and keeps form state in react-hook-form.
      </p>
      <p>
        Instead of hand-wiring a dozen MUI inputs, you describe each field as data — a{' '}
        <C>name</C>, an explicit widget type (<C>eType</C>) or data type hint (<C>dType</C>),
        optional <C>validation</C> rules and extra widget props in <C>mData</C> — and the
        builder registers everything with a single <C>useForm</C> instance, wires React
        Hook Form validation, renders the right widget per element and reports the submitted
        object to your <C>onSubmit(data, reset)</C> handler. Because the schema is plain
        data, forms can come from an API, a config file or a constant.
      </p>
      <p>
        Architecturally it is a <B>context-driven renderer</B>: the outer component builds{' '}
        <C>{'{ control, elementsMap, windowWidth, loading }'}</C> and provides it, and each{' '}
        <C>FormField elementName=…</C> looks its element up and connects to react-hook-form.
        State flows out through a <C>watch</C> subscription into your <C>setFormData</C>, so
        the form stays a controlled component from your perspective. It pairs naturally with
        the auth mutations (the playground login screen is exactly this component +{' '}
        <C>useAuth()</C>).
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Schema-driven forms</B> — login, registration, onboarding or CRUD editors
          built from a declarative element array instead of JSX per field.
        </li>
        <li>
          <B>Consistent validation UX</B> — react-hook-form rules per element with MUI
          error/helper text handled for you.
        </li>
        <li>
          <B>Custom layouts without losing state</B> — pass a <C>layout</C> component and
          place <C>FormField</C>s anywhere; the control context follows.
        </li>
        <li>
          <B>Loading-aware submits</B> — <C>loadingState</C> disables fields and shows
          progress on buttons driven by your mutation flags.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { FormBuilder } from '@msflib/react-components'

const elements = [
  {
    id: 'email',
    name: 'email',
    label: 'Email Address',
    eType: 'text',
    dType: 'email',
    placeholder: 'name@company.com',
    validation: { required: 'Email is required' },
  },
  {
    id: 'role',
    name: 'role',
    label: 'Role',
    eType: 'select',
    dType: 'text',
    mData: { options: [{ label: 'Admin', value: 'admin' }, { label: 'Member', value: 'member' }] },
  },
  { id: 'submit', name: 'submit', label: 'Sign In', eType: 'button', dType: 'submit' },
]

function LoginForm() {
  const [formData, setFormData] = useState({})
  return (
    <FormBuilder
      elements={elements}
      formData={formData}
      setFormData={setFormData}
      onSubmit={(data, reset) => {
        login(data)
        // reset() clears the form when you want it
      }}
      loadingState={loading.login}
    />
  )
}`}</CodeBlock>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Description']}
        rows={[
          [<C>elements</C>, <C>FormElement[]</C>, 'Field descriptors (below)'],
          [<C>onSubmit</C>, <C>(data, reset) =&gt; void</C>, 'Valid-data handler'],
          [<C>formData</C>, <C>object</C>, 'Controlled form values'],
          [<C>setFormData?</C>, <C>(values) =&gt; void</C>, 'Kept in sync via a watch subscription'],
          [<C>loadingState?</C>, <C>boolean</C>, 'Disables fields & shows progress on submit buttons'],
          [<C>resetFormOnSubmit?</C>, <C>boolean</C>, 'Auto-reset after successful submit'],
          [<C>layout?</C>, <C>Component</C>, <>Custom layout receiving <C>{'{ FormField, elements, formData, setFormData, isMobile, loading }'}</C></>],
        ]}
      />

      <H2>FormElement</H2>
      <Table
        head={['Field', 'Type', 'Description']}
        rows={[
          [<C>id, name, label</C>, <C>string</C>, 'Identity and label'],
          [<C>eType</C>, <C>string</C>, <>Widget: <C>text</C>, <C>password</C>, <C>select</C>, <C>autocomplete</C>, <C>checkbox</C>, <C>radio</C>, <C>switch</C>, <C>date</C>, <C>time</C>, <C>upload</C>, <C>tags</C>, <C>search-menu</C>, <C>button</C></>],
          [<C>dType</C>, <C>string</C>, <>Data type hint (<C>text</C>, <C>email</C>, <C>number</C>, <C>submit</C>…)</>],
          [<C>placeholder?</C>, <C>string</C>, 'Placeholder'],
          [<C>validation?</C>, <C>object</C>, <>react-hook-form rules (<C>{'{ required: "Email is required" }'}</C>)</>],
          [<C>width?</C>, <C>number</C>, 'Percent width in the grid'],
          [<C>helperText?, disabled?</C>, '—', 'Standard field affordances'],
          [<C>mData?</C>, <C>object</C>, <>Extra widget data: <C>align</C>, <C>required</C>, <C>variant</C>, <C>color</C>, <C>options</C>, <C>rows</C>, <C>accept</C>, <C>readOnly</C>, <C>isCustomLabel</C> + <C>label_style</C>, <C>startIcon</C>/<C>endIcon</C> (<C>{'{ icons, clickBehavior? }'}</C>), <C>sx</C></>],
        ]}
      />
      <p>
        <C>FormField</C> (used inside custom layouts) takes <C>elementName</C>,{' '}
        <C>className</C>, <C>style</C> and reads the FormBuilder context (<C>control</C>,{' '}
        <C>elementsMap</C>, <C>windowWidth</C>, <C>loading</C>).
      </p>

      <H2>Renderer highlights</H2>
      <ul>
        <li>
          <B>Password</B> fields get a default eye/eye-off visibility toggle.
        </li>
        <li><B>Uploads</B> honor <C>mData.accept</C>.</li>
        <li>
          <B>Icons</B> render from the <C>icons</C> record;{' '}
          <C>clickBehavior: 'toggle'</C> flips password visibility, or point it at a
          callback.
        </li>
        <li>
          <B>Select/autocomplete</B> consume <C>mData.options</C>.
        </li>
        <li>
          <B>Buttons</B>: <C>dType: 'submit'</C> submits the form; honor{' '}
          <C>loadingState</C>.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. A registration form with validation and live state</H3>
      <p>
        A two-column-feeling sign-up built from one schema: react-hook-form rules for
        required fields and email shape, a select with options in <C>mData</C>, and a{' '}
        <C>setFormData</C> subscription so a parent can preview the payload live.{' '}
        <C>resetFormOnSubmit</C> clears the form after <C>onSubmit</C> resolves.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { FormBuilder, type FormElement } from '@msflib/react-components'

const registerElements: FormElement[] = [
  {
    id: 'username', name: 'username', label: 'Username',
    eType: 'text', dType: 'text', width: 50,
    validation: { required: 'Username is required', minLength: { value: 3, message: 'Too short' } },
  },
  {
    id: 'email', name: 'email', label: 'Email address',
    eType: 'text', dType: 'email', width: 50,
    validation: { required: 'Email is required', pattern: { value: /^\\S+@\\S+$/, message: 'Invalid email' } },
  },
  {
    id: 'password', name: 'password', label: 'Password',
    eType: 'password', dType: 'password', width: 50,
    validation: { required: 'Password is required' },
    // default show/hide eye toggle; override with mData.endIcon.icons
  },
  {
    id: 'experience', name: 'experience', label: 'Experience level',
    eType: 'select', dType: 'text', width: 50,
    mData: {
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'expert', label: 'Expert' },
      ],
    },
  },
  { id: 'submit', name: 'submit', label: 'Create account', eType: 'button', dType: 'submit', width: 100 },
]

export function Signup() {
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  return (
    <>
      <FormBuilder
        elements={registerElements}
        formData={formData}
        setFormData={setFormData}
        resetFormOnSubmit
        onSubmit={(data, reset) => {
          console.log('payload', data)
          reset() // optional — clear the form from the handler
        }}
      />
      <pre>{JSON.stringify(formData, null, 2)}</pre> {/* live preview via watch */}
    </>
  )
}`}</CodeBlock>

      <H3>2. Realistic app usage: FormBuilder + useAuth (playground login)</H3>
      <p>
        The playground's login screen is the canonical integration: the schema lives in its
        own module, <C>loadingState</C> is driven by <C>loading.login</C> from{' '}
        <C>@msflib/react-auth</C>, and the submit handler chains into the auth mutation and
        workspace selection. Buttons are configured through <C>mData.sx</C>.
      </p>
      <CodeBlock lang="tsx">{`// login.form.ts — the schema as pure data (testable, translatable, fetchable)
import { baseMData, buttonStyle } from '@/styles/form.styles'

export const loginElements = [
  {
    id: 'email', name: 'email', label: 'Email Address',
    eType: 'text', dType: 'email', placeholder: 'name@company.com',
    validation: { required: 'Email is required' },
    mData: baseMData,
  },
  {
    id: 'password', name: 'password', label: 'Password',
    eType: 'password', dType: 'password', placeholder: '••••••••',
    validation: { required: 'Password is required' },
    mData: baseMData,
  },
  {
    id: 'submit', name: 'submit', label: 'Sign In',
    eType: 'button', dType: 'submit', width: 100,
    mData: { sx: buttonStyle() },
  },
]

// Login.tsx — the wiring
import { useState } from 'react'
import { useAuth } from '@msflib/react-auth'
import { setActiveWorkspace } from '@msflib/core'
import { FormBuilder, type FormElement } from '@msflib/react-components'
import { loginElements } from './login.form'

export function Login() {
  const { login, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (data: { email: string; password: string }) => {
    setError(null)
    try {
      await login(data, {
        onSuccess: (user) => {
          const account = user.account as { currentWorkspace?: { slug?: string } } | undefined
          setActiveWorkspace(account?.currentWorkspace?.slug || '')
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    }
  }

  return (
    <div>
      {error && <div role="alert">{error}</div>}
      <FormBuilder
        elements={loginElements as FormElement[]}
        formData={{}}
        onSubmit={handleLogin}
        loadingState={loading.login}
      />
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: custom layout, uploads and icons</H3>
      <p>
        <C>layout</C> receives <C>{'{ FormField, elements, formData, setFormData, isMobile, loading }'}</C>{' '}
        and takes full control of arrangement — here a responsive grid that renders fields
        explicitly by name. The schema also mixes an upload (with <C>mData.accept</C>), a
        search-style input with a start icon, a tag input and a checkbox.
      </p>
      <CodeBlock lang="tsx">{`import type { LayoutProps } from '@msflib/react-components'

function CourseLayout({ FormField, isMobile }: LayoutProps) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <FormField elementName="title" />
        <FormField elementName="cover" />
        <FormField elementName="tags" />
        <FormField elementName="published" />
        <FormField elementName="save" />
      </div>
    )
  }
  return (
    <section className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-3">
        <FormField elementName="title" />
        <FormField elementName="cover" />
      </div>
      <div className="flex flex-col gap-3">
        <FormField elementName="tags" />
        <FormField elementName="published" />
        <FormField elementName="save" />
      </div>
    </section>
  )
}

const courseElements = [
  { id: 'title', name: 'title', label: 'Course title', eType: 'text', dType: 'text',
    validation: { required: 'Title is required' } },
  { id: 'cover', name: 'cover', label: 'Cover image', eType: 'upload', dType: 'file',
    mData: { accept: 'image/*', preview_upload: true } },
  { id: 'tags', name: 'tags', label: 'Tags', eType: 'taginput', dType: 'list' },
  { id: 'published', name: 'published', label: 'Publish now', eType: 'checkbox', dType: 'boolean' },
  { id: 'save', name: 'save', label: 'Save course', eType: 'button', dType: 'submit' },
]

export function CourseEditor() {
  const [formData, setFormData] = useState({ published: false })
  return (
    <FormBuilder
      elements={courseElements}
      formData={formData}
      setFormData={setFormData}
      layout={CourseLayout}
      onSubmit={async (data) => {
        const fd = new FormData()
        Object.entries(data).forEach(([key, value]) => fd.append(key, String(value)))
        await api.createCourse(fd)
      }}
    />
  )
}`}</CodeBlock>

      <H3>4. Programmatic submit from outside the form</H3>
      <p>
        There is no ref API — the form submits itself through its submit button. The
        pattern for an external toolbar button is to include the submit element in the
        schema and drive the surrounding UI from <C>loadingState</C>, or to keep the payload
        in sync via <C>setFormData</C> and trigger navigation after <C>onSubmit</C>{' '}
        resolves.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { FormBuilder } from '@msflib/react-components'
import { useNavigate } from 'react-router-dom'

export function OnboardingStep({ next }: { next: () => void }) {
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  return (
    <div>
      {saved && <p>Step saved — you can leave this page.</p>}
      <FormBuilder
        elements={stepElements} // ends with { id: 'submit', name: 'submit', eType: 'button', dType: 'submit', ... }
        formData={{}}
        loadingState={busy}
        resetFormOnSubmit
        onSubmit={async (data) => {
          setBusy(true)
          try {
            await saveStep(data)   // if this throws, the form stays filled
            setSaved(true)
            next()
          } finally {
            setBusy(false)
          }
        }}
      />
    </div>
  )
}`}</CodeBlock>

      <Tip>
        The playground's login screen is a real-world reference:{' '}
        <C>apps/playground/app/(auth)/login/components/Login.tsx</C> combines{' '}
        <C>FormBuilder</C> with <C>useAuth()</C> and post-login workspace selection.
      </Tip>

      <Note>
        <C>onSubmit</C> only fires for valid data — react-hook-form runs every element's{' '}
        <C>validation</C> rules first, and errors render as MUI helper text. Wrap your
        handler in try/catch and surface failures in your own state; the builder swallows
        handler exceptions to keep the form usable.
      </Note>

      <Warning>
        The bundled <C>formbuilder/README.md</C> in the package predates the current
        implementation (it documents a top-level <C>options</C> row on{' '}
        <C>FormElement</C>) — treat the <C>FormElement</C> table above, derived from{' '}
        <C>src/components/formbuilder/types.ts</C>, as authoritative.
      </Warning>
    </>
  )
}
