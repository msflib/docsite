import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiAiCore() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-ai-core</C> (v0.2.0) is provider-agnostic AI infrastructure:
        LLM/embedding/vector store factories, LangGraph checkpoint &amp; memory-store policy,
        an ingestion pipeline, a prompt registry, rate limiting and the config bridge.
        Depends on: msflib, langchain-core, langchain, langgraph, redis — plus many
        optional provider extras (<C>openai</C>, <C>anthropic</C>, <C>azure</C>,{' '}
        <C>ollama</C>, <C>bedrock</C>, <C>openrouter</C>, <C>groq</C>, <C>pgvector</C>,{' '}
        <C>qdrant</C>, <C>pinecone</C>, <C>checkpoint-postgres</C>, …).
      </p>
      <p>
        The module sits one layer below your features: it does not ship an HTTP API.
        Instead it resolves <C>AICoreSettings</C> (the <C>AI_CORE</C> namespace, itself a
        policy consumer — <C>MIDDLEWARE_POLICY</C> and <C>CHUNKING_POLICY</C> are{' '}
        <C>PolicyEnvelope</C> fields), builds the LangChain/LangGraph objects those
        settings describe, and hands them to your endpoints through dependency factories
        and <C>DependencyNamespace</C> helpers. Everything multi-tenant in the stack —
        checkpoint threads, memory namespaces, vector search filters — goes through{' '}
        <C>CheckpointScope</C>/<C>MemoryStoreScope</C> and{' '}
        <C>similarity_search_scoped()</C>, so a request can never cross tenant/workspace
        boundaries.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Provider switching by configuration</B> — point{' '}
          <C>LLM_PROVIDER</C>/<C>EMBEDDING_PROVIDER</C>/<C>VECTOR_STORE_BACKEND</C> at a
          different vendor per environment without code changes.
        </li>
        <li>
          <B>Policy-governed agent middleware</B> — tool gating, summarization,
          human-in-the-loop, prompt-name mapping and context-source ordering declared as
          a validated policy envelope.
        </li>
        <li>
          <B>Multi-tenant LangGraph</B> — checkpointers and long-term-memory stores whose
          thread ids/namespaces are constructed and validated from tenant/workspace
          scopes.
        </li>
        <li>
          <B>RAG plumbing</B> — a chunking-registry-backed ingestion pipeline, prompt
          versioning and a Redis-backed RPM limiter.
        </li>
      </ul>

      <H2>Settings (namespace AI_CORE)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[
          [<C>LLM_PROVIDER</C>, <>openai, anthropic, azure, ollama, bedrock, openrouter, groq</>],
          [<C>LLM_MODEL / LLM_API_KEY / LLM_TEMPERATURE / LLM_MAX_TOKENS</C>, 'Model invocation'],
          [<C>EMBEDDING_PROVIDER / EMBEDDING_MODEL</C>, 'Embeddings'],
          [<C>VECTOR_STORE_BACKEND</C>, <>e.g. <C>pgvector</C></>],
          [<C>RATE_LIMIT_RPM / TOKEN_BUDGET_PER_WORKSPACE</C>, 'Guardrails'],
          [<C>MIDDLEWARE_POLICY</C>, <>Typed <C>MiddlewarePolicySchema(PolicyEnvelope)</C></>],
          [<C>CHUNKING_POLICY</C>, <>Typed <C>ChunkingPolicySchema(PolicyEnvelope)</C> — provider_preference, fallback_chain</>],
        ]}
      />
      <p>
        <C>AICoreSettings</C> declares a <C>request_override_allowlist</C> with 9 safe keys
        for request-tier overrides.
      </p>

      <H2>Key services</H2>
      <Table
        head={['Service', 'Purpose']}
        rows={[
          [<C>LangChainConfigBridge</C>, 'Translates AICoreSettings → RuntimePolicy and LangChain middleware config'],
          [<C>PromptRegistryService</C>, 'Register / activate / resolve prompt versions'],
          [<C>IngestionPipeline</C>, 'Chunking → embedding → indexing'],
          [<C>CheckpointScope / MemoryStoreScope</C>, <>Immutable tenant/workspace scope objects with <C>scoped_config()</C>, <C>validate()</C>, <C>lifecycle_hooks()</C></>],
          [<C>create_langgraph_checkpointer() / create_langgraph_store()</C>, 'Managed context managers for LangGraph'],
          [<C>TokenUsageCallback</C>, 'LangChain callback capturing token usage'],
          [<C>RateLimiter</C>, 'Redis-backed RPM limiter'],
          [<C>similarity_search_scoped()</C>, 'Vector search with mandatory tenant/workspace filters'],
        ]}
      />

      <H2>Dependency factories</H2>
      <CodeBlock lang="python">{`from msflib.ai_core.deps import get_llm_dep, get_embeddings_dep, get_vector_store_dep
from app.core.config import settings

llm_dep = get_llm_dep(settings)          # each factory takes the app settings once
vector_dep = get_vector_store_dep(settings, collection_name="docs")

@router.post("/llm/ask")
async def ask(payload: AskPayload, llm = Depends(llm_dep)):
    ...`}</CodeBlock>
      <p>
        The chunking README under{' '}
        <C>modules/ai_core/msflib/ai_core/services/chunking/</C> is the reference for
        policy-governed domain services.
      </p>

      <H2>Examples</H2>

      <H3>1. Compose AICoreSettings into the app settings</H3>
      <p>
        Add the namespace to your settings class. The LLM/embedding keys come from env in
        real deployments; the policy fields validate through the shared envelope:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py
