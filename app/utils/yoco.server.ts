// app/utils/yoco.server.ts
import crypto from "node:crypto";

const YOCO_SECRET_KEY = process.env.YOCO_SECRET_API_KEY!;
const YOCO_WEBHOOK_SECRET = process.env.YOCO_WEBHOOK_SECRET!;
const WEB_URL = process.env.WEB_URL!; // e.g. https://tshepomatlou.com/

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateCheckoutParams {
	amountInCents: number;
	email: string;
	reference: string;
	/** defaults to book checkout */
	cancelPath?: string;
}

export interface YocoCheckoutResponse {
	id: string;
	redirectUrl: string;
}

export interface YocoWebhookPayload {
	id: string;
	type: string; // "payment.succeeded" | "payment.failed" | etc.
	createdTime: string;
	payload: {
		id: string;
		type: string;
		status: string; // "successful"
		amount: number; // in cents
		currency: string;
		mode: string;
		createdDate: string;
		metadata?: {
			reference?: string;
			[key: string]: unknown;
		};
		customer?: {
			email?: string;
		};
	};
}

// ─── Create Checkout ──────────────────────────────────────────────────────────

export async function createYocoCheckout({
	amountInCents,
	email,
	reference,
	cancelPath = "checkout/book",
}: CreateCheckoutParams): Promise<YocoCheckoutResponse> {
	const response = await fetch("https://payments.yoco.com/api/checkouts", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${YOCO_SECRET_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount: amountInCents,
			currency: "ZAR",
			successUrl: `${WEB_URL}thank-you?email=${encodeURIComponent(
				email,
			)}&ref=${reference}`,
			failureUrl: `${WEB_URL}${cancelPath}`,
			cancelUrl: `${WEB_URL}${cancelPath}`,
			customer: { email },
			metadata: { reference },
		}),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(
			`Yoco checkout failed: ${response.status} — ${JSON.stringify(error)}`,
		);
	}

	return response.json() as Promise<YocoCheckoutResponse>;
}

// ─── Register Webhook ─────────────────────────────────────────────────────────
// Call this once (e.g. via /admin/register-webhook) — not on every request.

export async function registerYocoWebhook() {
	const webhookUrl = `${WEB_URL}api/webhook/yoco`;

	// Check existing webhooks first to avoid duplicates
	const listRes = await fetch("https://payments.yoco.com/api/webhooks", {
		headers: { Authorization: `Bearer ${YOCO_SECRET_KEY}` },
	});

	if (listRes.ok) {
		const data = await listRes.json();

		// Yoco returns the array directly, not wrapped in { webhooks: [] }
		const webhooks = Array.isArray(data)
			? data
			: data.webhooks ?? data.items ?? [];
		const existing = webhooks.find(
			(wh: { id: string; url: string }) => wh.url === webhookUrl,
		);

		if (existing) {
			return { alreadyRegistered: true, webhook: existing };
		}
	}

	const response = await fetch("https://payments.yoco.com/api/webhooks", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${YOCO_SECRET_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: "checkout-success-webhook",
			url: webhookUrl,
			events: ["payment.succeeded", "payment.failed"],
		}),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(
			`Webhook registration failed: ${response.status} — ${JSON.stringify(
				error,
			)}`,
		);
	}

	return response.json();
}

// ─── Verify Webhook Signature ─────────────────────────────────────────────────
// Yoco signs payloads with HMAC-SHA256. Verify before processing.
const TOLERANCE_SECONDS = 5 * 60;
export function verifyYocoSignature(
	rawBody: string,
	headers: Headers,
	secret: string | undefined,
) {
	if (!secret) {
		console.error("[yoco] YOCO_WEBHOOK_SECRET is not set");
		return false;
	}

	const id = headers.get("webhook-id");
	const timestamp = headers.get("webhook-timestamp");
	const signatureHeader = headers.get("webhook-signature");
	if (!id || !timestamp || !signatureHeader) return false;

	// reject old / replayed events
	const age = Math.abs(Date.now() / 1000 - Number(timestamp));
	if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

	const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
	const expected = crypto
		.createHmac("sha256", key)
		.update(`${id}.${timestamp}.${rawBody}`)
		.digest();

	return signatureHeader.split(" ").some((part) => {
		const [version, sig] = part.split(",");
		if (version !== "v1" || !sig) return false;
		const given = Buffer.from(sig, "base64");
		return (
			given.length === expected.length &&
			crypto.timingSafeEqual(given, expected)
		);
	});
}
