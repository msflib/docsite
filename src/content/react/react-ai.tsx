import { B, C, CodeBlock, H2, H3, Note, Table, Warning, A } from '../../components/md'

export default function ReactAi() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>@msflib/react-ai</C> (v0.0.0 — unreleased) is the client for the FastAPI AI
        core: an LLM side and an agent side, each with status, protocols, search and ask
        endpoints (module keys <C>llm</C> and <C>agent</C>).
      </p>
      <p>
        The package exposes one provider with two sub-contexts. <C>useLlm()</C> is the
        retrieval/completion surface: <C>GET /llm/status</C> (provider, model, vector
        store backend), <C>GET /llm/protocols</C>, <C>POST /llm/search</C> (returns{' '}
        <C>{'{ hits, count }'}</C> of <C>AiDocument</C>s) and <C>POST /llm/ask</C>.
        <C> useAgent()</C> is the RAG assistant surface: <C>GET /agent/status</C>,{' '}
        <C>POST /agent/ask</C> and <C>POST /agent/ask/stream</C> — the streaming route
        bypasses the JSON client via <C>fetchAskStream</C> and returns the raw{' '}
        <C>Response</C> so you can consume SSE/chunks yourself.
      </p>
      <p>
        Ask payloads share one shape: <C>{'{ question, conversation_id?, sub_thread_id?, k?, document_type?, source_id? }'}</C>{' '}
        (search uses <C>query</C> instead of <C>question</C>). Request options travel
        sideways: <C>{'{ protocol }'}</C> becomes a query param (native, openai, langchain,
        mcp, …) and <C>{'{ channel }'}</C> becomes an <C>x-ai-channel</C> header — the
        provider merges any provider-level <C>options.protocol</C>/<C>options.channel</C>{' '}
        under per-call overrides. All requests are workspace-scoped, so conversations are
        tenant-isolated by the same path/header tenancy as every other module.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A RAG assistant</B> — <C>agentAsk</C> over indexed workspace documents, with{' '}
          <C>conversation_id</C> continuity across turns.
        </li>
        <li>
          <B>Streaming answers</B> — <C>agentAskStream</C> returns the raw{' '}
          <C>Response</C>; render incrementally into a{' '}
          <A to="/react/component-chatbox">ChatBox</A>.
        </li>
        <li>
          <B>Semantic search</B> — <C>llmSearch</C> returns matched{' '}
          <C>AiDocument</C> hits for citations or "sources" lists.
        </li>
        <li>
          <B>Capability probing</B> — status + protocols queries to feature-detect models
          and protocols before rendering UI.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { AiProvider, useLlm, useAgent } from '@msflib/react-ai'

<AiProvider>
  <Assistant />
</AiProvider>

