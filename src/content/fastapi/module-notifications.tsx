import { A, B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiNotifications() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-notifications</C> (v0.2.0) dispatches account notifications across
        in-app, email and SMS channels, with a user inbox and an admin broadcast API.
        Depends on: msflib, msflib-account. Optional extras: <C>[email]</C>, <C>[sms]</C>,{' '}
        <C>[all]</C>.
      </p>
      <p>
        Two routers cover the two sides of the product: the account inbox router (list,
        read, mark, delete your notifications) and the admin router (send to selected
        accounts or all of them, then audit what was sent). Sending goes through{' '}
        <C>dispatch_account_notifications()</C>, which persists a <C>Notification</C> plus
        one <C>AccountNotification</C> row per receiver (the in-app copy) and then pushes
        the same content through a channel handler factory — Jinja2-templated email and
        Twilio SMS. The same function is what you call programmatically from your own
        business flows.
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>A user inbox</B> — per-account notifications with read/unread state and
          pagination, no extra storage design needed.
        </li>
        <li>
          <B>Admin broadcasts</B> — target specific <C>account_receiver_ids</C> or all
          accounts, restricted to admin/root roles.
        </li>
        <li>
          <B>Multi-channel fan-out</B> — declare channels per notification
          (<C>inapp</C>, <C>email</C>, <C>sms</C>) and let the dispatcher handle delivery.
        </li>
        <li>
          <B>System notifications from code</B> — call{' '}
          <C>dispatch_account_notifications()</C> from your services or event listeners.
        </li>
      </ul>

      <H2>Settings (namespace NOTIFICATIONS)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[
          [<C>DASHBOARD_PATH</C>, 'Frontend link embedded in notifications'],
          [<C>SYSTEM_NOTIFICATION_CHANNELS</C>, 'Channels used for system notifications'],
          [<C>SYS_NOTI_CHANNELS_WITHOUT_DISCORD</C>, 'Same, minus Discord'],
        ]}
      />

      <H2>Endpoints</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['GET', <C>/notifications/</C>, 'List account notifications'],
          ['GET', <C>/notifications/&#123;id&#125;</C>, 'Get one'],
          ['PATCH', <C>/notifications/&#123;id&#125;/mark</C>, 'Toggle read/unread'],
          ['PATCH', <C>/notifications/mark-all</C>, 'Mark all read/unread'],
          ['DELETE', <C>/notifications/&#123;id&#125;</C>, 'Delete notification'],
          ['POST', <C>/admin/notifications/</C>, 'Send admin notification'],
          ['GET', <C>/admin/notifications/all</C>, 'List sent'],
          ['GET / DELETE', <C>/admin/notifications/&#123;id&#125;</C>, 'Read / delete sent'],
        ]}
      />

      <H2>Models</H2>
      <ul>
        <li>
          <C>Notification</C> — <C>title</C>, <C>message</C>, <C>channels</C>,{' '}
          <C>workspace_id</C>, <C>sender_id</C>, <C>notification_type</C>
        </li>
        <li>
          <C>AccountNotification</C> — <C>receiver_id</C>, <C>notification_id</C>,{' '}
          <C>is_read</C>
        </li>
        <li>
          <C>NotificationChannel</C> — <C>inapp</C>, <C>push</C>, <C>email</C>, <C>sms</C>,{' '}
          <C>discord</C>
        </li>
        <li>
          <C>NotificationType</C> — <C>system</C>, <C>admin</C>
        </li>
      </ul>

      <H2>Dispatch services</H2>
      <ul>
        <li>
          <C>NotificationDispatcher</C> protocol + <C>NotificationHandlerFactory</C>{' '}
          providing <C>_sms_handler</C> (Twilio) and <C>_email_handler</C> (Jinja2 +
          emails).
        </li>
        <li>
          <C>dispatch_account_notifications()</C> orchestrates multi-channel delivery.
        </li>
      </ul>

      <Note>
        <C>discord</C> and <C>push</C> channels exist in the enum but have no built-in
        handlers in this module — workspace Discord delivery lives in{' '}
        <A to="/fastapi/module-workspace-notifications">workspace-notifications</A>.
      </Note>

      <H2>Examples</H2>

      <H3>1. Mount the inbox and admin routers</H3>
      <p>
        The inbox router only needs the session and auth dependency; the admin router
        additionally takes the role guard and app settings (for the email/SMS handlers).
        Defaults produce the paths in the table above:
      </p>
      <CodeBlock lang="python">{`from msflib.notifications.router import (
    account_notification_router,
    admin_account_notification_router,
)
from app.api.deps import auth_deps

api_router.include_router(account_notification_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    prefix="/notifications",
    tags=["notifications"],
))

api_router.include_router(admin_account_notification_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    role_check=auth_deps.RoleCheck,
    settings=settings,
    prefix="/admin/notifications",
    tags=["notifications/admin"],
))`}</CodeBlock>
      <Note>
        Email delivery reuses the CORE namespace's SMTP settings and needs the{' '}
        <C>[email]</C> extra (the <C>emails</C> library); SMS needs the <C>[sms]</C>{' '}
        extra and Twilio credentials.
      </Note>

      <H3>2. Send a broadcast, then read it in the inbox (curl flow)</H3>
      <p>
        An admin posts a notification with the target channels; receivers default to all
        accounts when <C>account_receiver_ids</C> is omitted. Each receiver then sees it
        in their inbox and can manage read state:
      </p>
      <CodeBlock lang="bash">{`# 1) admin broadcasts to everyone (or pass "account_receiver_ids": [1, 4, 9])
curl -s -X POST http://localhost:8000/api/v1/admin/notifications/ \\
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \\
  -d '{"title": "Maintenance window",
       "message": "The API is read-only on Sunday 02:00–04:00 UTC.",
       "channels": ["inapp", "email"]}'
# → 201 {"id": 7, "title": "Maintenance window", "channels": ["inapp", "email"], ...}

# 2) a user lists their inbox
curl -s "http://localhost:8000/api/v1/notifications/?offset=0&limit=20" \\
  -H "Authorization: Bearer $USER_TOKEN"

# 3) mark one as read (toggle) and then everything at once
curl -s -X PATCH "http://localhost:8000/api/v1/notifications/7/mark" \\
  -H "Authorization: Bearer $USER_TOKEN"
curl -s -X PATCH "http://localhost:8000/api/v1/notifications/mark-all" \\
  -H "Authorization: Bearer $USER_TOKEN"

# 4) the admin audits what was sent
curl -s http://localhost:8000/api/v1/admin/notifications/all \\
  -H "Authorization: Bearer $ADMIN_TOKEN"`}</CodeBlock>

      <H3>3. Send notifications from your own code</H3>
      <p>
        The dispatcher is importable and usable anywhere you have a session and settings —
        a signup listener or a billing webhook, for example. It creates the notification
        plus one <C>AccountNotification</C> per receiver and runs the channel handlers:
      </p>
      <CodeBlock lang="python">{`from msflib.notifications.models import (
    NotificationChannel, NotificationCreate, NotificationType,
)
from msflib.notifications.service.notification import dispatch_account_notifications

notification = dispatch_account_notifications(
    session=session,
    settings=settings,
    data=NotificationCreate(
        title="Welcome to Acme",
        message="Finish setting up your profile to get started.",
        channels=[NotificationChannel.inapp, NotificationChannel.email],
    ),
    n_type=NotificationType.system,
    sender=current_admin,          # optional for system notifications
    receivers=receivers,           # list of accounts
)`}</CodeBlock>

      <H3>4. React to account events with notifications</H3>
      <p>
        Because accounts emit lifecycle events, the notification module composes
        naturally with listeners — no changes to the account module required:
      </p>
      <CodeBlock lang="python">{`from msflib.eventbus import listen
from msflib.notifications.models import (
    NotificationChannel, NotificationCreate, NotificationType,
)
from msflib.notifications.service.notification import dispatch_account_notifications


@listen("account-created")
def welcome_notification(account, options, logger=None):
    session = options.get("session")
    if session is None:
        return
    dispatch_account_notifications(
        session=session,
        settings=settings,
        data=NotificationCreate(
            title="Your account is ready",
            message=f"Hi {account.username}, welcome aboard!",
            channels=[NotificationChannel.inapp],   # in-app only during signup
        ),
        n_type=NotificationType.system,
        receivers=[account],
    )`}</CodeBlock>
      <Note>
        Handler failures are logged per receiver and never abort the dispatch — one bad
        phone number or SMTP hiccup does not lose the in-app copies.
      </Note>
    </>
  )
}
