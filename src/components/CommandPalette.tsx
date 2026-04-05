"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const commands = [
  { label: "Home", href: "/", keywords: ["landing", "hero"] },
  { label: "Portfolio", href: "/portfolio", keywords: ["work", "projects"] },
  { label: "Blog", href: "/blog", keywords: ["writing", "posts"] },
  { label: "Contact", href: "/contact", keywords: ["email", "message"] },
  { label: "Admin", href: "/admin", keywords: ["dashboard", "cms"] },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }

      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return commands;
    return commands.filter((command) =>
      [command.label, command.href, ...command.keywords].some((entry) =>
        entry.toLowerCase().includes(normalized)
      )
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/85 backdrop-blur-sm px-4 pt-24" onClick={() => setOpen(false)}>
      <div
        className="mx-auto max-w-2xl overflow-hidden border border-border bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={16} className="text-text-secondary" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages and actions..."
            className="w-full bg-transparent font-mono text-sm text-text-primary outline-none placeholder:text-muted"
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">ESC</span>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2">
          {filtered.map((command) => (
            <button
              key={command.href}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(command.href);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-3 text-left transition-colors hover:bg-background"
              )}
            >
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-text-primary">
                  {command.label}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                  {command.href}
                </div>
              </div>
              <ArrowUpRight size={14} className="text-text-secondary" />
            </button>
          ))}

          {!filtered.length && (
            <div className="px-3 py-8 text-center font-mono text-xs uppercase tracking-widest text-muted">
              No results
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted">
          Tip: press <Link href="/contact" className="text-accent">Cmd/Ctrl + K</Link> from anywhere.
        </div>
      </div>
    </div>
  );
}