from msflib.core.config import SettingsBase, CoreSettings
from msflib.ai_core.config import AICoreSettings


class AppSettings(AICoreSettings, CoreSettings, SettingsBase):
    LLM_PROVIDER: str = "openai"
    LLM_MODEL: str = "gpt-4o"
    LLM_TEMPERATURE: float = 0.2
    EMBEDDING_PROVIDER: str = "openai"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    VECTOR_STORE_BACKEND: str = "pgvector"
    RATE_LIMIT_RPM: int = 60


settings = AppSettings(
    LLM_API_KEY="sk-...",           # or AI_CORE__LLM_API_KEY in the environment
    MIDDLEWARE_POLICY={
        "middleware": [
            {"id": "summarization", "enabled": True,
             "config": {"message_threshold": 20, "token_threshold": 4000}},
            {"id": "tool_gating", "enabled": True,
             "config": {"allowed_names": ["search", "retrieve"], "blocked_names": ["unsafe"]}},
        ]
    },
)`}</CodeBlock>
      <Note>
        Request-tier overrides are allowlisted to nine keys (<C>LLM_PROVIDER</C>,{' '}
        <C>LLM_MODEL</C>, <C>LLM_BASE_URL</C>, <C>LLM_TEMPERATURE</C>,{' '}
        <C>LLM_MAX_TOKENS</C>, <C>MIDDLEWARE_POLICY</C>, <C>CHUNKING_POLICY</C>,{' '}
        <C>RATE_LIMIT_RPM</C>, <C>TOKEN_BUDGET_PER_WORKSPACE</C>) — <C>LLM_API_KEY</C> can
        never be overridden per request.
      </Note>

      <H3>2. Wire LLM/embeddings/vector-store dependencies into your endpoints</H3>
      <p>
        The dependency factories are built once with settings and return FastAPI
        dependency callables. The React <C>react-ai</C> package expects <C>/llm</C> and{' '}
        <C>/agent</C> routes you implement — here is a minimal one:
      </p>
      <CodeBlock lang="python">{`from fastapi import Depends
from pydantic import BaseModel
from msflib.ai_core.deps import get_llm_dep, get_embeddings_dep, get_vector_store_dep

llm_dep = get_llm_dep(settings)                      # call the factory once at startup
embeddings_dep = get_embeddings_dep(settings)
vector_store_dep = get_vector_store_dep(settings, collection_name="docs")


