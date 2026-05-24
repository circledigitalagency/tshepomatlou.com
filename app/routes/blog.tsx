import { Link, Outlet, useMatches } from "@remix-run/react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import MainLayout from "~/components/_layout/main";
import { BlogCard } from "~/components/card/blog-card";
import { blogPosts } from "~/lib/@data";


export default function Page() {
    const matches = useMatches();
    const isChildRoute = matches.some((match) => match.id === "routes/blog.$id");

    return (
        <MainLayout>
            {!isChildRoute && (
                <div className="flex flex-col space-y-2 mt-20">

                    <div className=" bg-sage-pale">
                        {blogPosts.slice(0, 1).map((post, index) => (
                            <div
                                className="grid grid-cols-2 gap-12"
                                key={index}
                            >
                                <div className="">
                                    <img src={post.image} alt="image" />
                                </div>
                                <div className="flex flex-col space-y-4 py-8">
                                    <div className="bg-sage/80 flex justify-center items-center p-2 sm:w-[15%] w-[25%]">
                                        <p className="text-white text-sm">Latest Article</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock size={14} className="text-warm" />
                                        <span className="text-sm text-warm">
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <h3
                                        className="text-4xl font-normal text-sage mb-3 transition-colors sm:w-[70%]"
                                    // initial={{ opacity: 0 }}
                                    // animate={{ opacity: 1 }}
                                    // transition={{ delay: index * 0.1 + 0.2 }}
                                    >
                                        {post.title}
                                    </h3>

                                    <p
                                        className="mb-4 font-light leading-relaxed sm:w-[80%] w-[90%]"
                                    // initial={{ opacity: 0 }}
                                    // animate={{ opacity: 1 }}
                                    // transition={{ delay: index * 0.1 + 0.3 }}
                                    >
                                        {post.excerpt}
                                    </p>

                                    <Link to={`/blog/${post.title}`}>
                                        <div
                                            className="flex space-x-1 hover:underline cursor-pointer text-warm items-center text-sm text-sage-500"
                                        // initial={{ opacity: 0 }}
                                        // animate={{ opacity: 1 }}
                                        // transition={{ delay: index * 0.1 + 0.4 }}
                                        >
                                            <p>Read more </p>
                                            <ArrowRight size={18} />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col container mx-auto">
                        <div className="flex flex-col">
                            <section className="flex flex-row w-full justify-between items-start space-x-10 py-10 ">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {blogPosts.slice(1).map((post, index) => (
                                        <BlogCard key={post.title} {...post} index={index} />
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
            <Outlet />
        </MainLayout>
    );
}
