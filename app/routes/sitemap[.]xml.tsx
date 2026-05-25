// app/routes/sitemap[.]xml.ts
// GET /sitemap.xml

import type { LoaderFunctionArgs } from "@remix-run/node";
import { blogPosts } from "~/lib/@data";

const BASE_URL = "https://www.tshepomatlou.com";

export async function loader({ request }: LoaderFunctionArgs) {
    const staticRoutes = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/blog", priority: "0.9", changefreq: "weekly" },
        { url: "/gallery", priority: "0.7", changefreq: "monthly" },
    ];

    const blogRoutes = blogPosts.map((post) => ({
        url: `/blog/${slugify(post.title)}`,
        priority: "0.8",
        changefreq: "monthly",
        lastmod: post.date ? toISO(post.date) : undefined,
    }));

    const allRoutes = [...staticRoutes, ...blogRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
            .map(
                (route) => `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
            )
            .join("\n")}
</urlset>`;

    return new Response(sitemap, {
        status: 200,
        headers: {
            "Content-Type": "application/xml",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=3600",
        },
    });
}

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function toISO(dateStr: string): string {
    try {
        return new Date(dateStr).toISOString().split("T")[0];
    } catch {
        return new Date().toISOString().split("T")[0];
    }
}