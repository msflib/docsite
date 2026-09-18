import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactCategories() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-categories</C> (v0.0.1) provides typed category lists against the
        generic <C>/cat/&lt;categoryType&gt;</C> backend endpoint (module key{' '}
        <C>categories</C>).
      </p>
      <p>
        The backend exposes one collection route parameterized by a type slug —{' '}
        <C>/cat/levels</C>, <C>/cat/tracks</C>, <C>/cat/stages</C>, <C>/cat/skills</C>…
        every row sharing the <C>Category</C> shape (<C>{'{ id, name, title, description, tags, order }'}</C>).
        This module lets you treat each type as its own cached list: declare the types you
        need on <C>CategoryProvider</C> (it prefetches all of them with{' '}
        <C>useQueries</C>), then read or mutate any of them through{' '}
        <C>useCategories({'{ categoryType }'})</C>, which adds create/update/delete
        mutations scoped to that type.
      </p>
      <p>
        Tenancy and auth behave like every module: each type gets its own{' '}
        <C>createCategoryApi(categoryType, isWorkspaceScoped)</C> factory reading{' '}
        <C>endpoints.categories</C> (default <C>/cat</C>), queries are keyed by{' '}
        <C>[workspace, type, query]</C>, and <C>{'{ requireAuth, isAuthenticated }'}</C>{' '}
        gates fetching. <C>useCategory</C> is an alias of <C>useCategories</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>LMS taxonomies</B> — levels, tracks and stages for tasks and courses from
          one endpoint family.
        </li>
        <li>
          <B>Multiple types at once</B> — prefetch all needed types on the provider and
          read them per component.
        </li>
        <li>
          <B>Admin CRUD on taxonomies</B> — create/update/delete per type with automatic
          list invalidation.
        </li>
        <li>
          <B>Custom types without new packages</B> — any slug works; the API factory is
          exported for one-off use.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { CategoryProvider, useCategories, createCategoryApi } from '@msflib/react-categories'

<CategoryProvider categoryTypes={['levels', 'tracks']}>
  <TagPicker />
</CategoryProvider>

