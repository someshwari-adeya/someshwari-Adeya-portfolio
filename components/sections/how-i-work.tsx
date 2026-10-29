"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  SiCss,
  SiFigma,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiTanstack,
  SiBetterauth,
  SiSanity,
  SiNodedotjs,
  SiNestjs,
  SiPython,
  SiFastapi,
  SiPrisma,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiTurborepo,
  SiDocker,
  SiVercel,
  SiCloudflare,
  SiNotion,
  SiPostman,
  SiGhostty,
  SiDbeaver,
  SiSupabase,
  SiLinear,
  SiRaycast,
  SiObsidian,
  SiGooglechrome,
} from "@icons-pack/react-simple-icons";
import {
  Claude,
  Cursor as LobeCursor,
  Gemini,
  Grok,
  LangChain,
  OpenAI,
  Aws,
} from "@lobehub/icons";
import HowIWorkIllustration from "@/components/ui/how-i-work-illustration";
import { ConveyorIllustration } from "./how-i-work/illustrations";
import {
  WORLD_DOTS,
  WORLD_MAP_WIDTH,
  WORLD_MAP_HEIGHT,
  WorldDot,
} from "./how-i-work/world-dots-data";

/* -------------------------------------------------------------------------- */
/*                                CARD CONTEXT                                */
/* -------------------------------------------------------------------------- */

interface CardContextType {
  isCardHovered: boolean;
  cardPlayKey: number;
  testProgress?: number;
}

const CardHoverContext = createContext<CardContextType>({
  isCardHovered: false,
  cardPlayKey: 0,
});

/* -------------------------------------------------------------------------- */
/*                              GLOBAL BENTO CARD                             */
/* -------------------------------------------------------------------------- */

export interface BentoCardProps {
  eyebrow: string;
  title: React.ReactNode;
  titleClassName?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  href?: string;
  isGridRowsLayout?: boolean;
  testProgress?: number;
}

