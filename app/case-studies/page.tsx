import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudiesSection } from "@/components/sections/case-studies";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies | TechSonance Infotech LLP",
  description:
    "Explore our featured engineering case studies across event platforms, logistics SaaS, cloud POS systems, and multi-tenant marketplaces.",
  openGraph: {
    title: "Case Studies | TechSonance Infotech LLP",
    description:
      "Explore our featured engineering case studies across event platforms, logistics SaaS, cloud POS systems, and multi-tenant marketplaces.",
    type: "website",
  },
};

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-[#070709] text-white">
      {/* Top back navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between bg-[#070709]/80 backdrop-blur-xl border-b border-white/6">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors"
        >
          ← Return to Portfolio
        </Link>
        <span className="text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
          Works Wheel &apos;26
        </span>
      </header>

      {/* Main Works Wheel Section */}
      <div className="pt-14 h-screen">
        <CaseStudiesSection />
      </div>

      {/* Visually Hidden Crawlable List for Search Engines */}
      <section className="sr-only" aria-label="All Case Studies Index">
        <h2>All Case Studies</h2>
        <ul>
          {caseStudies.map((cs) => (
            <li key={cs.slug}>
              <Link href={`/case-studies/${cs.slug}`}>
                <h3>{cs.title}</h3>
                <p>{cs.category} - {cs.platform}</p>
                <p>{cs.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

