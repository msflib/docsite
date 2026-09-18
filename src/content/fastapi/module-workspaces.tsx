import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiWorkspaces() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-workspaces</C> (v0.2.0) implements the multi-tenant backbone: workspace
        CRUD, membership management, workspace-scoped profile routes and user switching.
        Depends on: msflib, msflib-account.
      </p>
      <p>
        The module adds two entities to the account world: <C>Workspace</C> (with{' '}
        <C>owner_id</C>, unique <C>slug</C>, status, settings) and <C>User</C> — the
        membership row tying an <C>account_id</C> to a <C>workspace_id</C> with a{' '}
        <C>type</C> (owner/admin/member/guest). Requests identify the active workspace
        through the auth module's <C>WorkspaceResolver</C> (path slug like{' '}
        <C>{'{workspace_slug}'}</C> or a header), and every workspace-scoped route
        verifies membership before doing anything. On the service side,{' '}
        <C>WorkspaceAction</C> handles slug uniqueness and default-workspace bootstrap
        while <C>UserAction</C> resolves membership types through a four-tier priority
        chain.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Team/organization spaces</B> — one account owning or joining many
          workspaces, each with its own members and profiles.
        </li>
        <li>
          <B>Automatic bootstrap</B> — a default workspace + owner membership created in
          the same transaction as every new account (event hook).
        </li>
        <li>
          <B>Workspace-scoped profile data</B> — <C>{'{workspace_slug}'}</C>
          -prefixed profile routes that mirror <C>/profiles</C> but enforce membership.
        </li>
        <li>
          <B>Active-workspace switching</B> — <C>POST /users/switch</C> moves{' '}
          <C>current_workspace_id</C> so header- or <C>current</C>-based resolution works
          for the session.
        </li>
      </ul>

      <H2>Settings (namespace WORKSPACES)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[
          [<C>ENABLE_MULTI_WORKSPACE</C>, 'Multiple workspaces per account'],
          [<C>ALLOW_WORKSPACE_REGISTRATION</C>, 'Public workspace creation'],
          [<C>MAX_WORKSPACES_PER_ACCOUNT</C>, 'Quota'],
          [<C>AUTO_CREATE_DEFAULT_WORKSPACE / DEFAULT_WORKSPACE_NAME</C>, 'Bootstrap behavior'],
          [<C>ENABLE_USERINFO_COLLECTION / USERINFO_TABLE_NAME</C>, 'Optional user-info survey'],
        ]}
      />

      <H2>Endpoints</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['GET / POST', <C>/workspaces/</C>, 'List owned / create (admin)'],
          ['GET', <C>/workspaces/available</C>, <>Workspaces the account can join (workspace-<B>unscoped</B> exception)</>],
          ['GET / PUT / DELETE', <C>/workspaces/&#123;id&#125;</C>, 'Read / update / delete'],
          ['GET / POST', <C>/&#123;workspace_slug&#125;/profiles/</C>, 'Profiles scoped to a workspace'],
          ['GET', <C>/&#123;workspace_slug&#125;/profiles/&#123;account_id&#125;</C>, 'One profile in workspace'],
          ['PUT', <C>/&#123;workspace_slug&#125;/profiles/avatar</C>, 'Workspace-scoped avatar'],
          ['GET', <C>/users/me</C>, 'Current workspace user'],
          ['GET', <C>/users/&#123;user_id&#125;</C>, 'Workspace user'],
          ['POST', <C>/users/join</C>, 'Join workspace (with membership type)'],
          ['POST', <C>/users/switch</C>, 'Switch active workspace'],
        ]}
      />

      <H2>Key models &amp; enums</H2>
      <ul>
        <li>
          <C>WorkspaceBase</C> — <C>name</C>, <C>slug</C>, <C>description</C>,{' '}
          <C>logo_url</C>, <C>owner_id</C>, <C>is_default</C>, <C>status</C>,{' '}
          <C>settings</C>, <C>data</C>
        </li>
        <li>
          <C>UserBase</C> — <C>account_id</C>, <C>workspace_id</C>, <C>type</C>,{' '}
          <C>status</C>, <C>display_name</C>, <C>avatar_url</C>, <C>bio</C>, <C>data</C>
        </li>
        <li>
          <C>UserType</C> — <C>owner</C>, <C>admin</C>, <C>member</C>, <C>guest</C>;{' '}
          <C>UserStatus</C> — active/inactive/suspended
        </li>
        <li>
          <C>WorkspaceStatus</C> — <C>open</C>, <C>closed</C>, <C>archived</C>
        </li>
        <li>
          <C>UserInfoBase</C> — <C>employment_status</C>, <C>qualification</C>,{' '}
          <C>information_source</C>, <C>survey_data</C>
        </li>
      </ul>

      <H2>Services &amp; hooks</H2>
      <ul>
        <li>
          <C>WorkspaceAction</C> — slug generation with uniqueness via incrementing
          suffix.
        </li>
        <li>
          <C>UserAction</C> — membership creation with a <C>MembershipTypeResolver</C>{' '}
          priority chain: per-call arg → constructor-injected callable → subclass override
          → built-in enum introspection.
        </li>
        <li>
          <C>register_hooks()</C> wires an eventbus listener on{' '}
          <C>account-create-pre-commit</C> that auto-creates the default workspace when a
          new account is created (when enabled).
        </li>
      </ul>

      <H2>Examples</H2>

      <H3>1. Enable the module in settings and models</H3>
      <p>
        Mix <C>WorkspaceSettings</C> into the app settings, then subclass the module
        bases for your concrete tables — exactly what the workspace-enabled testsuite
        does:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py
from msflib.core.config import SettingsBase, CoreSettings
from msflib.account.config import AccountSettings
from msflib.workspaces.config import WorkspaceSettings


class WorkspaceTestSettings(WorkspaceSettings, AccountSettings, CoreSettings, SettingsBase):
    AUTO_CREATE_DEFAULT_WORKSPACE: bool = True
    DEFAULT_WORKSPACE_NAME: str = "Default Workspace"
    MAX_WORKSPACES_PER_ACCOUNT: int = 10


# app/models/workspace.py — concrete tables
from sqlmodel import Field, Relationship
from msflib.workspaces.models import (
    WorkspaceBase, UserBase, WorkspaceCreate, WorkspaceUpdate, UserCreate, UserUpdate,
)


class Workspace(WorkspaceBase, table=True):
    users: list["WorkspaceUser"] = Relationship(back_populates="workspace")


class WorkspaceUser(UserBase, table=True):
    workspace: Workspace = Relationship(back_populates="users")`}</CodeBlock>
      <Note>
        Because module routers are factories, also declare your action instances once
        (<C>WorkspaceAction[Workspace, WorkspaceCreate, WorkspaceUpdate](settings=settings)</C>,
        <C>UserAction[WorkspaceUser, UserCreate, UserUpdate]()</C>) and reuse them in
        routers and event hooks.
      </Note>

      <H3>2. Mount the routers and register bootstrap hooks</H3>
      <p>
        The workspace router needs both account dependencies (it is admin-gated), the
        workspace-scoped routers need the user dependency namespace, and{' '}
        <C>register_hooks()</C> opts into the account-creation flow:
      </p>
      <CodeBlock lang="python">{`from msflib.workspaces.router import (
    router as workspaces_router,
    user_profile_router,
    user_me_router,
    user_workspace_router,
)
from msflib.workspaces.eventbus import register_hooks
from msflib.auth.deps import get_user_dependencies
from msflib.auth.resolvers import PathParameterResolver
from app.api.deps import auth_deps

user_deps = get_user_dependencies(
    UserModel=models.WorkspaceUser,
    WorkspaceModel=models.Workspace,
    session_dep=get_session_factory,
    account_dependencies=auth_deps,
    workspace_resolver=PathParameterResolver(),   # /{workspace_slug}/... paths
)

api_router.include_router(workspaces_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    get_current_account_or_none=auth_deps.get_current_account_or_none,
    role_check=auth_deps.RoleCheck,
    settings=settings,
    workspace_action=wa,
    user_action=ua,
    prefix="/workspaces",
    tags=["workspaces"],
))

# workspace-scoped profile + user routes (see module README for full signatures)
api_router.include_router(user_profile_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    get_current_active_account=auth_deps.get_current_active_account,
    get_current_workspace=user_deps.get_current_workspace,
    settings=settings,
    profile_type=models.Profile,
    account_type=models.Account,
    user_type=models.WorkspaceUser,
    tags=["profiles"],
))
api_router.include_router(user_workspace_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    get_current_active_account=auth_deps.get_current_active_account,
    settings=settings,
    workspace_type=models.Workspace,
    user_type=models.WorkspaceUser,
    tags=["users"],
))

