"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, FileText, MessageSquare, ArrowUpRight } from "lucide-react";

interface Stats {
  projects: number;
  posts: number;
  messages: number;
  unread: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, posts: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, postsRes, messagesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/blog?all=true"),
          fetch("/api/messages"),
        ]);
        const [projects, posts, messages] = await Promise.all([
          projectsRes.json(),
          postsRes.json(),
          messagesRes.json(),
        ]);
        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          posts: Array.isArray(posts) ? posts.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
          unread: Array.isArray(messages) ? messages.filter((m: { read: boolean }) => !m.read).length : 0,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects", note: "Total" },
    { label: "Blog Posts", value: stats.posts, icon: FileText, href: "/admin/blog", note: "All posts" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, href: "/admin/messages", note: `${stats.unread} unread` },
  ];

  return (
    <div>
      <div className="mb-10">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">Admin</span>
        <h1 className="font-display text-4xl mt-2">Dashboard</h1>
        <p className="text-text-secondary font-light mt-2">Welcome back, Hesam.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, href, note }) => (
          <Link key={label} href={href} className="group p-6 border border-border bg-surface hover:border-accent/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <Icon size={16} className="text-text-secondary group-hover:text-accent transition-colors" />
              <ArrowUpRight size={12} className="text-muted group-hover:text-accent transition-colors" />
            </div>
            <div className="font-display text-5xl text-text-primary mb-1">
              {loading ? "—" : value}
            </div>
            <div className="font-mono text-xs text-text-secondary tracking-wider uppercase">{label}</div>
            <div className="font-mono text-xs text-muted mt-1">{note}</div>
          </Link>
        ))}
      </div>

      <div className="border border-border p-6">
        <h2 className="font-mono text-xs text-text-secondary tracking-widest uppercase mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects" className="px-4 py-2 border border-border font-mono text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-colors tracking-wider uppercase">
            + New Project
          </Link>
          <Link href="/admin/blog" className="px-4 py-2 border border-border font-mono text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-colors tracking-wider uppercase">
            + New Post
          </Link>
          <Link href="/" target="_blank" className="px-4 py-2 border border-border font-mono text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-colors tracking-wider uppercase">
            View Site ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