export function BentoCard({
  eyebrow,
  title,
  titleClassName = "",
  footer,
  children,
  className = "",
  cardClassName = "",
  headerClassName = "",
  contentClassName = "",
  href,
  isGridRowsLayout = false,
  testProgress,
}: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || !e.pointerType) {
      setIsHovered(true);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  const handleClick = () => {
    setPlayKey((k) => k + 1);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(340px circle at ${mouseX}px ${mouseY}px, rgba(79, 124, 255, 0.12), transparent 80%)`;
  const borderGlow = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, rgba(79, 124, 255, 0.45), transparent 70%)`;

  const CardWrapper: React.ElementType = href ? "a" : "article";
  const wrapperProps = href
    ? {
        href,
        role: "link",
        tabIndex: 0,
        className:
          "block h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f7cff] rounded-[clamp(14px,1.2vw,18px)]",
      }
    : { className: "h-full" };

  return (
    <CardHoverContext.Provider
      value={{
        isCardHovered: isHovered,
        cardPlayKey: playKey,
        testProgress,
      }}
    >
      <div className={`relative h-full ${className}`}>
        <CardWrapper {...wrapperProps}>
          <div
            onMouseMove={handleMouseMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handlePointerLeave}
            onClick={handleClick}
            className={`group relative ${
              isGridRowsLayout
                ? "grid grid-rows-[auto_1fr_auto]"
                : "flex flex-col justify-between"
            } h-full rounded-[clamp(14px,1.2vw,18px)] border border-white/[0.08] bg-[#0c0c0d] p-[clamp(16px,1.5vw,22px)] overflow-hidden transition-colors duration-300 select-none ${cardClassName}`}
          >
            {/* Dynamic Spotlight Inside */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: spotlightBg }}
            />

            {/* Glowing Spotlight Border */}
            <motion.div
              className="pointer-events-none absolute -inset-[1px] rounded-[clamp(14px,1.2vw,18px)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                border: "1px solid transparent",
                background: borderGlow,
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: "1px",
              }}
            />

            {/* Header: Eyebrow + Heading */}
            <header className={`relative z-10 shrink-0 ${headerClassName}`}>
              <span className="text-[clamp(9.5px,0.72vw,11px)] font-sans uppercase tracking-[0.08em] text-white/55 block mb-1">
                {eyebrow}
              </span>
              <h3
                className={`font-medium text-white/[0.88] leading-[1.25] text-balance ${
                  titleClassName || "text-[clamp(16px,1.3vw,20px)]"
                }`}
              >
                {title}
              </h3>
            </header>

            {/* Visual Center / Full Area */}
            {isGridRowsLayout ? (
              <div className={`min-h-0 overflow-hidden relative z-0 ${contentClassName}`}>
                {children}
              </div>
            ) : (
              <div className={`relative z-0 flex-1 flex flex-col ${contentClassName || "justify-end"} min-h-0`}>
                {children}
              </div>
            )}

            {/* Footer Bottom (if present) */}
            {footer && (
              <footer className="relative z-10 pt-3 sm:pt-4 shrink-0">
                {footer}
              </footer>
            )}

            {/* Corner Arrow Button */}
            {href && (
              <motion.div
                className="absolute bottom-[clamp(16px,1.5vw,22px)] right-[clamp(16px,1.5vw,22px)] w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-none z-20 shadow-lg"
                initial={{ opacity: 0, x: -6 }}
                animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </div>
        </CardWrapper>
      </div>
    </CardHoverContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                       CARD 1: HOW I WORK (WRAPPER)                         */
/* -------------------------------------------------------------------------- */

export function HowIWorkCard() {
  const { isCardHovered, cardPlayKey, testProgress } = useContext(CardHoverContext);

  return (
    <HowIWorkIllustration
      hovered={isCardHovered}
      playKey={cardPlayKey}
      testProgress={testProgress}
      className="pointer-events-none relative mt-6 w-[120%] -ml-[10%] sm:absolute sm:mt-0 sm:ml-0 sm:left-[24%] sm:bottom-[-1%] sm:w-[58%] sm:h-auto select-none"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                     CARD 2: DAILY DRIVERS (STACK FILTER)                   */
/* -------------------------------------------------------------------------- */

type StackTab = "ALL" | "FRONTEND" | "BACKEND" | "AI" | "TOOLS";

interface ChipDef {
  name: string;
  category: "FRONTEND" | "BACKEND" | "AI" | "TOOLS";
  icon: React.ReactNode;
}

/* Custom Brand SVGs */
function ZustandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
      <circle cx="6" cy="6.5" r="3.5" fill="#443E38" />
      <circle cx="6" cy="6.5" r="1.8" fill="#F4A261" />
      <circle cx="18" cy="6.5" r="3.5" fill="#443E38" />
      <circle cx="18" cy="6.5" r="1.8" fill="#F4A261" />
      <circle cx="12" cy="13" r="8" fill="#443E38" />
      <ellipse cx="12" cy="15.5" rx="4.5" ry="3.2" fill="#F4A261" />
      <circle cx="9.2" cy="12" r="1" fill="#FFFFFF" />
      <circle cx="14.8" cy="12" r="1" fill="#FFFFFF" />
      <ellipse cx="12" cy="14.2" rx="1.5" ry="1" fill="#443E38" />
    </svg>
  );
}

function RAGIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 shrink-0"
      fill="none"
      stroke="#38BDF8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function LangGraphIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 shrink-0"
      fill="none"
      stroke="#2E5BFF"
      strokeWidth="2"
    >
      <circle cx="5" cy="6" r="3" fill="#2E5BFF" />
      <circle cx="19" cy="6" r="3" fill="#2E5BFF" />
      <circle cx="12" cy="18" r="3" fill="#38BDF8" />
      <line x1="7.5" y1="7.5" x2="10.5" y2="15.5" stroke="#4f7cff" />
      <line x1="16.5" y1="7.5" x2="13.5" y2="15.5" stroke="#4f7cff" />
    </svg>
  );
}

// 4 Rows exactly matching prompt v4
const MARQUEE_ROW_1: ChipDef[] = [
  { name: "CSS", category: "FRONTEND", icon: <SiCss color="default" size={13} /> },
  { name: "Figma", category: "FRONTEND", icon: <SiFigma color="default" size={13} /> },
  { name: "Next.js", category: "FRONTEND", icon: <SiNextdotjs color="default" size={13} /> },
  { name: "React", category: "FRONTEND", icon: <SiReact color="default" size={13} /> },
  { name: "TypeScript", category: "FRONTEND", icon: <SiTypescript color="default" size={13} /> },
  { name: "Tailwind CSS", category: "FRONTEND", icon: <SiTailwindcss color="default" size={13} /> },
  { name: "Motion", category: "FRONTEND", icon: <SiFramer color="default" size={13} /> },
  { name: "TanStack Query", category: "FRONTEND", icon: <SiTanstack color="default" size={13} /> },
  { name: "Zustand", category: "FRONTEND", icon: <ZustandIcon /> },
];