function Assistant() {
  const llm = useLlm()
  const agent = useAgent()

  // non-streaming
  const answer = await agent.ask({ question: '…' }, { protocol: 'native' })

  // streaming — from the hook: returns the raw Response
  const res = await agent.askStream({ question: '…' })
  // consume res.body as an SSE/byte stream in your ChatBox
}`}</CodeBlock>

      <H2>useLlm</H2>
      <Table
        head={['Member', 'Endpoint default', 'Notes']}
        rows={[
          [<C>status</C>, <C>/llm/status</C>, <C>{'{ module, llm_provider, llm_model, vector_store_backend }'}</C>],
          [<C>protocols</C>, <C>/llm/protocols</C>, <><C>Record&lt;string, string[]&gt;</C> of available protocols</>],
          [<C>search(payload, requestOptions?)</C>, <C>/llm/search</C>, <><C>{'{ query, k?, conversation_id?, document_type?, source_id? }'}</C> → <C>{'{ hits: AiDocument[], count }'}</C></>],
          [<C>ask&lt;T&gt;(payload, requestOptions?)</C>, <C>/llm/ask</C>, <><C>{'{ question, k?, … }'}</C> → typed response (default <C>LlmAskResponse</C> = <C>{'{ answer, hits }'}</C>)</>],
          [<C>refetch()</C>, '—', 'Re-runs status + protocols'],
          [<C>loading.*</C>, '—', <C>status, protocols, search, ask</C>],
        ]}
      />

      <H2>useAgent</H2>
      <Table
        head={['Member', 'Endpoint default', 'Notes']}
        rows={[
          [<C>status</C>, <C>/agent/status</C>, <C>{'{ module, mode, agent_source, llm_provider, llm_model, workspace_id }'}</C>],
          [<C>ask&lt;T&gt;(payload, requestOptions?)</C>, <C>/agent/ask</C>, 'One-shot RAG answer with conversation continuity'],
          [<C>askStream(payload, requestOptions?)</C>, <C>/agent/ask/stream</C>, <>Streaming ask via <C>fetchAskStream</C> (<C>src/utils/fetchAskStream.ts</C>) — returns the raw <C>Response</C></>],
          [<C>refetch()</C>, '—', 'Re-runs the status query'],
          [<C>loading.*</C>, '—', <C>status, ask, askStream</C>],
        ]}
      />

      <p>
        The <C>ChatBox</C> component (from <C>@msflib/react-components</C>) is the natural
        rendering pair, with <C>chatResponseAdapters</C>-style utilities converting backend
        responses into chat messages.
      </p>

      <H2>Examples</H2>

      <H3>1. A basic one-shot Q&amp;A with capability detection</H3>
      <p>
        The smallest assistant: read <C>status</C> to show which model is serving, and
        call <C>agentAsk</C> with a question. The response carries{' '}
        <C>{'{ answer, hits, conversation_id? }'}</C> — keep <C>conversation_id</C> for
        follow-ups.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { AiProvider, useAgent, type AgentAskResponse } from '@msflib/react-ai'

export function AssistantPage() {
  return (
    <AiProvider>
      <Assistant />
    </AiProvider>
  )
}

function Assistant() {
  const { status, ask, loading } = useAgent()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null | undefined>(undefined)

  const send = async () => {
    const res = await ask<AgentAskResponse>(
      { question, conversation_id: conversationId ?? null, k: 5 },
      { protocol: 'native' },
    )
    setAnswer(res.answer)
    setConversationId(res.conversation_id) // reuse on the next turn
  }

  return (
    <div>
      <p>Model: {status?.llm_provider} / {status?.llm_model}</p>
      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={send} disabled={loading.ask || !question.trim()}>
        {loading.ask ? 'Thinking…' : 'Ask'}
      </button>
      {answer && <blockquote>{answer}</blockquote>}
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: streaming answers into a ChatBox</H3>
      <p>
        Streaming uses <C>askStream</C>, which resolves to the raw <C>Response</C> once
        headers arrive. Read the body as a stream, append decoded chunks to the in-flight
        assistant message, and finalize it with the parsed native payload (or leave the
        accumulated text). <C>loading.askStream</C> covers the whole read.
      </p>
      <CodeBlock lang="tsx">{`import { useRef, useState } from 'react'
import { AiProvider, useAgent } from '@msflib/react-ai'
import { ChatBox, type ChatMessage } from '@msflib/react-components'

