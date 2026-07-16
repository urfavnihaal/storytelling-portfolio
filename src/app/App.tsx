import React, { useEffect, useState } from "react";
import {
  ScrollProvider,
  GrainBackground,
  CustomCursor,
  Navbar,
  HeroSection,
  MyStorySection,
  TimelineSection,
  SkillsSection,
  ProjectsSection,
  GallerySection,
  CertificatesSection,
  ExperienceSection,
  ProcessSection,
  ContactSection,
} from "./components";
import { SECTION_IDS } from "./constants/navigation";

export default function App() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.32 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <ScrollProvider>
      <GrainBackground />
      <CustomCursor />
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar active={active} />
        <HeroSection />
        <MyStorySection />
        <TimelineSection />
        <SkillsSection />
        <ProjectsSection />
        <GallerySection />
        <CertificatesSection />
        <ExperienceSection />
        <ProcessSection />
        <ContactSection />
      </div>
    </ScrollProvider>
  );
}
