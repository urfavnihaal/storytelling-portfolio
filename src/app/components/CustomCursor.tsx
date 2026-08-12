import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * NOTE: same caveat as ScrollProvider/GrainBackground — reconstructed because the
 * original source wasn't included in the file that was refactored. This follows
 * the cursor with a small dot + trailing ring, and expands/labels the ring when
 * hovering elements marked with `data-cursor="..."` (used throughout
 * ProjectsSection). Swap in your original implementation if it differs.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const handleMove = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      if (target) {
        setLabel(target.getAttribute("data-cursor"));
        gsap.to(ring, { scale: 2.2, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      if (target) {
        setLabel(null);
        gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none rounded-full"
        style={{ width: 6, height: 6, background: "#1A6BFF", transform: "translate(-50%,-50%)" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none rounded-full flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          border: "1.5px solid rgba(13,13,13,0.35)",
          transform: "translate(-50%,-50%)",
        }}
      >
        {label && (
          <span className="font-['Caveat'] text-[10px] uppercase tracking-wide text-[#0D0D0D]">
            {label}
          </span>
        )}
      </div>
    </>
  );
}

export default CustomCursor;
