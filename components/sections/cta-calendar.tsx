"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  LayoutGrid,
  Columns3,
  CheckCircle2,
  ExternalLink,
  Mail,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const CAL_BASE_URL = "https://cal.id/techsonance-infotech/connect-with-founder";

function GoogleMeetIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 8.5v7l4 3V5.5l-4 3z" fill="#00832d" />
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h7A2.5 2.5 0 0 1 15 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 3 16.5v-9z" fill="#00ac47" />
      <path d="M3 14.5v2A2.5 2.5 0 0 0 5.5 19h7a2.5 2.5 0 0 0 2.5-2.5v-2H3z" fill="#0066da" />
      <path d="M15 5.5l4-3v3.5l-4 2.5v-3z" fill="#ffba00" />
      <path d="M19 18.5l-4-3v3.5l4 2.5v-3z" fill="#ea4335" />
    </svg>
  );
}

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function CtaCalendarSection() {
  // Calendar states matching the Cal.id interface
  const [duration, setDuration] = useState<15 | 30>(15);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [selectedDay, setSelectedDay] = useState<number>(29);
  const [selectedSlot, setSelectedSlot] = useState<string>("4:45 PM");
  const [monthOffset, setMonthOffset] = useState<number>(0); // 0 = Oct 2026, 1 = Nov 2026
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // October 2026 calendar data (Thursday Oct 1st = index 3 in Mon-Sun week)
  const monthName = monthOffset === 0 ? "October" : "November";

  // October 2026 has 31 days, starts on Thursday (index 3)
  // November 2026 has 30 days, starts on Sunday (index 6)
  const startDayIndex = monthOffset === 0 ? 3 : 6;
  const daysInMonth = monthOffset === 0 ? 31 : 30;

  // Available slots based on duration & format
  const rawSlots15 = ["4:45 PM", "5:00 PM", "5:15 PM", "5:30 PM", "5:45 PM", "6:00 PM"];
  const rawSlots30 = ["4:45 PM", "5:15 PM", "5:45 PM", "6:15 PM"];

  const formatTime = (time12: string) => {
    if (timeFormat === "12h") return time12;
    const [time, modifier] = time12.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let h = hours;
    if (modifier === "PM" && h < 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const currentSlots = (duration === 15 ? rawSlots15 : rawSlots30).map(formatTime);

  const getDayName = (day: number) => {
    const dayIndex = (startDayIndex + day - 1) % 7;
    const name = DAYS_OF_WEEK[dayIndex];
    return name.charAt(0) + name.slice(1).toLowerCase();
  };

  const handleBooking = () => {
    setIsBooked(true);
    // Also open Cal.id direct link
    const calUrl = `${CAL_BASE_URL}?duration=${duration}&date=2026-${(monthOffset === 0 ? 10 : 11).toString().padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;
    window.open(calUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#070709] text-white py-16 sm:py-24 overflow-hidden border-t border-[#4f7cff]/20"
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-[#4f7cff]/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Section Header & Quick CTA Links */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f7cff]/10 border border-[#4f7cff]/30 text-xs font-mono uppercase tracking-widest text-[#4f7cff]">
            <Sparkles className="size-3" />
            <span>Connect &amp; Collaborate</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
            Schedule an interactive session
          </h2>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            Choose a time on the dark calendar below to connect with our founder, or reach out through direct channels.
          </p>

          {/* Quick CTA Links */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href="mailto:hr@techsonance.co.in"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-[#4f7cff]/10 border border-white/10 hover:border-[#4f7cff]/40 text-white/80 hover:text-white transition-all"
            >
              <Mail className="size-3.5 text-[#4f7cff]" />
              <span>Email: hr@techsonance.co.in</span>
              <ArrowUpRight className="size-3 text-white/40" />
            </a>

            <a
              href="https://linkedin.com/company/techsonance-infotech/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-[#4f7cff]/10 border border-white/10 hover:border-[#4f7cff]/40 text-white/80 hover:text-white transition-all"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="size-3 text-white/40" />
            </a>

            <a
              href="https://github.com/techsonance-infotech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-[#4f7cff]/10 border border-white/10 hover:border-[#4f7cff]/40 text-white/80 hover:text-white transition-all"
            >
              <span>GitHub</span>
              <ArrowUpRight className="size-3 text-white/40" />
            </a>
          </div>
        </div>

        {/* =========================================================================
            Dark Mode Calendar Card (Faithfully modeled on media_1793265134361_fc02230d.png)
            ========================================================================= */}
        <div className="w-full max-w-5xl mx-auto bg-[#0d0e14] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 hover:border-[#4f7cff]/30">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN: Founder Details & Meeting Settings (4 Cols)
                ------------------------------------------------------------- */}
            <div className="md:col-span-4 p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* TechSonance Avatar Badge */}
                <div className="w-12 h-12 rounded-full bg-[#12141c] border border-white/15 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                  <Image
                    src="/images/logo-icon.png"
                    alt="TechSonance Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>

                {/* Organization & Meeting Title */}
                <div>
                  <span className="text-xs font-medium text-white/50 tracking-wide block">
                    TechSonance InfoTech LLP
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                    Connect with Founder
                  </h3>
                </div>

                {/* Friendly Invitation Note */}
                <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed">
                  Let&apos;s connect for an interactive session! Whether it&apos;s for exchanging ideas,
                  exploring collaborations, or simply saying hello.🌟🤝
                </p>

                {/* Duration Selector: 15m / 30m */}
                <div className="flex items-center gap-2.5 pt-2">
                  <Clock className="size-4 text-white/45 shrink-0" />
                  <div className="inline-flex rounded-full bg-white/[0.05] border border-white/10 p-0.5">
                    <button
                      type="button"
                      onClick={() => setDuration(15)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        duration === 15
                          ? "bg-[#4f7cff] text-white shadow-[0_0_12px_rgba(79,124,255,0.4)]"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      15m
                    </button>
                    <button
                      type="button"
                      onClick={() => setDuration(30)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        duration === 30
                          ? "bg-[#4f7cff] text-white shadow-[0_0_12px_rgba(79,124,255,0.4)]"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      30m
                    </button>
                  </div>
                </div>

                {/* Google Meet Indicator */}
                <div className="flex items-center gap-2.5 text-xs text-white/80 font-medium">
                  <GoogleMeetIcon />
                  <span>Google Meet</span>
                </div>

                {/* Timezone Indicator */}
                <div className="flex items-center gap-2 text-xs text-white/60 hover:text-white/90 transition-colors cursor-pointer group">
                  <Globe className="size-4 text-white/45" />
                  <span className="font-mono">Asia/Kolkata</span>
                  <ChevronDown className="size-3 text-white/40 group-hover:text-white" />
                </div>
              </div>

              {/* Direct Link Footnote */}
              <div className="pt-4 border-t border-white/[0.08] text-[11px] text-white/40 flex items-center justify-between">
                <span>Direct Cal.id Sync</span>
                <a
                  href={CAL_BASE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4f7cff] hover:underline inline-flex items-center gap-1"
                >
                  <span>cal.id</span>
                  <ExternalLink className="size-2.5" />
                </a>
              </div>
            </div>

            {/* -------------------------------------------------------------
                MIDDLE COLUMN: Dynamic Month View Calendar Grid (5 Cols)
                ------------------------------------------------------------- */}
            <div className="md:col-span-5 p-6 sm:p-7 space-y-4">
              {/* Month & Nav Controls */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {monthName} <span className="text-white/50 font-normal">2026</span>
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
                    disabled={monthOffset === 0}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-white/70 transition-colors cursor-pointer"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthOffset((prev) => Math.min(1, prev + 1))}
                    disabled={monthOffset === 1}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-white/70 transition-colors cursor-pointer"
                    aria-label="Next month"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="text-[10px] sm:text-[11px] font-mono font-medium text-white/40 uppercase py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Numbers Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {/* Leading blanks before day 1 */}
                {Array.from({ length: startDayIndex }).map((_, i) => (
                  <div key={`blank-${i}`} className="w-8 h-8 sm:w-9 sm:h-9" />
                ))}

                {/* Month Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  // In Oct 2026, days before 29 are past
                  const isPast = monthOffset === 0 && dayNum < 29;
                  const isSelected = selectedDay === dayNum;
                  const isAvailable = !isPast;

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      disabled={isPast}
                      onClick={() => {
                        setSelectedDay(dayNum);
                        setIsBooked(false);
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl flex flex-col items-center justify-center text-xs sm:text-[13px] font-medium transition-all relative cursor-pointer ${
                        isSelected
                          ? "bg-[#4f7cff] text-white font-bold shadow-[0_0_14px_rgba(79,124,255,0.45)] ring-2 ring-[#4f7cff]/30"
                          : isAvailable
                          ? "bg-white/[0.04] text-white hover:bg-white/[0.1] hover:border-[#4f7cff]/40 border border-transparent"
                          : "text-white/20 cursor-not-allowed"
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isSelected && (
                        <span className="w-1 h-1 rounded-full bg-white mt-0.5 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Quick Tips */}
              <div className="pt-3 text-[11px] text-white/40 flex items-center justify-between border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-[#4f7cff]" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-white/[0.08]" />
                  <span>Available Slot</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN: Selected Date & Time Slots (3 Cols)
                ------------------------------------------------------------- */}
            <div className="md:col-span-3 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Header: Selected Day & 12h/24h toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold text-white">
                      {getDayName(selectedDay)}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {selectedDay}
                    </span>
                  </div>

                  {/* 12h / 24h Switcher */}
                  <div className="inline-flex rounded-lg bg-white/[0.05] border border-white/10 p-0.5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setTimeFormat("12h")}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        timeFormat === "12h" ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                      }`}
                    >
                      12h
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeFormat("24h")}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        timeFormat === "24h" ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                      }`}
                    >
                      24h
                    </button>
                  </div>
                </div>

                {/* View switcher icons (as visible in Cal interface) */}
                <div className="flex items-center justify-end gap-1.5 text-white/40">
                  <CalendarIcon className="size-3.5 text-white/70" />
                  <LayoutGrid className="size-3.5" />
                  <Columns3 className="size-3.5" />
                </div>

                {/* Time Slots List */}
                <div className="space-y-2 pt-1 max-h-[300px] overflow-y-auto pr-1">
                  {currentSlots.map((slot) => {
                    const isSlotSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setIsBooked(false);
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center flex items-center justify-center cursor-pointer ${
                          isSlotSelected
                            ? "bg-[#4f7cff] text-white border-[#4f7cff] shadow-[0_0_16px_rgba(79,124,255,0.35)]"
                            : "border-white/15 bg-white/[0.03] text-white hover:border-[#4f7cff]/50 hover:bg-[#4f7cff]/10"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm & Book Action */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <button
                  type="button"
                  onClick={handleBooking}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4f7cff] to-[#22b6f6] hover:from-[#3d69ed] hover:to-[#1aa3df] text-white text-xs font-semibold transition-all shadow-[0_0_20px_rgba(79,124,255,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Confirm for {selectedSlot}</span>
                  <ArrowUpRight className="size-3.5" />
                </button>

                {isBooked && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="size-3" />
                    <span>Opening Cal.id confirmation...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
