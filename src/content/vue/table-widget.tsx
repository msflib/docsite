import { B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function VueTableWidget() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>TableWidget</C> builds on Element Plus's <C>el-table</C> and adds the things
        product tables always need: column control, multi-select that survives
        pagination/sorting, word-based client search, custom sorting, cell pre-rendering and
        a trailing row-menu dropdown wired to a built-in <C>PaginationTab</C>. You feed it a
        plain array of row objects; the keys of the first row become the columns.
      </p>
      <p>
        Columns are generated, not declared: <C>include</C>/<C>exclude</C> filter the keys,
        <C>columnOrder</C> arranges them, and <C>headerMap</C> renames them (falling back to
        the capitalized key). Object cells are rendered specially —{' '}
        <C>{'{ type: "image", image }'}</C> becomes a 40px rounded <C>el-image</C> and{' '}
        <C>{'{ type: "status", status }'}</C> becomes a colored <C>el-tag</C>.{' '}
        <C>cellPrerender</C> formats any cell's display string, and is even folded into the
        search index.
      </p>
      <p>
        Selection is where the wrapper earns its keep: the checkbox column reports both{' '}
        <C>v-model:selectedRows</C> (indexes over the full, unpaginated dataset) and{' '}
        <C>v-model:selectedData</C> (the row objects). Selections are deliberately
        preserved across page changes and sort operations — user-driven changes emit{' '}
        <C>multi-select</C>, while pagination/sorting-induced selection resets are
        suppressed. Every row also ends with a "more" dropdown rendering your{' '}
        <C>menuItems</C>, emitting <C>menu-item-clicked</C> with the chosen item and row.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Admin CRUD tables</B> — inventory, orders, users: JSON in, sortable/searchable
          table out, with no per-column markup.
        </li>
        <li>
          <B>Cross-page multi-select</B> — "select these 12 rows", paginate, and the
          selection (by index) is still there.
        </li>
        <li>
          <B>A search box in one prop</B> — bind <C>filterText</C> to your input and any
          word of the query filters the rows client-side.
        </li>
        <li>
          <B>Row actions</B> — edit/delete menus per row without hand-building an
          el-dropdown column.
        </li>
      </ul>

      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { TableWidget } from '@msflib/vue'

const rows = ref([
  { id: 1, code: 'A1', name: 'Widget', status: { type: 'status', status: 'Received' } },
  { id: 2, code: 'A2', name: 'Gadget', status: { type: 'status', status: 'pending' } },
])
const selected = ref([])
const menu = [
  { name: 'edit', label: 'Edit' },
  { name: 'delete', label: 'Delete' },
]

function onMenu(item, row) {
  if (item.name === 'delete') console.log('delete', row)
}
</script>

<template>
  <TableWidget
    :table-data="rows"
    :menu-items="menu"
    :sortable="['code', 'name']"
    :exclude="['id']"
    :header-map="[{ name: 'code', value: 'SKU' }]"
    v-model:selected-rows="selected"
    @menu-item-clicked="onMenu"
  />
</template>`}</CodeBlock>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>tableData</C>, <C>Array</C>, <C>[]</C>, 'Row objects; keys of the first row become columns'],
          [<C>checkbox</C>, <C>Boolean</C>, <C>true</C>, 'Show the selection column (only when data is present)'],
          [<C>sortable</C>, <C>Array</C>, <C>[]</C>, 'Keys that get client-side custom sorting'],
          [<C>menuItems</C>, <C>Array</C>, <C>[]</C>, <>Rendered in the row-end dropdown: <C>{'[{ name, label }]'}</C></>],
          [<C>include</C>, <C>Array</C>, <C>[]</C>, 'Whitelist of keys to show (wins over exclude)'],
          [<C>exclude</C>, <C>Array</C>, <C>['id']</C>, 'Keys to hide'],
          [<C>columnOrder</C>, <C>Array</C>, <C>[]</C>, 'Preferred column order (remaining keys appended)'],
          [<C>headerMap</C>, <C>Array</C>, <C>[]</C>, <>Header renames <C>{'[{ name, value }]'}</C>; falls back to capitalized key</>],
          [<C>filterText</C>, <C>String</C>, <C>''</C>, 'Space-separated word search across stringified cells'],
          [<C>pageSizes</C>, <C>Array</C>, <C>[5, 10, 15, 20]</C>, 'Page-size options for the pagination footer'],
          [<C>cellPrerender</C>, <C>Function</C>, '—', <><C>(cellValue, key) =&gt; displayString</C> hook for any cell</>],
          [<C>evenRowClass / oddRowClass</C>, <C>String</C>, <C>''</C>, 'Zebra row classes'],
          [<C>rowClass</C>, <C>String</C>, <C>''</C>, 'Class on every body row'],
          [<C>headerClass / headerCellClass / cellClass</C>, <C>String</C>, <C>''</C>, 'Class hooks for header / header cells / cells'],
          [<C>id</C>, <C>String</C>, '—', 'el-table id'],
        ]}
      />

      <H3>v-model bindings</H3>
      <Table
        head={['Binding', 'Type', 'Default', 'Notes']}
        rows={[
          [<C>v-model:currentPage</C>, <C>Number</C>, <C>1</C>, 'Active page'],
          [<C>v-model:pageSize</C>, <C>Number</C>, <C>10</C>, 'Rows per page'],
          [<C>v-model:selectedRows</C>, <C>Array</C>, <C>[]</C>, 'Selected row indexes (0-based over the full, unpaginated dataset; preserved across pages)'],
          [<C>v-model:selectedData</C>, <C>Array</C>, <C>[]</C>, 'Selected row objects, kept reactive'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload', 'Notes']}
        rows={[
          [<C>row-clicked</C>, 'row, column, event', 'Suppressed for the menu column'],
          [<C>multi-select</C>, 'rows', 'Only on real user selection'],
          [<C>selection-change</C>, 'rows', 'Fires on every selection event, including pagination resets'],
          [<C>menu-item-clicked</C>, 'item, row', 'Row-end dropdown action'],
          [<C>sort-change</C>, 'sort state', 'Pass-through from el-table'],
        ]}
      />

      <H2>Special cell values</H2>
      <p>Object cells are rendered specially:</p>
      <ul>
        <li>
          <C>{'{ type: "image", image: url }'}</C> → 40px rounded <C>el-image</C>
        </li>
        <li>
          <C>{'{ type: "status", status: "pending" }'}</C> → <C>el-tag</C> with status
          colors — <C>pending</C> → warning, <C>received</C>/<C>closed</C> → success,{' '}
          <C>in transit</C> → info, <C>cancelled</C> → danger
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. Product inventory list with renamed headers</H3>
      <p>
        The stock-list case from the library's own fixture: rows carry{' '}
        <C>id/code/name/category/line/unitprice/totalstock/instock/status</C> keys, the
        numeric headers get human names via <C>headerMap</C>, <C>id</C> is excluded and a
        few keys are client-sortable. The built-in <C>PaginationTab</C> appears
        automatically.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { TableWidget } from '@msflib/vue'

const rows = ref([
  { id: 1, code: '1221', name: 'German Juice', category: 'Juice', line: '11', unitprice: 2500, totalstock: 100, instock: 80, status: 'Received' },
  { id: 2, code: '2222', name: 'Fruit Juice', category: 'Juice', line: '12', unitprice: 2200, totalstock: 60, instock: 0, status: 'Pending' },
  // …
])

const headerMap = [
  { name: 'unitprice', value: 'Unit Price' },
  { name: 'totalstock', value: 'Total Stock' },
  { name: 'instock', value: 'Available' },
]
</script>

<template>
  <TableWidget
    :table-data="rows"
    :exclude="['id']"
    :sortable="['code', 'name', 'status']"
    :header-map="headerMap"
  />
</template>`}</CodeBlock>

      <H3>2. Row actions and cross-page selection</H3>
      <p>
        Add an action menu with <C>menuItems</C> and track selection with the two
        selection models: <C>selectedRows</C> holds indexes into the full dataset
        (surviving pagination and sorting), while <C>selectedData</C> holds the row
        objects. The library's test app pre-selects rows exactly this way —{' '}
        <C>selections = ref([1, 2, 3, 5, 6])</C>.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { TableWidget } from '@msflib/vue'

