"use client";

// A portfolio index built as a 3D wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// Extended for Case Studies with rich front-card info, deep linking,
// responsive mobile layout, image fallbacks, and dialog navigation.

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project identifier used for routing */
  slug: string;
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Industry / category tag */
  category?: string;
  /** One-line summary of the case study */
  summary?: string;
  /** Cover art. Any src an <img> or next/image takes. */
  image: string;
  /** How the cover art fits into the 3D card */
  fit?: "cover" | "contain";
  /** Optional background gradient/color behind contain images */
  bg?: string;
  /** Where the card links to (optional) */
  href?: string;
}

export interface WorksWheelProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default "Case Studies '26" */
  label?: string;
  /** Label on the card's hover affordance. @default "View" */
  action?: string;
  /** Callback when front card or read button is opened */
  onOpenCaseStudy?: (slug: string) => void;
}

/* Geometry constants from original Works Wheel */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Case Studies '26",
  action = "View",
  onOpenCaseStudy,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const frontInfoRef = React.useRef<HTMLDivElement>(null);

  // Wheel positions
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [imgError, setImgError] = React.useState<Record<string, boolean>>({});

  // Pointer drag tracking to differentiate click from drag
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);
  const dragCurrent = React.useRef<number | null>(null);
  const pointerTravel = React.useRef<number>(0);

  // Declared above useEffect as required
  const settling = React.useRef<number>(0);

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Reduced motion
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  // ResizeObserver for responsive stage
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Geometric metrics
  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp(((2 * Math.PI * ringR) / count) * 0.82 / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: Math.max(28, cardH * TITLE),
      index: Math.max(11, cardH * INDEX),
    };
  }, [stage, count]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
      setHasInteracted(true);
    },
    [last]
  );

  // One rAF pass per frame: ease toward target, write transforms straight to DOM
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m
          );
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (frontInfoRef.current) {
        frontInfoRef.current.style.opacity = String(m);
        frontInfoRef.current.style.pointerEvents = m > 0.6 ? "auto" : "none";
      }

      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  // Wheel scroll listener: cancels scroll only when wheel has somewhere to go
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);

      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  // Card interaction handler
  const handleCardClick = (i: number, slug: string) => {
    // If pointer traveled more than 6px, it was a drag, so ignore
    if (pointerTravel.current > 6) return;

    if (i === active) {
      if (onOpenCaseStudy) {
        onOpenCaseStudy(slug);
      }
    } else {
      to(i + 1);
    }
  };

  const activeItem = items[active];

  return (
    <section
      aria-label={label}
      className={cn(
        "relative h-full min-h-[36rem] w-full overflow-hidden select-none bg-[#070709] text-white",
        className
      )}
      {...props}
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(79, 124, 255, 0.08), transparent 75%)",
        }}
      />

      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-white/20 absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          dragStart.current = { x: event.clientX, y: event.clientY };
          dragCurrent.current = event.clientY;
          pointerTravel.current = 0;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragCurrent.current === null) return;
          if (dragStart.current) {
            const dx = event.clientX - dragStart.current.x;
            const dy = event.clientY - dragStart.current.y;
            pointerTravel.current = Math.hypot(dx, dy);
          }
          to(target.current + (dragCurrent.current - event.clientY) / DRAG_UNITS);
          dragCurrent.current = event.clientY;
        }}
        onPointerUp={() => {
          dragCurrent.current = null;
          dragStart.current = null;
          if (target.current > 1) to(Math.round(target.current));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else if (event.key === "Enter" && activeItem && onOpenCaseStudy) {
            onOpenCaseStudy(activeItem.slug);
          } else return;
          event.preventDefault();
        }}
      >
        {/* 3D Wheel Stage */}
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const isFront = i === active;
            const hasError = imgError[item.slug];

            return (
              <div
                key={item.slug}
                id={`works-wheel-${i}`}
                role="option"
                aria-selected={isFront}
                onClick={() => handleCardClick(i, item.slug)}
                ref={(node: HTMLElement | null) => {
                  cardRefs.current[i] = node;
                }}
                className="group absolute [backface-visibility:hidden] cursor-pointer"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                }}
              >
                <div
                  className={cn(
                    "relative block size-full overflow-hidden rounded-xl border border-white/10 shadow-[0_22px_45px_-18px_rgba(0,0,0,0.8)] transition-shadow duration-300 group-hover:shadow-[0_28px_55px_-16px_rgba(79,124,255,0.25)]",
                    item.fit === "contain"
                      ? "p-4 sm:p-6 flex items-center justify-center"
                      : "p-0"
                  )}
                  style={{
                    background:
                      item.bg ||
                      (item.fit === "contain"
                        ? "radial-gradient(circle at center, #1b1c24 0%, #0e0f14 100%)"
                        : "#121316"),
                  }}
                >
                  {/* Image with fallback */}
                  {!hasError ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      onError={() =>
                        setImgError((prev) => ({ ...prev, [item.slug]: true }))
                      }
                      className={cn(
                        "size-full transition-transform duration-500 group-hover:scale-[1.02]",
                        item.fit === "contain"
                          ? "object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                          : "object-cover"
                      )}
                    />
                  ) : (
                    // Stylish fallback placeholder
                    <div className="size-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1a1b22] to-[#0c0d10]">
                      <span className="text-[10px] tracking-widest text-[#4f7cff] font-mono uppercase mb-1">
                        {item.category || "Case Study"}
                      </span>
                      <h4 className="text-lg font-semibold text-white/90">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/50 mt-1 line-clamp-2 max-w-[80%]">
                        {item.summary}
                      </p>
                    </div>
                  )}

                  {/* Corner action badge */}
                  {action ? (
                    <span className="pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[0.7rem] text-white/90 backdrop-blur-md border border-white/10 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                      <span>{action}</span>
                      <ArrowUpRight className="size-3" />
                    </span>
                  ) : null}

                  {/* Active Card Glow Rim */}
                  {isFront && (
                    <div className="pointer-events-none absolute inset-0 rounded-xl border border-[#4f7cff]/40 shadow-[inset_0_0_16px_rgba(79,124,255,0.15)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ring central title at rest */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-medium text-white/80"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>

      {/* Front-card info: animated swap on item turn */}
      <div
        ref={frontInfoRef}
        className="absolute z-20 pointer-events-none opacity-0 transition-opacity duration-300 md:top-1/2 md:left-[6%] lg:left-[8%] md:-translate-y-1/2 bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 w-[90%] md:w-[320px] lg:w-[400px] text-center md:text-left flex flex-col items-center md:items-start"
      >
        <div key={activeItem?.slug} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          {activeItem?.category && (
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.14em] text-[#4f7cff] font-medium block mb-1">
              {activeItem.category}
            </span>
          )}
          <h3
            className="font-medium tracking-tight text-white text-2xl sm:text-3xl lg:text-4xl leading-tight"
          >
            {activeItem?.title}
          </h3>
          {activeItem?.summary && (
            <p className="mt-2 text-xs sm:text-sm text-white/60 line-clamp-2 max-w-sm">
              {activeItem.summary}
            </p>
          )}
          {onOpenCaseStudy && activeItem && (
            <button
              type="button"
              onClick={() => onOpenCaseStudy(activeItem.slug)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-[#4f7cff] hover:border-[#4f7cff] border border-white/15 px-4 py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all shadow-lg cursor-pointer group pointer-events-auto"
            >
              <span>Read case study</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Index list down the right-hand side */}
      <ol
        className="absolute top-[8%] right-[3%] text-right leading-[1.8] z-10 hidden sm:block"
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <li key={item.slug}>
              <button
                type="button"
                onClick={() => to(i + 1)}
                className={cn(
                  "cursor-pointer inline-flex items-center gap-2 transition-all outline-none font-sans",
                  isActive
                    ? "text-white font-medium scale-105"
                    : "text-white/40 hover:text-white/75"
                )}
              >
                <span>{item.title}</span>
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-all",
                    isActive
                      ? "bg-[#4f7cff] shadow-[0_0_8px_#4f7cff]"
                      : "bg-white/20"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>

      {/* Interaction scroll hint (fades after first turn) */}
      {!hasInteracted && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-white/40 animate-pulse">
          <span>Scroll or drag to turn</span>
          <ArrowRight className="size-3 rotate-90" />
        </div>
      )}

      {/* Crawlable Visually Hidden Semantic List for SEO */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/case-studies/${item.slug}`}>
              {item.title} - {item.category}: {item.summary}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

