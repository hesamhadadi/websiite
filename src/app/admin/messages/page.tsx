"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/types";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const open = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) {
      await fetch(`/api/messages/${msg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      await fetchMessages();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (selected?._id === id) setSelected(null);
    await fetchMessages();
    setDeleteId(null);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-10">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">Admin</span>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="font-display text-4xl">Messages</h1>
          {unreadCount > 0 && (
            <span className="font-mono text-xs px-2 py-0.5 bg-accent text-background">{unreadCount} new</span>
          )}
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-text-secondary">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <p className="font-mono text-sm text-text-secondary">No messages yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {/* List */}
          <div className="space-y-2">
            {messages.map((m) => (
              <div
                key={m._id}
                onClick={() => open(m)}
                className={cn(
                  "p-4 border cursor-pointer transition-all group",
                  selected?._id === m._id ? "border-accent/30 bg-surface" : "border-border hover:border-accent/20 hover:bg-surface/50",
                  !m.read && "border-l-2 border-l-accent"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {m.read
                      ? <MailOpen size={13} className="text-muted shrink-0" />
                      : <Mail size={13} className="text-accent shrink-0" />
                    }
                    <span className={cn("font-mono text-sm truncate", !m.read ? "text-text-primary" : "text-text-secondary")}>{m.name}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(m._id!); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-secondary hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="font-mono text-xs text-text-secondary mt-1 truncate pl-5">{m.subject}</p>
                {m.createdAt && (
                  <p className="font-mono text-xs text-muted mt-1 pl-5">{formatDate(m.createdAt)}</p>
                )}
              </div>
            ))}
          </div>

          {/* Detail */}
          <div>
            {selected ? (
              <div className="border border-border p-6 bg-surface sticky top-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-mono text-sm text-text-primary">{selected.subject}</h2>
                    <p className="font-mono text-xs text-text-secondary mt-1">{selected.name} · {selected.email}</p>
                    {selected.createdAt && (
                      <p className="font-mono text-xs text-muted mt-0.5">{formatDate(selected.createdAt)}</p>
                    )}
                  </div>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="px-3 py-1.5 border border-border font-mono text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-colors tracking-wider uppercase"
                  >
                    Reply
                  </a>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="text-text-secondary font-light leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border p-16 text-center">
                <p className="font-mono text-xs text-muted">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-border p-8">
            <h2 className="font-display text-2xl mb-3">Delete message?</h2>
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
