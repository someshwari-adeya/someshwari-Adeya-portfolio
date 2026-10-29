"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";
import { CaseStudy, caseStudies } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

// Map stack names to icon filenames in public/tech-icons/
function getTechIconSrc(name: string): string | null {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const map: Record<string, string> = {
    flutter: "/tech-icons/flutter.svg",
    dart: "/tech-icons/dart.svg",
    react: "/tech-icons/react.svg",
    react19: "/tech-icons/react.svg",
    reactnative: "/tech-icons/react.svg",
    nextjs: "/tech-icons/nextjs.svg",
    nextjs16: "/tech-icons/nextjs.svg",
    typescript: "/tech-icons/typescript.svg",
    tailwind: "/tech-icons/tailwind.svg",
    tailwindcss: "/tech-icons/tailwind.svg",
    tailwindcss4: "/tech-icons/tailwind.svg",
    nodejs: "/tech-icons/nodejs.svg",
    nestjs: "/tech-icons/nestjs.svg",
    expressjs: "/tech-icons/express.svg",
    express: "/tech-icons/express.svg",
    postgresql: "/tech-icons/postgresql.svg",
    supabase: "/tech-icons/supabase.svg",
    firebase: "/tech-icons/firebase.svg",
    docker: "/tech-icons/docker.svg",
    sentry: "/tech-icons/sentry.svg",
    postman: "/tech-icons/postman.svg",
    redux: "/tech-icons/redux.svg",
    reduxtoolkit: "/tech-icons/redux.svg",
    vite: "/tech-icons/vite.svg",
    vite7: "/tech-icons/vite.svg",
    expo: "/tech-icons/expo.svg",
    mongodb: "/tech-icons/mongodb.svg",
    python: "/tech-icons/python.svg",
    aws: "/tech-icons/aws.svg",
  };
  return map[norm] || null;
}

