import gsap from "gsap";
import SplitType from "split-type";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Instantly reveal targets — used when reduced-motion is active. */
export function revealInstant(targets: gsap.TweenTarget) {
  gsap.set(targets, { clearProps: "all", opacity: 1 });
}

/**
 * Pseudo-DrawSVG stroke reveal for paths/lines/rects inside a scoped query.
 * Falls back silently when no strokable elements are found.
 */
export function drawStroke(
  q: (selector: string) => Element[],
  selector: string,
  tl: gsap.core.Timeline,
  position: string | number,
  opts: { duration?: number; ease?: string; bounce?: boolean } = {}
) {
  const shapes = q(
    `${selector} rect, ${selector} path, ${selector} line, ${selector} polyline`
  );
  if (!shapes.length) return;

  shapes.forEach((shape) => {
    const length =
      typeof (shape as SVGGeometryElement).getTotalLength === "function"
        ? (shape as SVGGeometryElement).getTotalLength()
        : 300;
    gsap.set(shape, { strokeDasharray: length, strokeDashoffset: length });
    tl.to(
      shape,
      {
        strokeDashoffset: 0,
        duration: opts.duration ?? 1.0,
        ease: opts.ease ?? "power2.out",
      },
      position
    );
  });

  if (opts.bounce) {
    tl.fromTo(
      selector,
      { scale: 1 },
      {
        scale: 1.015,
        duration: 0.12,
        ease: "power1.out",
        yoyo: true,
        repeat: 1,
        transformOrigin: "left center",
      },
      ">-0.15"
    );
  }
}

/** Split text and reveal with upward fade stagger. Returns SplitType for cleanup. */
export function splitReveal(
  el: HTMLElement | undefined,
  tl: gsap.core.Timeline,
  position: string | number,
  type: "chars" | "lines" | "words" = "lines"
): SplitType | null {
  if (!el) return null;
  const split = new SplitType(el, { types: type });
  const targets = type === "chars" ? split.chars : type === "words" ? split.words : split.lines;
  if (!targets?.length) return split;
  gsap.set(targets, { opacity: 0, y: 18 });
  tl.to(
    targets,
    { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.045 },
    position
  );
  return split;
}

/** Standard chapter header entrance: chars + stamped heading + optional squiggle draw. */
export function chapterEntrance(
  q: (selector: string) => Element[],
  tl: gsap.core.Timeline,
  splitInstances: SplitType[],
  opts: { chapter?: string; heading?: string; squiggle?: string; headingAt?: number } = {}
) {
  const chapterSel = opts.chapter ?? '[data-anim="chapter"]';
  const headingSel = opts.heading ?? '[data-anim="heading"]';
  const squiggleSel = opts.squiggle ?? '[data-anim="squiggle"]';

  const chapterEl = q(chapterSel)[0] as HTMLElement | undefined;
  if (chapterEl) {
    const chapterSplit = new SplitType(chapterEl, { types: "chars" });
    splitInstances.push(chapterSplit);
    gsap.set(chapterSplit.chars, { opacity: 0, y: 6 });
    tl.to(
      chapterSplit.chars,
      { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)", stagger: 0.025 },
      0.1
    );
  }

  tl.fromTo(
    q(headingSel),
    { opacity: 0, scale: 1.25, filter: "blur(12px)" },
    {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.7,
      ease: "power4.out",
    },
    opts.headingAt ?? 0.35
  ).to(
    q(headingSel),
    {
      keyframes: [
        { x: -2, rotate: -0.3, duration: 0.04 },
        { x: 2, rotate: 0.3, duration: 0.04 },
        { x: 0, rotate: 0, duration: 0.06 },
      ],
      ease: "none",
    },
    ">-0.05"
  );

  drawStroke(q, squiggleSel, tl, "-=0.2", { duration: 0.6 });
}

/** Scrub-linked section exit — page-turn feel between chapters. */
export function sectionExit(
  trigger: Element,
  targets: gsap.TweenTarget,
  opts: {
    start?: string;
    end?: string;
    y?: number;
    opacity?: number;
    rotateX?: number;
    scrub?: number | boolean;
  } = {}
) {
  return gsap.to(targets, {
    y: opts.y ?? -40,
    opacity: opts.opacity ?? 0.88,
    rotateX: opts.rotateX,
    ease: "power1.in",
    scrollTrigger: {
      trigger,
      start: opts.start ?? "bottom 68%",
      end: opts.end ?? "bottom top",
      scrub: opts.scrub ?? 0.5,
    },
  });
}

/** Parallax drift while a section is in the viewport. */
export function sectionParallax(
  trigger: Element,
  targets: gsap.TweenTarget,
  y: number,
  scrub = 0.6
) {
  return gsap.to(targets, {
    y,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub,
    },
  });
}
