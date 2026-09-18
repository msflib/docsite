import { B, C, CodeBlock, H2, H3, Note, Table, Tip } from '../../components/md'

export default function FastapiCore() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        The <C>msflib</C> core package (v0.2.0, under <C>core/</C>) is the shared
        foundation every module builds on — and the only thing a module is allowed to
        depend on besides its declared peers. It provides the tiered configuration engine
        (settings bases and namespaces), generic CRUD (<C>ModelAction</C>) with lifecycle
        events, a process-wide event bus, JWT/bcrypt security helpers, token stores,
        SQLModel base models, dependency factories for FastAPI, seeders and upload
        utilities.
      </p>
      <p>
        Modules compose these pieces instead of reinventing them: a module defines{' '}
        <C>table=True</C> models on <C>ModelBase</C>, an action subclassing{' '}
        <C>ModelAction</C>, a settings class on <C>ModuleSettingsBase</C>, and router
        factories that receive their dependencies (<C>get_session</C>,{' '}
        <C>get_current_account</C>…) from the host app rather than importing them.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>One CRUD implementation</B> — <C>ModelAction[M, Create, Update]</C> covers
          every model so actions stay thin wrappers with domain logic only.
        </li>
        <li>
          <B>Cross-cutting lifecycle hooks</B> — e.g. auto-creating a default workspace
          whenever an account is created, without coupling the two modules.
        </li>
        <li>
          <B>Drop-in auth plumbing</B> — token creation/revocation, bcrypt hashing and a
          Redis-or-memory keystore behind one interface.
        </li>
        <li>
          <B>Seeded dev/test databases</B> — YAML-driven <C>SeedRunner</C> plus{' '}
          <C>ActionSeeder</C> classes that reuse your actions.
        </li>
      </ul>
      <p>
        Below is the public surface grouped by subpackage (paths under{' '}
        <C>core/msflib/</C>).
      </p>

      <H2>Models (msflib.models)</H2>
      <Table
        head={['Export', 'Purpose']}
        rows={[
          [<C>SchemaBase(SQLModel)</C>, <>Base schema with <C>jsond()</C> helper and enum/JSON encoders</>],
          [<C>ModelBase(SchemaBase)</C>, <>Table base: <C>id</C>, <C>created_at</C>, <C>updated_at</C>, <C>add_relationship()</C> for post-definition relationship attachment</>],
          [<C>BaseEnum(str, Enum)</C>, <>JSON-serializable enum with <C>.random()</C> and <C>.all()</C></>],
          [<C>ServerEvent, Option, AccountStub</C>, 'Shared small schemas'],
          [<C>full_url_field()</C>, 'Decorator for avatar/image URL fields'],
        ]}
      />

      <H2>CRUD actions (msflib.actions)</H2>
      <p>
        <C>ModelAction[ModelType, CreateSchemaType, UpdateSchemaType]</C> is generic CRUD
        with lifecycle events:
      </p>
      <ul>
        <li>
          <C>get</C>, <C>get_by_all</C>, <C>get_multi</C>, <C>create</C>, <C>update</C>,{' '}
          <C>delete</C>, <C>create_random</C>, <C>random</C>
        </li>
        <li>
          <C>_emit_lifecycle()</C> fires eventbus events around mutations (e.g.{' '}
          <C>account-created-pre-email</C>, <C>account-created</C>)
        </li>
        <li>
          <C>action()</C> factory wrapper with caching
        </li>
      </ul>

      <H2>Event bus (msflib.eventbus)</H2>
      <CodeBlock lang="python">{`from msflib.eventbus import Emitter, listen

@listen("account-created")
async def welcome(account, logger=None):
    ...`}</CodeBlock>
      <p>
        <C>Emitter</C> wraps pyee-style <C>EventEmitter</C> with{' '}
        <C>has_listeners()</C> / <C>emit_if_listeners()</C>; the <C>@listen</C> decorator
        registers handlers and injects a contextual logger. Used by <C>ModelAction</C> and
        modules (e.g. workspaces auto-creating a default workspace on{' '}
        <C>account-create-pre-commit</C>).
      </p>

      <H2>Security (msflib.core.security)</H2>
      <CodeBlock lang="python">{`create_access_token(subject, secret_key, expiry_minutes, claims)  # python-jose JWT
get_password_hash(password) / verify_password(plain, hashed)      # bcrypt
revoke_access_token(token_store, decoded_token)                   # blacklist`}</CodeBlock>

      <H2>Stores (msflib.core.store)</H2>
      <p>
        <C>StoreInterface(ABC)</C> — <C>put</C>, <C>remove</C>, <C>check</C>, <C>get</C> —
        with <C>MapStore</C> (in-memory) and <C>RedisStore</C>.{' '}
        <C>msflib.api.get_keystore_factory(...)</C> returns either as a FastAPI dependency.
      </p>

      <H2>Schemas (msflib.schemas)</H2>
      <p>
        <C>Msg</C>, <C>Token(access_token, expires, token_type)</C>,{' '}
        <C>TokenPayload(sub, user_id, workspace_id)</C>.
      </p>

      <H2>Services (msflib.services)</H2>
      <p>
        <C>send_email(...)</C> — Jinja2-templated HTML email via the <C>emails</C>{' '}
        library, with pre-built templates (<C>new_account.html</C>, password reset).
      </p>

      <H2>API helpers (msflib.api)</H2>
      <Table
        head={['Export', 'Purpose']}
        rows={[
          [<C>DependencyNamespace</C>, 'Lightweight attribute namespace with as_dict()'],
          [<C>get_session_factory(engine)</C>, 'Generator-based session dependency'],
          [<C>get_keystore_factory(...)</C>, 'Redis or in-memory store dependency'],
          [<C>create_enhanced_router(router)</C>, 'APIRouter wrapper adding a validation_types kwarg for runtime schema injection'],
        ]}
      />

      <H2>Seeders (msflib.seed)</H2>
      <p>
        <C>SeederBase</C> (abstract) / <C>ActionSeeder</C> (concrete), <C>SeedRunner</C>{' '}
        (YAML-driven CLI with <C>--dry-run</C>, <C>--db-url</C>, <C>--seeders</C>),{' '}
        <C>SeedContext</C> for dependency chaining, plus Pydantic config schemas (
        <C>SeederConfig</C>, <C>ConfigSchema</C>, <C>ActionSchema</C>,{' '}
        <C>DependentSchema</C>).
      </p>

      <H2>Utils (msflib.utils)</H2>
      <Table
        head={['Module', 'Contents']}
        rows={[
          [<C>random.py</C>, 'Type-aware random value generation with a custom generator registry'],
          [<C>uploads.py</C>, <>StorageBase ABC: <C>LocalStorage</C>, <C>AWSStorage</C>, <C>GoogleCloudStorage</C>, <C>AzureStorage</C>, <C>CloudinaryStorage</C>; <C>save_file()</C>, <C>save_file_blob()</C>, <C>delete_blob()</C></>],
          [<C>utils.py</C>, <>slugify, generate_password_reset_token, verify_password_reset_token</>],
          [<C>yaml.py</C>, 'Source-location-aware YAML loader (seeder diagnostics)'],
          [<C>file.py</C>, 'File path helpers'],
        ]}
      />

      <H2>Database (msflib.db)</H2>
      <p>
        <C>init_db(engine, metadata, create_tables, seeder_config)</C> creates/drops
        tables and runs seeders — for dev/test; the docstring explicitly recommends
        Alembic for production.
      </p>

      <H2>Examples</H2>

      <H3>1. Build a domain action on ModelAction</H3>
      <p>
        A project model plus its action: you only write the model and the domain bits —
        every query, create, update, delete and random-data generation comes from the
        generic base:
      </p>
      <CodeBlock lang="python">{`from msflib.actions import ModelAction
from msflib.models import ModelBase, SchemaBase, BaseEnum
from sqlmodel import Field
from app.models import ProjectCreate, ProjectUpdate


class ProjectStatus(BaseEnum):
    draft = "draft"
    live = "live"


class Project(ModelBase, table=True):
    name: str = Field(index=True)
    status: ProjectStatus = ProjectStatus.draft


class ProjectAction(ModelAction[Project, ProjectCreate, ProjectUpdate]):
    def publish(self, session, project: Project) -> Project:
        return self.update(session, model=project, update={"status": ProjectStatus.live})


pa = ProjectAction()
project = pa.create(session, data=ProjectCreate(name="Website"))
pa.get_by_all(session, status=ProjectStatus.draft)`}</CodeBlock>
      <Tip>
        Prefer plain instantiation (<C>ModelAction[M, C, U]()</C>) or a subclass — both
        resolve the concrete types from the generic parameters, and <C>action(...)</C>
        caches instances by type tuple if you create many of the same shape.
      </Tip>

      <H3>2. React to lifecycle events on the event bus</H3>
      <p>
        <C>ModelAction.create()</C> emits <C>{'{model}-{operation}'}</C> events around
        the transaction (after <C>flush()</C>, before <C>commit()</C>) — register
        handlers anywhere at startup and they run inside the same transaction:
      </p>
      <CodeBlock lang="python">{`from msflib.eventbus import listen

@listen("project-create-pre-commit")
def stamp_owner(project, options, logger=None):
    session = options.get("session")
    logger.info("Creating project %s", project.name)
    # mutate \`project\` or the session here — still pre-commit

@listen("project-created")
def notify_downstream(project, options, logger=None):
    # fired by higher-level modules after commit (e.g. the account router)
    ...`}</CodeBlock>
      <p>
        This is the seam the workspaces module uses: its <C>register_hooks()</C> listens
        for <C>account-create-pre-commit</C> and auto-creates a default workspace within
        the same transaction as account creation.
      </p>

      <H3>3. Wire sessions, keystore and security helpers into FastAPI</H3>
      <p>
        The api factories are what routers receive from the host app. Sessions come from
        an engine, the keystore picks Redis when configured and falls back to in-memory,
        and the security helpers round out login/logout:
      </p>
      <CodeBlock lang="python">{`from fastapi import Depends
from sqlmodel import create_engine
from msflib.api.deps import get_session_factory, get_keystore_factory
from msflib.core.security import create_access_token, verify_password
from msflib.core.store import StoreInterface

engine = create_engine(settings.scope("CORE").SQLITE_DATABASE_URI)
get_session = get_session_factory(engine)   # lru-cached dependency factory
get_keystore = get_keystore_factory()       # MapStore without Redis config


@app.post("/login")
def login(session=Depends(get_session), keystore: StoreInterface = Depends(get_keystore)):
    account = ...  # load account
    if not verify_password(form.password, account.hashed_password):
        raise HTTPException(status_code=400)
    return {
        "access_token": create_access_token(
            account.email, settings.SECRET_KEY, expiry_minutes=60
        )
    }`}</CodeBlock>
      <Note>
        In real apps the auth router built by <C>msflib.auth.router(...)</C> already does
        this for you — the core helpers are what that router and your custom endpoints
        share.
      </Note>
    </>
  )
}
