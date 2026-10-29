"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface ProjectMockupProps {
  gradient: string;
  title: string;
  category: string;
  accentColor: string;
  screenshotPath?: string;
  priority?: boolean;
  liveUrl?: string;
  hideChrome?: boolean;
}

export function ProjectMockup({
  gradient,
  title,
  category,
  accentColor,
  screenshotPath,
  priority = false,
  liveUrl,
  hideChrome,
}: ProjectMockupProps) {
  const isMobile = hideChrome || category.toLowerCase().includes("mobile");
  const [hasError, setHasError] = useState(false);

  let hostname = `${title.toLowerCase().replace(/\s+/g, "-")}.techsonance.co.in`;
  if (liveUrl) {
    try {
      hostname = new URL(liveUrl).hostname;
    } catch {
      hostname = liveUrl.replace(/^https?:\/\//, "").split("/")[0];
    }
  }

  return (
    <div className="relative w-full select-none group">
      {/* Outer Glow on hover */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 pointer-events-none"
        style={{ background: accentColor }}
      />

      {/* Frame Container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#111216] transition-all duration-300">
        {/* Title bar - for web / desktop apps */}
        {!isMobile && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#16171d] border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-3 bg-black/40 rounded-md px-3 py-1 text-[10px] text-white/40 font-mono border border-white/10 truncate">
              {hostname}
            </div>
          </div>
        )}

        {/* Real Screenshot or Fallback */}
        {screenshotPath && !hasError ? (
          <div
            className={`relative w-full overflow-hidden ${
              isMobile ? "aspect-[16/11.5] p-3 sm:p-5 flex items-center justify-center" : "aspect-[16/10]"
            }`}
            style={{
              background: isMobile
                ? gradient || "radial-gradient(circle at center, #1b1c24 0%, #0e0f14 100%)"
                : "#0f1013",
            }}
          >
            <img
              src={screenshotPath}
              alt={`${title} - ${category} screenshot`}
              loading={priority ? "eager" : "lazy"}
              onError={() => setHasError(true)}
              className={
                isMobile
                  ? "max-h-full max-w-[85%] object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                  : "w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              }
            />
          </div>
        ) : (
          /* Gradient placeholder */
          <div
            className="w-full aspect-[16/10] relative overflow-hidden flex items-center justify-center p-6"
            style={{ background: gradient || "linear-gradient(135deg, #1e2230 0%, #0d0f14 100%)" }}
          >
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <span className="text-[10px] font-mono tracking-widest text-[#4f7cff] uppercase">
                {category}
              </span>
              <h4 className="text-xl font-bold text-white/90">{title}</h4>
              <p className="text-xs text-white/50 max-w-[80%] line-clamp-2">
                Production System Built by TechSonance
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

