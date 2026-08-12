import React from "react";
import { useInView } from "../hooks/useInView";
import { Tape } from "./Tape";
import { Squiggle } from "./Squiggle";
import { EXPERIENCE } from "../data/experience";

export function ExperienceSection() {
  const { ref, visible } = useInView();
  const [internship, education, hackathon] = EXPERIENCE;

  return (
    <section id="experience" ref={ref as React.RefObject<HTMLDivElement>} className="relative min-h-0 md:min-h-screen py-12 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-14 overflow-hidden" style={{ background: "#0D0D0D" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent,transparent 47px,rgba(255,255,255,0.028) 47px,rgba(255,255,255,0.028) 48px)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-8 sm:mb-12 lg:mb-16 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(48px)" }}>
          <div className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#1A6BFF" }}>
            — chapter 07
          </div>
          <h2 className="font-['Anton'] text-white leading-none" style={{ fontSize: "clamp(48px, 12vw, 82px)" }}>
            EXPERI-
            <br />
            ENCE
          </h2>
          <Squiggle color="#1A6BFF" w={205} className="mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-[1000px]">
          {/* Freelance sticky */}
          <div>
            <div
              style={{
                background: "#FFF176",
                padding: "20px 18px",
                position: "relative",
                boxShadow: "4px 5px 16px rgba(0,0,0,0.22)",
                height: "100%",
              }}
              className="md:!p-[26px_24px]"
            >
              <Tape style={{ width: "80px", height: "22px", top: "-10px", left: "50%", transform: "translateX(-50%)" }} />
              <div className="font-['Caveat'] text-sm mb-2" style={{ color: "rgba(13,13,13,0.44)" }}>
                {internship.period}
              </div>
              <h3 className="font-['Permanent_Marker'] text-[#0D0D0D] text-2xl mb-3">{internship.title}</h3>
              <p className="font-['DM_Sans'] text-sm leading-relaxed" style={{ color: "rgba(13,13,13,0.64)" }}>
                {internship.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {internship.tags?.map((t) => (
                  <span key={t} className="font-['Caveat'] text-xs px-2 py-1" style={{ background: "rgba(13,13,13,0.1)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* B.Sc */}
          <div>
            <div
              style={{
                border: "1px solid rgba(26,107,255,0.28)",
                padding: "20px 18px",
                height: "100%",
                background: "rgba(26,107,255,0.065)",
                position: "relative",
              }}
              className="md:!p-[26px]"
            >
              <Tape style={{ width: "80px", height: "22px", top: "-10px", left: "26px", opacity: 0.78 }} />
              <div className="font-['Caveat'] text-sm mb-2" style={{ color: "#1A6BFF" }}>
                {education.period}
              </div>
              <h3 className="font-['Permanent_Marker'] text-white text-2xl mb-3">{education.title}</h3>
              <p className="font-['DM_Sans'] text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.52)" }}>
                {education.description}
              </p>
              <div className="font-['Caveat'] text-sm mt-4" style={{ color: "#1A6BFF" }}>
                {education.location}
              </div>
            </div>
          </div>

          {/* Hackathon — full width */}
          <div className="col-span-1 md:col-span-2">
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 p-5 sm:p-7"
              style={{
                background: "rgba(255,255,255,0.032)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="font-['Anton'] leading-none flex-shrink-0 pointer-events-none" style={{ fontSize: "98px", color: "rgba(255,255,255,0.07)" }}>
                HCK
              </div>
              <div>
                <div className="font-['Caveat'] text-sm mb-2" style={{ color: "#1A6BFF" }}>
                  {hackathon.period}
                </div>
                <h3 className="font-['Permanent_Marker'] text-white text-2xl mb-3">{hackathon.title}</h3>
                <p className="font-['DM_Sans'] text-sm leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.48)" }}>
                  {hackathon.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
