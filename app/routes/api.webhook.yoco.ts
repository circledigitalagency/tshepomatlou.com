// app/routes/api.webhook.yoco.tsx
// POST /api/webhook/yoco — receives Yoco payment events

import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	verifyYocoSignature,
	type YocoWebhookPayload,
} from "~/utils/yoco.server";
import { sendEmail } from "~/utils/email.server";
import {
	buildBuyerEmail,
	buildOwnerEmail,
	toOrder,
} from "~/utils/order-emails.server";

/** Where new-order notifications go. Set OWNER_EMAIL in your env (falls back to EMAIL_USER). */
const ownerEmail = () =>
	process.env.OWNER_EMAIL || process.env.EMAIL_USER || "";

export async function action({ request }: ActionFunctionArgs) {
	// 1. Raw body — must be the exact bytes Yoco signed
	const rawBody = await request.text();

	// 2. Verify it really came from Yoco
	if (
		!verifyYocoSignature(
			rawBody,
			request.headers,
			process.env.YOCO_WEBHOOK_SECRET,
		)
	) {
		console.warn("[yoco-webhook] Invalid signature — ignored");
		return json({ error: "Invalid signature" }, { status: 403 });
	}

	// 3. Parse
	let event: YocoWebhookPayload;
	try {
		event = JSON.parse(rawBody);
	} catch {
		return json({ error: "Invalid JSON" }, { status: 400 });
	}

	// console.log(`[yoco-webhook] ${event.type}`, {
	// 	id: event.id,
	// 	payment: event.payload?.id,
	// });

	// 4. Handle
	if (event.type === "payment.succeeded") {
		// Yoco sends events for every payment on the account — only handle our shop checkouts
		if (!event.payload.metadata?.reference) {
			return json({ received: true, skipped: "not a shop order" });
		}

		const ok = await handlePaymentSucceeded(event);
		// 500 → Yoco retries later (e.g. while the mail server is down), so the order isn't lost
		if (!ok) return json({ error: "Owner email failed" }, { status: 500 });
	}

	if (event.type === "payment.failed") {
		console.warn("[yoco-webhook] Payment failed:", event.payload?.id);
	}

	return json({ received: true });
}

/** Returns false only if the owner notification failed (so Yoco retries). */
async function handlePaymentSucceeded(event: YocoWebhookPayload) {
	const order = toOrder(event.payload);
	const OWNER_EMAIL = ownerEmail();
	// console.log(
	// 	`[yoco-webhook] Paid — ref ${order.reference}, R${order.total.toFixed(2)}`,
	// );

	// Owner first: it holds the delivery details. If it fails, nothing has been sent yet,
	// so a retry won't double-email the customer.
	const owner = await sendEmail({
		to: OWNER_EMAIL,
		subject: `📘 New order ${order.reference} — ${
			order.name ?? order.email ?? "customer"
		} (R${order.total.toFixed(2)})`,
		html: buildOwnerEmail(order),
		replyTo: order.email, // hit Reply to answer the customer directly
	});
	if (!owner?.success) return false;

	if (order.email) {
		const buyer = await sendEmail({
			to: order.email,
			subject: `Thank you for your order — ${order.reference}`,
			html: buildBuyerEmail(order),
			replyTo: OWNER_EMAIL,
		});
		if (!buyer?.success)
			console.error(
				"[yoco-webhook] Customer email failed for",
				order.reference,
			);
	}

	return true;
}
