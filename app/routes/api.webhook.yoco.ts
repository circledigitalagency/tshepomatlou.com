// app/routes/api.webhook.yoco.tsx
// POST /api/webhook/yoco  — receives Yoco payment events

import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { verifyYocoSignature } from "~/utils/yoco.server";
import { sendEmail } from "~/utils/email.server";
import type { YocoWebhookPayload } from "~/utils/yoco.server";

// Yoco requires a 200 response quickly — do heavy work after responding
// if your hosting supports background tasks. Otherwise process inline.

export async function action({ request }: ActionFunctionArgs) {
	// 1. Read raw body (needed for signature verification)
	const rawBody = await request.text();

	// 3. Parse payload
	let event: YocoWebhookPayload;
	try {
		event = JSON.parse(rawBody);
	} catch {
		return json({ error: "Invalid JSON" }, { status: 400 });
	}

	console.log(`[yoco-webhook] Received event: ${event.type}`, {
		id: event.id,
		payloadId: event.payload?.id,
	});

	// 4. Handle events
	if (event.type === "payment.succeeded") {
		handlePaymentSucceeded(event).catch((err) =>
			console.error("[yoco-webhook] Email error:", err),
		);
	}

	if (event.type === "payment.failed") {
		console.warn("[yoco-webhook] Payment failed:", event.payload?.id);
		// Optionally send a failure follow-up email here
	}

	// Always return 200 so Yoco doesn't retry
	return json({ received: true });
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

async function handlePaymentSucceeded(event: YocoWebhookPayload) {
	const { amount, metadata } = event.payload;

	const email = metadata?.email as string | undefined;
	const reference = metadata?.reference as string | undefined;

	console.log(
		`[yoco-webhook] Payment succeeded — ref: ${reference}, amount: ${amount}`,
	);

	// Send confirmation to buyer
	if (email) {
		await sendEmail({
			to: email,
			subject: "Your Payment Confirmation — Tshepo Matlou",
			html: buildBuyerEmail({ amount, reference }),
		});
	}

	// Notify Tshepo
	await sendEmail({
		to: "me@tshepomatlou.com",
		subject: "📘 New Book Purchase",
		html: buildOwnerEmail({ email, amount, reference }),
	});
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function buildBuyerEmail({
	amount,
	reference,
}: {
	amount: number;
	reference?: string;
}) {
	return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px 20px;background:#FAF6F1;font-family:'DM Sans',Arial,sans-serif;color:#1A1814;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FEFCFA;border:1px solid #EDE3D6;">
    <tr>
      <td style="padding:48px;">
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6B7C5A;">Tshepo Matlou</p>
        <h1 style="margin:0 0 32px;font-family:Georgia,serif;font-size:42px;line-height:1.1;font-weight:400;color:#3D3328;">
          Payment<br/>Confirmation
        </h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.9;color:#3D3328;">
          Thank you for your purchase. Your payment has been received successfully.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EDE3D6;border-bottom:1px solid #EDE3D6;padding:28px 0;">
          <tr>
            <td style="padding-bottom:20px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8C9BA8;">Amount Paid</p>
              <p style="margin:0;font-size:18px;color:#1A1814;">R${(
								amount / 100
							).toFixed(2)}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8C9BA8;">Reference</p>
              <p style="margin:0;font-size:18px;color:#1A1814;">${
								reference ?? "—"
							}</p>
            </td>
          </tr>
        </table>
        <p style="margin:32px 0 16px;font-size:15px;line-height:1.9;color:#3D3328;">
          Thank you for supporting Tshepo Matlou. We will be in touch shortly with your book details.
        </p>
        <p style="margin:0;font-size:14px;color:#8C9BA8;">
          Questions? Email <a href="mailto:me@tshepomatlou.com" style="color:#6B7C5A;">me@tshepomatlou.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildOwnerEmail({
	email,
	amount,
	reference,
}: {
	email?: string;
	amount: number;
	reference?: string;
}) {
	return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px 20px;background:#FAF6F1;font-family:'DM Sans',Arial,sans-serif;color:#1A1814;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FEFCFA;border:1px solid #EDE3D6;">
    <tr>
      <td style="padding:48px;">
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6B7C5A;">Tshepo Matlou</p>
        <h1 style="margin:0 0 32px;font-family:Georgia,serif;font-size:42px;line-height:1.1;font-weight:400;color:#3D3328;">
          New Book<br/>Purchase
        </h1>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EDE3D6;border-bottom:1px solid #EDE3D6;padding:28px 0;">
          <tr>
            <td style="padding-bottom:20px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8C9BA8;">Customer Email</p>
              <p style="margin:0;font-size:18px;color:#1A1814;">${
								email ?? "N/A"
							}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8C9BA8;">Amount</p>
              <p style="margin:0;font-size:18px;color:#1A1814;">R${(
								amount / 100
							).toFixed(2)}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8C9BA8;">Reference</p>
              <p style="margin:0;font-size:18px;color:#1A1814;">${
								reference ?? "—"
							}</p>
            </td>
          </tr>
        </table>
        <p style="margin:32px 0 0;font-size:15px;line-height:1.9;color:#3D3328;">
          Follow up with the customer to arrange book delivery.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
