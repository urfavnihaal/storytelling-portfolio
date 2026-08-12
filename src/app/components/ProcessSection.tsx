import React from "react";
import { useInView } from "../hooks/useInView";
import { Squiggle } from "./Squiggle";
import { Arrow } from "./Arrow";
import { PROCESS_STEPS } from "../data/process";

export function ProcessSection() {
  const { ref, visible } = useInView();

  return (
    <section id="process" ref={ref as React.RefObject<HTMLDivElement>} className="relative py-12 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-14 overflow-hidden" style={{ background: "#F5F0E8" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(13,13,13,0.04) 1px,transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10">
        <div className="mb-8 sm:mb-12 lg:mb-16 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(48px)" }}>
          <div className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#1A6BFF" }}>
            — chapter 08
          </div>
          <h2 className="font-['Anton'] text-[#0D0D0D] leading-none" style={{ fontSize: "clamp(48px, 12vw, 82px)" }}>
            MY
            <br />
            PROCESS
          </h2>
          <Squiggle color="#1A6BFF" w={185} className="mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PROCESS_STEPS.map((s, i) => (
            <div
              key={i}
              className="transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? `translateY(${s.ty}px) rotate(${s.rotate}deg)` : `translateY(${s.ty + 60}px) rotate(${s.rotate}deg)`,
                transitionDelay: `${140 + i * 110}ms`,
              }}
            >
              <div
                style={{
                  background: s.color,
                  padding: "20px 18px",
                  boxShadow: "4px 6px 18px rgba(0,0,0,0.12)",
                  clipPath:
                    i % 2 === 0
                      ? "polygon(0 0,100% 0,100% 88%,82% 94%,64% 88%,46% 94%,28% 88%,10% 94%,0 90%)"
                      : "polygon(0 6%,18% 12%,36% 6%,54% 12%,72% 6%,90% 12%,100% 8%,100% 100%,0 100%)",
                }}
                className="sm:!p-[28px_22px]"
              >
                <div className="font-['Anton'] leading-none mb-3" style={{ fontSize: "58px", color: "rgba(13,13,13,0.18)" }}>
                  {s.num}
                </div>
                <h3 className="font-['Permanent_Marker'] text-[#0D0D0D] text-2xl mb-3">{s.phase}</h3>
                <p className="font-['DM_Sans'] text-sm leading-relaxed" style={{ color: "rgba(13,13,13,0.64)" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Connecting arrows */}
        <div className="hidden sm:flex justify-around mt-4 sm:mt-6 px-4 sm:px-10">
          {[0, 1, 2].map((i) => (
            <Arrow key={i} color="#0D0D0D" className="w-16 h-7 opacity-[0.18]" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
