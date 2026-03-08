import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on frontend development, design, and the web.",
};

export const revalidate = 60;

async function getPosts(): Promise<BlogPost[]> {
  try {
    await dbConnect();
    const posts = await BlogPostModel.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen pt-28 px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-20">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            003 — Blog
          </span>
          <h1 className="font-display text-6xl md:text-8xl mt-4 leading-tight">
            Writing &
            <span className="italic text-text-secondary"> Thoughts</span>
          </h1>
          <p className="text-text-secondary mt-6 font-light max-w-lg">
            Articles on frontend development, performance, design systems, and more.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center">
            <p className="font-mono text-sm text-text-secondary">No posts published yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-12 py-10 hover:bg-surface/50 px-0 md:-mx-6 md:px-6 transition-colors"
              >
                <div className="font-mono text-xs text-text-secondary tracking-wider whitespace-nowrap mt-1 min-w-[120px]">
                  {post.createdAt ? formatDate(post.createdAt) : ""}
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-2xl md:text-3xl text-text-primary group-hover:text-accent transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary font-light mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <span key={tag} className="font-mono text-xs px-2 py-0.5 border border-border text-text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-xs text-text-secondary">
                      {post.readTime} min read
                    </span>
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-text-secondary group-hover:text-accent transition-colors mt-1 shrink-0"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
