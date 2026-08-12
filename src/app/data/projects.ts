import type { Project } from "../types";

/**
 * Content for the "Featured Projects" section.
 * Each project renders inside a hand-tailored layout in ProjectsSection.tsx
 * (the layouts differ card-to-card), so this array only carries the text
 * content — not a generic template — to keep the original design intact.
 */
export const PROJECTS: Project[] = [
  {
    index: "01",
    tech: "React · Node.js · MongoDB · Hackathon",
    title: "FarmEasy",
    description:
      "A web application connecting farmers directly with consumers — eliminating middlemen with direct listings, ordering, and a simple marketplace flow. Built for a hackathon.",
    tags: ["Farmer Listings", "Marketplace", "Consumer Access", "Dashboard", "Auth"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop&auto=format",
    imageAlt: "dashboard",
  },
  {
    index: "02",
    tech: "Flutter · Supabase · Dart",
    title: "The Unani Academy",
    description:
      "Mobile learning platform for students — purchase courses, read PDFs, track progress. Supabase backend with seamless auth.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&auto=format",
    imageAlt: "mobile app",
  },
  {
    index: "03",
    tech: "Flutter · Figma · UI/UX",
    title: "Global Badminton Academy",
    description:
      "Planning and designing a slot-booking mobile app for a badminton academy — from user flow to Figma prototype.",
  },
  {
    index: "04",
    tech: "Figma · Web Design · UI/UX",
    title: "Sansbound Lab Website",
    description:
      "Designed and developed the official website for Sanborn — clean, brand-aligned, built from the ground up.",
  },
  {
    index: "05",
    tech: "Figma · Corporate UI/UX",
    title: "TVARA Corporate Website",
    description:
      "Complete corporate website UI/UX designed fully in Figma. Clean, professional, brand-aligned — from ideation to high-fidelity prototype.",
  },
];