const rows = ref([/* … stock rows … */])
const selections = ref([1, 2])     // row indexes, pre-selected
const selectedData = ref([])       // kept in sync by the widget

const menuItems = [
  { name: 'edit', label: 'Edit' },
  { name: 'delete', label: 'Delete' },
]

function onMenuItem(item, row) {
  if (item.name === 'edit') openEditor(row)
  if (item.name === 'delete') confirmDelete([row])
}

async function deleteSelected() {
  await api.deleteProducts(selectedData.value)
}
</script>

<template>
  <button @click="deleteSelected">Delete selected</button>
  <TableWidget
    :table-data="rows"
    :menu-items="menuItems"
    v-model:selectedRows="selections"
    v-model:selectedData="selectedData"
    @multi-select="(vals) => console.log(vals.length, 'rows picked')"
    @row-clicked="(row) => openDetail(row)"
    @menu-item-clicked="onMenuItem"
  />
</template>`}</CodeBlock>

      <H3>3. Search box, status tags and image cells</H3>
      <p>
        Rich cells come from object values in the data: a{' '}
        <C>{'{ type: "status", status }' }</C> cell renders a colored <C>el-tag</C>{' '}
        (recognized keywords, lowercased: <C>pending</C>, <C>received</C>,{' '}
        <C>closed</C>, <C>in transit</C> — with a space — and <C>cancelled</C>), and{' '}
        <C>{'{ type: "image", image }' }</C> renders a 40px thumbnail. A plain input
        bound to <C>filterText</C> gives word-based client filtering across all cells.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { TableWidget } from '@msflib/vue'

const searchText = ref('')
const rows = ref([
  {
    id: 1,
    name: 'German Juice',
    unitprice: 2500,
    status: { type: 'status', status: 'Received' },
    avatar: { type: 'image', image: '/img/german-juice.png' },
  },
  {
    id: 2,
    name: 'Fruit Juice',
    unitprice: 2200,
    status: { type: 'status', status: 'Pending' },
    avatar: { type: 'image', image: '/img/fruit-juice.png' },
  },
  // …
])
</script>

<template>
  <input v-model="searchText" placeholder="Search products…" />
  <TableWidget
    :table-data="rows"
    :filter-text="searchText"
    :exclude="['id']"
  />
</template>`}</CodeBlock>

      <H3>4. Pagination, column order and cell pre-rendering</H3>
      <p>
        Page and page-size are two-way bindings backed by the embedded{' '}
        <C>PaginationTab</C>. <C>columnOrder</C> pins the leading columns (the remaining
        keys follow in data order), and <C>cellPrerender</C> formats any cell for display
        — here turning the numeric <C>unitprice</C> into a currency string.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { TableWidget } from '@msflib/vue'

