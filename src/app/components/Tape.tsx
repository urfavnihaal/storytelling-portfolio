import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Tape({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current) return;
    const el = ref.current;
    const onEnter = () =>
      gsap.to(el, {
        rotate: -1.5,
        scaleY: 1.06,
        boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
        duration: 0.4,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    const onLeave = () =>
      gsap.to(el, {
        rotate: 0,
        scaleY: 1,
        boxShadow: "0 1px 4px rgba(0,0,0,0.13),inset 0 1px 0 rgba(255,255,255,0.38)",
        duration: 0.4,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute pointer-events-auto z-10"
      style={{
        background:
          "linear-gradient(135deg,rgba(212,202,170,0.9) 0%,rgba(232,222,192,0.84) 50%,rgba(212,202,170,0.9) 100%)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.13),inset 0 1px 0 rgba(255,255,255,0.38)",
        transformOrigin: "top center",
        ...style,
      }}
    />
  );
}

export default Tape;
