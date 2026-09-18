import { A, B, C, CodeBlock, H2, H3, Note, Table, Tip, Warning } from '../../components/md'

export default function VueSuccessNote() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>SuccessNote</C> is a full-screen "it worked" view: a confetti background
        image (<C>/vc-assets/images/confetti.png</C>), a large FontAwesome{' '}
        <C>fa-circle-check</C> icon in the theme color, a bold <C>successTitle</C>{' '}
        heading ("Excellent!!" by default), the <C>successText</C> body, a filled primary
        button, an optional secondary text button, and — when <C>link</C> is set — a{' '}
        link line rendered as a <C>nuxt-link</C>. It is the closing screen for flows that
        end in success.
      </p>
      <p>
        Like <A to="/vue/options-modal">OptionsModal</A>, it manages nothing: no overlay,
        no visibility state, no navigation. Two events — <C>primaryBtnClicked</C> and{' '}
        <C>secondaryBtnClicked</C> — carry all decisions to your handlers, and both
        buttons accept DOM ids for test selectors. The secondary button renders as plain
        themed text (<C>text-pri</C>) rather than a boxed button, so the visual hierarchy
        is always primary-action-first. Slot it into a <C>ModalDialog</C> body when you
        want the success state inside a dialog instead of full-screen.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Flow completions</B> — order placed, product saved, invitation sent: one
          celebratory screen with the logical next action as the primary button.
        </li>
        <li>
          <B>Two-way exits</B> — "View order" (primary) plus "Back to shop" (secondary
          text button) without building custom markup.
        </li>
        <li>
          <B>Onboarding and verification endings</B> — email verified, account created,
          with a link line to the next stop.
        </li>
        <li>
          <B>Dialog success states</B> — inside a <C>ModalDialog</C> body to swap a form
          for a confirmation (see example 3).
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>successTitle</C>, <C>String</C>, <C>'Excellent!!'</C>, 'Heading'],
          [<C>successText</C>, <C>String</C>, <B>required</B>, 'Body text'],
          [<C>primaryBtnText</C>, <C>String</C>, <B>required</B>, 'Primary button label'],
          [<C>primaryBtnId</C>, <C>String</C>, <C>''</C>, 'Primary button id'],
          [<C>secondaryBtnText</C>, <C>String</C>, <C>''</C>, 'Secondary text-button label'],
          [<C>secondaryBtnId</C>, <C>String</C>, <C>''</C>, 'Secondary button id'],
          [<C>link</C>, <C>String</C>, '—', <>Renders a <C>&lt;nuxt-link :to="link"&gt;</C> wrapper</>],
          [<C>linkText</C>, <C>String</C>, '—', 'Label for the link'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'When']}
        rows={[
          [<C>primaryBtnClicked</C>, 'Primary button pressed'],
          [<C>secondaryBtnClicked</C>, 'Secondary button pressed'],
        ]}
      />

      <Warning title="Nuxt-specific link">
        When <C>link</C> is set the component renders a <C>nuxt-link</C> element — a
        Nuxt-specific global. In a plain Vue app this resolves as an unknown component and
        warns; either register a <C>nuxt-link</C> alias (e.g. to <C>RouterLink</C>) or avoid{' '}
        <C>link</C> and handle navigation in <C>@primary-btn-clicked</C>.
      </Warning>

      <H2>Examples</H2>

      <H3>1. The minimal success screen</H3>
      <p>
        Only <C>successText</C> and <C>primaryBtnText</C> are required — the title
        defaults to "Excellent!!" and the confetti/check-icon styling is automatic.
        The primary click is yours to handle.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { SuccessNote } from '@msflib/vue'

function goNext() {
  router.push('/products')
}
</script>

<template>
  <SuccessNote
    success-title="Done!"
    success-text="Product saved."
    primary-btn-text="Continue"
    primary-btn-id="ok"
    @primary-btn-clicked="goNext"
  />
</template>`}</CodeBlock>

      <H3>2. Order confirmation with a secondary exit</H3>
      <p>
        The classic post-checkout screen: primary button dives into the order details,
        the secondary text button returns to browsing. Both buttons get ids so E2E tests
        can click them deterministically.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { SuccessNote } from '@msflib/vue'

const order = ref(null)

function viewOrder() {
  router.push(\`/orders/\${order.value.id}\`)
}

function keepShopping() {
  router.push('/shop')
}
</script>

<template>
  <SuccessNote
    success-title="Order placed!"
    :success-text="\`Order #\${order?.id ?? '—'} is on its way.\`"
    primary-btn-text="View order"
    primary-btn-id="order-view"
    secondary-btn-text="Back to shop"
    secondary-btn-id="order-shop"
    @primary-btn-clicked="viewOrder"
    @secondary-btn-clicked="keepShopping"
  />
</template>`}</CodeBlock>

      <H3>3. Success state inside a ModalDialog</H3>
      <p>
        Because the component renders just its content block, it drops straight into a{' '}
        <A to="/vue/modal-dialog">ModalDialog</A> body: run the async save, flip a flag,
        and the dialog's form becomes this celebration screen. Closing the dialog is
        your code's job.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ModalDialog, SuccessNote } from '@msflib/vue'

const open = ref(false)
const saved = ref(false)

async function save() {
  await api.createProduct(draft.value)
  saved.value = true
}

function closeDialog() {
  open.value = false
  saved.value = false
}
</script>

<template>
  <ModalDialog v-model="open" size="520px">
    <SuccessNote
      v-if="saved"
      success-title="All set!"
      success-text="Your product is now live."
      primary-btn-text="Close"
      primary-btn-id="saved-close"
      @primary-btn-clicked="closeDialog"
    />
    <form v-else @submit.prevent="save">
      <!-- form fields -->
      <button type="submit">Save product</button>
    </form>
  </ModalDialog>
</template>`}</CodeBlock>

      <H3>4. Email-verified screen with a link line</H3>
      <p>
        With <C>link</C>/<C>linkText</C> set, an extra themed link renders under the
        buttons — in a Nuxt app it navigates via <C>nuxt-link</C>. This suits
        verification and invite-acceptance flows where the primary action and the link
        lead to different destinations.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { SuccessNote } from '@msflib/vue'

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <SuccessNote
    success-title="Email verified!"
    success-text="Your address has been confirmed. Welcome aboard."
    primary-btn-text="Go to dashboard"
    primary-btn-id="verify-dashboard"
    @primary-btn-clicked="goToDashboard"
    link="/profile"
    link-text="Complete your profile"
  />
</template>`}</CodeBlock>

      <Note>
        The confetti background and the primary-button color depend on host-app assets
        and theme classes: the background image must be served at{' '}
        <C>/vc-assets/images/confetti.png</C>, and <C>bg-pri</C>/<C>text-pri</C> must
        exist in your Tailwind theme — see <A to="/vue/theming">Theming &amp; styles</A>.
      </Note>
      <Tip>
        Keep <C>successText</C> to one short line — the component centers it at a fixed
        size rather than wrapping long paragraphs gracefully.
      </Tip>
    </>
  )
}
