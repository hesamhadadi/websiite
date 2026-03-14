import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    await dbConnect();
    const post = await BlogPostModel.findOne({ slug, published: true }).lean();
    return post ? JSON.parse(JSON.stringify(post)) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen pt-28 px-6 pb-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors uppercase tracking-widest mb-12"
        >
          <ArrowLeft size={12} /> Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-text-secondary tracking-wider">
              {post.createdAt ? formatDate(post.createdAt) : ""}
            </span>
            <span className="text-border">·</span>
            <span className="font-mono text-xs text-text-secondary">
              {post.readTime} min read
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-text-secondary text-lg font-light leading-relaxed">
            {post.excerpt}
          </p>
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-6">
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono text-xs px-2 py-1 border border-border text-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="border-t border-border pt-10">
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:font-display prose-headings:font-normal prose-headings:text-text-primary
            prose-p:text-text-secondary prose-p:font-light prose-p:leading-relaxed
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-code:font-mono prose-code:text-accent prose-code:text-sm prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none
            prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-none
            prose-blockquote:border-l-accent prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-text-secondary
            prose-strong:text-text-primary prose-strong:font-medium
            prose-hr:border-border">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
