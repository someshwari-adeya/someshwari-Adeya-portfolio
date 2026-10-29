"use client";

import React, { useEffect, useId, useState, useMemo, useRef } from "react";
import { useReducedMotion, animate } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                          ISOMETRIC MATH HELPER                             */
/* -------------------------------------------------------------------------- */

const C = Math.cos(Math.PI / 6); // ~0.866025 (30 degrees)
const S = Math.sin(Math.PI / 6); // 0.5

export const iso = (x: number, y: number, z = 0, k = 1): [number, number] => [
  (x - y) * C * k,
  (x + y) * S * k - z * k,
];

export function isoBox(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number
) {
  const p = (a: number, b: number, c: number) => iso(a, b, c).join(",");
  return {
    top: [
      p(x, y, z + h),
      p(x + w, y, z + h),
      p(x + w, y + d, z + h),
      p(x, y + d, z + h),
    ].join(" "),
    left: [
      p(x, y + d, z + h),
      p(x + w, y + d, z + h),
      p(x + w, y + d, z),
      p(x, y + d, z),
    ].join(" "),
    right: [
      p(x + w, y, z + h),
      p(x + w, y + d, z + h),
      p(x + w, y + d, z),
      p(x + w, y, z),
    ].join(" "),
  };
}

/* -------------------------------------------------------------------------- */
/*                    ILLUSTRATION 1: HOW I WORK (CARD 1)                     */
/* -------------------------------------------------------------------------- */

/* Isometric coordinates: u runs up-right along the sheet, v runs down-right
   across it, z is height. Everything is drawn from the same projection so the
   bend, bars and labels always line up. */
const OX_SHEET = 175;
const OY_SHEET = 450;
const P_SHEET = (u: number, v: number, z = 0): [number, number] => [
  OX_SHEET + (u + v) * C,
  OY_SHEET + (v - u) * S - z,
];
const f_str = (n: number) => n.toFixed(1);
const pt_str = (p: [number, number]) => `${f_str(p[0])},${f_str(p[1])}`;
const poly_str = (ps: [number, number][]) => ps.map(pt_str).join(" ");

const W_SHEET = 214; // sheet width (v)
const L_SHEET = 700; // sheet length (u)
const H_SHEET_BASE = 58;  // gentle crest height at rest matching reference
const BEND_START_BASE = 215;
const CREST_BASE = 380;
const BEND_END_BASE = 540;

export function getSnailBend(extraBend: number, ambient = 0) {
  const h = Math.max(24, H_SHEET_BASE + extraBend + ambient);
  // Snail body contraction: crest pulls in, base tightens
  const crest = CREST_BASE - extraBend * 0.38;
  const bendStart = BEND_START_BASE + extraBend * 0.18;
  const bendEnd = BEND_END_BASE - extraBend * 0.28;
  return { h, crest, bendStart, bendEnd };
}

const INITIAL_BEND = getSnailBend(0, 0);

/* Snail bend function: flat, quick lift, gentle crest, long soft fall. */
export const calcZAt = (
  u: number,
  h: number,
  bStart: number,
  crest: number,
  bEnd: number
) => {
  if (u <= bStart) return 0;
  if (u <= crest) {
    const t = (u - bStart) / (crest - bStart);
    return h * Math.sin((t * Math.PI) / 2);
  }
  if (u <= bEnd) {
    const t = (u - crest) / (bEnd - crest);
    return h * (0.5 + 0.5 * Math.cos(Math.PI * t));
  }
  return 0;
};

const N_STEPS = 90;
const us = Array.from({ length: N_STEPS + 1 }, (_, i) => (i / N_STEPS) * L_SHEET);

export function calcRoundedStrip(
  rho = 22,
  dz = 0,
  h: number,
  bStart: number,
  crest: number,
  bEnd: number
) {
  const zFunc = (u: number) => calcZAt(u, h, bStart, crest, bEnd);
  const back = us.map((u) => P_SHEET(u, 0, zFunc(u) + dz));
  const front = us.map((u) => P_SHEET(u, W_SHEET, zFunc(u) + dz)).reverse();
  const z0 = zFunc(0) + dz;
  const zL = zFunc(L_SHEET) + dz;
  const parts: string[] = [];
  parts.push(`M ${pt_str(P_SHEET(rho, 0, zFunc(rho) + dz))}`);
  back.forEach((p, i) => {
    if (us[i] > rho && us[i] < L_SHEET - rho) parts.push(`L ${pt_str(p)}`);
  });
  parts.push(
    `L ${pt_str(P_SHEET(L_SHEET - rho, 0, zL))} Q ${pt_str(P_SHEET(L_SHEET, 0, zL))} ${pt_str(P_SHEET(L_SHEET, rho, zL))}`
  );
  parts.push(
    `L ${pt_str(P_SHEET(L_SHEET, W_SHEET - rho, zL))} Q ${pt_str(P_SHEET(L_SHEET, W_SHEET, zL))} ${pt_str(P_SHEET(L_SHEET - rho, W_SHEET, zL))}`
  );
  const fr = front.map((p, i) => ({ p, u: us[us.length - 1 - i] }));
  fr.forEach(({ p, u }) => {
    if (u < L_SHEET - rho && u > rho) parts.push(`L ${pt_str(p)}`);
  });
  parts.push(
    `L ${pt_str(P_SHEET(rho, W_SHEET, zFunc(rho) + dz))} Q ${pt_str(P_SHEET(0, W_SHEET, z0))} ${pt_str(P_SHEET(0, W_SHEET - rho, z0))}`
  );
  parts.push(
    `L ${pt_str(P_SHEET(0, rho, z0))} Q ${pt_str(P_SHEET(0, 0, z0))} ${pt_str(P_SHEET(rho, 0, zFunc(rho) + dz))} Z`
  );
  return parts.join(" ");
}

