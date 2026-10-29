"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure styled-jsx attribute types are recognized in TypeScript
declare module "react" {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SectionItem {
  id?: string | number;
  leftLabel: string | React.ReactNode;
  title: string | React.ReactNode;
  rightLabel: string | React.ReactNode;
  background?: string;
  gradient?: string;
  renderBackground?: (active: boolean, previous?: boolean) => React.ReactNode;
}

export interface Durations {
  change?: number; // duration in seconds, e.g. 0.8
  snap?: number; // duration in ms, e.g. 900
}

export interface Colors {
  text?: string;
  overlay?: string;
  pageBg?: string;
  stageBg?: string;
}

export interface FullScreenFXAPI {
  next: () => void;
  prev: () => void;
  goTo: (index: number, immediate?: boolean) => void;
  getIndex: () => number;
  refresh: () => void;
}

export interface FullScreenScrollFXProps {
  sections: SectionItem[];
  className?: string;
  style?: React.CSSProperties;
  fontFamily?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  gap?: number;
  gridPaddingX?: number;
  showProgress?: boolean;
  debug?: boolean;
  durations?: Durations;
  reduceMotion?: boolean;
  smoothScroll?: boolean;
  bgTransition?: "fade" | "clip";
  parallaxAmount?: number;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  colors?: Colors;
  apiRef?: React.Ref<FullScreenFXAPI | null>;
  ariaLabel?: string;
  endFooterText?: string | React.ReactNode;
}

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));


