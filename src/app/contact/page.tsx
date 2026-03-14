"use client";

import { useState } from "react";
import { Send, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const socials = [
  { href: "https://github.com/hesamhaddadinik", icon: Github, label: "GitHub", handle: "@hesamhaddadinik" },
  { href: "https://www.linkedin.com/in/hesam-hadadi-557574194/", icon: Linkedin, label: "LinkedIn", handle: "Hesam Haddadi Nik" },
  { href: "mailto:hesamhaddadinik@gmail.com", icon: Mail, label: "Email", handle: "hesamhaddadinik@gmail.com" },
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setStatus("error");
    }
  };

  const inputClass = "w-full bg-surface border border-border px-4 py-3 font-mono text-sm text-text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200";

  return (
    <div className="min-h-screen pt-28 px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-20">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            004 — Contact
          </span>
          <h1 className="font-display text-6xl md:text-8xl mt-4 leading-tight">
            Get in
            <span className="italic text-text-secondary"> Touch</span>
          </h1>
          <p className="text-text-secondary mt-6 font-light max-w-lg">
            Have a project, an idea, or just want to say hi?
            My inbox is always open.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className={inputClass}
              />
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                rows={8}
                value={form.message}
                onChange={handleChange}
                className={cn(inputClass, "resize-none")}
              />

              {error && (
                <p className="font-mono text-xs text-red-400 tracking-wide">{error}</p>
              )}

              {status === "success" ? (
                <div className="border border-accent/30 bg-accent/5 p-4">
                  <p className="font-mono text-sm text-accent tracking-wide">
                    ✓ Message sent! I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className={cn(
                    "group w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-background font-mono text-sm font-medium tracking-widest uppercase transition-all duration-200",
                    status === "loading" ? "opacity-60 cursor-not-allowed" : "hover:bg-accent-dim"
                  )}
                >
                  {status === "loading" ? "Sending..." : (
                    <>
                      Send Message
                      <Send size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-mono text-xs text-text-secondary tracking-widest uppercase mb-8">
              Find me elsewhere
            </h3>
            <div className="space-y-1">
              {socials.map(({ href, icon: Icon, label, handle }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 border border-transparent hover:border-border hover:bg-surface transition-all duration-200"
                >
                  <Icon size={16} className="text-text-secondary group-hover:text-accent transition-colors" />
                  <div>
                    <div className="font-mono text-xs text-text-secondary group-hover:text-accent transition-colors tracking-wider uppercase">{label}</div>
                    <div className="text-sm text-text-primary font-light mt-0.5">{handle}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-12 p-6 border border-border">
              <p className="font-mono text-xs text-text-secondary tracking-widest uppercase mb-2">Response time</p>
              <p className="text-text-primary font-light">Usually within 24–48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
