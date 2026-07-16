import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import SplitType from "split-type";
import { Tilt } from "./Tilt";
import { Tape } from "./Tape";
import { Squiggle } from "./Squiggle";
import { Sticky } from "./Sticky";
import { PROJECTS } from "../data/projects";

gsap.registerPlugin(ScrollTrigger, Flip);

/**
 * NOTE ON CUSTOM COMPONENTS (Tilt, Tape, Squiggle, Sticky):
 * Treated as thin presentational wrappers whose root DOM node receives any
 * extra props (the same way className/style already pass through). Every
 * element GSAP touches gets a `data-anim="..."` hook and is queried scoped
 * to the section root, so nothing breaks if a component doesn't forward a
 * ref. Tilt's 3D effect is driven by mousemove internally, which simply
 * never fires on touch-only devices, so no extra wiring is needed there.
 *
 * This file only adds animation hooks and responsive utility classes.
 * Layout, colors, typography, project order, and every component are left
 * exactly as designed; the two duplicate-`className` typos on the p1/p2
 * titles (a JSX bug where the second className silently won) were merged
 * into one class list so the intended styling actually applies.
 */

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [p1, p2, p3, p4, p5] = PROJECTS;

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isHoverCapable = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;

      // ------------------------------------------------------------------
      // Helper: pseudo-DrawSVG stroke reveal without the paid plugin.
      // Works on <rect>/<path>/<line>/<polyline> — all SVGGeometryElements
      // support getTotalLength(), so a plain border rect draws itself the
      // same way a hand-drawn path would.
      // ------------------------------------------------------------------
      const drawStroke = (
        selector: string,
        tl: gsap.core.Timeline,
        position: string | number,
        opts: { duration?: number; ease?: string } = {}
      ) => {
        const shapes = q(`${selector} rect, ${selector} path, ${selector} line, ${selector} polyline`);
        if (!shapes.length) return;
        shapes.forEach((shape) => {
          const lengthEl = shape as unknown as { getTotalLength?: () => number };
          const length =
            typeof lengthEl.getTotalLength === "function" ? lengthEl.getTotalLength() : 600;
          gsap.set(shape, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(
            shape,
            {
              strokeDashoffset: 0,
              duration: opts.duration ?? 1.0,
              ease: opts.ease ?? "power2.inOut",
            },
            position
          );
        });
      };

      // Reveal a title (split into lines) or a description (split into
      // words) with the same upward-fade-stagger rhythm.
      const splitInstances: SplitType[] = [];
      const splitReveal = (
        selector: string,
        tl: gsap.core.Timeline,
        position: string | number,
        type: "lines" | "words" = "lines"
      ) => {
        const el = q(selector)[0] as HTMLElement | undefined;
        if (!el) return;
        const split = new SplitType(el, { types: type });
        splitInstances.push(split);
        const targets = type === "lines" ? split.lines : split.words;
        if (!targets || !targets.length) return;
        gsap.set(targets, { opacity: 0, y: 18 });
        tl.to(
          targets,
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.045 },
          position
        );
      };

      // Simple fade/opacity fallback for reduced-motion users.
      if (prefersReducedMotion) {
        gsap.set(q('[data-anim]'), { clearProps: "all", opacity: 1 });
        return;
      }

      // ====================================================================
      // SECTION ENTRANCE — chapter 04, stamped title, squiggle
      // ====================================================================
      const intro = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
        defaults: { ease: "power3.out" },
      });

      intro.fromTo(q('[data-anim="paper"]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);

      const chapterEl = q('[data-anim="chapter"]')[0] as HTMLElement | undefined;
      if (chapterEl) {
        const chapterSplit = new SplitType(chapterEl, { types: "chars" });
        splitInstances.push(chapterSplit);
        gsap.set(chapterSplit.chars, { opacity: 0, y: 6 });
        intro.to(
          chapterSplit.chars,
          { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)", stagger: 0.025 },
          0.1
        );
      }

      intro
        .fromTo(
          q('[data-anim="heading"]'),
          { opacity: 0, scale: 1.25, filter: "blur(12px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power4.out" },
          0.35
        )
        .to(
          q('[data-anim="heading"]'),
          {
            keyframes: [
              { x: -2, rotate: -0.3, duration: 0.04 },
              { x: 2, rotate: 0.3, duration: 0.04 },
              { x: 0, rotate: 0, duration: 0.06 },
            ],
            ease: "none",
          },
          ">-0.05"
        );

      drawStroke('[data-anim="squiggle"]', intro, "-=0.2", { duration: 0.6 });

      // ====================================================================
      // PROJECT 01 — folder opening: border draw, mask slide, image fade,
      // number, tech, title, description, tags — one timeline.
      // ====================================================================
      const p1Tl = gsap.timeline({
        scrollTrigger: { trigger: q('[data-anim="p1-card"]')[0], start: "top 82%", once: true },
        defaults: { ease: "power3.out" },
      });
      p1Tl
        .fromTo(q('[data-anim="p1-card"]'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
      drawStroke('[data-anim="p1-border"]', p1Tl, 0.05, { duration: 0.9 });
      p1Tl
        .to(
          q('[data-anim="p1-mask"]'),
          { scaleX: 0, duration: 0.7, ease: "power3.inOut", transformOrigin: "left center" },
          "-=0.3"
        )
        .fromTo(
          q('[data-anim="p1-bgimg"]'),
          { opacity: 0 },
          { opacity: 0.22, duration: 0.8, ease: "power1.out" },
          "-=0.5"
        )
        .fromTo(
          q('[data-anim="p1-number"]'),
          { opacity: 0, y: 26 },
          { opacity: 0.14, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          q('[data-anim="p1-tech"]'),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.3"
        );
      splitReveal('[data-anim="p1-title"]', p1Tl, "-=0.2", "lines");
      splitReveal('[data-anim="p1-desc"]', p1Tl, "-=0.25", "words");
      p1Tl.fromTo(
        q('[data-anim="p1-tag"]'),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
        "-=0.2"
      );

      // ====================================================================
      // PROJECT 02 — peeling back a page: tape stretch, paper unfold, mask
      // wipe, slow image zoom-out, title, giant number.
      // ====================================================================
      const p2Tl = gsap.timeline({
        scrollTrigger: { trigger: q('[data-anim="p2-card"]')[0], start: "top 82%", once: true },
        defaults: { ease: "power3.out" },
      });
      p2Tl
        .fromTo(q('[data-anim="p2-card"]'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
        .fromTo(
          q('[data-anim="p2-tape"]'),
          { scaleX: 0.6, scaleY: 1.4, opacity: 0 },
          { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.45, ease: "elastic.out(1,0.55)" },
          0.1
        )
        .fromTo(
          q('[data-anim="p2-paper"]'),
          { rotateY: -12, x: -24, opacity: 0 },
          { rotateY: 0, x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        );
      drawStroke('[data-anim="p2-border"]', p2Tl, "-=0.4", { duration: 0.9 });
      p2Tl
        .to(
          q('[data-anim="p2-mask"]'),
          { scaleX: 0, duration: 0.7, ease: "power3.inOut", transformOrigin: "right center" },
          "-=0.4"
        )
        .fromTo(
          q('[data-anim="p2-image"]'),
          { scale: 1.1 },
          { scale: 1, duration: 1.1, ease: "power2.out" },
          "-=0.6"
        );
      splitReveal('[data-anim="p2-title"]', p2Tl, "-=0.7", "lines");
      p2Tl.fromTo(
        q('[data-anim="p2-number"]'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.5"
      );

      // ====================================================================
      // PROJECTS 03 & 04 — slide up, border draws, number, title,
      // description; a sticky note falls naturally onto 04.
      // ====================================================================
      [
        { card: "p3-card", border: "p3-border", number: "p3-number", title: "p3-title", desc: "p3-desc" },
        { card: "p4-card", border: "p4-border", number: "p4-number", title: "p4-title", desc: "p4-desc" },
      ].forEach(({ card, border, number, title, desc }) => {
        const cardEl = q(`[data-anim="${card}"]`)[0];
        if (!cardEl) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: cardEl, start: "top 85%", once: true },
          defaults: { ease: "power3.out" },
        });
        tl.fromTo(cardEl, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
        drawStroke(`[data-anim="${border}"]`, tl, "-=0.3", { duration: 0.8 });
        tl.fromTo(
          q(`[data-anim="${number}"]`),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        );
        splitReveal(`[data-anim="${title}"]`, tl, "-=0.3", "lines");
        splitReveal(`[data-anim="${desc}"]`, tl, "-=0.3", "words");

        if (card === "p4-card") {
          tl.fromTo(
            q('[data-anim="p4-sticky"]'),
            { opacity: 0, y: -110, rotate: -18, scale: 0.9 },
            { opacity: 1, y: 0, rotate: -4, scale: 1, duration: 0.6, ease: "back.out(1.6)" },
            "-=0.2"
          ).fromTo(
            q('[data-anim="p4-sticky"]'),
            { boxShadow: "0 0 0 rgba(0,0,0,0)" },
            { boxShadow: "5px 8px 16px rgba(0,0,0,0.2)", duration: 0.3 },
            "<"
          );
        }
      });

      // ====================================================================
      // PROJECT 05 — the calm final chapter: number, then title, then copy.
      // ====================================================================
      const p5Tl = gsap.timeline({
        scrollTrigger: { trigger: q('[data-anim="p5-card"]')[0], start: "top 85%", once: true },
        defaults: { ease: "power2.out" },
      });
      p5Tl
        .fromTo(q('[data-anim="p5-card"]'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0)
        .fromTo(
          q('[data-anim="p5-number"]'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        );
      drawStroke('[data-anim="p5-border"]', p5Tl, "-=0.5", { duration: 1.0 });
      splitReveal('[data-anim="p5-title"]', p5Tl, "-=0.35", "lines");
      splitReveal('[data-anim="p5-desc"]', p5Tl, "-=0.3", "words");

      // ====================================================================
      // SCROLL STORYTELLING — gentle differential parallax per card while
      // it's in view. Images drift slower, numbers drift slightly faster.
      // ====================================================================
      ["p1-card", "p2-card", "p3-card", "p4-card", "p5-card"].forEach((card) => {
        const cardEl = q(`[data-anim="${card}"]`)[0];
        if (!cardEl) return;
        const prefix = card.split("-")[0];
        const image = q(`[data-anim="${prefix}-image"], [data-anim="${prefix}-bgimg"]`);
        const number = q(`[data-anim="${prefix}-number"]`);
        if (image.length) {
          gsap.to(image, {
            y: -12,
            ease: "none",
            scrollTrigger: { trigger: cardEl, start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
        }
        if (number.length) {
          gsap.to(number, {
            y: 18,
            ease: "none",
            scrollTrigger: { trigger: cardEl, start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
        }
      });

      // Ambient float for the sticky note on Project 04 (independent of
      // hover), paused while off screen.
      const stickyFloat = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
      stickyFloat.to(q('[data-anim="p4-sticky"]'), {
        y: -3,
        rotate: -6,
        duration: 3.4,
        ease: "sine.inOut",
      });
      const stickyST = ScrollTrigger.create({
        trigger: q('[data-anim="p4-card"]')[0],
        start: "top bottom",
        end: "bottom top",
        onEnter: () => stickyFloat.play(),
        onLeave: () => stickyFloat.pause(),
        onEnterBack: () => stickyFloat.play(),
        onLeaveBack: () => stickyFloat.pause(),
      });

      // ====================================================================
      // EXIT ANIMATION — cards drift up and fade slightly as the section
      // is scrolled past, like turning to the next page.
      // ====================================================================
      gsap.to(q('[data-anim$="-card"]'), {
        y: -30,
        opacity: 0.88,
        ease: "power1.in",
        stagger: 0.03,
        scrollTrigger: {
          trigger: root,
          start: "bottom 70%",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // ====================================================================
      // HOVER INTERACTIONS (desktop / fine-pointer only) — lift, tilt-ish
      // rotation, deeper shadow, image zoom, border glow, tape wobble,
      // number nudge. On touch devices, the same visual response fires
      // briefly on tap instead.
      // ====================================================================
      const cardConfigs = [
        { card: "p1-card", image: "p1-bgimg", border: "p1-border", number: "p1-number" },
        { card: "p2-card", image: "p2-image", border: "p2-border", number: "p2-number", tape: "p2-tape" },
        { card: "p3-card", border: "p3-border", number: "p3-number" },
        { card: "p4-card", border: "p4-border", number: "p4-number" },
        { card: "p5-card", border: "p5-border", number: "p5-number" },
      ];

      const hoverCleanups: Array<() => void> = [];

      cardConfigs.forEach(({ card, image, border, number, tape }) => {
        const cardEl = q(`[data-anim="${card}"]`)[0] as HTMLElement | undefined;
        if (!cardEl) return;

        const imageEl = image ? q(`[data-anim="${image}"]`) : [];
        const numberEl = number ? q(`[data-anim="${number}"]`) : [];
        const glowEl = border ? q(`[data-anim="${border}-glow"]`) : [];
        const tapeEl = tape ? q(`[data-anim="${tape}"]`) : [];

        const play = () => {
          gsap.to(cardEl, { y: -6, scale: 1.008, duration: 0.4, ease: "power2.out" });
          if (imageEl.length) gsap.to(imageEl, { scale: 1.06, duration: 0.9, ease: "power2.out" });
          if (numberEl.length) gsap.to(numberEl, { y: -4, duration: 0.4, ease: "power2.out" });
          if (glowEl.length) gsap.to(glowEl, { opacity: 1, duration: 0.4, ease: "power1.out" });
          if (tapeEl.length) {
            gsap.to(tapeEl, {
              keyframes: [{ rotate: 2, duration: 0.1 }, { rotate: -2, duration: 0.1 }, { rotate: 0, duration: 0.1 }],
              ease: "power1.inOut",
            });
          }
        };
        const reset = () => {
          gsap.to(cardEl, { y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
          if (imageEl.length) gsap.to(imageEl, { scale: 1, duration: 0.9, ease: "power2.out" });
          if (numberEl.length) gsap.to(numberEl, { y: 0, duration: 0.5, ease: "power2.out" });
          if (glowEl.length) gsap.to(glowEl, { opacity: 0, duration: 0.5, ease: "power1.out" });
        };

        if (isHoverCapable) {
          cardEl.addEventListener("mouseenter", play);
          cardEl.addEventListener("mouseleave", reset);
          hoverCleanups.push(() => {
            cardEl.removeEventListener("mouseenter", play);
            cardEl.removeEventListener("mouseleave", reset);
          });
        } else {
          // Tap-friendly equivalent: play briefly, then settle back.
          const onTap = () => {
            play();
            window.setTimeout(reset, 600);
          };
          cardEl.addEventListener("touchstart", onTap, { passive: true });
          hoverCleanups.push(() => cardEl.removeEventListener("touchstart", onTap));
        }
      });

      // ====================================================================
      // RESPONSIVE LAYOUT TRANSITION (Flip) — when project 03/04 cross the
      // stacked <-> side-by-side breakpoint, animate the reflow smoothly
      // instead of letting it snap. A ResizeObserver is used instead of a
      // matchMedia listener because by the time a matchMedia "change" event
      // fires, the browser has usually already applied the new CSS layout —
      // too late to capture a meaningful "before" state. With
      // ResizeObserver, `lastFlipState` is always the state recorded before
      // the observed resize, so Flip has a real before/after to animate.
      // ====================================================================
      const flipTargets = q('[data-anim="p3-card"], [data-anim="p4-card"]');
      let resizeObserver: ResizeObserver | undefined;
      if (flipTargets.length && typeof ResizeObserver !== "undefined") {
        let lastFlipState = Flip.getState(flipTargets);
        let flipPending = false;
        resizeObserver = new ResizeObserver(() => {
          if (flipPending) return;
          flipPending = true;
          requestAnimationFrame(() => {
            Flip.from(lastFlipState, {
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => {
                lastFlipState = Flip.getState(flipTargets);
                flipPending = false;
              },
            });
          });
        });
        flipTargets.forEach((el: Element) => resizeObserver!.observe(el));
      }

      return () => {
        stickyST.kill();
        hoverCleanups.forEach((fn) => fn());
        splitInstances.forEach((s) => s.revert());
        resizeObserver?.disconnect();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ background: "#FFFDF7" }}
    >
      <div
        data-anim="paper"
        className="relative z-10 px-4 sm:px-8 lg:px-14 pt-14 sm:pt-20 lg:pt-28 pb-8 sm:pb-10 lg:pb-14"
      >
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div
            data-anim="chapter"
            className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3"
            style={{ color: "#1A6BFF" }}
          >
            — chapter 04
          </div>
          <h2
            data-anim="heading"
            className="font-['Anton'] text-[#0D0D0D] leading-none text-5xl sm:text-6xl lg:text-[82px]"
          >
            FEATURED
            <br />
            PROJECTS
          </h2>
          <div style={{ maxWidth: "100%", overflow: "hidden" }}>
            <div data-anim="squiggle">
              <Squiggle color="#1A6BFF" w={225} className="mt-4" autoAnimate={false} />
            </div>
          </div>
        </div>

        {/* 01 — Blue / Dark split */}
        <div
          data-anim="p1-card"
          className="flex flex-col lg:flex-row mb-6 sm:mb-8 lg:mb-12 relative overflow-hidden min-h-[300px] sm:min-h-[420px] lg:min-h-0"
          data-cursor="view"
        >
          <Tilt
            className="relative overflow-hidden flex w-full lg:w-[45%]"
            style={{ background: "#1A6BFF" }}
          >
            <img
              data-anim="p1-bgimg"
              src={p1.imageUrl}
              alt={p1.imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ mixBlendMode: "overlay", opacity: 0.22 }}
            />
            {/* Mask Reveal */}
            <div
              data-anim="p1-mask"
              className="absolute inset-0 bg-[#FFFDF7] z-10"
              style={{ transformOrigin: "left center" }}
            />
            <div className="relative z-20 flex flex-col justify-end p-5 sm:p-8 lg:p-12 w-full h-full">
              <div
                data-anim="p1-number"
                className="font-['Anton'] text-white leading-none"
                style={{ fontSize: "clamp(70px,18vw,140px)", opacity: 0.14 }}
              >
                {p1.index}
              </div>
            </div>
          </Tilt>

          <div
            className="flex flex-col justify-center p-5 sm:p-8 lg:p-12 w-full lg:w-[55%]"
            style={{ background: "#0D0D0D" }}
          >
            <div
              data-anim="p1-tech"
              className="font-['Caveat'] text-sm uppercase tracking-widest mb-4"
              style={{ color: "#1A6BFF" }}
            >
              {p1.tech}
            </div>
            <h3
              data-anim="p1-title"
              className="font-['Anton'] leading-none text-3xl lg:text-[42px] text-white"
            >
              {p1.title}
            </h3>
            <p
              data-anim="p1-desc"
              className="font-['DM_Sans'] mt-5 text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.52)" }}
            >
              {p1.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {p1.tags?.map((t) => (
                <span
                  key={t}
                  data-anim="p1-tag"
                  className="font-['Caveat'] text-xs px-3 py-1"
                  style={{ color: "#1A6BFF", border: "1px solid rgba(26,107,255,0.28)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Animated border */}
          <svg
            data-anim="p1-border"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="p1-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            <rect
              data-anim="p1-border-glow"
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              stroke="#1A6BFF"
              strokeWidth="6"
              opacity="0"
              filter="url(#p1-glow-blur)"
            />
            <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" stroke="#1A6BFF" strokeWidth="3" />
          </svg>
        </div>

        {/* 02 — Yellow paper + image */}
        <div
          data-anim="p2-card"
          className="flex flex-col lg:flex-row mb-6 sm:mb-8 lg:mb-12 relative overflow-hidden min-h-[280px] sm:min-h-[380px] lg:min-h-0"
          data-cursor="view"
        >
          <div
            data-anim="p2-paper"
            className="flex flex-col justify-center p-5 sm:p-8 lg:p-12 relative overflow-hidden w-full lg:basis-[55%]"
            style={{ background: "#FFF176" }}
          >
            <div data-anim="p2-tape">
              <Tape style={{ width: "100px", height: "26px", top: "16px", right: "-8px", transform: "rotate(-6deg)" }} />
            </div>
            <div
              data-anim="p2-tech"
              className="font-['Caveat'] text-sm uppercase tracking-widest mb-4"
              style={{ color: "rgba(13,13,13,0.42)" }}
            >
              {p2.tech}
            </div>
            <h3
              data-anim="p2-title"
              className="font-['Anton'] leading-none text-3xl lg:text-[42px] text-[#0D0D0D]"
            >
              {p2.title}
            </h3>
            <p
              className="font-['DM_Sans'] mt-5 text-base leading-relaxed"
              style={{ color: "rgba(13,13,13,0.62)" }}
            >
              {p2.description}
            </p>
            <div
              data-anim="p2-number"
              className="font-['Anton'] absolute bottom-2 right-6 leading-none pointer-events-none"
              style={{ fontSize: "clamp(56px,14vw,98px)", color: "rgba(13,13,13,0.07)" }}
            >
              {p2.index}
            </div>
          </div>

          <Tilt
            className="relative overflow-hidden w-full lg:basis-[45%]"
            style={{ background: "#F5F0E8" }}
          >
            <img
              data-anim="p2-image"
              src={p2.imageUrl}
              alt={p2.imageAlt}
              className="w-full h-full object-cover"
              style={{ filter: "sepia(10%) contrast(1.08)" }}
            />
            {/* Mask Reveal */}
            <div
              data-anim="p2-mask"
              className="absolute inset-0 bg-[#FFFDF7] z-10"
              style={{ transformOrigin: "right center" }}
            />
          </Tilt>

          {/* Animated border */}
          <svg
            data-anim="p2-border"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="p2-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            <rect
              data-anim="p2-border-glow"
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              stroke="#FFF176"
              strokeWidth="6"
              opacity="0"
              filter="url(#p2-glow-blur)"
            />
            <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" stroke="#FFF176" strokeWidth="3" />
          </svg>
        </div>

        {/* 03 + 04 — side by side, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12">
          {/* Card 03 */}
          <div
            data-anim="p3-card"
            className="p-5 sm:p-8 lg:p-10 relative overflow-hidden min-h-[200px] sm:min-h-[290px]"
            style={{ background: "rgba(26,107,255,0.07)", border: "1px solid rgba(26,107,255,0.18)" }}
            data-cursor="view"
          >
            <div
              data-anim="p3-number"
              className="font-['Anton'] absolute top-2 right-4 leading-none pointer-events-none"
              style={{ fontSize: "clamp(48px,10vw,86px)", color: "rgba(26,107,255,0.12)" }}
            >
              {p3.index}
            </div>
            <div
              className="font-['Caveat'] text-sm uppercase tracking-widest mb-3"
              style={{ color: "#1A6BFF" }}
            >
              {p3.tech}
            </div>
            <h3
              data-anim="p3-title"
              className="font-['Anton'] text-[#0D0D0D] leading-none"
              style={{ fontSize: "28px" }}
            >
              {p3.title}
            </h3>
            <p
              data-anim="p3-desc"
              className="font-['DM_Sans'] mt-3 text-sm leading-relaxed"
              style={{ color: "rgba(13,13,13,0.55)" }}
            >
              {p3.description}
            </p>
            <div className="absolute bottom-6 left-6 sm:left-10 pointer-events-none">
              <span className="font-['Permanent_Marker']" style={{ fontSize: "36px", color: "rgba(13,13,13,0.1)" }}>
                upcoming ✦
              </span>
            </div>

            {/* Animated border */}
            <svg
              data-anim="p3-border"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="p3-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              <rect
                data-anim="p3-border-glow"
                x="1.5"
                y="1.5"
                width="calc(100% - 3px)"
                height="calc(100% - 3px)"
                stroke="#1A6BFF"
                strokeWidth="5"
                opacity="0"
                filter="url(#p3-glow-blur)"
              />
              <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" stroke="#1A6BFF" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Card 04 */}
          <div
            data-anim="p4-card"
            className="p-5 sm:p-8 lg:p-10 relative overflow-hidden min-h-[200px] sm:min-h-[290px]"
            style={{ background: "#0D0D0D" }}
            data-cursor="view"
          >
            <div
              data-anim="p4-number"
              className="font-['Anton'] absolute top-2 right-4 leading-none pointer-events-none"
              style={{ fontSize: "clamp(48px,10vw,86px)", color: "rgba(255,255,255,0.06)" }}
            >
              {p4.index}
            </div>
            <div
              className="font-['Caveat'] text-sm uppercase tracking-widest mb-3"
              style={{ color: "#1A6BFF" }}
            >
              {p4.tech}
            </div>
            <h3
              data-anim="p4-title"
              className="font-['Anton'] text-white leading-none"
              style={{ fontSize: "28px" }}
            >
              {p4.title}
            </h3>
            <p
              data-anim="p4-desc"
              className="font-['DM_Sans'] mt-3 text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {p4.description}
            </p>
            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20">
              <div data-anim="p4-sticky" style={{ display: "inline-block" }}>
                <Sticky color="#FFF176" rotate={-4} style={{ padding: "8px 14px" }}>
                  <span className="font-['Caveat'] text-[#0D0D0D] text-sm">client project ✦</span>
                </Sticky>
              </div>
            </div>

            {/* Animated border */}
            <svg
              data-anim="p4-border"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="p4-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              <rect
                data-anim="p4-border-glow"
                x="1.5"
                y="1.5"
                width="calc(100% - 3px)"
                height="calc(100% - 3px)"
                stroke="#1A6BFF"
                strokeWidth="5"
                opacity="0"
                filter="url(#p4-glow-blur)"
              />
              <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" stroke="#1A6BFF" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* 05 — TVARA wide */}
        <div
          data-anim="p5-card"
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row relative overflow-hidden min-h-[220px] sm:min-h-[250px]"
          data-cursor="view"
        >
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center p-5 sm:p-8 lg:p-12 gap-4 sm:gap-6 lg:gap-12 flex-1"
            style={{ background: "#F5F0E8", border: "1px solid rgba(13,13,13,0.08)" }}
          >
            <div
              data-anim="p5-number"
              className="font-['Anton'] leading-none flex-shrink-0 pointer-events-none"
              style={{ fontSize: "clamp(64px,14vw,116px)", color: "rgba(13,13,13,0.08)" }}
            >
              {p5.index}
            </div>
            <div>
              <div className="font-['Caveat'] text-sm uppercase tracking-widest mb-3" style={{ color: "#1A6BFF" }}>
                {p5.tech}
              </div>
              <h3
                data-anim="p5-title"
                className="font-['Anton'] text-[#0D0D0D] leading-none mb-4"
                style={{ fontSize: "36px" }}
              >
                {p5.title}
              </h3>
              <p
                data-anim="p5-desc"
                className="font-['DM_Sans'] text-base leading-relaxed max-w-xl"
                style={{ color: "rgba(13,13,13,0.58)" }}
              >
                {p5.description}
              </p>
            </div>
          </div>

          {/* Animated border */}
          <svg
            data-anim="p5-border"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="p5-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            <rect
              data-anim="p5-border-glow"
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              stroke="#1A6BFF"
              strokeWidth="6"
              opacity="0"
              filter="url(#p5-glow-blur)"
            />
            <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" stroke="#1A6BFF" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;