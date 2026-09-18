import { A, B, C, CodeBlock, H2, H3, Note, Table, Tip } from '../../components/md'

export default function VueColorPicker() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>ColorPicker</C> renders a responsive grid of predefined 32px swatches plus one
        extra tile containing an <C>el-color-picker</C> (with <C>show-alpha</C>) for
        custom colors. Clicking any swatch — or confirming a custom color in the
        Element Plus popover — emits the chosen color string via{' '}
        <C>update:modelValue</C>, and the active swatch gets a 2px red highlight border.
        It is also embedded by <A to="/vue/pills-input">PillsInput</A> when the{' '}
        <C>withColor</C> prop is set, where it recolors the selected pill.
      </p>
      <p>
        The swatch grid comes from the <C>colorPalette</C> prop, which defaults to the
        bundled <C>defaultColorPalette</C>: 23 <C>rgb()</C> strings spanning the primary
        hues plus white, black and slate/brown tones. The custom picker tile starts at{' '}
        <C>rgba(19, 206, 102, 0.8)</C> and accepts any CSS color, including alpha values
        — so a palette prop of plain hex strings mixes fine with alpha colors picked by
        the user.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Fast, curated choices</B> — brand palettes, tag colors and theme accents
          where most users should pick from a fixed set, not a free canvas.
        </li>
        <li>
          <B>An escape hatch for custom colors</B> — the built-in alpha-capable{' '}
          <C>el-color-picker</C> tile covers the long tail without a separate component.
        </li>
        <li>
          <B>Coloring pills and labels</B> — the natural companion to{' '}
          <C>PillsInput</C>'s per-pill colors.
        </li>
        <li>
          <B>FormBuilder color elements</B> — an <C>etype: 'color'</C> element renders
          this picker with <C>mdata.colorPalette</C> (a plain <C>dtype: 'color'</C>{' '}
          maps to the bare <C>el-color-picker</C> instead).
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>colorPalette</C>, <C>Array</C>, <C>defaultColorPalette</C>, 'Swatch colors (any CSS color string)'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload', 'When']}
        rows={[
          [<C>update:modelValue</C>, 'color string', 'Every selection (swatch or custom picker)'],
        ]}
      />

      <H2>Notes</H2>
      <ul>
        <li>
          There is <B>no <C>v-model</C></B> — the component is uncontrolled and simply emits
          the selected color; keep the selected value in your own state.
        </li>
        <li>
          The default palette (<C>defaultColorPalette.js</C>) contains 23 <C>rgb()</C>{' '}
          strings spanning red/yellow/green/cyan/blue/magenta hues plus white, black and
          slate tones.
        </li>
        <li>The custom picker starts at <C>rgba(19, 206, 102, 0.8)</C>.</li>
      </ul>

      <H2>Examples</H2>

      <H3>1. Picking a tag color</H3>
      <p>
        The component never holds state, so bind your own ref to{' '}
        <C>@update:modelValue</C> and show the result wherever you need it. Selections can
        come either from a swatch or from the custom picker tile.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ColorPicker } from '@msflib/vue'

const tagColor = ref('')
</script>

<template>
  <ColorPicker
    :color-palette="['#e91e63', '#009688', '#f5c97b']"
    @update:modelValue="(c) => (tagColor = c)"
  />
  <p>Selected: {{ tagColor || 'none yet' }}</p>
</template>`}</CodeBlock>

      <H3>2. A brand palette with a color-swatch preview</H3>
      <p>
        Pass a curated brand palette as <C>color-palette</C> — any CSS color strings
        work, hex or <C>rgb()</C>. This fixture-style palette (from the library's own
        colorPickerData) mixes hues with neutral tones; the chosen color is applied live
        to a preview chip.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ColorPicker } from '@msflib/vue'

const selected = ref('')

const palette = [
  'rgb(233, 30, 99)',
  'rgb(0, 150, 136)',
  'rgb(255, 193, 7)',
  'rgb(121, 85, 72)',
  'rgb(96, 125, 139)',
  'rgb(158, 158, 158)',
  'rgb(103, 58, 183)',
]
</script>

<template>
  <ColorPicker :color-palette="palette" @update:modelValue="(c) => (selected = c)" />
  <div
    v-if="selected"
    class="w-8 h-8 mt-4 rounded border"
    :style="{ backgroundColor: selected }"
  />
</template>`}</CodeBlock>

      <H3>3. Driving a form field with the picked color</H3>
      <p>
        Because the emit is just a string, it slots into any form model — here an accent
        color setting saved alongside other preferences, with the swatch grid shown only
        while the user is editing.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ColorPicker } from '@msflib/vue'

const settings = ref({ accent: 'rgb(106, 90, 205)' })
const editing = ref(false)

async function save() {
  await api.updateSettings(settings.value)
  editing.value = false
}
</script>

<template>
  <div>
    <p>Accent color</p>
    <ColorPicker
      v-if="editing"
      @update:modelValue="(c) => (settings.accent = c)"
    />
    <button v-else @click="editing = true">Change accent</button>
  </div>
</template>`}</CodeBlock>

      <H3>4. Color element inside FormBuilder (and PillsInput pairing)</H3>
      <p>
        In a <C>FormBuilder</C> schema, an <C>etype: 'color'</C> element renders{' '}
        <C>ColorPicker</C> and a custom palette travels through <C>mdata.colorPalette</C>
        — this mirrors the library's colorPicker fixture exactly. The same picker is what{' '}
        <C>PillsInput</C> embeds when <C>withColor</C> is set, so a color chosen here and
        one chosen on a pill behave identically.
      </p>
      <CodeBlock lang="js">{`import { colorPalette } from './fixtures/colorPickerData.js'

const formData = ref({ color: '' })

const elements = [
  {
    name: 'color',
    dtype: 'string',
    etype: 'color',
    label: 'Tag color',
    mdata: { colorPalette },
  },
]`}</CodeBlock>

      <Note>
        The component tracks the selected swatch only internally (for the highlight
        border). On mount nothing is highlighted and nothing is emitted — seed your own
        model with a default if the field is required.
      </Note>
      <Tip>
        Keep palette entries to colors with good contrast against both black and white
        text if you plan to reuse them for pills; <C>PillsInput</C> derives its foreground
        color from the pill color automatically.
      </Tip>
    </>
  )
}
