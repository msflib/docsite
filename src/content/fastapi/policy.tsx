import { A, B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiPolicy() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        The shared policy layer (<C>core/msflib/policy/</C>) is for modules that need{' '}
        <B>explicit policy modeling, scope-aware resolution and decision
        traceability</B> — configuration plus audit. Where the plain tiered engine
        answers "what is the value of this setting?", the policy layer answers "why is it
        that value, which layer won, and was the change allowed?"
      </p>
      <p>
        It works by making policy-carrying settings first-class: a module annotates a
        settings field with a <C>PolicyEnvelope</C> subclass, persisted values for the
        tenant/workspace/user tiers are read from a store that implements the{' '}
        <C>PolicyScopedConfigStore</C> protocol (the{' '}
        <A to="/fastapi/module-workspace-config">workspace-config module</A> ships the
        adapter), and <C>PolicyResolutionService</C> folds every layer into one resolved
        settings object while recording a per-key trace.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Structured policy fields</B> — middleware enablement, chunking strategy
          chains, feature constraints — validated with a schema instead of loose dicts.
        </li>
        <li>
          <B>Per-key layer traces</B> — a <C>PolicyResolutionTrace</C> that names the
          winning layer for every key and lists rejected overrides.
        </li>
        <li>
          <B>Audit records</B> — decision/change records you can persist or log for
          compliance.
        </li>
        <li>
          <B>Schema-validated persistence</B> — <C>validate_policy_mapping()</C> checks
          stored policy values against the envelope before they are applied.
        </li>
      </ul>

      <H2>Core pieces</H2>
      <Table
        head={['Piece', 'File', 'Purpose']}
        rows={[
          [<C>PolicyEnvelope</C>, <C>envelope.py</C>, <>Standard policy shape: <C>enabled</C>, <C>version</C>, <C>defaults</C>, <C>constraints</C>, <C>overrides</C>, <C>selection</C>, <C>fallbacks</C>, <C>observability</C></>],
          [<C>PolicyResolutionService</C>, <C>resolution.py</C>, <>Multi-layer resolution orchestrator: <C>resolve_module_settings()</C>, <C>resolve_policy_field()</C>, <C>load_policy_field()</C>, <C>parse_policy_mapping()</C></>],
          [<C>PolicyLayer</C>, '—', <>Enum: <C>default, environment, tenant, workspace, user, request</C></>],
          [<C>PolicyResolutionTrace</C>, '—', <>Dataclass: <C>winning_layers</C>, <C>rejected_overrides</C> — per-key diagnostics of which layer won</>],
          [<C>PolicyDecisionRecord / PolicyChangeRecord</C>, <C>logging.py</C>, <>Structured audit records; <C>InMemoryPolicyDecisionLogger</C> / <C>InMemoryPolicyChangeLogger</C> for tests</>],
          [<C>PolicyScopedConfigStore</C>, '—', 'Protocol the resolution service reads tenant/workspace/user values from'],
          [<C>validate_policy_mapping()</C>, <C>resolution.py</C>, 'Shared schema validation for policy fields'],
        ]}
      />

      <H2>The minimal flow</H2>
      <ol>
        <li>
          <B>Define policy-bearing fields</B> in your module settings
          (<C>ModuleSettingsBase</C> subclass) — typed as <C>PolicyEnvelope</C>{' '}
          subclasses.
        </li>
        <li>
          <B>Persist</B> tenant/workspace/user values via the workspace-config module.
        </li>
        <li>
          <B>Resolve</B> effective settings through <C>PolicyResolutionService</C>.
        </li>
        <li>
          <B>Apply</B> only the resolved settings in your runtime bridge/service.
        </li>
        <li>
          <B>Capture</B> trace/decision records for observability and audit.
        </li>
      </ol>

      <CodeBlock lang="python">{`from msflib.policy import PolicyEnvelope, PolicyResolutionService

class ChunkingPolicySchema(PolicyEnvelope):
    provider_preference: str | None = None
    fallback_chain: list[str] = []

service = PolicyResolutionService(scoped_config_store=scoped_config_store)
resolved, trace = service.resolve_module_settings(AICoreSettings())
# trace is a PolicyResolutionTrace — which layer won each key`}</CodeBlock>

      <H2>Real example in the repo</H2>
      <p>
        The <C>ai_core</C> module is the reference consumer: its <C>AICoreSettings</C>{' '}
        declares <C>MiddlewarePolicySchema(PolicyEnvelope)</C> and{' '}
        <C>ChunkingPolicySchema(PolicyEnvelope)</C> fields, and{' '}
        <C>LangChainConfigBridge</C> translates the resolved policy into runtime LangChain
        middleware configuration. See{' '}
        <C>modules/ai_core/msflib/ai_core/services/chunking/README.md</C> and{' '}
        <C>core/msflib/policy/README.md</C>.
      </p>

      <H2>Examples</H2>

      <H3>1. Declare a policy field on your module settings</H3>
      <p>
        Subclass <C>PolicyEnvelope</C> and annotate a settings field with it.{' '}
        <C>ModuleSettingsBase</C> finds the schema through the annotation first, then via
        sibling <C>policy.py</C> discovery (naming contract:{' '}
        <C>{'{FIELD}_POLICY'}</C> → <C>{'{Field}PolicySchema'}</C>):
      </p>
      <CodeBlock lang="python">{`from msflib.core.config import ModuleSettingsBase
from msflib.policy import PolicyEnvelope


class ModerationPolicySchema(PolicyEnvelope):
    blocked_terms: list[str] = []
    max_requests_per_minute: int = 60


class MyModuleSettings(ModuleSettingsBase):
    namespace = "MYMODULE"

    MODERATION_POLICY: ModerationPolicySchema = ModerationPolicySchema()`}</CodeBlock>
      <Note>
        The envelope validates the shared fields (<C>enabled</C>, <C>version</C>,{' '}
        <C>defaults</C>, <C>constraints</C>, <C>overrides</C>, <C>fallbacks</C>,{' '}
        <C>observability</C>) and allows extra keys, so your subclass only adds what is
        domain-specific.
      </Note>

      <H3>2. Resolve a module through PolicyResolutionService</H3>
      <p>
        Give the service a store that implements <C>PolicyScopedConfigStore</C> (the
        workspace-config module's <C>ScopedConfigPolicyStoreAdapter</C> is exactly that)
        and resolve one module's settings. Pass{' '}
        <C>request_override</C> for the per-request tier and a{' '}
        <C>decision_logger</C> to capture audit records:
      </p>
      <CodeBlock lang="python">{`from msflib.policy import PolicyResolutionService
from msflib.policy.logging import InMemoryPolicyDecisionLogger
from msflib.workspace_config.service import ScopedConfigService, ScopedConfigPolicyStoreAdapter

service = PolicyResolutionService(
    scoped_config_store=ScopedConfigPolicyStoreAdapter(ScopedConfigService()),
    decision_logger=InMemoryPolicyDecisionLogger(),
)

resolved, trace = service.resolve_module_settings(
    my_module_settings,
    session=session,
    tenant_id=42,
    workspace_id=9,
    account_id=1337,
    request_override={"MODERATION_POLICY": {"enabled": False}},
)

trace.winning_layers        # e.g. {"MODERATION_POLICY": PolicyLayer.request, ...}
trace.rejected_overrides    # keys refused (not allowlisted) and why
resolved.MODERATION_POLICY.enabled  # False — the request tier won`}</CodeBlock>

      <H3>3. Persist a tenant-tier policy and watch the layers flip</H3>
      <p>
        Persisting a value for a namespace in the tenant tier changes the winning layer
        the next time you resolve — no code changes. The example uses the workspace-config
        service directly, then resolves again:
      </p>
      <CodeBlock lang="python">{`from msflib.workspace_config.models import ConfigScopeType
from msflib.workspace_config.service import ScopedConfigService

svc = ScopedConfigService()

svc.set_value(
    session,
    ConfigScopeType.tenant,
    namespace="MYMODULE",
    key="MODERATION_POLICY",
    value={"enabled": True, "version": 2, "blocked_terms": ["spam"]},
    tenant_id=42,
)

resolved, trace = service.resolve_module_settings(
    my_module_settings, session=session, tenant_id=42
)
trace.winning_layers["MODERATION_POLICY"]   # PolicyLayer.tenant — beats the default
resolved.MODERATION_POLICY.blocked_terms    # ["spam"]`}</CodeBlock>
      <p>
        This is exactly the loop the <C>ai_core</C> module runs with its{' '}
        <C>MIDDLEWARE_POLICY</C> / <C>CHUNKING_POLICY</C> fields and{' '}
        <C>LangChainConfigBridge</C>: persisted tier values flow through{' '}
        <C>validate_policy_mapping()</C>, come out as a validated envelope, and are
        mapped into runtime configuration — with the trace proving which layer decided.
      </p>
    </>
  )
}
