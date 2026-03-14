"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, Eye, EyeOff } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

const emptyPost: { title: string; slug: string; excerpt: string; content: string; tags: string[]; published: boolean } = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: [],
  published: false,
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ ...emptyPost });
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/blog?all=true");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyPost });
    setTagsInput("");
    setTab("write");
    setShowForm(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, tags: p.tags, published: p.published });
    setTagsInput(p.tags.join(", "));
    setTab("write");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.title), tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    const url = editing ? `/api/blog/${editing._id}` : "/api/blog";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    await fetchPosts();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    await fetchPosts();
    setDeleteId(null);
  };

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/blog/${post._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    await fetchPosts();
  };

  const inputCls = "w-full bg-background border border-border px-3 py-2.5 font-mono text-sm text-text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="font-mono text-xs text-accent tracking-widest uppercase">Admin</span>
          <h1 className="font-display text-4xl mt-2">Blog</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background font-mono text-xs font-medium tracking-widest uppercase hover:bg-accent-dim transition-colors">
          <Plus size={12} /> New Post
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-text-secondary">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <p className="font-mono text-sm text-text-secondary">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p._id} className="flex items-center gap-4 p-4 border border-border bg-surface hover:border-accent/20 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-text-primary truncate">{p.title}</span>
                  <span className={cn("font-mono text-xs px-1.5 py-0.5 border shrink-0", p.published ? "border-accent/30 text-accent" : "border-border text-muted")}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {p.createdAt && <span className="font-mono text-xs text-muted">{formatDate(p.createdAt)}</span>}
                  <span className="font-mono text-xs text-muted">{p.readTime}min read</span>
                  <span className="font-mono text-xs text-muted">/{p.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => togglePublish(p)} title={p.published ? "Unpublish" : "Publish"} className="p-2 text-text-secondary hover:text-accent transition-colors">
                  {p.published ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={() => openEdit(p)} className="p-2 text-text-secondary hover:text-accent transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteId(p._id!)} className="p-2 text-text-secondary hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-surface border border-border p-8 my-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">{editing ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-text-primary">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <input className={inputCls} placeholder="Title *" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} />
              <input className={inputCls} placeholder="Slug (auto-generated)" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <textarea className={cn(inputCls, "resize-none")} rows={2} placeholder="Excerpt (shown in list)"
                value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              <input className={inputCls} placeholder="Tags (comma separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />

              {/* Markdown editor */}
              <div>
                <div className="flex border-b border-border mb-0">
                  {(["write", "preview"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className={cn("px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors",
                        tab === t ? "text-accent border-b border-accent -mb-px" : "text-text-secondary hover:text-text-primary"
                      )}>
                      {t}
                    </button>
                  ))}
                </div>
                {tab === "write" ? (
                  <textarea
                    className={cn(inputCls, "resize-none font-mono text-xs leading-relaxed")}
                    rows={16}
                    placeholder="Write your post in Markdown..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                ) : (
                  <div className="bg-background border border-border p-4 min-h-[320px] prose prose-invert prose-sm max-w-none
                    prose-headings:font-display prose-headings:font-normal prose-p:text-text-secondary prose-p:font-light
                    prose-code:text-accent prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5
                    prose-a:text-accent prose-strong:text-text-primary">
                    <div dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, "<br/>") }} />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm({ ...form, published: !form.published })}
                  className={cn("w-4 h-4 border transition-colors", form.published ? "bg-accent border-accent" : "border-border")} />
                <span className="font-mono text-xs text-text-secondary tracking-wider uppercase">Publish immediately</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 bg-accent text-background font-mono text-xs font-medium tracking-widest uppercase hover:bg-accent-dim transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-border font-mono text-xs text-text-secondary hover:text-text-primary transition-colors tracking-wider uppercase">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-border p-8">
            <h2 className="font-display text-2xl mb-3">Delete post?</h2>
            <p className="text-text-secondary font-light mb-8">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-500 text-white font-mono text-xs tracking-widest uppercase hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-border font-mono text-xs text-text-secondary hover:text-text-primary transition-colors tracking-wider uppercase">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