# auto-create a default workspace on account-create-pre-commit
register_hooks(workspace_action=wa, user_action=ua, account_action=actions.aa)`}</CodeBlock>

      <H3>3. Create a workspace, join, switch (curl flow)</H3>
      <p>
        Workspace creation is <C>multipart/form-data</C> (optional logo upload) and is
        admin-gated; join and switch are JSON. The switch response returns the{' '}
        <C>workspace_slug</C> you then use in scoped paths:
      </p>
      <CodeBlock lang="bash">{`# 1) create a workspace (as an admin account)
curl -s -X POST http://localhost:8000/api/v1/workspaces/ \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -F "name=Acme Rockets" -F "description=Rocket science" \\
  -F "status=open"
# → {"id": 2, "name": "Acme Rockets", "slug": "acme-rockets", "owner_id": 1, ...}

# 2) discover joinable workspaces (open ones + memberships)
curl -s http://localhost:8000/api/v1/workspaces/available \\
  -H "Authorization: Bearer $USER_TOKEN"

# 3) join as a member (role requests are validated against allowed join roles)
curl -s -X POST http://localhost:8000/api/v1/users/join \\
  -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" \\
  -d '{"workspace_id": 2, "user_type": "member"}'

# 4) make it the active workspace
curl -s -X POST http://localhost:8000/api/v1/users/switch \\
  -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" \\
  -d '{"workspace_id": 2}'
