// app/utils/yoco.server.ts

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
		const { webhooks } = (await listRes.json()) as {
			webhooks: Array<{ id: string; url: string }>;
		};
		const existing = webhooks.find((wh) => wh.url === webhookUrl);
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
			url: webhookUrl,
			// Subscribe to the events you care about
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

export async function verifyYocoSignature(
	rawBody: string,
	signatureHeader: string | null,
): Promise<boolean> {
	if (!signatureHeader || !YOCO_WEBHOOK_SECRET) return false;

	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(YOCO_WEBHOOK_SECRET),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);

	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(rawBody),
	);

	const computed = Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	// Yoco may prefix the header with "sha256=" — handle both forms
	const received = signatureHeader.replace(/^sha256=/, "");
	return computed === received;
}
