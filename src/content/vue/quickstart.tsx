import { A, B, C, CodeBlock, H2, H3, Warning, Note } from '../../components/md'

export default function VueQuickstart() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        This page walks through the full setup of <C>@msflib/vue</C> in a host application:
        registry access, the Element Plus/FontAwesome runtime it expects, the first
        component render, and the static assets two components load by absolute URL. Work
        through the steps in order — each one unblocks the next — and use the checklist at
        the end to verify the integration.
      </p>

      <H2>1. Install</H2>
      <p>
        The package is published to <B>GitHub Packages</B>, so first make sure your project
        has an <C>.npmrc</C> that routes the <C>@msflib</C> scope to the GitHub registry with
        a token that can read packages:
      </p>
      <CodeBlock lang="ini">{`# .npmrc
@msflib:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN`}</CodeBlock>
      <p>Then install:</p>
      <CodeBlock lang="bash">{`npm install @msflib/vue`}</CodeBlock>

      <Note>
        The package is dependency-complete: <C>vue</C>, <C>element-plus</C>, <C>colord</C> and
        the <C>@fortawesome/*</C> packages are regular dependencies, so npm installs them for
        you. Element Plus <B>code</B> is bundled into <C>dist</C> — but its <B>CSS</B> is not
        (see step 2).
      </Note>

      <H2>2. Provide Element Plus and FontAwesome</H2>
      <p>
        The library imports Element Plus components, so the host app must register Element
        Plus and load its stylesheet plus the FontAwesome CSS:
      </p>
      <CodeBlock lang="js">{`// main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')`}</CodeBlock>

      <Warning title="Do not rely on the library to install the plugin">
        <C>src/index.js</C> contains a <C>createApp().use(ElementPlus)</C> side effect, but
        that app instance is never mounted — it is dead code. Always call{' '}
        <C>app.use(ElementPlus)</C> in <em>your</em> entry file.
      </Warning>

      <H2>Examples</H2>

      <H3>3. Use a component</H3>
      <p>All exports are named:</p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FormBuilder, TableWidget } from '@msflib/vue'

const formData = ref({})
const rows = ref([
  { id: 1, code: 'A1', name: 'Widget', status: { type: 'status', status: 'Received' } },
])
</script>

<template>
  <FormBuilder
    :elements="[
      { name: 'name', dtype: 'string', label: 'Name', placeholder: 'Product name' },
      { name: 'submit', etype: 'submit', label: 'Save' },
    ]"
    v-model="formData"
  />

  <TableWidget :table-data="rows" />
</template>`}</CodeBlock>

      <H3>4. Static assets (postinstall copy)</H3>
      <p>
        On install, the package's <C>postinstall</C> script copies <C>dist/vc-assets</C> into
        your project's <C>public/</C> folder. Two components reference these files by
        absolute URL:
      </p>
      <ul>
        <li>
          <C>FileUpload</C> uses <C>/vc-assets/images/photo.png</C> as its upload placeholder,
        </li>
        <li>
          <C>SuccessNote</C> uses <C>/vc-assets/images/confetti.png</C> as its confetti
          background.
        </li>
      </ul>
      <p>
        If the copy was skipped (e.g. <C>dist/vc-assets</C> missing from the published
        package), those images will 404. You can silence this by dropping your own files at{' '}
        <C>public/vc-assets/images/photo.png</C> and{' '}
        <C>public/vc-assets/images/confetti.png</C>.
      </p>

      <H2>5. Requirements checklist</H2>
      <ul>
        <li>
          Vue <B>3.4+</B> (<C>defineModel</C> is used by several components).
        </li>
        <li>Element Plus registered app-wide with its CSS loaded.</li>
        <li>
          FontAwesome CSS loaded (components use classes like <C>fa-solid fa-times</C>).
        </li>
        <li>
          Tailwind-style utility classes (<C>w-full</C>, <C>flex</C>, <C>px-2</C>…) and a few
          custom classes (<C>bg-pri</C>, <C>text-pri</C>) are expected to exist in the host
          app's CSS — see <A to="/vue/theming">Theming & styles</A>.
        </li>
      </ul>
    </>
  )
}
