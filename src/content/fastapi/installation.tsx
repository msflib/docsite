import { B, C, CodeBlock, H2, Note, Table, H3 } from '../../components/md'

export default function FastapiInstallation() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        All packages install from this monorepo via <B>git subdirectory references</B>. The
        core is mandatory; each module adds only what you need.
      </p>

      <H2>Examples</H2>

      <H3>Poetry</H3>
      <CodeBlock lang="toml">{`# pyproject.toml of your app
[tool.poetry.dependencies]
python = ">=3.10,<4.0"
# use ">=3.10,<3.14" instead if you install ai_core

msflib = { git = "https://github.com/<org>/msflib-fastapi.git", subdirectory = "core", rev = "dev" }
msflib-auth = { git = "https://github.com/<org>/msflib-fastapi.git", subdirectory = "modules/auth", rev = "dev" }
msflib-account = { git = "https://github.com/<org>/msflib-fastapi.git", subdirectory = "modules/account", rev = "dev" }`}</CodeBlock>

      <H3>pip</H3>
      <CodeBlock lang="bash">{`pip install "msflib @ git+https://github.com/<org>/msflib-fastapi.git@dev#subdirectory=core"
pip install "msflib-auth @ git+https://github.com/<org>/msflib-fastapi.git@dev#subdirectory=modules/auth"`}</CodeBlock>

      <H3>Optional extras</H3>
      <p>Several modules expose optional dependency groups:</p>
      <CodeBlock lang="toml">{`msflib-notifications = { git = "...", subdirectory = "modules/notifications", rev = "dev", extras = ["all"] }
# extras: email, sms, all

msflib-ai-core = { git = "...", subdirectory = "modules/ai_core", rev = "dev", extras = ["openai", "pgvector"] }
# provider extras: openai, anthropic, azure, ollama, bedrock, openrouter, groq,
#                  pgvector, qdrant, pinecone, checkpoint-postgres, …`}</CodeBlock>

      <H2>Dependency chains</H2>
      <p>
        Modules declare each other explicitly — installing a module brings its
        dependencies:
      </p>
      <Table
        head={['Module', 'Depends on']}
        rows={[
          [<C>msflib-auth</C>, 'msflib, authlib, itsdangerous'],
          [<C>msflib-account</C>, 'msflib'],
          [<C>msflib-workspaces</C>, 'msflib, msflib-account'],
          [<C>msflib-workspace-config</C>, 'msflib'],
          [<C>msflib-notifications</C>, 'msflib, msflib-account (+ extras)'],
          [<C>msflib-workspace-notifications</C>, 'msflib, msflib-workspaces, msflib-notifications (+ extras)'],
          [<C>msflib-payments</C>, 'msflib, stripe'],
          [<C>msflib-drivelink</C>, 'msflib, msflib-account, python-multipart'],
          [<C>msflib-ai-core</C>, 'msflib, langchain-core, langchain, langgraph, redis (+ provider extras)'],
        ]}
      />

      <H2>Import path setup (working from the repo)</H2>
      <p>
        When developing inside the monorepo, the root <C>conftest.py</C> prepends{' '}
        <C>core/</C> and every <C>modules/*/</C> directory to <C>sys.path</C> so all
        packages are importable without installation — the same trick the testsite uses.
      </p>
    </>
  )
}
