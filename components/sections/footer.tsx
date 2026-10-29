"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  // Dynamically resolves current year on client without blocking static prerender
  const currentYear = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026
  );

  return (
    <footer className="w-full bg-[#050608] text-white border-t border-white/10 pt-16 sm:pt-20 pb-12 relative overflow-hidden">
      {/* Ambient glowing gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#4f7cff]/10 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-[#22b6f6]/10 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3.5 self-start group">
              <Image
                src="/images/logo-icon.png"
                alt="TechSonance logo"
                width={52}
                height={52}
                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_16px_rgba(79,124,255,0.3)]"
              />
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-[20px] font-bold tracking-[0.04em]">
                  <TechSvg className="text-white" />
                  <span className="bg-gradient-to-r from-[#4f7cff] to-[#22b6f6] bg-clip-text text-transparent">
                    SONΛNCE
                  </span>
                </span>
                <span className="w-full flex items-center gap-2 text-[9px] font-medium font-mono uppercase tracking-[0.25em] text-[#94a3b8] mt-0.5">
                  <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#475569]" />
                  INFOTECH LLP
                  <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#475569]" />
                </span>
                <span className="block text-[7.5px] font-medium font-mono uppercase tracking-[0.16em] text-white/40 mt-1">
                  Where Innovation Finds Its Resonance
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/60 leading-relaxed max-w-sm">
              Engineering high-performance enterprise custom platforms, multi-tenant SaaS products,
              and agentic AI automation workflows. Built on robust types, scalability, and 99.9% reliability.
            </p>

            <div className="space-y-2 pt-2 text-xs text-white/70">
              <a
                href="mailto:hr@techsonance.co.in"
                className="flex items-center gap-2.5 hover:text-[#4f7cff] transition-colors"
              >
                <Mail className="size-3.5 text-[#4f7cff]" />
                <span>hr@techsonance.co.in</span>
              </a>
              <div className="flex items-center gap-2.5 text-white/50">
                <MapPin className="size-3.5 text-[#4f7cff]" />
                <span>Surat, Gujarat · Bengaluru · Frankfurt</span>
              </div>
            </div>
          </div>

          {/* Column 2: Engineering Expertise */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-4 font-semibold">
              Expertise &amp; Capabilities
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <span className="hover:text-[#4f7cff] transition-colors cursor-default">
                  Full-Stack SaaS Platforms
                </span>
              </li>
              <li>
                <span className="hover:text-[#4f7cff] transition-colors cursor-default">
                  Agentic AI &amp; LLM Workflows
                </span>
              </li>
              <li>
                <span className="hover:text-[#4f7cff] transition-colors cursor-default">
                  Mobile Development (Flutter &amp; React Native)
                </span>
              </li>
              <li>
                <span className="hover:text-[#4f7cff] transition-colors cursor-default">
                  High-Performance NestJS / Go Backends
                </span>
              </li>
              <li>
                <span className="hover:text-[#4f7cff] transition-colors cursor-default">
                  Local-First &amp; Offline Systems
                </span>
              </li>
              <li>
                <span className="hover:text-[#4f7cff] transition-colors cursor-default">
                  Enterprise Cloud &amp; DevOps
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Production Systems */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-4 font-semibold">
              Production Works
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link
                  href="/case-studies/freightflow"
                  className="hover:text-[#4f7cff] transition-colors flex items-center gap-1 group"
                >
                  <span>FreightFlow</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/zion"
                  className="hover:text-[#4f7cff] transition-colors flex items-center gap-1 group"
                >
                  <span>Zion Platform</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/syncserve"
                  className="hover:text-[#4f7cff] transition-colors flex items-center gap-1 group"
                >
                  <span>SyncServe POS</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/masterweg"
                  className="hover:text-[#4f7cff] transition-colors flex items-center gap-1 group"
                >
                  <span>MasterWeg</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/accunest"
                  className="hover:text-[#4f7cff] transition-colors flex items-center gap-1 group"
                >
                  <span>Accunest GST</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-[#4f7cff] hover:underline font-mono text-[11px] pt-1 block"
                >
                  View All 8 Systems →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Schedule CTA */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-4 font-semibold">
              Scoping Session
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Review your system architecture, sprint milestones, and tech roadmap.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4f7cff] hover:bg-[#3d69ed] text-white text-xs font-medium transition-all shadow-[0_0_16px_rgba(79,124,255,0.35)]"
            >
              <span>Schedule 15m Call</span>
              <ArrowUpRight className="size-3.5" />
            </a>
            <div className="mt-4 text-[10px] text-white/40 font-mono leading-relaxed">
              Mon - Fri · 9:00 AM - 6:00 PM IST
              <br />
              Standard response: &lt; 24h
            </div>
          </div>
        </div>

        {/* Middle Row: Social Media Links */}
        <div className="py-7 flex flex-col sm:flex-row justify-center items-center gap-4 border-b border-white/10">
          <span className="text-xs font-mono uppercase tracking-wider text-white/50">Connect with TechSonance:</span>
          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com/company/techsonance-infotech/"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#4f7cff] hover:bg-[#4f7cff]/10 transition-all"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://github.com/techsonance-infotech"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#4f7cff] hover:bg-[#4f7cff]/10 transition-all"
              aria-label="GitHub Organization"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a
              href="https://x.com/techsonance_in"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#4f7cff] hover:bg-[#4f7cff]/10 transition-all"
              aria-label="Twitter X Profile"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/techsonance_infotech/?igsh=MTZqNm04enMxaGZmbg%3D%3D#"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#4f7cff] hover:bg-[#4f7cff]/10 transition-all"
              aria-label="Instagram Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/people/TechSonance-InfoTech/61583918872159/?rdid=hWr8x5FiMIPKTaVJ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1TKgqjwQ9u%2F"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#4f7cff] hover:bg-[#4f7cff]/10 transition-all"
              aria-label="Facebook Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Row: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <div>
            © {currentYear} All rights reserved by{" "}
            <span className="font-medium text-[#4f7cff]">TechSonance InfoTech LLP</span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-end text-[11px]">
            <Link href="/case-studies" className="hover:text-white transition-colors">
              Case Studies
            </Link>
            <span className="text-white/20">•</span>
            <span className="text-white/40">Surat · Bengaluru · Frankfurt</span>
            <span className="text-white/20">•</span>
            <span className="text-white/40">Privacy Policy</span>
            <span className="text-white/20">•</span>
            <span className="text-white/40">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TechSvg({ className = "text-white" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 74 24"
      className={`h-[0.72em] w-auto ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {/* T */}
      <g transform="translate(0, 0)">
        <path d="M1.5,4.5 L16.5,4.5" />
        <path d="M9,4.5 L9,19.5" />
      </g>
      {/* E */}
      <g transform="translate(18, 0)">
        <path d="M16.5,4.5 L8.5,4.5 C6.2,4.5 4.5,6.2 4.5,8.5 L4.5,15.5 C4.5,17.8 6.2,19.5 8.5,19.5 L16.5,19.5" strokeLinejoin="round" />
        <path d="M4.5,12 L13.5,12" />
      </g>
      {/* C */}
      <g transform="translate(36, 0)">
        <path d="M16.5,4.5 L8.5,4.5 C6.2,4.5 4.5,6.2 4.5,8.5 L4.5,15.5 C4.5,17.8 6.2,19.5 8.5,19.5 L16.5,19.5" strokeLinejoin="round" />
      </g>
      {/* H */}
      <g transform="translate(54, 0)">
        <path d="M4.5,4.5 L4.5,19.5" />
        <path d="M16.5,4.5 L16.5,19.5" />
        <path d="M4.5,12 L16.5,12" />
      </g>
    </svg>
  );
}

