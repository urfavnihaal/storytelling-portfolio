import type { ProcessStep } from "../types";

export const PROCESS_STEPS: ProcessStep[] = [
  { num: "01", phase: "Discover", desc: "Research, empathize, define the real problem. No assumptions.", color: "#FFF176", rotate: -2, ty: 0 },
  { num: "02", phase: "Design", desc: "Wireframes, prototypes, Figma mockups. Iterate fast, fail cheap.", color: "#B3E5FC", rotate: 1.5, ty: 22 },
  { num: "03", phase: "Develop", desc: "Clean code, solid architecture. React, Flutter, Node — ship it.", color: "#B9F0C8", rotate: -1, ty: 10 },
  { num: "04", phase: "Deploy", desc: "Launch, monitor, iterate. The work never truly ends.", color: "#FFB3C6", rotate: 2, ty: 30 },
];
