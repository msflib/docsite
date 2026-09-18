import { B, C, H2, Table, Warning, Note, Danger, CodeBlock, H3 } from '../../components/md'

export default function VueGotchas() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        A candid list of things worth knowing before integrating the library. These come
        straight from the source, not from marketing.
      </p>

      <H2>Version requirements</H2>
      <ul>
        <li>
          <B>Vue ≥ 3.4</B> is required at runtime: <C>FormBuilder</C>, <C>FileUpload</C>,{' '}
          <C>PillsInput</C>, <C>TableWidget</C> and <C>PaginationTab</C> use{' '}
          <C>defineModel()</C>, which stabilized in Vue 3.4 — even though{' '}
          <C>package.json</C> declares <C>vue: ^3.3.4</C>.
        </li>
      </ul>

      <H2>Setup</H2>
      <ul>
        <li>
          There is <B>no plugin</B> and no default export. Import components directly and
          call <C>app.use(ElementPlus)</C> yourself; the <C>createApp().use(ElementPlus)</C>{' '}
          inside <C>src/index.js</C> is dead code (an app that is never mounted).
        </li>
        <li>
          Element Plus <B>CSS</B> is never imported by the library — load{' '}
          <C>element-plus/dist/index.css</C> yourself. FontAwesome CSS is likewise your
          responsibility.
        </li>
        <li>
          The <C>@msflib/vue/style.css</C> export is declared but <B>not produced by the
          build</B>.
        </li>
        <li>
          The <C>postinstall</C> script copies <C>dist/vc-assets</C> into your{' '}
          <C>public/</C> folder; if the published package lacks that folder the copy
          silently no-ops and <C>FileUpload</C> / <C>SuccessNote</C> images 404 (self-host
          the two files to fix).
        </li>
      </ul>

      <H2>API quirks</H2>
      <ul>
        <li>
          <C>FormBuilder</C> <B>mutates the v-model object in place</B> at dot-paths (tests
          assert this). Pass a dedicated reactive object, not shared state.
        </li>
        <li>
          <C>ModalDialog</C>'s footer buttons don't emit <C>update:modelValue</C> — Confirm
          assigns <C>props.modelValue = false</C> directly; listen to{' '}
          <C>@modal-closed</C> too.
        </li>
        <li>
          <C>AutoCompleteInput</C> does not reflect a parent-supplied <C>modelValue</C>{' '}
          back into the input; it's write-on-select.
        </li>
        <li>
          <C>ColorPicker</C> has no <C>v-model</C>; it only emits.
        </li>
        <li>
          <C>SuccessNote</C> renders <C>nuxt-link</C> when <C>link</C> is set — a
          Nuxt-specific global.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. The correct .npmrc for GitHub Packages</H3>
      <p>
        The most common install failure is a missing or mis-scoped registry. This is the
        exact configuration the package needs:
      </p>
      <CodeBlock lang="ini">{`@msflib:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_YOUR_TOKEN_WITH_READ_PACKAGES`}</CodeBlock>

      <H3>2. Self-hosting the two referenced images</H3>
      <p>
        If the postinstall copy no-ops, <C>FileUpload</C> and <C>SuccessNote</C> 404 on
        their images. Drop your own files at these paths to fix it without touching the
        library:
      </p>
      <CodeBlock lang="text">{`public/
└─ vc-assets/
   └─ images/
      ├─ photo.png      # FileUpload placeholder
      └─ confetti.png   # SuccessNote background`}</CodeBlock>

      <H3>3. Handling ModalDialog's footer quirk</H3>
      <p>
        Because the built-in footer buttons don't emit <C>update:modelValue</C>, bind both
        events to the same visibility ref:
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
const open = ref(false)
function close() {
  open.value = false // single handler covers X, overlay, Cancel and Confirm
}
</script>

<template>
  <ModalDialog v-model="open" :footer="true" @modal-closed="close">
    <p>Content…</p>
  </ModalDialog>
</template>`}</CodeBlock>

      <H2>Legacy / inert surface</H2>
      <p>
        Declared but <B>without effect</B> — don't rely on them:
      </p>
      <Table
        head={['Component', 'Inert surface']}
        rows={[
          [<C>TableWidget</C>, <>props <C>edit</C>, <C>tableTitle</C>, <C>defaultSort</C>; events <C>delete-clicked</C>, <C>edit-clicked</C>, <C>dialog-open</C></>],
          [<C>FileUpload</C>, <>props <C>uploadTip</C>, <C>placeholder</C>; events <C>click</C>, <C>formSubmitted</C></>],
          [<C>FormBuilder</C>, <>events <C>image-uploaded</C>, <C>toggle-password</C>; <C>inline</C> documented but unused</>],
          [<C>PillsInput</C>, <>README's <C>selectedIndex</C> prop / <C>select:index</C> event don't exist (real event: <C>itemSelected</C>)</>],
        ]}
      />

      <H2>Packaging notes</H2>
      <ul>
        <li>
          Element Plus/colord/FontAwesome <em>code</em> is bundled into <C>dist</C> (Vite
          externals only <C>vue</C>) — heavier bundle, but fewer install surprises.
        </li>
        <li>
          The package is published to GitHub Packages; make sure your <C>.npmrc</C> scopes{' '}
          <C>@msflib</C> correctly. (The publish workflow historically mixed the{' '}
          <C>@kodehauzinternship</C> scope — verify the resolved registry if installs
          fail.)
        </li>
        <li>
          <C>FormBuilder</C> imports a helper from the repo's <C>test/</C> folder; only{' '}
          <C>dist</C> and <C>scripts</C> ship in the tarball, so consuming the raw source
          instead of <C>dist</C> will break.
        </li>
      </ul>
    </>
  )
}
