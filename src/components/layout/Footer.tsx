import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";

const socials = [
  { href: "https://github.com/hesamhaddadinik", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/hesam-hadadi-557574194/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:hesamhaddadinik@gmail.com", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Newsletter</p>
            <h3 className="mt-3 font-display text-3xl">Stay in the loop</h3>
            <p className="mt-3 max-w-md text-text-secondary">
              Subscribe for new posts, project launches, and portfolio updates.
            </p>
            <div className="mt-6 max-w-lg">
              <NewsletterForm />
            </div>
          </div>

          <div className="md:text-right">
            <p className="font-mono text-xs text-text-secondary tracking-wider">
              © {new Date().getFullYear()} Hesam Haddadi Nik. Built with Next.js & MongoDB.
            </p>
            <div className="mt-5 flex items-center gap-5 md:justify-end">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <Link href="/admin/auth" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-accent">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
