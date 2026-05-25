import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const robots = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

    return new Response(robots.trim(), {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
