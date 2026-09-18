import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiAccount() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-account</C> (v0.2.1) covers account/profile lifecycle, open registration
        and admin management. Depends on: msflib.
      </p>
      <p>
        The module is intentionally split into three router factories —{' '}
        <C>account_router</C>, <C>account_admin_router</C> and <C>profile_router</C> — so
        the host app mounts exactly what it needs and passes its own auth dependency, role
        guard, models and actions. Accounts carry identity (username, email, phone,{' '}
        <C>hashed_password</C>, status, role) while profiles carry presentation data
        (names, avatar, date of birth); creating an account can create the nested profile
        in the same call.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Open or admin-gated registration</B> — a single configurable sign-up path
          controlled by <C>USERS_OPEN_REGISTRATION</C>, plus admin-only account creation.
        </li>
        <li>
          <B>Self-service account + profile editing</B> — <C>/account/me</C> and{' '}
          <C>/profiles/</C> with password-change confirmation and uniqueness checks.
        </li>
        <li>
          <B>Availability checks</B> — <C>/account/verify-availability</C> for signup-form
          UX on email/username/phone.
        </li>
        <li>
          <B>Lifecycle events</B> — account and profile events on the shared event bus
          (e.g. to trigger welcome emails or workspace bootstrap).
        </li>
      </ul>

      <H2>Settings (namespace ACCOUNT)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[
          [<C>USERS_OPEN_REGISTRATION</C>, 'Enable public sign-up'],
          [<C>OPEN_REGISTRATION_PATH</C>, 'The single configurable sign-up path'],
          [<C>FIRST_SUPERUSER / FIRST_SUPERUSER_PASSWORD</C>, 'Bootstrap superuser'],
          [<C>EMAIL_TEST_ACCOUNT</C>, 'Redirect test emails'],
        ]}
      />

      <H2>Endpoints</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['GET', <C>/account/me</C>, 'Current authenticated account'],
          ['POST', <C>/account/&#123;open_registration_path&#125;</C>, 'Open registration'],
          ['PUT', <C>/account/me</C>, 'Update own account'],
          ['POST', <C>/account/verify-availability</C>, 'Check email/username/phone uniqueness'],
          ['GET / POST', <C>/admin/accounts/</C>, 'List / create accounts (admin)'],
          ['GET / PUT', <C>/admin/accounts/&#123;id&#125;</C>, 'Read / update account (admin)'],
          ['GET', <C>/profiles/</C>, 'Current profile'],
          ['GET', <C>/profiles/&#123;account_id&#125;</C>, 'Profile by account ID'],
          ['POST', <C>/profiles/</C>, 'Create/update profile'],
          ['PUT', <C>/profiles/avatar</C>, 'Upload avatar'],
          ['PUT', <C>/profiles/&#123;id&#125;</C>, 'Update profile by ID'],
        ]}
      />

      <H2>Key schemas</H2>
      <ul>
        <li>
          <C>AccountBase</C> — <C>username</C>, <C>email</C>, <C>phone</C>, <C>status</C>,{' '}
          <C>role</C>, <C>data</C>
        </li>
        <li>
          <C>AccountCreate</C> — extends public create with <C>status</C>, <C>role</C>,
          nested <C>profile</C>
        </li>
        <li>
          <C>AccountUpdate</C> — <C>username</C>, <C>email</C>, <C>phone</C>,{' '}
          <C>current_password</C>, <C>new_password</C>, <C>data</C>
        </li>
        <li>
          <C>ProfileBase</C> — <C>first_name</C>, <C>last_name</C>, <C>date_of_birth</C>,{' '}
          <C>gender</C>, <C>marital_status</C>, <C>avatar</C>
        </li>
      </ul>

      <H2>Services &amp; events</H2>
      <p>
        <C>AccountAction</C> and <C>ProfileAction</C> subclass <C>ModelAction</C>.
        Highlights:
      </p>
      <ul>
        <li>
          <C>AccountAction.create()</C> hashes the password via a decorator callback and
          can create the nested profile in one go; <C>authenticate()</C>,{' '}
          <C>ensure_unique_fields()</C>, <C>get_conflicting_unique_field()</C> support
          registration flows.
        </li>
        <li>
          Events emitted: <C>account-pre-create</C>, <C>account-created-pre-email</C>,{' '}
          <C>account-created</C>, <C>account-pre-update</C>, <C>account-updated</C>,{' '}
          <C>profile-updated</C>, <C>profile-avatar-pre-update</C>,{' '}
          <C>profile-avatar-updated</C>.
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. Compose the settings and models</H3>
      <p>
        The host app decides what an account looks like: it subclasses the module's
        bases to add project-specific columns, and composes <C>AccountSettings</C> into
        its settings class:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py — mixin AccountSettings into the app settings
from msflib.core.config import SettingsBase, CoreSettings
from msflib.account.config import AccountSettings


class TestSiteSettings(AccountSettings, CoreSettings, SettingsBase):
    USERS_OPEN_REGISTRATION: bool = True
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "password"


# app/models/account.py — concrete models with your extra fields
from sqlmodel import Field, Relationship
from msflib.account.models import AccountBase, ProfileBase, ProfileRead, AccountRead as BaseAccountRead


class Account(AccountBase, table=True):
    tenant_id: Optional[str] = Field(default=None, index=True)
    profile: Optional["Profile"] = Relationship(
        sa_relationship_kwargs={"uselist": False}, back_populates="account"
    )


class AccountRead(BaseAccountRead):
    profile: Optional[ProfileRead] = None


class Profile(ProfileBase, table=True):
    certifications: Optional[str] = Field(default=None)
    account: Optional[Account] = Relationship(back_populates="profile")`}</CodeBlock>
      <Note>
        Bootstrap the first superuser with <C>init_db</C> in <C>app/db/init_db.py</C>: it
        creates <C>FIRST_SUPERUSER</C> with <C>AccountStatus.active</C> and{' '}
        <C>AccountRole.admin</C> when missing.
      </Note>

      <H3>2. Wire the routers and open registration</H3>
      <p>
        Mount the three routers with your auth dependency and actions. Passing your own{' '}
        <C>actions.aa</C>/<C>actions.pa</C> keeps a single action instance shared with
        seeders and event hooks:
      </p>
      <CodeBlock lang="python">{`# app/api/api.py
from msflib.account.router import (
    account_router as create_account_router,
    account_admin_router as create_admin_account_router,
    profile_router as create_profile_router,
)
from app.api.deps import auth_deps

account_router = create_account_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    settings=settings,
    account_type=models.Account,
    account_read_type=models.AccountRead,
    profile_type=models.Profile,
    account_action=actions.aa,
    profile_action=actions.pa,
    prefix="",
    tags=["accounts"],
)
admin_account_router = create_admin_account_router(
    get_session=get_session_factory,
    role_check=auth_deps.RoleCheck,
    settings=settings,
    account_type=models.Account,
    account_read_type=models.AccountRead,
    profile_type=models.Profile,
    prefix="/admin/accounts",
    tags=["admin_accounts"],
)
profile_router = create_profile_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    get_current_active_account=auth_deps.get_current_active_account,
    settings=settings,
    profile_type=models.Profile,
    account_type=models.Account,
    profile_read_type=models.ProfileRead,
    prefix="/profiles",
    tags=["profiles"],
)

