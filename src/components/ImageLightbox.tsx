"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageLightbox({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("group relative block h-full w-full overflow-hidden text-left", className)}
      >
        <Image src={src} alt={alt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" sizes={sizes} priority={priority} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 border border-white/20 bg-black/55 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <Expand size={12} />
          Click To Enlarge
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md" onClick={() => setOpen(false)}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 z-10 inline-flex h-11 w-11 items-center justify-center border border-border bg-surface text-text-secondary transition-colors hover:text-text-primary"
          >
            <X size={18} />
          </button>
          <div className="relative h-full w-full p-6 md:p-12" onClick={(event) => event.stopPropagation()}>
            <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" priority />
          </div>
        </div>
      )}
    </>
  );
}
