import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiAuth() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-auth</C> (v0.2.1) provides JWT login, token revocation, password
        recovery and Google OAuth, plus the dependency factories other modules use for
        auth. Depends on: msflib, authlib, itsdangerous.
      </p>
      <p>
        Nothing is mounted automatically: the module exposes <B>router and dependency
        factories</B> that the host app calls once at startup, passing its own session
        dependency, keystore, account model and settings. That is why the same module
        serves both the plain account app and the workspace app — the workspace-aware
        dependency set simply adds a <C>WorkspaceResolver</C> strategy (path parameter or
        HTTP header) on top of the same JWT validation.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Email/password login with revocable tokens</B> — issued JWTs are checked
          against the keystore blacklist, and <C>DELETE /logout</C> revokes them.
        </li>
        <li>
          <B>Password recovery out of the box</B> — short numeric codes stored in the
          keystore plus signed reset tokens, with a Jinja2 reset email.
        </li>
        <li>
          <B>Google OAuth</B> as an opt-in sign-in/sign-up path ({' '}
          <C>ENABLE_GOOGLE_OAUTH</C>, <C>ALLOW_GOOGLE_OAUTH_SIGNUP</C>).
        </li>
        <li>
          <B>Reusable auth guards</B> — <C>get_current_account</C>, superuser checks and{' '}
          <C>RoleCheck</C> you can attach to any endpoint you write yourself.
        </li>
      </ul>

      <H2>Settings (namespace AUTH)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[
          [<C>ACCESS_TOKEN_EXPIRE_MINUTES</C>, 'JWT lifetime'],
          [<C>EMAIL_RESET_TOKEN_EXPIRE_HOURS</C>, 'Password-reset token lifetime'],
          [<C>PASSWORD_RESET_PATH</C>, 'Frontend reset path used in emails'],
          [<C>ENABLE_GOOGLE_OAUTH / ALLOW_GOOGLE_OAUTH_SIGNUP</C>, 'Feature switches'],
          [<C>GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_REDIRECT_URI</C>, 'OAuth app config'],
        ]}
      />

      <H2>Endpoints</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['POST', <C>/login</C>, 'Email/password login → JWT'],
          ['GET', <C>/google/login</C>, 'Google OAuth redirect (if enabled)'],
          ['POST', <C>/google/callback</C>, 'Google OAuth callback'],
          ['POST', <C>/password-recovery</C>, 'Send recovery email'],
          ['POST', <C>/verify-token</C>, 'Verify password-reset token'],
          ['POST', <C>/reset-password</C>, 'Reset with token'],
          ['DELETE', <C>/logout</C>, 'Revoke access token'],
        ]}
      />

      <H2>Key schemas</H2>
      <ul>
        <li>
          <C>Token</C> — <C>access_token</C>, <C>expires</C>, <C>token_type</C>, plus
          embedded <C>account</C> / <C>user</C>
        </li>
        <li>
          <C>GoogleUserInfo</C> — <C>id</C>, <C>email</C>, <C>name</C>, <C>given_name</C>,{' '}
          <C>family_name</C>, <C>verified_email</C>, <C>picture</C>, <C>auth_payload</C>
        </li>
      </ul>

      <H2>Dependency factories</H2>
      <CodeBlock lang="python">{`from msflib_auth.deps import get_account_dependencies, get_user_dependencies

account_deps = get_account_dependencies()
# get_current_account, get_current_account_or_none,
# get_current_active_account, get_current_active_superuser, RoleCheck

user_deps = get_user_dependencies()
# adds workspace-aware: get_current_workspace, get_current_workspace_anonymous,
# get_current_user, get_current_active_user, WorkspaceRoleCheck`}</CodeBlock>
      <p>
        Workspace resolution supports two strategies (<C>WorkspaceResolver</C> protocol):{' '}
        <C>PathParameterResolver</C> (default) and <C>HttpHeaderResolver</C> — matching the
        React decorators' <C>path</C> / <C>header</C> tenancy strategies.
      </p>

      <H2>Examples</H2>

      <H3>1. Mount the auth router</H3>
      <p>
        The router is a factory: give it your session and keystore dependencies, your
        concrete <C>Account</C> model and read schema, the app settings and the auth
        dependency namespace, and it returns an <C>APIRouter</C>. This mirrors{' '}
        <C>testsite/app/api/api.py</C>:
      </p>
      <CodeBlock lang="python">{`# app/api/deps.py — build the dependency namespaces once
from msflib.api.deps import get_keystore_factory, get_session_factory
from msflib.auth.deps import get_account_dependencies
from app import models
from app.core.config import settings

auth_deps = get_account_dependencies(
    AccountModel=models.Account,
    oauth_token_url=f"{settings.scope('CORE').API_V1_STR}/login",
    secret_key=settings.scope("CORE").SECRET_KEY,
    active_statuses=[models.AccountStatus.active, models.AccountStatus.online],
    session_dep=get_session_factory,
    keystore_dep=get_keystore_factory,
)`}</CodeBlock>
      <CodeBlock lang="python">{`# app/api/api.py — mount the router
from msflib.auth.router import router as create_auth_router
from msflib.auth.models import Token
from app.api.deps import auth_deps

auth_router = create_auth_router(
    get_session=get_session_factory,
    get_keystore=get_keystore_factory,
    get_current_account=auth_deps.get_current_account,
    account_type=models.Account,
    account_read_type=models.AccountRead,
    settings=settings,
    active_statuses=[models.AccountStatus.active, models.AccountStatus.online],
    prefix="",
    tags=["auth"],
    access_token_response_type=Token,
)

api_router.include_router(auth_router)`}</CodeBlock>
      <Note>
        Login expects <C>application/x-www-form-urlencoded</C> fields (<C>username</C> is
        the email) because the router binds FastAPI's OAuth2 password form.
      </Note>

      <H3>2. Login, call a protected endpoint, log out</H3>
      <p>
        The full request flow with curl against the reference app (mounted under{' '}
        <C>/api/v1</C>): authenticate, reuse the bearer token, then revoke it — after
        logout the same token is rejected with 401 because it is blacklisted in the
        keystore:
      </p>
      <CodeBlock lang="bash">{`# 1) log in (form fields, username = email)
curl -s -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=password"
# → {"access_token": "eyJhbGciOi...", "expires": "...", "token_type": "bearer",
#    "account": {"id": 1, "email": "admin@example.com", ...}}

# 2) use the token
TOKEN="eyJhbGciOi..."
curl -s http://localhost:8000/api/v1/account/me \
  -H "Authorization: Bearer $TOKEN"

# 3) revoke the token
curl -s -X DELETE http://localhost:8000/api/v1/logout \
  -H "Authorization: Bearer $TOKEN"

# 4) the revoked token no longer works
curl -s http://localhost:8000/api/v1/account/me -H "Authorization: Bearer $TOKEN"
# → {"detail": "Token expired"}`}</CodeBlock>

      <H3>3. Recover a forgotten password</H3>
      <p>
        Recovery issues a short numeric code (stored in the keystore) and a longer signed
        token by email. Short codes can be exchanged by passing the email alongside;
        the full token works alone:
      </p>
      <CodeBlock lang="bash">{`# request a reset email
curl -s -X POST http://localhost:8000/api/v1/password-recovery \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'
# → {"msg": "Password recovery email sent"}

# verify the token from the email (short code + email, or the full token)
curl -s -X POST http://localhost:8000/api/v1/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token": "123456", "email": "admin@example.com"}'

# set the new password
curl -s -X POST http://localhost:8000/api/v1/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "<full-reset-token>", "new_password": "n3w-secret"}'`}</CodeBlock>
      <p>
        Customize delivery (e.g. hand the email to a queue or the notifications module)
        with the <C>send_reset_pwd_email_override</C> factory argument.
      </p>

      <H3>4. Guard your own endpoints with the dependency namespace</H3>
      <p>
        The dependencies are plain FastAPI callables, so they protect endpoints you write
        yourself exactly like module-provided ones. For workspace apps, build the{' '}
        <C>user_deps</C> namespace with a resolver and use <C>WorkspaceRoleCheck</C>:
      </p>
      <CodeBlock lang="python">{`from fastapi import Depends
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


@app.get("/api/v1/{workspace_slug}/reports", tags=["reports"])
def workspace_report(user=Depends(user_deps.get_current_active_user)):
    return {"workspace_id": user.workspace_id, "type": user.type}


@app.get("/api/v1/{workspace_slug}/settings", tags=["reports"])
def workspace_settings(
    _=Depends(user_deps.WorkspaceRoleCheck(["owner", "admin"])),
):
    return {"ok": True}`}</CodeBlock>
      <Note>
        Switch to <C>HttpHeaderResolver(header_name="X-Workspace")</C> to resolve the
        workspace from a header instead of the URL path — endpoint code stays identical.
      </Note>
    </>
  )
}
