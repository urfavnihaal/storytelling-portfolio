import type { NavItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  ["01", "hero"],
  ["02", "story"],
  ["03", "timeline"],
  ["04", "skills"],
  ["05", "projects"],
  ["06", "certs"],
  ["07", "experience"],
  ["08", "process"],
  ["09", "contact"],
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
