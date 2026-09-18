import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiWorkspaceNotifications() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-workspace-notifications</C> (v0.2.0) extends the notifications module
        with workspace-scoped delivery and first-class Discord channels. Depends on:
        msflib, msflib-workspaces, msflib-notifications. Optional extras:{' '}
        <C>[discord]</C>, <C>[email]</C>, <C>[sms]</C>, <C>[all]</C>.
      </p>
      <p>
        Instead of accounts, receivers are <B>workspace users</B>: a{' '}
        <C>UserNotification</C> row points at the membership (<C>receiver_id</C> →{' '}
        <C>User</C>), and every send is bound to a resolved workspace. Admins of that
        workspace register their Discord channels (name + <C>channel_id</C> stored per
        workspace), and <C>dispatch_user_notifications()</C> fans out in-app copies plus
        email/SMS/Discord delivery — the Discord handler reads{' '}
        <C>WS_NOTIFICATIONS.DISCORD_BOT_TOKEN</C> and posts to the channels registered
        for the workspace.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Per-workspace inboxes</B> — notifications addressed to memberships, so the
          same account can have separate inboxes in each workspace.
        </li>
        <li>
          <B>Discord fan-out</B> — workspace admins connect channels once; broadcasts
          post to them through a bot token from settings.
        </li>
        <li>
          <B>Workspace-scoped admin audit</B> — sent notifications are filtered by both{' '}
          <C>sender_id</C> and <C>workspace_id</C>.
        </li>
        <li>
          <B>Reuse of the base module</B> — the same <C>NotificationCreate</C> payload
          and channel enums, with workspace-aware resolution of receivers.
        </li>
      </ul>

      <H2>Settings (namespace WS_NOTIFICATIONS)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[[<C>DISCORD_BOT_TOKEN</C>, 'Bot token for Discord delivery']]}
      />

      <H2>Endpoints</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['GET', <C>/user/notifications/</C>, 'List user notifications'],
          ['GET', <C>/user/notifications/&#123;id&#125;</C>, 'Get one'],
          ['PATCH', <C>/user/notifications/&#123;id&#125;/mark</C>, 'Toggle read/unread'],
          ['PATCH', <C>/user/notifications/mark-all</C>, 'Mark all'],
          ['DELETE', <C>/user/notifications/&#123;id&#125;</C>, 'Delete'],
          ['POST', <C>/admin/notifications/send</C>, 'Send admin notification'],
          ['GET', <C>/admin/notifications/</C>, 'List sent'],
          ['DELETE', <C>/admin/notifications/&#123;id&#125;</C>, 'Delete sent'],
          ['POST', <C>/admin/discord/channel</C>, 'Save Discord channel'],
          ['GET', <C>/admin/discord/channel</C>, 'List Discord channels'],
          ['PUT / DELETE', <C>/admin/discord/channel/&#123;id&#125;</C>, 'Update / delete channel'],
        ]}
      />
      <Note>
        The admin notification and Discord routers default to prefixes{' '}
        <C>/admin/notification</C> and <C>/admin/discord</C>; the paths above are what
        you get when the host app mounts them as <C>/admin/notifications</C>. All of them
        require a workspace-admin <C>admin_role_check</C> and resolve the workspace
        through <C>get_current_workspace</C>.
      </Note>

      <H2>Models</H2>
      <ul>
        <li>
          <C>UserNotification</C> — <C>receiver_id</C> (→ workspace user),{' '}
          <C>notification_id</C>, <C>is_read</C>
        </li>
        <li>
          <C>DiscordChannel</C> — <C>name</C>, <C>channel_id</C>, <C>admin_id</C>,{' '}
          <C>workspace_id</C>
        </li>
      </ul>

      <Note>
        As with the base notifications module, the README describes this as a "starter
        scaffold" — the implementation is real; the README is outdated boilerplate.
      </Note>

      <H2>Examples</H2>

      <H3>1. Compose settings and mount the routers</H3>
      <p>
        The module needs workspaces on top of the notification stack. Mount the three
        routers — user inbox, workspace-admin send, and Discord channel management —
        with the workspace-aware dependencies:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py — WS_NOTIFICATIONS rides along with WORKSPACES
from msflib.core.config import SettingsBase, CoreSettings
from msflib.account.config import AccountSettings
from msflib.workspaces.config import WorkspaceSettings
from msflib.workspace_notifications.config import WsNotificationSettings


class AppSettings(WsNotificationSettings, WorkspaceSettings, AccountSettings, CoreSettings, SettingsBase):
    DISCORD_BOT_TOKEN: str = ""   # set in prod via WS_NOTIFICATIONS__DISCORD_BOT_TOKEN`}</CodeBlock>
      <CodeBlock lang="python">{`# app/api/api.py
from msflib.workspace_notifications.router import (
    user_notification_router,
    admin_user_notification_router,
    admin_discord_channel_router,
)
from app.api.deps import user_deps

api_router.include_router(user_notification_router(
    get_session=get_session_factory,
    get_current_user=user_deps.get_current_user,
    get_current_workspace=user_deps.get_current_workspace,
    prefix="/user/notifications",
    tags=["workspace_notifications"],
))
api_router.include_router(admin_user_notification_router(
    get_session=get_session_factory,
    get_current_user=user_deps.get_current_user,
    get_current_workspace=user_deps.get_current_workspace,
    admin_role_check=user_deps.WorkspaceRoleCheck(["owner", "admin"]),
    settings=settings,
    prefix="/admin/notifications",
    tags=["workspace_notifications/admin"],
))
api_router.include_router(admin_discord_channel_router(
    get_session=get_session_factory,
    get_current_user=user_deps.get_current_user,
    get_current_workspace=user_deps.get_current_workspace,
    admin_role_check=user_deps.WorkspaceRoleCheck(["owner", "admin"]),
    prefix="/admin/discord",
    tags=["workspace_notifications/discord"],
))`}</CodeBlock>

      <H3>2. Register a Discord channel and broadcast (curl flow)</H3>
      <p>
        A workspace admin connects a Discord channel, then sends a broadcast to selected
        members (or everyone in the workspace when <C>user_receiver_ids</C> is omitted).
        In-app copies are required — a send without the <C>inapp</C> channel is rejected
        with 400:
      </p>
      <CodeBlock lang="bash">{`# 1) connect a Discord channel to the workspace
curl -s -X POST http://localhost:8000/api/v1/acme-rockets/admin/discord/channel \\
  -H "Authorization: Bearer $WS_ADMIN_TOKEN" -H "Content-Type: application/json" \\
  -d '{"name": "acme-announcements", "channel_id": 123456789012345678}'
# → 201 {"id": 1, "name": "acme-announcements", "channel_id": 123456789012345678, ...}

# 2) broadcast to the workspace (inapp is mandatory, email/sms/discord optional)
curl -s -X POST http://localhost:8000/api/v1/acme-rockets/admin/notifications/send \\
  -H "Authorization: Bearer $WS_ADMIN_TOKEN" -H "Content-Type: application/json" \\
  -d '{"title": "Sprint kickoff",
       "message": "Sprint 42 starts Monday at 10:00.",
       "channels": ["inapp", "discord", "email"]}'

# 3) a member reads their workspace inbox
curl -s http://localhost:8000/api/v1/acme-rockets/user/notifications/ \\
  -H "Authorization: Bearer $MEMBER_TOKEN"

# 4) mark everything read
curl -s -X PATCH http://localhost:8000/api/v1/acme-rockets/user/notifications/mark-all \\
  -H "Authorization: Bearer $MEMBER_TOKEN"`}</CodeBlock>

      <H3>3. Dispatch programmatically to a workspace</H3>
      <p>
        <C>dispatch_user_notifications()</C> mirrors the account dispatcher but is
        workspace-bound and works on <C>UserBase</C> receivers — useful inside your own
        services (task assignment, mentions):
      </p>
      <CodeBlock lang="python">{`from msflib.notifications.models import (
    NotificationChannel, NotificationCreate, NotificationType,
)
from msflib.workspace_notifications.service.notification import dispatch_user_notifications

notification = dispatch_user_notifications(
    session=session,
    settings=settings,
    data=NotificationCreate(
        title="Task assigned",
        message="ACME-312 was assigned to you.",
        channels=[NotificationChannel.inapp],
    ),
    n_type=NotificationType.system,
    workspace=workspace,
    receivers=[membership],        # workspace users to notify
    sender=current_admin_user,     # optional
)
# dispatch_user_notifications returns None if no in-app copy was requested —
# check the result before relying on the notification id`}</CodeBlock>

      <H3>4. Drive Discord with the notifier service</H3>
      <p>
        The Discord side is a small <C>discord.py</C> client wrapper. If you need custom
        behavior (announcing scheduled jobs, for instance), build the notifier directly —
        it only activates when a bot token is configured:
      </p>
      <CodeBlock lang="python">{`from msflib.workspace_notifications.service.discord import create_discord_notifier

notifier = create_discord_notifier(settings)   # None without DISCORD_BOT_TOKEN
if notifier is not None:
    notifier.set_channel_ids([123456789012345678])   # channels registered by admins
    notifier.run_in_background()                     # starts the bot in a thread
    notifier.send_message("Deploy finished", sender_uname="ci-bot")`}</CodeBlock>
      <Note>
        Discord channel rows are unique by <C>name</C> and by <C>channel_id</C> —
        registering the same channel twice, in any workspace, fails with 422.
      </Note>
    </>
  )
}