export function calcShadowPath(
  h: number,
  bStart: number,
  crest: number,
  bEnd: number
) {
  const zFunc = (u: number) => calcZAt(u, h, bStart, crest, bEnd);
  const archEdge = us
    .filter((u) => u >= crest - 25 && u <= bEnd + 15)
    .map((u) => P_SHEET(u, W_SHEET, zFunc(u)));
  if (archEdge.length === 0) return "";
  return `M ${archEdge.map(pt_str).join(" L ")} L ${pt_str(P_SHEET(bEnd + 15, W_SHEET, 0))} L ${pt_str(P_SHEET(crest - 25, W_SHEET, 0))} Z`;
}

function sheetBar(u0: number, v0: number, w: number, d: number, h: number) {
  return {
    top: poly_str([P_SHEET(u0, v0, h), P_SHEET(u0 + w, v0, h), P_SHEET(u0 + w, v0 + d, h), P_SHEET(u0, v0 + d, h)]),
    left: poly_str([P_SHEET(u0, v0, h), P_SHEET(u0, v0 + d, h), P_SHEET(u0, v0 + d, 0), P_SHEET(u0, v0, 0)]),
    right: poly_str([P_SHEET(u0, v0 + d, h), P_SHEET(u0 + w, v0 + d, h), P_SHEET(u0 + w, v0 + d, 0), P_SHEET(u0, v0 + d, 0)]),
  };
}

/* Replays the build-up when hovered. At rest progress is 1 (full static pose). */
function useReplay(hovered: boolean) {
  const [p, setP] = useState(1);
  const [prevHovered, setPrevHovered] = useState(hovered);

  if (hovered !== prevHovered) {
    setPrevHovered(hovered);
    if (hovered) {
      setP(0);
    } else {
      setP(1);
    }
  }

  useEffect(() => {
    if (!hovered) return;
    const c = animate(0, 1, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setP,
    });
    return () => c.stop();
  }, [hovered]);
  return hovered ? p : 1;
}

const BARS_DATA = [
  { label: "W1", u0: 142, v0: 30, h: 56 },
  { label: "W2", u0: 150, v0: 94, h: 104 },
  { label: "W3", u0: 166, v0: 152, h: 152 },
];

