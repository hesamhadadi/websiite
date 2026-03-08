"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, FileText, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/auth") return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs text-text-secondary tracking-widest animate-pulse">AUTHENTICATING...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/admin/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-56 bg-surface border-r border-border flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-mono text-sm text-text-secondary hover:text-accent transition-colors">
            <span className="text-accent">{"<"}</span>HN<span className="text-accent">{" />"}</span>
          </Link>
          <p className="font-mono text-xs text-muted mt-1 tracking-widest">ADMIN PANEL</p>
        </div>

        {session.user && (
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="w-6 h-6 rounded-full grayscale" />
            )}
            <span className="font-mono text-xs text-text-secondary truncate">{session.user.name}</span>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors",
                pathname === href ? "text-accent bg-accent/5 border border-accent/20" : "text-text-secondary hover:text-text-primary hover:bg-background/50"
              )}>
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={() => signOut({ callbackUrl: "/admin/auth" })}
            className="flex items-center gap-3 px-3 py-2.5 w-full font-mono text-xs tracking-wider uppercase text-text-secondary hover:text-red-400 transition-colors">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-surface border border-border text-text-secondary">
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-background/80 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 md:ml-56 min-h-screen p-6 md:p-10">{children}</main>
    </div>
  );
}
