import { shopData } from "~/lib/@data";
import type { YocoWebhookPayload } from "./yoco.server";

/* ─────────────────────────────── Order model ─────────────────────────────── */

export type Order = {
	reference: string;
	paymentId: string;
	test: boolean;
	total: number; // rands
	subtotal: number;
	deliveryFee: number;
	name?: string;
	email?: string;
	phone?: string;
	items: { name: string; qty: number; price?: number; cover?: string }[];
	method: "Standard" | "Express" | "Home delivery" | string;
	largeBag: boolean;
	isPickup: boolean;
	deliverTo: string;
};

const SITE = (process.env.WEB_URL ?? "https://tshepomatlou.com/").replace(
	/\/?$/,
	"/",
);

/** Small JPG covers for email (Outlook desktop can't show WebP). */
const EMAIL_COVERS: Record<string, string> = {
	book: "books/email/freedom-front.jpg",
	"healing-trauma": "books/email/healing-trauma-front.jpg",
};

const TIMES: Record<string, string> = {
	Standard: "7–9 business days",
	Express: "3–5 business days",
	"Home delivery": "3–5 business days",
};

const PAXI_SERVICE: Record<string, string> = {
	Standard: "Store-to-Store · 7–9 days",
	Express: "Store-to-Store · 3–5 days",
	"Home delivery": "Store-to-Home · 3–5 days",
};

/** Turns the webhook payload (metadata set in checkout._index.tsx) into a tidy order. */
export function toOrder(payload: YocoWebhookPayload["payload"]): Order {
	// Metadata may be typed as unknown — read every value as a string
	const raw = (payload.metadata ?? {}) as Record<string, unknown>;
	const str = (key: string) =>
		typeof raw[key] === "string" ? (raw[key] as string) : undefined;

	const m = {
		reference: str("reference"),
		name: str("name"),
		email: str("email"),
		phone: str("phone"),
		items: str("items"),
		delivery: str("delivery"),
		deliverTo: str("deliverTo"),
	};

	const total = payload.amount / 100;

	// "Express (R120) · Large bag"
	const deliveryMatch = (m.delivery ?? "").match(
		/^(.*?)\s*\(R(\d+(?:\.\d+)?)\)/,
	);
	const method = deliveryMatch?.[1] ?? m.delivery ?? "—";
	const deliveryFee = deliveryMatch ? Number(deliveryMatch[2]) : 0;

	// "Freedom - Pursuit of Liberty x1, Healing Trauma x2"
	const items = (m.items ?? "")
		.split(/,\s*/)
		.filter(Boolean)
		.map((part: string) => {
			const [, name = part, qty = "1"] = part.match(/^(.*)\s+x(\d+)$/) ?? [];
			const book = shopData.find((b) => b.name === name);
			return {
				name,
				qty: Number(qty),
				price: book?.price,
				cover:
					book && EMAIL_COVERS[book.id]
						? SITE + EMAIL_COVERS[book.id]
						: undefined,
			};
		});

	return {
		reference: m.reference ?? payload.id,
		paymentId: payload.id,
		test: payload.mode === "test",
		total,
		subtotal: total - deliveryFee,
		deliveryFee,
		name: m.name,
		email: m.email,
		phone: m.phone,
		items,
		method,
		largeBag: (m.delivery ?? "").includes("Large bag"),
		isPickup: (m.deliverTo ?? "").startsWith("PEP store:"),
		deliverTo: (m.deliverTo ?? "—").replace(/^PEP store:\s*/, ""),
	};
}

/* ─────────────────────────────── Helpers ─────────────────────────────── */

const esc = (v: unknown) =>
	String(v ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const rand = (n: number) => `R${n.toFixed(2)}`;

const C = {
	bg: "#FAF6F1",
	card: "#FEFCFA",
	line: "#EDE3D6",
	ink: "#3D3328",
	text: "#1A1814",
	muted: "#8C9BA8",
	sage: "#6B7C5A",
	sagePale: "#EEF0E6",
	gold: "#C4A882",
};

const label = (t: string) =>
	`<p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">${t}</p>`;

function layout({ preheader, body }: { preheader: string; body: string }) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>Tshepo Matlou</title>
</head>
<body style="margin:0;padding:0;background:${
		C.bg
	};font-family:'DM Sans',Arial,Helvetica,sans-serif;color:${C.text};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(
		preheader,
	)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${
		C.bg
	};">
