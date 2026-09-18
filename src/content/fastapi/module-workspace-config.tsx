import { B, C, CodeBlock, H2, H3, Note, Table, Tip } from '../../components/md'

export default function FastapiWorkspaceConfig() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-workspace-config</C> (v0.2.0) persists the <B>tenant / workspace /
        user</B> layers of the tiered configuration engine and adapts them to the policy
        layer. Depends on: msflib. Namespace: <C>WORKSPACE_CONFIG</C> (no custom fields).
      </p>
      <p>
        Values are stored as <C>ScopedConfigEntry</C> rows keyed by a deterministic{' '}
        <C>storage_key</C> built from scope type + namespace + ids, with the settings as a
        JSON <C>values</C> blob. <C>ScopedConfigService</C> is the read/write API; when
        resolving a module's settings it loads the tenant and workspace tiers, folds them
        into a single <C>tenant_config</C> argument, and hands everything to{' '}
        <C>resolve_tiered()</C> — so callers get back a validated settings instance that
        already honors the precedence chain. The second, orthogonal responsibility is
        workspace-scoped categorization (<C>Category</C>, <C>WorkspaceCategory</C>,{' '}
        <C>Tag</C>), exposed through the router.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Per-tenant or per-workspace settings</B> — persist values for a namespace
          (e.g. <C>PAYMENTS</C>, <C>AI_CORE</C>) that override env/default tiers.
        </li>
        <li>
          <B>Policy resolution storage</B> — the <C>PolicyScopedConfigStore</C> protocol
          the policy engine reads from is implemented by this module's adapter.
        </li>
        <li>
          <B>Per-request overrides with an allowlist</B> — request-tier keys are checked
          against the target module's <C>request_override_allowlist</C>.
        </li>
        <li>
          <B>Workspace categorization</B> — admin-managed categories/tags scoped to the
          resolved workspace.
        </li>
      </ul>

      <H2>Endpoints</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['GET', <C>/workspace_config/health</C>, 'Health check'],
          ['GET / POST', <C>/workspace_config/categories</C>, 'List / create categories'],
          ['PUT / DELETE', <C>/workspace_config/categories/&#123;id&#125;</C>, 'Update / delete category'],
        ]}
      />
      <Note>
        The router factory's default prefix is <C>/config</C>; the paths above assume the
        host app mounts it with <C>prefix="/workspace_config"</C>. Listing categories
        works with <C>get_current_workspace_anonymous</C>; creating/updating/deleting
        requires <C>workspace_role_check(["admin"])</C>.
      </Note>

      <H2>Key models</H2>
      <ul>
        <li>
          <C>ScopedConfigEntry</C> — <C>storage_key</C>, <C>namespace</C>,{' '}
          <C>scope_type</C>, <C>tenant_id</C>, <C>workspace_id</C>, <C>account_id</C>,{' '}
          <C>values</C>
        </li>
        <li>
          <C>ConfigScopeType</C> — <C>tenant</C>, <C>workspace</C>, <C>user</C>
        </li>
        <li>
          <C>Category</C>, <C>WorkspaceCategory</C>, <C>Tag</C> — workspace-scoped
          categorization (a second, orthogonal responsibility of the module)
        </li>
      </ul>

      <H2>ScopedConfigService</H2>
      <CodeBlock lang="python">{`service.get_namespace_values(session, ConfigScopeType.workspace, "PAYMENTS", workspace_id=ws.id)
service.put_namespace_values(session, ConfigScopeType.workspace, "PAYMENTS", values, workspace_id=ws.id)
service.set_value(session, ConfigScopeType.user, "AI_CORE", "LLM_TEMPERATURE", 0.7,
                  workspace_id=ws.id, account_id=account.id)
service.get_value(session, ConfigScopeType.tenant, "AI_CORE", "RATE_LIMIT_RPM", tenant_id=t.id, default=60)
service.delete_value(session, ConfigScopeType.tenant, "PAYMENTS", "PAYMENT_GATEWAY", tenant_id=t.id)
service.resolve_module_settings(session, settings.scope("PAYMENTS").unwrap(),
                                workspace_id=ws.id, account_id=account.id)`}</CodeBlock>
      <p>
        <C>ScopedConfigPolicyStoreAdapter</C> adapts this service to the{' '}
        <C>PolicyScopedConfigStore</C> protocol, so <C>PolicyResolutionService</C> reads
        tenant/workspace/user policy values from it. When resolving, callers fold tenant +
        workspace values into a single <C>tenant_config</C> argument before passing them on
        — matching the precedence rules of the configuration engine.
      </p>

      <Note>
        The module README calls itself a "starter scaffold", but the implementation is
        fully functional — the README is boilerplate that was never updated.
      </Note>

      <H2>Examples</H2>

      <H3>1. Compose the settings and mount the router</H3>
      <p>
        The settings class has no custom fields — you add the module for its service and
        router. Mounting requires the workspace-aware dependency namespace because every
        category route is workspace-scoped:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py — namespace "WORKSPACE_CONFIG" (no custom fields)