const MARQUEE_ROW_2: ChipDef[] = [
  { name: "Better Auth", category: "BACKEND", icon: <SiBetterauth color="default" size={13} /> },
  { name: "Sanity CMS", category: "BACKEND", icon: <SiSanity color="default" size={13} /> },
  { name: "Node.js", category: "BACKEND", icon: <SiNodedotjs color="default" size={13} /> },
  { name: "NestJS", category: "BACKEND", icon: <SiNestjs color="default" size={13} /> },
  { name: "TypeScript", category: "BACKEND", icon: <SiTypescript color="default" size={13} /> },
  { name: "Python", category: "BACKEND", icon: <SiPython color="default" size={13} /> },
  { name: "FastAPI", category: "BACKEND", icon: <SiFastapi color="default" size={13} /> },
  { name: "Prisma", category: "BACKEND", icon: <SiPrisma color="default" size={13} /> },
];

const MARQUEE_ROW_3: ChipDef[] = [
  { name: "LangChain", category: "AI", icon: <LangChain.Color size={13} /> },
  { name: "RAG", category: "AI", icon: <RAGIcon /> },
  { name: "pgvector", category: "AI", icon: <SiPostgresql color="default" size={13} /> },
  { name: "Claude", category: "AI", icon: <Claude.Color size={13} /> },
  { name: "ChatGPT", category: "AI", icon: <OpenAI size={13} style={{ color: "#10A37F" }} /> },
  { name: "Gemini", category: "AI", icon: <Gemini.Color size={13} /> },
  { name: "Grok", category: "AI", icon: <Grok size={13} style={{ color: "#FFFFFF" }} /> },
  { name: "LangGraph", category: "AI", icon: <LangGraphIcon /> },
];

const MARQUEE_ROW_4: ChipDef[] = [
  { name: "Git Worktrees", category: "TOOLS", icon: <SiGit color="default" size={13} /> },
  { name: "GitHub", category: "TOOLS", icon: <SiGithub color="default" size={13} /> },
  { name: "GitHub Actions", category: "TOOLS", icon: <SiGithubactions color="default" size={13} /> },
  { name: "Turborepo", category: "TOOLS", icon: <SiTurborepo color="default" size={13} /> },
  { name: "Docker", category: "TOOLS", icon: <SiDocker color="default" size={13} /> },
  { name: "Vercel", category: "TOOLS", icon: <SiVercel color="default" size={13} /> },
  { name: "Cloudflare", category: "TOOLS", icon: <SiCloudflare color="default" size={13} /> },
  { name: "AWS", category: "TOOLS", icon: <Aws.Color size={13} /> },
  { name: "Notion", category: "TOOLS", icon: <SiNotion color="default" size={13} /> },
];

const ALL_FILTERED_ITEMS: ChipDef[] = [
  ...MARQUEE_ROW_1,
  ...MARQUEE_ROW_2,
  ...MARQUEE_ROW_3,
  ...MARQUEE_ROW_4,
];

function Chip({ item }: { item: ChipDef }) {
  return (
    <div className="h-[clamp(20px,1.5vw,24px)] px-2 rounded-[6px] border border-white/12 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.08] inline-flex items-center gap-1.5 text-[clamp(10px,0.72vw,12px)] font-medium text-white/90 whitespace-nowrap shrink-0 transition-colors cursor-default select-none">
      <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
        {item.icon}
      </span>
      <span className="leading-none">{item.name}</span>
    </div>
  );
}

