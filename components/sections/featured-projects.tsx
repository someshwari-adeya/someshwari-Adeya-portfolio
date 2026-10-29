"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { ProjectMockup } from "@/components/projects/ProjectMockup";
import { TechBadge } from "@/components/projects/TechBadge";

// Shared ease transition
const t = (delay = 0) => ({ duration: 0.5, ease: "easeOut" as const, delay });

// One-liner challenge/solution/result row
function ChallengeRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-3.5 px-3.5 sm:px-4 py-2 border-b border-white/6 last:border-0">
      <span
        className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0"
        style={{ background: `${color}22`, color }}
      >
        {label}
      </span>
      <p className="text-xs sm:text-[13px] text-white/70 leading-snug">{value}</p>
    </div>
  );
}

// Helper hook to subscribe to CSS media query changes without cascading renders
function useMediaQuery(query: string, serverFallback = true): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback
  );
}

// Single featured project row with sticky stacking effect matching TechSonance landing page
function FeaturedProjectRow({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-10%" });

  // Subscribe to desktop viewport matching without triggering cascading effect renders
  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  // Sticky stack scroll progress: tracks starting to stick until completely scrolled past
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Calculate 3D stacking compression values (scale down and fade out underneath)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  const isEven = index % 2 === 0;

  const hiddenX = { opacity: 0, x: isEven ? -40 : 40 };
  const visibleX = { opacity: 1, x: 0 };
  const hiddenXR = { opacity: 0, x: isEven ? 40 : -40 };

  return (
    <div
      ref={containerRef}
      className="w-full origin-top py-2 sm:py-3 lg:py-4"
      style={{
        position: isDesktop ? "sticky" : "relative",
        top: isDesktop ? `calc(72px + ${index * 14}px)` : "auto",
        zIndex: index + 10,
        // Give preceding cards breathing room under stacked cards
        paddingBottom: isDesktop ? `${(total - 1 - index) * 10}px` : "0px",
      }}
    >
      <motion.div
        style={isDesktop ? { scale, opacity, transformOrigin: "top center" } : {}}
        className="bg-[#0e0f14]/95 rounded-[22px] sm:rounded-[28px] border border-white/8 shadow-[0_16px_50px_rgba(0,0,0,0.6)] p-4 sm:p-6 lg:p-6 xl:p-7 relative overflow-hidden transition-all duration-300 hover:border-white/15"
      >
        {/* Background accent glow */}
        <div
          className="absolute pointer-events-none rounded-full blur-3xl opacity-[0.08]"
          style={{
            background: project.accentColor,
            width: 500,
            height: 500,
            [isEven ? "right" : "left"]: "-100px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Text Side */}
          <div
            className={`flex flex-col gap-2.5 lg:gap-3 relative z-10 order-2 ${
              isEven ? "lg:order-1" : "lg:order-2"
            }`}
          >
            {/* Index + Category */}
            <motion.div
              initial={hiddenX}
              animate={inView ? visibleX : hiddenX}
              transition={t(0)}
              className="flex items-center gap-3"
            >
              <span
                className="text-3xl lg:text-4xl font-black leading-none select-none font-mono"
                style={{ color: `${project.accentColor}35` }}
              >
                0{index + 1}
              </span>
              <div
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(to right, ${project.accentColor}50, transparent)`,
                }}
              />
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                style={{
                  background: `${project.accentColor}18`,
                  color: project.accentColor,
                  borderColor: `${project.accentColor}35`,
                }}
              >
                {project.industry}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={t(0.08)}
              className="text-xl sm:text-2xl lg:text-3xl font-medium leading-[1.2] tracking-tight text-white"
            >
              {project.title}
            </motion.h3>

            {/* Short description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={t(0.14)}
              className="text-xs sm:text-[13px] text-white/65 leading-relaxed max-w-md line-clamp-2"
            >
              {project.shortDescription}
            </motion.p>

            {/* Challenge / Solution / Result Box */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={t(0.2)}
              className="rounded-xl border border-white/8 bg-black/40 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <ChallengeRow
                label="Challenge"
                value={project.challenge}
                color={project.accentColor}
              />
              <ChallengeRow
                label="Solution"
                value={project.solution}
                color={project.accentColor}
              />
              <ChallengeRow
                label="Result"
                value={project.result}
                color={project.accentColor}
              />
            </motion.div>

            {/* Tech stack */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={t(0.26)}
              className="flex flex-wrap gap-1.5 pt-0.5"
            >
              {project.techStack.slice(0, 5).map((tech) => (
                <TechBadge
                  key={tech.name}
                  name={tech.name}
                  category={tech.category}
                  size="sm"
                />
              ))}
              {project.techStack.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/10 text-white/50 border border-white/10">
                  +{project.techStack.length - 5} more
                </span>
              )}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={t(0.32)}
              className="flex items-center gap-4 pt-1.5"
            >
              <Link
                href={`/case-studies/${project.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4f7cff] hover:bg-[#3d69ed] text-white text-xs sm:text-sm font-medium transition-all shadow-[0_0_20px_rgba(79,124,255,0.35)] group"
              >
                <span>View Case Study</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/50 hover:text-white transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </motion.div>
          </div>

          {/* Mockup Side */}
          <motion.div
            initial={hiddenXR}
            animate={inView ? visibleX : hiddenXR}
            transition={t(0.1)}
            className={`relative w-full z-0 order-1 ${
              isEven ? "lg:order-2" : "lg:order-1"
            }`}
            whileHover={{ y: -4 }}
          >
            <ProjectMockup
              gradient={project.mockupGradient}
              title={project.title}
              category={project.category}
              accentColor={project.accentColor}
              screenshotPath={project.screenshotPath}
              liveUrl={project.liveUrl}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Section Header matching TechSonance landing page
function SectionHeader({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="flex flex-col items-start gap-4">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={t(0)}
          className="inline-flex items-center gap-2 bg-[#4f7cff]/10 border border-[#4f7cff]/20 rounded-full px-4 py-1.5"
        >
          <svg
            className="size-3.5 text-[#4f7cff]"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" />
            <rect x="9" y="9" width="5" height="5" rx="1" />
          </svg>
          <span className="text-xs font-mono font-bold text-[#4f7cff] tracking-wider uppercase">
            Featured Work
          </span>
        </motion.div>

        {/* Title + Count */}
        <div className="flex items-end justify-between w-full flex-wrap gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={t(0.08)}
            className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.15] tracking-tight text-white"
          >
            Products  I&apos;ve{" "}
            <span className="italic font-serif text-[#4f7cff]">Engineered.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={t(0.16)}
            className="text-xs font-mono uppercase tracking-[0.14em] text-white/50"
          >
            {total} Production Systems
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={t(0.2)}
          className="text-base text-white/60 max-w-2xl leading-relaxed"
        >
          Real products. Real challenges. Real results. Here&apos;s a look at all the
          systems we&apos;ve built from the ground up across web, mobile, and AI.
        </motion.p>
      </div>
    </div>
  );
}

// Main export showcasing ALL projects listed
export default function FeaturedProjectsSection() {
  const allProjects = projects; // Show all 8 projects as requested

  return (
    <section
      id="projects"
      className="relative bg-[#070709] text-white border-t border-white/6 pb-24"
      aria-label="Featured Projects"
    >
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(79, 124, 255, 0.08), transparent 70%)",
        }}
      />

      <SectionHeader total={allProjects.length} />

      {/* Sticky Stacking Projects Container matching TechSonance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-col gap-6 lg:gap-0">
        {allProjects.map((project, index) => (
          <FeaturedProjectRow
            key={project.slug}
            project={project}
            index={index}
            total={allProjects.length}
          />
        ))}
      </div>
    </section>
  );
}

