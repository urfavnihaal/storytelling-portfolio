import React, { useState } from "react";
import { useInView } from "../hooks/useInView";
import { Squiggle } from "./Squiggle";
import { Arrow } from "./Arrow";
import { Sticky } from "./Sticky";
import { SOCIALS } from "../data/socials";

export function ContactSection() {
  const { ref, visible } = useInView();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText("nihaalfarhan@gmail.com").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" ref={ref as React.RefObject<HTMLDivElement>} className="relative min-h-0 md:min-h-screen py-12 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-14 overflow-hidden" style={{ background: "#F5F0E8" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(13,13,13,0.04) 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Ghost word */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="font-['Anton'] leading-none whitespace-nowrap" style={{ fontSize: "210px", color: "rgba(13,13,13,0.035)" }}>
          CONTACT
        </div>
      </div>

      <div className="relative z-10">
        <div className="transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(48px)" }}>
          <div className="font-['Caveat'] text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#1A6BFF" }}>
            — chapter 09
          </div>
          <div className="font-['Anton'] text-[#0D0D0D] leading-[0.87]" style={{ fontSize: "clamp(62px,9.5vw,138px)" }}>
            LET&apos;S
          </div>
          <div className="flex items-center gap-6">
            <div className="font-['Anton'] text-[#1A6BFF] leading-[0.87]" style={{ fontSize: "clamp(62px,9.5vw,138px)" }}>
              TALK.
            </div>
            <Arrow color="#1A6BFF" className="w-20 h-10 mt-3" />
          </div>
          <Squiggle color="#1A6BFF" w={225} className="mt-4 sm:mt-6" />
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mt-10 sm:mt-14 lg:mt-16 transition-all duration-700 delay-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)" }}
        >
          {/* Left */}
          <div>
            <p className="font-['DM_Sans'] text-xl leading-[1.72] mb-6 sm:mb-10 max-w-lg" style={{ color: "rgba(13,13,13,0.64)" }}>
              Have a project in mind? Want to collaborate on something interesting? Or just want to say hello — my inbox is always open.
            </p>

            <button onClick={copy} className="group block text-left mb-2">
              <div className="font-['Permanent_Marker'] text-[#0D0D0D] transition-colors group-hover:text-[#1A6BFF]" style={{ fontSize: "24px", borderBottom: "3px solid #1A6BFF", paddingBottom: "4px" }}>
                {copied ? "Copied! ✓" : "nihaalfarhan@gmail.com"}
              </div>
            </button>
            <p className="font-['Caveat'] text-base" style={{ color: "rgba(13,13,13,0.34)" }}>
              click to copy ↑
            </p>

            <div className="mt-6 sm:mt-10">
              <Sticky color="#FFF176" rotate={-2} style={{ display: "inline-block", padding: "12px 20px" }}>
                <p className="font-['Caveat'] text-[#0D0D0D] text-sm font-semibold">Chennai, India 🇮🇳</p>
                <p className="font-['Caveat'] text-xs mt-1" style={{ color: "rgba(13,13,13,0.58)" }}>
                  open to remote &amp; relocation
                </p>
              </Sticky>
            </div>
          </div>

          {/* Right — scattered socials */}
          <div className="relative contact-scatter md:h-[340px]">
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="absolute social-item block transition-all duration-200 hover:scale-110 hover:z-50"
                style={{
                  top: s.top,
                  left: s.left,
                  opacity: visible ? 1 : 0,
                  transform: visible ? `rotate(${s.rotate}deg)` : `rotate(${s.rotate}deg) scale(0.7)`,
                  transitionDelay: `${300 + i * 80}ms`,
                  cursor: "pointer",
                }}
              >
                <Sticky color={s.color} rotate={0} style={{ padding: "14px 22px" }}>
                  <span className="font-['Permanent_Marker'] text-[#0D0D0D] text-xl">{s.label} ↗</span>
                </Sticky>
              </a>
            ))}

            <div className="absolute social-caption font-['Caveat'] text-sm" style={{ bottom: "8%", right: "8%", color: "#1A6BFF", transform: "rotate(-5deg)" }}>
              let&apos;s connect! →
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 lg:mt-24 pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center transition-all duration-700 delay-400" style={{ borderTop: "1px solid rgba(13,13,13,0.08)", opacity: visible ? 1 : 0 }}>
          <span className="font-['Permanent_Marker'] text-lg" style={{ color: "rgba(13,13,13,0.28)" }}>
            S. Md. Nihaal © 2024
          </span>
          <span className="font-['Caveat'] text-base" style={{ color: "rgba(13,13,13,0.28)" }}>
            crafted with 💙 in Chennai
          </span>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