const page = ref(1)
const size = ref(5)
const rows = ref([/* … dozens of stock rows … */])

// formats the display string of every cell; object cells pass through too
function formatCell(value, key) {
  if (value && typeof value === 'object') return ''
  if (key === 'unitprice') return 'NGN ' + Number(value).toLocaleString()
  return String(value ?? '')
}
</script>

<template>
  <TableWidget
    :table-data="rows"
    v-model:currentPage="page"
    v-model:pageSize="size"
    :page-sizes="[5, 10, 15, 20]"
    :column-order="['name', 'category', 'unitprice', 'status']"
    :sortable="['unitprice']"
    :cell-prerender="formatCell"
    :even-row-class="'bg-gray-50'"
  />
</template>`}</CodeBlock>

      <H2>Gotchas</H2>
      <ul>
        <li>
          Column keys come from the <B>first row</B> of <C>tableData</C>; rows with extra
          keys won't get columns.
        </li>
        <li>
          <C>edit</C>, <C>tableTitle</C>, <C>defaultSort</C> props and the{' '}
          <C>delete-clicked</C> / <C>edit-clicked</C> / <C>dialog-open</C> events are
          declared but have no effect (legacy surface).
        </li>
        <li>Empty tables show a "No Data" / "No data provided yet" placeholder.</li>
      </ul>
      <Note>
        Sorting sorts the widget's internal copy in place and restores it from{' '}
        <C>tableData</C> when the sort is cleared — keep passing fresh row objects if the
        underlying data changes while a sort is active.
      </Note>
      <Warning title="Status keywords are fixed">
        The <C>el-tag</C> coloring only recognizes the five keywords listed above
        (matched after lowercasing). A status like <C>In-transit</C> (hyphenated) falls
        through to the default tag style — normalize your data to <C>in transit</C> if
        you want the info color.
      </Warning>
    </>
  )
}
