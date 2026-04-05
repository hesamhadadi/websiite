"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Check, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import type { Certificate } from "@/types";
import { cn } from "@/lib/utils";

const emptyCertificate: Omit<Certificate, "_id" | "createdAt" | "updatedAt"> = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
  imageUrl: "",
  featured: true,
  skills: [],
};

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState({ ...emptyCertificate });
  const [skillsInput, setSkillsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchCertificates() {
    setLoading(true);
    const response = await fetch("/api/certificates");
    const data = await response.json();
    setCertificates(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCertificates();
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyCertificate });
    setSkillsInput("");
    setShowForm(true);
  }

  function openEdit(certificate: Certificate) {
    setEditing(certificate);
    setForm({
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate || "",
      credentialUrl: certificate.credentialUrl || "",
      imageUrl: certificate.imageUrl || "",
      featured: certificate.featured,
      skills: certificate.skills || [],
    });
    setSkillsInput((certificate.skills || []).join(", "));
    setShowForm(true);
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.[0]) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", files[0]);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await response.json();
      if (response.ok) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      skills: skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean),
    };
    const url = editing ? `/api/certificates/${editing._id}` : "/api/certificates";
    const method = editing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchCertificates();
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    await fetchCertificates();
    setDeleteId(null);
  }

  const inputCls =
    "w-full bg-background border border-border px-3 py-2.5 font-mono text-sm text-text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="font-mono text-xs text-accent tracking-widest uppercase">Admin</span>
          <h1 className="font-display text-4xl mt-2">Certificates</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background font-mono text-xs font-medium tracking-widest uppercase hover:bg-accent-dim transition-colors">
          <Plus size={12} /> New Certificate
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-text-secondary">Loading...</p>
      ) : certificates.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <p className="font-mono text-sm text-text-secondary">No certificates yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <div key={certificate._id} className="border border-border bg-surface overflow-hidden">
              <div className="relative aspect-[4/3] bg-background border-b border-border">
                {certificate.imageUrl ? (
                  <Image src={certificate.imageUrl} alt={certificate.title} fill className="object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted">
                    <BadgeCheck size={32} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl">{certificate.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{certificate.issuer}</p>
                  </div>
                  {certificate.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent border border-accent/30 px-2 py-1">
                      Featured
                    </span>
                  )}
                </div>
                {certificate.skills?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {certificate.skills.map((skill) => (
                      <span key={skill} className="font-mono text-[10px] uppercase tracking-widest border border-border px-2 py-1 text-text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-5 flex items-center gap-2">
                  <button onClick={() => openEdit(certificate)} className="p-2 text-text-secondary hover:text-accent transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(certificate._id!)} className="p-2 text-text-secondary hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-10 bg-background/90 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface border border-border p-8 my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl">{editing ? "Edit Certificate" : "New Certificate"}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <input className={inputCls} placeholder="Certificate title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <div className="grid gap-4 md:grid-cols-2">
                <input className={inputCls} placeholder="Issuer" value={form.issuer} onChange={(event) => setForm({ ...form, issuer: event.target.value })} />
                <input className={inputCls} placeholder="Issue date (e.g. Apr 2026)" value={form.issueDate} onChange={(event) => setForm({ ...form, issueDate: event.target.value })} />
              </div>
              <input className={inputCls} placeholder="Credential URL" value={form.credentialUrl} onChange={(event) => setForm({ ...form, credentialUrl: event.target.value })} />
              <input className={inputCls} placeholder="Skills (comma separated)" value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} />

              <div className="border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">Certificate Image</span>
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-3 py-1.5 border border-border font-mono text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors disabled:opacity-50">
                    <Upload size={11} />
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleUpload(event.target.files)} />
                <input className={inputCls} placeholder="Or paste image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
                {form.imageUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden border border-border bg-background">
                    <Image src={form.imageUrl} alt="Certificate preview" fill className="object-cover" />
                  </div>
                ) : null}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm({ ...form, featured: !form.featured })} className={cn("w-4 h-4 border transition-colors", form.featured ? "bg-accent border-accent" : "border-border")} />
                <span className="font-mono text-xs text-text-secondary tracking-wider uppercase">Feature on homepage</span>
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
            <h2 className="font-display text-2xl mb-3">Delete certificate?</h2>
            <p className="text-text-secondary font-light mb-8">This action cannot be undone.</p>
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
