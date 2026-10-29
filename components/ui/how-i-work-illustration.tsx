"use client";

import React, { useEffect, useId, useState, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

/* Isometric coordinates: u runs up-right along the sheet, v runs down-right
   across it, z is height. Everything is drawn from the same projection so the
   bend, bars and labels always line up. */
const C = Math.cos(Math.PI / 6);
const S = 0.5;
const OX = 125;
const OY = 400;
const P = (u: number, v: number, z = 0): [number, number] => [
  OX + (u + v) * C,
  OY + (v - u) * S - z,
];
const f = (n: number) => n.toFixed(1);
const pt = (p: [number, number]) => `${f(p[0])},${f(p[1])}`;
const poly = (ps: [number, number][]) => ps.map(pt).join(" ");

const W = 214; // sheet width (v)
const L = 585; // sheet length (u)
const H = 98; // crest height
const BEND_START = 196;
const CREST = 345;
const BEND_END = 470;

/* The bend: flat, quick lift, crest, long soft fall. Multiplied by bend factor with optional extra lift. */
const zAt = (u: number, extraH = 0) => {
  const h = H + extraH;
  if (h <= 0) return 0;
  if (u <= BEND_START) return 0;
  if (u <= CREST) {
    const t = (u - BEND_START) / (CREST - BEND_START);
    return h * Math.sin((t * Math.PI) / 2);
  }
  if (u <= BEND_END) {
    const t = (u - CREST) / (BEND_END - CREST);
    return h * (0.5 + 0.5 * Math.cos(Math.PI * t));
  }
  return 0;
};

const N = 90;
const us = Array.from({ length: N + 1 }, (_, i) => (i / N) * L);
const edge = (v: number, dz = 0, extraH = 0) =>
  us.map((u) => P(u, v, zAt(u, extraH) + dz));

function roundedStrip(rho = 22, dz = 0, extraH = 0) {
  const back = edge(0, dz, extraH);
  const front = edge(W, dz, extraH).reverse();
  const z0 = zAt(0, extraH) + dz;
  const zL = zAt(L, extraH) + dz;
  const parts: string[] = [];
  parts.push(`M ${pt(P(rho, 0, zAt(rho, extraH) + dz))}`);
  back.forEach((p, i) => {
    if (us[i] > rho && us[i] < L - rho) parts.push(`L ${pt(p)}`);
  });
  parts.push(
    `L ${pt(P(L - rho, 0, zL))} Q ${pt(P(L, 0, zL))} ${pt(P(L, rho, zL))}`
  );
  parts.push(
    `L ${pt(P(L, W - rho, zL))} Q ${pt(P(L, W, zL))} ${pt(P(L - rho, W, zL))}`
  );
  const fr = front.map((p, i) => ({ p, u: us[us.length - 1 - i] }));
  fr.forEach(({ p, u }) => {
    if (u < L - rho && u > rho) parts.push(`L ${pt(p)}`);
  });
  parts.push(
    `L ${pt(P(rho, W, zAt(rho, extraH) + dz))} Q ${pt(P(0, W, z0))} ${pt(
      P(0, W - rho, z0)
    )}`
  );
  parts.push(
    `L ${pt(P(0, rho, z0))} Q ${pt(P(0, 0, z0))} ${pt(
      P(rho, 0, zAt(rho, extraH) + dz)
    )} Z`
  );
  return parts.join(" ");
}

function bar(u0: number, v0: number, w: number, d: number, h: number) {
  return {
    top: poly([
      P(u0, v0, h),
      P(u0 + w, v0, h),
      P(u0 + w, v0 + d, h),
      P(u0, v0 + d, h),
    ]),
    left: poly([
      P(u0, v0, h),
      P(u0, v0 + d, h),
      P(u0, v0 + d, 0),
      P(u0, v0, 0),
    ]),
    right: poly([
      P(u0, v0 + d, h),
      P(u0 + w, v0 + d, h),
      P(u0 + w, v0 + d, 0),
      P(u0, v0 + d, 0),
    ]),
  };
}

const BARS = [
  { label: "W1", u0: 142, v0: 30, h: 72 },
  { label: "W2", u0: 150, v0: 94, h: 134 },
  { label: "W3", u0: 166, v0: 152, h: 196 },
];

/* Helper easing math */
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export default function HowIWorkIllustration({
  hovered = false,
  playKey = 0,
  testProgress,
  className,
}: {
  hovered?: boolean;
  playKey?: number;
  testProgress?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const rootRef = useRef<SVGSVGElement>(null);
  const [animProgress, setAnimProgress] = useState(0); // 0 = resting full grayscale illustration
  const prefersReduced = useReducedMotion();
  const hasAutoPlayed = useRef(false);

  // Consolidated animation controller: loops while hovered, single cycle on tap / playKey
  useEffect(() => {
    if (prefersReduced) return;
    if (hovered) {
      const controls = animate(0, 1, {
        duration: 2.6,
        repeat: Infinity,
        ease: "easeInOut",
        onUpdate: (val) => setAnimProgress(val),
      });
      return () => {
        controls.stop();
        setAnimProgress(0);
      };
    } else if (playKey > 0) {
      const controls = animate(0, 1, {
        duration: 2.6,
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

  // Auto-play once when 45% in view on touch screens (no hover)
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
              duration: 2.6,
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

  // Visual mode: GRAY at rest (p === 0), BLUE blows in when hovered / active (p > 0)
  const isBlue = p > 0;

  // 1. Dynamic Arch flex: lifts dynamically by up to +16px in the middle of the wave
  let extraH = 0;
  if (isBlue) {
    extraH = Math.sin(p * Math.PI) * 16;
  }

  // 2. DECIDED Checklist coordinates
  const cu = 262;
  const rows = [
    { v: 40, du: 0 },
    { v: 40, du: 38 },
    { v: 40, du: 76 },
  ];

  return (
    <svg
      ref={rootRef}
      viewBox="0 30 960 500"
      className={className}
      fill="none"
      role="img"
      aria-label="A sheet bending from a delivery plate with weekly bars up to a decided plan and a spec"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Glow: neutral subtle at rest, vibrant electric blue blooms in on hover */}
        <radialGradient id={`${id}glow`} cx="52%" cy="62%" r="48%">
          <stop
            offset="0"
            stopColor={isBlue ? "#3b5bdb" : "#ffffff"}
            stopOpacity={isBlue ? 0.32 : 0.04}
          />
          <stop
            offset="1"
            stopColor={isBlue ? "#3b5bdb" : "#ffffff"}
            stopOpacity="0"
          />
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

      <ellipse
        cx="560"
        cy="360"
        rx="520"
        ry="230"
        fill={`url(#${id}glow)`}
        className="transition-all duration-300"
      />

      {/* Dotted guides and crosshairs (monochrome silver/gray) */}
      <g
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
        strokeDasharray="1.5 4"
        strokeLinecap="round"
      >
        <path d={`M ${pt(P(-60, -40, 0))} L ${pt(P(900, -40, 0))}`} />
        <path d={`M ${pt(P(-60, W + 50, 0))} L ${pt(P(300, W + 50, 0))}`} />
        <path d={`M ${pt(P(L + 60, -60, 0))} L ${pt(P(L + 60, W + 90, 0))}`} />
        <path d={`M ${pt(P(-70, -40, 0))} L ${pt(P(-70, W + 60, 0))}`} />
        <path d={`M ${pt(P(L, W, 0))} L ${pt(P(L + 120, W, 0))}`} />
        <path d={`M ${pt(P(0, W, 0))} L ${pt(P(-40, W + 60, 0))}`} />
      </g>
      <g
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        {[
          P(-70, -40, 0),
          P(L + 60, -60, 0),
          P(L + 60, W + 90, 0),
          P(-60, W + 50, 0),
        ].map(([x, y], i) => (
          <path
            key={i}
            d={`M ${x - 6} ${y - 6} L ${x + 6} ${y + 6} M ${x + 6} ${y - 6} L ${x - 6} ${y + 6}`}
          />
        ))}
      </g>

      {/* Shadow under the arch */}
      <path
        d={`M ${edge(W, 0, extraH)
          .filter((_, i) => us[i] >= CREST - 20 && us[i] <= BEND_END + 10)
          .map(pt)
          .join(" L ")} L ${pt(P(BEND_END + 10, W, 0))} L ${pt(
          P(CREST - 20, W, 0)
        )} Z`}
        fill={`url(#${id}under)`}
        filter={`url(#${id}blur)`}
        transform="translate(0 6)"
        opacity={0.88}
      />

      {/* Sheet thickness and top surface */}
      <g>
        <path
          d={roundedStrip(22, -13, extraH)}
          fill="#0e0e0f"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d={roundedStrip(22, 0, extraH)}
          fill={`url(#${id}sheet)`}
          stroke={isBlue ? "#82a4ff" : "rgba(255,255,255,0.55)"}
          strokeWidth="1.2"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />
      </g>

      {/* Plate details: baseline, pixel patch and SHIPPED label */}
      <g>
        <path
          d={`M ${pt(P(60, 20))} L ${pt(P(60, 200))}`}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.4"
        />
        <path
          d={`M ${pt(P(30, 118))} L ${pt(P(30, 170))}`}
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="1.4"
        />
        {/* Pixel patch: silver/gray at rest, blows into bright blue on hover */}
        <g>
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
                  points={poly([
                    P(u, v),
                    P(u + 6, v),
                    P(u + 6, v + 6),
                    P(u, v + 6),
                  ])}
                  fill={
                    isBlue
                      ? "rgba(130,164,255,0.85)"
                      : "rgba(190,190,195,0.4)"
                  }
                  className="transition-colors duration-300"
                />
              );
            })
          )}
        </g>
        {/* SHIPPED label: gray at rest, blows into electric blue on hover */}
        <text
          transform={`translate(${pt(P(12, 112))}) rotate(30) skewX(0)`}
          fill={isBlue ? "#4f7cff" : "rgba(255,255,255,0.5)"}
          fontSize="11"
          fontWeight="600"
          letterSpacing="2"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          className="transition-colors duration-300"
        >
          SHIPPED
        </text>
      </g>

      {/* Bars W1, W2, W3: Sleek gray at rest, blow into rich blue with spring bounces on hover */}
      {BARS.map((b, i) => {
        let mult = 1.0;
        if (isBlue) {
          const start = 0.06 + i * 0.14;
          const dur = 0.38;
          if (p >= start && p <= start + dur) {
            const norm = (p - start) / dur;
            mult = 1.0 + Math.sin(norm * Math.PI) * (0.24 + i * 0.06);
          }
        }
        const h = b.h * mult;
        const g = bar(b.u0, b.v0, 40, 40, h);
        const [lx, ly] = P(b.u0, b.v0 + 8);
        const isBActive = mult > 1.05;

        // Color transitions: gray at rest -> vibrant blue on hover
        const barStroke = isBlue
          ? isBActive
            ? "#82a4ff"
            : "#4f7cff"
          : "rgba(255,255,255,0.35)";
        const barTopFill = isBlue
          ? isBActive
            ? "#31447a"
            : "#26345f"
          : "#222327";
        const barLeftFill = isBlue ? "#121213" : "#111113";
        const barRightFill = isBlue ? "#1b1b1d" : "#161618";

        return (
          <g key={b.label}>
            <text
              x={lx - 16}
              y={ly + 26}
              transform={`rotate(30 ${f(lx - 16)} ${f(ly + 26)})`}
              fill={isBlue ? (isBActive ? "#ffffff" : "#82a4ff") : "rgba(255,255,255,0.45)"}
              fontSize="12"
              fontStyle="italic"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              className="transition-colors duration-300"
            >
              {b.label}
            </text>
            <polygon
              points={g.left}
              fill={barLeftFill}
              stroke={barStroke}
              strokeWidth={isBActive ? 1.6 : 1.3}
              strokeLinejoin="round"
              className="transition-[stroke,stroke-width,fill] duration-300"
            />
            <polygon
              points={g.right}
              fill={barRightFill}
              stroke={barStroke}
              strokeWidth={isBActive ? 1.6 : 1.3}
              strokeLinejoin="round"
              className="transition-[stroke,stroke-width,fill] duration-300"
            />
            <polygon
              points={g.top}
              fill={barTopFill}
              stroke={barStroke}
              strokeWidth={isBActive ? 1.6 : 1.3}
              strokeLinejoin="round"
              className="transition-[fill,stroke,stroke-width] duration-300"
            />
          </g>
        );
      })}

      {/* DECIDED lines and checks: gray at rest, blows into electric blue on hover */}
      <g>
        {rows.map((r, i) => {
          const u = cu + r.du;
          const a = P(u, r.v, zAt(u, extraH));
          const b = P(u, r.v + 100, zAt(u, extraH));
          const checkSweep = isBlue ? smooth(0.35 + i * 0.1, 0.55 + i * 0.1, p) : 1;
          const isCheckActive = isBlue && p >= 0.35 + i * 0.1 && p <= 0.68 + i * 0.1;

          const checkStroke = isBlue
            ? isCheckActive
              ? "#82a4ff"
              : "#4f7cff"
            : "rgba(255,255,255,0.36)";

          return (
            <g key={i}>
              <path
                d={`M ${pt(a)} L ${pt(b)}`}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d={`M ${f(b[0] + 10)} ${f(b[1] - 4)} L ${f(b[0] + 18)} ${f(
                  b[1] + 4
                )} L ${f(b[0] + 38)} ${f(b[1] - 10)}`}
                stroke={checkStroke}
                strokeWidth={isBlue ? "2.2" : "1.6"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset={isBlue ? 60 * (1 - checkSweep) : 0}
                className="transition-[stroke,stroke-width] duration-300"
              />
            </g>
          );
        })}
        <text
          transform={`translate(${pt(
            P(250, 6, zAt(250, extraH))
          )}) rotate(-30) skewX(-30)`}
          fill={isBlue ? (p >= 0.3 && p <= 0.72 ? "#82a4ff" : "#4f7cff") : "rgba(255,255,255,0.42)"}
          fontSize="9.5"
          fontStyle="italic"
          letterSpacing="2.2"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          className="transition-colors duration-300"
        >
          DECIDED
        </text>
      </g>

      {/* SPEC document: gray at rest, blows into electric blue on hover */}
      <g>
        <polygon
          points={poly([
            P(486, 34),
            P(502, 34),
            P(502, 150),
            P(486, 150),
          ])}
          fill={
            isBlue
              ? p >= 0.55 && p <= 0.95
                ? "rgba(79,124,255,0.45)"
                : "rgba(79,124,255,0.25)"
              : "rgba(255,255,255,0.2)"
          }
          className="transition-colors duration-300"
        />
        {[518, 532, 546, 560, 574].map((u, i) => {
          const targetLen = i % 2 ? 66 : 94;
          const isLineActive = isBlue && p >= 0.6 + i * 0.05 && p <= 0.85 + i * 0.05;
          return (
            <path
              key={u}
              d={`M ${pt(P(u, 34))} L ${pt(P(u, 34 + targetLen))}`}
              stroke={
                isBlue
                  ? isLineActive
                    ? "#82a4ff"
                    : "rgba(79,124,255,0.5)"
                  : "rgba(255,255,255,0.26)"
              }
              strokeWidth={isLineActive ? "1.8" : "1.3"}
              strokeLinecap="round"
              className="transition-[stroke,stroke-width] duration-300"
            />
          );
        })}
        <text
          transform={`translate(${pt(P(520, 170))}) rotate(30)`}
          fill={isBlue ? (p >= 0.6 && p <= 0.95 ? "#82a4ff" : "#4f7cff") : "rgba(255,255,255,0.45)"}
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
