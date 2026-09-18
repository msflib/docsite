import { A, B, C, CodeBlock, H2, H3, Note, Table, Tip } from '../../components/md'

export default function VuePaginationTab() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>PaginationTab</C> is a compact pagination footer in one row: on the left a
        "Show rows:" label plus an <C>el-select</C> of page sizes, on the right an{' '}
        <C>el-pagination</C> bar in <C>background</C> mode with the{' '}
        <C>prev, pager, next</C> layout. It is the same footer <A to="/vue/table-widget">TableWidget</A>{' '}
        renders internally, extracted so you can paginate anything else with the same
        look.
      </p>
      <p>
        Both paging values are two-way bindings via <C>defineModel</C>:{' '}
        <C>v-model:currentPage</C> (default <C>1</C>) and <C>v-model:pageSize</C>{' '}
        (default <C>10</C>). Changing either fires a dedicated event — <C>pageChange</C>{' '}
        or <C>sizeChange</C> — with the new value, so you can react to user intent
        without diffing the models. Note that the component itself never slices data:{' '}
        <C>total</C> is just a number for the pager's arithmetic; rendering the visible
        slice (or fetching it) is your job.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Client-side paging</B> — a computed slice over an array you already hold in
          memory, with the page-size selector included.
        </li>
        <li>
          <B>Server-side paging</B> — wire <C>@page-change</C>/<C>@size-change</C> to a
          fetch and put the response count into <C>total</C>.
        </li>
        <li>
          <B>Visual consistency with TableWidget</B> — custom grids and lists that should
          page exactly like the library's table.
        </li>
        <li>
          <B>Programmatic paging</B> — set <C>currentPage</C> from your own state (deep
          links, "jump to first page after filtering") and the pager follows.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>total</C>, <C>Number</C>, '—', 'Total record count'],
          [<C>pageSizes</C>, <C>Array</C>, <C>[5, 10, 15, 20]</C>, 'Options for the "Show rows" select'],
        ]}
      />
      <p>
        <B>v-model bindings:</B> <C>v-model:currentPage</C> (default <C>1</C>),{' '}
        <C>v-model:pageSize</C> (default <C>10</C>).
      </p>

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload']}
        rows={[
          [<C>pageChange</C>, 'current page'],
          [<C>sizeChange</C>, 'page size'],
        ]}
      />

      <H2>Examples</H2>

      <H3>1. The basic footer</H3>
      <p>
        Wire up the two models and the total; the pager handles the rest. The{' '}
        <C>pageChange</C>/<C>sizeChange</C> events (camelCase — unlike Element Plus's
        kebab <C>current-change</C>) tell you when the user acted.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { PaginationTab } from '@msflib/vue'

const page = ref(1)
const size = ref(10)

function reload() {
  // called from @page-change and @size-change below
  fetchRows({ page: page.value, pageSize: size.value })
}
</script>

<template>
  <PaginationTab
    :total="57"
    v-model:currentPage="page"
    v-model:pageSize="size"
    @page-change="reload"
    @size-change="reload"
  />
</template>`}</CodeBlock>

      <H3>2. Slicing a client-side array</H3>
      <p>
        When all rows are already in memory, compute the visible slice from the two
        models — the same arithmetic the widget uses internally:{' '}
        <C>(currentPage - 1) * pageSize</C> as start index, <C>pageSize</C> items after
        it.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { computed, ref } from 'vue'
import { PaginationTab } from '@msflib/vue'

const page = ref(1)
const size = ref(10)
const rows = ref([/* … all 57 orders … */])

const visibleRows = computed(() => {
  const start = (page.value - 1) * size.value
  return rows.value.slice(start, start + size.value)
})
</script>

<template>
  <!-- render visibleRows in your list/table -->
  <ul>
    <li v-for="row in visibleRows" :key="row.id">{{ row.name }}</li>
  </ul>

  <PaginationTab
    :total="rows.length"
    v-model:currentPage="page"
    v-model:pageSize="size"
  />
</template>`}</CodeBlock>

      <H3>3. Server-side paging with query parameters</H3>
      <p>
        For large datasets, treat the models as request state: every event (and any
        programmatic change) triggers a fetch keyed by page and size, and the server's
        total is written back into <C>total</C>.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref, watch } from 'vue'
import { PaginationTab } from '@msflib/vue'

const page = ref(1)
const size = ref(10)
const total = ref(0)
const rows = ref([])

async function fetchPage() {
  const res = await fetch(\`/api/orders?page=\${page.value}&pageSize=\${size.value}\`)
  const data = await res.json()
  rows.value = data.items
  total.value = data.total
}

watch([page, size], fetchPage, { immediate: true })
</script>

<template>
  <PaginationTab
    :total="total"
    :page-sizes="[10, 25, 50]"
    v-model:currentPage="page"
    v-model:pageSize="size"
  />
</template>`}</CodeBlock>

      <H3>4. Resetting to page 1 when filters change</H3>
      <p>
        Because <C>currentPage</C> is a model, your code can drive it. A common
        integration: when a search filter changes, jump back to the first page so the
        pager never points past the last result.
      </p>
      <CodeBlock lang="js">{`import { ref, watch } from 'vue'

const page = ref(1)
const size = ref(10)
const searchText = ref('')

// when the filter changes, restart from the first page
watch(searchText, () => {
  page.value = 1
})`}</CodeBlock>

      <Note>
        The component does not clamp <C>currentPage</C> when <C>total</C> shrinks — if
        your dataset changes, set the page yourself (see example 4).
      </Note>
      <Tip>
        Keep <C>pageSizes</C> sorted ascending; the values feed an{' '}
        <C>el-select</C> directly and the pager derives pages per selected size.
      </Tip>
    </>
  )
}