<tr><td style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:${
		C.card
	};border:1px solid ${C.line};">
    <tr><td style="height:4px;background:${
			C.sage
		};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="padding:40px 36px;">
      ${body}
    </td></tr>
  </table>
  <p style="max-width:620px;margin:20px auto 0;text-align:center;font-size:12px;color:${
		C.muted
	};">
    Tshepo Matlou · <a href="${SITE}" style="color:${
		C.muted
	};">tshepomatlou.com</a>
  </p>
</td></tr>
</table>
</body>
</html>`;
}

function itemsTable(order: Order) {
	const rows = order.items
		.map(
			(i) => `
      <tr>
        <td width="64" style="padding:12px 0;vertical-align:top;">
          ${
						i.cover
							? `<img src="${i.cover}" width="52" alt="" style="display:block;width:52px;height:auto;border:0;box-shadow:0 2px 6px rgba(0,0,0,.15);" />`
							: ""
					}
        </td>
        <td style="padding:12px 12px;vertical-align:top;">
          <p style="margin:0;font-family:Georgia,serif;font-size:17px;color:${
						C.ink
					};">${esc(i.name)}</p>
          <p style="margin:4px 0 0;font-size:13px;color:${C.muted};">Qty ${
				i.qty
			}${i.price ? ` × ${rand(i.price)}` : ""}</p>
        </td>
        <td align="right" style="padding:12px 0;vertical-align:top;font-size:15px;color:${
					C.text
				};white-space:nowrap;">
          ${i.price ? rand(i.price * i.qty) : ""}
        </td>
      </tr>`,
		)
		.join("");

	const totalRow = (l: string, v: string, strong = false) => `
      <tr>
        <td colspan="2" style="padding:6px 0;font-size:${
					strong ? 16 : 14
				}px;color:${strong ? C.text : C.muted};${
		strong ? "font-weight:bold;" : ""
	}">${l}</td>
        <td align="right" style="padding:6px 0;font-size:${
					strong ? 18 : 14
				}px;color:${C.text};${
		strong ? "font-weight:bold;" : ""
	}white-space:nowrap;">${v}</td>
      </tr>`;

	return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${
			C.line
		};">
      ${rows}
      <tr><td colspan="3" style="border-top:1px solid ${
				C.line
			};font-size:0;line-height:0;padding-top:8px;">&nbsp;</td></tr>
      ${totalRow("Subtotal", rand(order.subtotal))}
      ${totalRow(`Delivery · ${esc(order.method)}`, rand(order.deliveryFee))}
      ${totalRow("Total paid", rand(order.total), true)}
    </table>`;
}

const testBanner = (order: Order) =>
	order.test
		? `<p style="margin:0 0 24px;padding:10px 14px;background:#FFF4D6;border:1px solid #F0D68A;font-size:13px;color:#7A5B00;">TEST payment — no real money was taken.</p>`
		: "";

/* ─────────────────────────────── Customer email ─────────────────────────────── */

export function buildBuyerEmail(order: Order) {
	const first = (order.name ?? "").trim().split(/\s+/)[0];
	const time = TIMES[order.method] ?? "a few business days";
	const phone = order.phone ? ` on <strong>${esc(order.phone)}</strong>` : "";
	const many = order.items.reduce((n, i) => n + i.qty, 0) > 1;

	const nextSteps = order.isPickup
		? `We'll pack your ${many ? "books" : "book"} and send ${
				many ? "them" : "it"
		  } with PAXI to <strong>${esc(
				order.deliverTo,
		  )}</strong>. You'll get an SMS from PAXI${phone} as soon as your parcel is ready to collect, usually within ${time}.`
		: `We'll pack your ${
				many ? "books" : "book"
		  } and PAXI will deliver to your door, usually within ${time}. PAXI will send updates by SMS${phone}.`;

	return layout({
		preheader: `Order ${order.reference} confirmed — ${rand(
			order.total,
		)} paid.`,
		body: `
      ${testBanner(order)}
      <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${
				C.sage
			};">Order confirmed</p>
      <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:36px;line-height:1.15;font-weight:400;color:${
				C.ink
			};">
        Thank you${
					first ? `, <em style="color:${C.sage};">${esc(first)}</em>` : ""
				}
      </h1>
      <p style="margin:0 0 28px;font-size:16px;line-height:1.8;color:${C.ink};">
        Your payment was successful and your order is being prepared. Here are your details. Please keep this email for your records.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:${
				C.sagePale
			};">
        <tr><td style="padding:16px 20px;">
          ${label("Order reference")}
          <p style="margin:0;font-size:20px;letter-spacing:1px;color:${
						C.text
					};">${esc(order.reference)}</p>
        </td></tr>
      </table>

      ${label("Your order")}
      ${itemsTable(order)}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;border:1px solid ${
				C.line
			};">
        <tr><td style="padding:22px 24px;">
          ${label(order.isPickup ? "Collect from" : "Delivering to")}
          <p style="margin:0 0 4px;font-size:16px;color:${C.text};">${esc(
			order.deliverTo,
		)}</p>
          <p style="margin:0 0 18px;font-size:13px;color:${C.muted};">${esc(
			order.method,
		)} · PAXI · ${time}</p>
          ${label("What happens next")}
          <p style="margin:0;font-size:15px;line-height:1.8;color:${
						C.ink
					};">${nextSteps}</p>
        </td></tr>
      </table>

      <p style="margin:32px 0 0;font-size:15px;line-height:1.8;color:${C.ink};">
        Thank you for your support. I hope these pages meet you exactly where you are.
      </p>
      <p style="margin:8px 0 0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:${
				C.sage
			};">Tshepo Matlou</p>

      <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid ${
				C.line
			};font-size:13px;line-height:1.7;color:${C.muted};">
        Questions about your order? Just reply to this email and quote <strong>${esc(
					order.reference,
				)}</strong>.
      </p>`,
	});
}