export function CaseStudyDetail({
  study,
  onClose,
  isModal = false,
}: {
  study: CaseStudy;
  onClose?: () => void;
  isModal?: boolean;
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Index for Prev/Next
  const currentIndex = caseStudies.findIndex((c) => c.slug === study.slug);
  const prevStudy =
    currentIndex > 0 ? caseStudies[currentIndex - 1] : caseStudies[caseStudies.length - 1];
  const nextStudy =
    currentIndex < caseStudies.length - 1 ? caseStudies[currentIndex + 1] : caseStudies[0];

  const totalStackCount = study.stack.reduce((acc, g) => acc + g.items.length, 0);

  // Sections list for sticky nav
  const navSections = [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "Challenge" },
    { id: "solution", label: "Solution" },
    { id: "challenges-faced", label: "Challenges" },
    { id: "results", label: "Results" },
    { id: "gallery", label: "Gallery" },
  ];

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      navSections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) {
          const top = el.offsetTop - 120;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            setActiveSection(s.id);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation for lightbox & close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else if (onClose) {
          onClose();
        }
      } else if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") {
          setLightboxIndex((prev) =>
            prev !== null && prev < study.gallery.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : study.gallery.length - 1
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, onClose, study.gallery.length]);

  return (
    <article className="relative w-full text-white bg-[#0a0a0c] selection:bg-[#4f7cff] selection:text-white pb-20">
      {/* Top Banner / Modal Header */}
      {isModal && (
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#4f7cff] px-2.5 py-0.5 rounded-full bg-[#4f7cff]/10 border border-[#4f7cff]/20">
              {study.category}
            </span>
            <span className="text-sm font-medium text-white/90 hidden sm:inline">
              {study.title}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer focus:outline-none"
              aria-label="Close case study"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="px-6 sm:px-10 lg:px-16 pt-8 pb-12 max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-[0.14em] text-white/50">
            <span>{study.category}</span>
            <span>·</span>
            <span className="text-white/80">{study.platform}</span>
            {study.location && (
              <>
                <span>·</span>
                <span>{study.location}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15]">
            {study.title}
          </h1>

          <p className="text-base sm:text-xl text-white/70 max-w-3xl leading-relaxed mt-1">
            {study.summary}
          </p>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4f7cff] hover:bg-[#3d69ed] text-white text-sm font-medium transition-all shadow-[0_0_24px_rgba(79,124,255,0.35)]"
              >
                <span>Visit site / Live demo</span>
                <ExternalLink className="size-4" />
              </a>
            )}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-medium transition-all"
            >
              <span>Book consultation</span>
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        {/* Hero Cover Graphic */}
        <div
          className={cn(
            "mt-10 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl",
            study.fit === "contain"
              ? "p-6 sm:p-12 flex items-center justify-center min-h-[380px] sm:min-h-[500px]"
              : "aspect-[16/10] w-full"
          )}
          style={{
            background:
              study.bg ||
              (study.fit === "contain"
                ? "radial-gradient(circle at center, #1b1c24 0%, #0e0f14 100%)"
                : "#111215"),
          }}
        >
          <img
            src={`/images/case-studies/${study.slug}/cover.png`}
            alt={`${study.title} cover`}
            className={cn(
              "w-full max-h-full",
              study.fit === "contain"
                ? "max-w-[420px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
                : "h-full object-cover"
            )}
          />
        </div>
      </section>

      {/* 2. SNAPSHOT BAR */}
      <section className="border-y border-white/[0.08] bg-[#0e0e12]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 text-sm">
          {study.client && (
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
                Client
              </span>
              <span className="font-medium text-white/90">{study.client}</span>
            </div>
          )}
          <div>
            <span className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
              Industry
            </span>
            <span className="font-medium text-white/90">{study.category}</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
              Platform
            </span>
            <span className="font-medium text-white/90">{study.platform}</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
              Tech Stack
            </span>
            <span className="font-medium text-[#4f7cff]">{totalStackCount} Technologies</span>
          </div>
          {study.location && (
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
                Location
              </span>
              <span className="font-medium text-white/90">{study.location}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. STICKY MINI-NAV */}
      <div className="sticky top-[57px] z-40 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/[0.06] overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center gap-6 py-3 min-w-max">
          {navSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "text-xs font-mono uppercase tracking-wider transition-colors duration-200",
                activeSection === s.id
                  ? "text-[#4f7cff] font-medium"
                  : "text-white/45 hover:text-white/80"
              )}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 space-y-20 pt-12">
        {/* 4. OVERVIEW */}
        <section id="overview" className="scroll-mt-32 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
            <Sparkles className="size-3.5" />
            <span>Overview</span>
          </div>
          <div className="space-y-4 text-base sm:text-lg text-white/80 leading-relaxed max-w-4xl">
            {study.overview.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* 5. THE CHALLENGE */}
        <section id="challenge" className="scroll-mt-32 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
            <AlertCircle className="size-3.5" />
            <span>The Challenge</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-white/90 leading-snug max-w-3xl">
            {study.challenge.text}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {study.challenge.points.map((pt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="size-2 rounded-full bg-red-400/80 mt-2 shrink-0" />
                <span className="text-sm text-white/75 leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. WHAT WE SOLVED & HOW WE SOLVED IT */}
        <section id="solution" className="scroll-mt-32 space-y-12">
          {/* What We Solved */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
              <CheckCircle2 className="size-3.5" />
              <span>What We Solved</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.solved.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#4f7cff]/[0.04] border border-[#4f7cff]/20"
                >
                  <CheckCircle2 className="size-4 text-[#4f7cff] shrink-0 mt-0.5" />
                  <span className="text-sm text-white/90 font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How We Solved It (Numbered Steps) */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
              Engineering Architecture and Solutions
            </h3>
            <div className="space-y-6">
              {study.howWeSolved.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-sm font-semibold text-[#4f7cff] px-2.5 py-1 rounded-md bg-[#4f7cff]/10 border border-[#4f7cff]/20 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="space-y-2">
                      <h4 className="text-base sm:text-lg font-medium text-white">
                        {step.title}
                      </h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {step.detail}
                      </p>
                      {step.bullets && step.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-2">
                          {step.bullets.map((b, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-2 text-xs sm:text-sm text-white/60"
                            >
                              <span className="text-[#4f7cff] mt-0.5">›</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CHALLENGES WE FACED */}
        <section id="challenges-faced" className="scroll-mt-32 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
            <Layers className="size-3.5" />
            <span>Challenges We Faced</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {study.challengesFaced.map((ch, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-3"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-medium block mb-1">
                    Problem
                  </span>
                  <p className="text-sm font-medium text-white/90 leading-snug">
                    {ch.problem}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#4f7cff] font-medium block mb-1">
                    How We Handled It
                  </span>
                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                    {ch.handling}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. RESULTS */}
        <section id="results" className="scroll-mt-32 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
            <Sparkles className="size-3.5" />
            <span>Measurable Results</span>
          </div>

          {/* Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {study.results.stats.map((st, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#4f7cff]/[0.05] border border-[#4f7cff]/20 flex flex-col justify-between"
              >
                <div className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/60 mt-2">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Plain Language Bullets */}
          <div className="space-y-2 pt-2">
            {study.results.points.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-white/80">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 9. TECH STACK */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
            <Layers className="size-3.5" />
            <span>Tech Stack</span>
          </div>
          <div className="space-y-6">
            {study.stack.map((group) => (
              <div key={group.group} className="space-y-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                  {group.group}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((tech) => {
                    const iconSrc = getTechIconSrc(tech);
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/90 font-medium hover:border-white/20 transition-colors"
                      >
                        {iconSrc && (
                          <img
                            src={iconSrc}
                            alt=""
                            className="size-4 object-contain filter invert-0"
                          />
                        )}
                        <span>{tech}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. SCREENSHOTS GALLERY */}
        <section id="gallery" className="scroll-mt-32 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
            <Layers className="size-3.5" />
            <span>Screenshots Gallery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {study.gallery.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-xl border border-white/10 overflow-hidden bg-[#111215] cursor-pointer hover:border-[#4f7cff]/50 transition-all shadow-lg"
                style={{
                  aspectRatio: img.ratio > 0.8 ? "16/10" : "9/16",
                  maxHeight: img.ratio < 0.8 ? "480px" : "auto",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className={cn(
                    "size-full transition-transform duration-300 group-hover:scale-105",
                    img.ratio < 0.8 ? "object-contain p-3" : "object-cover"
                  )}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-medium text-white px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                    Click to enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. TESTIMONIAL (IF PRESENT) */}
        {study.testimonial && (
          <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#161722] to-[#0d0e14] border border-white/10 relative overflow-hidden">
            <Quote className="size-12 text-[#4f7cff]/20 absolute top-6 right-6 pointer-events-none" />
            <div className="space-y-4 max-w-3xl relative z-10">
              <p className="text-base sm:text-xl font-normal text-white/90 italic leading-relaxed">
                &ldquo;{study.testimonial.quote}&rdquo;
              </p>
              <div className="pt-2">
                <span className="font-semibold text-white block">
                  {study.testimonial.name}
                </span>
                <span className="text-xs text-white/50 block font-mono">
                  {study.testimonial.role} · {study.testimonial.company} ({study.testimonial.place})
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 12. CTA & PREV / NEXT NAVIGATION */}
        <section className="pt-8 border-t border-white/[0.08] space-y-12">
          {/* CTA Box */}
          <div className="text-center p-8 sm:p-12 rounded-2xl bg-[#0f1015] border border-white/10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-medium text-white">
              Have a similar product in mind?
            </h3>
            <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto">
              Let&apos;s talk through your architecture, scoping and technical execution on a free consultation call.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4f7cff] hover:bg-[#3d69ed] text-white font-medium text-sm transition-all shadow-[0_0_24px_rgba(79,124,255,0.4)]"
              >
                <span>Book a free consultation</span>
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>

          {/* Prev / Next Case Study Links */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Link
              href={`/case-studies/${prevStudy.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group text-left"
            >
              <ChevronLeft className="size-5 text-white/40 group-hover:text-white transition-colors" />
              <div>
                <span className="block text-[10px] font-mono uppercase text-white/40 tracking-wider">
                  Previous Project
                </span>
                <span className="text-sm font-medium text-white/90 group-hover:text-[#4f7cff] transition-colors">
                  {prevStudy.title}
                </span>
              </div>
            </Link>

            <Link
              href={`/case-studies/${nextStudy.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group text-right"
            >
              <div>
                <span className="block text-[10px] font-mono uppercase text-white/40 tracking-wider">
                  Next Project
                </span>
                <span className="text-sm font-medium text-white/90 group-hover:text-[#4f7cff] transition-colors">
                  {nextStudy.title}
                </span>
              </div>
              <ChevronRight className="size-5 text-white/40 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </section>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="size-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : study.gallery.length - 1
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={study.gallery[lightboxIndex].src}
              alt={study.gallery[lightboxIndex].alt}
              className="max-h-[85vh] max-w-full rounded-lg object-contain drop-shadow-2xl"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null && prev < study.gallery.length - 1 ? prev + 1 : 0
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-50"
            aria-label="Next image"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}
    </article>
  );
}

