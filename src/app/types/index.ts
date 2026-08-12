import type React from "react";

/** A single nav entry: [displayIndex, sectionId] */
export type NavItem = [string, string];

/** Timeline event used in the "Timeline" section */
export type TLEvent = {
  year: string;
  label: string;
  desc: string;
  side: "left" | "right";
  bg: string;
  fg?: string;
};

/** A single floating skill tag in the "My Tools" section */
export type SkillItem = {
  name: string;
  color: string;
  rotate: number;
  top: string;
  left: string;
};

/** A category annotation label overlaid on the skills field */
export type SkillAnnotation = {
  text: string;
  top: string;
  left: string;
  r: number;
};

/** A single polaroid photo in the gallery */
export type Polaroid = {
  src: string;
  caption: string;
  rotate: number;
  top: string;
  left: string;
  z: number;
};

/** A single certificate entry */
export type Certificate = {
  name: string;
  issuer: string;
  year: string;
  color: string;
};

/** A single step in the "My Process" section */
export type ProcessStep = {
  num: string;
  phase: string;
  desc: string;
  color: string;
  rotate: number;
  ty: number;
};

/** A single social/contact link sticky note */
export type Social = {
  label: string;
  color: string;
  rotate: number;
  top: string;
  left: string;
  href: string;
};

/** Content for a single project card in the "Featured Projects" section */
export type Project = {
  index: string;
  tech: string;
  title: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

/** Content for a single experience card */
export type ExperienceItem = {
  kind: "internship" | "education" | "hackathon";
  period: string;
  title: string;
  description: string;
  tags?: string[];
  location?: string;
};

/** Shared props for decorative primitives */
export type StyleProps = {
  style?: React.CSSProperties;
  className?: string;
};
