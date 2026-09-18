import { B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function VueFormBuilder() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>FormBuilder</C> is the flagship component of <C>@msflib/vue</C>: instead of
        hand-wiring a dozen <C>el-form</C> fields, you describe your form as a plain array
        of element descriptors and the builder renders the right widget for each one,
        manages the form-data object (including nested dot-paths), wires Element Plus
        validation and exposes helper methods for programmatic control.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Schema-driven rendering</B> — forms that come from an API, a CMS or a config
          file, where the field list is only known at runtime.
        </li>
        <li>
          <B>Less boilerplate</B> — one component replaces the usual
          label/input/error-message triple per field.
        </li>
        <li>
          <B>Consistent validation</B> — rules keyed by element name flow straight into
          Element Plus's <C>el-form</C> (async-validator), with the aggregate result
          mirrored into <C>v-model:isValid</C> / <C>v-model:invalid</C>.
        </li>
        <li>
          <B>Mixed widget types</B> — text, number, password (with a built-in eye toggle),
          checkbox, color, date, calendar, dropdowns, autocomplete, pills and uploads all
          render from the same schema.
        </li>
      </ul>
      <p>
        How it works, in one paragraph: each entry of the <C>elements</C> array declares a
        data path (<C>name</C>, which supports dot-paths like{' '}
        <C>variations.0.selected</C>) and either a data type (<C>dtype</C>, which maps to a
        default widget) or an explicit widget type (<C>etype</C>, which overrides the
        mapping). Extra props travel in <C>mdata</C> and are spread onto the underlying
        widget. Every keystroke writes the value at the dot-path of the model object you
        bound with <C>v-model</C>, and validation runs through <C>el-form</C>.
      </p>

      <H2>Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          [<C>elements</C>, <C>Array</C>, <C>[]</C>, 'Element descriptors (see schema below)'],
          [<C>modelValue</C>, <C>Object</C>, <C>{'{}'}</C>, 'Form data object — written at each element’s name path'],
          [<C>rules</C>, <C>Object</C>, <C>{'{}'}</C>, 'Element Plus validation rules keyed by element name'],
          [<C>itemClass</C>, <C>String</C>, <C>''</C>, 'Extra class applied to every el-form-item'],
        ]}
      />
      <H3>v-model bindings</H3>
      <Table
        head={['Binding', 'Type', 'Default']}
        rows={[
          [<C>v-model</C>, 'Object (form data)', <C>{'{}'}</C>],
          [<C>v-model:isValid</C>, 'Boolean', <C>false</C>],
          [<C>v-model:invalid</C>, <><C>Object</C> (<C>{'{ [fieldName]: validBool }'}</C>)</>, <C>{'{}'}</C>],
        ]}
      />

      <H2>Events</H2>
      <Table
        head={['Event', 'Payload', 'Notes']}
        rows={[
          [<C>submit</C>, 'form data', 'Fired when a button/submit element is clicked'],
          [<C>btnClicked</C>, 'form data', 'Fired for generic button elements'],
          [<C>update:modelValue</C>, 'form data, element', 'On any value change'],
        ]}
      />

      <H2>Exposed methods (via ref)</H2>
      <Table
        head={['Method', 'Signature']}
        rows={[
          [<C>triggerValidation</C>, <>(<C>callback?</C>) → Element Plus validate result</>],
          [<C>triggerFieldValidation</C>, <>(<C>fieldName</C>, <C>callback?</C>)</>],
          [<C>clearElementFiles</C>, <>() — clears uploads created through <C>etype: 'upload'</C></>],
          [<C>removeSingleFile</C>, <>(<C>file</C>)</>],
        ]}
      />

      <H2>Element schema</H2>
      <p>Each entry in <C>elements</C> supports:</p>
      <Table
        head={['Field', 'Type', 'Description']}
        rows={[
          [<C>name</C>, <C>String</C>, <>Data path in the model — supports dot-paths like <C>variations.0.selected</C></>],
          [<C>dtype</C>, <C>String</C>, <>Data type: <C>string</C>, <C>number</C>, <C>boolean</C>, <C>color</C>, <C>date</C>, <C>calendar</C>, <C>list</C></>],
          [<C>etype</C>, <C>String</C>, <>Explicit widget: <C>text</C>, <C>password</C>, <C>email</C>, <C>textarea</C>, <C>date</C>, <C>color</C>, <C>pills</C>, <C>autocomplete</C>, <C>upload</C>, <C>button</C>, <C>submit</C></>],
          [<C>label</C>, <C>String</C>, 'Field label'],
          [<C>placeholder</C>, <C>String</C>, 'Input placeholder'],
          [<C>width</C>, <C>Number</C>, 'Percent width (applied on viewports ≥ 768px)'],
          [<C>class</C>, <C>String</C>, 'Extra classes on the wrapper'],
          [<C>startIcon / endIcon</C>, <C>String</C>, <>FontAwesome icon class shown inside the input (e.g. <C>fa-solid fa-magnifying-glass</C>)</>],
          [<C>disabled</C>, <C>'disabled'</C>, 'Set literally to the string "disabled" to disable the field'],
          [<C>mdata</C>, <C>Object</C>, <>Extra props spread onto the underlying widget (e.g. <C>options</C>, <C>valueKey</C> for selects)</>],
          [<C>events</C>, <C>Object</C>, <>Handlers bound to the widget (<C>@input</C>, <C>@change</C>…)</>],
        ]}
      />

      <H3>Type → widget mapping</H3>
      <Table
        head={['dtype', 'Widget']}
        rows={[
          [<C>string</C>, <C>el-input</C>],
          [<C>number</C>, <>el-input (value coerced with <C>Number()</C>)</>],
          [<C>boolean</C>, <C>el-checkbox</C>],
          [<C>color</C>, <C>el-color-picker</C>],
          [<C>date</C>, <C>DatePicker</C>],
          [<C>calendar</C>, <C>el-calendar</C>],
          [<C>list</C>, <C>SelectList</C>],
        ]}
      />
      <p>
        An <C>etype</C> overrides the <C>dtype</C> choice. <C>password</C> fields get a
        built-in show/hide eye toggle. Validation is delegated to <C>el-form</C> rules
        (async-validator).
      </p>

      <H2>Examples</H2>

      <H3>1. A minimal login form</H3>
      <p>
        The smallest useful form: two fields plus a submit button. Note how the schema is
        just data — you could fetch this array from an API — and validation rules are
        keyed by element name exactly like plain Element Plus forms.
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FormBuilder } from '@msflib/vue'

