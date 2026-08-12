import React from "react";
import { Magnetic } from "./Magnetic";
import { NAV_ITEMS } from "../constants/navigation";

export function Navbar({ active }: { active: string }) {
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el && window.lenisInstance) {
      window.lenisInstance.scrollTo(el, { offset: -72 });
    } else {
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5"
      style={{
        background: "rgba(245,240,232,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(13,13,13,0.07)",
      }}
    >
      <Magnetic>
        <button
          onClick={() => go("hero")}
          className="font-['Permanent_Marker'] text-xl text-[#0D0D0D] hover:text-[#1A6BFF] transition-colors duration-200"
        >
          nihaal.
        </button>
      </Magnetic>
      <div className="hidden md:flex items-center gap-5">
        {NAV_ITEMS.map(([lbl, id]) => (
          <button
            key={id}
            onClick={() => go(id)}
            className="font-['DM_Sans'] text-[11px] tracking-[0.14em] uppercase transition-all duration-200 hover:text-[#1A6BFF] hover:scale-105"
            style={{ color: active === id ? "#1A6BFF" : "rgba(13,13,13,0.38)", fontWeight: active === id ? 600 : 400 }}
          >
            {lbl}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
