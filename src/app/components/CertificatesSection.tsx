import React from "react";
import { useInView } from "../hooks/useInView";
import { Squiggle } from "./Squiggle";
import { Arrow } from "./Arrow";
import { CERTS } from "../data/certificates";

export function CertificatesSection() {
  const { ref, visible } = useInView();

  return (
    <section id="certs" ref={ref as React.RefObject<HTMLDivElement>} className="relative py-12 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-14 overflow-hidden" style={{ background: "#FFFDF7" }}>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-12 lg:mb-16 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(48px)" }}>
          <div className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#1A6BFF" }}>
            — chapter 06
          </div>
          <h2 className="font-['Anton'] text-[#0D0D0D] leading-none" style={{ fontSize: "clamp(48px, 12vw, 82px)" }}>
            CERTIFI-
            <br />
            CATES
          </h2>
          <Squiggle color="#1A6BFF" w={205} className="mt-4" />
        </div>

        {CERTS.map((c, i) => (
          <div
            key={i}
            className="group relative flex flex-col sm:flex-row sm:items-center py-4 sm:py-6 px-3 sm:px-4 hover:bg-[#F5F0E8] overflow-hidden"
            style={{
              borderBottom: "1px solid rgba(13,13,13,0.08)",
            }}
          >
            <div className="flex-shrink-0 self-stretch mr-4 sm:mr-6 rounded-sm" style={{ width: "5px", background: c.color }} />
            <div className="flex-1 min-w-0">
              <h3 className="font-['Permanent_Marker'] text-[#0D0D0D] text-xl">{c.name}</h3>
              <p className="font-['Caveat'] text-base mt-1" style={{ color: "rgba(13,13,13,0.44)" }}>
                {c.issuer}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-8 flex-shrink-0 flex items-center gap-3 sm:gap-0">
              <span className="font-['Caveat'] text-sm px-3 py-1.5" style={{ background: c.color, color: "#FFFDF7" }}>
                {c.year}
              </span>
              <div className="sm:ml-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Arrow color={c.color} className="w-9 h-5" />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 sm:mt-10 flex items-center gap-3 ml-2 sm:ml-4">
          <Arrow color="#0D0D0D" className="w-11 h-5 opacity-22" />
          <span className="font-['Caveat'] text-xl" style={{ color: "rgba(13,13,13,0.32)" }}>
            and more incoming...
          </span>
        </div>
      </div>

      <div className="hidden md:block absolute right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="font-['Anton'] leading-none" style={{ fontSize: "178px", color: "rgba(13,13,13,0.028)" }}>
          CERTS
        </div>
      </div>
    </section>
  );
}

export default CertificatesSection;
