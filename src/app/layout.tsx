import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Hesam Haddadi Nik — Senior Frontend Developer",
    template: "%s | Hesam Haddadi Nik",
  },
  description:
    "Senior Frontend Developer with 7+ years of experience building scalable web apps with React, Next.js & TypeScript. Based in Turin, Italy.",
  keywords: ["frontend", "developer", "react", "nextjs", "typescript", "portfolio", "hesam haddadi"],
  authors: [{ name: "Hesam Haddadi Nik" }],
  creator: "Hesam Haddadi Nik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: "Hesam Haddadi Nik — Senior Frontend Developer",
    description: "Senior Frontend Developer with 7+ years of experience building scalable web apps with React, Next.js & TypeScript.",
    siteName: "Hesam Haddadi Nik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hesam Haddadi Nik — Senior Frontend Developer",
    description: "Senior Frontend Developer with 7+ years of experience building scalable web apps.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
