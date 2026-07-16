import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../utils/animation";

gsap.registerPlugin(ScrollTrigger);

export function Squiggle({
  color = "#1A6BFF",
  w = 180,
  className,
  autoAnimate = true,
}: {
  color?: string;
  w?: number;
  className?: string;
  /** When false, parent section orchestrates the stroke draw (prevents duplicate triggers). */
  autoAnimate?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!autoAnimate || !ref.current) return;
      const path = ref.current.querySelector("path");
      if (!path) return;

      if (prefersReducedMotion()) {
        gsap.set(path, { clearProps: "all", opacity: 1 });
        return;
      }

      const length =
        typeof path.getTotalLength === "function" ? path.getTotalLength() : 1000;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });

      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          once: true,
        },
      });
    },
    { dependencies: [autoAnimate] }
  );

  const h = 14;
  const pts = Array.from({ length: 10 }, (_, i) => {
    const x = (i / 9) * (w - 4) + 2;
    const y = i % 2 === 0 ? 3 : 11;
    return `${x} ${y}`;
  }).join(" L ");

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ width: w }} className={className}>
      <path d={`M ${pts}`} stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default Squiggle;
