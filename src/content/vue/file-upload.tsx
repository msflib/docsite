import { A, B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function VueFileUpload() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>FileUpload</C> wraps Element Plus's <C>el-upload</C> with a single-image
        oriented UI: a photo placeholder (trigger mode) or a drag &amp; drop area, an
        optional preview dialog and validation hooks. The trigger depends on{' '}
        <C>triggerElementType</C>: the value <C>'btn'</C> renders a primary{' '}
        <C>el-button</C> labelled "select file", while any other value renders the drop
        area — a placeholder image, the <C>promptText</C> line, a "Browse Files" button
        and a hint reading "Supports {'{fileTypes}'}. Max file size {'{maxFileSize}'}KB".
      </p>
      <p>
        Unlike raw <C>el-upload</C>, the built-in file list is switched off
        (<C>show-file-list</C> is hard-wired to <C>false</C>). Instead the uploaded files
        array is bound with <C>v-model</C>, and every successful upload re-emits the full
        array through <C>update:modelValue</C> and <C>input</C>. On success the component
        also attaches a blob object URL (<C>URL.createObjectURL(file.raw)</C>) to the
        file entry, and with <C>showPreview</C> clicking a file opens an <C>el-dialog</C>{' '}
        image preview driven by the entry's <C>imageURL</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Single-asset uploads</B> — avatars, cover images, logos and attachments,
          with a drag &amp; drop zone or a compact button trigger.
        </li>
        <li>
          <B>Files as data</B> — the file objects live in your own array via{' '}
          <C>v-model</C> instead of a visible el-upload file list, ready to POST as JSON
          or FormData.
        </li>
        <li>
          <B>One-line validation</B> — a <C>validator</C> function is wired into
          el-upload's <C>before-upload</C> hook; return <C>false</C> to reject a file
          before it enters the list.
        </li>
        <li>
          <B>FormBuilder integration</B> — the <C>etype: 'upload'</C> element builds its
          validator declaratively from <C>mdata.validation</C>.
        </li>
      </ul>
      <p>
        Removal always goes through the internal <C>removeUploadedFile</C> handler, which
        filters the array by <C>uid</C> and re-emits. Everything the component can do from
        the outside is exposed on the ref: <C>clearFiles()</C>,{' '}
        <C>removeUploadedFile(file)</C> and <C>testUpload(file)</C> (the latter simulates
        an upload start — it is what the library's own test-suite uses).
      </p>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<><C>modelValue</C> (v-model)</>, <C>Array</C>, <C>[]</C>, 'el-upload file objects (uid, raw, url…)'],
          [<C>triggerElementType</C>, <C>String</C>, <C>''</C>, <>"btn" renders a plain button trigger; anything else renders the image/drop UI</>],
          [<C>drag</C>, <C>Boolean</C>, <C>false</C>, 'Enable the drag & drop area'],
          [<C>showPreview</C>, <C>Boolean</C>, <C>false</C>, 'Open an image preview dialog when clicking a thumbnail'],
          [<C>maxFileSize</C>, <C>Number</C>, <C>500</C>, 'Max size in KB (used for messaging/validation)'],
          [<C>validator</C>, <C>Function</C>, <C>() =&gt; true</C>, <><C>(rawFile) =&gt; boolean</C> before-upload check</>],
          [<C>promptText</C>, <C>String</C>, <C>'Drop file here'</C>, 'Drop-area text'],
          [<C>fileTypes</C>, <C>String</C>, <C>'JPEG, JPG, PNG'</C>, 'Supported types hint shown to the user'],
          [<C>uploadTip</C>, <C>Boolean</C>, <C>false</C>, 'Stored but not consumed by the template'],
          [<C>onFileRemoved</C>, <C>Function</C>, <C>() =&gt; true</C>, 'Declared but never invoked — removal always runs the internal handler'],
          [<C>class</C>, <C>String</C>, <C>''</C>, 'Extra class on the upload root'],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload']}
        rows={[
          [<C>update:modelValue</C>, 'uploaded files array'],
          [<C>input</C>, 'uploaded files array'],
        ]}
      />
      <Note>
        <C>click</C> and <C>formSubmitted</C> are declared in <C>defineEmits</C> but never
        emitted by the implementation — don't build on them.
      </Note>

      <H2>Exposed methods</H2>
      <Table
        head={['Method', 'Description']}
        rows={[
          [<C>clearFiles()</C>, 'Clear the file list'],
          [<C>removeUploadedFile(file)</C>, 'Remove a specific file'],
          [<C>testUpload(file)</C>, 'Simulate an upload (used by the test-suite)'],
        ]}
      />

      <H2>Validation through FormBuilder</H2>
      <p>
        When used inside <C>FormBuilder</C> via <C>etype: 'upload'</C>, provide{' '}
        <C>mdata.validation = {'{ maxFileSize, ext, mimeType }'}</C> — FormBuilder constructs
        the validator and reports mismatches with <C>ElMessage.error</C> toasts.
      </p>
      <CodeBlock lang="js">{`{
  name: 'coverImage',
  etype: 'upload',
  label: 'Cover image',
  mdata: { validation: { maxFileSize: 2000, ext: ['jpg', 'png'], mimeType: 'image/' } },
}`}</CodeBlock>

      <H2>Examples</H2>

      <H3>1. Drag-and-drop image upload with preview</H3>
      <p>
        The smallest useful setup: a drop area with custom copy, a 3MB size cap for the
        hint line, and a preview dialog when the user clicks the uploaded file. Every
        successful upload replaces <C>files</C> with the current array of el-upload file
        objects.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FileUpload } from '@msflib/vue'

