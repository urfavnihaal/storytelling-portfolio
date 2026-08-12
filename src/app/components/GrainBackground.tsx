import React from "react";

/**
 * NOTE: same caveat as ScrollProvider — this component was referenced by the
 * original App.tsx but its source wasn't included in the file that was
 * refactored, so this is a reconstruction: a fixed, full-viewport, non-interactive
 * film-grain/noise overlay. Swap in your original implementation if it differs.
 */
export function GrainBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        opacity: 0.035,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

export default GrainBackground;
