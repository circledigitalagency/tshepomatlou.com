export async function registerYocoWebhook() {
	const secretKey = process.env.YOCO_SECRET_API_KEY;
	const webhookUrl = process.env.WEB_URL + "webhooks/yoco-payment";

	const response = await fetch("https://payments.yoco.com/api/webhooks", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${secretKey}`,
		},
		body: JSON.stringify({
			name: "checkout-success-webhook",
			url: webhookUrl,
		}),
	});

	console.log("response: ", response);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(`Failed to register webhook: ${error.message}`);
	}

	const data = await response.json();
	console.log("Webhook registered:", data);
	return data;
}