const files = ref([])
</script>

<template>
  <FileUpload
    v-model="files"
    drag
    show-preview
    :max-file-size="3000"
    prompt-text="Drag your product image here"
    @input="(uploaded) => console.log(uploaded)"
  />
</template>`}</CodeBlock>

      <H3>2. Button trigger with a reset after submit</H3>
      <p>
        For toolbars and inline forms, <C>trigger-element-type="btn"</C> collapses the
        whole drop area into a single primary button. After a successful save, the{' '}
        <C>clearFiles</C> ref method resets the trigger's internal state and you clear
        your own model.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FileUpload } from '@msflib/vue'

const uploadRef = ref()
const files = ref([])

async function submit() {
  await api.uploadAttachments(files.value)
  uploadRef.value.clearFiles()
  files.value = []
}
</script>

<template>
  <FileUpload ref="uploadRef" v-model="files" trigger-element-type="btn" />
  <button @click="submit">Save attachments</button>
</template>`}</CodeBlock>

      <H3>3. Custom before-upload validation</H3>
      <p>
        The <C>validator</C> prop runs as el-upload's <C>before-upload</C> hook for each
        chosen file — return <C>false</C> (or a rejected promise) to block it. This is the
        place for size, MIME or dimension checks that go beyond the static hint text.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { FileUpload } from '@msflib/vue'

const files = ref([])

// runs per file before it enters the list — return false to reject
function beforeImageUpload(rawFile) {
  const ok = rawFile.type.startsWith('image/') && rawFile.size <= 2 * 1024 * 1024
  if (!ok) ElMessage.error('Images only, up to 2MB')
  return ok
}
</script>

<template>
  <FileUpload
    v-model="files"
    drag
    :validator="beforeImageUpload"
    prompt-text="Drop your logo here"
    file-types="PNG, SVG"
  />
</template>`}</CodeBlock>

      <H3>4. Upload element inside FormBuilder</H3>
      <p>
        Inside a <C>FormBuilder</C> schema, extra props travel through <C>mdata</C> and are
        spread onto the widget, so <C>triggerElementType</C>, <C>drag</C>,{' '}
        <C>showPreview</C> and <C>uploadTip</C> are all configurable per element. Entries
        written into the model look like el-upload file objects:{' '}
        <C>{'{ name, percentage, status, size, raw, uid, imageURL }'}</C>.
      </p>
      <CodeBlock lang="js">{`const formData = ref({ coverImage: [] })

const elements = [
  {
    name: 'coverImage',
    etype: 'upload',
    label: 'Cover image',
    mdata: {
      triggerElementType: 'image',
      drag: true,
      showPreview: true,
      uploadTip: true,
      validation: {
        maxFileSize: 3,
        ext: 'jpg,png,jpeg',
        mimeType: ['image/jpeg', 'image/png', 'image/jpg'],
      },
    },
  },
]`}</CodeBlock>

      <Note>
        The upload placeholder image is hard-coded to <C>/vc-assets/images/photo.png</C> —
        see <A to="/vue/quickstart">Quickstart → Static assets</A>.
      </Note>
    </>
  )
}
