import { A, B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function ReactTasks() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-tasks</C> (v0.0.7) manages LMS tasks and submissions plus the
        admin promotion/demotion flows (module key <C>tasks</C>).
      </p>
      <p>
        The module covers the whole task lifecycle: tasks belong to a{' '}
        <C>level/track/stage</C> taxonomy and carry <C>points</C>, <C>due_date</C>,{' '}
        <C>status</C> (<C>'posted' | 'unposted'</C>) and <C>options</C>; students submit
        URLs against a task (<C>POST /tasks/&#123;id&#125;/submit</C>) and trainers grade
        submissions (<C>POST /tasks/&#123;id&#125;/grade</C> with{' '}
        <C>{'[ { id, score } ]'}</C>). Score aggregation lives in{' '}
        <C>GET /submissions/scores</C>, and the admin area — promotions and demotions under{' '}
        <C>/tasks/admin/*</C> — is opt-in via <C>{'{ enableAdminAccess: true }'}</C>,
        which controls whether those queries run at all.
      </p>
      <p>
        The provider is the "dashboard" shape: five queries (tasks, submissions,
        submission scores, promotions, demotions) keyed by workspace + query params, each
        with list-style mutations that hit the same endpoints on demand, plus detail
        mutations (<C>getTask</C>, <C>createTask</C>, <C>updateTask</C>, <C>submitTask</C>,{' '}
        <C>gradeTask</C>) that write their results into the per-task detail cache and
        invalidate the collections. <C>useGetTask(taskId)</C> is the standalone detail
        hook.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A learner task board</B> — tasks with due dates and points, submit
          flow with loading flags.
        </li>
        <li>
          <B>A trainer grading view</B> — submissions alongside student profiles, batch
          scoring via <C>gradeTask</C>.
        </li>
        <li>
          <B>Leaderboards</B> — <C>submissionScores</C> pairs{' '}
          <C>{'{ student_id, total_score, total_points }'}</C>.
        </li>
        <li>
          <B>Admin moderation</B> — promote/demote tasks between stages when{' '}
          <C>enableAdminAccess</C> is on.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { TasksProvider, useTasks } from '@msflib/react-tasks'

<TasksProvider>
  <TaskBoard />
</TasksProvider>

function TaskBoard() {
  const { tasks, submissions, getTask, promoteTask, demoteTask, loading } = useTasks()
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Endpoint default', 'Notes']}
        rows={[
          [<C>tasks</C>, <C>/tasks</C>, <><C>TaskReadMultiple[]</C> with <C>level_id/track_id/stage_id</C>, <C>points</C>, <C>due_date</C>, <C>status</C></>],
          [<C>trainers</C>, <C>/tasks</C>, 'Trainer profiles referenced by the task list'],
          [<C>submissions</C>, <C>/submissions</C>, <><C>SubmissionWithTask[]</C> — each carries its <C>task</C> snapshot</>],
          [<C>students</C>, <C>/submissions</C>, 'Student profiles referenced by the submissions'],
          [<C>submissionScores</C>, <C>/submissions/scores</C>, <C>{'{ student_id, total_score, total_points }'}</C>],
          [<C>getTask(id)</C>, <C>/tasks/&#123;id&#125;</C>, <>Full <C>TaskRead</C> (level/track/stage objects, owner, submissions) cached per id</>],
          [<C>createTask(data) / updateTask(id, data)</C>, <C>/tasks</C>, 'Admin CRUD; <C>TaskCreatePayload</C> and its partial update'],
          [<C>submitTask(taskId, {'{ submission_urls }'})</C>, <C>/tasks/&#123;id&#125;/submit</C>, 'Learner submission'],
          [<C>gradeTask(taskId, [{'{ id, score }'}])</C>, <C>/tasks/&#123;id&#125;/grade</C>, 'Batch scoring for one task'],
          [<C>promoteTask / demoteTask + listPromotions / listDemotions</C>, <C>/tasks/admin/promotions | demotions</C>, 'Only fetched when <C>{ enableAdminAccess: true }</C>'],
          [<C>loading.*</C>, '—', 'Per-operation flags (tasks, submissions, submitTask, gradeTask, promoteTask, …)'],
        ]}
      />

      <p>
        Standard provider wiring; endpoint overrides via{' '}
        <C>configureApplication({'{ endpoints: { tasks: {...} } })'}</C>. Provider
        options: <C>{'{ isWorkspaceScoped, requireAuth, isAuthenticated, enableAdminAccess, query }'}</C>{' '}
        (query defaults to <C>{'{ offset: 0, limit: 100 }'}</C>).
      </p>

      <H2>Examples</H2>

      <H3>1. A basic task list with detail fetch</H3>
      <p>
        The minimal board: render <C>tasks</C> from the provider's list query and load the
        full <C>TaskRead</C> (with level/track/stage objects and owner) via{' '}
        <C>getTask</C> when a row is clicked. The result lands in the detail cache, so{' '}
        <C>useGetTask</C> consumers elsewhere read it for free.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { TasksProvider, useTasks } from '@msflib/react-tasks'

export function TasksPage() {
  return (
    <TasksProvider options={{ query: { offset: 0, limit: 25 } }}>
      <TaskBoard />
    </TasksProvider>
  )
}

function TaskBoard() {
  const { tasks, getTask, loading } = useTasks()
  const [detail, setDetail] = useState<any>(null)

  const open = async (taskId: number) => {
    try {
      setDetail(await getTask(taskId))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading.tasks) return <p>Loading tasks…</p>

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} onClick={() => open(task.id)}>
            <strong>{task.title}</strong> · {task.points} pts · due {task.due_date}
            <em> ({task.status})</em>
          </li>
        ))}
      </ul>

      {detail && (
        <article>
          <h2>{detail.title}</h2>
          <p>{detail.description}</p>
          <p>Level: {detail.level?.title} · Track: {detail.track?.title} · Stage: {detail.stage?.title}</p>
          <p>Owner: {detail.owner?.account?.username ?? detail.owner_id}</p>
        </article>
      )}
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: learner submit flow with error handling</H3>
      <p>
        The student workflow: pick a task, paste submission URLs, and call{' '}
        <C>submitTask</C>. While <C>loading.submitTask</C> is pending the button locks;
        on success the returned <C>TaskRead</C> refreshes the detail cache and the task
        collections, so a "submitted" badge appears immediately; failures surface through
        the caught rejection.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { TasksProvider, useTasks } from '@msflib/react-tasks'

function SubmitPanel({ taskId }: { taskId: number }) {
  const { submitTask, getTask, loading } = useTasks()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const urls = String(new FormData(event.currentTarget).get('urls') ?? '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)

    try {
      const task = await submitTask(taskId, { submission_urls: urls })
      setDone(true)
      console.log('submitted against', task.title)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    }
  }

  if (done) return <p>Submitted — awaiting grading.</p>

  return (
    <form onSubmit={submit}>
      {error && <p role="alert">{error}</p>}
      <input name="urls" placeholder="https://github.com/…, https://demo.example" required />
      <button disabled={loading.submitTask}>
        {loading.submitTask ? 'Submitting…' : 'Submit task'}
      </button>
    </form>
  )
}`}</CodeBlock>

      <H3>3. Advanced: trainer grading queue with submissions and scores</H3>
      <p>
        Combine the provider's parallel queries: <C>submissions</C> (with their{' '}
        <C>task</C> snapshot), <C>students</C> for names, and <C>submissionScores</C> for
        the leaderboard. Grading posts <C>{'[ { id, score } ]'}</C> for one task and
        invalidates everything, keeping the score table fresh.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { TasksProvider, useTasks } from '@msflib/react-tasks'

export function GradingConsole() {
  return (
    <TasksProvider options={{ enableAdminAccess: false }}>
      <Console />
    </TasksProvider>
  )
}

function Console() {
  const { submissions, students, submissionScores, gradeTask, loading } = useTasks()
  const [draftScores, setDraftScores] = useState<Record<number, number>>({})

  const studentName = (studentId: number) =>
    students.find((s) => s.id === studentId)?.profile &&
    String((students.find((s) => s.id === studentId)!.profile as any).first_name ?? studentId)

  const gradeAllFor = async (taskId: number) => {
    const payload = submissions
      .filter((s) => s.task_id === taskId)
      .map((s) => ({ id: s.id, score: draftScores[s.id] ?? 0 }))

    try {
      await gradeTask(taskId, payload, {
        onSuccess: (task) => console.log('graded', task.title),
      })
      setDraftScores({})
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
      <section>
        <h2>Submissions</h2>
        {loading.submissions && <p>Loading…</p>}
        {Object.entries(
          submissions.reduce<Record<number, typeof submissions>>((acc, s) => {
            (acc[s.task_id] ??= []).push(s)
            return acc
          }, {}),
        ).map(([taskId, group]) => (
          <div key={taskId}>
            <h3>{group[0].task.title}</h3>
            {group.map((s) => (
              <label key={s.id}>
                {studentName(s.student_id)} — {s.status}
                <input
                  type="number"
                  value={draftScores[s.id] ?? ''}
                  onChange={(e) =>
                    setDraftScores((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))
                  }
                />
              </label>
            ))}
            <button onClick={() => gradeAllFor(Number(taskId))} disabled={loading.gradeTask}>
              {loading.gradeTask ? 'Grading…' : 'Grade all'}
            </button>
          </div>
        ))}
      </section>

      <aside>
        <h2>Leaderboard</h2>
        <ol>
          {[...submissionScores]
            .sort((a, b) => b.total_score - a.total_score)
            .map((row) => (
              <li key={row.student_id}>
                {studentName(row.student_id)}: {row.total_score}/{row.total_points}
              </li>
            ))}
        </ol>
      </aside>
    </div>
  )
}`}</CodeBlock>

      <H3>4. Advanced: admin moderation with enableAdminAccess</H3>
      <p>
        Promotions and demotions live under <C>/tasks/admin/*</C>. Their queries only run
        when the provider is created with <C>{'{ enableAdminAccess: true }'}</C> (and, if{' '}
        <C>requireAuth</C> is set, the session is real); <C>promoteTask</C>/{' '}
        <C>demoteTask</C> mutate by <C>task_id</C> and invalidate the whole task
        collection.
      </p>
      <CodeBlock lang="tsx">{`import { TasksProvider, useTasks } from '@msflib/react-tasks'
import { useAuth } from '@msflib/react-auth'

export function AdminTasksPage() {
  const { status } = useAuth()
  const isAdmin = status === 'authenticated' // gate on your own role check too

  return (
    <TasksProvider
      options={{
        requireAuth: true,
        isAuthenticated: isAdmin,
        enableAdminAccess: true,
        isWorkspaceScoped: true,
      }}
    >
      <Moderation />
    </TasksProvider>
  )
}

function Moderation() {
  const { tasks, promotions, demotions, promoteTask, demoteTask, loading, refetch } = useTasks()

  return (
    <div>
      <header>
        <h1>Task moderation</h1>
        <button onClick={() => void refetch()}>Refresh all</button>
      </header>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} ({task.status})
            <button
              disabled={loading.promoteTask}
              onClick={() => promoteTask({ task_id: task.id })}
            >
              Promote
            </button>
            <button
              disabled={loading.demoteTask}
              onClick={() => demoteTask({ task_id: task.id })}
            >
              Demote
            </button>
          </li>
        ))}
      </ul>

      <p>
        Recent promotions: {promotions.length} · demotions: {demotions.length}
        <em> (empty arrays until enableAdminAccess queries resolve)</em>
      </p>
    </div>
  )
}`}</CodeBlock>

      <Note>
        <C>createTask</C> requires the taxonomy ids (<C>level_id</C>, <C>track_id</C>,{' '}
        <C>stage_id</C>), <C>points</C>, <C>cutoff</C>, <C>due_date</C> and{' '}
        <C>status</C> — fetch them from <A to="/react/react-categories">react-categories</A>{' '}
        (<C>/cat/levels</C>, <C>/cat/tracks</C>, <C>/cat/stages</C>) to build the form.
      </Note>

      <Warning>
        The admin list queries (<C>promotions</C>, <C>demotions</C>) hit{' '}
        <C>/tasks/admin/*</C> — mounting a provider with <C>enableAdminAccess: true</C> for
        non-admin users will 403. Keep it behind your role check.
      </Warning>
    </>
  )
}
