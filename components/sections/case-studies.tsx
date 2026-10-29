"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { WorksWheel, WorksWheelItem } from "@/components/ui/works-wheel";
import { CaseStudy, caseStudies } from "@/lib/case-studies";
import { CaseStudyDetail } from "@/components/sections/case-study-detail";

export function CaseStudiesSection({
  initialSlug,
}: {
  initialSlug?: string;
} = {}) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Transform caseStudies to WorksWheelItem items
  const wheelItems: WorksWheelItem[] = caseStudies.map((cs) => ({
    slug: cs.slug,
    title: cs.title,
    category: cs.category,
    summary: cs.summary,
    image: `/images/case-studies/${cs.slug}/cover.png`,
    fit: cs.fit,
    bg: cs.bg,
  }));

  const openStudy = useCallback((slug: string) => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedSlug(slug);
    // Deep link: update browser URL without full-page reload
    if (typeof window !== "undefined") {
      window.history.pushState({ slug }, "", `/case-studies/${slug}`);
    }
  }, []);

  const closeStudy = useCallback(() => {
    setSelectedSlug(null);
    if (typeof window !== "undefined") {
      // Return to case studies index or homepage
      const isCaseStudiesPage = window.location.pathname.startsWith("/case-studies");
      window.history.pushState(null, "", isCaseStudiesPage ? "/case-studies" : "/#case-studies");
    }
    // Return focus to wheel
    setTimeout(() => {
      previouslyFocusedRef.current?.focus();
    }, 50);
  }, []);

  // Listen to popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const match = window.location.pathname.match(/\/case-studies\/([^/]+)/);
      if (match && match[1]) {
        setSelectedSlug(match[1]);
      } else {
        setSelectedSlug(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Lock body scroll and trap focus when modal is open
  useEffect(() => {
    if (selectedSlug) {
      document.body.style.overflow = "hidden";
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedSlug]);

  const activeStudy = caseStudies.find((c) => c.slug === selectedSlug);

  return (
    <section
      id="case-studies"
      className="relative w-full h-[85svh] md:h-[100svh] min-h-[580px] md:min-h-[640px] bg-[#070709] border-t border-white/6 overflow-hidden"
    >
      {/* Works Wheel Component */}
      <WorksWheel
        items={wheelItems}
        label="Case Studies '26"
        action="View"
        onOpenCaseStudy={openStudy}
        className="size-full"
      />

      {/* Modal Dialog for Case Study Detail */}
      {selectedSlug && activeStudy && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={activeStudy.title}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-8 outline-none animate-in fade-in duration-200"
        >
          {/* Backdrop Blur */}
          <div
            onClick={closeStudy}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full h-full md:h-[92vh] max-w-[1100px] overflow-y-auto rounded-none md:rounded-2xl border-0 md:border md:border-white/10 bg-[#0a0a0c] shadow-2xl scrollbar-thin scrollbar-thumb-white/20">
            <CaseStudyDetail study={activeStudy} onClose={closeStudy} isModal />
          </div>
        </div>
      )}
    </section>
  );
}
export default CaseStudiesSection;

