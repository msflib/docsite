import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactProfile() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-profile</C> (v0.0.12) covers the current account's profile: fetch,
        update, avatar upload.
      </p>
      <p>
        It is the "single record" member of the module family: one <C>GET /profile</C>{' '}
        query cached under a workspace-scoped key, and mutations that write their response
        straight back into that cache (<C>setQueryData</C>) so every consumer re-renders
        with the fresh profile without a refetch. Creation (<C>POST /profile</C>), partial
        update (<C>PUT /profile</C>), multipart avatar upload (
        <C>PUT /profile/avatar</C> via <C>apiFormDataClient</C>) and deletion are all
        exposed as promise-returning callbacks that forward your{' '}
        <C>onSuccess</C>/<C>onError</C> options.
      </p>
      <p>
        The provider follows the standard architecture: <C>ProfileProvider</C> builds{' '}
        <C>createProfileApi(isWorkspaceScoped)</C>, keys the query with the active
        workspace from <C>useActiveWorkspace()</C>, and optionally defers fetching until{' '}
        <C>{'{ requireAuth: true, isAuthenticated }'}</C> says the session is real — the
        playground mounts it in exactly that configuration.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A profile page / settings form</B> — <C>profile</C> data plus{' '}
          <C>updateProfile</C> with per-field loading flags.
        </li>
        <li>
          <B>Avatar uploads</B> — <C>uploadAvatar(formData)</C> handles the multipart
          client and content type.
        </li>
        <li>
          <B>Immediate cache consistency</B> — every mutation's response is written into
          the same query key that feeds <C>useProfile()</C>.
        </li>
        <li>
          <B>Auth-gated fetching</B> — combine with <C>useAuth()</C>'s status like the
          playground's protected layout does.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { ProfileProvider, useProfile } from '@msflib/react-profile'

<ProfileProvider>
  <ProfileCard />
</ProfileProvider>

