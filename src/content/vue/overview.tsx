import { A, B, C, H2, H3, Table, CodeBlock, Note, Warning } from '../../components/md'

export default function VueOverview() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/vue</C> packages a set of pragmatic, business-oriented Vue 3 components
        that the MSFLib products are built with. Instead of re-inventing inputs, dialogs and
        tables, it composes <A to="https://element-plus.org">Element Plus</A> primitives with
        a thin, opinionated API and a handful of custom widgets that Element Plus does not
        provide out of the box.
      </p>
      <p>
        The library is intentionally small and task-focused: it covers the recurring pieces
        of a business CRUD application — schema-driven forms, data tables with selection and
        pagination, tag/color inputs, CSV field mapping, status steppers and the
        confirmation/success screens that wrap them. Everything is a named export; there is
        no plugin or global install, so a component is one <C>import</C> away, and the
        styling model assumes the host app already runs Element Plus plus a Tailwind-style
        utility layer.
      </p>
      <p>
        Use it when:
      </p>
      <ul>
        <li>You are building admin panels, dashboards or internal business tools with Vue 3.</li>
        <li>
          Your forms and tables should be driven by data (schemas from an API or config)
          rather than hand-written markup.
        </li>
        <li>
          You want product-flow screens — mapping, confirmation, success — ready-made instead
          of rebuilt per project.
        </li>
        <li>
          Your team already standardizes on Element Plus and FontAwesome and wants a thinner,
          business-oriented API on top.
        </li>
      </ul>

      <H2>Highlights</H2>
      <ul>
        <li>
          <B>Schema-driven <C>FormBuilder</C></B> — describe fields as plain objects
          (<C>dtype</C>/<C>etype</C>), get a validated form with inputs, selects, uploads,
          color pickers and more.
        </li>
        <li>
          <B><C>TableWidget</C></B> — an Element Plus table with column control, multi-select
          that survives pagination, client-side search, sorting, per-row menus and a built-in
          pagination footer.
        </li>
        <li>
          <B>Product flows in a box</B> — <C>FieldMapping</C> for CSV import mapping,
          <C>StatusProgress</C> steppers, <C>OptionsModal</C> / <C>SuccessNote</C>{' '}
          confirmation and success screens.
        </li>
        <li>
          <B>Pills & colors</B> — <C>PillsInput</C> with per-pill colors powered by{' '}
          <A to="https://omgovich.github.io/colord/">colord</A>, plus a swatch-grid{' '}
          <C>ColorPicker</C>.
        </li>
      </ul>

      <H2>The component inventory</H2>
      <Table
        head={['Component', 'Purpose']}
        rows={[
          [<C>FormBuilder</C>, 'Render validated forms from a schema array'],
          [<C>FileUpload</C>, 'Drag & drop / click image and file upload'],
          [<C>AutoCompleteInput</C>, 'Text input with client-side or async suggestions'],
          [<C>DatePicker</C>, 'Element Plus date picker passthrough'],
          [<C>SelectList</C>, 'el-select dropdown with object values support'],
          [<C>ColorPicker</C>, 'Swatch grid + custom color picker'],
          [<C>PillsInput</C>, 'Comma-separated tag editor with colored pills'],
          [<C>FieldMapping</C>, 'Two-column CSV field mapper'],
          [<C>TableWidget</C>, 'Data table + selection + search + pagination'],
          [<C>PaginationTab</C>, '"Show rows" select + pager bar'],
          [<C>StatusProgress</C>, 'Ordered status stepper'],
          [<C>ModalDialog</C>, 'el-dialog wrapper with optional footer'],
          [<C>OptionsModal</C>, 'Question screen with primary/secondary buttons'],
          [<C>SuccessNote</C>, 'Confetti success screen'],
        ]}
      />

      <H2>Examples</H2>

      <H3>1. A schema-driven product form in a few lines</H3>
      <p>
        The centerpiece <C>FormBuilder</C> turns an array of descriptors into a validated
        form — see the <A to="/vue/form-builder">FormBuilder page</A> for the full API:
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FormBuilder } from '@msflib/vue'

const product = ref({})
const elements = [
  { name: 'name', dtype: 'string', label: 'Product name', placeholder: 'T-shirt' },
  { name: 'stockLevel', dtype: 'number', label: 'Stock level' },
  { name: 'releaseDate', dtype: 'date', label: 'Release date' },
  { name: 'save', etype: 'submit', label: 'Save' },
]
</script>

<template>
  <FormBuilder :elements="elements" v-model="product" />
</template>`}</CodeBlock>

      <H3>2. A data table with row actions</H3>
      <p>
        <C>TableWidget</C> renders an Element Plus table with multi-select that survives
        pagination, a search box and per-row menus:
      </p>
      <CodeBlock lang="vue">{`<template>
  <TableWidget
    :table-data="rows"
    :menu-items="[
      { name: 'edit', label: 'Edit' },
      { name: 'delete', label: 'Delete' },
    ]"
    :sortable="['code']"
    :exclude="['id']"
    v-model:selected-rows="selected"
    @menu-item-clicked="(item, row) => console.log(item.name, row)"
  />
</template>`}</CodeBlock>

      <H3>3. The CSV import flow</H3>
      <p>
        Combining components into a product flow — map spreadsheet columns to system fields,
        show a success screen when the import completes:
      </p>
      <CodeBlock lang="vue">{`<template>
  <FieldMapping
    v-if="step === 'mapping'"
    :input-fields="csvHeaders"
    :target-fields="{ name: 'Name', price: 'Price' }"
    @update:modelValue="startImport"
  />
  <SuccessNote
    v-else-if="step === 'done'"
    success-title="Import complete"
    success-text="12 products were imported."
    primary-btn-text="Back to catalog"
    @primary-btn-clicked="reset"
  />
</template>`}</CodeBlock>

      <H2>Tech stack</H2>
      <Table
        head={['Piece', 'Version']}
        rows={[
          ['Vue', '^3.3 (components use defineModel, so Vue ≥ 3.4 is required at runtime)'],
          ['Element Plus', '^2.4'],
          ['FontAwesome', '^6.4 via @fortawesome/*'],
          ['colord', '^2.9'],
          ['Build', 'Vite library mode, ESM + CJS output'],
        ]}
      />

      <Warning title="Vue version">
        The library was built and published before Vue 3.4 existed and declares{' '}
        <C>vue: ^3.3.4</C> as a dependency, but the components rely on <C>defineModel()</C>,
        which stabilized in Vue 3.4. Pin your app to Vue <B>3.4+</B>.
      </Warning>

      <H2>Package facts</H2>
      <ul>
        <li>
          Package name: <C>@msflib/vue</C> (published to GitHub Packages,{' '}
          <C>npm.pkg.github.com</C>).
        </li>
        <li>
          Entry points: <C>dist/index.js</C> (ESM) / <C>dist/index.cjs</C> (CJS), declared
          through the <C>exports</C> map; a <C>./style.css</C> export is declared but{' '}
          <B>not currently produced by the build</B> (see <A to="/vue/theming">Theming & styles</A>).
        </li>
        <li>
          A <C>postinstall</C> script copies bundled demo assets into your <C>public/</C>{' '}
          folder — see <A to="/vue/quickstart">Quickstart</A>.
        </li>
        <li>
          Everything is a <B>named export</B>; there is no plugin/<C>app.use()</C> install —
          you import components directly.
        </li>
      </ul>
    </>
  )
}