function StreamAssistant() {
  const { askStream, loading } = useAgent()
  const conversationId = useRef<string | null | undefined>(undefined)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')

  const send = async () => {
    const question = draft.trim()
    if (!question || loading.askStream) return
    setDraft('')

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: question }
    const replyId = crypto.randomUUID()
    setMessages((prev) => [...prev, userMsg, { id: replyId, role: 'assistant', content: '' }])

    try {
      const response = await askStream({ question, conversation_id: conversationId.current ?? null })
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      // stream chunks into the placeholder bubble
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === replyId ? { ...m, content: String(m.content) + chunk } : m,
          ),
        )
      }

      // optionally reconcile with the final JSON answer if your backend appends one
      conversationId.current = conversationId.current ?? null
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyId
            ? { ...m, role: 'system', content: 'The assistant is unavailable right now.' }
            : m,
        ),
      )
    }
  }

  return (
    <ChatBox
      messages={messages}
      value={draft}
      onChange={setDraft}
      onSend={send}
      disabled={loading.askStream}
      allowFeedback
    />
  )
}`}</CodeBlock>

      <H3>3. Advanced: semantic search with citations + the ChatBox adapter</H3>
      <p>
        The LLM side shines for "sources" UX: <C>search</C> returns{' '}
        <C>{'{ hits: AiDocument[], count }'}</C> where each hit has{' '}
        <C>{'{ page_content, metadata }'}</C>. Render the hits as citations, and use{' '}
        <C>nativeResponseToChatMessages</C> from{' '}
        <C>@msflib/react-components</C> to convert a non-streaming ask into{' '}
        <C>ChatMessage[]</C> when you prefer request/response over streaming.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { AiProvider, useLlm } from '@msflib/react-ai'
import {
  ChatBox,
  nativeResponseToChatMessages,
  type ChatMessage,
} from '@msflib/react-components'

function CitedChat() {
  const llm = useLlm()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [hits, setHits] = useState<{ id?: string | null; page_content: string; metadata: Record<string, unknown> }[]>([])

  const send = async () => {
    const question = draft.trim()
    if (!question || llm.loading.ask) return
    setDraft('')

    try {
      // 1) retrieve — build a citations panel
      const search = await llm.search({ query: question, k: 4 })
      setHits(search.hits)

      // 2) ask — one-shot completion, adapter converts to a chat bubble
      const answer = await llm.ask<{ answer: string; hits: typeof search.hits }>(
        { question, k: 4 },
        { channel: 'support' }, // x-ai-channel header
      )
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: question },
        ...nativeResponseToChatMessages(answer, { createdAt: new Date() }),
      ])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
      <ChatBox
        messages={messages}
        value={draft}
        onChange={setDraft}
        onSend={send}
        disabled={llm.loading.ask}
      />
      <aside>
        <h3>Sources ({hits.length})</h3>
        <ol>
          {hits.map((hit, i) => (
            <li key={hit.id ?? i}>
              {String(hit.metadata?.source ?? 'document')}: {hit.page_content.slice(0, 120)}…
            </li>
          ))}
        </ol>
      </aside>
    </div>
  )
}`}</CodeBlock>

      <H3>4. Advanced: protocols, channels and tenant-isolated conversations</H3>
      <p>
        Request options are the escape hatch for multi-protocol backends.{' '}
        <C>protocols</C> (from <C>/llm/protocols</C>) lists what the server supports; pass{' '}
        <C>{'{ protocol }'}</C> per call (it becomes <C>?protocol=…</C>) or set a
        provider-level default via <C>{'<AiProvider options={{ protocol, channel }} />'}</C>.
        Because the provider is workspace-scoped, per-tenant <C>conversation_id</C>s never
        collide — switching tenants re-keys the status queries too.
      </p>
      <CodeBlock lang="tsx">{`import { AiProvider, useLlm, useAgent } from '@msflib/react-ai'
import { useActiveWorkspace } from '@msflib/react-shared'

export function AiWorkspace() {
  const workspace = useActiveWorkspace()
  return (
    <AiProvider options={{ protocol: 'langchain', channel: 'docs' }}>
      <Panel tenant={workspace ?? '—'} />
    </AiProvider>
  )
}

function Panel({ tenant }: { tenant: string }) {
  const llm = useLlm()
  const agent = useAgent()
  const [protocol, setProtocol] = useState('native')

  const available = llm.protocols?.[protocol] ?? []
  const oneShot = () =>
    agent.ask(
      { question: 'Summarize the workspace docs', k: 3 },
      { protocol, channel: 'support' }, // per-call override beats the provider default
    )

  return (
    <div>
      <p>Tenant: {tenant} · agent mode: {agent.status?.mode ?? '…'}</p>
      <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
        {Object.keys(llm.protocols ?? {}).map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <em>supports: {available.join(', ')}</em>
      <button onClick={oneShot} disabled={agent.loading.ask}>Run agent</button>
    </div>
  )
}`}</CodeBlock>

      <Note>
        <C>fetchAskStream</C> is also exported from the package root for use outside the
        provider — it resolves the workspace prefix itself, sends the bearer token, the{' '}
        <C>x-ai-channel</C> header when a channel is given, and <C>?protocol=</C> when
        requested, then hands you the untouched <C>Response</C>.
      </Note>

      <Warning>
        Version <C>0.0.0</C> — unreleased; endpoints and payload shapes may still change.
      </Warning>
    </>
  )
}