class AskPayload(BaseModel):
    question: str


@router.post("/llm/ask", tags=["ai"])
async def ask(payload: AskPayload, llm=Depends(llm_dep)):
    response = await llm.ainvoke(payload.question)
    return {"answer": response.content}


@router.get("/llm/search", tags=["ai"])
async def search(q: str, store=Depends(vector_store_dep)):
    return {"results": [doc.page_content for doc in store.similarity_search(q, k=4)]}`}</CodeBlock>
      <Note>
        Prefer one object? <C>get_ai_dependencies(settings)</C> returns a{' '}
        <C>DependencyNamespace</C> with <C>get_llm</C>, <C>get_embeddings</C>,{' '}
        <C>get_vector_store(collection_name)</C> and{' '}
        <C>get_middleware_config(tools)</C> for ad-hoc use outside FastAPI.
      </Note>

      <H3>3. Map the middleware policy into runtime config</H3>
      <p>
        <C>LangChainConfigBridge</C> turns the (tier-resolved) settings into the{' '}
        middleware configuration your agent loop consumes — for example, prompt bindings
        resolved from the prompt registry at request time:
      </p>
      <CodeBlock lang="python">{`from langchain_core.prompts import ChatPromptTemplate
from msflib.ai_core.services.config_bridge import LangChainConfigBridge

bridge = LangChainConfigBridge(settings)   # settings.scope("AI_CORE").unwrap() inside

config = bridge.to_langchain_middleware_config(
    session=session,
    workspace_id=workspace.id,
    account_id=account.id,
    tools=tools,
)

# prompt_name_mapping bindings resolve against PromptRegistryService
# (precedence: user -> workspace -> global)
resolved = config["prompt_name_mapping"].get("resolved", {})

template = ChatPromptTemplate.from_messages([
    ("system", "{system}"),
    ("system", "{retrieval}"),
    ("human", "{question}"),
]).partial(**resolved)   # registry content bound; {question} stays open

# chain = template | llm`}</CodeBlock>
      <p>
        Changing the active prompt version in the registry (<C>registry.set_active(...)</C>)
        flows through on the next request — no redeploy.
      </p>

      <H3>4. Scoped LangGraph checkpointing and memory</H3>
      <p>
        Checkpointer and store factories are context managers: pass a scope and the
        thread ids / namespaces are rewritten and validated so workspace A can never read
        workspace B's state. Lifecycle hooks (<C>scope.lifecycle_hooks()</C>) fire on
        enter/exit:
      </p>
      <CodeBlock lang="python">{`from msflib.ai_core import CheckpointScope
from msflib.ai_core.services.checkpoint_policy import create_langgraph_checkpointer
from msflib.ai_core.services.memory_store_policy import (
    MemoryStoreScope, create_langgraph_store, put_scoped_memory, get_scoped_memory,
)

checkpoint_scope = CheckpointScope.create(tenant_id=42, workspace_id=9, namespace="agent")

with create_langgraph_checkpointer(backend="memory", scope=checkpoint_scope) as checkpointer:
    graph = builder.compile(checkpointer=checkpointer)
    graph.invoke(
        {"messages": [...]},
        checkpoint_scope.scoped_config(
            {"configurable": {}}, thread_id="conversation-123", namespace="default"
        ),
    )

memory_scope = MemoryStoreScope.create(tenant_id=42, workspace_id=9)
with create_langgraph_store(backend="memory", scope=memory_scope) as store:
    ns = put_scoped_memory(store, memory_scope, key="profile",
                           value={"role": "planner"}, memory_type="semantic")
    item = get_scoped_memory(store, memory_scope, key="profile", memory_type="semantic")`}</CodeBlock>
      <Note>
        For Postgres backends (<C>backend="postgres"</C>, via the{' '}
        <C>checkpoint-postgres</C> extra) run setup once at startup with{' '}
        <C>run_setup=True</C>; request-path usage should keep the default <C>False</C> to
        avoid running DDL per context entry.
      </Note>
    </>
  )
}