export function StackFilter() {
  const [activeTab, setActiveTab] = useState<StackTab>("ALL");
  const tabs: StackTab[] = ["ALL", "FRONTEND", "BACKEND", "AI", "TOOLS"];

  const filteredChips = useMemo(() => {
    if (activeTab === "ALL") return [];
    return ALL_FILTERED_ITEMS.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <div className="flex flex-col justify-between h-full min-h-0 pt-2">
      {/* Middle Marquee / Static region */}
      <div className="min-h-0 flex-1 overflow-hidden flex items-center">
        {activeTab === "ALL" ? (
          <div
            className="marquee-wrap flex flex-col gap-1.5 w-full py-1 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
            }}
          >
            {/* Row 1 (Left, 42s) */}
            <div
              className="marquee-row marquee-left flex items-center gap-2 w-max shrink-0"
              style={{
                display: "flex",
                gap: "8px",
                width: "max-content",
                willChange: "transform",
                animation: "marquee-left 42s linear infinite",
              }}
            >
              {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((item, idx) => (
                <Chip key={`r1-${idx}`} item={item} />
              ))}
            </div>

            {/* Row 2 (Right, 48s, offset -8s) */}
            <div
              className="marquee-row marquee-right flex items-center gap-2 w-max shrink-0"
              style={{
                display: "flex",
                gap: "8px",
                width: "max-content",
                willChange: "transform",
                animation: "marquee-right 48s linear infinite",
                animationDelay: "-8s",
              }}
            >
              {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((item, idx) => (
                <Chip key={`r2-${idx}`} item={item} />
              ))}
            </div>

            {/* Row 3 (Left, 44s, offset -16s) */}
            <div
              className="marquee-row marquee-left flex items-center gap-2 w-max shrink-0"
              style={{
                display: "flex",
                gap: "8px",
                width: "max-content",
                willChange: "transform",
                animation: "marquee-left 44s linear infinite",
                animationDelay: "-16s",
              }}
            >
              {[...MARQUEE_ROW_3, ...MARQUEE_ROW_3].map((item, idx) => (
                <Chip key={`r3-${idx}`} item={item} />
              ))}
            </div>

            {/* Row 4 (Right, 50s, offset -24s) - hidden on <640px to show 3 rows */}
            <div
              className="marquee-row marquee-right hidden sm:flex items-center gap-2 w-max shrink-0"
              style={{
                gap: "8px",
                width: "max-content",
                willChange: "transform",
                animation: "marquee-right 50s linear infinite",
                animationDelay: "-24s",
              }}
            >
              {[...MARQUEE_ROW_4, ...MARQUEE_ROW_4].map((item, idx) => (
                <Chip key={`r4-${idx}`} item={item} />
              ))}
            </div>
          </div>
        ) : (
          /* Static Wrapped Chips on Filter Tabs (same small size, layout animation) */
          <motion.div
            layout
            className="flex flex-wrap items-center justify-start gap-1.5 p-1 overflow-y-auto max-h-full"
          >
            <AnimatePresence mode="popLayout">
              {filteredChips.map((chip, idx) => (
                <motion.div
                  key={chip.name}
                  layout
                  initial={{ y: 6, scale: 0.95, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                  transition={{
                    layout: { type: "spring", stiffness: 380, damping: 32 },
                    opacity: { duration: 0.2, delay: idx * 0.015 },
                  }}
                >
                  <Chip item={chip} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Filter Tabs: plain text with tiny square indicator, NO pill background, always fully visible with 14px bottom padding */}
      <div
        role="tablist"
        aria-label="Filter tech stack"
        className="shrink-0 pb-[14px] pt-2 flex flex-wrap items-center gap-3 select-none"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-1.5 text-[clamp(9px,0.7vw,10.5px)] font-sans uppercase tracking-[0.12em] transition-colors cursor-pointer focus:outline-none ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/75"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-[1px] transition-all duration-200 ${
                  isActive
                    ? "bg-[#4f7cff] shadow-[0_0_8px_#4f7cff]"
                    : "border border-white/35 bg-transparent"
                }`}
                aria-hidden="true"
              />
              <span>{tab}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                     CARD 3: WHAT YOU GET (CONVEYOR)                        */
/* -------------------------------------------------------------------------- */

export function WhatYouGetCard({
  testProgress,
}: {
  testProgress?: number;
} = {}) {
  const [activeLabel, setActiveLabel] = useState("TYPED END TO END");

  return (
    <BentoCard
      eyebrow="WHAT YOU GET"
      title="System design, typed end to end, evals & guardrails, deployed & scaling"
      titleClassName="text-[clamp(13.2px,1.1vw,17.5px)] leading-[1.22]"
      headerClassName="max-w-[95%]"
      cardClassName="before:absolute before:inset-0 before:bg-[radial-gradient(60%_50%_at_70%_80%,rgba(79,124,255,0.14),transparent_70%)] before:pointer-events-none before:z-0"
      testProgress={testProgress}
      footer={<ConveyorFooter label={activeLabel} />}
    >
      <ConveyorCard onLabelChange={setActiveLabel} />
    </BentoCard>
  );
}

export function ConveyorCard({
  onLabelChange,
}: {
  onLabelChange?: (label: string) => void;
} = {}) {
  const { isCardHovered, cardPlayKey, testProgress } = useContext(CardHoverContext);

  return (
    <ConveyorIllustration
      hovered={isCardHovered}
      playKey={cardPlayKey}
      testProgress={testProgress}
      onLabelChange={onLabelChange}
      className="pointer-events-none absolute right-[-4%] bottom-[-3%] w-[96%] h-auto overflow-visible select-none"
    />
  );
}

export function ConveyorFooter({ label = "TYPED END TO END" }: { label?: string }) {
  return (
    <div className="h-5 flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-[clamp(9px,0.7vw,10.5px)] font-sans uppercase tracking-[0.12em] text-white/60 font-medium"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                   CARD 4: REMOTE, WORLDWIDE (REAL MAP)                     */
/* -------------------------------------------------------------------------- */

type Region = "LOCAL" | "US" | "UK";

export function WorldMapCard() {
  const [activeRegion, setActiveRegion] = useState<Region>("LOCAL");
  const [clocks, setClocks] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Live clock mounted client-side only to avoid hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeZone =
        activeRegion === "US"
          ? "America/New_York"
          : activeRegion === "UK"
          ? "Europe/London"
          : "Asia/Kolkata";

      const timeStr = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now);
      setClocks(timeStr);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [activeRegion]);

  // Canvas drawing from real world-atlas sampled dot matrix with ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = WORLD_MAP_WIDTH * dpr;
      canvas.height = WORLD_MAP_HEIGHT * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, WORLD_MAP_WIDTH, WORLD_MAP_HEIGHT);

      WORLD_DOTS.forEach((dot: WorldDot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.6, 0, Math.PI * 2);

        if (dot.type === "INDIA") {
          // India is highlighted blue in every state
          ctx.fillStyle =
            activeRegion === "LOCAL" ? "#4f7cff" : "rgba(79, 124, 255, 0.75)";
        } else if (activeRegion === "US" && dot.type === "USA") {
          ctx.fillStyle = "#ffb84f";
        } else if (activeRegion === "UK" && dot.type === "GBR") {
          ctx.fillStyle = "#ffb84f";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
        }
        ctx.fill();
      });
    };

    render();

    const observer = new ResizeObserver(() => render());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeRegion]);

  return (
    <div ref={containerRef} className="flex flex-col justify-between h-full min-h-0 pt-1">
      {/* World Map Canvas filling the lower 55% of the card with edge fade mask */}
      <div
        className="relative w-full h-[55%] min-h-[140px] flex items-center justify-center overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {/* Soft Regional Aura */}
        {activeRegion === "US" && (
          <div className="absolute left-[18%] top-[25%] w-24 h-14 rounded-full bg-amber-500/20 filter blur-xl pointer-events-none transition-opacity duration-300" />
        )}
        {activeRegion === "UK" && (
          <div className="absolute left-[47%] top-[15%] w-14 h-12 rounded-full bg-amber-500/20 filter blur-xl pointer-events-none transition-opacity duration-300" />
        )}
        {/* Soft Blue Glow behind India always */}
        <div className="absolute left-[68%] top-[38%] w-20 h-16 rounded-full bg-[#4f7cff]/25 filter blur-xl pointer-events-none" />

        <canvas
          ref={canvasRef}
          style={{
            width: `${WORLD_MAP_WIDTH}px`,
            height: `${WORLD_MAP_HEIGHT}px`,
          }}
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Small "NEW DELHI" Label with blue dot matching Reference */}
        <div className="absolute left-[70%] top-[40%] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#0b0e14]/90 px-1.5 py-0.5 rounded border border-[#4f7cff]/40 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f7cff] shadow-[0_0_6px_#4f7cff]" />
          <span className="text-[8.5px] font-sans font-semibold text-[#4f7cff] tracking-wider">
            NEW DELHI
          </span>
        </div>
      </div>

      {/* Tabs and footer text on one row at the bottom */}
      <div className="shrink-0 pt-2 flex items-center justify-between select-none">
        <div role="tablist" aria-label="Select timezone" className="flex items-center gap-3">
          {(["LOCAL", "US", "UK"] as Region[]).map((tab) => {
            const isActive = activeRegion === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveRegion(tab)}
                className={`inline-flex items-center gap-1 text-[clamp(9px,0.7vw,10.5px)] font-sans uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/75"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-[1px] transition-all duration-200 ${
                    isActive
                      ? "bg-[#4f7cff] shadow-[0_0_8px_#4f7cff]"
                      : "border border-white/35 bg-transparent"
                  }`}
                  aria-hidden="true"
                />
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[clamp(9px,0.7vw,10.5px)] font-sans uppercase tracking-[0.12em] text-white/60">
          {activeRegion === "LOCAL" ? "SAME TIMEZONE" : `${activeRegion} OVERLAP`} · {clocks ?? "--:--"}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                      CARD 5: WORKSTATION (MACOS DOCK)                      */
/* -------------------------------------------------------------------------- */

interface DockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  isRunning?: boolean;
  isDivider?: boolean;
}

// 1. Raycast: 3 concentric white rings with filled center dot on dark squircle
function RaycastDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-[#161618] border border-white/10 flex items-center justify-center p-1 shadow-md">
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="5.8" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="3.2" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="1.3" fill="rgba(255,255,255,0.95)" />
      </svg>
    </div>
  );
}

// 2. Ghostty: Deep blue textured terminal squircle with ghost character > _
function GhosttyDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#0f172a] border border-blue-400/30 flex items-center justify-center p-1.5 shadow-md relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      <svg viewBox="0 0 24 24" className="w-full h-full relative z-10" fill="none">
        <path
          d="M6 17V9a6 6 0 1 1 12 0v8l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5Z"
          fill="#ffffff"
        />
        <path d="M8.5 10.5l1.5 1.2-1.5 1.2" stroke="#172554" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12.5" y1="13" x2="15.5" y2="13" stroke="#172554" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 3. Herdr: Stylized ram horn and terminal prompt >-
function HerdrDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-[#24262c] border border-white/10 flex items-center justify-center p-1 shadow-md">
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <path
          d="M5 15c0-4.8 3.2-9 8.2-9 4.2 0 7.2 2.8 7.2 6 0 2.8-2.2 4.4-4.8 4.4-2.2 0-3.8-1.4-3.8-3.2 0-2 1.6-3 3.4-3 1.2 0 2 .5 2.5 1"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7.5 12.5l2 1.5-2 1.5M11 15.5h2.5"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// 4. Claude: Anthropic orange asterisk burst on dark squircle
function ClaudeDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-[#18191d] border border-white/10 flex items-center justify-center p-1 shadow-md">
      <Claude.Color size="78%" />
    </div>
  );
}

// 5. Zed: Intersecting geometric Z boxes
function ZedDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-[#111215] border border-white/10 flex items-center justify-center p-1.5 shadow-md">
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <rect x="4" y="4" width="13" height="13" rx="2" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" />
        <rect x="7" y="7" width="13" height="13" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" />
        <path d="M7 8.5h7l-7 7h7" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// 6. Superwhisper: Silver metallic sliced sphere
function SuperwhisperDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-[#141518] border border-white/10 flex items-center justify-center p-1 shadow-md">
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="12" cy="12" r="8.5" fill="url(#superwhisperGrad)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        <line x1="6.5" y1="16.5" x2="16.5" y2="6.5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="9" y1="18.5" x2="18.5" y2="9" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="4.5" y1="14" x2="14" y2="4.5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        <defs>
          <linearGradient id="superwhisperGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// 7. Obsidian: Faceted 3D purple gemstone
function ObsidianDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-[#16131f] border border-purple-500/20 flex items-center justify-center p-1 shadow-md">
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <polygon points="12,2.5 17.5,8 15,19.5 12,21.5 9,19.5 6.5,8" fill="#6d28d9" />
        <polygon points="12,2.5 15,8 12,18 9,8" fill="#8b5cf6" />
        <polygon points="12,2.5 17.5,8 15,8" fill="#a78bfa" />
        <polygon points="12,2.5 9,8 6.5,8" fill="#5b21b6" />
        <polygon points="9,8 12,18 9,19.5 6.5,8" fill="#4c1d95" />
        <polygon points="15,8 17.5,8 15,19.5 12,18" fill="#4338ca" />
      </svg>
    </div>
  );
}

// 8. Arc: White squircle with black Saturn planet with ring
function ArcDockIcon() {
  return (
    <div className="w-full h-full rounded-[9px] bg-[#f8fafc] border border-black/10 flex items-center justify-center p-1 shadow-md">
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="12" cy="12" r="5" fill="#0f172a" />
        <ellipse
          cx="12"
          cy="12"
          rx="8.5"
          ry="3"
          stroke="#0f172a"
          strokeWidth="1.4"
          transform="rotate(-24 12 12)"
        />
      </svg>
    </div>
  );
}

// Exact 8 Curated Apps + 1 Divider matching reference macOS Dock
const MAC_DOCK_ITEMS: DockItem[] = [
  { id: "raycast", name: "Raycast", icon: <RaycastDockIcon />, isRunning: true },
  { id: "ghostty", name: "Ghostty", icon: <GhosttyDockIcon />, isRunning: true },
  { id: "herdr", name: "herdr", icon: <HerdrDockIcon />, isRunning: true },
  { id: "claude", name: "Claude", icon: <ClaudeDockIcon />, isRunning: true },
  { id: "zed", name: "Zed", icon: <ZedDockIcon />, isRunning: true },
  { id: "superwhisper", name: "Superwhisper", icon: <SuperwhisperDockIcon />, isRunning: false },
  { id: "obsidian", name: "Obsidian", icon: <ObsidianDockIcon />, isRunning: false },
  { id: "divider", name: "", icon: null, isDivider: true },
  { id: "arc", name: "Arc", icon: <ArcDockIcon />, isRunning: true },
];

function MacDockTile({
  item,
  mouseX,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Measure distance from cursor to icon center
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return 9999;
    return val - bounds.x - bounds.width / 2;
  });

  // Authentic macOS Parabolic Magnification & Vertical Lift
  const scaleRaw = useTransform(distance, [-80, -40, 0, 40, 80], [1, 1.18, 1.38, 1.18, 1]);
  const yRaw = useTransform(distance, [-80, -40, 0, 40, 80], [0, -4, -12, -4, 0]);

  const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 280, damping: 22 });
  const y = useSpring(yRaw, { mass: 0.1, stiffness: 280, damping: 22 });

  if (item.isDivider) {
    return (
      <div className="h-5 sm:h-6 w-[1px] bg-white/20 mx-1 shrink-0 self-center" />
    );
  }

  return (
    <div className="flex flex-col items-center relative shrink-0">
      {/* Tooltip bubble matching reference (e.g. "herdr") */}
      <AnimatePresence>
        {isHovered && item.name && (
          <motion.div
            initial={{ opacity: 0, y: 2, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-7 px-2.5 py-0.5 rounded-[6px] bg-[#1e2025]/95 backdrop-blur-md border border-white/12 text-[11px] font-sans text-white/90 shadow-2xl pointer-events-none whitespace-nowrap z-50 flex items-center justify-center"
          >
            {item.name}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-[#1e2025] border-r border-b border-white/12" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        style={{ scale, y }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] flex items-center justify-center cursor-pointer select-none origin-bottom relative shrink-0"
      >
        {item.icon}
      </motion.div>

      {/* Active running indicator dot */}
      <div className="h-1 flex items-center justify-center mt-1">
        {item.isRunning ? (
          <div className="w-1 h-1 rounded-full bg-white/55" />
        ) : null}
      </div>
    </div>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full flex items-center justify-start pt-1 pb-4 sm:pb-6 select-none"
    >
      {/* Sleek macOS Dock Shelf matching reference */}
      <div className="inline-flex items-center h-[50px] sm:h-[54px] px-2.5 sm:px-3 gap-1.5 sm:gap-2 rounded-[18px] bg-[#16171b]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {MAC_DOCK_ITEMS.map((item) => (
          <MacDockTile
            key={item.id}
            item={item}
            mouseX={mouseX}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         MAIN HOW I WORK SECTION                            */
/* -------------------------------------------------------------------------- */

export default function HowIWorkSection({
  testProgress,
}: {
  testProgress?: number;
} = {}) {
  return (
    <section
      id="how-i-work"
      className="relative z-20 w-full min-h-screen min-h-[100dvh] py-10 sm:py-12 lg:py-16 bg-[#070709] overflow-hidden text-white border-t border-white/[0.06] flex flex-col items-center justify-center"
    >
      {/* Background: Faint diagonal pattern & fine grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 0%, rgba(79, 124, 255, 0.08) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.005) 0px, rgba(255, 255, 255, 0.005) 1px, transparent 1px, transparent 14px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px, 28px 28px",
        }}
      />

      <div className="w-full max-w-[1600px] mx-auto px-[clamp(12px,2.2vw,32px)] relative z-10">
        {/* Frame corner decorative markers */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 -left-1 flex items-center gap-1 text-white/30 text-xs font-mono select-none"
        >
          <div className="w-1.5 h-1.5 border border-white/40 bg-[#0b0b0d]" />
          <span>+</span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 -right-1 flex items-center gap-1 text-white/30 text-xs font-mono select-none"
        >
          <span>+</span>
          <div className="w-1.5 h-1.5 border border-white/40 bg-[#0b0b0d]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -left-1 flex items-center gap-1 text-white/30 text-xs font-mono select-none"
        >
          <div className="w-1.5 h-1.5 border border-white/40 bg-[#0b0b0d]" />
          <span>+</span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -right-1 flex items-center gap-1 text-white/30 text-xs font-mono select-none"
        >
          <span>+</span>
          <div className="w-1.5 h-1.5 border border-white/40 bg-[#0b0b0d]" />
        </div>

        {/* Bento Grid: 2 Viewport Rows */}
        <div className="flex flex-col gap-[clamp(8px,0.8vw,12px)]">
          {/* Row 1: lg 12 cols -> 7 / 5 */}
          <div className="grid grid-cols-12 gap-[clamp(8px,0.8vw,12px)]">
            {/* Card 1: 7 cols on lg, full width on md/sm */}
            <div className="col-span-12 lg:col-span-7 min-h-[300px] sm:min-h-[280px] lg:min-h-0 lg:h-[clamp(260px,19.6vw,340px)]">
              <BentoCard
                eyebrow="HOW I WORK"
                title="High agency, async-first, ships fast"
                headerClassName="max-w-full sm:max-w-[70%] lg:max-w-[62%]"
                href="#contact"
                testProgress={testProgress}
              >
                <HowIWorkCard />
              </BentoCard>
            </div>

            {/* Card 2: 5 cols on lg, full width on md/sm */}
            <div className="col-span-12 lg:col-span-5 min-h-[300px] sm:min-h-[280px] lg:min-h-0 lg:h-[clamp(260px,19.6vw,340px)]">
              <BentoCard
                eyebrow="DAILY DRIVERS"
                title="The stack behind everything I ship"
                isGridRowsLayout
              >
                <StackFilter />
              </BentoCard>
            </div>
          </div>

          {/* Row 2: lg 12 cols -> 4 / 4 / 4 | md -> 2 cols (6/12 + 6/12) + full width (12/12) */}
          <div className="grid grid-cols-12 gap-[clamp(8px,0.8vw,12px)]">
            {/* Card 3: What You Get */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[300px] sm:min-h-[280px] lg:min-h-0 lg:h-[clamp(260px,19.6vw,340px)]">
              <WhatYouGetCard testProgress={testProgress} />
            </div>

            {/* Card 4: Remote, Worldwide */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[300px] sm:min-h-[280px] lg:min-h-0 lg:h-[clamp(260px,19.6vw,340px)]">
              <BentoCard
                eyebrow="REMOTE, WORLDWIDE"
                title={
                  <span>
                    Based in India, overlapping with{" "}
                    <span className="inline-block whitespace-nowrap">your hours</span>
                  </span>
                }
                headerClassName="max-w-[90%]"
              >
                <WorldMapCard />
              </BentoCard>
            </div>

            {/* Card 5: Workstation */}
            <div className="col-span-12 sm:col-span-12 lg:col-span-4 min-h-[300px] sm:min-h-[280px] lg:min-h-0 lg:h-[clamp(260px,19.6vw,340px)]">
              <BentoCard
                eyebrow="WORKSTATION"
                title="Everything on my desk and dock"
                href="#contact"
                contentClassName="justify-center"
                footer={
                  <div className="text-[clamp(9px,0.7vw,10.5px)] font-sans uppercase tracking-[0.12em] text-white/60">
                    MACBOOK M5 PRO · 24GB · 1TB
                  </div>
                }
              >
                <Dock />
              </BentoCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
