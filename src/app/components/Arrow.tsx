import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../utils/animation";

gsap.registerPlugin(ScrollTrigger);

export function Arrow({
  color = "#0D0D0D",
  className,
  autoAnimate = true,
}: {
  color?: string;
  className?: string;
  /** When false, parent section orchestrates the stroke draw (prevents duplicate triggers). */
  autoAnimate?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!autoAnimate || !ref.current) return;
      const paths = gsap.utils.toArray<SVGPathElement>("path", ref.current);
      if (!paths.length) return;

      if (prefersReducedMotion()) {
        gsap.set(paths, { clearProps: "all", opacity: 1 });
        return;
      }

      paths.forEach((path) => {
        const length =
          typeof path.getTotalLength === "function" ? path.getTotalLength() : 1000;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
      });

      gsap.to(paths[0], {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          once: true,
        },
      });

      if (paths[1]) {
        gsap.to(paths[1], {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            once: true,
          },
          delay: 0.7,
        });
      }
    },
    { dependencies: [autoAnimate] }
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 90 44"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 22 Q22 7 44 22 Q62 35 80 18"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M73 10 L82 18 L73 26"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default Arrow;
