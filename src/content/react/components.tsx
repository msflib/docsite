import { A, B, C, CodeBlock, H2, Table, H3 } from '../../components/md'

export default function ReactComponents() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-components</C> (v0.0.40) is the largest package: a component
        library built on <B>MUI v9</B> (<C>@mui/material</C>, <C>@mui/x-data-grid</C>,{' '}
        <C>@mui/x-date-pickers</C>, Emotion), <B>react-hook-form</B>, <C>@dnd-kit</C> and{' '}
        <C>react-icons</C>. It does <B>not</B> depend on <C>@msflib/core</C> — peers are{' '}
        <C>react ^18 || ^19</C>, <C>react-dom</C> and <C>react-hook-form ^7</C>.
      </p>
      <p>
        Entry <C>src/index.ts</C> re-exports everything from <C>src/components/</C> plus
        shared types. Storybook is configured (<C>pnpm storybook</C> inside the package,
        port 6006).
      </p>

      <H2>Examples</H2>

      <H3>Component map</H3>
      <Table
        head={['Component', 'Page', 'Purpose']}
        rows={[
          [<C>FormBuilder</C> + <C>FormField</C>, <A to="/react/component-formbuilder">FormBuilder</A>, 'Declarative forms via react-hook-form'],
          [<C>TableWidget</C>, <A to="/react/component-tablewidget">TableWidget</A>, 'MUI X DataGrid wrapper with search, menus, drag'],
          [<C>ChatBox</C>, <A to="/react/component-chatbox">ChatBox</A>, 'Controlled chat UI with markdown & feedback'],
          [<C>TreeView</C>, <A to="/react/component-treeview">TreeView</A>, 'WAI-ARIA tree with lazy loading'],
          [<>DraggableList, CustomSvg, GoogleAuth*, skeletons, ResizablePane</>, <A to="/react/component-misc">Other components</A>, 'Utilities & smaller pieces'],
        ]}
      />

      <H3>Setup notes</H3>
      <ul>
        <li>
          <B>MUI theme</B>: components render MUI primitives — wrap your app in the theme
          provider of your choice.
        </li>
        <li>
          <B>Tailwind</B>: several components (skeletons, <C>GoogleAuthButton</C>,{' '}
          <C>DraggableList</C> wrapper) hard-code Tailwind utility classes; have Tailwind
          configured or those render unstyled. No CSS file ships in <C>dist</C>.
        </li>
        <li>
          Testing inside the package uses Jest + Storybook; consumers don't need anything
          special.
        </li>
      </ul>

      <H3>Quick taste</H3>
      <CodeBlock lang="tsx">{`import { FormBuilder, TableWidget, AppSkeleton } from '@msflib/react-components'

const elements = [
  { id: 'email', name: 'email', label: 'Email', eType: 'text', dType: 'email',
    validation: { required: 'Email is required' } },
  { id: 'submit', name: 'submit', label: 'Sign in', eType: 'button', dType: 'submit' },
]

<FormBuilder elements={elements} formData={{}} onSubmit={(data, reset) => login(data)} />

<TableWidget rows={users} columns={columns} enableSearch checkboxSelection tableTitle="Users" />

{loading ? <AppSkeleton.Text lines={3} /> : <ProfileCard />}`}</CodeBlock>
    </>
  )
}
