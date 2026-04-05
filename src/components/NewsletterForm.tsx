"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Subscription failed");

      setStatus("success");
      setEmail("");
      setMessage("Subscribed. New posts will land in your inbox.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription failed.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          className="w-full border border-border bg-background px-4 py-3 font-mono text-sm text-text-primary outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors",
            status === "loading"
              ? "cursor-not-allowed bg-accent/60 text-background"
              : "bg-accent text-background hover:bg-accent-dim"
          )}
        >
          {status === "loading" ? "Joining..." : "Join Newsletter"}
        </button>
      </div>
      {message && (
        <p className={cn("font-mono text-[11px] uppercase tracking-widest", status === "error" ? "text-red-400" : "text-accent")}>
          {message}
        </p>
      )}
    </form>
  );
}
