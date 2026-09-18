import { B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function ReactCourses() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-courses</C> (v0.0.0 — scaffolded, not yet released) covers the LMS
        course domain: listing, enrollment, topics/topic items and progress (module key{' '}
        <C>courses</C>, endpoint default <C>/courses</C>).
      </p>
      <p>
        The domain nests three levels: a <C>Course</C> carries <C>{'{ code, title, objectives, tag, level, topics }'}</C>,
        each <C>CourseTopic</C> an ordered list of <C>CourseTopicItem</C>s (typed{' '}
        <C>'lesson' | 'assignment' | 'project' | 'quiz' | 'others'</C>, internal or
        external media), and learners move through items via progress records
        (<C>'not_started' | 'in_progress' | 'completed'</C>). The context exposes all of
        it: catalog queries (<C>courses</C> and <C>myCourses</C> from <C>/courses/me</C>),
        a search mutation (<C>GET /courses/search</C> with code/objective/title/tag
        filters), enrollment (<C>register</C> with a <C>registration_key</C>, or{' '}
        <C>ssoRegister</C> with a token), and full topics/items CRUD.
      </p>
      <p>
        Mutations mirror the backend's content types: create/update course and the
        topic-item create/update are <B>multipart</B> (<C>FormData</C> — they accept media
        uploads), while topic create/update/delete and progress updates are JSON.
        Success paths write into the detail cache and invalidate the list/my collections,
        so catalogs and "my courses" refresh together.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A course catalog</B> — <C>courses</C> + <C>myCourses</C> with workspace-scoped
          caching and a search mutation.
        </li>
        <li>
          <B>Enrollment flows</B> — key-based <C>register</C> or SSO <C>ssoRegister</C>.
        </li>
        <li>
          <B>A curriculum builder (admin)</B> — create courses with media, arrange topics
          and items with ordering.
        </li>
        <li>
          <B>A learner player</B> — read nested topics/items (progress populated on{' '}
          <C>/courses/me</C> and <C>/courses/&#123;id&#125;</C>) and post progress
          updates.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { CoursesProvider, useCourses } from '@msflib/react-courses'

<CoursesProvider>
  <Catalog />
</CoursesProvider>

function Catalog() {
  const { courses, myCourses, registerCourse } = useCourses()

  const join = (courseId, registrationKey) =>
    registerCourse(courseId, { registration_key: registrationKey }, { onSuccess: () => toast('Enrolled') })
}`}</CodeBlock>

      <H2>Hook surface</H2>
      <Table
        head={['Member', 'Endpoint default', 'Notes']}
        rows={[
          [<C>courses</C>, <C>/courses</C>, 'Catalog list query'],
          [<C>myCourses</C>, <C>/courses/me</C>, <>Current account's enrollments — items carry learner <C>progress</C></>],
          [<C>listCourses(params?) / listMyCourses(params?)</C>, <C>/courses</C>, 'On-demand fetches cached per params'],
          [<C>searchCourses(params?)</C>, <C>/courses/search</C>, <C>{'{ code?[], objective?, title?, description?, tag_id?, offset?, limit? }'}</C>],
          [<C>getCourse(id)</C>, <C>/courses/&#123;id&#125;</C>, 'Full course with topics/items (+progress on learner routes)'],
          [<C>createCourse(formData) / updateCourse(id, formData)</C>, <C>/courses</C>, 'Multipart create/update'],
          [<C>deleteCourse(id)</C>, <C>/courses/&#123;id&#125;</C>, 'Remove a course'],
          [<C>registerCourse(id, {'{ registration_key }'})</C>, <C>/courses/&#123;id&#125;/register</C>, 'Enrollment with a course key'],
          [<C>ssoRegisterCourse({'{ token }'})</C>, <C>/courses/sso-register</C>, 'Enrollment via SSO token'],
          [<C>addTopics(id, topics[])</C>, <C>/courses/&#123;id&#125;/topics</C>, 'Bulk topic create'],
          [<C>updateTopic(topicId, data) / deleteTopic(topicId)</C>, <C>/courses/topics/…</C>, 'Topic management'],
          [<C>addTopicItem(topicId, formData) / updateTopicItem(itemId, formData) / deleteTopicItem(itemId)</C>, <C>/courses/topics/…</C>, 'Item management — multipart for content'],
          [<C>updateItemProgress(courseId, topicId, itemId, {'{ status?, score?, started_at?, completed_at? }'})</C>, <C>/courses/progress/…</C>, 'Learner progress write'],
          [<C>loading.*</C>, '—', 'Per-operation flags'],
        ]}
      />
      <p>
        Standalone hook: <C>useCourse(courseId?)</C> — a <C>useQuery</C> over{' '}
        <C>getCourse</C>, disabled until an id is passed.
      </p>

      <Warning>
        Version <C>0.0.0</C> — unreleased; expect API surface changes before the first
        tagged version.
      </Warning>

      <H2>Examples</H2>

      <H3>1. A basic catalog with "my courses"</H3>
      <p>
        The provider runs both list queries on mount: the full catalog and the learner's
        enrollments. Items on <C>myCourses</C> include per-learner <C>progress</C>, so a
        simple "continue learning" row is possible without extra calls.
      </p>
      <CodeBlock lang="tsx">{`import { CoursesProvider, useCourses } from '@msflib/react-courses'

export function CatalogPage() {
  return (
    <CoursesProvider options={{ listParams: { offset: 0, limit: 20 } }}>
      <Catalog />
    </CoursesProvider>
  )
}

function Catalog() {
  const { courses, myCourses, loading } = useCourses()

  if (loading.courses) return <p>Loading catalog…</p>

  return (
    <div>
      <h1>Catalog</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <strong>{course.title}</strong> ({course.code})
            <span> · {course.topics.length} topics · level: {course.level.title}</span>
            {course.duration && <span> · {course.duration}</span>}
          </li>
        ))}
      </ul>

      <h2>My courses</h2>
      <ul>
        {myCourses.map((course) => (
          <li key={course.id}>
            {course.title}
            {course.topics[0]?.items[0]?.progress?.status === 'in_progress' && (
              <em> — in progress</em>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: search, enrollment and detail view</H3>
      <p>
        A catalog screen with a search box backed by <C>searchCourses</C> (a mutation, so
        the results don't fight the list cache), and an enrollment button using the
        course's <C>registration_key</C>. On success the provider invalidates the list
        and my-courses collections, so the course moves into "My courses".
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { CoursesProvider, useCourses, useCourse } from '@msflib/react-courses'

export function CourseFinder() {
  return (
    <CoursesProvider>
      <Finder />
    </CoursesProvider>
  )
}

function Finder() {
  const { searchCourses, registerCourse, loading } = useCourses()
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const title = String(new FormData(event.currentTarget).get('title') ?? '')
    try {
      setResults(await searchCourses({ title, limit: 10 }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    }
  }

  const enroll = async (courseId: number, key: string) => {
    try {
      await registerCourse(courseId, { registration_key: key })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enrollment failed')
    }
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={runSearch}>
        <input name="title" placeholder="Search courses…" />
        <button disabled={loading.searchCourses}>
          {loading.searchCourses ? 'Searching…' : 'Search'}
        </button>
      </form>

      <ul>
        {(results ?? []).map((course) => (
          <li key={course.id}>
            {course.title}
            <button onClick={() => enroll(course.id, course.code)} disabled={loading.registerCourse}>
              Enroll
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// detail page — standalone hook, no provider needed
export function CourseDetailPage({ courseId }: { courseId: number }) {
  const { data: course, isPending } = useCourse(courseId)
  if (isPending) return <p>Loading…</p>

  return (
    <article>
      <h1>{course?.title}</h1>
      <ul>
        {(course?.objectives ?? []).map((objective, i) => <li key={i}>{objective}</li>)}
      </ul>
      {(course?.topics ?? []).map((topic) => (
        <section key={topic.id}>
          <h2>{topic.label}. {topic.title}</h2>
          <ol>
            {topic.items.map((item) => (
              <li key={item.id}>
                {item.title} ({item.type}, {item.duration} min)
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  )
}`}</CodeBlock>

      <H3>3. Advanced: curriculum builder with multipart media and topics</H3>
      <p>
        The admin side: create the course shell with a cover image (<C>FormData</C>), add
        topics in bulk, then attach items — item creation is also multipart when the
        content is an uploaded video/document. Ordering comes from the{' '}
        <C>order</C> fields and the backend keeps <C>composite_order</C>.
      </p>
      <CodeBlock lang="tsx">{`import { CoursesProvider, useCourses } from '@msflib/react-courses'

function CurriculumBuilder() {
  const { createCourse, addTopics, addTopicItem, updateItemProgress, loading } = useCourses()
  const [courseId, setCourseId] = useState<number | null>(null)

  const createShell = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fd = new FormData()
    fd.append('title', String(form.get('title') ?? ''))
    fd.append('description', String(form.get('description') ?? ''))
    const cover = form.get('cover')
    if (cover instanceof File && cover.size > 0) fd.append('image', cover)

    const course = await createCourse(fd)
    setCourseId(course.id)
  }

  const addWeekOne = async () => {
    if (!courseId) return
    const [topic] = await addTopics(courseId, [
      {
        title: 'Week 1 — Getting started',
        label: 'W1',
        order: 1,
        items: [], // items are added one-by-one below (multipart)
      },
    ])

    const fd = new FormData()
    fd.append('title', 'Intro video')
    fd.append('type', 'lesson')
    fd.append('media_source', 'internal')
    fd.append('duration', '480')
    fd.append('order', '1')
    fd.append('file', videoFile) // uploaded content
    await addTopicItem(topic.id, fd)
  }

  return (
    <div>
      <form onSubmit={createShell}>
        <input name="title" required />
        <textarea name="description" />
        <input name="cover" type="file" accept="image/*" />
        <button disabled={loading.createCourse}>{loading.createCourse ? 'Saving…' : 'Create course'}</button>
      </form>

      {courseId && (
        <button onClick={addWeekOne} disabled={loading.addTopics || loading.addTopicItem}>
          Add Week 1 with a lesson
        </button>
      )}
    </div>
  )
}`}</CodeBlock>

      <H3>4. Advanced: learner player posting progress</H3>
      <p>
        The learner loop: read the nested <C>topics[].items[].progress</C> from the detail
        query (populated on learner-facing routes), render the current item, and write
        progress with <C>updateItemProgress</C> as the learner advances. The mutation's
        result is written into the item's cache, so status badges update instantly.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { useCourses, useCourse, type CourseItemProgressUpdatePayload } from '@msflib/react-courses'

export function LessonPlayer({ courseId, topicId, itemId }: {
  courseId: number
  topicId: number
  itemId: number
}) {
  const { course } = { course: useCourse(courseId).data }
  const { updateItemProgress, loading } = useCourses()
  const [score, setScore] = useState<number | null>(null)

  const item = course?.topics
    .find((t) => t.id === topicId)
    ?.items.find((i) => i.id === itemId)

  const markComplete = async () => {
    const payload: CourseItemProgressUpdatePayload = {
      status: 'completed',
      completed_at: new Date().toISOString(),
      ...(score !== null ? { score } : {}),
    }
    await updateItemProgress(courseId, topicId, itemId, payload)
  }

  if (!item) return <p>Item not found.</p>

  return (
    <section>
      <h1>{item.title}</h1>
      <p>
        {item.type} · {item.media_source === 'external' ? 'external link' : 'hosted'} ·{' '}
        {item.duration} min
      </p>
      {item.url && <a href={item.url} target="_blank" rel="noreferrer">Open material</a>}
      {item.content && <div>{item.content}</div>}

      {item.type === 'quiz' && (
        <input
          type="number"
          placeholder="Score"
          onChange={(e) => setScore(Number(e.target.value))}
        />
      )}

      <p>Current status: {item.progress?.status ?? 'not_started'}</p>
      <button onClick={markComplete} disabled={loading.updateItemProgress}>
        {loading.updateItemProgress ? 'Saving…' : 'Mark complete'}
      </button>
    </section>
  )
}`}</CodeBlock>

      <Note>
        Progress and per-learner data only populate on learner-facing endpoints —{' '}
        <C>/courses/me</C> and <C>/courses/&#123;id&#125;</C>. Admin list responses
        return the raw curriculum without a <C>progress</C> field.
      </Note>
    </>
  )
}
