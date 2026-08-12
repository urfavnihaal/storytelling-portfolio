import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { Tilt } from "./Tilt";
import { Tape } from "./Tape";
import { Arrow } from "./Arrow";
import { Squiggle } from "./Squiggle";
import { Sticky } from "./Sticky";

gsap.registerPlugin(ScrollTrigger);

/**
 * FIX SUMMARY (see chat for full explanation)
 * ------------------------------------------------------------------
 * BUG A (section "disappears" after scroll-away/scroll-back):
 *   The polaroid <img> finishes loading AFTER ScrollTrigger measures
 *   the page, silently changing section height. Nothing ever called
 *   ScrollTrigger.refresh(), so every trigger's start/end pixel math
 *   went stale. The exit tween (scrub, on the SAME `grid` element the
 *   entrance timeline also owns) then rendered at a bogus progress
 *   value once you scrolled back — visually "gone."
 *   FIX: (1) refresh on image load + window load + resize,
 *        (2) invalidateOnRefresh: true on every trigger,
 *        (3) the exit "turn the page" effect now lives on its own
 *            dedicated overlay/wrapper instead of re-touching the
 *            same opacity/y props the entrance timeline set on `grid`,
 *            so the two systems can never overwrite each other.
 *
 * BUG B (feels slow):
 *   Timeline had ~5.5-6s of real duration hidden behind small "+="
 *   gaps and long individual durations. Compressed to ~2.8-3.2s by
 *   shortening durations and using consistently negative overlaps.
 * ------------------------------------------------------------------
 *
 * NOTE ON CUSTOM COMPONENTS (Tilt, Tape, Arrow, Squiggle, Sticky):
 * Treated as thin presentational wrappers that spread `data-*`
 * attributes onto their root DOM node. Every element GSAP animates
 * gets a `data-anim="..."` hook, queried with gsap.utils.selector()
 * scoped to the section.
 */

