"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Github } from "lucide-react";

export default function AdminAuthPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (session) router.push("/admin");
  }, [session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,240,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,240,76,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            Admin Access
          </span>
          <h1 className="font-display text-5xl mt-3 leading-tight">
            Sign in to
            <span className="italic text-text-secondary"> Panel</span>
          </h1>
          <p className="text-text-secondary font-light mt-3 text-sm">
            Only authorized GitHub accounts can access the admin panel.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/30 bg-red-500/5">
            <p className="font-mono text-xs text-red-400 tracking-wide">
              {error === "AccessDenied"
                ? "Access denied. Your GitHub account is not authorized."
                : "Authentication failed. Please try again."}
            </p>
          </div>
        )}

        <button
          onClick={() => signIn("github", { callbackUrl: "/admin" })}
          className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-surface border border-border hover:border-accent/50 hover:bg-surface/80 transition-all duration-200"
        >
          <Github size={16} className="text-text-secondary group-hover:text-accent transition-colors" />
          <span className="font-mono text-sm tracking-widest uppercase text-text-secondary group-hover:text-text-primary transition-colors">
            Continue with GitHub
          </span>
        </button>

        <p className="font-mono text-xs text-muted text-center mt-6 tracking-wider">
          SECURED BY OAUTH 2.0
        </p>
      </div>
    </div>
  );
}
