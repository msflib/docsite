import { A, B, C, CodeBlock, H2, H3, Note, Table, Warning } from '../../components/md'

export default function FastapiConfiguration() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        Every MSFLib module ships a <C>ModuleSettingsBase</C> subclass that declares its
        own settings under a namespace (e.g. <C>AUTH</C>, <C>PAYMENTS</C>,{' '}
        <C>DRIVELINK</C>). The host application composes those classes into a single
        pydantic-settings object and reads a module's slice back through{' '}
        <C>settings.scope("NAMESPACE")</C>. Because modules never reach into each other's
        config, adding a module to your app is a matter of adding one settings class and
        one field — never of editing shared config code.
      </p>
      <p>
        The interesting part is the <B>tiered resolution engine</B> in{' '}
        <C>core/msflib/core/config.py</C>. A setting can come from six layers with a
        deterministic precedence chain:
      </p>
      <CodeBlock lang="text">{`default → environment → tenant → workspace → user → request override`}</CodeBlock>
      <p>
        Lower layers lose to higher ones; <C>workspace</C> sits between <C>tenant</C> and{' '}
        <C>user</C> — workspace-scoped values override tenant defaults but can still be
        overridden per-user or per-request. Callers like <C>ScopedConfigService</C> fold
        tenant and workspace values into a single <C>tenant_config</C> argument before
        resolving.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Per-tenant or per-workspace behavior</B> — e.g. workspace A allows Paystack,
          workspace B is capped at a different rate limit, without deploying different
          builds.
        </li>
        <li>
          <B>Legacy env-var compatibility</B> — modules declare <C>flat_aliases</C> so
          old flat variables like <C>ACCESS_TOKEN_EXPIRE_MINUTES</C> keep working next to
          scoped ones like <C>AUTH__ACCESS_TOKEN_EXPIRE_MINUTES</C>.
        </li>
        <li>
          <B>Safe per-request tuning</B> — modules publish a{' '}
          <C>request_override_allowlist</C> so untrusted request payloads can only touch
          keys the module author explicitly marked safe.
        </li>
        <li>
          <B>Auditable configuration</B> — persisted tiers live in the{' '}
          <A to="/fastapi/module-workspace-config">workspace-config module</A> and every
          resolution can be traced through the <A to="/fastapi/policy">policy engine</A>.
        </li>
      </ul>

      <H2>ModuleSettingsBase</H2>
      <p>
        Modules declare settings by subclassing <C>ModuleSettingsBase</C>{' '}
        (<C>core/msflib/core/config.py</C>):
      </p>
      <ul>
        <li>
          <C>namespace</C> — settings namespace, e.g. <C>"AUTH"</C>, <C>"PAYMENTS"</C>
        </li>
        <li>
          <C>flat_aliases</C> — legacy flat env-var aliases for backwards compatibility
        </li>
        <li>
          <C>request_override_allowlist</C> — keys a request may override (nothing else
          gets through)
        </li>
        <li>
          <C>resolve_tiered(...)</C> — fold the layers for this namespace
        </li>
        <li>
          <C>get_policy_field_schema()</C> / <C>_discover_policy_schema()</C> — introspect
          policy-typed fields
        </li>
      </ul>

      <H2>SettingsBase &amp; scope</H2>
      <p>
        The host app's settings class extends <C>SettingsBase</C> (pydantic-settings v2):
      </p>
      <CodeBlock lang="python">{`settings.scope("AUTH").ACCESS_TOKEN_EXPIRE_MINUTES   # view of one namespace
settings.scope("CORE").API_V1_STR                    # works with both mixin-inheritance
                                                     # and composed-nested settings styles`}</CodeBlock>
      <p>
        <C>settings_customise_sources</C> wires flat-alias env resolution; env nested
        delimiters use <C>__</C> (e.g. <C>CORE__API_V1_STR</C>).
      </p>

      <H2>Merging layers</H2>
      <p>
        <C>merge_config_layers()</C> merges tenant/workspace/user/request dicts via{' '}
        <C>deep_merge_mappings</C>. Request-level overrides pass through two guards:
      </p>
      <CodeBlock lang="python">{`from msflib.core.config import normalize_request_override, validate_request_override_allowlist

override = normalize_request_override(raw_override)          # shape/casing hygiene
validate_request_override_allowlist(override, allowlist)      # only allowlisted keys survive`}</CodeBlock>

      <H2>Where persisted values come from</H2>
      <p>
        The tenant/workspace/user tiers are persisted by the{' '}
        <A to="/fastapi/module-workspace-config">workspace-config module</A>{' '}
        (<C>ScopedConfigService</C>), and the <A to="/fastapi/policy">policy engine</A>{' '}
        layers observability on top: per-key winning-layer traces and decision/change
        records for audit.
      </p>

      <H2>CoreSettings defaults</H2>
      <p>
        <C>CoreSettings</C> (namespace <C>CORE</C>) ships defaults for: API version prefix,
        secrets, DB URIs, SMTP, storage and cloud credentials — override them via env or
        your composed settings class.
      </p>
      <Table
        head={['Group', 'Fields']}
        rows={[
          ['HTTP', <><C>API_V1_STR</C>, <C>PROJECT_NAME</C>, <C>CLIENT_HOST</C>, <C>SERVER_HOST</C>, <C>BACKEND_CORS_ORIGINS</C></>],
          ['Security', <><C>SECRET_KEY</C> (random URL-safe token if unset)</>],
          ['Database', <><C>USE_SQLITE</C>, <C>SQLITE_DATABASE_URI</C>, <C>POSTGRES_SERVER/USER/PASSWORD/DB/PORT</C>, <C>SQLALCHEMY_DATABASE_URI</C>, <C>DB_DEBUG_MODE</C></>],
          ['Email (SMTP)', <><C>SMTP_TLS</C>, <C>SMTP_HOST</C>, <C>SMTP_PORT</C>, <C>SMTP_USER</C>, <C>SMTP_PASSWORD</C>, <C>EMAILS_FROM_EMAIL</C>, <C>EMAILS_FROM_NAME</C>, <C>EMAILS_ENABLED</C>, <C>EMAILS_USE_SENDMAIL</C></>],
          ['Storage', <><C>STORAGE_METHOD</C>, <C>STORAGE_BASE_URL</C>, <C>STORAGE_PATH</C>, plus <C>CLOUDINARY_*</C>, <C>AWS_*</C>, <C>GCS_CREDENTIALS_PATH</C>, <C>AZURE_STORAGE_CONNECTION_STRING</C></>],
        ]}
      />

      <H2>Examples</H2>

      <H3>1. Compose module settings into your app settings</H3>
      <p>
        The simplest style is mixin inheritance: each module's settings class contributes
        its fields flat, and <C>SettingsBase</C> provides <C>scope()</C> plus the env
        sources. This is exactly what the reference app in <C>testsite/app/</C> does:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py
