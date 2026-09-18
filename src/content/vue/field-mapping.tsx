import { B, C, CodeBlock, H2, H3, Note, Table, Tip } from '../../components/md'

export default function VueFieldMapping() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>FieldMapping</C> renders the classic "map your columns" screen of an import
        wizard: one row per source column (from <C>inputFields</C>), each with a native{' '}
        <C>&lt;select&gt;</C> listing the destination fields (from <C>targetFields</C>).
        A fixed header bar — title "Field Mapping", subtitle "Select fields that
        correspond to the columns in the csv file", and the column captions{' '}
        <C>Spreadsheet</C> / <C>Fields</C> — frames the grid; its background is
        configurable via <C>headerBgColor</C>.
      </p>
      <p>
        Selections are stored internally per row index, and every change emits the{' '}
        <B>complete</B> mapping via <C>update:modelValue</C>: an array of{' '}
        <C>{'{ inputField, targetField }'}</C> objects where unselected rows carry{' '}
        <C>targetField: undefined</C>. A target already chosen in another row is disabled
        in the remaining selects, which structurally prevents duplicate mappings — one
        column per field, enforced by the UI itself. When <C>targetFields</C> is an
        object, the object's <B>keys</B> are used as emitted values and its values as the
        displayed labels, letting you decouple machine values from human names.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>CSV/spreadsheet import wizards</B> — map unknown file headers onto known
          system fields before inserting rows into your database.
        </li>
        <li>
          <B>Duplicate-proof assignment</B> — already-taken targets are disabled, so the
          user cannot map two columns to the same field.
        </li>
        <li>
          <B>Key/label decoupling</B> — emit stable machine keys (<C>fld1</C>) while
          displaying friendly labels ("Field 1") via an object map.
        </li>
        <li>
          <B>Complete mapping snapshots</B> — every change emits the full array, so the
          parent always holds an authoritative mapping it can validate and submit.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>inputFields</C>, <><C>Array</C>, <C>[]</C> (<B>required</B>)</>, 'Source column names — one row each'],
          [<C>targetFields</C>, <C>Array | Object</C>, '— (required)', <>Targets; an object map emits its <B>keys</B> as values</>],
          [<C>headerBgColor</C>, <C>String</C>, <C>'#d3d3d3'</C>, 'Header bar background'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload']}
        rows={[
          [
            <C>update:modelValue</C>,
            <>
              <C>{'[{ inputField: "Column 1", targetField: "Field 1" }, …]'}</C> — unselected
              rows carry <C>undefined</C> targets,
            </>,
          ],
        ]}
      />

      <H2>Notes</H2>
      <ul>
        <li>
          The header texts are static ("Field Mapping" / "Select fields that correspond to
          the columns in the csv file").
        </li>
        <li>
          Pass an array (<C>['id', 'name']</C>) to use raw values as targets, or an object
          (<C>{'{ id: "ID" }'}</C>) to decouple values from display labels.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. Array targets — the basic mapping</H3>
      <p>
        With an array of <C>targetFields</C>, the select options and emitted values are
        the strings themselves. The shape below mirrors the library's fixture:{' '}
        <C>['Column 1', 'Column 2', 'Column 3']</C> mapped onto{' '}
        <C>['Field 1', 'Field 2', 'Field 3']</C> produces{' '}
        <C>{'[{ inputField: "Column 1", targetField: "Field 1" }, …]'}</C>.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FieldMapping } from '@msflib/vue'

const inputFields = ['Column 1', 'Column 2', 'Column 3']
const targetFields = ['Field 1', 'Field 2', 'Field 3']
const mapping = ref([])
</script>

<template>
  <FieldMapping
    :input-fields="inputFields"
    :target-fields="targetFields"
    @update:modelValue="(m) => (mapping = m)"
  />
</template>`}</CodeBlock>

      <H3>2. Object targets — keys as emitted values</H3>
      <p>
        When <C>targetFields</C> is an object, the dropdown shows the values ("Field 1")
        but the emitted <C>targetField</C> is the key (<C>fld1</C>). This is what you want
        when the label the user reads differs from the identifier your backend expects.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FieldMapping } from '@msflib/vue'

const inputFields = ['Column 1', 'Column 2', 'Column 3']
const targetFieldsMap = {
  fld1: 'Field 1',
  fld2: 'Field 2',
  fld3: 'Field 3',
}

const mapping = ref([])

// mapping now looks like:
// [{ inputField: 'Column 1', targetField: 'fld1' },
//  { inputField: 'Column 2', targetField: 'fld2' },
//  { inputField: 'Column 3', targetField: 'fld3' }]
function onMapped(data) {
  mapping.value = data
}
</script>

<template>
  <FieldMapping
    :input-fields="inputFields"
    :target-fields="targetFieldsMap"
    header-bg-color="#eef2ff"
    @update:modelValue="onMapped"
  />
</template>`}</CodeBlock>

      <H3>3. Feeding a CSV import end to end</H3>
      <p>
        The realistic integration: parse the uploaded file's header row into{' '}
        <C>inputFields</C>, let the user map them, then transform raw rows with the
        emitted mapping before inserting. Always guard the submit against{' '}
        <C>undefined</C> targets — the component emits them for rows the user hasn't
        mapped yet.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FieldMapping } from '@msflib/vue'

