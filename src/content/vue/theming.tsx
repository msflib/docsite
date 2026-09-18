import { A, B, C, CodeBlock, H2, Table, Warning, Note, H3 } from '../../components/md'

export default function VueTheming() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/vue</C> ships <B>no standalone stylesheet today</B>. The <C>exports</C> map
        declares a <C>./style.css</C> entry, but the build does not currently emit one (the
        source <C>src/style.css</C> is fully commented out). Styling reaches your app through
        three other channels.
      </p>

      <H2>1. Element Plus CSS (required)</H2>
      <p>
        Every widget is built on Element Plus, and the library bundles Element Plus{' '}
        <em>code</em> but not its <em>CSS</em>. Load it once in your entry file:
      </p>
      <CodeBlock lang="js">{`import 'element-plus/dist/index.css'`}</CodeBlock>

      <H2>2. Tailwind-style utilities (expected)</H2>
      <p>
        Component templates use common utility classes directly in their markup — for example{' '}
        <C>w-full</C>, <C>h-10</C>, <C>flex</C>, <C>grid</C>, <C>border</C>, <C>px-2</C>,{' '}
        <C>my-1</C>, <C>rounded</C>, <C>text-[10px]</C>. Nothing generates these classes for
        you; the host app is expected to have{' '}
        <A to="https://tailwindcss.com">Tailwind CSS</A> (or an equivalent utility layer)
        configured.
      </p>
      <p>A few components also use custom theme classes that your app must define:</p>
      <Table
        head={['Class', 'Used by', 'Expected styling']}
        rows={[
          [<C>bg-pri</C>, <><C>OptionsModal</C>, <C>SuccessNote</C></>, 'Primary brand background (buttons/screen)'],
          [<C>text-pri</C>, <C>OptionsModal</C>, 'Primary brand text color'],
          [<C>bg-confetti-pattern</C>, <C>SuccessNote</C>, 'Optional confetti background image'],
        ]}
      />

      <H2>3. Library-owned CSS inside SFCs</H2>
      <p>Components ship small style blocks that are compiled into the bundle:</p>
      <ul>
        <li>
          <C>FormBuilder</C> — non-scoped <C>.fb-*</C> overrides (<C>.fb-form-wrapper</C>,
          input start/end icons, full-width <C>el-form</C> / <C>el-select</C> / <C>el-date</C>{' '}
          rules).
        </li>
        <li>
          <C>ModalDialog</C> — rounded <C>el-dialog</C> override (15px corners).
        </li>
        <li>
          <C>ColorPicker</C> — scoped <C>.selected-color</C> highlight on the active swatch.
        </li>
        <li>
          <C>TableWidget</C>, <C>PaginationTab</C>, <C>FileUpload</C>, <C>SelectList</C>,{' '}
          <C>AutoCompleteInput</C> — small layout tweaks (row hover, pagination layout,
          drop-area padding, full-width selects).
        </li>
      </ul>
      <p>These apply automatically once components are imported.</p>

      <H2>Examples</H2>

      <H3>Theming Element Plus variables</H3>
      <p>
        Because every widget is an Element Plus component, overriding Element Plus CSS
        variables in your app cascades into all library components at once:
      </p>
      <CodeBlock lang="css">{`:root {
  --el-color-primary: #6d5cff;
  --el-border-radius-base: 10px;
  --el-font-family: 'Inter', system-ui, sans-serif;
}`}</CodeBlock>

      <H3>ColorPicker palette</H3>
      <p>
        <C>ColorPicker</C> ships a default palette of 23 <C>rgb()</C> swatches in{' '}
        <C>defaultColorPalette.js</C> (red/yellow/green/cyan/blue/magenta hues, white, black
        and slate tones). Override it per instance with the <C>colorPalette</C> prop:
      </p>
      <CodeBlock lang="vue">{`<ColorPicker :color-palette="['#e91e63', '#009688', '#f5c97b']" />`}</CodeBlock>

      <H3>Dark mode</H3>
      <p>
        There is no built-in dark-mode support — visuals follow Element Plus and whatever the
        host app's utility layer provides. If your app themes Element Plus via CSS variables
        (<C>--el-color-primary</C> etc.), the components follow along.
      </p>
    </>
  )
}