# → {..., "workspace_slug": "acme-rockets"}

# 5) use the slug in scoped routes
curl -s http://localhost:8000/api/v1/acme-rockets/profiles/ \\
  -H "Authorization: Bearer $USER_TOKEN"`}</CodeBlock>

      <H3>4. Control membership types with a resolver</H3>
      <p>
        By default, callers cannot grant themselves elevated roles on public join —
        allowed join roles default to <C>member</C>. To apply your own policy when
        memberships are created programmatically, inject a{' '}
        <C>MembershipTypeResolver</C> into <C>UserAction</C> (priority 2 of 4) or
        override <C>resolve_membership_type()</C> in a subclass:
      </p>
      <CodeBlock lang="python">{`from msflib.workspaces.actions import UserAction, MembershipTypeResolver
from msflib.workspaces.models import UserType


def invite_only_resolver(account_id: int, workspace_id: int, owner_id: int) -> UserType:
    if account_id == owner_id:
        return UserType.owner
    return UserType.guest   # everything else starts as a guest


ua = UserAction[WorkspaceUser, UserCreate, UserUpdate](
    membership_type_resolver=invite_only_resolver,
)

# per-call override wins over the resolver (priority 1):
ua.create_membership(
    session, account_id=account.id, workspace_id=workspace.id,
    owner_id=workspace.owner_id, membership_type=UserType.admin,
)`}</CodeBlock>
      <Note>
        The workspace router also guards against reserved names:{' '}
        <C>get_forbidden_ws_names()</C> blocks slugs like <C>admin</C>, <C>accounts</C>,{' '}
        <C>workspaces</C> plus prefixes it finds in your API modules, so a workspace can
        never shadow your routes.
      </Note>
    </>
  )
}