export const FullScreenScrollFX = forwardRef<HTMLDivElement, FullScreenScrollFXProps>(
  (
    {
      sections = [],
      className,
      style,
      fontFamily = 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
      header,
      footer,
      gap = 1,
      gridPaddingX = 2,
      showProgress = false,
      debug = false,
      durations = { change: 0.8, snap: 900 },
      reduceMotion,
      bgTransition = "fade",
      parallaxAmount = 10,
      currentIndex: controlledIndex,
      onIndexChange,
      initialIndex = 0,
      colors = {
        text: "rgba(245,245,245,0.94)",
        overlay: "rgba(0,0,0,0.4)",
        pageBg: "#050505",
        stageBg: "#000000",
      },
      apiRef,
      ariaLabel = "Full screen scroll portfolio slideshow",
      endFooterText = "© 2026 Someshwari Adeya. Built in Surat.",
    },
    ref
  ) => {
    const totalCount = sections.length;
    const [internalIndex, setInternalIndex] = useState(
      clamp(initialIndex, 0, Math.max(0, totalCount - 1))
    );
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const isControlled = typeof controlledIndex === "number";
    const activeIndex = isControlled
      ? clamp(controlledIndex, 0, Math.max(0, totalCount - 1))
      : internalIndex;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const fixedRef = useRef<HTMLDivElement | null>(null);
    const fixedSectionRef = useRef<HTMLDivElement | null>(null);
    const bgImagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const bgContainersRef = useRef<(HTMLDivElement | null)[]>([]);
    const titlesRef = useRef<HTMLElement[][]>([]);
    const leftTrackRef = useRef<HTMLDivElement | null>(null);
    const rightTrackRef = useRef<HTMLDivElement | null>(null);
    const leftItemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const rightItemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const progressFillRef = useRef<HTMLDivElement | null>(null);
    const progressNumberRef = useRef<HTMLSpanElement | null>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    const currentIndexRef = useRef(activeIndex);
    const isManualScrollRef = useRef(false);
    const positionsRef = useRef<number[]>([]);

    const systemReducedMotion = useMemo(
      () =>
        typeof window === "undefined"
          ? false
          : window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      []
    );
    const effectiveReduceMotion = reduceMotion ?? systemReducedMotion;

    const splitWords = (text: string, sectionIdx: number) => {
      const words = text.split(/\s+/).filter(Boolean);
      return words.map((word, wordIndex) => (
        <span key={wordIndex} className="fx-word-mask">
          <span
            className="fx-word"
            ref={(el) => {
              if (!titlesRef.current[sectionIdx]) {
                titlesRef.current[sectionIdx] = [];
              }
              if (el) {
                titlesRef.current[sectionIdx][wordIndex] = el;
              }
            }}
          >
            {word}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ));
    };

    const computePositions = () => {
      const el = fixedSectionRef.current;
      if (!el || typeof window === "undefined") return;
      const top = el.offsetTop;
      const maxScroll = Math.max(0, el.offsetHeight - window.innerHeight);
      const positions: number[] = [];
      for (let i = 0; i < totalCount; i++) {
        const fraction = totalCount > 1 ? i / (totalCount - 1) : 0;
        positions.push(top + maxScroll * fraction);
      }
      positionsRef.current = positions;
    };

    const centerTrack = (activeIdx = activeIndex, animated = true) => {
      const center = (
        trackEl: HTMLElement | null,
        itemEls: (HTMLElement | null)[],
        isRight: boolean
      ) => {
        if (!trackEl || itemEls.length === 0) return;
        const first = itemEls[0];
        const second = itemEls[1];
        if (!first) return;
        const trackRect = trackEl.getBoundingClientRect();
        let itemHeight = first.getBoundingClientRect().height;
        if (second) {
          itemHeight =
            second.getBoundingClientRect().top - first.getBoundingClientRect().top;
        }
        const targetY =
          trackRect.height / 2 - itemHeight / 2 - activeIdx * itemHeight;
        const targetRef = isRight ? rightTrackRef : leftTrackRef;
        if (targetRef.current) {
          if (animated) {
            gsap.to(targetRef.current, {
              y: targetY,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            gsap.set(targetRef.current, { y: targetY });
          }
        }
      };

      const measureRAF = (cb: () => void) => {
        if (typeof window !== "undefined") {
          requestAnimationFrame(() => requestAnimationFrame(cb));
        }
      };

      measureRAF(() => {
        center(leftTrackRef.current, leftItemsRef.current, false);
        center(rightTrackRef.current, rightItemsRef.current, true);
      });
    };

    useLayoutEffect(() => {
      if (typeof window === "undefined") return;
      const stage = fixedRef.current;
      const section = fixedSectionRef.current;
      if (!stage || !section || totalCount === 0) return;

      // Initialize backgrounds
      gsap.set(bgImagesRef.current, { opacity: 0, scale: 1.05, yPercent: 0 });
      if (bgImagesRef.current[activeIndex]) {
        gsap.set(bgImagesRef.current[activeIndex], { opacity: 1, scale: 1.0, yPercent: 0 });
      }

      // Initialize titles
      titlesRef.current.forEach((wordEls, sectionIdx) => {
        wordEls.forEach((el) => {
          gsap.set(el, {
            yPercent: sectionIdx === activeIndex ? 0 : 100,
            opacity: sectionIdx === activeIndex ? 1 : 0,
          });
        });
      });

      computePositions();
      centerTrack(activeIndex, false);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: true,
        snap:
          totalCount > 1
            ? {
                snapTo: 1 / (totalCount - 1),
                duration: { min: 0.2, max: 0.45 },
                delay: 0.08,
                ease: "power2.out",
              }
            : undefined,
        onUpdate: (self) => {
          if (effectiveReduceMotion) return;

          const progress = self.progress;

          // Continuous scroll parallax on the active background image
          const currentBg = bgImagesRef.current[currentIndexRef.current];
          if (currentBg) {
            const sectionProgress =
              progress * (totalCount - 1) - currentIndexRef.current;
            gsap.to(currentBg, {
              yPercent: sectionProgress * -12,
              duration: 0.15,
              ease: "power1.out",
              overwrite: "auto",
            });
          }

          if (isManualScrollRef.current) return;

          // Directly derive the target section from scroll progress
          let targetSection: number;
          if (progress <= 0.03) {
            targetSection = 0;
          } else if (progress >= 0.97) {
            targetSection = totalCount - 1;
          } else {
            targetSection = clamp(
              Math.round(progress * (totalCount - 1)),
              0,
              totalCount - 1
            );
          }

          if (targetSection !== currentIndexRef.current) {
            changeSection(targetSection);
          }
        },
        onLeaveBack: () => {
          if (currentIndexRef.current !== 0) {
            changeSection(0);
          }
        },
      });

      scrollTriggerRef.current = st;

      if (initialIndex && initialIndex > 0 && initialIndex < totalCount) {
        requestAnimationFrame(() => goTo(initialIndex, false));
      }

      // Safeguard for rapid reverse scroll to the absolute top of the page
      const handleWindowScroll = () => {
        if (window.scrollY <= 10 && currentIndexRef.current !== 0) {
          changeSection(0);
        }
      };
      window.addEventListener("scroll", handleWindowScroll, { passive: true });

      const resizeObserver = new ResizeObserver(() => {
        computePositions();
        centerTrack(currentIndexRef.current, false);
        ScrollTrigger.refresh();
      });

      resizeObserver.observe(section);

      return () => {
        window.removeEventListener("scroll", handleWindowScroll);
        resizeObserver.disconnect();
        st.kill();
        scrollTriggerRef.current = null;
      };
    }, [totalCount, initialIndex, effectiveReduceMotion, bgTransition, parallaxAmount]);

    const changeSection = (newIdx: number) => {
      if (newIdx === currentIndexRef.current) return;
      const prevIdx = currentIndexRef.current;
      const isNext = newIdx > prevIdx;
      currentIndexRef.current = newIdx;
      setPrevIndex(prevIdx);

      if (!isControlled) {
        setInternalIndex(newIdx);
      }
      onIndexChange?.(newIdx);

      if (progressNumberRef.current) {
        progressNumberRef.current.textContent = String(newIdx + 1).padStart(2, "0");
      }
      if (progressFillRef.current) {
        const pct = (newIdx / (totalCount - 1 || 1)) * 100;
        progressFillRef.current.style.width = `${pct}%`;
      }

      const changeDuration = Math.min(durations.change ?? 0.7, 0.55);

      // Split word titles (if present)
      titlesRef.current.forEach((wordEls, idx) => {
        if (!wordEls || !wordEls.length) return;
        gsap.killTweensOf(wordEls);
        if (idx === newIdx) {
          gsap.set(wordEls, {
            yPercent: isNext ? 80 : -80,
            opacity: 0,
          });
          gsap.to(wordEls, {
            yPercent: 0,
            opacity: 1,
            duration: changeDuration,
            stagger: isNext ? 0.03 : -0.03,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(wordEls, {
            yPercent: idx < newIdx ? -80 : 80,
            opacity: 0,
            duration: changeDuration * 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });

      // Background images: active fades in, all other backgrounds fade out
      bgImagesRef.current.forEach((bg, idx) => {
        if (!bg) return;
        gsap.killTweensOf(bg);
        if (idx === newIdx) {
          if (bgTransition === "fade") {
            gsap.to(bg, {
              opacity: 1,
              scale: 1.0,
              yPercent: 0,
              duration: changeDuration,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            gsap.set(bg, {
              opacity: 1,
              clipPath: isNext ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
              scale: 1.05,
              yPercent: 0,
            });
            gsap.to(bg, {
              clipPath: "inset(0 0 0 0)",
              scale: 1.0,
              duration: changeDuration,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        } else {
          gsap.to(bg, {
            opacity: 0,
            duration: changeDuration * 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });

      centerTrack(newIdx, true);

      leftItemsRef.current.forEach((el, idx) => {
        if (el) {
          el.classList.toggle("active", idx === newIdx);
          gsap.to(el, {
            opacity: idx === newIdx ? 1 : 0.35,
            x: idx === newIdx ? 10 : 0,
            duration: changeDuration * 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });

      rightItemsRef.current.forEach((el, idx) => {
        if (el) {
          el.classList.toggle("active", idx === newIdx);
          gsap.to(el, {
            opacity: idx === newIdx ? 1 : 0.35,
            x: idx === newIdx ? -10 : 0,
            duration: changeDuration * 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    const goTo = (index: number, smooth = true) => {
      const targetIdx = clamp(index, 0, totalCount - 1);
      if (targetIdx === currentIndexRef.current) return;

      isManualScrollRef.current = true;
      changeSection(targetIdx);

      const targetScroll = positionsRef.current[targetIdx] ?? 0;
      const snapMs = durations.snap ?? 600;

      if (smooth && typeof window !== "undefined") {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
        setTimeout(() => {
          isManualScrollRef.current = false;
        }, snapMs);
      } else {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: targetScroll });
        }
        setTimeout(() => {
          isManualScrollRef.current = false;
        }, 50);
      }
    };

    const next = () => goTo(activeIndex + 1);
    const prev = () => goTo(activeIndex - 1);

    useImperativeHandle(apiRef, () => ({
      next,
      prev,
      goTo,
      getIndex: () => activeIndex,
      refresh: () => ScrollTrigger.refresh(),
    }));

    const handleJump = (index: number) => {
      goTo(index);
    };

    // Initial entrance animation
    useEffect(() => {
      leftItemsRef.current.forEach((el, idx) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: idx === activeIndex ? 1 : 0.35,
              y: 0,
              duration: 0.5,
              delay: idx * 0.06,
              ease: "power3.out",
            }
          );
        }
      });
      rightItemsRef.current.forEach((el, idx) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: idx === activeIndex ? 1 : 0.35,
              y: 0,
              duration: 0.5,
              delay: 0.2 + idx * 0.06,
              ease: "power3.out",
            }
          );
        }
      });
      centerTrack(activeIndex, false);
    }, []);

    const cssVars: Record<string, string> = {
      "--fx-font": fontFamily,
      "--fx-text": colors.text ?? "rgba(245,245,245,0.94)",
      "--fx-overlay": colors.overlay ?? "rgba(0,0,0,0.4)",
      "--fx-page-bg": colors.pageBg ?? "#050505",
      "--fx-stage-bg": colors.stageBg ?? "#000000",
      "--fx-gap": `${gap}rem`,
      "--fx-grid-px": `${gridPaddingX}rem`,
      "--fx-row-gap": "10px",
    };

    return (
      <div
        ref={(el) => {
          rootRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className={["fx", className].filter(Boolean).join(" ")}
        style={{ ...cssVars, ...style } as React.CSSProperties}
        aria-label={ariaLabel}
      >
        {debug && (
          <div className="fx-debug">
            Section: {activeIndex + 1} / {totalCount}
          </div>
        )}

        <div className="fx-scroll">
          <div className="fx-fixed-section" ref={fixedSectionRef}>
            <div className="fx-fixed" ref={fixedRef}>
              {/* Background layer */}
              <div className="fx-bgs" aria-hidden="true">
                {sections.map((section, idx) => (
                  <div
                    ref={(el) => {
                      if (el) bgContainersRef.current[idx] = el;
                    }}
                    className={`fx-bg ${idx === activeIndex ? "active" : ""}`}
                    key={section.id ?? idx}
                  >
                    {section.renderBackground ? (
                      section.renderBackground(
                        activeIndex === idx,
                        prevIndex === idx
                      )
                    ) : (
                      <React.Fragment>
                        {/* Distinct gradient backdrop */}
                        <div
                          className="fx-bg-gradient"
                          style={{
                            background:
                              section.gradient ??
                              "radial-gradient(ellipse at 50% 45%, #252a35 0%, #101217 65%, #000000 100%)",
                          }}
                        />
                        {section.background && (
                          <img
                            ref={(el) => {
                              if (el) bgImagesRef.current[idx] = el;
                            }}
                            src={section.background}
                            alt=""
                            className="fx-bg-img"
                          />
                        )}
                        {/* Soft vignette overlay that keeps gradients visible */}
                        <div className="fx-bg-overlay" />
                      </React.Fragment>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid content */}
              <div className="fx-grid">
                {header && <div className="fx-header">{header}</div>}

                <div className="fx-content">
                  {/* Left items */}
                  <div className="fx-left" role="list">
                    <div className="fx-track" ref={leftTrackRef}>
                      {sections.map((section, idx) => (
                        <div
                          key={`L-${section.id ?? idx}`}
                          className={`fx-item fx-left-item ${
                            idx === activeIndex ? "active" : ""
                          }`}
                          ref={(el) => {
                            if (el) leftItemsRef.current[idx] = el;
                          }}
                          onClick={() => handleJump(idx)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={idx === activeIndex}
                        >
                          {section.leftLabel}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center titles */}
                  <div className="fx-center">
                    {sections.map((section, idx) => {
                      const isString = typeof section.title === "string";

                      return (
                        <div
                          key={`C-${section.id ?? idx}`}
                          className={`fx-featured ${
                            idx === activeIndex ? "active" : ""
                          }`}
                        >
                          <div className="fx-featured-title">
                            {isString ? splitWords(section.title as string, idx) : section.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right items */}
                  <div className="fx-right" role="list">
                    <div className="fx-track" ref={rightTrackRef}>
                      {sections.map((section, idx) => (
                        <div
                          key={`R-${section.id ?? idx}`}
                          className={`fx-item fx-right-item ${
                            idx === activeIndex ? "active" : ""
                          }`}
                          ref={(el) => {
                            if (el) rightItemsRef.current[idx] = el;
                          }}
                          onClick={() => handleJump(idx)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={idx === activeIndex}
                        >
                          {section.rightLabel}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer and progress bar (only rendered when requested) */}
                {(footer || showProgress) && (
                  <div className="fx-footer">
                    {footer && <div className="fx-footer-title">{footer}</div>}
                    {showProgress && (
                      <div className="fx-progress">
                        <div className="fx-progress-numbers">
                          <span ref={progressNumberRef}>
                            {String(activeIndex + 1).padStart(2, "0")}
                          </span>
                          <span>{String(totalCount).padStart(2, "0")}</span>
                        </div>
                        <div className="fx-progress-bar">
                          <div className="fx-progress-fill" ref={progressFillRef} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .fx {
            width: 100%;
            overflow: hidden;
            background: var(--fx-page-bg);
            color: #000;
            font-family: var(--fx-font);
            text-transform: uppercase;
            letter-spacing: -0.02em;
          }

          .fx-debug {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.85);
            color: #000;
            padding: 6px 10px;
            font: 12px/1 monospace;
            border-radius: 4px;
          }

          .fx-fixed-section {
            height: ${Math.max(1, totalCount)}00vh;
            position: relative;
          }

          .fx-fixed {
            position: sticky;
            top: 0;
            height: 100vh;
            width: 100%;
            overflow: hidden;
            background: var(--fx-page-bg);
          }

          .fx-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: var(--fx-gap);
            padding: 0 var(--fx-grid-px);
            position: relative;
            height: 100%;
            z-index: 2;
          }

          .fx-bgs {
            position: absolute;
            inset: 0;
            background: var(--fx-stage-bg);
            z-index: 1;
          }

          .fx-bg {
            position: absolute;
            inset: 0;
            opacity: 0;
            transition: opacity 0.8s ease;
            pointer-events: none;
          }

          .fx-bg.active {
            opacity: 1;
          }

          .fx-bg-gradient {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            opacity: 0.95;
            pointer-events: none;
          }

          .fx-bg-img {
            position: absolute;
            inset: -15% 0 -15% 0;
            width: 100%;
            height: 130%;
            object-fit: cover;
            filter: brightness(0.92) contrast(1.18) saturate(1.05);
            opacity: 0;
            will-change: transform, opacity;
            pointer-events: none;
          }

          .fx-bg-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 75%, rgba(0, 0, 0, 0.75) 100%),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, transparent 40%, rgba(0, 0, 0, 0.5) 100%);
            pointer-events: none;
          }

          .fx-header {
            grid-column: 1 / 13;
            align-self: start;
            padding-top: 5vh;
            font-size: clamp(1.2rem, 3.5vw, 2.5rem);
            line-height: 1.1;
            text-align: center;
            color: var(--fx-text);
            font-weight: 700;
            letter-spacing: 0.05em;
          }

          .fx-header > * {
            display: block;
          }

          .fx-content {
            grid-column: 1 / 13;
            position: absolute;
            inset: 0;
            display: grid;
            grid-template-columns: 1fr 1.6fr 1fr;
            align-items: center;
            height: 100%;
            padding: 0 var(--fx-grid-px);
            pointer-events: none;
          }

          .fx-left,
          .fx-right {
            height: 60vh;
            overflow: hidden;
            display: grid;
            align-content: center;
            pointer-events: auto;
          }

          .fx-left {
            justify-items: start;
          }

          .fx-right {
            justify-items: end;
          }

          .fx-track {
            will-change: transform;
          }

          .fx-item {
            color: var(--fx-text);
            font-weight: 700;
            letter-spacing: 0.02em;
            line-height: 1.2;
            margin: calc(var(--fx-row-gap) / 2) 0;
            opacity: 0.35;
            transition: opacity 0.3s ease, transform 0.3s ease;
            position: relative;
            font-size: clamp(0.9rem, 2vw, 1.4rem);
            user-select: none;
            cursor: pointer;
          }

          .fx-left-item.active,
          .fx-right-item.active {
            opacity: 1;
          }

          .fx-left-item.active {
            transform: translateX(10px);
            padding-left: 16px;
          }

          .fx-right-item.active {
            transform: translateX(-10px);
            padding-right: 16px;
          }

          .fx-left-item.active::before,
          .fx-right-item.active::after {
            content: "";
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            background: var(--fx-text);
            border-radius: 50%;
          }

          .fx-left-item.active::before {
            left: 0;
          }

          .fx-right-item.active::after {
            right: 0;
          }

          .fx-center {
            display: grid;
            place-items: center;
            text-align: center;
            height: 65vh;
            overflow: visible;
            position: relative;
            pointer-events: auto;
          }

          .fx-featured {
            position: absolute;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.6s ease, visibility 0.6s ease, transform 0.6s ease;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .fx-featured.active {
            opacity: 1;
            visibility: visible;
          }

          .fx-featured-title {
            margin: 0;
            color: var(--fx-text);
            font-weight: 800;
            letter-spacing: -0.02em;
            font-size: clamp(2rem, 6.5vw, 5.2rem);
            line-height: 1.05;
            width: 100%;
          }

          .fx-word-mask {
            display: inline-block;
            overflow: hidden;
            vertical-align: middle;
          }

          .fx-word {
            display: inline-block;
            vertical-align: middle;
          }

          .fx-footer {
            grid-column: 1 / 13;
            align-self: end;
            padding-bottom: 5vh;
            text-align: center;
            pointer-events: auto;
          }

          .fx-footer-title {
            color: var(--fx-text);
            font-size: clamp(1rem, 2.2vw, 1.6rem);
            font-weight: 500;
            letter-spacing: 0.08em;
            line-height: 1.2;
            opacity: 0.85;
          }

          .fx-progress {
            width: 220px;
            height: 2px;
            margin: 1.2rem auto 0;
            background: rgba(245, 245, 245, 0.2);
            position: relative;
          }

          .fx-progress-bar {
            width: 100%;
            height: 100%;
            position: relative;
          }

          .fx-progress-fill {
            position: absolute;
            inset: 0 auto 0 0;
            width: 0%;
            background: var(--fx-text);
            height: 100%;
            transition: width 0.3s ease;
          }

          .fx-progress-numbers {
            position: absolute;
            inset: auto 0 100% 0;
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            color: var(--fx-text);
            padding-bottom: 6px;
            opacity: 0.75;
          }

          @media (max-width: 900px) {
            .fx-content {
              grid-template-columns: 1fr;
              row-gap: 2vh;
              place-items: center;
              padding: 0 1rem;
            }
            .fx-left,
            .fx-right,
            .fx-center {
              height: auto;
            }
            .fx-left,
            .fx-right {
              justify-items: center;
              display: none;
            }
            .fx-track {
              transform: none !important;
            }
            .fx-center {
              min-height: 50vh;
            }
            .fx-header {
              padding-top: 3vh;
              font-size: 1.25rem;
            }
            .fx-featured-title {
              font-size: clamp(1.8rem, 8vw, 3rem);
            }
          }
        `}</style>
      </div>
    );
  }
);

FullScreenScrollFX.displayName = "FullScreenScrollFX";
