import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function ReactChatBox() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>ChatBox</C> is a fully controlled chat interface — messages in, events out — used
        for support chats and the AI modules' interfaces. String message content renders as
        Markdown by default (via <C>markdown-to-jsx</C>).
      </p>
      <p>
        It solves the "chat UI is 500 lines of scroll math" problem: date separators
        ("Today"/"Yesterday") between day groups, per-bubble timestamps, stick-to-bottom
        auto-scroll that stops fighting the user once they scroll up past{' '}
        <C>scrollThreshold</C> px, Enter-to-send with Shift+Enter newlines, attachment
        cards, suggestion chips and feedback buttons are all built in — while the message
        list, the composer value and every send/upload event remain fully under your
        control.
      </p>
      <p>
        Architecturally there is no internal message state: <C>messages</C> is a prop,{' '}
        <C>value</C>/<C>onChange</C> is a controlled composer, and customization runs from
        styling overrides (<C>styles</C>), role mapping (<C>roleMap</C>) up to full render
        props (<C>renderMessage</C>, <C>renderMessageCard</C>, <C>renderHeader</C>,{' '}
        <C>renderFooterActions</C>). The <C>adapters.ts</C> helpers convert backend
        payloads — e.g. an AI answer shaped like{' '}
        <C>{'{ answer, hits, conversation_id }'}</C> — into <C>ChatMessage[]</C>.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>An AI assistant surface</B> — pair with <C>useAgent</C>/<C>useLlm</C> from{' '}
          <C>@msflib/react-ai</C> and the <C>nativeResponseToChatMessages</C> adapter.
        </li>
        <li>
          <B>A support/helpdesk thread</B> — map agent/customer roles onto bubble sides
          with <C>roleMap</C> and render attachments from <C>message.files</C>.
        </li>
        <li>
          <B>Feedback collection</B> — <C>allowFeedback</C> adds copy/like/dislike buttons
          to assistant bubbles with your own <C>onFeedback</C> sink.
        </li>
        <li>
          <B>Custom bubbles without forking</B> — <C>renderMessageCard</C> replaces the
          bubble body (text + attachments) per message; <C>renderMessage</C> replaces the
          entire row.
        </li>
      </ul>

      <CodeBlock lang="tsx">{`import { ChatBox } from '@msflib/react-components'

<ChatBox
  messages={messages}
  value={draft}
  onChange={setDraft}
  onSend={() => {
    send({ text: draft })
    setDraft('')
  }}
  onUpload={handleFiles}
  onSuggestionClick={(s) => send({ text: s })}
  roleMap={{ customer: 'user', agent: 'assistant' }}
  allowFeedback
/>`}</CodeBlock>

      <H2>Core props</H2>
      <Table
        head={['Prop', 'Type', 'Description']}
        rows={[
          [<C>messages</C>, <C>ChatMessage[]</C>, <>Each: <C>{'{ id, role, content: ReactNode, avatar?, createdAt?, suggestions?, file?, files? }'}</C></>],
          [<C>value / onChange</C>, 'controlled input', 'Composer state'],
          [<C>onSend</C>, <C>() =&gt; void</C>, <>Enter pressed / send clicked (Shift+Enter inserts a newline)</>],
          [<C>roleMap</C>, <C>Record&lt;string, 'user' | 'assistant' | 'system'&gt;</C>, 'Maps app roles (customer, agent…) onto bubble sides'],
          [<C>onUpload</C>, <C>(files) =&gt; void</C>, 'Attachment handler'],
          [<C>onSuggestionClick</C>, <C>(suggestion) =&gt; void</C>, 'Suggestion chip handler'],
          [<C>onFeedback</C>, <C>(feedback, message) =&gt; void</C>, 'Feedback actions handler'],
          [<C>allowFeedback + feedbackActions</C>, <C>boolean, array</C>, 'Defaults: copy, like, dislike'],
          [<C>displayAvatar</C>, <C>boolean</C>, 'Show avatars on bubbles'],
          [<C>icons</C>, <C>{'{ sendIcon?, attachmentIcon? }'}</C>, 'Custom composer icons'],
          [<C>disableMarkdown</C>, <C>boolean</C>, 'Render string content as plain text instead of Markdown'],
          [<C>autoScroll / scrollThreshold</C>, <C>boolean / number</C>, 'Stick-to-bottom behavior'],
          [<C>styles</C>, 'per-part CSSProperties', 'Header, bubbles, composer styling'],
          [<C>textFieldProps / textFieldSx</C>, '—', 'Composer TextField tuning'],
          [<C>renderMessage / renderMessageCard / renderHeader / renderFooterActions</C>, 'render props', 'Full custom rendering escape hatches'],
        ]}
      />

      <H2>Extras</H2>
      <ul>
        <li>
          Date separators ("Today" / "Yesterday") and per-bubble timestamps.
        </li>
        <li>
          <B>Adapters</B> (<C>adapters.ts</C>): <C>nativeResponseToChatMessages</C>,{' '}
          <C>chatResponseAdapters</C> registry and{' '}
          <C>transcriptToChatMessages(items, adapter)</C> — convert backend transcripts
          (e.g. drivelink or AI history) into <C>ChatMessage[]</C>.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. A basic controlled chat</H3>
      <p>
        The smallest working setup: hold the message list and the composer draft in state,
        append the user message on send, and let <C>ChatBox</C> handle Enter-to-send,
        timestamps and scroll behavior. String content is rendered as Markdown.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import { ChatBox, type ChatMessage } from '@msflib/react-components'