from msflib.core.config import SettingsBase, CoreSettings
from msflib.account.config import AccountSettings
from msflib.workspaces.config import WorkspaceSettings
from msflib.workspace_config.config import WorkspaceConfigSettings


class AppSettings(WorkspaceConfigSettings, WorkspaceSettings, AccountSettings, CoreSettings, SettingsBase):
    ...


# app/api/api.py — mount the categories router under your chosen prefix
from msflib.workspace_config.router import router as workspace_config_router
from app.api.deps import auth_deps, user_deps

api_router.include_router(workspace_config_router(
    get_session=get_session_factory,
    settings=settings,
    get_current_workspace=user_deps.get_current_workspace,
    get_current_workspace_anonymous=user_deps.get_current_workspace_anonymous,
    get_current_active_user=user_deps.get_current_active_user,
    workspace_role_check=user_deps.WorkspaceRoleCheck,
    prefix="/workspace_config",
    tags=["config"],
))`}</CodeBlock>

      <H3>2. Persist and read a workspace-tier setting</H3>
      <p>
        Any module namespace can be layered: store a workspace-level override for{' '}
        <C>PAYMENTS</C>, then resolve the full settings through the service. The returned
        object is a validated <C>PaymentsSettings</C> with the tiers already folded in:
      </p>
      <CodeBlock lang="python">{`from msflib.workspace_config.models import ConfigScopeType
from msflib.workspace_config.service import ScopedConfigService

svc = ScopedConfigService()

# one key at a time
svc.set_value(
    session, ConfigScopeType.workspace, "PAYMENTS",
    key="PAYMENT_GATEWAY", value="stripe", workspace_id=workspace.id,
)

# or a whole values dict for the namespace
svc.put_namespace_values(
    session, ConfigScopeType.workspace, "PAYMENTS",
    values={"PAYMENT_GATEWAY": "stripe", "PAYMENT_CALLBACK_URL": "https://acme.io/pay/callback"},
    workspace_id=workspace.id,
)

svc.get_value(session, ConfigScopeType.workspace, "PAYMENTS", "PAYMENT_GATEWAY",
              workspace_id=workspace.id)          # "stripe"

# resolve module settings with the persisted tiers applied
payments = svc.resolve_module_settings(
    session, settings.scope("PAYMENTS").unwrap(), workspace_id=workspace.id,
)
payments.PAYMENT_GATEWAY    # "stripe" for this workspace only`}</CodeBlock>
      <Tip>
        Resolution only mixes tiers you pass ids for — omit <C>account_id</C> and the user
        tier is skipped; omit <C>tenant_id</C> and the tenant tier is skipped.
      </Tip>

      <H3>3. Feed the policy engine from persisted values</H3>
      <p>
        Wrap the service in the adapter and hand it to <C>PolicyResolutionService</C> —
        this is the wiring that lets modules like <C>ai_core</C> load their{' '}
        <C>PolicyEnvelope</C> fields from the database:
      </p>
      <CodeBlock lang="python">{`from msflib.policy import PolicyResolutionService
from msflib.workspace_config.service import ScopedConfigService, ScopedConfigPolicyStoreAdapter
from app.core.config import settings

svc = ScopedConfigService()

# persist a policy value for the AI_CORE namespace in this workspace
svc.set_value(
    session, ConfigScopeType.workspace, "AI_CORE",
    key="CHUNKING_POLICY",
    value={"enabled": True, "version": 2, "provider_preference": ["markdown"]},
    workspace_id=workspace.id,
)

service = PolicyResolutionService(
    scoped_config_store=ScopedConfigPolicyStoreAdapter(svc),
)
resolved, trace = service.resolve_module_settings(
    settings.scope("AI_CORE").unwrap(),
    session=session,
    tenant_id=1,
    workspace_id=workspace.id,
)
trace.winning_layers["CHUNKING_POLICY"]   # PolicyLayer.workspace`}</CodeBlock>

      <H3>4. Category CRUD from a workspace admin (curl flow)</H3>
      <p>
        Categories are the router-facing half of the module. Log in, switch to the target
        workspace, then manage categories scoped to it (create requires a workspace
        admin):
      </p>
      <CodeBlock lang="bash">{`# list categories for the resolved workspace (anonymous workspace resolution)
curl -s http://localhost:8000/api/v1/acme-rockets/workspace_config/categories

# create one (workspace admin required)
curl -s -X POST http://localhost:8000/api/v1/acme-rockets/workspace_config/categories \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"name": "Marketing"}'
# → 201 {"id": 3, "name": "Marketing", "workspace_id": 2, ...}

# renaming to an existing name in the same workspace fails with 422
curl -s -X PUT http://localhost:8000/api/v1/acme-rockets/workspace_config/categories/3 \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"name": "Growth"}'

curl -s http://localhost:8000/api/v1/acme-rockets/workspace_config/health
# → {"module": "workspace_config", "enabled": true}`}</CodeBlock>
      <Note>
        Uniqueness is per workspace: the same category name can exist in two workspaces,
        but only once in each.
      </Note>
    </>
  )
}
