import { A, B, C, CodeBlock, H2, H3, Table, Danger } from '../../components/md'

export default function VueModalDialog() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>ModalDialog</C> is a centered, rounded wrapper around Element Plus's{' '}
        <C>el-dialog</C>: it forces <C>align-center</C>, overrides the corner radius to
        15px, enlarges the close icon, and collapses the dialog to ~90% width on
        viewports ≤ 426px via CSS. Visibility is a plain <C>v-model</C> boolean, the
        <C>title</C> and <C>size</C> (a CSS width such as <C>'480px'</C>) map straight to
        their el-dialog counterparts, and the default slot is the body.
      </p>
      <p>
        The one behavioral extra is the <C>footer</C> prop: when true, a built-in footer
        renders Cancel and Confirm buttons. Cancel routes through the shared close
        handler (which also emits <C>modalClosed</C>); Confirm sets the internal value
        to <C>false</C> directly — a quirk covered in the warning below. Closing via the
        X icon or the overlay emits <C>update:modelValue</C> like a normal el-dialog.
        Because all modals built on it share the rounded/centered styling, it is the
        quickest way to keep dialogs visually consistent across an app.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Standard confirmations</B> — delete/leave/discard prompts where the built-in
          Cancel/Confirm footer is enough.
        </li>
        <li>
          <B>Forms and wizards in dialogs</B> — pass your own markup (inputs,{' '}
          <C>FormBuilder</C>, <C>OptionsModal</C>, <C>SuccessNote</C>…) through the
          default slot and skip the footer.
        </li>
        <li>
          <B>Consistent dialog styling</B> — rounded corners, centered alignment and
          mobile-friendly widths without repeating el-dialog props everywhere.
        </li>
        <li>
          <B>Two close channels</B> — <C>update:modelValue</C> for X/overlay closes and{' '}
          <C>modalClosed</C> for the built-in buttons, so cleanup can hook whichever
          fits.
        </li>
      </ul>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<><C>modelValue</C> (v-model)</>, <C>Boolean</C>, <C>false</C>, 'Dialog visibility'],
          [<C>size</C>, <C>String</C>, <C>''</C>, <>Dialog width (passed to <C>el-dialog :width</C>)</>],
          [<C>title</C>, <C>String</C>, <C>''</C>, 'Dialog title'],
          [<C>footer</C>, <C>Boolean</C>, <C>false</C>, 'Render built-in Cancel/Confirm footer'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload', 'Notes']}
        rows={[
          [<C>update:modelValue</C>, 'boolean', 'Emitted when closed via the X / overlay'],
          [<C>modalClosed</C>, '—', 'Emitted by the built-in footer buttons (Cancel and Confirm)'],
        ]}
      />

      <H2>Slots</H2>
      <ul>
        <li><B>default</B> — dialog body.</li>
        <li>
          Element Plus <C>#footer</C> — only rendered when <C>footer</C> is <C>true</C>.
        </li>
      </ul>

      <Danger title="Known quirk">
        The built-in footer's Cancel/Confirm buttons do <B>not</B> emit{' '}
        <C>update:modelValue</C>. The Confirm button assigns{' '}
        <C>props.modelValue = false</C> directly and Cancel emits <C>modalClosed</C>. Always
        also listen to <C>@modal-closed</C> and reset your visibility state there, as shown
        in the example.
      </Danger>

      <H2>Examples</H2>

      <H3>1. A delete confirmation with the built-in footer</H3>
      <p>
        The classic case: <C>footer</C> gives you Cancel/Confirm for free. Note the
        workaround for the quirk above — <C>@modal-closed</C> is wired to the same close
        routine as <C>v-model</C>, so both footer buttons and the X icon end up in the
        same place.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ModalDialog } from '@msflib/vue'

const open = ref(false)
const product = ref(null)

function close() {
  open.value = false
}

async function onDelete() {
  await api.deleteProduct(product.value.id)
  close()
}
</script>

<template>
  <button @click="open = true">Delete…</button>

  <ModalDialog
    v-model="open"
    title="Confirm"
    size="480px"
    :footer="true"
    @modal-closed="close"
  >
    <p>Are you sure you want to delete this product?</p>
  </ModalDialog>
</template>`}</CodeBlock>

      <H3>2. A form dialog with custom buttons</H3>
      <p>
        Without <C>footer</C> the dialog is a blank slate: put your own controls in the
        default slot and close it by flipping the model. Here a small invite form submits
        and closes itself, while the X icon and overlay still work through{' '}
        <C>v-model</C>.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ModalDialog } from '@msflib/vue'

const open = ref(false)
const email = ref('')
const sending = ref(false)

async function sendInvite() {
  sending.value = true
  try {
    await api.invite({ email: email.value })
    email.value = ''
    open.value = false
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <ModalDialog v-model="open" title="Invite teammate" size="520px">
    <input v-model="email" type="email" placeholder="teammate@company.com" />
    <button :disabled="sending" @click="sendInvite">
      {{ sending ? 'Sending…' : 'Send invite' }}
    </button>
  </ModalDialog>
</template>`}</CodeBlock>

      <H3>3. Result screen inside a dialog</H3>
      <p>
        Dialogs compose: swap the body for a{' '}
        <A to="/vue/success-note">SuccessNote</A> (or an{' '}
        <A to="/vue/options-modal">OptionsModal</A> question) once the async action
        finishes. The success step closes the dialog from its own button, which — since
        it sets the model directly — needs no extra wiring.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ModalDialog, SuccessNote } from '@msflib/vue'

const open = ref(false)
const sent = ref(false)

function reset() {
  sent.value = false
  open.value = false
}
</script>

<template>
  <ModalDialog v-model="open" title="Invite teammate" size="520px">
    <SuccessNote
      v-if="sent"
      success-title="Invite sent!"
      success-text="Your teammate will receive an email shortly."
      primary-btn-text="Great, close"
      primary-btn-id="invite-done"
      @primary-btn-clicked="reset"
    />
    <div v-else>
      <!-- invite form body -->
      <button @click="sent = true">Send invite</button>
    </div>
  </ModalDialog>
</template>`}</CodeBlock>

      <H3>4. Closing after an async save with cleanup</H3>
      <p>
        Because the component mutates its local value on the built-in buttons, the
        robust pattern is a single <C>close()</C> routine that resets form state and the
        visibility ref together — invoked from <C>v-model</C> updates,{' '}
        <C>@modal-closed</C>, or your own success path.
      </p>
      <CodeBlock lang="js">{`import { ref, watch } from 'vue'

const open = ref(false)
const draft = ref({ name: '', price: 0 })

async function save() {
  await api.createProduct(draft.value)
  close() // success path
}

function close() {
  open.value = false
  draft.value = { name: '', price: 0 } // reset for the next open
}

// X / overlay closes arrive through update:modelValue
watch(open, (isOpen) => {
  if (!isOpen) draft.value = { name: '', price: 0 }
})`}</CodeBlock>
    </>
  )
}
