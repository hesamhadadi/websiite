import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs text-accent tracking-widest uppercase mb-6">404</p>
        <h1 className="font-display text-6xl md:text-8xl mb-6">
          Page not
          <span className="italic text-text-secondary"> found.</span>
        </h1>
        <p className="text-text-secondary font-light mb-10">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs text-accent tracking-widest uppercase hover:gap-3 transition-all"
        >
          Back home <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
