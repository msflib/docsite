import { A, B, C, CodeBlock, H2, Note, Table, H3 } from '../../components/md'

export default function FastapiOverview() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <B>MSFLib FastAPI</B> is a Poetry monorepo containing a shared core library
        (<C>msflib</C>, v0.2.0, under <C>core/</C>) and independently installable feature
        modules (under <C>modules/</C>). Each module ships its own <C>pyproject.toml</C> and
        pulls the core in via a git reference — so consuming apps install{' '}
        <B>only the functionality they need</B>.
      </p>

      <H2>Repository layout</H2>
      <CodeBlock lang="text">{`msflib-fastapi/
├─ core/
│  └─ msflib/            # the shared "msflib" package (v0.2.0)
│     ├─ core/config.py  # tiered configuration engine
│     ├─ core/security.py# JWT + bcrypt helpers
│     ├─ core/store.py   # MapStore / RedisStore
│     ├─ policy/         # policy envelope + resolution service
│     ├─ models/         # SQLModel bases (ModelBase, enums…)
│     ├─ actions/        # generic CRUD (ModelAction)
│     ├─ api/            # dependency factories, enhanced routers
│     ├─ eventbus/       # Emitter + @listen decorator
│     ├─ seed/           # YAML-driven seeders
│     ├─ services/       # email
│     └─ utils/          # uploads, random, slugify…
├─ modules/
│  ├─ account/           # msflib-account (v0.2.1)
│  ├─ auth/              # msflib-auth (v0.2.1)
│  ├─ workspaces/        # msflib-workspaces (v0.2.0)
│  ├─ workspace_config/  # msflib-workspace-config (v0.2.0)
│  ├─ notifications/     # msflib-notifications (v0.2.0)
│  ├─ workspace_notifications/ # msflib-workspace-notifications (v0.2.0)
│  ├─ payments/          # msflib-payments (v0.2.0)
│  ├─ drivelink/         # msflib-drivelink (v0.1.0)
│  └─ ai_core/           # msflib-ai-core (v0.2.0)
├─ template/             # Jinja2 scaffolds for new modules
├─ testsite/             # reference app: core + auth + account (+ payments)
└─ scripts/              # scaffold_module.py etc.`}</CodeBlock>

      <H2>Examples</H2>

      <H3>Two ideas hold it together</H3>
      <ol>
        <li>
          <B>Tiered configuration</B> — every module declares settings in a namespace,
          resolved through a deterministic precedence chain:{' '}
          <C>default → environment → tenant → workspace → user → request override</C>. See{' '}
          <A to="/fastapi/configuration">Tiered configuration</A>.
        </li>
        <li>
          <B>Policy layer</B> — explicit, auditable policy modeling on top of the same
          layers (<C>PolicyEnvelope</C>, <C>PolicyResolutionService</C>, traces and
          decision records). See <A to="/fastapi/policy">Policy engine</A>.
        </li>
      </ol>

      <H3>The module contract</H3>
      <p>
        A module is a normal Python package under <C>modules/&lt;name&gt;/msflib/&lt;name&gt;/</C>{' '}
        with:
      </p>
      <ul>
        <li>
          a <C>ModuleSettingsBase</C> subclass declaring its settings namespace (e.g.{' '}
          <C>AUTH</C>),
        </li>
        <li>SQLModel <C>table=True</C> models,</li>
        <li>
          <C>ModelAction</C>-based CRUD services,
        </li>
        <li>
          an <C>APIRouter</C> (most modules), included by the host app,
        </li>
        <li>
          lifecycle events emitted on the shared event bus (e.g. <C>account-created</C>).
        </li>
      </ul>
      <p>
        The reference wiring lives in <C>testsite/app/</C> — it composes{' '}
        <C>PaymentsSettings, AccountSettings, AuthSettings, CoreSettings, SettingsBase</C>{' '}
        into one settings class and mounts auth + account + payments routers under a
        versioned prefix.
      </p>

      <H2>Requirements</H2>
      <Table
        head={['Requirement', 'Version']}
        rows={[
          ['Python', '≥ 3.10 (ai_core caps at <3.14)'],
          ['Pydantic', 'v2 + pydantic-settings v2 (v1 only on msflib 0.1.x tags)'],
          ['FastAPI', '>=0.111,<1'],
        ]}
      />

      <Note>
        The repo does not ship Alembic migrations; <C>msflib.db.init_db()</C> can create
        tables for dev/test, but production apps are expected to collect module models
        into their own Alembic setup.
      </Note>
    </>
  )
}
