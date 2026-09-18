import { A, B, C, CodeBlock, H2, H3, Table, Warning } from '../../components/md'

export default function VueAutoComplete() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>AutoCompleteInput</C> is a thin wrapper around Element Plus's{' '}
        <C>el-autocomplete</C> (clearable, full-width) that accepts either a static{' '}
        <C>items</C> array or an async <C>searchCallback</C>. It is also the widget
        FormBuilder mounts for <C>etype: 'autocomplete'</C> elements, with <C>items</C>{' '}
        and <C>searchCallback</C> passed through <C>mdata</C>.
      </p>
      <p>
        In static mode the component filters <C>items</C> client-side with a
        case-insensitive substring match on each entry's <C>value</C> property — so
        entries must be shaped <C>{'[{ value: "…" }, …]'}</C>. When{' '}
        <C>searchCallback</C> is provided it takes precedence: the callback receives the
        query string, can await an API call, and its resolved array is handed straight to
        el-autocomplete's suggestion dropdown. Only <B>selecting</B> a suggestion emits{' '}
        <C>update:modelValue</C> (with the entry's <C>value</C>); typing only emits the
        raw text through <C>input</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Free text with guidance</B> — the user may type anything, but known values
          are one click away; unlike <A to="/vue/select-list">SelectList</A> nothing is
          enforced.
        </li>
        <li>
          <B>Server-backed search</B> — debounce-friendly async lookups via{' '}
          <C>searchCallback</C> that hit your endpoint per keystroke.
        </li>
        <li>
          <B>Static curated lists</B> — categories, tags or recent items filtered
          entirely in the browser with zero network calls.
        </li>
        <li>
          <B>Schema-driven forms</B> — as the <C>autocomplete</C> element type inside{' '}
          <C>FormBuilder</C>.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>items</C>, <C>Array</C>, <C>[]</C>, <>Static suggestions <C>{'[{ value: "…" }]'}</C>, filtered client-side</>],
          [<C>searchCallback</C>, <C>Function</C>, '—', <><C>async (query) =&gt; suggestions[]</C>; takes precedence over <C>items</C></>],
          [<C>id</C>, <C>String</C>, '—', 'Input id'],
          [<C>placeholder</C>, <C>String</C>, '—', 'Placeholder text'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload', 'When']}
        rows={[
          [<C>update:modelValue</C>, 'selected suggestion', 'Only on select of a suggestion'],
          [<C>input</C>, 'raw text', 'On every keystroke'],
        ]}
      />

      <Warning title="Not fully controlled">
        The component keeps its own internal input state. A parent-supplied{' '}
        <C>modelValue</C> is <B>not</B> reflected back into the field — treat it as
        write-on-select. If you need fully controlled input, drive it through{' '}
        <C>:search-callback</C> + <C>@input</C>.
      </Warning>

      <H2>Examples</H2>

      <H3>1. Static list filtered in the browser</H3>
      <p>
        The simplest usage: pass an array of <C>{'{ value }'}</C> entries and the
        component does case-insensitive substring filtering on every keystroke — no
        network involved. The selected value lands in your state via{' '}
        <C>update:modelValue</C>.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { AutoCompleteInput } from '@msflib/vue'

const category = ref('')

const frameworks = [
  { value: 'Vue' },
  { value: 'React' },
  { value: 'Angular' },
  { value: 'Svelte' },
]
</script>

<template>
  <AutoCompleteInput
    :items="frameworks"
    placeholder="Search framework"
    @update:modelValue="(v) => (category = v)"
  />
</template>`}</CodeBlock>

      <H3>2. Async suggestions from an API</H3>
      <p>
        Provide <C>searchCallback</C> and it replaces the static filter: each keystroke
        calls your function with the query string, and whatever array it resolves with
        (already shaped as <C>{'[{ value }]'}</C>) populates the dropdown. Perfect for
        debounced endpoint searches.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { AutoCompleteInput } from '@msflib/vue'

const fetchSuggestions = async (query) => {
  const res = await fetch(\`/api/search?q=\${query}\`)
  return (await res.json()).map((r) => ({ value: r.name }))
}
</script>

<template>
  <AutoCompleteInput :search-callback="fetchSuggestions" placeholder="Search library" />
</template>`}</CodeBlock>

      <H3>3. Static and callback entries side by side (FormBuilder schema)</H3>
      <p>
        Inside a <C>FormBuilder</C> schema, <C>items</C> and <C>searchCallback</C> are
        passed through <C>mdata</C>. This mirrors the library's own fixture setup: a
        static category picker and a callback-driven field in the same form.
      </p>
      <CodeBlock lang="js">{`const searchCallback = (query) => {
  // hit your API here; the fixture simply returns canned results
  return [{ value: 'Random 1' }, { value: 'Random 2' }, { value: 'Random 3' }]
}

const elements = [
  {
    name: 'category',
    dtype: 'autocomplete',
    etype: 'autocomplete',
    placeholder: 'Auto Complete',
    width: 48,
    mdata: {
      items: [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
      ],
    },
  },
  {
    name: 'supplier',
    etype: 'autocomplete',
    placeholder: 'Auto Complete Callback',
    width: 48,
    mdata: {
      items: [/* … */],
      searchCallback,
    },
  },
]`}</CodeBlock>

      <H3>4. Tracking typed text vs. selected value</H3>
      <p>
        Because <C>update:modelValue</C> only fires on selection, use <C>@input</C> to
        mirror what the user is currently typing — for example to show a live result
        count or to enable a "create new" action when no suggestion matches.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { AutoCompleteInput } from '@msflib/vue'

const selected = ref('')
const typed = ref('')

const existing = [
  { value: 'vue' },
  { value: 'vuex' },
  { value: 'vue-router' },
  { value: 'babel' },
]
</script>

<template>
  <AutoCompleteInput
    :items="existing"
    placeholder="Pick or type a category"
    @update:modelValue="(v) => (selected = v)"
    @input="(t) => (typed = t)"
  />
  <p v-if="typed && typed !== selected">
    No exact match for "{{ typed }}" yet.
  </p>
</template>`}</CodeBlock>

      <Warning title="Value matching is by lowercase 'value' substring">
        The built-in client filter lowercases each entry's <C>value</C> property and the
        query, so entries without a string <C>value</C> break the filter. Shape your data
        (or map API results) to <C>{'[{ value }]'}</C> before passing them in.
      </Warning>
    </>
  )
}