const csvHeaders = ref([])
const mapping = ref([])

async function onFileChosen(event) {
  const text = await event.target.files[0].text()
  csvHeaders.value = text.split('\n')[0].split(',')
  mapping.value = [] // stale selections from a previous file make no sense here
}

function buildRows(rawRows) {
  if (mapping.value.some((m) => m.targetField === undefined)) {
    throw new Error('Every column must be mapped before importing.')
  }
  return rawRows.map((row) =>
    Object.fromEntries(
      mapping.value.map((m) => [m.targetField, row[m.inputField]]),
    ),
  )
}
</script>

<template>
  <input type="file" accept=".csv" @change="onFileChosen" />
  <FieldMapping
    v-if="csvHeaders.length"
    :input-fields="csvHeaders"
    :target-fields="{ id: 'ID', name: 'Product name', unitprice: 'Unit price' }"
    @update:modelValue="(m) => (mapping = m)"
  />
</template>`}</CodeBlock>

      <H3>4. Schema-driven system fields from your API</H3>
      <p>
        Both input lists are plain arrays, so in a real product the targets come from a
        metadata endpoint describing your model, and the sources come from the parsed
        file. The <C>update:modelValue</C> snapshot is then exactly the payload your
        import endpoint needs.
      </p>
      <CodeBlock lang="js">{`// /api/contacts/schema → machine keys + labels
const schemaRes = await fetch('/api/contacts/schema')
const schema = await schemaRes.json() // [{ key: 'full_name', label: 'Full name' }, …]

const targetFields = Object.fromEntries(
  schema.map((field) => [field.key, field.label]),
)
// → { full_name: 'Full name', email: 'Email', … }

// parse the CSV header row
csvHeaders.value = firstLine.split(',')

// submitted mapping, after the user maps every column:
// [{ inputField: 'Full Name', targetField: 'full_name' }, …]`}</CodeBlock>

      <Note>
        Row selections are component-internal (an array of per-row choices seeded
        empty) — a parent-supplied <C>modelValue</C> is not rendered back into the
        selects. Reset your workflow by changing <C>inputFields</C> and re-mounting if
        you need to restore a previously saved mapping.
      </Note>
      <Tip>
        Style the selects' host page accordingly: the component relies on a{' '}
        <C>fm-grid</C> CSS grid (4 columns, the column name spanning 3) — keep that class
        name unstyled or define it yourself to control widths.
      </Tip>
    </>
  )
}