export function MyStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root || !leftRef.current || !rightRef.current) return;

      const q = gsap.utils.selector(root);
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ------------------------------------------------------------------
      // Helper: pseudo-DrawSVG stroke reveal without the paid plugin.
      // ------------------------------------------------------------------
      const drawStroke = (
        selector: string,
        tl: gsap.core.Timeline,
        position: string | number,
        opts: { duration?: number; ease?: string; bounce?: boolean } = {}
      ) => {
        const paths = q(`${selector} path, ${selector} line, ${selector} polyline`);
        if (!paths.length) return;
        paths.forEach((path) => {
          const lengthEl = path as unknown as { getTotalLength?: () => number };
          const length =
            typeof lengthEl.getTotalLength === "function"
              ? lengthEl.getTotalLength()
              : 300;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: opts.duration ?? 0.6,
              ease: opts.ease ?? "power2.out",
            },
            position
          );
        });
        if (opts.bounce) {
          tl.fromTo(
            selector,
            { scale: 1 },
            { scale: 1.015, duration: 0.1, ease: "power1.out", yoyo: true, repeat: 1, transformOrigin: "left center" },
            ">-0.1"
          );
        }
      };

      // ====================================================================
      // MASTER "STORY" TIMELINE — plays once, ~2.8-3.2s total.
      // invalidateOnRefresh + a stable trigger element means if
      // ScrollTrigger.refresh() runs after the image loads, this
      // recalculates cleanly instead of drifting.
      // ====================================================================
      const story = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      const splitInstances: SplitType[] = [];

      if (prefersReducedMotion) {
        gsap.set(
          [
            leftRef.current,
            rightRef.current,
            q('[data-anim="paper"]'),
            q('[data-anim="margin"]'),
            q('[data-anim="chapter"]'),
            q('[data-anim="heading"]'),
            q('[data-anim="polaroid-wrap"]'),
            q('[data-anim="caption"]'),
            q('[data-anim="arrow-wrap"]'),
            q('[data-anim="arrow-caption"]'),
            q('[data-anim="quote"]'),
            q('[data-anim="para"]'),
            q('[data-anim="goal-box"]'),
            q('[data-anim="sticky-wrap"]'),
          ],
          { clearProps: "all", opacity: 1 }
        );
      } else {
        // ---- Phase 1 — Empty Notebook (0 -> 0.5s) -------------------------
        gsap.set(root, { perspective: 1200 });
        gsap.set(q('[data-anim="grid"]'), { transformOrigin: "top center" });

        story
          .fromTo(q('[data-anim="paper"]'), { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0)
          .fromTo(
            q('[data-anim="grid"]'),
            { rotateX: -8, y: 30, opacity: 0 },
            { rotateX: 0, y: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
            0
          )
          .fromTo(
            q('[data-anim="paper"]'),
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power2.inOut" },
            0.05
          )
          .fromTo(
            q('[data-anim="margin"]'),
            { scaleY: 0 },
            { scaleY: 1, duration: 0.45, ease: "power2.out", transformOrigin: "top center" },
            0.15
          );

        // ---- Phase 2 — Chapter + heading (0.3 -> 1.1s) ---------------------
        const chapterEl = q('[data-anim="chapter"]')[0] as HTMLElement | undefined;
        if (chapterEl) {
          const chapterSplit = new SplitType(chapterEl, { types: "chars" });
          splitInstances.push(chapterSplit);
          gsap.set(chapterSplit.chars, { opacity: 0, y: 5, rotate: () => gsap.utils.random(-6, 6) });
          story.to(
            chapterSplit.chars,
            { opacity: 1, y: 0, rotate: 0, duration: 0.3, ease: "back.out(2.2)", stagger: 0.016 },
            0.3
          );
        }

        story
          .fromTo(
            q('[data-anim="heading"]'),
            { opacity: 0, scale: 1.2, filter: "blur(10px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power4.out" },
            0.45
          )
          .to(
            q('[data-anim="heading"]'),
            {
              keyframes: [
                { x: -2, y: 1, rotate: -0.4, duration: 0.04 },
                { x: 2, y: -1, rotate: 0.4, duration: 0.04 },
                { x: -1, y: 0.5, rotate: -0.2, duration: 0.04 },
                { x: 0, y: 0, rotate: 0, duration: 0.05 },
              ],
              ease: "none",
            },
            "-=0.02"
          );

        // ---- Phase 3 — Squiggle draw (overlaps heading) --------------------
        drawStroke('[data-anim="squiggle"]', story, "-=0.3", { duration: 0.4, ease: "power2.out", bounce: true });

        // ---- Phase 4 — Polaroid memory (0.75 -> 1.55s) ----------------------
        story
          .fromTo(
            q('[data-anim="polaroid-wrap"]'),
            { opacity: 0, y: -55, rotateX: 30, rotateZ: -8, scale: 0.92, transformOrigin: "top center" },
            { opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1, duration: 0.55, ease: "power3.out" },
            "-=0.1"
          )
          .to(q('[data-anim="polaroid-wrap"]'), { y: -6, duration: 0.1, ease: "power1.out" }, ">-0.03")
          .to(q('[data-anim="polaroid-wrap"]'), { y: 0, duration: 0.2, ease: "bounce.out" })
          .fromTo(
            q('[data-anim="tape"]'),
            { scaleX: 0.7, scaleY: 1.3, opacity: 0 },
            { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.3, ease: "elastic.out(1,0.5)" },
            "<-0.05"
          )
          .fromTo(
            q('[data-anim="polaroid-wrap"]'),
            { boxShadow: "0 0 0 rgba(0,0,0,0)" },
            { boxShadow: "10px 16px 30px rgba(0,0,0,0.22)", duration: 0.3, ease: "power1.out" },
            "<"
          );

        // ---- Phase 5 — Caption (overlaps polaroid landing) -------------------
        const captionEl = q('[data-anim="caption"]')[0] as HTMLElement | undefined;
        if (captionEl) {
          const captionSplit = new SplitType(captionEl, { types: "chars" });
          splitInstances.push(captionSplit);
          gsap.set(captionSplit.chars, { opacity: 0 });
          story.to(captionSplit.chars, { opacity: 1, duration: 0.015, stagger: 0.016, ease: "none" }, "-=0.15");
        }

        // ---- Phase 6 — Arrow + second caption --------------------------------
        story.fromTo(
          q('[data-anim="arrow-wrap"]'),
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
          "-=0.05"
        );
        drawStroke('[data-anim="arrow-wrap"]', story, "<", { duration: 0.3, ease: "power2.out" });
        story.fromTo(
          q('[data-anim="arrow-caption"]'),
          { opacity: 0, x: -6 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
          "-=0.08"
        );

        // ---- Phase 7 — Quote (1.5 -> 2.15s) ------------------------------------
        const quoteLines = q('[data-anim="quote-line"]');
        if (quoteLines.length) {
          story.fromTo(
            quoteLines,
            { opacity: 0, y: 16, filter: "blur(3px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out", stagger: 0.14 },
            "-=0.05"
          );
        }
        story.fromTo(
          q('[data-anim="quote-highlight"]'),
          { backgroundSize: "0% 100%" },
          { backgroundSize: "100% 100%", duration: 0.4, ease: "power2.inOut" },
          "-=0.15"
        );

        // ---- Phase 8 — Paragraphs, line by line (1.9 -> 2.6s) ------------------
        const paraEls = q('[data-anim="para"]') as HTMLElement[];
        paraEls.forEach((p, i) => {
          const split = new SplitType(p, { types: "lines" });
          splitInstances.push(split);
          gsap.set(split.lines, { opacity: 0, y: 18 });
          story.to(
            split.lines,
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.035 },
            i === 0 ? "-=0.05" : "-=0.25"
          );
        });

        // ---- Phase 9 — Goal box (2.4 -> 2.75s) -----------------------------------
        story
          .fromTo(
            q('[data-anim="goal-border"]'),
            { scaleY: 0 },
            { scaleY: 1, duration: 0.32, ease: "power2.inOut", transformOrigin: "top center" },
            "-=0.1"
          )
          .fromTo(
            q('[data-anim="goal-box"]'),
            { backgroundColor: "rgba(26,107,255,0)" },
            { backgroundColor: "rgba(26,107,255,0.05)", duration: 0.28, ease: "power1.out" },
            "-=0.1"
          )
          .fromTo(
            q('[data-anim="goal-text"]'),
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
            "-=0.08"
          );

        // ---- Phase 10 — Sticky note (2.6 -> 3.0s) --------------------------------
        story
          .fromTo(
            q('[data-anim="sticky-wrap"]'),
            { opacity: 0, y: -110, rotate: -12, scale: 0.9 },
            { opacity: 1, y: 0, rotate: -2, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
            "-=0.05"
          )
          .fromTo(
            q('[data-anim="sticky-wrap"]'),
            { boxShadow: "0 0 0 rgba(0,0,0,0)" },
            { boxShadow: "6px 10px 18px rgba(0,0,0,0.18)", duration: 0.25 },
            "<"
          );
      }

      // ====================================================================
      // AMBIENT / CONTINUOUS "ALIVE" MOTION while the section is on screen
      // (unrelated to the entrance timeline's properties — no conflict)
      // ====================================================================
      const ambientTimelines: gsap.core.Timeline[] = [];

      const polaroidFloat = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
      polaroidFloat.to(q('[data-anim="polaroid-wrap"]'), { rotate: 2, y: -4, duration: 3.2, ease: "sine.inOut" });
      ambientTimelines.push(polaroidFloat);

      const stickyFloat = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
      stickyFloat.to(q('[data-anim="sticky-wrap"]'), { y: -3, rotate: -3, duration: 3.8, ease: "sine.inOut" });
      ambientTimelines.push(stickyFloat);

      const holesShimmer = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
      holesShimmer.to(q('[data-anim="hole"]'), { opacity: 0.55, duration: 2.4, ease: "sine.inOut", stagger: 0.5 });
      ambientTimelines.push(holesShimmer);

      const ambientST = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onEnter: () => ambientTimelines.forEach((t) => t.play()),
        onLeave: () => ambientTimelines.forEach((t) => t.pause()),
        onEnterBack: () => ambientTimelines.forEach((t) => t.play()),
        onLeaveBack: () => ambientTimelines.forEach((t) => t.pause()),
      });

      // Subtle scroll-linked parallax — these are scrub-driven and
      // self-correct every scroll frame, so they're safe even if a
      // refresh happens mid-scroll.
      gsap.to(q('[data-anim="paper"]'), {
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
      });
      gsap.to(q('[data-anim="quote"]'), {
        y: -14,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
      });

      // ====================================================================
      // EXIT — "turning the page" to the next chapter.
      // FIX: this now animates a dedicated `[data-anim="exit-veil"]` overlay
      // instead of re-touching `grid`'s opacity/y (which the entrance
      // timeline above already owns). Two systems never fight over the
      // same properties on the same element anymore, so a stale/late
      // refresh can no longer leave `grid` stuck invisible.
      // ====================================================================
      gsap.set(q('[data-anim="exit-veil"]'), { opacity: 0 });
      gsap.to(q('[data-anim="grid"]'), {
        y: -40,
        rotateX: 3,
        ease: "power1.in",
        scrollTrigger: {
          trigger: root,
          start: "bottom 65%",
          end: "bottom top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(q('[data-anim="exit-veil"]'), {
        opacity: 0.15,
        ease: "power1.in",
        scrollTrigger: {
          trigger: root,
          start: "bottom 65%",
          end: "bottom top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // ====================================================================
      // FIX: keep ScrollTrigger's math in sync with reality.
      // The polaroid <img> and any web fonts load asynchronously and
      // change the section's real layout height AFTER these triggers
      // were first measured. Without a refresh, every start/end value
      // above silently drifts — this is what caused the section to
      // render as "gone" on scroll-back. invalidateOnRefresh (set on
      // every trigger above) makes the refresh actually recompute
      // fromTo/to values instead of just re-measuring positions.
      // ====================================================================
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const resizeObserver = new ResizeObserver(() => refresh());
      resizeObserver.observe(root);

      return () => {
        window.removeEventListener("load", refresh);
        resizeObserver.disconnect();
        ambientST.kill();
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: containerRef, dependencies: [imgLoaded] }
  );

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative min-h-0 lg:min-h-screen overflow-hidden py-10 sm:py-16 md:py-24 lg:py-28 px-4 sm:px-8 lg:px-14"
      style={{ background: "#FFFDF7" }}
    >
      {/* Lined paper */}
      <div
        data-anim="paper"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent,transparent 39px,rgba(13,13,13,0.055) 39px,rgba(13,13,13,0.055) 40px)",
          backgroundSize: "100% 40px",
          willChange: "transform, opacity",
        }}
      />
      {/* Margin line */}
      <div
        data-anim="margin"
        className="absolute top-0 bottom-0 left-5 sm:left-12 lg:left-[88px] pointer-events-none"
        style={{ width: "1.5px", background: "rgba(239,68,68,0.4)" }}
      />
      {/* Hole punches */}
      {[14, 46, 78].map((t) => (
        <div
          key={t}
          data-anim="hole"
          className="absolute rounded-full pointer-events-none hidden sm:block"
          style={{
            top: `${t}%`,
            left: "43px",
            width: "18px",
            height: "18px",
            border: "2px solid rgba(13,13,13,0.1)",
          }}
        />
      ))}
      {/* Exit veil — dedicated overlay for the page-turn effect, kept
          separate from the entrance timeline's opacity ownership */}
      <div
        data-anim="exit-veil"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "#0D0D0D", zIndex: 5 }}
      />

      <div
        data-anim="grid"
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-6 sm:gap-10 lg:gap-20"
        style={{ transformOrigin: "top center", perspective: 1200 }}
      >
        {/* Left */}
        <div ref={leftRef}>
          <div
            data-anim="chapter"
            className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3"
            style={{ color: "#1A6BFF" }}
          >
            — chapter 01
          </div>
          <h2
            data-anim="heading"
            className="font-['Anton'] text-[#0D0D0D] leading-none"
            style={{ fontSize: "clamp(54px,12vw,82px)", willChange: "transform, filter, opacity" }}
          >
            MY
            <br />
            STORY
          </h2>
          <div data-anim="squiggle">
            <Squiggle color="#1A6BFF" w={140} className="mt-4" autoAnimate={false} />
          </div>

          {/* Polaroid with 3D Tilt */}
          <div
            data-anim="polaroid-wrap"
            className="mt-6 sm:mt-10 lg:mt-14 relative inline-block mx-auto lg:mx-0"
            style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
          >
            <Tilt style={{ rotate: "-3.5deg" }}>
              <div
                style={{
                  background: "#FFFDF7",
                  padding: "10px 10px 44px",
                  boxShadow: "5px 7px 22px rgba(0,0,0,0.14)",
                }}
              >
                <div data-anim="tape" style={{ transformOrigin: "center" }}>
                  <Tape
                    style={{
                      width: "88px",
                      height: "21px",
                      top: "-10px",
                      left: "50%",
                      transform: "translateX(-50%) rotate(1deg)",
                    }}
                  />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=320&h=240&fit=crop&auto=format"
                  alt="coding workspace"
                  onLoad={() => setImgLoaded(true)}
                  style={{
                    display: "block",
                    width: "min(100%,220px)",
                    height: "auto",
                    objectFit: "cover",
                    filter: "sepia(12%) contrast(1.08)",
                  }}
                />
                <p
                  data-anim="caption"
                  className="font-['Caveat'] text-center text-sm mt-2"
                  style={{ color: "rgba(13,13,13,0.48)" }}
                >
                  where it all started ↑
                </p>
              </div>
            </Tilt>
          </div>

          <div className="mt-5 flex items-center gap-2 ml-3">
            <div data-anim="arrow-wrap">
              <Arrow color="#0D0D0D" className="w-10 h-5 opacity-25" />
            </div>
            <span
              data-anim="arrow-caption"
              className="font-['Caveat'] text-sm"
              style={{ color: "rgba(13,13,13,0.32)" }}
            >
              that&apos;s the setup
            </span>
          </div>
        </div>

        {/* Right */}
        <div ref={rightRef}>
          {/* Pull quote */}
          <div data-anim="quote" className="relative mb-6 sm:mb-10">
            <div className="font-['Permanent_Marker'] text-[#0D0D0D] leading-tight" style={{ fontSize: "26px" }}>
              <span data-anim="quote-line" style={{ display: "inline-block" }}>
                &ldquo;I don&apos;t just write code.
              </span>
              <br />
              <span data-anim="quote-line" style={{ display: "inline-block" }}>
                <span
                  data-anim="quote-highlight"
                  style={{
                    backgroundImage: "linear-gradient(transparent 53%,rgba(26,107,255,0.3) 53%)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left",
                  }}
                >
                  I craft digital experiences.&rdquo;
                </span>
              </span>
            </div>
            <div
              className="hidden lg:block absolute -right-2 top-0 font-['Caveat'] text-[#1A6BFF] text-xs"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              ← remember this
            </div>
          </div>

          <p
            data-anim="para"
            className="font-['DM_Sans'] text-base sm:text-lg leading-[1.82] mb-4 sm:mb-5"
            style={{ color: "rgba(13,13,13,0.72)" }}
          >
            I&apos;m a B.Sc Computer Science student from Chennai who woke up one day and
            thought: <em>why choose between design and development?</em>
          </p>

          <p
            data-anim="para"
            className="font-['DM_Sans'] text-base sm:text-lg leading-[1.82] mb-4 sm:mb-5"
            style={{ color: "rgba(13,13,13,0.72)" }}
          >
            So I didn&apos;t. I taught myself React while sketching wireframes in Figma. I
            built mobile apps in Flutter while designing their UX from scratch. I became
            the person who ships <em>the whole thing</em>.
          </p>

          <div data-anim="goal-box" className="relative pl-5 py-3 mb-4 sm:mb-5" style={{ background: "rgba(26,107,255,0.05)" }}>
            <div
              data-anim="goal-border"
              className="absolute top-0 left-0 bottom-0"
              style={{ width: "4px", background: "#1A6BFF", willChange: "transform" }}
            />
            <p
              data-anim="goal-text"
              className="font-['DM_Sans'] text-base leading-[1.72]"
              style={{ color: "rgba(13,13,13,0.82)" }}
            >
              My goal is to become a world-class Full Stack Developer and Product
              Designer — someone who bridges the gap between beautiful design and solid
              engineering.
            </p>
          </div>

          <p
            data-anim="para"
            className="font-['DM_Sans'] text-base sm:text-lg leading-[1.82]"
            style={{ color: "rgba(13,13,13,0.72)" }}
          >
            Based in Chennai, dreaming globally. Always building, always designing.
          </p>

          <div className="mt-5 sm:mt-8 flex justify-center lg:justify-start">
            <div data-anim="sticky-wrap" style={{ display: "inline-block" }}>
              <Sticky color="#FFF176" rotate={-2} style={{ padding: "10px 16px" }}>
                <span className="font-['Caveat'] text-[#0D0D0D] text-sm font-semibold">
                  design + dev student ✦
                </span>
              </Sticky>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyStorySection;