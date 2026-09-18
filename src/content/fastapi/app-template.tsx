import { B, C, CodeBlock, H2, Note, Warning, H3 } from '../../components/md'

export default function FastapiAppTemplate() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        The reference composition lives in <C>testsite/app/</C>, which wires core + auth +
        account (+ payments) into a working API. Follow the same shape in your own app.
      </p>

      <H2>1. Compose a settings class</H2>
      <p>
        Settings compose via <B>mixin inheritance</B> — each module contributes a{' '}
        <C>ModuleSettingsBase</C> subclass:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py
from msflib.core.config import CoreSettings, SettingsBase
from msflib_auth.config import AuthSettings
from msflib_account.config import AccountSettings
from msflib_payments.config import PaymentsSettings
from pydantic_settings import SettingsConfigDict

class TestSiteSettings(
    PaymentsSettings,
    AccountSettings,
    AuthSettings,
    CoreSettings,     # namespace "CORE": API prefix, secrets, DB URIs, SMTP, storage…
    SettingsBase,     # provides .scope("NAMESPACE") + env sources
):
    model_config = SettingsConfigDict(case_sensitive=True, env_nested_delimiter="__")

settings = TestSiteSettings()`}</CodeBlock>
      <p>Prefer composition over inheritance? Use the runtime factory:</p>
      <CodeBlock lang="python">{`from msflib.core.config import compose_settings_model
ComposedSettings = compose_settings_model([CoreSettings, AuthSettings, AccountSettings])
settings = ComposedSettings()`}</CodeBlock>

      <H2>2. Wire the database session</H2>
      <CodeBlock lang="python">{`from msflib.api import get_session_factory
from app.core.config import settings
# engine creation itself comes from msflib.db (see note below)

SessionDep = get_session_factory(engine)   # Generator-based FastAPI dependency`}</CodeBlock>

      <Warning title="Host app settings convention">
        <C>msflib.db.session</C> imports <C>from app.core.config import settings</C> — a
        deliberate convention that the <B>host app</B> provides{' '}
        <C>app/core/config.py</C> exposing <C>settings</C>. Your app must have that module
        (name it exactly <C>app.core.config</C>) or core's session helpers won't import.
      </Warning>

      <H2>3. Mount routers</H2>
      <CodeBlock lang="python">{`# app/api/main.py
from fastapi import APIRouter
from app.core.config import settings

api_router = APIRouter(prefix=settings.scope("CORE").API_V1_STR)
# api_router.include_router(auth_router, prefix="/auth", dependencies=[Depends(...)])
# api_router.include_router(account_router, prefix="/account")`}</CodeBlock>
      <p>
        The testsite mounts one <C>api_router</C> under the versioned prefix in{' '}
        <C>main.py</C>:
      </p>
      <CodeBlock lang="python">{`app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(api_router)`}</CodeBlock>

      <H2>Examples</H2>

      <H3>4. Security dependencies</H3>
      <p>
        The auth module exposes dependency namespaces instead of loose functions:
      </p>
      <CodeBlock lang="python">{`from msflib_auth.deps import get_account_dependencies, get_user_dependencies

account_deps = get_account_dependencies()
# account_deps.get_current_account, .get_current_active_account,
# .get_current_active_superuser, .RoleCheck

user_deps = get_user_dependencies()
# adds workspace-aware: .get_current_workspace, .get_current_workspace_anonymous,
# .get_current_user, .get_current_active_user, .WorkspaceRoleCheck

@app.get("/admin-only")
def admin_only(account = Depends(account_deps.get_current_active_superuser)): ...`}</CodeBlock>

      <H3>5. Seed data (dev/test)</H3>
      <CodeBlock lang="python">{`from msflib.db import init_db
from msflib.seed import SeedRunner, ActionSeeder

init_db(engine, metadata, create_tables=True, seeder_config=...)  # dev/test only`}</CodeBlock>
      <p>
        The testsite's <C>run_seeder.sh</C> runs <C>python -m app.seed.runner</C> — a{' '}
        <C>SeedRunner</C> (YAML-driven, with <C>--dry-run</C>, <C>--db-url</C>,{' '}
        <C>--seeders</C> CLI flags) orchestrating <C>ActionSeeder</C> classes.
      </p>

      <H3>6. Scaffolding new modules</H3>
      <CodeBlock lang="bash">{`python scripts/scaffold_module.py <module_name>
# renders template/msflib/{{ module_name }}/ — config.py, router.py, actions.py,
# policy.py, models/, service/ and test files`}</CodeBlock>

      <Note>
        The scaffold template still emits <C>python = "^3.8"</C> — bump it to{' '}
        <C>&gt;=3.10</C> to match the monorepo requirement.
      </Note>

      <H2>A workspace-enabled app</H2>
      <p>
        <C>testsite/app/tests/with_workspaces/conftest.py</C> shows the multi-workspace
        variant: <C>WorkspaceTestSettings(WorkspaceSettings, AccountSettings, AuthSettings,
        CoreSettings, SettingsBase)</C> mounting auth + workspace routers — the pattern for
        apps using <C>msflib-workspaces</C>.
      </p>
    </>
  )
}
