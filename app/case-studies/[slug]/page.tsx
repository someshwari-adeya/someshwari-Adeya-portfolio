import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";
import { CaseStudyDetail } from "@/components/sections/case-study-detail";
import Footer from "@/components/sections/footer";

export const instant = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);

  if (!study) {
    return {
      title: "Case Study Not Found | TechSonance Infotech LLP",
    };
  }

  const coverUrl = `/images/case-studies/${study.slug}/cover.png`;

  return {
    title: `${study.title} Case Study | TechSonance Infotech LLP`,
    description: study.summary,
    openGraph: {
      title: `${study.title} - ${study.category} Case Study`,
      description: study.summary,
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: `${study.title} Cover`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} Case Study`,
      description: study.summary,
      images: [coverUrl],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);

  if (!study) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    headline: study.summary,
    description: study.summary,
    image: `/images/case-studies/${study.slug}/cover.png`,
    author: {
      "@type": "Organization",
      name: "TechSonance Infotech LLP",
      url: "https://techsonance.co.in",
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/8">
        <Link
          href="/#projects"
          className="text-xs font-mono uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors"
        >
          ← Back to Projects
        </Link>
        <span className="text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
          {study.category}
        </span>
      </header>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Full Page Case Study Detail */}
      <CaseStudyDetail study={study} />

      {/* TechSonance Website Footer */}
      <Footer />
    </main>
  );
}

