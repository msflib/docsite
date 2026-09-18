import { B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function ReactCertificate() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-certificate</C> (v0.0.7) covers both sides of certificate
        generation: the end user's certificates and the admin configuration used to build
        them (field names, fonts, users, previews).
      </p>
      <p>
        The backend model is a two-stage pipeline. Admins create a{' '}
        <B>certificate config</B> — an uploaded template image plus a list of{' '}
        <B>placeholders</B> (text or image) positioned over it — and then generate actual{' '}
        <B>certificates</B> from that config, either for cohorts (<C>level_ids</C>,{' '}
        <C>track_ids</C>, <C>stage_ids</C>) or for explicit user ids. Users fetch their own
        certificate via <C>GET /certificates/me</C>. The module also exposes the admin
        metadata the builder UI needs: available <C>fieldNames</C> (with their{' '}
        <C>'text' | 'image'</C> type) and <C>fonts</C>.
      </p>
      <p>
        The provider is the "admin dashboard" shape: five queries (me, configs, user
        certificates, field names, fonts) run on mount, config upload/update use{' '}
        <C>apiFormDataClient</C> (multipart — template file plus fields), preview returns a
        rendered <C>string</C> (a data URI/URL you can drop into an <C>{'<img>'}</C>), and
        generate/add/delete-users invalidate the affected collections. Standalone{' '}
        <C>useGetUserCertificate(userId)</C> fetches one user's certificate without the
        provider.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A "my certificates" screen</B> — <C>certificate</C> from{' '}
          <C>/certificates/me</C> with a single loading flag.
        </li>
        <li>
          <B>A certificate builder (admin)</B> — upload templates, edit placeholders,
          preview before generating.
        </li>
        <li>
          <B>Bulk issuance</B> — generate for levels/tracks/stages or attach specific
          users with <C>addUsersCertificate</C>.
        </li>
        <li>
          <B>Builder metadata</B> — field names and fonts drive the placeholder editor's
          dropdowns.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { CertificateProvider, useCertificate } from '@msflib/react-certificate'

<CertificateProvider>
  <MyCertificates />
</CertificateProvider>

function MyCertificates() {
  const { certificate, configs, fieldNames, fonts, generateCertificates, loading } = useCertificate()

  const generate = (configId, payload) => generateCertificates(configId, payload, { onSuccess: download })
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Endpoint default', 'Notes']}
        rows={[
          [<C>certificate</C>, <C>/certificates/me</C>, "Current account's own certificate (<C>Certificate | null</C>)"],
          [<C>configs</C>, <C>/admin/certificates/config</C>, 'Admin builder configurations with <C>placeholders</C>'],
          [<C>getConfig(id)</C>, '—', 'Lookup from the cached configs list'],
          [<C>uploadConfig(formData)</C>, <C>/admin/certificates/config/upload</C>, 'Multipart create (template file + fields)'],
          [<C>updateConfig(configId, formData)</C>, <C>/admin/certificates/config/&#123;id&#125;</C>, 'Multipart update'],
          [<C>deleteConfig(configId)</C>, <C>/admin/certificates/config/&#123;id&#125;</C>, 'Removes the config'],
          [<C>previewCertificate(formData)</C>, <C>/admin/certificates/config/preview</C>, 'Returns a rendered preview <C>string</C>'],
          [<C>generateCertificates(configId, payload)</C>, <C>/admin/certificates/config/&#123;id&#125;/generate</C>, <>Body: <C>{'{ level_ids?, track_ids?, stage_ids?, update_if_exist? }'}</C></>],
          [<C>userCertificates</C>, <C>/admin/certificates/users</C>, <>All issued certificates (<C>offset</C>/<C>limit</C> defaults 0/100)</>],
          [<C>addUsersCertificate(configId, {'{ user_ids }'})</C>, <C>/admin/certificates/config/&#123;id&#125;/users</C>, 'Attach specific users'],
          [<C>deleteUsersCertificate(userIds)</C>, <C>/admin/certificates/users?user_ids=…</C>, 'Revoke for users'],
          [<C>fieldNames</C>, <C>/admin/certificates/fieldnames</C>, <><C>{'{ id, field_name, type }'}</C> — 'text' | 'image'</>],
          [<C>fonts</C>, <C>/admin/certificates/fonts</C>, <C>{'{ font_family, type, url }'}</C>],
          [<C>loading.*</C>, '—', 'Per-operation flags (certificate, configs, uploadConfig, preview, generate, …)'],
        ]}
      />
      <p>
        Module key for endpoint overrides: <C>certificate</C>. Standalone hook:{' '}
        <C>useGetUserCertificate(userId?)</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic "my certificate" screen</H3>
      <p>
        The learner-facing side is one query: <C>certificate</C> is the record from{' '}
        <C>/certificates/me</C> — <C>{'{ id, name, url, document_type, … }'}</C>. Render
        the URL in an <C>{'<img>'}</C> or offer a download link.
      </p>
      <CodeBlock lang="tsx">{`import { CertificateProvider, useCertificate } from '@msflib/react-certificate'

export function CertificatePage() {
  return (
    <CertificateProvider>
      <MyCertificate />
    </CertificateProvider>
  )
}

function MyCertificate() {
  const { certificate, loading } = useCertificate()

  if (loading.certificate) return <p>Loading your certificate…</p>
  if (!certificate) return <p>No certificate yet — finish a track to earn one.</p>

  return (
    <figure>
      <img src={certificate.url} alt={certificate.name} width={640} />
      <figcaption>
        {certificate.name} · issued {new Date(certificate.created_at).toLocaleDateString()}
      </figcaption>
      <a href={certificate.url} download>
        Download ({certificate.document_type})
      </a>
    </figure>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: admin builder — upload config and preview</H3>
      <p>
        The admin flow around template upload and preview: build <C>FormData</C> with the
        template image and config fields for <C>uploadConfig</C>, then POST the same kind
        of payload to <C>previewCertificate</C> and render the returned string directly as
        an image source while editing placeholders.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { CertificateProvider, useCertificate } from '@msflib/react-certificate'

function ConfigEditor() {
  const { uploadConfig, previewCertificate, fieldNames, fonts, loading } = useCertificate()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onTemplatePicked = async (file: File, name: string) => {
    const fd = new FormData()
    fd.append('template', file)
    fd.append('name', name)
    fd.append('resolution', '300')
    await uploadConfig(fd, { onSuccess: (config) => console.log('saved', config.id) })
  }

  const refreshPreview = async (file: File) => {
    const fd = new FormData()
    fd.append('template', file)
    fd.append('placeholders', JSON.stringify([
      {
        type: 'text', field_name: 'full_name',
        position: [120, 200], size: [400, 40],
        rotation: 0, opacity: 1, alignment: 'center', text_case: 'uppercase',
        font_family: fonts[0]?.font_family ?? 'Arial', font_size: 24,
        text_color: '#1a1a1a', font_weight: 700, italic: false, underline: false,
      },
    ]))
    const url = await previewCertificate(fd) // string — drop into <img src>
    setPreviewUrl(url)
  }

  return (
    <div>
      {previewUrl && <img src={previewUrl} alt="Certificate preview" width={640} />}
      <ul>
        {fieldNames.map((f) => (
          <li key={f.id}>{f.field_name} ({f.type})</li>
        ))}
      </ul>
      <button disabled={loading.preview}>Preview</button>
      <button disabled={loading.uploadConfig}>Upload template</button>
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: generate for a cohort and revoke users</H3>
      <p>
        The issuance loop: pick a config, generate certificates for levels/tracks/stages
        (or explicit users), then manage recipients. <C>generateCertificates</C> and{' '}
        <C>addUsersCertificate</C> return the created <C>Certificate[]</C> and refresh the
        admin collections; <C>deleteUsersCertificate</C> revokes by user ids and also
        invalidates the cached lists.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { CertificateProvider, useCertificate } from '@msflib/react-certificate'

function IssuancePanel({ configId }: { configId: number }) {
  const {
    getConfig,
    generateCertificates,
    addUsersCertificate,
    deleteUsersCertificate,
    userCertificates,
    loading,
  } = useCertificate()

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const config = getConfig(configId) // from the cached configs list

  const generate = async () => {
    await generateCertificates(
      configId,
      { level_ids: [3], track_ids: [7], update_if_exist: true },
      {
        onSuccess: (certs) => console.log(\`\${certs.length} certificates generated\`),
        onError: (err) => console.error('generation failed', err),
      },
    )
  }

  const attachUsers = async () => {
    await addUsersCertificate(configId, { user_ids: selectedUsers })
    setSelectedUsers([])
  }

  return (
    <div>
      <h2>{config?.name ?? 'Config #' + configId}</h2>
      <p>{config?.placeholders.length ?? 0} placeholders configured</p>

      <button onClick={generate} disabled={loading.generate}>
        {loading.generate ? 'Generating…' : 'Generate for cohort'}
      </button>

      <button onClick={attachUsers} disabled={loading.addUsers || selectedUsers.length === 0}>
        Grant to {selectedUsers.length} users
      </button>
      <button
        onClick={() => deleteUsersCertificate(selectedUsers)}
        disabled={loading.deleteUsers || selectedUsers.length === 0}
      >
        Revoke
      </button>

      <ul>
        {userCertificates.map((cert) => (
          <li key={cert.id}>{cert.name} — {cert.url}</li>
        ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <Note>
        All four config mutations are workspace-scoped by default (configs carry a{' '}
        <C>workspace_id</C>), so a tenant switch shows that tenant's configs; the{' '}
        <C>certificates/me</C> query is keyed per workspace too.
      </Note>

      <Warning>
        The list queries (configs, user certificates, field names, fonts) run as soon as
        the provider mounts unless <C>{'{ requireAuth: true, isAuthenticated }'}</C> is set
        — mirror the session into the provider like the playground does to avoid 401 noise
        on public pages.
      </Warning>
    </>
  )
}
