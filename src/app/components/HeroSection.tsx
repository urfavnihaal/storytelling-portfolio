import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useTypewriter } from "../hooks/useTypewriter";
import { Arrow } from "./Arrow";
import { Tape } from "./Tape";

gsap.registerPlugin(ScrollTrigger);

/**
 * Small helper: combines two independent motion sources (a slow idle drift and
 * a scroll-linked shift) that both want to drive the same `y` value on the
 * same element. Without this, an idle tween and a ScrollTrigger-driven tween
 * would fight over `y` every frame. Both sources report their latest number
 * here; we add them and push the result through a single quickTo setter.
 */
function createYDriver(target: HTMLElement | null) {
  let idle = 0;
  let scroll = 0;
  const yTo = target ? gsap.quickTo(target, "y", { duration: 0.5, ease: "power2.out" }) : null;
  const apply = () => yTo?.(idle + scroll);
  return {
    setIdle(v: number) {
      idle = v;
      apply();
    },
    setScroll(v: number) {
      scroll = v;
      apply();
    },
  };
}

export function HeroSection() {
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);
  const role = useTypewriter(
    ["Full Stack Developer", "Flutter Developer", "UI/UX Designer", "Graphic Designer"],
    75,
    2000,
    typewriterEnabled
  );

  const containerRef = useRef<HTMLElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const notebookRef = useRef<HTMLDivElement>(null);

  const heading1Ref = useRef<HTMLDivElement>(null);
  const heading2Ref = useRef<HTMLDivElement>(null);
  const blueMarkerRef = useRef<HTMLDivElement>(null);

  // Mouse-parallax + entrance targets (outer nodes)
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const pinkRef = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);
  const annoRef = useRef<HTMLDivElement>(null);
  const annoTextRef = useRef<HTMLSpanElement>(null);

  // Idle-wobble + scroll-shift targets (inner nodes, one per sticky)
  const blueInnerRef = useRef<HTMLDivElement>(null);
  const yellowInnerRef = useRef<HTMLDivElement>(null);
  const pinkInnerRef = useRef<HTMLDivElement>(null);
  const greenInnerRef = useRef<HTMLDivElement>(null);
  const annoInnerRef = useRef<HTMLDivElement>(null);

  // Stickies and annotations initial states
  const tornPaperRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLParagraphElement>(null);
  const locTapeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;

      // ── Reduced motion: skip straight to the final, fully visible state ──
      if (prefersReducedMotion) {
        gsap.set(
          [
            grainRef.current,
            notebookRef.current,
            tornPaperRef.current,
            scrollCueRef.current,
            locTapeRef.current,
            blueRef.current,
            yellowRef.current,
            pinkRef.current,
            greenRef.current,
            annoRef.current,
          ],
          { clearProps: "all", opacity: 1 }
        );
        if (blueMarkerRef.current) gsap.set(blueMarkerRef.current, { width: "88%" });
        if (annoTextRef.current) gsap.set(annoTextRef.current, { clipPath: "inset(0 0% 0 0)" });
        setTypewriterEnabled(true);
        return;
      }

      // ────────────────────────────────────────────────────────────────
      // 1–8. ENTRANCE TIMELINE
      // ────────────────────────────────────────────────────────────────
      const splitInstances: SplitType[] = [];
      let nameChars: Element[] = [];
      if (heading1Ref.current && heading2Ref.current) {
        const split1 = new SplitType(heading1Ref.current, { types: "chars" });
        const split2 = new SplitType(heading2Ref.current, { types: "chars" });
        splitInstances.push(split1, split2);
        nameChars = [...(split1.chars || []), ...(split2.chars || [])];
      }

      const tl = gsap.timeline({ delay: 0.05 });

      // 1. Paper grain fades in
      tl.fromTo(grainRef.current, { opacity: 0 }, { opacity: 0.05, duration: 1.4, ease: "power1.out" }, 0);

      // 2. Camera zooms in
      tl.fromTo(cameraRef.current, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);

      // 3. Notebook content drops into place
      tl.fromTo(
        notebookRef.current,
        { y: -46, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "elastic.out(1, 0.65)" },
        0.15
      );

      // 4. Name reveals character-by-character
      if (nameChars.length) {
        tl.fromTo(
          nameChars,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power4.out", stagger: 0.022 },
          0.4
        );
      }

      // 5. Blue marker highlight draws itself
      tl.fromTo(blueMarkerRef.current, { width: 0 }, { width: "88%", duration: 1.0, ease: "power3.inOut" }, 1.15);

      // 6. Stickies enter individually — unique timing, direction, overshoot
      tl.fromTo(tornPaperRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" }, 0.2);
      tl.fromTo(scrollCueRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 1.7);
      tl.fromTo(
        locTapeRef.current,
        { rotate: -5, opacity: 0, scale: 0.9 },
        { rotate: -1.8, opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" },
        1.05
      );
      tl.fromTo(
        blueRef.current,
        { opacity: 0, y: 40, rotate: -8 },
        { opacity: 1, y: 0, rotate: -3, duration: 1.2, ease: "elastic.out(1, 0.6)" },
        0.5
      );
      tl.fromTo(
        yellowRef.current,
        { opacity: 0, y: 50, rotate: 6 },
        { opacity: 1, y: 0, rotate: 2.5, duration: 1.1, ease: "back.out(1.8)" },
        0.68
      );
      tl.fromTo(
        pinkRef.current,
        { opacity: 0, y: 30, rotate: -4 },
        { opacity: 1, y: 0, rotate: -1.5, duration: 1.2, ease: "elastic.out(1, 0.5)" },
        0.85
      );
      tl.fromTo(
        greenRef.current,
        { opacity: 0, scale: 0.8, rotate: 8 },
        { opacity: 1, scale: 1, rotate: 3, duration: 1.0, ease: "back.out(2.2)" },
        1.0
      );
      tl.fromTo(
        annoRef.current,
        { opacity: 0, scale: 0.8, rotate: -12 },
        { opacity: 1, scale: 1, rotate: -6, duration: 0.6, ease: "power2.out" },
        1.3
      );

      // 7. Handwritten annotation — marker-writing reveal
      if (annoTextRef.current) {
        tl.fromTo(
          annoTextRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power2.inOut" },
          1.4
        );
      }

      // 8. SVG doodles draw themselves
      const bottomDoodle = containerRef.current?.querySelector(".bottom-doodle path");
      if (bottomDoodle) {
        gsap.set(bottomDoodle, { strokeDasharray: 200, strokeDashoffset: 200 });
        tl.to(bottomDoodle, { strokeDashoffset: 0, duration: 1.4, ease: "power2.out" }, 1.5);
      }
      const circleDoodle = containerRef.current?.querySelector(".circle-doodle path");
      if (circleDoodle) {
        gsap.set(circleDoodle, { strokeDasharray: 200, strokeDashoffset: 200, opacity: 0 });
        tl.to(circleDoodle, { strokeDashoffset: 0, opacity: 0.22, duration: 1.7, ease: "power2.out" }, 1.55);
      }

      // 9. Typewriter starts only once the name has finished revealing
      tl.call(() => setTypewriterEnabled(true), [], 1.05);

      // Scroll cue gentle pulse — invites the reader into the story
      if (scrollCueRef.current) {
        tl.fromTo(
          scrollCueRef.current.parentElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          1.85
        );
      }

      // ────────────────────────────────────────────────────────────────
      // IDLE MOTION (after entrance settles)
      // ────────────────────────────────────────────────────────────────
      const idleTweens: gsap.core.Tween[] = [];
      const stickyDrivers: ReturnType<typeof createYDriver>[] = [];
      const startIdleMotion = () => {
        // Paper "breathing" — a hair of vertical drift on the whole camera
        idleTweens.push(
          gsap.to(cameraRef.current, {
            y: 3,
            duration: 5.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          })
        );

        // Slow grain flicker/movement
        idleTweens.push(
          gsap.to(grainRef.current, {
            opacity: 0.07,
            backgroundPosition: "12px 8px",
            duration: 6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          })
        );

        // Each sticky: independent rotate wobble + combined y (idle + scroll)
        const stickies = [
          { inner: blueInnerRef, dur: 3.4, rot: 1.4 },
          { inner: yellowInnerRef, dur: 4.1, rot: -1.8 },
          { inner: pinkInnerRef, dur: 3.8, rot: 1.6 },
          { inner: greenInnerRef, dur: 4.6, rot: -1.3 },
          { inner: annoInnerRef, dur: 5.0, rot: 1.0 },
        ];

        stickies.forEach(({ inner, dur, rot }) => {
          if (!inner.current) return;
          idleTweens.push(
            gsap.to(inner.current, {
              rotate: rot,
              duration: dur,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            })
          );

          const driver = createYDriver(inner.current);
          stickyDrivers.push(driver);
          const floatTween = gsap.to(
            { v: -1 },
            {
              v: 1,
              duration: dur * 0.9,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              onUpdate() {
                driver.setIdle((this.targets()[0] as { v: number }).v * 3);
              },
            }
          );
          idleTweens.push(floatTween);
        });

        // Single shared ScrollTrigger for all sticky scroll parallax (avoids 5 duplicates)
        if (stickyDrivers.length) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate(self) {
              const scrollY = self.progress * -50;
              stickyDrivers.forEach((d) => d.setScroll(scrollY));
            },
          });
        }

        // Scroll indicator bounce
        const scrollIndicator = scrollCueRef.current?.parentElement;
        if (scrollIndicator) {
          idleTweens.push(
            gsap.to(scrollIndicator, {
              y: 6,
              duration: 1.8,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            })
          );
        }
      };

      tl.call(startIdleMotion, [], ">");

      // ────────────────────────────────────────────────────────────────
      // SCROLL EXPERIENCE
      // ────────────────────────────────────────────────────────────────
      // Camera scales down slightly as the Hero scrolls out of view
      gsap.to(cameraRef.current, {
        scale: 0.94,
        opacity: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Background dot texture drifts slower than the foreground (parallax depth)
      gsap.to(bgRef.current, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Marker highlight stretches slightly on scroll
      gsap.to(blueMarkerRef.current, {
        scaleX: 1.12,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // ────────────────────────────────────────────────────────────────
      // INTERACTION — desktop mouse parallax (skipped on touch devices)
      // ────────────────────────────────────────────────────────────────
      if (isFinePointer) {
        const xToBg = gsap.quickTo(bgRef.current, "x", { duration: 0.8, ease: "power3" });
        const xToContent = gsap.quickTo(contentRef.current, "x", { duration: 0.8, ease: "power3" });
        const yToContent = gsap.quickTo(contentRef.current, "y", { duration: 0.8, ease: "power3" });
        const xToBlue = gsap.quickTo(blueRef.current, "x", { duration: 0.8, ease: "power3" });
        const yToBlue = gsap.quickTo(blueRef.current, "y", { duration: 0.8, ease: "power3" });
        const xToYellow = gsap.quickTo(yellowRef.current, "x", { duration: 0.8, ease: "power3" });
        const yToYellow = gsap.quickTo(yellowRef.current, "y", { duration: 0.8, ease: "power3" });
        const xToPink = gsap.quickTo(pinkRef.current, "x", { duration: 0.8, ease: "power3" });
        const yToPink = gsap.quickTo(pinkRef.current, "y", { duration: 0.8, ease: "power3" });
        const xToGreen = gsap.quickTo(greenRef.current, "x", { duration: 0.8, ease: "power3" });
        const yToGreen = gsap.quickTo(greenRef.current, "y", { duration: 0.8, ease: "power3" });
        const xToAnno = gsap.quickTo(annoRef.current, "x", { duration: 0.8, ease: "power3" });
        const yToAnno = gsap.quickTo(annoRef.current, "y", { duration: 0.8, ease: "power3" });
        // Note: bgRef only gets x from the mouse — its y is reserved for the
        // scroll-driven drift above, so the two never write to the same axis.

        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const x = e.clientX / innerWidth - 0.5;
          const y = e.clientY / innerHeight - 0.5;

          xToBg(x * -15);
          xToContent(x * 12);
          yToContent(y * 12);
          xToBlue(x * 26);
          yToBlue(y * 26);
          xToYellow(x * -16);
          yToYellow(y * 20);
          xToPink(x * 32);
          yToPink(y * -12);
          xToGreen(x * -22);
          yToGreen(y * -28);
          xToAnno(x * 18);
          yToAnno(y * 18);
        };

        const handleMouseLeave = () => {
          xToBg(0);
          xToContent(0);
          yToContent(0);
          xToBlue(0);
          yToBlue(0);
          xToYellow(0);
          yToYellow(0);
          xToPink(0);
          yToPink(0);
          xToGreen(0);
          yToGreen(0);
          xToAnno(0);
          yToAnno(0);
        };

        containerRef.current?.addEventListener("mousemove", handleMouseMove);
        containerRef.current?.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          containerRef.current?.removeEventListener("mousemove", handleMouseMove);
          containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
          idleTweens.forEach((t) => t.kill());
          splitInstances.forEach((s) => s.revert());
        };
      }

      return () => {
        idleTweens.forEach((t) => t.kill());
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: containerRef }
  );

  // Touch-friendly reply to the mouse-hover "physical" bounce on each sticky
  const touchBounce = (ref: React.RefObject<HTMLDivElement>, restRotate: number) => {
    if (typeof window === "undefined" || !("ontouchstart" in window)) return {};
    return {
      onTouchStart: () => gsap.to(ref.current, { scale: 1.05, rotate: restRotate, duration: 0.2 }),
      onTouchEnd: () => gsap.to(ref.current, { scale: 1, rotate: restRotate, duration: 0.3, ease: "elastic.out(1, 0.5)" }),
    };
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-fit lg:min-h-screen overflow-hidden"
      style={{ background: "#F5F0E8" }}
    >
      {/* Paper grain overlay — fades in on load, breathes gently at idle */}
      <div
        ref={grainRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          opacity: 0,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Camera — everything below zooms/breathes/scales together */}
      <div ref={cameraRef} className="relative w-full min-h-fit lg:min-h-screen flex items-center" style={{ willChange: "transform" }}>
        {/* Dot texture (scroll parallax only — mouse parallax lives on x) */}
        <div
          ref={bgRef}
          className="absolute inset-[-5%] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(13,13,13,0.045) 1px,transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Blue vertical stripe — desktop-only column divider */}
        <div
          className="hidden lg:block absolute top-0 bottom-0 pointer-events-none"
          style={{ right: "37%", width: "1.5px", background: "linear-gradient(to bottom,transparent,#1A6BFF,transparent)", opacity: 0.14 }}
        />

        {/* Top-right torn paper — decorative, desktop-only */}
        <div
          ref={tornPaperRef}
          className="hidden lg:block absolute top-16 right-6 w-60 h-36 pointer-events-none"
          style={{
            background: "#FFFDF7",
            transform: "rotate(4deg)",
            boxShadow: "4px 7px 20px rgba(0,0,0,0.09)",
            clipPath: "polygon(0 0,100% 0,100% 75%,88% 80%,76% 74%,64% 80%,52% 74%,40% 80%,28% 74%,16% 80%,4% 74%,0 78%)",
          }}
        />

        <div ref={notebookRef} className="relative z-10 w-full px-2 sm:px-6 lg:px-12 pt-16 sm:pt-10 lg:pt-28 pb-6 sm:pb-10 lg:pb-20">
          <div className="flex flex-col lg:flex-row items-start">
            {/* LEFT — name */}
            <div ref={contentRef} className="relative w-full lg:flex-[0_0_60%]">
              <p ref={scrollCueRef} className="font-['Caveat'] text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 lg:mb-6 tracking-wider" style={{ color: "rgba(13,13,13,0.38)" }}>
                — creative portfolio · 2026
              </p>

              <div
                ref={heading1Ref}
                className="font-['Anton'] leading-[0.87] text-[#0D0D0D] overflow-hidden"
                style={{ fontSize: "clamp(42px,10.5vw,154px)" }}
              >
                S. Md.
              </div>

              <div className="relative inline-block overflow-hidden">
                <div
                  ref={heading2Ref}
                  className="font-['Anton'] leading-[0.87] text-[#0D0D0D] w-full"
                  style={{ fontSize: "clamp(64px,18vw,182px)" }}
                >
                  NIHAAL
                </div>
                {/* Blue marker highlight */}
                <div
                  ref={blueMarkerRef}
                  className="absolute bottom-1 left-0 pointer-events-none"
                  style={{ height: "17px", background: "rgba(26,107,255,0.27)", transform: "skewX(-1.5deg)" }}
                />
              </div>

              {/* Typewriter role */}
              <div className="mt-4 sm:mt-6 lg:mt-10 flex items-center gap-3">
                <div className="w-7 h-px" style={{ background: "rgba(13,13,13,0.28)" }} />
                <span className="font-['Permanent_Marker'] text-base sm:text-lg lg:text-xl" style={{ color: "rgba(13,13,13,0.78)" }}>
                  {role}
                  <span className="animate-pulse text-[#1A6BFF]">|</span>
                </span>
              </div>

              {/* Location tape */}
              <div className="mt-4 sm:mt-6 lg:mt-10 relative inline-block">
                <div
                  ref={locTapeRef}
                  style={{
                    background: "linear-gradient(135deg,rgba(212,202,170,0.92),rgba(232,222,192,0.86),rgba(212,202,170,0.92))",
                    padding: "8px 20px",
                    boxShadow: "2px 3px 9px rgba(0,0,0,0.11)",
                    fontFamily: "'Caveat',cursive",
                    fontSize: "clamp(15px,3.6vw,18px)",
                    color: "#0D0D0D",
                    fontWeight: 600,
                  }}
                  className="sm:!px-[26px] sm:!py-[9px]"
                >
                  📍 Chennai, Tamil Nadu, India
                </div>
              </div>

              {/* Scroll cue */}
              <div className="mt-5 sm:mt-8 lg:mt-16 flex items-center gap-2 sm:gap-3" style={{ opacity: 0 }}>
                <Arrow color="#0D0D0D" className="w-14 h-7 rotate-90 opacity-35" autoAnimate={false} />
                <span className="font-['Caveat'] text-lg" style={{ color: "rgba(13,13,13,0.38)" }}>
                  scroll to explore the story
                </span>
              </div>
            </div>

            {/* RIGHT — sticky note cluster */}
            <div className="relative w-full mt-5 sm:mt-7 lg:mt-0 flex flex-col items-center gap-2.5 sm:gap-4 lg:gap-5 min-h-fit lg:block lg:flex-[0_0_40%] lg:h-[560px]">
              {/* Primary blue sticky */}
              <div
                ref={blueRef}
                className="relative w-[88%] max-w-[260px] mx-auto p-4 sm:p-5 lg:p-6 lg:absolute lg:w-full lg:max-w-[234px] lg:top-[48px] lg:right-[64px]"
                style={{
                  background: "#1A6BFF",
                  boxShadow: "4px 6px 18px rgba(26,107,255,0.38)",
                }}
                onMouseEnter={() => gsap.to(blueRef.current, { scale: 1.05, rotate: -1, y: -4, duration: 0.2 })}
                onMouseLeave={() => gsap.to(blueRef.current, { scale: 1, rotate: -3, y: 0, duration: 0.2 })}
                {...touchBounce(blueRef, -3)}
              >
                <div ref={blueInnerRef}>
                  <Tape style={{ width: "96px", height: "23px", top: "-11px", left: "50%", transform: "translateX(-50%) rotate(1deg)" }} />
                  <p className="font-['Permanent_Marker'] text-white text-sm leading-relaxed">
                    building beautiful digital products that solve real problems ✦
                  </p>
                  <p className="font-['Caveat'] text-xs mt-2 lg:mt-3" style={{ color: "rgba(255,255,255,0.58)" }}>
                    full stack + design
                  </p>
                </div>
              </div>

              {/* Yellow sticky */}
              <div
                ref={yellowRef}
                className="relative w-[88%] max-w-[240px] mx-auto py-3 px-4 sm:py-3.5 sm:px-5 lg:absolute lg:w-full lg:max-w-[220px] lg:top-[252px] lg:right-[124px]"
                style={{
                  background: "#FFF176",
                  boxShadow: "3px 4px 13px rgba(0,0,0,0.16)",
                }}
                onMouseEnter={() => gsap.to(yellowRef.current, { scale: 1.05, rotate: 4, y: -4, duration: 0.2 })}
                onMouseLeave={() => gsap.to(yellowRef.current, { scale: 1, rotate: 2.5, y: 0, duration: 0.2 })}
                {...touchBounce(yellowRef, 2.5)}
              >
                <div ref={yellowInnerRef}>
                  <p className="font-['Caveat'] text-[#0D0D0D] font-bold text-base">B.Sc Computer Science</p>
                  <p className="font-['Caveat'] text-sm mt-1" style={{ color: "rgba(13,13,13,0.55)" }}>
                    Chennai, TN 🇮🇳
                  </p>
                </div>
              </div>

              {/* Pink sticky */}
              <div
                ref={pinkRef}
                className="relative w-[88%] max-w-[220px] mx-auto py-2.5 px-3.5 sm:py-3 sm:px-4 lg:absolute lg:w-full lg:max-w-[200px] lg:bottom-[90px] lg:right-[54px]"
                style={{
                  background: "#FFB3C6",
                  boxShadow: "3px 4px 13px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={() => gsap.to(pinkRef.current, { scale: 1.06, rotate: 1, y: -4, duration: 0.2 })}
                onMouseLeave={() => gsap.to(pinkRef.current, { scale: 1, rotate: -1.5, y: 0, duration: 0.2 })}
                {...touchBounce(pinkRef, -1.5)}
              >
                <div ref={pinkInnerRef}>
                  <p className="font-['Caveat'] text-[#0D0D0D] text-sm font-semibold">design × dev = ✨</p>
                </div>
              </div>

              {/* Green sticky */}
              <div
                ref={greenRef}
                className="relative w-[88%] max-w-[210px] mx-auto py-2 px-3 sm:py-2.5 sm:px-3.5 lg:absolute lg:w-full lg:max-w-[180px] lg:top-[390px] lg:right-[290px]"
                style={{
                  background: "#B9F0C8",
                  boxShadow: "2px 3px 10px rgba(0,0,0,0.12)",
                }}
                onMouseEnter={() => gsap.to(greenRef.current, { scale: 1.05, rotate: 0, y: -4, duration: 0.2 })}
                onMouseLeave={() => gsap.to(greenRef.current, { scale: 1, rotate: 3, y: 0, duration: 0.2 })}
                {...touchBounce(greenRef, 3)}
              >
                <div ref={greenInnerRef}>
                  <p className="font-['Caveat'] text-[#0D0D0D] text-sm">open to work 🚀</p>
                </div>
              </div>

              {/* Annotation */}
              <div
                ref={annoRef}
                className="relative -mt-1 sm:mt-0 lg:absolute font-['Caveat'] text-[#1A6BFF] text-sm lg:top-[362px] lg:right-[24px]"
              >
                <div ref={annoInnerRef}>
                  <span ref={annoTextRef} className="inline-block" style={{ clipPath: "inset(0 0% 0 0)" }}>
                    ← that&apos;s me!
                  </span>
                </div>
              </div>

              {/* Tapes — decorative, desktop-only */}
              <div className="hidden lg:block">
                <Tape style={{ width: "88px", height: "23px", top: "36px", right: "175px", transform: "rotate(-9deg)" }} />
              </div>
              <div className="hidden lg:block">
                <Tape style={{ width: "68px", height: "19px", bottom: "162px", right: "244px", transform: "rotate(13deg)" }} />
              </div>

              {/* Doodle circle (self-drawing) — desktop-only */}
              <svg
                className="hidden lg:block absolute pointer-events-none circle-doodle"
                style={{ bottom: "22px", left: "18px" }}
                width="60"
                height="60"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path d="M50 8 Q88 10 92 50 Q90 88 50 92 Q12 90 8 50 Q10 12 50 8" stroke="#0D0D0D" strokeWidth="2" strokeDasharray="3.5 3.5" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom line doodle */}
        <svg className="bottom-doodle hidden sm:block absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-10 pointer-events-none" style={{ opacity: 0.12 }} width="90" height="44" viewBox="0 0 90 44" fill="none">
          <path d="M4 40 L86 40 M4 30 L68 30 M4 20 L50 20 M4 10 L32 10" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;