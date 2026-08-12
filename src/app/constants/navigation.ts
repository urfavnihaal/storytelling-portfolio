import type { NavItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  ["01", "hero"],
  ["02", "story"],
  ["03", "timeline"],
  ["04", "skills"],
  ["05", "projects"],
  ["06", "gallery"],
  ["07", "certs"],
  ["08", "experience"],
  ["09", "process"],
  ["10", "contact"],
];

/** Section ids used for scroll-spy (IntersectionObserver) in App.tsx */
export const SECTION_IDS: string[] = [
  "hero",
  "story",
  "timeline",
  "skills",
  "projects",
  "gallery",
  "certs",
  "experience",
  "process",
  "contact",
];
