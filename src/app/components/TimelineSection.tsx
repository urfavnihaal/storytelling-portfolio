import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { Tape } from "./Tape";
import { Squiggle } from "./Squiggle";
import { Counter } from "./Counter";
import { TL_EVENTS } from "../data/timeline";
import {
  prefersReducedMotion,
  revealInstant,
  sectionExit,
  sectionParallax,
} from "../utils/animation";

gsap.registerPlugin(ScrollTrigger);

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();

      if (reduced) {
        revealInstant([q('[data-anim="header"]'), q(".timeline-item"), lineRef.current, mobileLineRef.current]);
        if (lineRef.current) gsap.set(lineRef.current, { scaleY: 1 });
        if (mobileLineRef.current) gsap.set(mobileLineRef.current, { scaleY: 1 });
        return;
      }

      const splitInstances: SplitType[] = [];

      const intro = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
        defaults: { ease: "power3.out" },
      });

      intro.fromTo(q('[data-anim="grid-bg"]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);

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
          { opacity: 0, scale: 1.2, filter: "blur(10px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.75, ease: "power4.out" },
          0.3
        )
        .to(
          q('[data-anim="heading"]'),
          {
            keyframes: [
              { x: -2, duration: 0.04 },
              { x: 2, duration: 0.04 },
              { x: 0, duration: 0.06 },
            ],
            ease: "none",
          },
          ">-0.05"
        );

      const squigglePath = q('[data-anim="squiggle"] path')[0] as unknown as SVGPathElement | undefined;
      if (squigglePath) {
        const length = squigglePath.getTotalLength?.() ?? 300;
        gsap.set(squigglePath, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
        intro.to(
          squigglePath,
          { strokeDashoffset: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
          0.55
        );
      }

      // Center line scroll-drawing (desktop)
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top center",
              end: "bottom center",
              scrub: 0.4,
            },
          }
        );
      }

      // Mobile left rail draws with scroll
      if (mobileLineRef.current) {
        gsap.fromTo(
          mobileLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: root,
              start: "top 85%",
              end: "bottom 20%",
              scrub: 0.4,
            },
          }
        );
      }

      const items = gsap.utils.toArray<HTMLElement>(".timeline-item", root);
      items.forEach((item, i) => {
        const isLeft = item.classList.contains("timeline-left");
        const dot = item.querySelector(".timeline-dot");
        const content = item.querySelector(".timeline-content");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });

        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.5)" }
        );
        tl.fromTo(
          content,
          { x: isLeft ? 50 : -50, opacity: 0, rotate: isLeft ? 6 : -6 },
          { x: 0, opacity: 1, rotate: 0, duration: 0.75, ease: "power3.out" },
          "-=0.25"
        );

        // Connecting pulse — each milestone feels linked to the next
        if (i < items.length - 1) {
          tl.to(dot, { scale: 1.35, duration: 0.15, ease: "power1.out", yoyo: true, repeat: 1 }, "+=0.1");
        }
      });

      sectionParallax(root, q('[data-anim="grid-bg"]'), 30, 0.7);
      if (contentRef.current) {
        sectionExit(root, contentRef.current, { y: -45, opacity: 0.82 });
      }

      return () => {
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section id="timeline" ref={sectionRef} className="relative min-h-0 md:min-h-screen py-12 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-14 overflow-hidden" style={{ background: "#0D0D0D" }}>
      <div
        data-anim="grid-bg"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(26,107,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,107,255,0.07) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto" style={{ perspective: 1200 }}>
        <div data-anim="header" className="mb-10 sm:mb-16 lg:mb-20">
          <div
            data-anim="chapter"
            className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3"
            style={{ color: "#1A6BFF" }}
          >
            — chapter 02
          </div>
          <h2
            data-anim="heading"
            className="font-['Anton'] text-white leading-none"
            style={{ fontSize: "clamp(48px, 12vw, 82px)" }}
          >
            TIME-
            <br />
            LINE
          </h2>
          <div data-anim="squiggle">
            <Squiggle color="#1A6BFF" w={160} className="mt-4" autoAnimate={false} />
          </div>
        </div>

        <div className="relative">
          <div
            ref={lineRef}
            className="hidden md:block absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "50%",
              width: "1px",
              background: "rgba(26,107,255,0.42)",
              transform: "translateX(-0.5px)",
              transformOrigin: "top center",
            }}
          />

          <div
            ref={mobileLineRef}
            className="md:hidden absolute top-0 bottom-0 left-3 pointer-events-none"
            style={{
              width: "1px",
              background: "rgba(26,107,255,0.32)",
              transformOrigin: "top center",
            }}
          />

          {TL_EVENTS.map((e, i) => (
            <div key={i} className={`relative flex flex-col md:flex-row items-start mb-6 md:mb-10 pl-8 md:pl-0 timeline-item ${e.side === "left" ? "timeline-left" : "timeline-right"}`}>
              {e.side === "left" ? (
                <>
                  <div className="w-full md:flex-1 md:flex md:justify-end md:pr-12">
                    <div
                      className="timeline-content w-full md:max-w-[275px] py-3.5 px-4 md:py-[18px] md:px-[22px]"
                      style={{
                        background: e.bg,
                        position: "relative",
                        transformOrigin: "right center",
                      }}
                    >
                      <Tape style={{ width: "70px", height: "20px", top: "-9px", left: "50%", transform: "translateX(-50%)", opacity: 0.88 }} />
                      <p className="font-['Caveat'] font-bold text-base mb-1" style={{ color: e.fg ?? "rgba(13,13,13,0.5)" }}>
                        <Counter value={e.year} />
                      </p>
                      <p className="font-['Permanent_Marker'] text-lg mb-2" style={{ color: e.fg ?? "#0D0D0D" }}>
                        {e.label}
                      </p>
                      <p className="font-['DM_Sans'] text-sm leading-relaxed" style={{ color: e.fg ? "rgba(255,255,255,0.68)" : "rgba(13,13,13,0.62)" }}>
                        {e.desc}
                      </p>
                    </div>
                  </div>
                  <div
                    className="absolute top-5 rounded-full border-2 z-10 timeline-dot left-3 md:left-1/2"
                    style={{ width: "14px", height: "14px", transform: "translateX(-50%)", background: "#1A6BFF", borderColor: "#0D0D0D" }}
                  />
                  <div className="hidden md:block flex-1 pl-12" />
                </>
              ) : (
                <>
                  <div className="hidden md:block flex-1 pr-12" />
                  <div
                    className="absolute top-5 rounded-full border-2 z-10 timeline-dot left-3 md:left-1/2"
                    style={{ width: "14px", height: "14px", transform: "translateX(-50%)", background: "#F5F0E8", borderColor: "#1A6BFF" }}
                  />
                  <div className="w-full md:flex-1 md:flex md:justify-start md:pl-12">
                    <div
                      className="timeline-content w-full md:max-w-[275px] py-3.5 px-4 md:py-[18px] md:px-[22px]"
                      style={{
                        background: e.bg,
                        position: "relative",
                        transformOrigin: "left center",
                      }}
                    >
                      <Tape style={{ width: "70px", height: "20px", top: "-9px", left: "50%", transform: "translateX(-50%)", opacity: 0.78 }} />
                      <p className="font-['Caveat'] font-bold text-base mb-1" style={{ color: e.fg ?? "rgba(13,13,13,0.5)" }}>
                        <Counter value={e.year} />
                      </p>
                      <p className="font-['Permanent_Marker'] text-lg mb-2" style={{ color: e.fg ?? "#0D0D0D" }}>
                        {e.label}
                      </p>
                      <p className="font-['DM_Sans'] text-sm leading-relaxed" style={{ color: e.fg ? "rgba(255,255,255,0.68)" : "rgba(13,13,13,0.62)" }}>
                        {e.desc}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