/* ─────────────────────────────── Owner email ─────────────────────────────── */

export function buildOwnerEmail(order: Order) {
	const bookCount = order.items.reduce((n, i) => n + i.qty, 0);
	const row = (l: string, v: string) => `
      <tr>
        <td style="padding:7px 0;font-size:13px;color:${C.muted};width:120px;vertical-align:top;">${l}</td>
        <td style="padding:7px 0;font-size:15px;color:${C.text};vertical-align:top;">${v}</td>
      </tr>`;

	return layout({
		preheader: `${bookCount} ${bookCount === 1 ? "book" : "books"} · ${
			order.method
		} · ${rand(order.total)} paid`,
		body: `
      ${testBanner(order)}
      <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${
				C.sage
			};">New order · ${esc(order.reference)}</p>
      <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:36px;line-height:1.15;font-weight:400;color:${
				C.ink
			};">
        ${bookCount} ${bookCount === 1 ? "book" : "books"} to send
      </h1>
      <p style="margin:0 0 28px;font-size:16px;color:${C.muted};">${rand(
			order.total,
		)} paid via Yoco</p>

      <!-- PAXI slip -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border:2px solid ${
				C.sage
			};">
        <tr><td style="padding:12px 20px;background:${C.sage};">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#fff;">Send with PAXI</p>
        </td></tr>
        <tr><td style="padding:16px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row(
							"Service",
							`<strong>${esc(
								PAXI_SERVICE[order.method] ?? order.method,
							)}</strong>`,
						)}
            ${row(
							"Bag",
							order.largeBag ? "<strong>Large bag</strong>" : "Standard bag",
						)}
            ${row(
							order.isPickup ? "PEP store" : "Address",
							`<strong>${esc(order.deliverTo)}</strong>`,
						)}
            ${row("Recipient", esc(order.name ?? "—"))}
            ${row(
							"Cellphone",
							order.phone
								? `<a href="tel:${esc(order.phone)}" style="color:${
										C.text
								  };">${esc(order.phone)}</a>`
								: "—",
						)}
          </table>
        </td></tr>
      </table>

      ${label("Pack these")}
      ${itemsTable(order)}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;border-top:1px solid ${
				C.line
			};">
        <tr><td style="padding-top:20px;">
          ${label("Customer")}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", esc(order.name ?? "—"))}
            ${row(
							"Email",
							order.email
								? `<a href="mailto:${esc(order.email)}" style="color:${
										C.sage
								  };">${esc(order.email)}</a>`
								: "—",
						)}
            ${row("Cellphone", esc(order.phone ?? "—"))}
            ${row("Reference", esc(order.reference))}
            ${row(
							"Yoco payment",
							`<span style="font-size:13px;color:${C.muted};">${esc(
								order.paymentId,
							)}</span>`,
						)}
          </table>
        </td></tr>
      </table>

      <p style="margin:28px 0 0;font-size:13px;line-height:1.7;color:${
				C.muted
			};">
        Reply to this email to contact the customer directly.
      </p>`,
	});
}
