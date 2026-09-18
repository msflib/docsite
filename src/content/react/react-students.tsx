import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactStudents() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-students</C> (v0.0.1) lists LMS students (module key{' '}
        <C>students</C>, endpoint default <C>/students</C>).
      </p>
      <p>
        It is a read-only directory module: <C>GET /students</C> returns the workspace's
        learners with their joined records (<C>{'{ id, account, profile, student: { level_id, track_id, stage_id }, info }'}</C>)
        and <C>GET /students/&#123;id&#125;</C> fetches one. Because the backend does the
        account/profile joining, a single row is enough to render a roster card — no
        waterfall requests. The provider exposes the list as a query plus mutation-style
        <C> listStudents(params)</C> / <C>getStudent(id)</C> calls that write into the
        matching query caches (list and per-student detail keys, both workspace-scoped).
      </p>
      <p>
        Options flow through <C>StudentsProvider options</C>: <C>listParams</C>{' '}
        (<C>{'{ offset, limit }'}</C>) controls the default page, tenancy follows{' '}
        <C>isWorkspaceScoped</C>, and <C>{'{ requireAuth, isAuthenticated }'}</C> defers
        fetching until the session is real. A standalone <C>useGetStudent(studentId)</C>{' '}
        query exists for detail views.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A roster/table view</B> — the whole workspace's learners with names, avatars
          and taxonomy ids.
        </li>
        <li>
          <B>A member detail page</B> — one student with account + profile in a single
          response.
        </li>
        <li>
          <B>Lookup tables</B> — map <C>student_id</C> from submissions or scores to a
          display name without extra calls.
        </li>
        <li>
          <B>Tenant-correct data</B> — results re-key per active workspace
          automatically.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { StudentsProvider, useStudents } from '@msflib/react-students'

<StudentsProvider>
  <Roster />
</StudentsProvider>

function Roster() {
  const { students, getStudent, refetch } = useStudents()
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>students</C>, <><C>StudentRecord[]</C> — each: <C>{'{ id, account, profile, student: { level_id, track_id, stage_id }, info }'}</C></>],
          [<C>listStudents(params?, options?)</C>, <>On-demand list fetch; caches under the list key for the params used</>],
          [<C>getStudent(id, options?)</C>, 'Single fetch; caches under the detail key'],
          [<C>refetch()</C>, 'Re-run the default list query'],
          [<C>loading.students / listStudents / getStudent</C>, 'Per-operation flags'],
        ]}
      />
      <p>
        Standalone hook: <C>useGetStudent(studentId?)</C> — disabled until an id is
        passed, keyed by workspace + student id.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic roster list</H3>
      <p>
        The smallest roster: iterate <C>students</C> and read the joined{' '}
        <C>account</C>/<C>profile</C> objects directly. Field names differ slightly from
        the auth <C>Me</C> type — profiles here use <C>avatar_url</C> and{' '}
        <C>phone_number</C>.
      </p>
      <CodeBlock lang="tsx">{`import { StudentsProvider, useStudents } from '@msflib/react-students'

export function RosterPage() {
  return (
    <StudentsProvider options={{ listParams: { offset: 0, limit: 50 } }}>
      <Roster />
    </StudentsProvider>
  )
}

function Roster() {
  const { students, loading, refetch } = useStudents()

  if (loading.students) return <p>Loading roster…</p>

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.profile.avatar_url && <img src={s.profile.avatar_url} width={32} height={32} alt="" />}
            <strong>{s.profile.first_name} {s.profile.last_name}</strong>
            <span> · {s.account.email}</span>
            <span> · level {s.student.level_id}, track {s.student.track_id}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: roster table + detail drawer</H3>
      <p>
        Combine the list with <C>getStudent</C>: clicking a row fetches the full record
        (cached under the detail key) and opens a drawer. The <C>loading.getStudent</C>{' '}
        flag drives the drawer's spinner, and errors surface through the caught{' '}
        <C>mutateAsync</C> rejection.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { StudentsProvider, useStudents } from '@msflib/react-students'
import { TableWidget } from '@msflib/react-components'

export function StudentsExplorer() {
  return (
    <StudentsProvider options={{ listParams: { offset: 0, limit: 100 } }}>
      <Explorer />
    </StudentsProvider>
  )
}

function Explorer() {
  const { students, getStudent, loading } = useStudents()
  const [selected, setSelected] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const open = async (studentId: number) => {
    setError(null)
    try {
      setSelected(await getStudent(studentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load student')
    }
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}

      <TableWidget
        rows={students.map((s) => ({
          id: s.id,
          name: \`\${s.profile.first_name ?? ''} \${s.profile.last_name ?? ''}\`.trim(),
          avatar: s.profile.avatar_url ?? undefined,
          email: s.account.email,
          level: s.student.level_id,
        }))}
        columns={[
          { field: 'avatar', headerName: '', width: 64 },
          { field: 'name', headerName: 'Student', flex: 1 },
          { field: 'email', headerName: 'Email', flex: 1 },
          { field: 'level', headerName: 'Level', width: 90 },
        ]}
        loading={loading.students}
        enableSearch
        tableTitle="Students"
        onRowClick={(params) => open(params.row.id)}
      />

      {loading.getStudent && <p>Opening…</p>}
      {selected && (
        <aside>
          <h3>{selected.profile.first_name} {selected.profile.last_name}</h3>
          <p>{selected.profile.bio}</p>
          <p>Phone: {selected.profile.phone_number ?? '—'}</p>
          <p>Stage: {String(selected.student.stage_id ?? 'not assigned')}</p>
        </aside>
      )}
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: workspace-scoped lookup map + standalone detail hook</H3>
      <p>
        Two patterns at once: build a memoized <C>id → name</C> map from the provider list
        for rendering foreign keys (submission leaderboards, task groups), and use the
        standalone <C>useGetStudent</C> for a page that only needs one student and
        shouldn't mount the whole provider.
      </p>
      <CodeBlock lang="tsx">{`import { useMemo } from 'react'
import { StudentsProvider, useStudents, useGetStudent } from '@msflib/react-students'

export function StudentNameProvider({ children }: { children: React.ReactNode }) {
  return <StudentsProvider>{children}</StudentsProvider>
}

export function useStudentNames() {
  const { students } = useStudents()
  return useMemo(() => {
    const byId = new Map<number, string>()
    students.forEach((s) =>
      byId.set(s.id, \`\${s.profile.first_name ?? ''} \${s.profile.last_name ?? ''}\`.trim()),
    )
    return (studentId: number) => byId.get(studentId) ?? \`Student #\${studentId}\`
  }, [students])
}

export function StudentProfilePage({ studentId }: { studentId: number }) {
  const { data: student, isPending } = useGetStudent(studentId)

  if (isPending) return <p>Loading…</p>

  return (
    <article>
      <h1>{student?.profile.first_name} {student?.profile.last_name}</h1>
      <p>Username: {student?.account.username}</p>
      <p>Level {student?.student.level_id} · Track {student?.student.track_id}</p>
    </article>
  )
}`}</CodeBlock>

      <Note>
        The provider's <C>listStudents(params)</C> caches under the key built from the
        exact params passed — call it with <C>{'{ offset: 0, limit: 100 }'}</C> and the
        result is reused by any consumer asking for the same page.
      </Note>
    </>
  )
}