export function HowIWorkIllustration({
  hovered = false,
  isHovered,
  className = "absolute bottom-0 right-0 sm:right-2 w-[min(100%,320px)] sm:w-[min(100%,380px)] md:w-105 lg:w-[470px] xl:w-125 h-auto select-none pointer-events-none transition-all duration-300",
}: {
  hovered?: boolean;
  isHovered?: boolean;
  className?: string;
}) {
  const effectiveHover = isHovered ?? hovered;
  const id = useId().replace(/:/g, "");
  const p = useReplay(effectiveHover);
  const prefersReduced = useReducedMotion();
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
  const stage = (i: number, n: number) => ease((p - (i / (n + 1)) * 0.5) / 0.5);

  // Dynamic theme colors based on hover state (Reference 1 vs Reference 2)
  const barStroke = effectiveHover ? "#4f7cff" : "rgba(255, 255, 255, 0.38)";
  const barTopFill = effectiveHover ? "#26345f" : "#242528";
  const barLeftFill = effectiveHover ? "#121213" : "#131315";
  const barRightFill = effectiveHover ? "#1b1b1d" : "#1a1a1c";
  const textAccent = effectiveHover ? "#4f7cff" : "rgba(255, 255, 255, 0.45)";
  const glowOpacity = effectiveHover ? 0.28 : 0;

  // checks and lines on the raised part of the sheet
  const cu = 262;
  const rows = useMemo(
    () => [
      { v: 40, du: 0 },
      { v: 40, du: 38 },
      { v: 40, du: 76 },
    ],
    []
  );

  // SVG DOM refs for 120fps direct hardware-accelerated animation
  const svgRef = useRef<SVGSVGElement>(null);
  const topPathRef = useRef<SVGPathElement>(null);
  const thicknessPathRef = useRef<SVGPathElement>(null);
  const shadowPathRef = useRef<SVGPathElement>(null);
  const linePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const checkPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const decidedTextRef = useRef<SVGTextElement>(null);

  // Internal mutable state for continuous animation loop
  const effectiveHoverRef = useRef(effectiveHover);
  const pRef = useRef(p);

  useEffect(() => {
    effectiveHoverRef.current = effectiveHover;
    pRef.current = p;
  }, [effectiveHover, p]);

  useEffect(() => {
    if (prefersReduced) return;

    let rafId: number;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let velocity = 0;
    let currentExtra = 0;
    let lastTime = performance.now();

    const onScroll = () => {
      const currentY = window.scrollY || 0;
      const delta = Math.abs(currentY - lastScrollY);
      lastScrollY = currentY;
      // Kinetic impulse: scrolling produces an immediate snail flex
      velocity = Math.min(velocity + delta * 0.35, 22);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. "WHEN SCROLL JUST LITTLE BIT FROM TOP LIKE SNAIL DOES"
      // As user scrolls from 0 to 180px, it arches up dramatically (+38px).
      // Between 180px and 800px, it maintains its proud snail arch posture.
      const scrollY = window.scrollY || 0;
      let topProgress = 0;
      if (scrollY > 0) {
        const norm = Math.min(scrollY / 180, 1);
        topProgress = Math.sin((norm * Math.PI) / 2);
      }

      // 2. Also respond if the user is scrolling the card itself through the viewport
      let cardProgress = 0;
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const viewH = window.innerHeight || 800;
        const dist = viewH * 0.85 - rect.top;
        if (dist > 0 && rect.bottom > 0) {
          const normCard = Math.min(Math.max(dist / 320, 0), 1);
          cardProgress = Math.sin((normCard * Math.PI) / 2);
        }
      }

      const scrollFactor = Math.max(topProgress, cardProgress);

      // Target extra bend from scrolling just a little bit from top
      const baseScrollBend = scrollFactor * 38;

      // Kinetic scroll velocity decay
      velocity *= Math.pow(0.85, dt * 60);

      // Hover bonus (+6px flex)
      const hoverBonus = effectiveHoverRef.current ? 6 : 0;

      const targetExtra = baseScrollBend + velocity + hoverBonus;

      // Liquid spring lerp towards target
      currentExtra += (targetExtra - currentExtra) * Math.min(1, 0.12 * (dt * 60));

      // Snail breathing: ambient subtle living pulse (period ~2.8s)
      const ambient = Math.sin(now * 0.0022) * 3.2;

      const { h, crest, bendStart, bendEnd } = getSnailBend(currentExtra, ambient);

      // Direct SVG attribute updates for zero-lag 120fps smoothness
      if (topPathRef.current) {
        topPathRef.current.setAttribute("d", calcRoundedStrip(22, 0, h, bendStart, crest, bendEnd));
      }
      if (thicknessPathRef.current) {
        thicknessPathRef.current.setAttribute("d", calcRoundedStrip(22, -13, h, bendStart, crest, bendEnd));
      }
      if (shadowPathRef.current) {
        shadowPathRef.current.setAttribute("d", calcShadowPath(h, bendStart, crest, bendEnd));
      }

      // Update lines and checkmarks riding on the dynamic bend
      const currentP = pRef.current;
      const isHover = effectiveHoverRef.current;
      const kCalc = (idx: number) => (isHover ? ease((currentP - (idx / 4) * 0.5) / 0.5) : 1);

      rows.forEach((r, i) => {
        const u = cu + r.du;
        const z = calcZAt(u, h, bendStart, crest, bendEnd);
        const a = P_SHEET(u, r.v, z);
        const b = P_SHEET(u, r.v + 100, z);
        const k = kCalc(i);
        const m: [number, number] = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

        const lineEl = linePathRefs.current[i];
        if (lineEl) {
          lineEl.setAttribute("d", `M ${pt_str(a)} L ${pt_str(m)}`);
        }
        const checkEl = checkPathRefs.current[i];
        if (checkEl) {
          checkEl.setAttribute(
            "d",
            `M ${f_str(b[0] + 10)} ${f_str(b[1] - 4)} L ${f_str(b[0] + 18)} ${f_str(b[1] + 4)} L ${f_str(b[0] + 38)} ${f_str(b[1] - 10)}`
          );
        }
      });

      // Update DECIDED label
      if (decidedTextRef.current) {
        const zDecided = calcZAt(250, h, bendStart, crest, bendEnd);
        decidedTextRef.current.setAttribute(
          "transform",
          `translate(${pt_str(P_SHEET(250, 6, zDecided))}) rotate(-30) skewX(-30)`
        );
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [prefersReduced, rows]);

  const initialBend = INITIAL_BEND;

  return (
    <svg
      ref={svgRef}
      viewBox="20 10 1110 610"
      className={className}
      fill="none"
      role="img"
      aria-label="A sheet bending from a delivery plate with weekly bars up to a decided plan and a spec"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`${id}glow`} cx="52%" cy="62%" r="48%">
          <stop offset="0" stopColor="#3b5bdb" stopOpacity={glowOpacity} />
          <stop offset="1" stopColor="#3b5bdb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}sheet`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f1f21" />
          <stop offset="1" stopColor="#161618" />
        </linearGradient>
        <filter id={`${id}blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id={`${id}under`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.95" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="600" cy="400" rx="520" ry="230" fill={`url(#${id}glow)`} className="transition-opacity duration-300" />

      {/* dotted guides and crosshairs */}
      <g stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="1.5 4" strokeLinecap="round">
        <path d={`M ${pt_str(P_SHEET(-60, -40, 0))} L ${pt_str(P_SHEET(900, -40, 0))}`} />
        <path d={`M ${pt_str(P_SHEET(-60, W_SHEET + 50, 0))} L ${pt_str(P_SHEET(300, W_SHEET + 50, 0))}`} />
        <path d={`M ${pt_str(P_SHEET(L_SHEET + 60, -60, 0))} L ${pt_str(P_SHEET(L_SHEET + 60, W_SHEET + 90, 0))}`} />
        <path d={`M ${pt_str(P_SHEET(-70, -40, 0))} L ${pt_str(P_SHEET(-70, W_SHEET + 60, 0))}`} />
        <path d={`M ${pt_str(P_SHEET(L_SHEET, W_SHEET, 0))} L ${pt_str(P_SHEET(L_SHEET + 120, W_SHEET, 0))}`} />
        <path d={`M ${pt_str(P_SHEET(0, W_SHEET, 0))} L ${pt_str(P_SHEET(-40, W_SHEET + 60, 0))}`} />
      </g>
      <g stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round">
        {[P_SHEET(-70, -40, 0), P_SHEET(L_SHEET + 60, -60, 0), P_SHEET(L_SHEET + 60, W_SHEET + 90, 0), P_SHEET(-60, W_SHEET + 50, 0)].map(([x, y], i) => (
          <path key={i} d={`M ${x - 6} ${y - 6} L ${x + 6} ${y + 6} M ${x + 6} ${y - 6} L ${x - 6} ${y + 6}`} />
        ))}
      </g>

      {/* shadow under the arch */}
      <path
        ref={shadowPathRef}
        d={calcShadowPath(initialBend.h, initialBend.bendStart, initialBend.crest, initialBend.bendEnd)}
        fill={`url(#${id}under)`}
        filter={`url(#${id}blur)`}
        transform="translate(0 6)"
      />

      {/* sheet thickness then top surface */}
      <path
        ref={thicknessPathRef}
        d={calcRoundedStrip(22, -13, initialBend.h, initialBend.bendStart, initialBend.crest, initialBend.bendEnd)}
        fill="#0e0e0f"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        ref={topPathRef}
        d={calcRoundedStrip(22, 0, initialBend.h, initialBend.bendStart, initialBend.crest, initialBend.bendEnd)}
        fill={`url(#${id}sheet)`}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* plate details: baseline and shipped */}
      <path d={`M ${pt_str(P_SHEET(60, 20))} L ${pt_str(P_SHEET(60, 200))}`} stroke="rgba(255,255,255,0.32)" strokeWidth="1.4" />
      <path d={`M ${pt_str(P_SHEET(30, 118))} L ${pt_str(P_SHEET(30, 170))}`} stroke="rgba(255,255,255,0.28)" strokeWidth="1.4" />
      
      {/* pixel patch */}
      <g opacity={ease(p * 1.4)}>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => {
            const on = [
              [1, 1, 0, 1, 1],
              [0, 1, 1, 1, 0],
              [1, 0, 1, 0, 1],
              [0, 1, 1, 1, 0],
              [1, 1, 0, 0, 1],
            ][r][c];
            if (!on) return null;
            const u = 14 + c * 7.5;
            const v = 62 + r * 7.5;
            return (
              <polygon
                key={`${r}-${c}`}
                points={poly_str([P_SHEET(u, v), P_SHEET(u + 6, v), P_SHEET(u + 6, v + 6), P_SHEET(u, v + 6)])}
                fill={effectiveHover ? "rgba(200,200,205,0.55)" : "rgba(180,180,190,0.38)"}
              />
            );
          })
        )}
      </g>
      <text
        transform={`translate(${pt_str(P_SHEET(12, 112))}) rotate(30) skewX(0)`}
        fill={textAccent}
        fontSize="11"
        fontWeight="600"
        letterSpacing="2"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        className="transition-colors duration-300"
      >
        SHIPPED
      </text>

      {/* bars, drawn back to front */}
      {BARS_DATA.map((b, i) => {
        const h = b.h * (effectiveHover ? stage(i, BARS_DATA.length) : 1);
        const g = sheetBar(b.u0, b.v0, 40, 40, Math.max(h, 0.01));
        const [lx, ly] = P_SHEET(b.u0, b.v0 + 8);
        return (
          <g key={b.label}>
            <text
              x={lx - 16}
              y={ly + 26}
              transform={`rotate(30 ${f_str(lx - 16)} ${f_str(ly + 26)})`}
              fill="rgba(255,255,255,0.45)"
              fontSize="12"
              fontStyle="italic"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {b.label}
            </text>
            <polygon points={g.left} fill={barLeftFill} stroke={barStroke} strokeWidth="1.3" strokeLinejoin="round" className="transition-colors duration-300" />
            <polygon points={g.right} fill={barRightFill} stroke={barStroke} strokeWidth="1.3" strokeLinejoin="round" className="transition-colors duration-300" />
            <polygon points={g.top} fill={barTopFill} stroke={barStroke} strokeWidth="1.3" strokeLinejoin="round" className="transition-colors duration-300" />
          </g>
        );
      })}

      {/* DECIDED lines and checks, painted on the raised surface */}
      <g opacity={effectiveHover ? stage(1, 3) : 1}>
        {rows.map((r, i) => {
          const u = cu + r.du;
          const a = P_SHEET(u, r.v, calcZAt(u, initialBend.h, initialBend.bendStart, initialBend.crest, initialBend.bendEnd));
          const b = P_SHEET(u, r.v + 100, calcZAt(u, initialBend.h, initialBend.bendStart, initialBend.crest, initialBend.bendEnd));
          const k = effectiveHover ? stage(i, 3) : 1;
          const m: [number, number] = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
          return (
            <g key={i}>
              <path
                ref={(el) => {
                  linePathRefs.current[i] = el;
                }}
                d={`M ${pt_str(a)} L ${pt_str(m)}`}
                stroke="rgba(255,255,255,0.36)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {effectiveHover && (
                <path
                  ref={(el) => {
                    checkPathRefs.current[i] = el;
                  }}
                  d={`M ${f_str(b[0] + 10)} ${f_str(b[1] - 4)} L ${f_str(b[0] + 18)} ${f_str(b[1] + 4)} L ${f_str(b[0] + 38)} ${f_str(b[1] - 10)}`}
                  stroke="#4f7cff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset={60 * (1 - k)}
                />
              )}
            </g>
          );
        })}
        <text
          ref={decidedTextRef}
          transform={`translate(${pt_str(P_SHEET(250, 6, calcZAt(250, initialBend.h, initialBend.bendStart, initialBend.crest, initialBend.bendEnd)))}) rotate(-30) skewX(-30)`}
          fill={textAccent}
          fontSize="9.5"
          fontStyle="italic"
          letterSpacing="2.2"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          className="transition-colors duration-300"
        >
          DECIDED
        </text>
      </g>

      {/* SPEC document on the flat end */}
      <g opacity={effectiveHover ? ease(p * 1.2) : 1}>
        <polygon points={poly_str([P_SHEET(572, 34), P_SHEET(590, 34), P_SHEET(590, 150), P_SHEET(572, 150)])} fill="rgba(255,255,255,0.26)" />
        {[612, 626, 640, 654, 668].map((u, i) => (
          <path
            key={u}
            d={`M ${pt_str(P_SHEET(u, 34))} L ${pt_str(P_SHEET(u, i % 2 ? 100 : 128))}`}
            stroke="rgba(255,255,255,0.26)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        ))}
        <text
          transform={`translate(${pt_str(P_SHEET(612, 170))}) rotate(30)`}
          fill={textAccent}
          fontSize="11"
          fontWeight="600"
          letterSpacing="2"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          className="transition-colors duration-300"
        >
          SPEC
        </text>
      </g>
    </svg>
  );
}

export default HowIWorkIllustration;

/* -------------------------------------------------------------------------- */
/*                 ILLUSTRATION 2: WHAT YOU GET / CONVEYOR (CARD 3)            */
/* -------------------------------------------------------------------------- */

export interface ConveyorIllustrationProps {
  hovered?: boolean;
  playKey?: number;
  testProgress?: number;
  className?: string;
  onLabelChange?: (label: string) => void;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const springPop = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  if (x === 0) return 0;
  if (x === 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

export function ConveyorIllustration({
  hovered = false,
  playKey = 0,
  testProgress,
  className = "",
  onLabelChange,
}: ConveyorIllustrationProps) {
  const prefersReduced = useReducedMotion();
  const [animProgress, setAnimProgress] = useState(0); // 0 = resting full illustration
  const rootRef = useRef<SVGSVGElement>(null);
  const hasAutoPlayed = useRef(false);

  // Consolidated animation controller: loops while hovered, single cycle on tap / playKey
  useEffect(() => {
    if (prefersReduced) return;
    if (hovered) {
      const controls = animate(0, 1, {
        duration: 4.8,
        repeat: Infinity,
        ease: "linear",
        onUpdate: (val) => setAnimProgress(val),
      });
      return () => {
        controls.stop();
        setAnimProgress(0);
      };
    } else if (playKey > 0) {
      const controls = animate(0, 1, {
        duration: 4.8,
        ease: "easeInOut",
        onUpdate: (val) => setAnimProgress(val),
        onComplete: () => setAnimProgress(0),
      });
      return () => {
        controls.stop();
        setAnimProgress(0);
      };
    }
  }, [hovered, playKey, prefersReduced]);

  // Auto-play once when 45% in view on touch screens
  useEffect(() => {
    if (hasAutoPlayed.current || prefersReduced) return;
    const el = rootRef.current;
    if (!el) return;

    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;

    let controls: { stop: () => void } | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.45 && !hasAutoPlayed.current) {
            hasAutoPlayed.current = true;
            controls = animate(0, 1, {
              duration: 4.8,
              ease: "easeInOut",
              onUpdate: (val) => setAnimProgress(val),
              onComplete: () => setAnimProgress(0),
            });
          }
        });
      },
      { threshold: [0.45] }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [prefersReduced]);

  const p =
    testProgress !== undefined ? testProgress : prefersReduced ? 0 : animProgress;

  // Sync footer label to conveyor animation stages
  useEffect(() => {
    if (!onLabelChange) return;
    if (p <= 0.05 || p < 0.35) {
      onLabelChange("TYPED END TO END");
    } else if (p < 0.68) {
      onLabelChange("EVALS & GUARDRAILS");
    } else {
      onLabelChange("DEPLOYED & SCALING");
    }
  }, [p, onLabelChange]);

  // Scan beam sweep windows
  let scanY: number | null = null;
  if (p >= 0.08 && p <= 0.28) {
    scanY = 66 + 54 * ((p - 0.08) / 0.20);
  } else if (p >= 0.41 && p <= 0.61) {
    scanY = 66 + 54 * ((p - 0.41) / 0.20);
  } else if (p >= 0.74 && p <= 0.94) {
    scanY = 66 + 54 * ((p - 0.74) / 0.20);
  }

  // Box positions and certification states (smooth movement from rest)
  // At rest (p = 0): Box 1 at 88, Box 2 at 180, Box 3 at 272
  let box1X = 88;
  let box2X = 180;
  let box3X = 272;
  let box1Certified = 0;
  let box2Certified = 0;
  let box3Certified = 0;
  let box1BadgeScale = 0;
  let box2BadgeScale = 0;
  let box3BadgeScale = 0;

  if (p > 0) {
    // Continuous subtle conveyor movement along belt
    const shift = (p * 50);
    box1X = 88 + shift;
    box2X = 180 + shift * 0.9;
    box3X = 272 + shift * 0.85;

    // Badges pop when scanned
    box1Certified = smooth(0.12, 0.28, p);
    box1BadgeScale = springPop(0.12, 0.28, p);

    box2Certified = smooth(0.45, 0.61, p);
    box2BadgeScale = springPop(0.45, 0.61, p);

    box3Certified = smooth(0.78, 0.94, p);
    box3BadgeScale = springPop(0.78, 0.94, p);
  }

  // Conveyor ridges roll smoothly forward along top face when p > 0
  const ridgeOffset = p > 0 ? (p * 4.8 * 36) % 28 : 0;

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 600 310"
      className={`pointer-events-none absolute right-[-4%] bottom-[-3%] w-[96%] h-auto overflow-visible select-none ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(115, 90)">
        {/* Support Leg under the conveyor on the left */}
        {(() => {
          const leg = isoBox(-5, 84, -40, 18, 18, 40);
          return (
            <g>
              <polygon
                points={leg.left}
                fill="#101216"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <polygon
                points={leg.right}
                fill="#0c0d10"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
            </g>
          );
        })()}

        {/* Main Conveyor Slab */}
        {(() => {
          const belt = isoBox(-30, 60, 0, 460, 66, 16);
          const capCenter = iso(-30, 93, 8);
          return (
            <g id="conveyor-structure">
              {/* Belt Top Surface */}
              <polygon
                points={belt.top}
                fill="#15171d"
                stroke="rgba(255, 255, 255, 0.32)"
                strokeWidth="1"
              />
              {/* Front Left Bevel */}
              <polygon
                points={belt.left}
                fill="#0f1014"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
              {/* Front Right Bevel */}
              <polygon
                points={belt.right}
                fill="#0a0b0d"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1"
              />

              {/* Rounded End Cap at Upper-Left with small inset circle */}
              <ellipse
                cx={capCenter[0]}
                cy={capCenter[1]}
                rx="8"
                ry="14"
                fill="#13141a"
                stroke="rgba(255, 255, 255, 0.32)"
                strokeWidth="1"
              />
              <circle
                cx={capCenter[0]}
                cy={capCenter[1]}
                r="3"
                fill="none"
                stroke="rgba(255, 255, 255, 0.38)"
                strokeWidth="1"
              />
            </g>
          );
        })()}

        {/* Conveyor Belt Ridges across the top face */}
        <g id="conveyor-ridges">
          {Array.from({ length: 19 }, (_, i) => {
            const rx = -30 + ((i * 28 + ridgeOffset) % (19 * 28));
            const p1 = iso(rx, 60, 16);
            const p2 = iso(rx, 126, 16);
            return (
              <line
                key={i}
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="1.2"
              />
            );
          })}
        </g>

        {/* Gantry Arch Back Post (behind boxes) */}
        <g id="gantry-back-post">
          {(() => {
            const postBack = isoBox(140, 50, 0, 12, 10, 86);
            const isConveyorActive = p > 0;
            const gantryStroke = isConveyorActive ? "#4f7cff" : "rgba(255, 255, 255, 0.35)";
            const postTop = isConveyorActive ? "#1c2230" : "#1a1b20";
            const postLeft = isConveyorActive ? "#141924" : "#141518";
            const postRight = isConveyorActive ? "#0f121a" : "#0f1012";

            return (
              <g>
                <polygon
                  points={postBack.top}
                  fill={postTop}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <polygon
                  points={postBack.left}
                  fill={postLeft}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <polygon
                  points={postBack.right}
                  fill={postRight}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <ellipse
                  cx={iso(146, 55, 88)[0]}
                  cy={iso(146, 55, 88)[1]}
                  rx="5"
                  ry="2.5"
                  fill={isConveyorActive ? "#4f7cff" : "rgba(255, 255, 255, 0.3)"}
                  stroke={isConveyorActive ? "#82a4ff" : "rgba(255, 255, 255, 0.45)"}
                  strokeWidth="0.8"
                  className="transition-colors duration-300"
                />
              </g>
            );
          })()}
        </g>

        {/* 3 Isometric Boxes on the Belt - Fully visible at all times */}
        <g id="boxes-group">
          {/* Box 1: Growth box (Chart icon) */}
          <g id="box-1">
            {(() => {
              const b = isoBox(box1X, 70, 16, 54, 54, 48);
              const tapeStart = iso(box1X + 27, 70, 16 + 48);
              const tapeEnd = iso(box1X + 27, 70 + 54, 16 + 48);
              const iconPlate = iso(box1X + 54, 70 + 27, 16 + 24);
              const isBlue = box1Certified > 0.5;

              return (
                <g>
                  <polygon
                    points={b.top}
                    fill={isBlue ? "#161e2c" : "#1c1e24"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.4)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />
                  <polygon
                    points={b.left}
                    fill={isBlue ? "#111622" : "#131418"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.35)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />
                  <polygon
                    points={b.right}
                    fill={isBlue ? "#0d111a" : "#0e0f13"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.28)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />

                  {/* Tape line */}
                  <line
                    x1={tapeStart[0]}
                    y1={tapeStart[1]}
                    x2={tapeEnd[0]}
                    y2={tapeEnd[1]}
                    stroke={isBlue ? "#82a4ff" : "rgba(255,255,255,0.22)"}
                    strokeWidth="3"
                  />

                  {/* Front plate: Chart icon */}
                  <g transform={`translate(${iconPlate[0]}, ${iconPlate[1]})`}>
                    <rect
                      x="-10"
                      y="-10"
                      width="20"
                      height="20"
                      rx="2.5"
                      fill="#0b0c10"
                      stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.28)"}
                      strokeWidth="0.8"
                    />
                    <rect x="-7" y="-2" width="3" height="8" fill="#4f7cff" />
                    <rect x="-2" y="-5" width="3" height="11" fill="#4f7cff" />
                    <rect x="3" y="-9" width="3" height="15" fill="#82a4ff" />
                  </g>

                  {/* Certified check badge */}
                  {box1BadgeScale > 0 && (
                    <g
                      transform={`translate(${
                        iso(box1X + 27, 70 + 27, 16 + 58)[0]
                      }, ${
                        iso(box1X + 27, 70 + 27, 16 + 58)[1]
                      }) scale(${box1BadgeScale})`}
                    >
                      <circle cx="0" cy="0" r="7.5" fill="#4f7cff" />
                      <path
                        d="M -3 -0.5 L -1 1.8 L 3 -2.2"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}
                </g>
              );
            })()}
          </g>

          {/* Box 2: Security box (Shield icon) */}
          <g id="box-2">
            {(() => {
              const b = isoBox(box2X, 70, 16, 54, 54, 48);
              const tapeStart = iso(box2X + 27, 70, 16 + 48);
              const tapeEnd = iso(box2X + 27, 70 + 54, 16 + 48);
              const iconPlate = iso(box2X + 54, 70 + 27, 16 + 24);
              const isBlue = box2Certified > 0.5;

              return (
                <g>
                  <polygon
                    points={b.top}
                    fill={isBlue ? "#161e2c" : "#1c1e24"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.4)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />
                  <polygon
                    points={b.left}
                    fill={isBlue ? "#111622" : "#131418"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.35)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />
                  <polygon
                    points={b.right}
                    fill={isBlue ? "#0d111a" : "#0e0f13"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.28)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />

                  {/* Tape line */}
                  <line
                    x1={tapeStart[0]}
                    y1={tapeStart[1]}
                    x2={tapeEnd[0]}
                    y2={tapeEnd[1]}
                    stroke={isBlue ? "#82a4ff" : "rgba(255,255,255,0.22)"}
                    strokeWidth="3"
                  />

                  {/* Front plate: Shield icon */}
                  <g transform={`translate(${iconPlate[0]}, ${iconPlate[1]})`}>
                    <rect
                      x="-10"
                      y="-10"
                      width="20"
                      height="20"
                      rx="2.5"
                      fill="#090c12"
                      stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.28)"}
                      strokeWidth="0.8"
                    />
                    <path
                      d="M 0,-6 L 6,-3.5 L 6,2.5 C 6,6 0,8.5 0,8.5 C 0,8.5 -6,6 -6,2.5 L -6,-3.5 Z"
                      fill="none"
                      stroke="#4f7cff"
                      strokeWidth="1.3"
                    />
                  </g>

                  {/* Certified check badge */}
                  {box2BadgeScale > 0 && (
                    <g
                      transform={`translate(${
                        iso(box2X + 27, 70 + 27, 16 + 58)[0]
                      }, ${
                        iso(box2X + 27, 70 + 27, 16 + 58)[1]
                      }) scale(${box2BadgeScale})`}
                    >
                      <circle cx="0" cy="0" r="7.5" fill="#4f7cff" />
                      <path
                        d="M -3 -0.5 L -1 1.8 L 3 -2.2"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}
                </g>
              );
            })()}
          </g>

          {/* Box 3: Typed box (<T> icon) */}
          <g id="box-3">
            {(() => {
              const b = isoBox(box3X, 70, 16, 54, 54, 48);
              const tapeStart = iso(box3X + 27, 70, 16 + 48);
              const tapeEnd = iso(box3X + 27, 70 + 54, 16 + 48);
              const iconPlate = iso(box3X + 54, 70 + 27, 16 + 24);
              const isBlue = box3Certified > 0.5;

              return (
                <g>
                  <polygon
                    points={b.top}
                    fill={isBlue ? "#161e2c" : "#1c1e24"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.4)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />
                  <polygon
                    points={b.left}
                    fill={isBlue ? "#111622" : "#131418"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.35)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />
                  <polygon
                    points={b.right}
                    fill={isBlue ? "#0d111a" : "#0e0f13"}
                    stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.28)"}
                    strokeWidth={isBlue ? 1.2 : 1}
                    className="transition-colors duration-200"
                  />

                  {/* Tape line */}
                  <line
                    x1={tapeStart[0]}
                    y1={tapeStart[1]}
                    x2={tapeEnd[0]}
                    y2={tapeEnd[1]}
                    stroke={isBlue ? "#82a4ff" : "rgba(255,255,255,0.22)"}
                    strokeWidth="3"
                  />

                  {/* Front plate: <T> badge */}
                  <g transform={`translate(${iconPlate[0]}, ${iconPlate[1]})`}>
                    <rect
                      x="-10"
                      y="-10"
                      width="20"
                      height="20"
                      rx="2.5"
                      fill="#090c12"
                      stroke={isBlue ? "#4f7cff" : "rgba(255,255,255,0.28)"}
                      strokeWidth="0.8"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#4f7cff"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      &lt;T&gt;
                    </text>
                  </g>

                  {/* Certified check badge */}
                  {box3BadgeScale > 0 && (
                    <g
                      transform={`translate(${
                        iso(box3X + 27, 70 + 27, 16 + 58)[0]
                      }, ${
                        iso(box3X + 27, 70 + 27, 16 + 58)[1]
                      }) scale(${box3BadgeScale})`}
                    >
                      <circle cx="0" cy="0" r="7.5" fill="#4f7cff" />
                      <path
                        d="M -3 -0.5 L -1 1.8 L 3 -2.2"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}
                </g>
              );
            })()}
          </g>
        </g>

        {/* Gantry Arch Front Post, Top Beam & Scanner Plate (drawn in front of boxes) */}
        <g id="gantry-foreground">
          {/* Top Horizontal Beam */}
          {(() => {
            const beam = isoBox(140, 50, 74, 12, 86, 12);
            const isConveyorActive = p > 0;
            const gantryStroke = isConveyorActive ? "#4f7cff" : "rgba(255, 255, 255, 0.35)";
            const beamTop = isConveyorActive ? "#242d40" : "#1e2026";
            const beamLeft = isConveyorActive ? "#171d2b" : "#141518";
            const beamRight = isConveyorActive ? "#121622" : "#0f1012";

            return (
              <g>
                <polygon
                  points={beam.top}
                  fill={beamTop}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <polygon
                  points={beam.left}
                  fill={beamLeft}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <polygon
                  points={beam.right}
                  fill={beamRight}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
              </g>
            );
          })()}

          {/* Flat Scanner Plate suspended under top arch */}
          {(() => {
            const scanner = isoBox(135, 64, 64, 22, 58, 3.5);
            const isConveyorActive = p > 0;
            const scannerPlateStroke = isConveyorActive ? "#4f7cff" : "rgba(255, 255, 255, 0.28)";
            const scannerPlateFill = isConveyorActive ? "#1a2233" : "#131418";

            return (
              <g>
                <polygon
                  points={scanner.top}
                  fill={scannerPlateFill}
                  stroke={scannerPlateStroke}
                  strokeWidth="0.8"
                  className="transition-colors duration-300"
                />
                <polygon
                  points={scanner.left}
                  fill="#101520"
                  stroke={scannerPlateStroke}
                  strokeWidth="0.8"
                  className="transition-colors duration-300"
                />
              </g>
            );
          })()}

          {/* Glowing Blue Scan Line and Laser Curtain */}
          {scanY !== null && (
            <g id="scanner-beam">
              <line
                x1={iso(135, scanY, 62)[0]}
                y1={iso(135, scanY, 62)[1]}
                x2={iso(157, scanY, 62)[0]}
                y2={iso(157, scanY, 62)[1]}
                stroke="#4f7cff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <polygon
                points={[
                  iso(135, scanY, 62).join(","),
                  iso(157, scanY, 62).join(","),
                  iso(157, scanY, 18).join(","),
                  iso(135, scanY, 18).join(","),
                ].join(" ")}
                fill="rgba(79, 124, 255, 0.22)"
              />
            </g>
          )}

          {/* Front Post */}
          {(() => {
            const postFront = isoBox(140, 126, 0, 12, 10, 86);
            const isConveyorActive = p > 0;
            const gantryStroke = isConveyorActive ? "#4f7cff" : "rgba(255, 255, 255, 0.35)";
            const postTop = isConveyorActive ? "#1c2230" : "#1a1b20";
            const postLeft = isConveyorActive ? "#141924" : "#141518";
            const postRight = isConveyorActive ? "#0f121a" : "#0f1012";

            return (
              <g>
                <polygon
                  points={postFront.top}
                  fill={postTop}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <polygon
                  points={postFront.left}
                  fill={postLeft}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
                <polygon
                  points={postFront.right}
                  fill={postRight}
                  stroke={gantryStroke}
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
              </g>
            );
          })()}
        </g>
      </g>
    </svg>
  );
}