const fbRef = ref()
const formData = ref({ email: '', password: '' })
const isValid = ref(false)

const elements = [
  {
    name: 'email',
    dtype: 'string',
    label: 'Email address',
    placeholder: 'you@company.com',
    width: 50,
  },
  {
    name: 'password',
    etype: 'password', // renders with a built-in show/hide eye toggle
    label: 'Password',
    width: 50,
  },
  { name: 'remember', dtype: 'boolean', label: 'Keep me signed in' },
  { name: 'submit', etype: 'submit', label: 'Sign in' },
]

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Not a valid email', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
}

async function onLogin() {
  await fbRef.value.triggerValidation()
  if (!isValid.value) return
  // send formData.value to your API
}
</script>

<template>
  <FormBuilder
    ref="fbRef"
    :elements="elements"
    :rules="rules"
    v-model="formData"
    v-model:isValid="isValid"
    @submit="onLogin"
  />
</template>`}</CodeBlock>

      <H3>2. Nested paths, dropdowns and object values</H3>
      <p>
        Element names are dot-paths into the model, so a product form can write straight
        into <C>variations.0.selected</C> without any watcher glue. Dropdowns
        (<C>dtype: 'list'</C>) accept object values through <C>valueKey</C>:
      </p>
      <CodeBlock lang="vue">{`<script setup>
import { ref } from 'vue'
import { FormBuilder } from '@msflib/vue'

const product = ref({
  name: '',
  stockLevel: 0,
  variations: [{ selected: null }],
})

const elements = [
  { name: 'name', dtype: 'string', label: 'Product name', placeholder: 'T-shirt' },
  { name: 'stockLevel', dtype: 'number', label: 'Stock level', placeholder: '0' },
  {
    name: 'variations.0.selected',
    dtype: 'list',
    label: 'Size',
    mdata: {
      options: [
        { label: 'Small', value: { name: 'S' } },
        { label: 'Medium', value: { name: 'M' } },
        { label: 'XL', value: { name: 'XL' } },
      ],
      valueKey: 'name', // match object values by this key
    },
  },
  { name: 'save', etype: 'submit', label: 'Save product' },
]
</script>

<template>
  <FormBuilder :elements="elements" v-model="product" />
</template>`}</CodeBlock>

      <H3>3. Rich field types: upload, color, date and icons</H3>
      <p>
        The same schema can mix an upload (with client-side validation configured through{' '}
        <C>mdata.validation</C>), a color picker, a date field and input icons:
      </p>
      <CodeBlock lang="vue">{`const elements = [
  {
    name: 'coverImage',
    etype: 'upload',
    label: 'Cover image',
    mdata: { validation: { maxFileSize: 2000, ext: ['jpg', 'png'], mimeType: 'image/' } },
  },
  {
    name: 'accent',
    dtype: 'color',
    label: 'Accent color',
  },
  {
    name: 'releaseDate',
    dtype: 'date',
    label: 'Release date',
  },
  {
    name: 'search',
    dtype: 'string',
    label: 'Filter keyword',
    startIcon: 'fa-solid fa-magnifying-glass',
    endIcon: 'fa-solid fa-xmark',
  },
  { name: 'save', etype: 'submit', label: 'Publish' },
]`}</CodeBlock>

      <H3>4. Programmatic control through the ref</H3>
      <p>
        Everything the builder can do from the outside is exposed on the component ref —
        validate a single field after a server error, or reset uploads after a successful
        save:
      </p>
      <CodeBlock lang="js">{`// after a 409 from the API — highlight only the conflicting field
await fbRef.value.triggerFieldValidation('name')

// validate everything manually (e.g. on a toolbar "Save" button outside the form)
const result = await fbRef.value.triggerValidation()
if (isValid.value) {
  await api.save(formData.value)
  fbRef.value.clearElementFiles() // drop staged uploads after save
}`}</CodeBlock>

      <H2>Gotchas</H2>
      <Note>
        Upload elements (<C>etype: 'upload'</C>) accept{' '}
        <C>mdata.validation = {'{ maxFileSize, ext, mimeType }'}</C>; FormBuilder turns that
        into a <C>FileUpload</C> validator and surfaces failures as Element Plus error
        toasts.
      </Note>
      <ul>
        <li>
          <C>v-model</C> object is <B>mutated in place</B> at nested paths (a deliberate
          performance choice — tests assert the same object reference is updated). Give
          FormBuilder its own reactive object rather than a shared store slice.
        </li>
        <li>
          The bundled <C>FormBuilder.md</C> in the repo describes{' '}
          <C>startIcon</C>/<C>endIcon</C> as objects and an <C>inline</C> flag; the
          implementation uses plain icon-class strings and ignores <C>inline</C>.
        </li>
      </ul>
      <Warning>
        If you bind <C>v-model</C> to a Pinia/Vuex slice, the in-place mutation bypasses
        the store's reactivity guards — bind a local <C>ref({'{}'})</C> instead and commit
        it to the store on submit.
      </Warning>
    </>
  )
}
