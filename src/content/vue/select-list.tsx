import { C, CodeBlock, H2, H3, Table, Tip, Warning, B } from '../../components/md'

export default function VueSelectList() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>SelectList</C> wraps Element Plus's <C>el-select</C> + <C>el-option</C> pair
        into a model-bound dropdown. You pass an <C>options</C> array of{' '}
        <C>{'{ label, value }'}</C> entries and bind a value with <C>v-model</C>; the
        component forwards <C>valueKey</C> to <C>el-select</C> so object-valued options
        match correctly. It is the widget FormBuilder mounts for <C>dtype: 'list'</C>{' '}
        elements, with <C>options</C> (and optionally <C>valueKey</C>) arriving via{' '}
        <C>mdata</C>.
      </p>
      <p>
        The wrapper is deliberately minimal: three props, one event. Options are rendered
        with a plain <C>v-for</C> using the array index as key, values are passed through
        untouched (strings, numbers or objects), and the only emitted event is{' '}
        <C>update:modelValue</C>. For anything fancier — option groups, remote search,
        multiple selection, custom option templates — use <C>el-select</C> directly.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Simple choice fields</B> — sizes, categories, statuses: a fixed list of
          options rendered from data rather than hand-written markup.
        </li>
        <li>
          <B>Object-valued options</B> — bind whole objects (e.g.{' '}
          <C>{'{ name: "Extra Large" }'}</C>) with <C>valueKey</C> so el-select can
          compare them by identity of one field.
        </li>
        <li>
          <B>Options fetched at runtime</B> — the array can come from an API response and
          be passed down reactively.
        </li>
        <li>
          <B>Schema-driven forms</B> — the <C>list</C> element type inside{' '}
          <C>FormBuilder</C>, including nested paths like{' '}
          <C>variations.0.selected</C>.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<><C>modelValue</C> (v-model)</>, <C>String | Object</C>, <C>''</C>, 'Selected value'],
          [<C>options</C>, <C>Array</C>, <C>[]</C>, <><C>{'[{ label, value }]'}</C></>],
          [<C>valueKey</C>, <C>String</C>, '—', <>Pass-through to <C>el-select</C> when <C>value</C> is an object</>],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload']}
        rows={[[<C>update:modelValue</C>, 'selected option value']]}
      />

      <Tip>
        When options carry object values (<C>value: {'{ name: "XL" }'}</C>), set{' '}
        <C>valueKey: 'name'</C> so <C>el-select</C> can match and display them correctly —
        the same pattern the FormBuilder docs use for variation selectors.
      </Tip>

      <H2>Examples</H2>

      <H3>1. A string-valued dropdown</H3>
      <p>
        The basic case: options with primitive values, the selected value stored in a
        ref. Nothing else is needed.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { SelectList } from '@msflib/vue'

const size = ref('')
const options = [
  { label: 'Small', value: 'S' },
  { label: 'Large', value: 'L' },
]
</script>

<template>
  <SelectList v-model="size" :options="options" />
</template>`}</CodeBlock>

      <H3>2. Object-valued options with valueKey</H3>
      <p>
        When each option's <C>value</C> is an object, <C>el-select</C> needs{' '}
        <C>valueKey</C> to know which field identifies (and displays) the choice. The
        model then holds the whole object, ready to submit or to write into nested
        variation paths.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { SelectList } from '@msflib/vue'

const variation = ref({
  name: 'size',
  label: 'Size',
  selected: { name: 'Extra Large' },
})

const sizeOptions = [
  { label: 'Extra Large', value: { name: 'Extra Large' } },
  { label: 'Large', value: { name: 'Large' } },
  { label: 'Medium', value: { name: 'Medium' } },
]
</script>

<template>
  <SelectList
    v-model="variation.selected"
    :options="sizeOptions"
    value-key="name"
  />
</template>`}</CodeBlock>

      <H3>3. Options fetched from an API</H3>
      <p>
        The <C>options</C> array is plain data, so it can be populated asynchronously.
        Because the wrapper renders with a <C>v-for</C> over the array, updating the ref
        is enough — no re-mount required.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref, onMounted } from 'vue'
import { SelectList } from '@msflib/vue'

const category = ref('')
const options = ref([])

onMounted(async () => {
  const res = await fetch('/api/categories')
  const data = await res.json()
  options.value = data.map((c) => ({ label: c.title, value: c.slug }))
})
</script>

<template>
  <SelectList v-model="category" :options="options" />
</template>`}</CodeBlock>

      <H3>4. List elements inside a FormBuilder schema</H3>
      <p>
        Inside <C>FormBuilder</C>, <C>dtype: 'list'</C> elements take their options (and{' '}
        <C>valueKey</C>) through <C>mdata</C>, and their element <C>name</C> is a
        dot-path into the form model. This is exactly how the library's own
        add-product fixture wires variation selectors.
      </p>
      <CodeBlock lang="js">{`const formData = ref({
  variations: [{ selected: null }, { selected: null }],
})

const elements = [
  {
    name: 'variations.0.selected',
    dtype: 'list',
    placeholder: 'Size',
    width: 48,
    mdata: {
      valueKey: 'name',
      options: [
        { label: 'Extra Large', value: { name: 'Extra Large' } },
        { label: 'Large', value: { name: 'Large' } },
      ],
    },
  },
  {
    name: 'variations.1.selected',
    dtype: 'list',
    placeholder: 'Flavour',
    width: 48,
    mdata: {
      valueKey: 'name',
      options: [
        { label: 'Chocolate', value: { name: 'Chocolate' } },
        { label: 'Vanilla', value: { name: 'Vanilla' } },
      ],
    },
  },
]`}</CodeBlock>

      <Warning title="Options use label/value — not items">
        The prop is <C>options</C>. Inside <C>FormBuilder</C> some older fixtures pass{' '}
        <C>mdata:{' { items }'}</C>, but the underlying <C>SelectList</C> reads{' '}
        <C>options</C> — prefer <C>mdata:{' { options }'}</C> (with{' '}
        <C>valueKey</C> for object values) so the dropdown actually populates.
      </Warning>
      <p>
        <B>Related:</B> for free-text-with-suggestions, see{' '}
        <C>AutoCompleteInput</C> instead — <C>SelectList</C> only accepts values from
        its option list.
      </p>
    </>
  )
}