api_router.include_router(account_router)
api_router.include_router(admin_account_router)
api_router.include_router(profile_router)`}</CodeBlock>

      <H3>3. Register, check availability and update profile (curl flow)</H3>
      <p>
        The realistic signup-to-profile flow against the testsite under{' '}
        <C>/api/v1</C> — open registration accepts the public create schema (email,
        username, password, optional nested <C>profile</C>):
      </p>
      <CodeBlock lang="bash">{`# 1) open registration (path from ACCOUNT.OPEN_REGISTRATION_PATH, default /open)
curl -s -X POST http://localhost:8000/api/v1/account/open \
  -H "Content-Type: application/json" \
  -d '{"email": "ada@example.com", "username": "ada", "password": "s3cret",
       "profile": {"first_name": "Ada", "last_name": "Lovelace"}}' -o /dev/null -w "%{http_code}\\n"
# → 201

# 2) availability check before suggesting the username in your UI
curl -s -X POST http://localhost:8000/api/v1/account/verify-availability \
  -H "Content-Type: application/json" \
  -d '{"field": "email", "value": "ada@example.com"}'
# → 422 {"detail": "An account with this email already exists in the system"}

# 3) log in (auth module) and update the profile
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/login \
  -d "username=ada@example.com&password=s3cret" | jq -r .access_token)

curl -s -X PUT http://localhost:8000/api/v1/profiles/ \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"first_name": "Ada", "last_name": "King"}'`}</CodeBlock>

      <H3>4. React to account events and extend the action</H3>
      <p>
        The eventbus is where side effects live. Register listeners at startup, or
        subclass <C>AccountAction</C> for domain rules that belong in the model layer:
      </p>
      <CodeBlock lang="python">{`from msflib.eventbus import listen
from msflib.account.actions import AccountAction


@listen("account-created")
def queue_welcome_email(account, options, logger=None):
    logger.info("Send welcome to %s", account.email)   # or dispatch to a queue


@listen("profile-avatar-updated")
def invalidate_avatar_cache(profile, options, logger=None):
    ...


class TenantAccountAction(AccountAction[Account, AccountCreate, AccountUpdate]):
    # e.g. enforce tenant-scoped uniqueness on top of the built-in checks
    DEFAULT_UNIQUE_FIELDS = ("email", "username", "phone", "tenant_id")`}</CodeBlock>
      <Note>
        Registration and account creation emit <C>account-created</C> through the
        routers; the low-level <C>ModelAction</C> lifecycle events (
        <C>account-create-pre-commit</C>) are what other modules (workspaces) hook to run
        inside the same transaction.
      </Note>
    </>
  )
}