function ProfileCard() {
  const { profile, loading, updateProfile, uploadAvatar, refetch } = useProfile()

  const save = async (form) => {
    await updateProfile(form, { onSuccess: () => toast('Saved') })
  }

  const onAvatarPicked = (file) => {
    const fd = new FormData()
    fd.append('file', file)
    uploadAvatar(fd)
  }

  return <div>{profile?.first_name} <button onClick={() => refetch()}>Reload</button></div>
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>profile</C>, <><C>Profile | null</C> — <C>first_name</C>, <C>last_name</C>, <C>avatar</C>, <C>bio</C>, address fields, …</>],
          [<C>createProfile(payload)</C>, 'POST — full <C>ProfilePayload</C>'],
          [<C>updateProfile(payload, options?)</C>, 'PUT-style partial mutation; user callbacks forwarded safely'],
          [<C>uploadAvatar(formData)</C>, 'Multipart upload (matchPath keeps the /profile scope registration)'],
          [<C>deleteProfile(options?)</C>, 'DELETE — clears the cached profile'],
          [<C>refetch</C>, 'Re-run the profile query'],
          [<C>loading.profile</C>, <><C>profile</C>, <C>create</C>, <C>update</C>, <C>uploadAvatar</C>, <C>delete</C> flags</>],
        ]}
      />

      <H2>Wiring</H2>
      <ul>
        <li>
          Endpoint default: <C>/profile</C> (module key <C>profile</C>).
        </li>
        <li>
          Requires <C>QueryClientProvider</C> + <C>&lt;ProfileProvider /&gt;</C>.
        </li>
        <li>
          Override via <C>configureApplication({'{ endpoints: { profile: {...} } })'}</C>.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. A basic profile card</H3>
      <p>
        The minimal consumer: read <C>profile</C>, show a spinner from{' '}
        <C>loading.profile</C>, and force a fresh fetch with <C>refetch()</C>. The query
        has <C>retry: false</C> and a 60-second stale time, so <C>refetch</C> is the way to
        bypass the cache.
      </p>
      <CodeBlock lang="tsx">{`import { useProfile } from '@msflib/react-profile'

export function ProfileCard() {
  const { profile, loading, refetch } = useProfile()

  if (loading.profile) return <p>Loading profile…</p>
  if (!profile) return <p>No profile yet — create one.</p>

  return (
    <article>
      {profile.avatar && <img src={profile.avatar} alt="" width={64} height={64} />}
      <h2>{profile.first_name} {profile.last_name}</h2>
      <p>{profile.bio ?? 'No bio'}</p>
      <p>
        {profile.city ?? '—'}, {profile.country ?? '—'} · joined{' '}
        {new Date(profile.created_at).toLocaleDateString()}
      </p>
      <button onClick={() => refetch()}>Reload</button>
    </article>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: settings form + avatar upload (playground pattern)</H3>
      <p>
        The playground's profile page calls <C>updateProfile(data)</C> from its FormBuilder
        submit handler and gates the provider on auth status. Here's the same shape: a
        small form that sends a partial payload, an avatar input that builds{' '}
        <C>FormData</C>, and error handling through the mutation options — the provider
        writes each response into the cache, so the card above updates instantly.
      </p>
      <CodeBlock lang="tsx">{`import { useRef, useState } from 'react'
import { ProfileProvider, useProfile } from '@msflib/react-profile'
import { useAuth } from '@msflib/react-auth'
import type { UpdateProfilePayload } from '@msflib/react-profile'

export function ProfileRoute() {
  const { status } = useAuth()
  return (
    <ProfileProvider
      options={{
        requireAuth: true,
        isAuthenticated: status === 'authenticated',
        isWorkspaceScoped: true,
      }}
    >
      <Settings />
    </ProfileProvider>
  )
}

function Settings() {
  const { profile, updateProfile, uploadAvatar, loading } = useProfile()
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    const payload: UpdateProfilePayload = {
      first_name: String(form.get('first_name') ?? ''),
      last_name: String(form.get('last_name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      bio: String(form.get('bio') ?? ''),
    }
    try {
      await updateProfile(payload, {
        onSuccess: (updated) => console.log('saved', updated.updated_at),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile')
    }
  }

  const onAvatarPicked = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    await uploadAvatar(fd) // PUT /profile/avatar, multipart
  }

  return (
    <form onSubmit={save}>
      {error && <p role="alert">{error}</p>}
      <img src={profile?.avatar ?? undefined} alt="avatar" width={72} height={72} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => e.target.files?.[0] && onAvatarPicked(e.target.files[0])}
      />
      <button type="button" disabled={loading.uploadAvatar} onClick={() => fileRef.current?.click()}>
        {loading.uploadAvatar ? 'Uploading…' : 'Change avatar'}
      </button>

      <input name="first_name" defaultValue={profile?.first_name ?? ''} />
      <input name="last_name" defaultValue={profile?.last_name ?? ''} />
      <input name="phone" defaultValue={profile?.phone ?? ''} />
      <textarea name="bio" defaultValue={profile?.bio ?? ''} />
      <button disabled={loading.update}>{loading.update ? 'Saving…' : 'Save'}</button>
    </form>
  )
}`}</CodeBlock>

      <H3>3. Advanced: first-run onboarding with create → update flow</H3>
      <p>
        The provider distinguishes "no profile yet" (<C>profile === null</C>) from an
        existing record: onboarding wizards create the profile first, then let users keep
        editing via <C>updateProfile</C>. Deletion clears the cached record, which flips
        the UI back to the empty state.
      </p>
      <CodeBlock lang="tsx">{`import { useProfile } from '@msflib/react-profile'
import type { CreateProfilePayload } from '@msflib/react-profile'

export function OnboardingWizard() {
  const { profile, createProfile, updateProfile, deleteProfile, loading } = useProfile()
  const [step, setStep] = useState(1)

  // Step 1 — create the record once
  const create = async (data: CreateProfilePayload) => {
    await createProfile(data, {
      onSuccess: () => setStep(2),
      onError: (err) => console.error('create failed', err),
    })
  }

  // Step 2+ — partial edits, cache updated in place
  const saveAddress = async (payload: { city: string; country: string; postal_code: string }) => {
    await updateProfile(payload)
    setStep(3)
  }

  if (loading.profile) return <p>Checking profile…</p>

  return profile === null ? (
    <button disabled={loading.create} onClick={() =>
      create({
        first_name: 'Ada',
        last_name: 'Lovelace',
        date_of_birth: '1990-12-10',
        gender: 'female',
        marital_status: 'single',
      })
    }>
      Create my profile
    </button>
  ) : (
    <div>
      <p>Step {step}</p>
      {step === 2 && (
        <AddressForm
          onSave={saveAddress}
          disabled={loading.update}
        />
      )}
      {step === 3 && (
        <button onClick={() => deleteProfile()}>Delete profile and start over</button>
      )}
    </div>
  )
}`}</CodeBlock>

      <Note>
        <C>uploadAvatar</C> and the workspace course/document mutations pass{' '}
        <C>{'{ matchPath: \'/profile\' }'}</C> so the multipart requests register under the
        parent path in the workspace-scoping registry — with header-based tenancy this is a
        no-op, with path-based tenancy it keeps the workspace prefix correct.
      </Note>
    </>
  )
}
