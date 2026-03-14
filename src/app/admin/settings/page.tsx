"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, User, Save, Check } from "lucide-react";
import Image from "next/image";

export default function AdminSettings() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data.avatar_url) setAvatarUrl(data.avatar_url); });
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) { setError("Only image files allowed."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Max 10MB."); return; }
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed"); }
      else { setAvatarUrl(data.url); }
    } catch { setError("Upload failed."); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar_url: avatarUrl }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full bg-background border border-border px-3 py-2.5 font-mono text-sm text-text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <div>
      <div className="mb-10">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">Admin</span>
        <h1 className="font-display text-4xl mt-2">Settings</h1>
        <p className="text-text-secondary font-light mt-1">Manage your profile and site settings.</p>
      </div>

      <div className="max-w-xl space-y-8">
        {/* Avatar */}
        <div className="border border-border p-6 space-y-5">
          <div className="flex items-center gap-3">
            <User size={14} className="text-accent" />
            <span className="font-mono text-xs text-text-secondary tracking-widest uppercase">Profile Photo</span>
          </div>

          <div className="flex items-start gap-6">
            {/* Preview */}
            <div className="relative w-24 h-28 shrink-0 border border-border overflow-hidden bg-surface">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={24} className="text-muted" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            </div>

            <div className="flex-1 space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 border border-border font-mono text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors disabled:opacity-50 tracking-widest uppercase"
              >
                <Upload size={11} />
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <p className="font-mono text-[10px] text-muted">Or paste a URL below · Max 10MB</p>
            </div>
          </div>

          <input
            className={inputCls}
            placeholder="https://... (image URL)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />

          {error && <p className="font-mono text-xs text-red-400">{error}</p>}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-mono text-xs font-medium tracking-widest uppercase hover:bg-accent-dim transition-colors disabled:opacity-50"
        >
          {saved ? <><Check size={12} /> Saved!</> : saving ? "Saving..." : <><Save size={12} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
