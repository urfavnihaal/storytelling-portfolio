# S. Md. Nihaal — Portfolio (refactored)

This is the same portfolio you had in one giant `App.tsx`, split into a
production-style React + TypeScript + Vite project. No design, animation,
copy, layout, or styling was changed — only the file organization.

## Structure

```
src/
├── main.tsx                 # React root
├── index.css                # Tailwind directives + global reset
├── vite-env.d.ts            # Vite client types (asset/CSS imports)
└── app/
    ├── App.tsx               # Root component — composes all sections
    ├── components/           # Every section + reusable primitive
    │   ├── Navbar.tsx
    │   ├── HeroSection.tsx
    │   ├── MyStorySection.tsx
    │   ├── TimelineSection.tsx
    │   ├── SkillsSection.tsx
    │   ├── ProjectsSection.tsx
    │   ├── GallerySection.tsx
    │   ├── CertificatesSection.tsx
    │   ├── ExperienceSection.tsx
    │   ├── ProcessSection.tsx
    │   ├── ContactSection.tsx
    │   ├── GrainBackground.tsx
    │   ├── CustomCursor.tsx
    │   ├── ScrollProvider.tsx
    │   ├── Magnetic.tsx / Tilt.tsx / Sticky.tsx / Tape.tsx
    │   ├── Arrow.tsx / Squiggle.tsx / Counter.tsx
    │   └── index.ts          # barrel export
    ├── hooks/
    │   ├── useInView.ts
    │   └── useTypewriter.ts
    ├── data/                  # every array/content-set, typed
    │   ├── projects.ts
    │   ├── skills.ts
    │   ├── timeline.ts
    │   ├── gallery.ts
    │   ├── certificates.ts
    │   ├── experience.ts
    │   ├── process.ts
    │   └── socials.ts
    ├── constants/
    │   └── navigation.ts      # NAV_ITEMS + section id list
    └── types/
        └── index.ts           # shared TS types
```

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check (tsc --noEmit) then production build
```

## Important note on verification

This refactor was done in a sandboxed environment **without internet
access**, so `npm install` could not actually be run against the real
`react`, `gsap`, `@gsap/react`, `split-type`, and `lenis` packages here —
there's no network egress in this tool. I carefully hand-checked every
file for import/export correctness and matched the original JSX 1:1 (same
structure, classNames, inline styles, animation code, and text), but I
was not able to run a live `npm run build` to give you a guaranteed
zero-error confirmation the way the instructions asked for. Please run:

```bash
npm install
npm run build
```

on your machine as the final verification step. If anything doesn't
compile, it's most likely a small import path issue that's easy to spot
from the TypeScript error — happy to fix it if you paste the error back.

## Note on `ScrollProvider`, `GrainBackground`, `CustomCursor`

Your original `App.tsx` imported these three from `./components/...`, but
their source wasn't included in the file you gave me — only the import
lines were. I reconstructed reasonable, working versions based on how
they're used elsewhere in the code:

- **`ScrollProvider`** — sets up Lenis smooth-scroll and registers GSAP's
  `ScrollTrigger`, exposing `window.lenisInstance` (used by `Navbar`'s
  click-to-scroll).
- **`GrainBackground`** — a fixed, full-viewport, non-interactive
  film-grain overlay.
- **`CustomCursor`** — a dot + trailing ring cursor that expands and
  shows a label over elements marked `data-cursor="..."` (used in
  `ProjectsSection`).

If your real versions of these three differ, just drop your original
files into `src/app/components/` in their place — nothing else in the
app depends on their internals, only on the two behaviors above.

## Data-driven sections

`TimelineSection`, `SkillsSection`, `GallerySection`,
`CertificatesSection`, `ProcessSection`, and `ContactSection` already
mapped over arrays in the original file, so those arrays moved into
`data/` untouched.

`ProjectsSection` and `ExperienceSection` were originally hand-written
per-card JSX (each card has a distinct layout, so it wasn't a `.map()`
over an array). To honor the array separation, I extracted each card's
text content into `data/projects.ts` and `data/experience.ts` and wired
the same JSX to read from `PROJECTS[0]`, `PROJECTS[1]`, etc. — the
markup, styles, and layout per card are byte-for-byte the same as
before.
