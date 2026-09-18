import { A, B, C, CodeBlock, H2, H3, Table, Warning } from '../../components/md'

export default function ReactTrainers() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-trainers</C> (v0.0.0 — scaffolded, not yet released) mirrors the
        students module for trainers (module key <C>trainers</C>, endpoint default{' '}
        <C>/trainers</C>).
      </p>
      <p>
        Same shape, different directory: <C>GET /trainers</C> lists the workspace's
        trainers with their joined records (<C>{'{ id, account, profile, trainer: { level_id, track_id }, info }'}</C>)
        and <C>GET /trainers/&#123;id&#125;</C> fetches one. The provider exposes the list
        query, mutation-style <C>listTrainers(params)</C> / <C>getTrainer(id)</C> calls
        that write into the workspace-scoped list and detail caches, and per-operation
        loading flags.
      </p>
      <p>
        Where it differs from students is filtering: <C>TrainerListParams</C> accepts{' '}
        <C>level_id</C> and <C>track_id</C> alongside the usual <C>offset</C>/<C>limit</C>,
        so a provider instance can be scoped to one level/track at mount time via{' '}
        <C>options.listParams</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A trainer directory</B> — names, avatars, level/track assignments in one
          query.
        </li>
        <li>
          <B>Filtered staff views</B> — list only trainers of a given level or track
          through <C>listParams</C>.
        </li>
        <li>
          <B>Task-owner resolution</B> — map owner ids from{' '}
          <A to="/react/react-tasks">react-tasks</A> to trainer names.
        </li>
        <li>
          <B>Detail pages</B> — single fetch with account + profile joined.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { TrainersProvider, useTrainers } from '@msflib/react-trainers'

<TrainersProvider>
  <TrainerList />
</TrainersProvider>

function TrainerList() {
  const { trainers, getTrainer, refetch } = useTrainers()
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>trainers</C>, <><C>TrainerRecord[]</C> — each: <C>{'{ id, account, profile, trainer: { level_id, track_id }, info }'}</C></>],
          [<C>listTrainers(params?, options?)</C>, <>On-demand list fetch with <C>{'{ level_id?, track_id?, offset?, limit? }'}</C></>],
          [<C>getTrainer(id, options?)</C>, 'Single fetch; caches under the detail key'],
          [<C>refetch()</C>, 'Re-run the default list query'],
          [<C>loading.trainers / listTrainers / getTrainer</C>, 'Per-operation flags'],
        ]}
      />
      <p>
        Provider options: <C>{'{ isWorkspaceScoped, requireAuth, isAuthenticated, listParams }'}</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic trainer directory</H3>
      <p>
        The minimal read: iterate <C>trainers</C> and render the joined account/profile
        fields. The list query runs on mount (or after auth when{' '}
        <C>{'{ requireAuth: true, isAuthenticated }'}</C> is set) and re-keys per
        workspace.
      </p>
      <CodeBlock lang="tsx">{`import { TrainersProvider, useTrainers } from '@msflib/react-trainers'

export function TrainersPage() {
  return (
    <TrainersProvider options={{ listParams: { offset: 0, limit: 50 } }}>
      <Directory />
    </TrainersProvider>
  )
}

function Directory() {
  const { trainers, loading, refetch } = useTrainers()

  if (loading.trainers) return <p>Loading trainers…</p>

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {trainers.map((t) => (
          <li key={t.id}>
            {t.profile.avatar_url && <img src={t.profile.avatar_url} width={32} height={32} alt="" />}
            <strong>{t.profile.first_name} {t.profile.last_name}</strong>
            <span> · {t.account.email}</span>
            <span> · level {t.trainer.level_id}, track {t.trainer.track_id}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: filter by level/track and fetch details</H3>
      <p>
        The filter row drives <C>listTrainers({'{ level_id, track_id }'})</C> explicitly —
        results land in the list cache keyed by the exact params, so switching filters
        back and forth is instant. A detail pane uses <C>getTrainer</C> with its own
        loading flag.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { TrainersProvider, useTrainers } from '@msflib/react-trainers'

function StaffFinder({ levels }: { levels: { id: number; title: string }[] }) {
  const { trainers, listTrainers, getTrainer, loading } = useTrainers()
  const [selected, setSelected] = useState<any>(null)

  const applyFilter = async (levelId: number) => {
    await listTrainers({ level_id: levelId, offset: 0, limit: 50 })
  }

  const open = async (trainerId: number) => {
    try {
      setSelected(await getTrainer(trainerId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <select defaultValue="" onChange={(e) => e.target.value && applyFilter(Number(e.target.value))}>
        <option value="">All levels</option>
        {levels.map((l) => (
          <option key={l.id} value={l.id}>{l.title}</option>
        ))}
      </select>

      <ul>
        {trainers.map((t) => (
          <li key={t.id} onClick={() => open(t.id)}>
            {t.profile.first_name} {t.profile.last_name}
          </li>
        ))}
      </ul>

      {loading.getTrainer && <p>Opening…</p>}
      {selected && (
        <aside>
          <h3>{selected.profile.first_name} {selected.profile.last_name}</h3>
          <p>{selected.profile.bio}</p>
          <p>Phone: {selected.profile.phone_number ?? '—'}</p>
        </aside>
      )}
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: resolving task owners to trainer names</H3>
      <p>
        A cross-module pattern: <A to="/react/react-tasks">react-tasks</A> returns{' '}
        <C>TaskReadMultiple[]</C> whose rows only carry <C>owner_id</C> (full owner data
        needs a per-task <C>getTask</C> call). Mounting the trainers provider once gives
        you an <C>id → name</C> map for the whole board — both providers re-key together
        on tenant switches, so the mapping stays tenant-correct.
      </p>
      <CodeBlock lang="tsx">{`import { useMemo } from 'react'
import { TrainersProvider, useTrainers } from '@msflib/react-trainers'
import { TasksProvider, useTasks } from '@msflib/react-tasks'

export function TaskBoard() {
  return (
    <TrainersProvider options={{ listParams: { offset: 0, limit: 100 } }}>
      <TasksProvider>
        <Board />
      </TasksProvider>
    </TrainersProvider>
  )
}

function Board() {
  const { trainers } = useTrainers()
  const { tasks, loading } = useTasks()

  const ownerName = useMemo(() => {
    const byId = new Map<number, string>()
    trainers.forEach((t) =>
      byId.set(t.id, \`\${t.profile.first_name ?? ''} \${t.profile.last_name ?? ''}\`.trim()),
    )
    return (ownerId: number) => byId.get(ownerId) ?? \`Trainer #\${ownerId}\`
  }, [trainers])

  if (loading.tasks) return <p>Loading…</p>

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <strong>{task.title}</strong> — by {ownerName(task.owner_id)}
        </li>
      ))}
    </ul>
  )
}`}</CodeBlock>

      <Warning>
        The package sits at version <C>0.0.0</C> — it's included in lockstep changeset
        releases but should be treated as unreleased until it gets a real version bump.
      </Warning>
    </>
  )
}
