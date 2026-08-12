import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Sticky({
  children,
  color = "#FFF176",
  rotate = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.set(el, { rotate });
    const onEnter = () =>
      gsap.to(el, {
        rotate: rotate + (rotate >= 0 ? 2 : -2),
        scale: 1.04,
        y: -6,
        boxShadow: "8px 12px 20px rgba(0,0,0,0.22)",
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
      });
    const onLeave = () =>
      gsap.to(el, {
        rotate,
        scale: 1,
        y: 0,
        boxShadow: "3px 5px 14px rgba(0,0,0,0.18),1px 1px 4px rgba(0,0,0,0.07)",
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
      });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [rotate]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        background: color,
        boxShadow: "3px 5px 14px rgba(0,0,0,0.18),1px 1px 4px rgba(0,0,0,0.07)",
        padding: "14px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Sticky;
