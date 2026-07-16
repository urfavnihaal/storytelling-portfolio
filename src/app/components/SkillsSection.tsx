import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { Squiggle } from "./Squiggle";
import { SKILLS, SKILL_ANNOTATIONS } from "../data/skills";
import {
  prefersReducedMotion,
  revealInstant,
  sectionExit,
  sectionParallax,
} from "../utils/animation";

gsap.registerPlugin(ScrollTrigger);

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();

      if (reduced) {
        revealInstant([
          q('[data-anim="header"]'),
          q(".skill-item"),
          q(".skill-anno"),
          q(".skill-ghost"),
          q(".skill-count"),
        ]);
        return;
      }

      const splitInstances: SplitType[] = [];
      const hoverCleanups: Array<() => void> = [];

      const intro = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
        defaults: { ease: "power3.out" },
      });

      intro.fromTo(
        q('[data-anim="bg-dots"]'),
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        0
      );

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
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.25
        )
        .fromTo(
          q('[data-anim="subheading"]'),
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6 },
          0.45
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

      const skills = gsap.utils.toArray<HTMLElement>(".skill-item", root);
      skills.forEach((skill, i) => {
        const rotate = parseFloat(skill.dataset.rotate || "0");
        intro.fromTo(
          skill,
          { opacity: 0, scale: 0.65, rotate: rotate - 18 },
          {
            opacity: 1,
            scale: 1,
            rotate,
            duration: 0.85,
            ease: "back.out(2)",
          },
          0.7 + i * 0.04
        );

        const onEnter = () => {
          gsap.to(skill, {
            scale: 1.15,
            rotate: rotate + 5,
            y: -8,
            boxShadow: "5px 8px 22px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(skill, {
            scale: 1,
            rotate,
            y: 0,
            boxShadow: "3px 4px 13px rgba(0,0,0,0.14)",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        skill.addEventListener("mouseenter", onEnter);
        skill.addEventListener("mouseleave", onLeave);
        hoverCleanups.push(() => {
          skill.removeEventListener("mouseenter", onEnter);
          skill.removeEventListener("mouseleave", onLeave);
        });
      });

      const annos = gsap.utils.toArray<HTMLElement>(".skill-anno", root);
      annos.forEach((anno, i) => {
        const rotate = parseFloat(anno.dataset.rotate || "0");
        intro.fromTo(
          anno,
          { opacity: 0, rotate: rotate - 12, y: -24 },
          { opacity: 1, rotate, y: 0, duration: 0.8 },
          1.1 + i * 0.08
        );
      });

      const ghost = q(".skill-ghost")[0];
      if (ghost) {
        intro.fromTo(ghost, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1.0 }, 0.9);
      }

      const count = q(".skill-count")[0];
      if (count) {
        intro.fromTo(
          count,
          { rotate: -18, scale: 0.4, opacity: 0 },
          { rotate: -5, scale: 1, opacity: 1, duration: 0.9, ease: "back.out(2)" },
          1.0
        );
      }

      sectionParallax(root, q('[data-anim="bg-dots"]'), -20, 0.8);
      sectionExit(root, q('[data-anim="content"]'), { y: -35, opacity: 0.9 });

      return () => {
        hoverCleanups.forEach((fn) => fn());
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <section id="skills" ref={containerRef} className="relative overflow-hidden min-h-0 md:min-h-[115vh]" style={{ background: "#F5F0E8" }}>
      <div
        data-anim="bg-dots"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(13,13,13,0.04) 1px,transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div data-anim="content" className="relative z-10 px-4 sm:px-8 lg:px-14 pt-14 sm:pt-20 lg:pt-28 pb-6 md:pb-0">
        <div className="mb-3 sm:mb-4" data-anim="header">
          <div
            data-anim="chapter"
            className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3"
            style={{ color: "#1A6BFF" }}
          >
            — chapter 03
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-8">
            <h2
              data-anim="heading"
              className="font-['Anton'] text-[#0D0D0D] leading-none"
              style={{ fontSize: "clamp(48px, 12vw, 82px)" }}
            >
              MY TOOLS
            </h2>
            <span
              data-anim="subheading"
              className="font-['Caveat'] text-4xl mb-0 sm:mb-3"
              style={{ color: "rgba(13,13,13,0.28)" }}
            >
              &amp; skills
            </span>
          </div>
          <div data-anim="squiggle">
            <Squiggle color="#1A6BFF" w={185} className="mt-3 sm:mt-4" autoAnimate={false} />
          </div>
        </div>

        <div className="relative mt-3 sm:mt-4 skills-scatter md:h-[700px]">
          {SKILLS.map((s, i) => (
            <div key={i} className="absolute skill-item" data-rotate={s.rotate} style={{ top: s.top, left: s.left, transform: `rotate(${s.rotate}deg)` }}>
              <div
                style={{
                  background: s.color,
                  padding: "11px 16px",
                  minWidth: "96px",
                  boxShadow: "3px 4px 13px rgba(0,0,0,0.14)",
                  cursor: "default",
                }}
              >
                <div className="font-['Permanent_Marker'] text-[#0D0D0D] text-sm">{s.name}</div>
              </div>
            </div>
          ))}

          {SKILL_ANNOTATIONS.map((c, i) => (
            <div key={i} className="absolute font-['Caveat'] text-xl font-bold skill-anno" data-rotate={c.r} style={{ top: c.top, left: c.left, color: "rgba(26,107,255,0.38)", transform: `rotate(${c.r}deg)` }}>
              {c.text}
            </div>
          ))}

          <div className="absolute bottom-2 right-0 font-['Anton'] leading-none pointer-events-none skill-ghost" style={{ fontSize: "160px", color: "rgba(13,13,13,0.03)" }}>
            SKILLS
          </div>

          <div className="absolute bottom-10 left-8 skill-count" style={{ transform: "rotate(-5deg)" }}>
            <span className="font-['Permanent_Marker']" style={{ fontSize: "48px", color: "rgba(13,13,13,0.12)" }}>
              15+ tools
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
