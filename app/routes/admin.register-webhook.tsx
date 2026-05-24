import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { registerYocoWebhook } from "~/utils/yoco.server";

export async function loader() {
    try {
        const result = await registerYocoWebhook();
        return json({ success: true, result });
    } catch (err: any) {
        return json({ success: false, error: err.message }, { status: 500 });
    }
}

export default function RegisterWebhook() {
    const data = useLoaderData();

    return (
        <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            <h1>Webhook Registration Result</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}