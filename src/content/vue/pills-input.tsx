import { A, B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function VuePillsInput() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>PillsInput</C> is a plain text input that turns comma-separated text into
        removable, colorable pills. It is not an Element Plus widget — it is a
        hand-rolled input plus an unordered list — with the <B>colord</B> library doing
        the color math. The bound value is an array of <C>{'{ text, color }'}</C>{' '}
        objects; the input itself always displays the pills joined by commas, and every
        edit splits the text on commas and rebuilds the array (preserving the color of
        pills whose text is unchanged).
      </p>
      <p>
        Each pill shows its text plus a small times icon that removes it; clicking the
        pill body selects it (emitting <C>itemSelected</C> with the index). With{' '}
        <C>withColor</C>, the component embeds the <A to="/vue/color-picker">ColorPicker</A>{' '}
        underneath the list, and the color you pick there is applied to the currently
        selected pill. Foreground text colors are derived from the pill background with
        colord, so light backgrounds get dark text and dark backgrounds get light text —
        or, with <C>useRelatedForeColor</C>, tonally related foreground colors ({' '}
        <C>darken(0.45)</C> / <C>lighten(0.4)</C>).
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Tag and keyword entry</B> — labels, recipients, permissions: many short
          values entered in one field instead of one input per value.
        </li>
        <li>
          <B>Colored, meaningful pills</B> — categories or statuses where the color itself
          carries information (e.g. <C>#800000</C> = urgent).
        </li>
        <li>
          <B>Round-trip editing</B> — pills that came from the server can be edited as
          plain comma text and keep their colors as long as their text matches.
        </li>
        <li>
          <B>FormBuilder integration</B> — the <C>etype: 'pills'</C> element mounts this
          widget, with <C>mdata.withColor</C> enabling the embedded picker.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<><C>modelValue</C> (v-model)</>, <C>Array</C>, <C>[]</C>, <>Pills <C>{'[{ text, color }]'}</C></>],
          [<C>inputPlaceholder</C>, <C>String</C>, '—', 'Placeholder for the text input'],
          [<C>withColor</C>, <C>Boolean</C>, <C>false</C>, <>Render the embedded <C>ColorPicker</C></>],
          [<C>useRelatedForeColor</C>, <C>Boolean</C>, <C>false</C>, 'Derive tonal foreground colors from the pill color'],
          [<C>id</C>, <C>String</C>, '—', 'Input id'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload', 'Notes']}
        rows={[
          [<C>update:modelValue</C>, 'pills array', 'On add/remove'],
          [<C>itemSelected</C>, 'pill index', 'Fired when an existing pill is clicked'],
        ]}
      />

      <H2>Color behavior</H2>
      <ul>
        <li>
          With <C>use-related-fore-color</C>: light pill colors get a darkened foreground
          (<C>darken(0.45)</C>), dark colors a lightened background (<C>lighten(0.4)</C>).
        </li>
        <li>Without it: black or white text depending on the pill's lightness.</li>
        <li>
          With <C>with-color</C>: the selected swatch is applied to the <B>last selected
          pill</B> (tracked internally by index).
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. Pre-colored tags from the server</H3>
      <p>
        Bind an array of <C>{'{ text, color }'}</C> objects — this is exactly the shape
        the library's own pills fixture uses. Users can add more by typing
        comma-separated text; untouched pills keep their colors across edits.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { PillsInput } from '@msflib/vue'

const pills = ref([
  { text: 'pill1', color: '#000000' },
  { text: 'pill2', color: '#eff0f0' },
  { text: 'pill3', color: '#fce2e2' },
  { text: 'pill4', color: '#800000' },
])
</script>

<template>
  <PillsInput v-model="pills" input-placeholder="Add tags, comma separated" />
</template>`}</CodeBlock>

      <H3>2. Inline color assignment with the embedded picker</H3>
      <p>
        With <C>with-color</C> and <C>use-related-fore-color</C>, click a pill to select
        it, then choose a swatch: the color is written onto that pill and its label gets
        a tonally related foreground color computed by colord, so text stays readable on
        light backgrounds like <C>#eff0f0</C>.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { PillsInput } from '@msflib/vue'

const pills = ref([{ text: 'urgent', color: '#800000' }])

// itemSelected fires with the pill's index when a pill is clicked
function onPillSelected(idx) {
  console.log('pill', idx, 'selected for recoloring')
}
</script>

<template>
  <PillsInput
    v-model="pills"
    with-color
    use-related-fore-color
    input-placeholder="Add tags, comma separated"
    @item-selected="onPillSelected"
  />
</template>`}</CodeBlock>

      <H3>3. A label manager that persists colors</H3>
      <p>
        A realistic app flow: load labels from an API, let the user edit them (add via
        comma text, remove via the times icon), then save only the pill data back. Because
        the model is the array itself, submission needs no transformation.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref, onMounted } from 'vue'
import { PillsInput } from '@msflib/vue'

const labels = ref([])

onMounted(async () => {
  const res = await fetch('/api/labels')
  labels.value = (await res.json()).map((l) => ({
    text: l.name,
    color: l.color || '',
  }))
})

async function save() {
  // [{ text, color }] — ready for the API
  await api.updateLabels(labels.value)
}
</script>

<template>
  <PillsInput
    v-model="labels"
    with-color
    id="label-editor"
    input-placeholder="Add labels, comma separated"
  />
  <button @click="save">Save labels</button>
</template>`}</CodeBlock>

      <H3>4. Pills element inside a FormBuilder schema</H3>
      <p>
        Inside <C>FormBuilder</C>, an <C>etype: 'pills'</C> element mounts this widget and
        the pills array lives at the element's model path — the library's pills fixture
        stores it at <C>formData.pills</C> with <C>mdata.withColor</C> switched on. Note
        the element declares <C>dtype: 'string'</C> but the widget writes an array.
      </p>
      <CodeBlock lang="js">{`const formData = ref({
  pills: [
    { text: 'pill1', color: '#000000' },
    { text: 'pill2', color: '#eff0f0' },
    { text: 'pill3', color: '#fce2e2' },
    { text: 'pill4', color: '#800000' },
  ],
})

const elements = [
  {
    name: 'pills',
    dtype: 'string',
    etype: 'pills',
    mdata: { withColor: true },
  },
]`}</CodeBlock>

      <Warning title="README drift">
        The component README bundled in the repo documents a <C>selectedIndex</C> prop and a{' '}
        <C>select:index</C> event — neither exists in code. The real API is the one on this
        page (event <C>itemSelected</C>, no selection prop).
      </Warning>
      <Note>
        The input's helper line ("Add your value seperated by a comma (,)" — sic) is
        hard-coded in the template, as is the <C>fa-solid fa-times</C> FontAwesome remove
        icon; make sure FontAwesome is loaded in your host app.
      </Note>
    </>
  )
}
