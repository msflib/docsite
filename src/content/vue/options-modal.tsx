import { A, B, C, CodeBlock, H2, H3, Note, Table, Tip, Warning } from '../../components/md'

export default function VueOptionsModal() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>OptionsModal</C> is a centered question screen: a large <C>questionTitle</C>{' '}
        heading, a <C>question</C> body line, and two full-width buttons side by side — a
        white, bordered secondary on the left and a filled primary (theme color{' '}
        <C>bg-pri</C>) on the right. It renders only its content block; it does not
        create an overlay or manage open/close state, so you control visibility with{' '}
        <C>v-if</C> (or place it inside a <A to="/vue/modal-dialog">ModalDialog</A>).
      </p>
      <p>
        Everything is string props: the two texts plus optional DOM ids for both buttons
        (<C>primaryBtnId</C>/<C>secondaryBtnId</C>), which exist for test selectors and
        analytics. The two events are equally minimal — <C>priBtnClicked</C> and{' '}
        <C>secBtnClicked</C> with no payload. All decisions (close the overlay, call the
        API, navigate) happen in your handlers; the component is a pure, reusable
        yes/no prompt.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Destructive-action confirmations</B> — "Delete product?", "Discard
          changes?" with an explicit primary choice and an escape route.
        </li>
        <li>
          <B>Either/or questions mid-flow</B> — "Use saved address or enter a new one?",
          where both options are real paths.
        </li>
        <li>
          <B>Dialog bodies</B> — drop it into <C>ModalDialog</C>'s default slot to get the
          overlay, title bar and rounded styling around the same question screen.
        </li>
        <li>
          <B>Testable prompts</B> — stable button ids make E2E selectors deterministic.
        </li>
      </ul>

      <H2>Props</H2>
      <p>All props are <C>String</C>, default <C>''</C>:</p>
      <Table
        head={['Prop', 'Description']}
        rows={[
          [<C>question</C>, 'Body text'],
          [<C>questionTitle</C>, 'Heading'],
          [<C>primaryBtnText</C>, 'Primary button label'],
          [<C>primaryBtnId</C>, 'Primary button id (for tests/analytics)'],
          [<C>secondaryBtnText</C>, 'Secondary button label'],
          [<C>secondaryBtnId</C>, 'Secondary button id'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'When']}
        rows={[
          [<C>priBtnClicked</C>, 'Primary button pressed'],
          [<C>secBtnClicked</C>, 'Secondary button pressed'],
        ]}
      />

      <Note>
        The buttons use Tailwind-style theme classes (<C>bg-pri</C>, <C>text-pri</C>) that
        come from the consuming app — see <A to="/vue/theming">Theming & styles</A>.
      </Note>

      <H2>Examples</H2>

      <H3>1. A standalone delete confirmation</H3>
      <p>
        The minimal overlay-less usage: <C>v-if</C> shows the question screen full-screen
        (centered, <C>w-5/6</C>), and both handlers decide what happens next. The
        secondary button is what hides the prompt again.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { OptionsModal } from '@msflib/vue'

const confirmDelete = ref(false)
const product = ref({ id: 7, name: 'German Juice' })

async function doDelete() {
  await api.deleteProduct(product.value.id)
  confirmDelete.value = false
}
</script>

<template>
  <button @click="confirmDelete = true">Delete…</button>

  <OptionsModal
    v-if="confirmDelete"
    question-title="Delete product?"
    question="This action cannot be undone."
    primary-btn-text="Delete"
    primary-btn-id="del-yes"
    secondary-btn-text="Cancel"
    secondary-btn-id="del-no"
    @pri-btn-clicked="doDelete"
    @sec-btn-clicked="confirmDelete = false"
  />
</template>`}</CodeBlock>

      <H3>2. As the body of a ModalDialog</H3>
      <p>
        For a real overlay with title bar and backdrop, render the question inside{' '}
        <A to="/vue/modal-dialog">ModalDialog</A>'s default slot and skip its built-in
        footer. The dialog's <C>v-model</C> closes on X/overlay, while the buttons route
        through the component's own events.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ModalDialog, OptionsModal } from '@msflib/vue'

const open = ref(false)

function discard() {
  // …reset the draft…
  open.value = false
}
</script>

<template>
  <ModalDialog v-model="open" size="520px">
    <OptionsModal
      question-title="Discard changes?"
      question="Your edits to this product will be lost."
      primary-btn-text="Discard"
      primary-btn-id="discard-yes"
      secondary-btn-text="Keep editing"
      secondary-btn-id="discard-no"
      @pri-btn-clicked="discard"
      @sec-btn-clicked="open = false"
    />
  </ModalDialog>
</template>`}</CodeBlock>

      <H3>3. A branching question with two real paths</H3>
      <p>
        Neither button has to be "cancel": use the pair for genuine branches. Here a
        checkout asks whether to reuse a saved address; both answers advance the flow
        differently and both dismiss the prompt.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { OptionsModal } from '@msflib/vue'

const asking = ref(false)
const checkout = ref({ useSavedAddress: null })

function chooseSaved() {
  checkout.value.useSavedAddress = true
  asking.value = false
}

function chooseNew() {
  checkout.value.useSavedAddress = false
  asking.value = false // → route to the address form
}
</script>

<template>
  <OptionsModal
    v-if="asking"
    question-title="Shipping address"
    question="Use the address from your last order?"
    primary-btn-text="Enter new address"
    primary-btn-id="addr-new"
    secondary-btn-text="Use saved address"
    secondary-btn-id="addr-saved"
    @pri-btn-clicked="chooseNew"
    @sec-btn-clicked="chooseSaved"
  />
</template>`}</CodeBlock>

      <H3>4. Async primary action with a busy guard</H3>
      <p>
        The buttons don't disable themselves during async work, so guard in the handler:
        flip a flag, run the request, and only dismiss when it succeeds — leaving the
        prompt up (and retryable) on failure.
      </p>
      <CodeBlock lang="js">{`import { ref } from 'vue'

const asking = ref(true)
const deleting = ref(false)

async function onPrimary() {
  if (deleting.value) return // ignore double clicks while in flight
  deleting.value = true
  try {
    await api.deleteAccount()
    asking.value = false
    router.push('/goodbye')
  } catch (e) {
    notify.error('Could not delete the account. Please try again.')
    // keep asking = true so the user can retry or cancel
  } finally {
    deleting.value = false
  }
}`}</CodeBlock>

      <Warning title="No disabled state, no built-in overlay">
        The component offers neither a loading/disabled prop nor backdrop behavior — if
        the primary action is destructive and async, add the busy guard yourself (as in
        example 4). And since there is no scrim, an open <C>OptionsModal</C> rendered
        with <C>v-if</C> does not block the page behind it; use <C>ModalDialog</C> when
        you need a modal overlay.
      </Warning>
      <Tip>
        Keep the ids unique per screen (<C>del-yes</C>, <C>addr-saved</C>…) — they are
        rendered as the buttons' DOM <C>id</C> and are the intended hook for E2E tests.
      </Tip>
    </>
  )
}
