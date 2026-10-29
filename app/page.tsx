"use client";

import React from "react";
import Image from "next/image";
import {
  FullScreenScrollFX,
  SectionItem,
} from "@/components/ui/full-screen-scroll-fx";
import HowIWorkSection from "@/components/sections/how-i-work";
import FeaturedProjectsSection from "@/components/sections/featured-projects";
import ClientFeedback from "@/components/ui/testimonial";
import CtaCalendarSection from "@/components/sections/cta-calendar";
import Footer from "@/components/sections/footer";

export default function Home() {
  const sections: SectionItem[] = [
    {
      id: "profile",
      leftLabel: "Profile",
      title: (
        <div className="flex flex-col items-center text-center px-4 max-w-2xl">
          {/* Profile photo */}
          <div className="relative mb-4 sm:mb-5 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_35px_rgba(255,255,255,0.18)] ring-4 ring-white/5 bg-black relative">
              <Image
                src="/images/profile.png"
                alt="Someshwari Adeya"
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                priority
                className="object-cover object-top filter contrast-105"
              />
            </div>
          </div>

          {/* Primary Name Heading */}
          <span className="font-extrabold tracking-tight text-white text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.05] uppercase">
            Someshwari Adeya
          </span>

          {/* Founder of TechSonance with TechSonance Logo */}
          <div className="mt-3.5 flex items-center justify-center gap-2.5 normal-case tracking-normal">
            <Image
              src="/images/techsonance-logo.png"
              alt="TechSonance"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain filter drop-shadow-[0_0_12px_rgba(59,130,246,0.65)]"
            />
            <span className="text-sm sm:text-base md:text-lg font-semibold text-white/90 tracking-wide">
              Founder, TechSonance Infotech
            </span>
          </div>

          {/* Supporting line */}
          <p className="mt-3 text-xs sm:text-sm md:text-base font-normal tracking-normal text-white/70 max-w-xl leading-relaxed normal-case">
            Leading TechSonance Infotech LLP, a software agency building web, mobile
            and AI products for clients worldwide.
          </p>
        </div>
      ),
      rightLabel: "Surat, India",
      background: "/images/bg-1.jpg",
      gradient:
        "radial-gradient(ellipse at 35% 30%, rgba(55, 65, 80, 0.5) 0%, rgba(20, 24, 30, 0.8) 60%, #050505 100%)",
    },
    {
      id: "engineering",
      leftLabel: "Engineering",
      title: (
        <div className="flex flex-col items-center text-center px-4 max-w-xl">
          <span className="font-extrabold tracking-tight text-white text-[clamp(2rem,5.6vw,4.8rem)] leading-[1.04]">
            Software &amp; AI Engineer
          </span>
          <p className="mt-4 text-xs sm:text-sm md:text-base font-normal tracking-normal text-white/70 max-w-lg leading-relaxed normal-case">
            5+ years of experience building, architecting, and scaling production web and AI systems.
          </p>
        </div>
      ),
      rightLabel: "Production",
      background: "/images/bg-3.jpg",
      gradient:
        "radial-gradient(ellipse at 50% 40%, rgba(48, 68, 88, 0.5) 0%, rgba(16, 24, 32, 0.8) 60%, #050505 100%)",
    },
    {
      id: "selected-work",
      leftLabel: "Selected work",
      title: (
        <div className="flex flex-col items-center text-center px-4 max-w-3xl w-full">
          <span className="font-extrabold tracking-tight text-white text-[clamp(1.8rem,4.5vw,3.8rem)] leading-tight">
            Real products in production
          </span>
          <p className="mt-2 text-xs sm:text-sm md:text-base font-normal tracking-normal text-white/70 max-w-xl leading-relaxed normal-case">
            Successful production systems engineered and shipped worldwide.
          </p>

          {/* Asymmetrical scattered floating logos - proportional responsive width and height */}
          <div className="mt-10 sm:mt-14 w-full max-w-4xl px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 pointer-events-auto">
            {/* FreightFlow - Elongated sleek mark */}
            <div className="transform -translate-y-2 sm:-translate-y-5 hover:-translate-y-6 transition-all duration-300">
              <Image
                src="/images/projects/freightflow-white.png"
                alt="FreightFlow"
                width={160}
                height={40}
                className="w-[96px] h-[24px] sm:w-[128px] sm:h-[32px] md:w-[160px] md:h-[40px] object-contain filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.18)] opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              />
            </div>

            {/* MasterWeg - Prominent big anchor mark */}
            <div className="transform translate-y-3 sm:translate-y-4 hover:translate-y-2 transition-all duration-300">
              <Image
                src="/images/projects/masterweg.png"
                alt="MasterWeg"
                width={180}
                height={64}
                className="w-[101px] h-[36px] sm:w-[135px] sm:h-[48px] md:w-[158px] md:h-[56px] lg:w-[180px] lg:h-[64px] object-contain filter drop-shadow-[0_4px_24px_rgba(246,143,29,0.35)] opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              />
            </div>

            {/* ZION - Vibrant neon violet brand mark */}
            <div className="transform -translate-y-3 sm:-translate-y-4 hover:-translate-y-5 transition-all duration-300">
              <Image
                src="/images/projects/zion-cropped.png"
                alt="ZION"
                width={140}
                height={48}
                className="w-[82px] h-[28px] sm:w-[117px] sm:h-[40px] md:w-[140px] md:h-[48px] object-contain filter drop-shadow-[0_4px_20px_rgba(198,142,254,0.5)] opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              />
            </div>

            {/* AI Chatbot - Enterprise RAG & intelligent neural mark */}
            <div className="transform translate-y-2 sm:translate-y-5 hover:translate-y-3 transition-all duration-300">
              <Image
                src="/images/projects/ai-chatbot-logo.png"
                alt="AI Chatbot"
                width={140}
                height={48}
                className="w-[93px] h-[32px] sm:w-[117px] sm:h-[40px] md:w-[140px] md:h-[48px] object-contain filter drop-shadow-[0_4px_22px_rgba(59,130,246,0.45)] opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              />
            </div>
          </div>
        </div>
      ),
      rightLabel: "Shipped",
      background: "/images/bg-4.jpg",
      gradient:
        "radial-gradient(ellipse at 50% 55%, rgba(62, 52, 78, 0.5) 0%, rgba(22, 18, 28, 0.8) 60%, #050505 100%)",
    },
    {
      id: "contact",
      leftLabel: "Contact",
      title: (
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl md:pl-2">
          <span className="font-extrabold tracking-tight text-white text-[clamp(2rem,6vw,4.8rem)]">
            Let&apos;s build
          </span>
          <p className="mt-4 text-xs sm:text-sm md:text-base font-normal tracking-normal text-neutral-300 leading-relaxed normal-case">
            Have a project in mind or want to explore working together? Drop a line.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-6 normal-case tracking-normal">
            <a
              href="mailto:somyarudra9@gmail.com"
              className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-white/90 hover:text-white transition-colors duration-200 pointer-events-auto cursor-pointer focus:outline-none"
            >
              <span className="border-b border-white/30 pb-0.5 group-hover:border-white transition-colors duration-200">
                Email
              </span>
              <span
                className="text-white/50 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs sm:text-sm"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>

            <span className="w-1 h-1 rounded-full bg-white/30 inline-block select-none pointer-events-none" aria-hidden="true" />

            <a
              href="https://www.linkedin.com/in/someshwari-adeya-229584207/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-white/90 hover:text-white transition-colors duration-200 pointer-events-auto cursor-pointer focus:outline-none"
            >
              <span className="border-b border-white/30 pb-0.5 group-hover:border-white transition-colors duration-200">
                LinkedIn
              </span>
              <span
                className="text-white/50 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs sm:text-sm"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>

            <span className="w-1 h-1 rounded-full bg-white/30 inline-block select-none pointer-events-none" aria-hidden="true" />

            <a
              href="https://github.com/someshwari-rudra"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-white/90 hover:text-white transition-colors duration-200 pointer-events-auto cursor-pointer focus:outline-none"
            >
              <span className="border-b border-white/30 pb-0.5 group-hover:border-white transition-colors duration-200">
                GitHub
              </span>
              <span
                className="text-white/50 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs sm:text-sm"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          </div>

          <a
            href="mailto:somyarudra9@gmail.com"
            className="mt-3.5 inline-block text-xs text-white/50 hover:text-white/80 transition-colors font-mono select-all normal-case tracking-normal"
          >
            somyarudra9@gmail.com
          </a>
        </div>
      ),
      rightLabel: "Say hello",
      renderBackground: (active) => (
        <div
          style={{
            opacity: active ? 1 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
          className="absolute inset-0 overflow-hidden bg-black"
        >
          {/* Luminous radial studio aura */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 78% 68%, rgba(80, 85, 105, 0.5) 0%, rgba(25, 28, 35, 0.85) 45%, #000000 100%)",
            }}
          />

          {/* Large faint outlined text of SOMESHWARI ADEYA for depth */}
          <div
            aria-hidden="true"
            className="absolute right-2 md:right-8 lg:right-16 bottom-[10vh] select-none pointer-events-none font-black tracking-tighter text-right flex flex-col items-end"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 12rem)",
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.12)",
              color: "transparent",
              opacity: 0.7,
              lineHeight: 0.82,
            }}
          >
            <span>SOMESHWARI</span>
            <span>ADEYA</span>
          </div>

          {/* Someshwari portrait photo anchored bottom-center / bottom-right */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center md:justify-end items-end h-[85vh] md:h-[90vh] pr-0 md:pr-10 lg:pr-24 pointer-events-none">
            <div className="relative h-full w-auto flex items-end">
              <Image
                src="/images/profile-bw.png"
                alt="Someshwari Adeya — Founder, TechSonance Infotech"
                width={700}
                height={1050}
                priority
                className="h-full w-auto max-w-[90vw] md:max-w-none object-contain object-bottom filter contrast-110 brightness-95 opacity-85 md:opacity-100"
              />
              {/* Subtle bottom gradient so the photo fades into the black stage */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, #000000 20%, rgba(0,0,0,0.85) 60%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="relative min-h-screen bg-black text-[#f5f5f5]">
      {/* Semantic hidden content for SEO & screen readers */}
      <div className="sr-only">
        <h1>Someshwari Adeya — Founder, TechSonance Infotech LLP</h1>
        <p>
          I founded and lead TechSonance Infotech LLP, a software agency based in
          Surat, India, building web, mobile, and AI products for clients
          worldwide.
        </p>
        <h2>Software &amp; AI Engineer (5+ Years of Experience)</h2>
        <p>
          5+ years of experience building, architecting, and scaling production web and AI systems.
        </p>
        <h2>Selected Work — Real Products in Production</h2>
        <p>
          ZION (Community App), MasterWeg (EdTech SaaS), FreightFlow (Logistics SaaS),
          and Enterprise AI Chatbot (RAG &amp; LLMs).
        </p>
        <h2>Contact &amp; Connect</h2>
        <p>Email: somyarudra9@gmail.com | Location: Surat, India</p>
      </div>

      <FullScreenScrollFX
        sections={sections}
        header={
          <div className="flex flex-col items-center gap-1">
            <div className="text-sm sm:text-base uppercase tracking-[0.25em] text-white/90 font-bold">
              Someshwari Adeya
            </div>
            <div className="text-xs sm:text-sm uppercase tracking-[0.18em] text-white/50 font-medium">
              Founder, TechSonance
            </div>
          </div>
        }
        colors={{
          text: "rgba(245,245,245,0.94)",
          overlay: "rgba(0,0,0,0.38)",
          pageBg: "#050505",
          stageBg: "#000000",
        }}
        bgTransition="fade"
        durations={{ change: 0.8, snap: 900 }}
      />

      {/* Bento "How I work" Section */}
      <HowIWorkSection />

      {/* Featured Projects Section (Sticky 3D Stacking Cards - All 8 Projects) */}
      <FeaturedProjectsSection />

      {/* Verified Client Testimonials Section */}
      <ClientFeedback />

      {/* Engineering Consultation & Live Calendar Section */}
      <CtaCalendarSection />

      {/* TechSonance Website Footer */}
      <Footer />
    </main>
  );
}
