import { B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function VueStatusProgress() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>StatusProgress</C> is a horizontal stepper for ordered statuses — order
        pipelines, fulfillment tracking, onboarding steps. It draws one gradient segment
        per status connected by round check badges, fills every segment up to and
        including the current status with its own color, leaves the rest in{' '}
        <C>disabledStatusColor</C> (default <C>gray</C>), and prints each status's{' '}
        <C>label</C> underneath in the status's color once reached.
      </p>
      <p>
        It is purely presentational and fully model-driven: pass a <C>statusList</C> of{' '}
        <C>{'{ name, label, order, color }'}</C> entries (the component sorts them by{' '}
        <C>order</C>) and a <C>currentStatus</C> name. The current status is matched by
        its <C>name</C> and its <C>order</C> value then decides how much of the bar is
        filled — unknown names resolve to order <C>-1</C>, i.e. nothing filled. There are
        no events; when a step completes, update <C>currentStatus</C> yourself (from a
        webhook, a poll or a status transition in your store) and the bar re-renders.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Order and shipment tracking</B> — placed → paid → shipped → delivered,
          driven by an order status field from your API.
        </li>
        <li>
          <B>Multi-stage onboarding</B> — account → profile verified → first project,
          where completed steps stay highlighted as the user advances.
        </li>
        <li>
          <B>Custom per-step colors</B> — each status carries its own color, so a
          "delivered" green and a "cancelled" red can live on the same bar.
        </li>
        <li>
          <B>Read-only progress display</B> — no events, no selection; the source of
          truth stays in your application state.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>statusList</C>, <C>Array</C>, <C>[]</C>, <>Items <C>{'{ name, label, order, color }'}</C>, sorted by order</>],
          [<C>currentStatus</C>, <C>String</C>, <C>''</C>, <>Name of the current status (matched via the <C>order</C> field)</>],
          [<C>disabledStatusColor</C>, <C>String</C>, <C>'gray'</C>, 'Color of not-yet-reached segments'],
        ]}
      />

      <H2>Notes</H2>
      <ul>
        <li>No events — purely presentational.</li>
        <li>
          Steps up to and including <C>currentStatus</C> are filled; the rest use{' '}
          <C>disabledStatusColor</C>.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. A three-step delivery tracker</H3>
      <p>
        The canonical usage: an order at the "shipped" stage shows placed and shipped
        filled with the blue-to-blue gradient and delivered still gray, with the first
        two labels colored and the last one gray.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { StatusProgress } from '@msflib/vue'
</script>

<template>
  <StatusProgress
    :status-list="[
      { name: 'placed', label: 'Placed', order: 1, color: '#3770ec' },
      { name: 'shipped', label: 'Shipped', order: 2, color: '#3770ec' },
      { name: 'delivered', label: 'Delivered', order: 3, color: '#22c55e' },
    ]"
    current-status="shipped"
  />
</template>`}</CodeBlock>

      <H3>2. Driven by an order object from your API</H3>
      <p>
        In a real app the status list usually describes a fixed pipeline and{' '}
        <C>currentStatus</C> comes from the order record. Bind both as props and the bar
        updates whenever the order data refreshes.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref, onMounted } from 'vue'
import { StatusProgress } from '@msflib/vue'

const order = ref(null)

const pipeline = [
  { name: 'pending', label: 'Pending', order: 1, color: '#f59e0b' },
  { name: 'received', label: 'Received', order: 2, color: '#3770ec' },
  { name: 'in_transit', label: 'In transit', order: 3, color: '#3770ec' },
  { name: 'delivered', label: 'Delivered', order: 4, color: '#22c55e' },
]

onMounted(async () => {
  const res = await fetch('/api/orders/42')
  order.value = await res.json()
})
</script>

<template>
  <StatusProgress
    v-if="order"
    :status-list="pipeline"
    :current-status="order.status"
  />
</template>`}</CodeBlock>

      <H3>3. A soft tone for unreached steps</H3>
      <p>
        <C>disabledStatusColor</C> controls everything before the current status — pick a
        tinted gray that matches your theme instead of the flat default. Here an
        onboarding tracker at the second step uses a light slate for the not-yet-reached
        segments and their badges.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { StatusProgress } from '@msflib/vue'

const signupStep = ref('profile')

const steps = [
  { name: 'account', label: 'Account created', order: 1, color: '#6366f1' },
  { name: 'profile', label: 'Profile filled', order: 2, color: '#6366f1' },
  { name: 'invited', label: 'Team invited', order: 3, color: '#6366f1' },
]
</script>

<template>
  <StatusProgress
    :status-list="steps"
    current-status="profile"
    disabled-status-color="#e2e8f0"
  />
</template>`}</CodeBlock>

      <H3>4. Advancing the tracker from application logic</H3>
      <p>
        Since there are no events, the pattern is one-way: your code mutates{' '}
        <C>currentStatus</C> as stages complete — here after a successful API
        transition — and the stepper follows. Any status name that is not in the list
        simply leaves the bar unfilled, which doubles as a safe default for unknown
        states.
      </p>
      <CodeBlock lang="js">{`import { ref } from 'vue'

const currentStatus = ref('placed')
const order = ref({ id: 42 })

async function advanceTo(next) {
  await api.transitionOrder(order.value.id, next)
  currentStatus.value = next // bar fills up to this status
}

// e.g. advanceTo('shipped')

// unknown statuses leave everything gray:
currentStatus.value = 'cancelled' // not in statusList → order -1, nothing filled`}</CodeBlock>

      <Note>
        The component sorts <C>statusList</C> by <C>order</C> internally, so the array
        order you pass does not matter — but each entry needs a unique numeric{' '}
        <C>order</C> for the fill logic to work.
      </Note>
      <Warning title="Status names are case-sensitive">
        <C>currentStatus</C> is matched against <C>status.name</C> with an exact string
        comparison — <C>"Shipped"</C> does not match <C>"shipped"</C>. Keep names
        lowercase (or normalize them) on both sides. The check badges also assume
        FontAwesome (<C>fa-solid fa-check</C>) is loaded in the host app.
      </Warning>
    </>
  )
}
