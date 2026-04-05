import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/db";
import { CertificateModel } from "@/models/Certificate";
import type { Certificate } from "@/types";

export async function CertificatesSection() {
  let certificates: Certificate[] = [];

  try {
    await dbConnect();
    certificates = JSON.parse(
      JSON.stringify(await CertificateModel.find({ featured: true }).sort({ createdAt: -1 }).limit(6).lean())
    );
  } catch {
    certificates = [];
  }

  if (!certificates.length) return null;

  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">Credentials</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Selected certifications</h2>
            <p className="mt-4 max-w-2xl text-text-secondary">
              A visible trust layer for recruiters and clients: platform-backed learning, specialization, and recent technical training.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate._id} className="group overflow-hidden border border-border bg-surface">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-background">
                {certificate.imageUrl ? (
                  <Image src={certificate.imageUrl} alt={certificate.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-text-secondary">
                    {certificate.issuer}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {certificate.issuer}
                </div>
                <h3 className="mt-3 font-display text-2xl">{certificate.title}</h3>
                {certificate.issueDate ? (
                  <p className="mt-2 text-sm text-text-secondary">{certificate.issueDate}</p>
                ) : null}
                {certificate.skills?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {certificate.skills.map((skill) => (
                      <span key={skill} className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
                {certificate.credentialUrl ? (
                  <Link href={certificate.credentialUrl} target="_blank" className="mt-5 inline-flex font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:text-accent-dim">
                    View Credential
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
