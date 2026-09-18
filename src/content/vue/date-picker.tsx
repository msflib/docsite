import { B, C, CodeBlock, H2, H3, Note, Table, Tip } from '../../components/md'

export default function VueDatePicker() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>DatePicker</C> is a passthrough wrapper around Element Plus's{' '}
        <C>el-date-picker</C>. It forwards exactly five props — <C>modelValue</C>,{' '}
        <C>placeholder</C>, <C>type</C>, <C>format</C> and <C>valueFormat</C> — and
        re-emits <C>update:modelValue</C> on every change, so the value you bind stays a
        plain string (per <C>valueFormat</C>) instead of a <C>Date</C> object. It is the
        widget FormBuilder mounts for <C>dtype: 'date'</C> and <C>etype: 'date'</C>{' '}
        elements.
      </p>
      <p>
        The <C>type</C> prop opens up the whole Element Plus picker family:{' '}
        <C>date</C> (default), <C>datetime</C>, <C>daterange</C>, <C>month</C>,{' '}
        <C>year</C> and more, each with its own display conventions. Because{' '}
        <C>format</C> (display) and <C>valueFormat</C> (emitted value) default to{' '}
        <C>YYYY-MM-DD</C>, the bound model always contains something directly serializable
        to JSON — no <C>dayjs()</C> conversion needed on submit. Anything beyond the five
        forwarded props (shortcuts, disabled dates, teleported panels…) is not exposed;
        drop down to <C>el-date-picker</C> for those.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>String dates in your model</B> — expiry dates, release dates and deadlines
          stored as <C>'YYYY-MM-DD'</C> strings, ready for the API.
        </li>
        <li>
          <B>One input, several pickers</B> — switching <C>type</C> between{' '}
          <C>date</C>, <C>datetime</C> and <C>daterange</C> without swapping components.
        </li>
        <li>
          <B>Schema-driven forms</B> — the date element inside <C>FormBuilder</C>, where{' '}
          <C>placeholder</C> comes from the element descriptor.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<><C>modelValue</C> (v-model)</>, <C>String | Date</C>, <C>''</C>, 'Selected value'],
          [<C>placeholder</C>, <C>String</C>, <C>'Select date'</C>, 'Input placeholder'],
          [<C>type</C>, <C>String</C>, <C>'date'</C>, <>Element Plus picker type (<C>date</C>, <C>datetime</C>, <C>daterange</C>…)</>],
          [<C>format</C>, <C>String</C>, <C>'YYYY-MM-DD'</C>, 'Display format'],
          [<C>valueFormat</C>, <C>String</C>, <C>'YYYY-MM-DD'</C>, 'Emitted value format'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload']}
        rows={[
          [<C>update:modelValue</C>, <>selected date (formatted per <C>valueFormat</C>)</>],
        ]}
      />

      <H2>Examples</H2>

      <H3>1. A simple date field</H3>
      <p>
        The default configuration is a single-day picker that stores{' '}
        <C>'YYYY-MM-DD'</C> strings in the bound ref — exactly what you want before a
        JSON POST.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { DatePicker } from '@msflib/vue'

const date = ref('')
</script>

<template>
  <DatePicker v-model="date" placeholder="Choose release date" />
</template>`}</CodeBlock>

      <H3>2. Datetime with a custom format</H3>
      <p>
        Set <C>type="datetime"</C> to add a time panel. The display format and the
        emitted value format are controlled independently — here the user sees
        seconds while the model stores a minute-precision ISO-style string.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { DatePicker } from '@msflib/vue'

const scheduledAt = ref('')
</script>

<template>
  <DatePicker
    v-model="scheduledAt"
    type="datetime"
    format="YYYY-MM-DD HH:mm:ss"
    value-format="YYYY-MM-DD HH:mm"
    placeholder="Schedule campaign start"
  />
</template>`}</CodeBlock>

      <H3>3. A range picker for report filters</H3>
      <p>
        With <C>type="daterange"</C> the emitted value becomes a{' '}
        <C>[start, end]</C> array of formatted strings, which maps neatly onto query
        parameters for a reporting endpoint.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref, watch } from 'vue'
import { DatePicker } from '@msflib/vue'

const range = ref([])

watch(range, ([from, to]) => {
  if (from && to) fetchReport({ from, to })
})
</script>

<template>
  <DatePicker
    v-model="range"
    type="daterange"
    start-placeholder="From"
    value-format="YYYY-MM-DD"
  />
</template>`}</CodeBlock>
      <Note>
        Range pickers emit an array, so initialize the model with <C>[]</C> (or{' '}
        <C>null</C>), not <C>''</C>.
      </Note>

      <H3>4. Date element inside a FormBuilder schema</H3>
      <p>
        Inside <C>FormBuilder</C>, a <C>dtype: 'date'</C> element renders this picker and
        writes the formatted string straight to the model's dot-path — here{' '}
        <C>formData.expiry</C>. Extra display props beyond the five supported ones are not
        forwarded; keep it simple.
      </p>
      <CodeBlock lang="js">{`const formData = ref({ expiry: '' })

const elements = [
  {
    name: 'expiry',
    dtype: 'date',
    placeholder: 'Expiry Date',
    width: 48,
  },
]

const rules = {
  expiry: [{ required: true, message: 'Expiry date is required.', trigger: 'change' }],
}`}</CodeBlock>

      <Tip>
        Validation on date fields triggers reliably on <C>change</C> rather than{' '}
        <C>blur</C>, since the value arrives via the picker's change event.
      </Tip>
      <p>
        For the broader Element Plus option set (shortcuts, disabled dates, panel
        customization) the wrapper does not forward them — use <C>el-date-picker</C>
        directly in that case.
      </p>
    </>
  )
}
