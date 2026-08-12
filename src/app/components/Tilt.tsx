import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { StyleProps } from "../types";

export function Tilt({ children, className, style }: { children: React.ReactNode } & StyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateYTo = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    if (!ref.current) return;
    rotateXTo.current = gsap.quickTo(ref.current, "rotateX", { duration: 0.5, ease: "power2.out" });
    rotateYTo.current = gsap.quickTo(ref.current, "rotateY", { duration: 0.5, ease: "power2.out" });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !rotateXTo.current || !rotateYTo.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const factorX = (y - height / 2) / (height / 2);
    const factorY = (x - width / 2) / (width / 2);

    rotateXTo.current(-factorX * 12);
    rotateYTo.current(factorY * 12);
  };

  const handleMouseLeave = () => {
    if (rotateXTo.current && rotateYTo.current) {
      rotateXTo.current(0);
      rotateYTo.current(0);
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transformStyle: "preserve-3d",
      }}
      className={`perspective-1000 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export default Tilt;
