"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Plus, X, Star, ExternalLink, Github, Upload, ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import Image from "next/image";

const empty: Omit<Project, "_id" | "createdAt"> = {
  title: "",
  description: "",
  longDescription: "",
  tags: [],
  githubUrl: "",
  liveUrl: "",
  image: "",
  images: [],
  featured: false,
  year: new Date().getFullYear(),
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty });
    setTagsInput("");
    setUploadError(null);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      longDescription: p.longDescription || "",
      tags: p.tags,
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      image: p.image || "",
      images: p.images || [],
      featured: p.featured,
      year: p.year,
    });
    setTagsInput(p.tags.join(", "));
    setUploadError(null);
    setShowForm(true);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) { setUploadError("Only image files allowed."); continue; }
      if (file.size > 10 * 1024 * 1024) { setUploadError("Max file size is 10MB."); continue; }
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) { setUploadError(data.error || "Upload failed"); }
        else { newUrls.push(data.url); }
      } catch { setUploadError("Upload failed. Check Cloudinary configuration."); }
    }

    if (newUrls.length > 0) {
      setForm((prev) => {
        const updatedImages = [...(prev.images || []), ...newUrls];
        const primaryImage = prev.image || newUrls[0];
        return { ...prev, images: updatedImages, image: primaryImage };
      });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSetPrimary = (url: string) => setForm((prev) => ({ ...prev, image: url }));

  const handleRemoveImage = (url: string) => {
    setForm((prev) => {
      const updatedImages = (prev.images || []).filter((img) => img !== url);
      const primaryImage = prev.image === url ? updatedImages[0] || "" : prev.image;
      return { ...prev, images: updatedImages, image: primaryImage };
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    const payload = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    const url = editing ? `/api/projects/${editing._id}` : "/api/projects";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    await fetchProjects();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await fetchProjects();
    setDeleteId(null);
  };

  const inputCls = "w-full bg-background border border-border px-3 py-2.5 font-mono text-sm text-text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="font-mono text-xs text-accent tracking-widest uppercase">Admin</span>
          <h1 className="font-display text-4xl mt-2">Projects</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background font-mono text-xs font-medium tracking-widest uppercase hover:bg-accent-dim transition-colors">
          <Plus size={12} /> New Project
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-text-secondary">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <p className="font-mono text-sm text-text-secondary">No projects yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p._id} className="flex items-center gap-4 p-4 border border-border bg-surface hover:border-accent/20 transition-colors group">
              <div className="w-12 h-12 shrink-0 bg-background border border-border overflow-hidden">
                {p.image ? (
                  <Image src={p.image} alt={p.title} width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={16} className="text-muted" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-text-primary truncate">{p.title}</span>
                  {p.featured && <Star size={10} className="text-accent fill-accent shrink-0" />}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-xs text-muted">{p.year}</span>
                  {p.images && p.images.length > 0 && (
                    <span className="font-mono text-xs text-muted">{p.images.length} photo{p.images.length !== 1 ? "s" : ""}</span>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="font-mono text-xs px-1.5 py-0.5 border border-border text-muted">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="p-2 text-text-secondary hover:text-accent transition-colors"><ExternalLink size={13} /></a>}
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="p-2 text-text-secondary hover:text-accent transition-colors"><Github size={13} /></a>}
                <button onClick={() => openEdit(p)} className="p-2 text-text-secondary hover:text-accent transition-colors"><Pencil size={13} /></button>
                <button onClick={() => setDeleteId(p._id!)} className="p-2 text-text-secondary hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-10 bg-background/90 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface border border-border p-8 my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl">{editing ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-text-primary transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input className={inputCls} placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className={cn(inputCls, "resize-none")} rows={2} placeholder="Short description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <textarea className={cn(inputCls, "resize-none")} rows={4} placeholder="Long description (optional)" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} />
              <input className={inputCls} placeholder="Tags (comma separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <input className={inputCls} placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                <input className={inputCls} placeholder="Live URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
              </div>
              <input className={cn(inputCls, "w-1/2")} type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />

              {/* ── Image Upload Section ── */}
              <div className="border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-secondary tracking-wider uppercase">Project Images</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-1.5 border border-border font-mono text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors disabled:opacity-50"
                  >
                    <Upload size={11} />
                    {uploading ? "Uploading..." : "Upload Images"}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
                </div>

                {uploadError && <p className="font-mono text-xs text-red-400">{uploadError}</p>}

                {(form.images || []).length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {(form.images || []).map((url) => {
                      const isPrimary = form.image === url;
                      return (
                        <div
                          key={url}
                          className={cn("relative group aspect-video bg-background border overflow-hidden cursor-pointer", isPrimary ? "border-accent" : "border-border hover:border-accent/50")}
                          onClick={() => handleSetPrimary(url)}
                        >
                          <Image src={url} alt="Project image" fill className="object-cover" />
                          {isPrimary && (
                            <div className="absolute top-1 left-1 bg-accent text-background px-1.5 py-0.5 font-mono text-[9px] tracking-widest uppercase flex items-center gap-1">
                              <Check size={8} /> Primary
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(url); }}
                            className="absolute top-1 right-1 w-5 h-5 bg-background/80 text-text-primary hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={10} />
                          </button>
                          {!isPrimary && (
                            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="font-mono text-[9px] text-text-primary tracking-widest uppercase">Set Primary</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-dashed border-border p-8 text-center cursor-pointer hover:border-accent/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={24} className="text-muted mx-auto mb-2" />
                    <p className="font-mono text-xs text-muted">Click to upload images</p>
                    <p className="font-mono text-[10px] text-muted mt-1 opacity-60">Multiple files supported · Max 10MB each</p>
                  </div>
                )}

                {(form.images || []).length > 0 && (
                  <p className="font-mono text-[10px] text-muted">Click an image to set it as the primary cover image</p>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm({ ...form, featured: !form.featured })} className={cn("w-4 h-4 border transition-colors", form.featured ? "bg-accent border-accent" : "border-border")} />
                <span className="font-mono text-xs text-text-secondary tracking-wider uppercase">Featured project</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-accent text-background font-mono text-xs font-medium tracking-widest uppercase hover:bg-accent-dim transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-border font-mono text-xs text-text-secondary hover:text-text-primary transition-colors tracking-wider uppercase">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-border p-8">
            <h2 className="font-display text-2xl mb-3">Delete project?</h2>
            <p className="text-text-secondary font-light mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-500 text-white font-mono text-xs tracking-widest uppercase hover:bg-red-600 transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-border font-mono text-xs text-text-secondary hover:text-text-primary transition-colors tracking-wider uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
