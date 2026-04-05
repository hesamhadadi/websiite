import dbConnect from "@/lib/db";
import { TestimonialModel } from "@/models/Testimonial";
import type { Testimonial } from "@/types";

export async function TestimonialsSection() {
  let testimonials: Testimonial[] = [];

  try {
    await dbConnect();
    const items = await TestimonialModel.find({ featured: true }).sort({ createdAt: -1 }).lean();
    testimonials = JSON.parse(JSON.stringify(items));
  } catch {
    testimonials = [
      {
        name: "Product Lead",
        role: "Lead Product Designer",
        company: "Stealth Startup",
        quote: "He ships fast, keeps the UI precise, and improves the product while implementing it.",
        featured: true,
      },
      {
        name: "Engineering Manager",
        role: "Frontend Manager",
        company: "Enterprise SaaS",
        quote: "Reliable on complex frontend systems and unusually strong at turning ambiguous requirements into clean execution.",
        featured: true,
      },
    ];
  }

  if (!testimonials.length) return null;

  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Social Proof</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Testimonials</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.slice(0, 4).map((testimonial) => (
            <blockquote key={`${testimonial.name}-${testimonial.role}`} className="border border-border bg-surface p-6">
              <p className="text-lg leading-relaxed text-text-primary">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-6">
                <div className="font-mono text-xs uppercase tracking-widest text-accent">{testimonial.name}</div>
                <div className="mt-1 text-sm text-text-secondary">
                  {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