function TagPicker() {
  const levels = useCategories({ categoryType: 'levels' })
  const tracks = useCategories({ categoryType: 'tracks' })
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Notes']}
        rows={[
          [<C>useCategories({'{ categoryType, query? }'})</C>, <>Full consumer context for one type: <C>categories</C>, CRUD mutations, <C>loading</C> — must run inside <C>CategoryProvider</C></>],
          [<C>useCategory</C>, 'Alias of useCategories'],
          [<C>categories</C>, "The list for the hook's type"],
          [<C>createCategory(data, options?)</C>, 'POST <C>/cat/&lt;type&gt;</C> — invalidates the type on success'],
          [<C>updateCategory(categoryId, data, options?)</C>, 'PUT <C>/cat/&lt;type&gt;/&#123;id&#125;</C>'],
          [<C>deleteCategory(categoryId, options?)</C>, 'DELETE <C>/cat/&lt;type&gt;/&#123;id&#125;</C>'],
          [<C>refetch()</C>, "Re-run this type's list query"],
          [<C>createCategoryApi(categoryType, isWorkspaceScoped)</C>, 'Direct API factory — control tenancy per category type'],
        ]}
      />

      <p>
        Because the backend route is generic, the React module is thin by design: pick a{' '}
        <C>categoryType</C>, choose whether the requests are workspace-scoped, and read the
        list.
      </p>

      <H2>Examples</H2>

      <H3>1. Two taxonomy dropdowns from one provider</H3>
      <p>
        The typical LMS filter row: the provider prefetches <C>levels</C> and{' '}
        <C>tracks</C> (parallel <C>useQueries</C>), and each component picks its slice via{' '}
        <C>useCategories</C>. Loading and error flags are per type through{' '}
        <C>loading.byType</C> semantics on the provider and <C>loading.categories</C> on
        the hook.
      </p>
      <CodeBlock lang="tsx">{`import { CategoryProvider, useCategories } from '@msflib/react-categories'

export function TaxonomyFilters() {
  return (
    <CategoryProvider categoryTypes={['levels', 'tracks', 'stages']}>
      <Filters />
    </CategoryProvider>
  )
}

function Filters() {
  const levels = useCategories({ categoryType: 'levels' })
  const tracks = useCategories({ categoryType: 'tracks' })

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <label>
        Level
        <select disabled={levels.loading.categories}>
          <option value="">All</option>
          {levels.categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </label>
      <label>
        Track
        <select disabled={tracks.loading.categories}>
          <option value="">All</option>
          {tracks.categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </label>
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: admin CRUD on the "skills" taxonomy</H3>
      <p>
        Create, rename and delete skills with the hook's mutations — each one invalidates
        the <C>skills</C> list on success, so the table refreshes without manual cache
        work. Update payloads are partial and (per <C>UpdateCategoryPayload</C>) cannot
        change <C>name</C>, only the display fields.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { CategoryProvider, useCategories } from '@msflib/react-categories'

export function SkillsAdmin() {
  return (
    <CategoryProvider categoryType="skills">
      <SkillsTable />
    </CategoryProvider>
  )
}

function SkillsTable() {
  const { categories, createCategory, updateCategory, deleteCategory, loading, refetch } =
    useCategories({ categoryType: 'skills' })
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onCreate = async () => {
    setError(null)
    try {
      // CategoryPayload: { name, title, description, tags, order }
      await createCategory({
        name: title.toLowerCase().replace(/\\s+/g, '-'),
        title,
        description: '',
        tags: [],
        order: categories.length,
      })
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    }
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}

      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New skill" />
        <button onClick={onCreate} disabled={loading.create || !title}>
          {loading.create ? 'Saving…' : 'Add skill'}
        </button>
      </div>

      <ul>
        {categories.map((skill) => (
          <li key={skill.id}>
            {skill.title} (#{skill.order})
            <button
              disabled={loading.update}
              onClick={() =>
                updateCategory(skill.id, { title: \`\${skill.title} ✎\`, order: 0 })
              }
            >
              Rename
            </button>
            <button
              disabled={loading.delete}
              onClick={() => deleteCategory(skill.id, { onError: console.error })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => void refetch()}>Refresh</button>
    </div>
  )
}`}</CodeBlock>

      <H3>3. Advanced: paginated one-off lists with the API factory</H3>
      <p>
        When a screen needs a different pagination window (or doesn't want the provider),
        call <C>createCategoryApi</C> directly — same defaults, same tenancy rules, your
        own query params via the <C>query</C> option (<C>offset</C>, <C>limit</C>, any
        extra string/number/boolean filter).
      </p>
      <CodeBlock lang="tsx">{`import { useEffect, useState } from 'react'
import { createCategoryApi } from '@msflib/react-categories'

const levelsApi = createCategoryApi('levels', true) // workspace-scoped

export function LevelPicker({ onPick }: { onPick: (id: number) => void }) {
  const [levels, setLevels] = useState<Awaited<ReturnType<typeof levelsApi.list>>>([])
  const [page, setPage] = useState({ offset: 0, limit: 10 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    levelsApi
      .list({ offset: page.offset, limit: page.limit })
      .then(setLevels)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <ul>
        {levels.map((level) => (
          <li key={level.id}>
            <button onClick={() => onPick(level.id)}>
              {level.title} — {level.tags.join(', ')}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => setPage((p) => ({ ...p, offset: p.offset + p.limit }))}>
        Next page
      </button>
      {loading && <span>Loading…</span>}
    </div>
  )
}`}</CodeBlock>

      <Note>
        The generic route means <C>categoriesQueryKeys.list(type, workspace, query)</C> is
        the whole cache contract: two hooks for the same type share one cache entry unless
        their <C>query</C> differs. <C>CategoryProvider</C> also exposes{' '}
        <C>invalidateCategoryType(type)</C> through its scope for custom mutation flows.
      </Note>
    </>
  )
}