from msflib.core.config import SettingsBase, CoreSettings
from msflib.auth.config import AuthSettings
from msflib.account.config import AccountSettings
from msflib.payments.config import PaymentsSettings


class TestSiteSettings(PaymentsSettings, AccountSettings, AuthSettings, CoreSettings, SettingsBase):
    # CoreSettings
    PROJECT_NAME: str = "MSFLib Testsite"
    SECRET_KEY: str = "test-secret-key"

    # AuthSettings
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ENABLE_GOOGLE_OAUTH: bool = False

    # AccountSettings
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "password"
    USERS_OPEN_REGISTRATION: bool = True

    # PaymentsSettings
    PAYMENT_GATEWAY: str = "paystack"
    PAYMENT_CALLBACK_URL: str = "http://localhost:3000/paystack/callback"


settings = TestSiteSettings()

# Modules read their slice through the namespace view:
auth = settings.scope("AUTH")            # .ACCESS_TOKEN_EXPIRE_MINUTES, .ENABLE_GOOGLE_OAUTH…
core = settings.scope("CORE")            # .API_V1_STR, .SECRET_KEY, .STORAGE_METHOD…`}</CodeBlock>
      <Note>
        Prefer runtime composition? <C>compose_settings_model(name, base_settings_type,
        module_settings)</C> builds a settings class from a list of module settings
        classes, one nested field per namespace.
      </Note>

      <H3>2. Override settings from the environment</H3>
      <p>
        Because <C>SettingsBase</C> sets <C>env_nested_delimiter="__"</C> and installs a
        flat-alias env source, both scoped and legacy flat names work — scoped always
        wins:
      </p>
      <CodeBlock lang="bash">{`# .env — scoped names (preferred)
CORE__API_V1_STR=/api/v2
CORE__BACKEND_CORS_ORIGINS=["http://localhost:3000"]
AUTH__ACCESS_TOKEN_EXPIRE_MINUTES=120
PAYMENTS__PAYMENT_GATEWAY=stripe

# legacy flat names still resolve through each module's flat_aliases
ACCESS_TOKEN_EXPIRE_MINUTES=90     # ignored because AUTH__ACCESS_TOKEN_EXPIRE_MINUTES is set

# a module setting can also be resolved programmatically:
python -c "from app.core.config import settings; print(settings.scope('CORE').API_V1_STR)"`}</CodeBlock>
      <p>
        Under the hood <C>get_scoped_or_flat_env(namespace, key)</C> tries{' '}
        <C>{'{NAMESPACE}__{KEY}'}</C> first, then the bare <C>{'{KEY}'}</C>, then the
        class default.
      </p>

      <H3>3. Resolve tenant/user/request tiers at runtime</H3>
      <p>
        <C>resolve_tiered()</C> folds runtime override layers on top of the validated
        settings instance and returns a new validated instance of the same type —
        nothing global is mutated:
      </p>
      <CodeBlock lang="python">{`from msflib.core.config import normalize_request_override

# tenant_config arrives pre-merged with workspace values by ScopedConfigService
resolved = settings.scope("AI_CORE").unwrap().resolve_tiered(
    tenant_config={"RATE_LIMIT_RPM": 30},          # tenant/workspace persisted tier
    user_config={"LLM_TEMPERATURE": 0.7},          # per-user persisted tier
    request_override=normalize_request_override(
        {"overrides": {"LLM_MODEL": "gpt-4o-mini"}}  # envelope or flat dict
    ),
)
resolved.RATE_LIMIT_RPM   # 30   (tenant beat the default)
resolved.LLM_MODEL        # "gpt-4o-mini" (request beat everything)`}</CodeBlock>
      <p>
        If the module defines a <C>request_override_allowlist</C>,{' '}
        <C>validate_request_override_allowlist()</C> rejects any key outside it before the
        merge — e.g. <C>LLM_API_KEY</C> can never be changed from a request.
      </p>
      <Warning title="Secrets and the request tier">
        Never put secrets into persisted tenant/workspace/user values. The allowlist is
        the only guard for the request tier, and it only protects keys that module
        authors listed — treat every persisted tier as operator-controlled input.
      </Warning>
    </>
  )
}
