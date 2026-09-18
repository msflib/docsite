import { B, C, CodeBlock, H2, H3, Note, Table } from '../../components/md'

export default function FastapiPayments() {
  return (
    <>
      <H2>Introduction</H2>
      <p>
        <C>msflib-payments</C> (v0.2.0) handles payment initiation, gateway verification
        (Stripe &amp; Paystack) and queue-driven post-payment processing. Depends on:
        msflib, stripe.
      </p>
      <p>
        The module deliberately does not own your checkout flow. You call{' '}
        <C>process_payment()</C> (or the <C>PaymentProcessor</C> facade) from your own
        endpoint with a business payload: it creates the <C>Payment</C> record, asks the
        configured gateway for an <C>authorization_url</C>/<C>access_code</C>, and files a{' '}
        <C>PaymentQueue</C> row carrying your <C>event_key</C> and data. The browser
        completes payment at the gateway; when it returns, the module's{' '}
        <C>GET /payments/verify/{'{reference}'}</C> endpoint checks the transaction with
        the gateway, compares amounts, flips the status to <C>verified</C>, and emits{' '}
        <C>payment-queue-execute-{'{event_key}'}</C> on the shared event bus — your
        listeners do the fulfillment (grant a plan, unlock a drive, create an entity).
      </p>
      <p>Use it when you want:</p>
      <ul>
        <li>
          <B>Gateway-agnostic checkout</B> — switch between <C>paystack</C> and{' '}
          <C>stripe</C> per request or via <C>PAYMENT_GATEWAY</C> without touching call
          sites.
        </li>
        <li>
          <B>Deferred fulfillment</B> — side effects run in event listeners only after
          the gateway confirms the money, keyed by your own <C>event_key</C>.
        </li>
        <li>
          <B>An auditable payment trail</B> — every attempt is persisted with gateway
          response data merged into <C>Payment.data</C>.
        </li>
        <li>
          <B>Typed error handling</B> — connection/response/status errors map cleanly
          onto HTTP 502/400/500 semantics.
        </li>
      </ul>

      <H2>Settings (namespace PAYMENTS)</H2>
      <Table
        head={['Setting', 'Purpose']}
        rows={[
          [<C>PAYMENT_GATEWAY</C>, <>Active gateway (<C>stripe</C> / <C>paystack</C>)</>],
          [<C>PAYMENT_CALLBACK_URL / PAYMENT_CANCEL_URL</C>, 'Redirect targets'],
          [<C>PAYSTACK_BASE_URL / PAYSTACK_SECRET_KEY</C>, 'Paystack config'],
          [<C>STRIPE_SECRET_KEY</C>, 'Stripe config'],
        ]}
      />

      <H2>Endpoints</H2>
      <Table
        head={['Method', 'Path', 'Summary']}
        rows={[
          ['GET', <C>/payments/verify/&#123;reference&#125;</C>, 'Verify payment; emits the queue event on success'],
          ['GET', <C>/payments/&#123;payment_id&#125;</C>, 'Get payment by ID'],
        ]}
      />

      <H2>Models &amp; enums</H2>
      <ul>
        <li>
          <C>Payment</C> — <C>account_id</C>, <C>email</C>, <C>amount</C>,{' '}
          <C>callback_url</C>, <C>authorization_url</C>, <C>access_code</C>,{' '}
          <C>reference</C>, <C>status</C>, <C>gateway</C>, <C>data</C>
        </li>
        <li>
          <C>PaymentGateway</C> — <C>stripe</C>, <C>paystack</C>
        </li>
        <li>
          <C>PaymentStatus</C> — <C>verified</C>, <C>unverified</C>, <C>failed</C>,{' '}
          <C>fulfilled</C>
        </li>
        <li>
          <C>PaymentQueue</C> — <C>payment_id</C>, <C>event_key</C>, <C>data</C>,{' '}
          <C>status</C> (<C>queued</C>/<C>processed</C>)
        </li>
        <li>
          <C>PaymentData</C>, <C>PaymentInfo</C>, <C>VerificationResult</C>
        </li>
      </ul>

      <H2>Services</H2>
      <ul>
        <li>
          <C>BasePaymentGateway(ABC)</C> with <C>StripeGateway</C> and{' '}
          <C>PaystackGateway</C>.
        </li>
        <li>
          <C>PaymentProcessor</C> — unified API: <C>gateway()</C>, <C>initiate()</C>,{' '}
          <C>verify()</C>.
        </li>
        <li>
          <C>process_payment()</C> — async flow: create payment record → initiate with
          gateway → queue post-payment event.
        </li>
        <li>
          After successful verification the queue event{' '}
          <C>payment-queue-execute-&#123;event_key&#125;</C> is emitted (via the shared
          eventbus) for fulfillment.
        </li>
      </ul>

      <H2>Error hierarchy</H2>
      <CodeBlock lang="text">{`PaymentError
├─ PaymentConnectionError
├─ PaymentResponseError
├─ PaymentStatusError
└─ PaymentAmountError`}</CodeBlock>
      <p>
        Catch the base <C>PaymentError</C> and branch on specifics.
      </p>

      <H2>Examples</H2>

      <H3>1. Compose the settings</H3>
      <p>
        Mix <C>PaymentsSettings</C> into the app settings and pick the active gateway —
        per-request overrides can still name the other gateway explicitly:
      </p>
      <CodeBlock lang="python">{`# app/core/config.py
from msflib.core.config import SettingsBase, CoreSettings
from msflib.payments.config import PaymentsSettings


class TestSiteSettings(PaymentsSettings, CoreSettings, SettingsBase):
    PAYMENT_GATEWAY: str = "paystack"
    PAYMENT_CALLBACK_URL: str = "http://localhost:3000/paystack/callback"
    PAYMENT_CANCEL_URL: str = "http://localhost:3000/paystack/cancel"
    PAYSTACK_BASE_URL: str = "https://api.paystack.co"
    PAYSTACK_SECRET_KEY: str = ""   # set via PAYMENTS__PAYSTACK_SECRET_KEY in prod
    STRIPE_SECRET_KEY: str = ""


# per environment, scoped env vars win over the class defaults:
#   PAYMENTS__PAYMENT_GATEWAY=stripe
#   PAYMENTS__STRIPE_SECRET_KEY=sk_test_...`}</CodeBlock>

      <H3>2. Mount the payments router</H3>
      <p>
        The router only needs the session, the auth dependency and settings — the
        verify/get endpoints are scoped to the calling account:
      </p>
      <CodeBlock lang="python">{`# app/api/api.py
from msflib.payments.router import router as payments_router
from app.api.deps import auth_deps

api_router.include_router(payments_router(
    get_session=get_session_factory,
    get_current_account=auth_deps.get_current_account,
    settings=settings,
    prefix="/payments",
    tags=["payments"],
))`}</CodeBlock>
      <Note>
        <C>GET /payments/verify/{'{reference}'}</C> and{' '}
        <C>GET /payments/{'{payment_id}'}</C> both filter by{' '}
        <C>account_id == current_account.id</C> — users can only see and verify their own
        payments.
      </Note>

      <H3>3. Start a payment from your business flow and queue fulfillment</H3>
      <p>
        Your endpoint (e.g. <C>POST /subscriptions</C>) calls <C>process_payment()</C>
        with the amount, the gateway and a queue event key of your choosing. Register a
        listener for that key — it runs inside the verify request's transaction after the
        gateway confirms:
      </p>
      <CodeBlock lang="python">{`from fastapi import Depends
from msflib.eventbus import listen
from msflib.payments.models import PaymentData
from msflib.payments.service.processor import process_payment


@router.post("/subscriptions", tags=["billing"])
async def buy_pro_plan(
    session=Depends(get_session),
    account=Depends(auth_deps.get_current_active_account),
):
    payment = await process_payment(
        session=session,
        payment_data=PaymentData(
            email=account.email,
            amount=5000,
            description="Pro subscription",
            gateway="paystack",          # or omit to fall back to PAYMENT_GATEWAY
        ),
        account=account,
        settings=settings,
        queue_event_key="subscription-create",   # your fulfillment key
        queue_data={"plan": "pro", "account_id": account.id},
        metadata={"source": "web"},
    )
    return {"authorization_url": payment.authorization_url, "reference": payment.reference}


@listen("payment-queue-execute-subscription-create")
def grant_pro_plan(queue, options, logger=None):
    session = options.get("session")
    data = queue.data or {}
    # ... create the subscription row for data["account_id"] ...`}</CodeBlock>

      <H3>4. Verify after the gateway redirect (curl flow)</H3>
      <p>
        The user completes payment at the <C>authorization_url</C> and lands on your{' '}
        <C>PAYMENT_CALLBACK_URL</C> with a <C>?reference=</C> query. Your frontend then
        asks the API to verify — the first successful call also fires the queued event:
      </p>
      <CodeBlock lang="http">{`GET /api/v1/payments/verify/3k9fj20dk3 HTTP/1.1
Authorization: Bearer <user token>`}</CodeBlock>
      <CodeBlock lang="json">{`{
  "id": 12, "amount": 5000.0, "gateway": "paystack", "status": "verified",
  "reference": "3k9fj20dk3", "authorization_url": "https://checkout.paystack.com/...",
  "data": {"plan": "pro", "source": "web", "...": "gateway response merged here"}
}`}</CodeBlock>
      <CodeBlock lang="bash">{`# with curl:
curl -s http://localhost:8000/api/v1/payments/verify/3k9fj20dk3 \\
  -H "Authorization: Bearer $USER_TOKEN"

# details of a specific payment
curl -s http://localhost:8000/api/v1/payments/12 \\
  -H "Authorization: Bearer $USER_TOKEN"

# failure surfaces as HTTP status:
# 502 → gateway connection/response error (PaymentConnectionError/PaymentResponseError)
# 400 → PaymentStatusError, or "Payment amount mismatch."
# 404 → no payment with that reference for this account`}</CodeBlock>
      <Note>
        The queue event is emitted once: when the payment is already{' '}
        <C>verified</C> but its queue row is still <C>queued</C>, verification re-emits
        and marks it <C>processed</C> — a safe retry path if your first fulfillment
        attempt was interrupted after the commit.
      </Note>
    </>
  )
}
