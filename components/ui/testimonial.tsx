"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { TimelineContent } from "@/components/ui/timeline-animation";

export function ClientFeedback() {
  const testimonialRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.18,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <main className="w-full bg-[#070709] text-white relative overflow-hidden border-t border-[#4f7cff]/20">
      {/* Background: Ambient subtle blue grid pattern matching theme */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 10%, rgba(79, 124, 255, 0.15) 0%, transparent 70%),
            linear-gradient(to right, rgba(79, 124, 255, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(79, 124, 255, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 52px 52px, 52px 52px",
        }}
        aria-hidden="true"
      />

      <section
        className="relative h-full container mx-auto rounded-lg py-16 sm:py-20 text-white px-4 sm:px-6 lg:px-8"
        ref={testimonialRef}
      >
        {/* Header */}
        <article className="max-w-screen-md mx-auto text-center space-y-3 mb-4 relative z-10">
          <TimelineContent
            as="p"
            className="text-xs font-mono font-bold tracking-widest text-[#4f7cff] uppercase"
            animationNum={0}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
          >
            Verified Client Reviews
          </TimelineContent>
          <TimelineContent
            as="h1"
            className="xl:text-4xl text-3xl font-medium tracking-tight text-white leading-tight"
            animationNum={1}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
          >
            Trusted by startups and scaling enterprises
          </TimelineContent>
          <TimelineContent
            as="p"
            className="mx-auto text-white/60 text-sm sm:text-base max-w-xl leading-relaxed"
            animationNum={2}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
          >
            Real feedback from founders, CTOs, and operators who built and shipped production systems with TechSonance
          </TimelineContent>
        </article>

        {/* 3-Column Testimonial Grid */}
        <div className="lg:grid lg:grid-cols-3 gap-3 flex flex-col w-full lg:py-8 pt-8 pb-4 relative z-10">
          {/* Column 1 */}
          <div className="md:flex lg:flex-col lg:space-y-3 h-full lg:gap-0 gap-3">
            {/* Card 1 (Large - FreightFlow) */}
            <TimelineContent
              animationNum={0}
              customVariants={revealVariants}
              timelineRef={testimonialRef}
              className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-[#0e0f14] overflow-hidden rounded-2xl border border-[#4f7cff]/30 p-6 shadow-xl group hover:border-[#4f7cff]/60 hover:shadow-[0_0_30px_rgba(79,124,255,0.15)] transition-all"
            >
              {/* Blue theme blueprint grid lines in the upper card area */}
              <div
                className="absolute inset-0 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(79, 124, 255, 0.35) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(79, 124, 255, 0.35) 1px, transparent 1px)
                  `,
                  backgroundSize: "44px 44px",
                  WebkitMaskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.3) 75%, transparent 95%)",
                  maskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.3) 75%, transparent 95%)",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute -top-12 -left-12 w-48 h-48 bg-[#4f7cff]/15 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />
              <article className="mt-auto relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4f7cff] bg-[#4f7cff]/10 px-2.5 py-1 rounded-full inline-block mb-3.5 border border-[#4f7cff]/30">
                  FreightFlow · Logistics SaaS
                </span>
                <p className="text-white/85 text-sm sm:text-[15px] leading-relaxed">
                  &ldquo;We were managing LR details and expenses across spreadsheets and WhatsApp. The new workflow has made it much easier to track each trip and catch billing issues before they become a problem.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-[#4f7cff]/20 mt-5">
                  <div>
                    <h2 className="font-semibold text-white text-base sm:text-lg">
                      Ankur Rajput
                    </h2>
                    <p className="text-xs text-white/50">Founder &amp; MD · Ashutosh RoadLines</p>
                  </div>
                  <div className="h-11 sm:h-12 w-16 sm:w-20 rounded-xl bg-[#4f7cff]/[0.05] border border-[#4f7cff]/25 flex items-center justify-center p-2 shrink-0 shadow-md backdrop-blur-sm">
                    <Image
                      src="/images/projects/freightflow-white.png"
                      alt="FreightFlow"
                      width={80}
                      height={40}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  </div>
                </div>
              </article>
            </TimelineContent>

            {/* Card 2 (Blue accent - Zion Platform) */}
            <TimelineContent
              animationNum={1}
              customVariants={revealVariants}
              timelineRef={testimonialRef}
              className="lg:flex-[3] flex-[4] lg:h-fit lg:shrink-0 flex flex-col justify-between relative bg-gradient-to-br from-[#1a4eff] to-[#0f3cd6] text-white overflow-hidden rounded-2xl border border-white/20 p-6 shadow-2xl group hover:shadow-[0_12px_40px_rgba(26,78,255,0.4)] transition-all"
            >
              <article className="mt-auto relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/90 bg-white/15 px-2.5 py-0.5 rounded-full inline-block mb-2.5">
                  Zion · Event Discovery Mobile App
                </span>
                <p className="text-white/95 text-xs sm:text-sm leading-relaxed">
                  &ldquo;The team worked closely with us on the mobile experience and paid attention to the small details in the ticket flow. Communication was straightforward.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-4">
                  <div>
                    <h2 className="font-semibold text-white text-sm sm:text-base">Anush</h2>
                    <p className="text-[11px] text-white/80">Founder &amp; CEO · Vagsync AI</p>
                  </div>
                  <div className="h-10 sm:h-11 w-14 sm:w-16 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center p-1.5 shrink-0 shadow-md backdrop-blur-sm">
                    <Image
                      src="/images/projects/zion-cropped.png"
                      alt="Zion"
                      width={64}
                      height={36}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-full max-w-full object-contain filter drop-shadow brightness-0 invert"
                    />
                  </div>
                </div>
              </article>
            </TimelineContent>
          </div>

          {/* Column 2 */}
          <div className="lg:h-full md:flex lg:flex-col h-fit lg:space-y-3 lg:gap-0 gap-3">
            {/* Card 3 (MasterWeg) */}
            <TimelineContent
              animationNum={2}
              customVariants={revealVariants}
              timelineRef={testimonialRef}
              className="flex flex-col justify-between relative bg-[#0e0f14] text-white overflow-hidden rounded-2xl border border-[#4f7cff]/20 p-5 shadow-lg group hover:border-[#F68F1D]/50 transition-colors"
            >
              <article className="mt-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F68F1D] bg-[#F68F1D]/10 px-2.5 py-0.5 rounded-full inline-block mb-2 border border-[#F68F1D]/20">
                  MasterWeg · EdTech Platform
                </span>
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
                  &ldquo;We needed a backend that could support several workflows without becoming difficult to maintain. The team took time to understand our requirements and helped shape a clean foundation.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#4f7cff]/15 mt-4">
                  <div>
                    <h2 className="font-semibold text-white text-sm sm:text-base">
                      Sandeep Rudra
                    </h2>
                    <p className="text-[11px] text-white/50">Founder &amp; MD · Frankfurt, Germany</p>
                  </div>
                  <div className="h-10 sm:h-11 w-14 sm:w-16 rounded-xl bg-[#4f7cff]/[0.04] border border-[#4f7cff]/20 flex items-center justify-center p-1.5 shrink-0 shadow-md backdrop-blur-sm">
                    <Image
                      src="/images/clients/masterweg.png"
                      alt="MasterWeg"
                      width={64}
                      height={36}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  </div>
                </div>
              </article>
            </TimelineContent>

            {/* Card 4 (SyncServe POS) */}
            <TimelineContent
              animationNum={3}
              customVariants={revealVariants}
              timelineRef={testimonialRef}
              className="flex flex-col justify-between relative bg-[#0e0f14] text-white overflow-hidden rounded-2xl border border-[#4f7cff]/20 p-5 shadow-lg group hover:border-[#10B981]/50 transition-colors"
            >
              <article className="mt-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded-full inline-block mb-2 border border-[#10B981]/20">
                  SyncServe · Retail &amp; Food POS
                </span>
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
                  &ldquo;During rush hours when the internet fluctuates, billing can&apos;t stop. The offline mode keeps orders and KOTs printing reliably, and everything syncs automatically.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#4f7cff]/15 mt-4">
                  <div>
                    <h2 className="font-semibold text-white text-sm sm:text-base">Rahul Rajput</h2>
                    <p className="text-[11px] text-white/50">Founder &amp; Owner · Tasty Food Center</p>
                  </div>
                  <div className="h-10 sm:h-11 w-14 sm:w-16 rounded-xl bg-[#4f7cff]/[0.04] border border-[#4f7cff]/20 flex items-center justify-center p-1.5 shrink-0 shadow-md backdrop-blur-sm">
                    <Image
                      src="/images/clients/syncserve.png"
                      alt="SyncServe"
                      width={64}
                      height={36}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  </div>
                </div>
              </article>
            </TimelineContent>

            {/* Card 5 (Accunest) */}
            <TimelineContent
              animationNum={4}
              customVariants={revealVariants}
              timelineRef={testimonialRef}
              className="flex flex-col justify-between relative bg-[#0e0f14] text-white overflow-hidden rounded-2xl border border-[#4f7cff]/20 p-5 shadow-lg group hover:border-[#00897B]/50 transition-colors"
            >
              <article className="mt-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00897B] bg-[#00897B]/10 px-2.5 py-0.5 rounded-full inline-block mb-2 border border-[#00897B]/20">
                  Accunest · Invoicing &amp; GST Suite
                </span>
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
                  &ldquo;Textile job-work and GST invoices used to require endless manual calculation. Accunest simplified our workflow so our accountants generate compliant e-invoices in minutes.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#4f7cff]/15 mt-4">
                  <div>
                    <h2 className="font-semibold text-white text-sm sm:text-base">
                      Narayan Singh
                    </h2>
                    <p className="text-[11px] text-white/50">Founder &amp; MD · Ambika Textiles</p>
                  </div>
                  <div className="h-10 sm:h-11 w-14 sm:w-16 rounded-xl bg-[#4f7cff]/[0.04] border border-[#4f7cff]/20 flex items-center justify-center p-1.5 shrink-0 shadow-md backdrop-blur-sm">
                    <Image
                      src="/images/clients/accunest.webp"
                      alt="Accunest"
                      width={64}
                      height={36}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  </div>
                </div>
              </article>
            </TimelineContent>
          </div>

          {/* Column 3 */}
          <div className="h-full md:flex lg:flex-col lg:space-y-3 lg:gap-0 gap-3">
            {/* Card 6 (Blue accent - TechSonance Marketplace) */}
            <TimelineContent
              animationNum={5}
              customVariants={revealVariants}
              timelineRef={testimonialRef}
              className="lg:flex-[3] flex-[4] flex flex-col justify-between relative bg-gradient-to-br from-[#1a4eff] to-[#0f3cd6] text-white overflow-hidden rounded-2xl border border-white/20 p-6 shadow-2xl group hover:shadow-[0_12px_40px_rgba(26,78,255,0.4)] transition-all"
            >
              <article className="mt-auto relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/90 bg-white/15 px-2.5 py-0.5 rounded-full inline-block mb-2.5">
                  TechSonance Marketplace
                </span>
                <p className="text-white/95 text-xs sm:text-sm leading-relaxed">
                  &ldquo;Handling multiple vendors, diverse product catalogs, and payout splits seemed overwhelming. The platform handles cart updates smoothly and keeps merchant onboarding simple.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-4">
                  <div>
                    <h2 className="font-semibold text-white text-sm sm:text-base">Ronak Kothari</h2>
                    <p className="text-[11px] text-white/80">Multi-Brand Merchant Partner</p>
                  </div>
                  <div className="h-10 sm:h-11 w-14 sm:w-16 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center p-1.5 shrink-0 shadow-md backdrop-blur-sm">
                    <Image
                      src="/images/clients/marketplace.png"
                      alt="TechSonance Marketplace"
                      width={64}
                      height={36}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-full max-w-full object-contain filter drop-shadow brightness-0 invert"
                    />
                  </div>
                </div>
              </article>
            </TimelineContent>

            {/* Card 7 (Large - Zion Performance) */}
            <TimelineContent
              animationNum={6}
              customVariants={revealVariants}
              timelineRef={testimonialRef}
              className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-[#0e0f14] overflow-hidden rounded-2xl border border-[#4f7cff]/30 p-6 shadow-xl group hover:border-[#4f7cff]/60 hover:shadow-[0_0_30px_rgba(79,124,255,0.15)] transition-all"
            >
              {/* Blue theme blueprint grid lines in the upper card area */}
              <div
                className="absolute inset-0 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(79, 124, 255, 0.35) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(79, 124, 255, 0.35) 1px, transparent 1px)
                  `,
                  backgroundSize: "44px 44px",
                  WebkitMaskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.3) 75%, transparent 95%)",
                  maskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.3) 75%, transparent 95%)",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute -top-12 -right-12 w-48 h-48 bg-[#4f7cff]/15 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />
              <article className="mt-auto relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4f7cff] bg-[#4f7cff]/10 px-2.5 py-1 rounded-full inline-block mb-3.5 border border-[#4f7cff]/30">
                  Performance &amp; Scale · Flutter Mobile
                </span>
                <p className="text-white/85 text-sm sm:text-[15px] leading-relaxed">
                  &ldquo;The cross-platform Flutter experience TechSonance engineered for Zion runs at an unshakeable 60 FPS across both iOS and Android. Their local-first caching architecture ensured attendees could enter venues even in basements with zero connectivity.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-[#4f7cff]/20 mt-5">
                  <div>
                    <h2 className="font-semibold text-white text-base sm:text-lg">Ananya Mehta</h2>
                    <p className="text-xs text-white/50">Head of Product · Zion Entertainment</p>
                  </div>
                  <div className="h-11 sm:h-12 w-16 sm:w-20 rounded-xl bg-[#4f7cff]/[0.05] border border-[#4f7cff]/25 flex items-center justify-center p-2 shrink-0 shadow-md backdrop-blur-sm">
                    <Image
                      src="/images/clients/zion.png"
                      alt="Zion Entertainment"
                      width={80}
                      height={40}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-full max-w-full object-contain filter drop-shadow brightness-0 invert"
                    />
                  </div>
                </div>
              </article>
            </TimelineContent>
          </div>
        </div>

        {/* Decorative architectural bottom frame with blue lines & markers */}
        <div className="relative border-b border-[#4f7cff]/30 mt-8 h-10 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#4f7cff] text-xs font-mono">
            <span className="font-bold text-sm">+</span>
            <span className="text-[10px] uppercase tracking-widest text-[#4f7cff]/80">TechSonance Verified Client Stories</span>
          </div>
          <div className="flex items-center gap-2 text-[#4f7cff] text-xs font-mono">
            <span className="text-[10px] uppercase tracking-widest text-[#4f7cff]/80">Surat · Bengaluru · Frankfurt</span>
            <span className="font-bold text-sm">+</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ClientFeedback;

