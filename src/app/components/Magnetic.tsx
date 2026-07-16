import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    if (!ref.current) return;
    xTo.current = gsap.quickTo(ref.current, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
    yTo.current = gsap.quickTo(ref.current, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !xTo.current || !yTo.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    xTo.current((clientX - centerX) * 0.35);
    yTo.current((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    if (xTo.current && yTo.current) {
      xTo.current(0);
      yTo.current(0);
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </div>
  );
}

export default Magnetic;
