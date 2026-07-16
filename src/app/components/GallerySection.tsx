import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { Tilt } from "./Tilt";
import { Tape } from "./Tape";
import { Squiggle } from "./Squiggle";
import { POLAROIDS } from "../data/gallery";
import {
  prefersReducedMotion,
  revealInstant,
  sectionExit,
  sectionParallax,
} from "../utils/animation";

gsap.registerPlugin(ScrollTrigger);

export function GallerySection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();

      if (reduced) {
        revealInstant([q('[data-anim="header"]'), q('[data-anim="polaroid"]'), q('[data-anim="ghost"]')]);
        return;
      }

      const splitInstances: SplitType[] = [];

      const intro = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
        defaults: { ease: "power3.out" },
      });

      intro.fromTo(q('[data-anim="bg-dots"]'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

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

      intro.fromTo(
        q('[data-anim="heading"]'),
        { opacity: 0, scale: 1.2, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.75, ease: "power4.out" },
        0.3
      );

      const squigglePath = q('[data-anim="squiggle"] path')[0] as unknown as SVGPathElement | undefined;
      if (squigglePath) {
        const length = squigglePath.getTotalLength?.() ?? 300;
        gsap.set(squigglePath, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
        intro.to(
          squigglePath,
          { strokeDashoffset: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
          0.5
        );
      }

      const polaroids = gsap.utils.toArray<HTMLElement>('[data-anim="polaroid"]', root);
      polaroids.forEach((polaroid, i) => {
        const rotate = parseFloat(polaroid.dataset.rotate || "0");
        const img = polaroid.querySelector('[data-anim="polaroid-img"]');
        const mask = polaroid.querySelector('[data-anim="polaroid-mask"]');

        intro.fromTo(
          polaroid,
          { opacity: 0, y: 60, scale: 0.88, rotate: rotate - 8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate,
            duration: 0.85,
            ease: "back.out(1.4)",
          },
          0.65 + i * 0.1
        );

        if (mask) {
          intro.fromTo(
            mask,
            { scaleX: 1, transformOrigin: "left center" },
            { scaleX: 0, duration: 0.7, ease: "power3.inOut" },
            0.75 + i * 0.1
          );
        }

        if (img) {
          intro.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.0, ease: "power2.out" }, 0.8 + i * 0.1);
        }

        // Depth parallax per polaroid while in view
        gsap.to(polaroid, {
          y: -8 - i * 2,
          ease: "none",
          scrollTrigger: {
            trigger: polaroid,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });

      intro.fromTo(
        q('[data-anim="ghost"]'),
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1.0 },
        1.2
      );

      sectionParallax(root, q('[data-anim="bg-dots"]'), -25, 0.7);
      sectionExit(root, q('[data-anim="gallery-content"]'), { y: -40, opacity: 0.88 });

      return () => {
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <section id="gallery" ref={containerRef} className="relative overflow-hidden min-h-0 md:min-h-[125vh]" style={{ background: "#F5F0E8" }}>
      <div
        data-anim="bg-dots"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(13,13,13,0.04) 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div data-anim="gallery-content" className="relative z-10">
        <div className="px-4 sm:px-8 lg:px-14 pt-14 sm:pt-20 lg:pt-28">
          <div data-anim="header" className="mb-3 sm:mb-4">
            <div
              data-anim="chapter"
              className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3"
              style={{ color: "#1A6BFF" }}
            >
              — chapter 05
            </div>
            <h2
              data-anim="heading"
              className="font-['Anton'] text-[#0D0D0D] leading-none"
              style={{ fontSize: "clamp(48px, 12vw, 82px)" }}
            >
              DESIGN
              <br />
              GALLERY
            </h2>
            <div data-anim="squiggle">
              <Squiggle color="#1A6BFF" w={205} className="mt-3 sm:mt-4" autoAnimate={false} />
            </div>
          </div>
        </div>

        <div className="relative gallery-scatter md:h-[800px]">
          {POLAROIDS.map((p, i) => (
            <div
              key={i}
              data-anim="polaroid"
              data-rotate={p.rotate}
              className="absolute gallery-item"
              style={{ top: p.top, left: p.left, zIndex: p.z }}
            >
              <Tilt style={{ rotate: `${p.rotate}deg` }}>
                <div
                  style={{
                    background: "#FFFDF7",
                    padding: "8px 8px 38px",
                    boxShadow: "5px 8px 24px rgba(0,0,0,0.17)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Tape style={{ width: "74px", height: "20px", top: "-9px", left: "50%", transform: "translateX(-50%)" }} />
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      data-anim="polaroid-img"
                      src={p.src}
                      alt={p.caption}
                      style={{
                        display: "block",
                        width: "min(100%, 190px)",
                        height: "auto",
                        maxHeight: "230px",
                        objectFit: "cover",
                        filter: "contrast(1.06) saturate(0.86)",
                      }}
                    />
                    <div
                      data-anim="polaroid-mask"
                      className="absolute inset-0 bg-[#FFFDF7] z-10"
                      style={{ transformOrigin: "left center" }}
                    />
                  </div>
                  <p className="font-['Caveat'] text-center text-sm mt-2" style={{ color: "rgba(13,13,13,0.48)" }}>
                    {p.caption}
                  </p>
                </div>
              </Tilt>
            </div>
          ))}

          <div
            data-anim="ghost"
            className="hidden md:block absolute bottom-4 right-10 pointer-events-none"
          >
            <p className="font-['Anton'] leading-none" style={{ fontSize: "140px", color: "rgba(13,13,13,0.03)" }}>
              moments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