export function SimpleChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! **Ask me anything** — markdown, lists and \`code\` all render.',
      createdAt: new Date(),
    },
  ])
  const [draft, setDraft] = useState('')

  const send = () => {
    if (!draft.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: draft, createdAt: new Date() },
    ])
    setDraft('')
  }

  return (
    <div style={{ height: 640 }}>
      <ChatBox
        messages={messages}
        value={draft}
        onChange={setDraft}
        onSend={send}
        placeholder="Type a message or upload files"
      />
    </div>
  )
}`}</CodeBlock>

      <H3>2. Realistic usage: the AI agent module behind a ChatBox</H3>
      <p>
        Wire <C>onSend</C> to <C>useAgent().ask</C> from <C>@msflib/react-ai</C>, convert
        the native response with <C>nativeResponseToChatMessages</C>, keep the{' '}
        <C>conversation_id</C>/<C>sub_thread_id</C> so follow-ups share context, and reflect
        the <C>loading.ask</C> flag into <C>disabled</C> so the composer locks while the
        model answers.
      </p>
      <CodeBlock lang="tsx">{`import { useRef, useState } from 'react'
import { ChatBox, nativeResponseToChatMessages, type ChatMessage } from '@msflib/react-components'
import { useAgent, type AgentAskResponse } from '@msflib/react-ai'

export function AgentChat() {
  const agent = useAgent()
  const conversationId = useRef<string | null | undefined>(undefined)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')

  const send = async () => {
    const question = draft.trim()
    if (!question || agent.loading.ask) return

    setDraft('')
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: question, createdAt: new Date() },
    ])

    try {
      const res = await agent.ask<AgentAskResponse>(
        { question, conversation_id: conversationId.current ?? null },
        { protocol: 'native' }, // forwarded as ?protocol=native
      )
      conversationId.current = res.conversation_id

      setMessages((prev) => [
        ...prev,
        ...nativeResponseToChatMessages(res, { createdAt: new Date() }),
        // suggestion chips straight from the payload's hits, if any
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'system', content: 'The assistant is unavailable right now.' },
      ])
    }
  }

  return (
    <ChatBox
      messages={messages}
      value={draft}
      onChange={setDraft}
      onSend={send}
      disabled={agent.loading.ask}
      displayAvatar
      allowFeedback
      onFeedback={(message, action) => console.log('feedback', action.name, message.id)}
      roleMap={{ bot: 'assistant' }}
    />
  )
}`}</CodeBlock>

      <H3>3. Support thread with role mapping, suggestions and attachments</H3>
      <p>
        Map backend roles (<C>customer</C>, <C>agent</C>, <C>system</C>) through{' '}
        <C>roleMap</C>, attach files to messages, render clickable suggestion chips, and
        rehydrate an old thread with <C>transcriptToChatMessages</C> — the adapter API is
        the intended seam between any backend transcript and <C>ChatMessage[]</C>.
      </p>
      <CodeBlock lang="tsx">{`import { useState } from 'react'
import {
  ChatBox,
  transcriptToChatMessages,
  type ChatMessage,
  type ChatAttachment,
} from '@msflib/react-components'

type TicketItem = {
  sender: 'customer' | 'agent' | 'system'
  body: string
  sent_at: string
  files?: { name: string; url: string; mime_type: string }[]
}

const fromTicket = (item: TicketItem): ChatMessage[] => [
  {
    id: crypto.randomUUID(),
    role: item.sender,
    content: item.body,
    createdAt: item.sent_at,
    files: item.files?.map<ChatAttachment>((f) => ({
      name: f.name,
      url: f.url,
      mimeType: f.mime_type,
      sourceLabel: 'attachment',
    })),
  },
]

export function SupportThread({ transcript }: { transcript: TicketItem[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    transcriptToChatMessages(transcript, fromTicket),
  )
  const [draft, setDraft] = useState('')

  return (
    <ChatBox
      messages={messages}
      value={draft}
      onChange={setDraft}
      roleMap={{ customer: 'user', agent: 'assistant', system: 'system' }}
      displayAvatar
      disableMarkdown // support bodies are plain text
      onUpload={() => filePicker.open()}
      onSend={() => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'customer', content: draft }])
        setDraft('')
      }}
      onSuggestionClick={(s) => setDraft(s.value ?? s.label)}
      messages={[...messages][0] ? messages : [
        ...messages,
        {
          id: 'kb',
          role: 'assistant',
          content: 'Common questions:',
          suggestions: [
            { id: 's1', label: 'How do I reset my password?', value: 'reset password' },
            { id: 's2', label: 'Where are my certificates?', value: 'certificates' },
          ],
        },
      ]}
    />
  )
}`}</CodeBlock>

      <H3>4. Custom bubbles and footer with render props</H3>
      <p>
        When the default bubble isn't enough, <C>renderMessageCard</C> replaces the bubble
        body per message while keeping layout, avatars and timestamps, and{' '}
        <C>renderFooterActions</C> replaces the entire composer (use{' '}
        <C>renderHeader</C> for a toolbar above the thread). Inline styles win because the
        component is style-object driven.
      </p>
      <CodeBlock lang="tsx">{`import { ChatBox, type ChatMessage } from '@msflib/react-components'

export function CustomizedChat({ messages }: { messages: ChatMessage[] }) {
  const [draft, setDraft] = useState('')

  return (
    <ChatBox
      messages={messages}
      value={draft}
      onChange={setDraft}
      onSend={() => setDraft('')}
      renderHeader={() => (
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #eee', fontWeight: 700 }}>
          Msf Assistant · {messages.length} messages
        </div>
      )}
      renderMessageCard={(message) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {typeof message.content === 'string' ? message.content : message.content}
          {message.files?.map((f) => (
            <a key={f.name} href={f.url} target="_blank" rel="noreferrer">
              {f.name}
            </a>
          ))}
        </div>
      )}
      renderFooterActions={() => (
        <div style={{ display: 'flex', gap: 8, padding: 16 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button onClick={() => setDraft('')}>Send</button>
        </div>
      )}
      styles={{
        root: { minHeight: 480 },
        assistantBubble: { background: '#f0f4ff' },
        suggestionButton: { background: '#eef', borderRadius: 10 },
      }}
    />
  )
}`}</CodeBlock>

      <Note>
        Auto-scroll is conservative: it only sticks to the bottom when the user is within{' '}
        <C>scrollThreshold</C> px (default 120) of it, so reading history isn't yanked
        around when new messages arrive. Set <C>{'{ autoScroll: false }'}</C> to disable
        entirely.
      </Note>
    </>
  )
}
