import { json, MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { Clock } from "lucide-react";
import { BlogText } from "~/components/text/blog-text";
import { blogPosts } from "~/lib/@data";
import { Blog } from "~/lib/@types";

export async function loader({ params }: { params: { id: string } }) {
    const blog = blogPosts.find((p) => p.title === params.id);
    if (!blog) throw new Response("Blog Not Found", { status: 404 });
    return json<Blog>(blog);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const post = data as Blog | undefined;
    if (!post) {
        return [
            { title: "Post Not Found — Tshepo Matlou" },
            { name: "robots", content: "noindex" },
        ];
    }

    const title = `${post.title} | Tshepo Matlou`;
    const description = post.excerpt;
    const url = `https://www.tshepomatlou.com/blog/${post.title}`;
    const image = post.image;

    return [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: `${post.category}, mindfulness, healing, Tshepo Matlou, life coaching, ${post.title.toLowerCase()}` },
        { name: "author", content: post.author },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: url },

        // Open Graph
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:site_name", content: "Tshepo Matlou" },
        { property: "og:locale", content: "en_ZA" },
        { property: "article:author", content: post.author },
        { property: "article:published_time", content: new Date(post.date).toISOString() },
        { property: "article:section", content: post.category },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
    ];
};

export default function Page() {
    const blog = useLoaderData<typeof loader>();
    return (
        <div className="flex flex-col space-y-32 py-10 sm:px-32 px-5">
            <div className="flex flex-col items-center space-y-5 justify-center w-full">
                <img src={blog.image} alt={blog.title} className="h-full w-1/2" />
                <h2 className="text-accent font-semibold text-3xl text-center">
                    {blog.title}
                </h2>
                <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-earth" />
                    <span className="text-sm text-earth">{blog.readTime}</span>
                </div>
                <BlogText children={blog.blogText} />
                {/* <div className="flex flex-col space-y-5 py-5"><Blog</div> */}
            </div>
        </div>
    );
}