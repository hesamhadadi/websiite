import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const socials = [
  { href: "https://github.com/hesamhaddadinik", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/hesam-hadadi-557574194/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:hesamhaddadinik@gmail.com", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-mono text-xs text-text-secondary tracking-wider">
          © {new Date().getFullYear()} Hesam Haddadi Nik. Built with Next.js & MongoDB.
        </p>

        <div className="flex items-center gap-5">
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
      </div>
    </footer>
  );
}
