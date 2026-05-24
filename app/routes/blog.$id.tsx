import { json, Outlet, useLoaderData } from "@remix-run/react";
import { Clock } from "lucide-react";
import { BlogText } from "~/components/text/blog-text";
import { blogPosts } from "~/lib/@data";

export async function loader({ params }: { params: { id: string } }) {
    const blog = blogPosts.find((p) => p.title === params.id);
    if (!blog) throw new Response("Blog Not Found", { status: 404 });
    return json(blog);
}
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