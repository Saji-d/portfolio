# Sajidur Rahman Sajid - Portfolio

Full-stack software engineer and AI/ML developer, portfolio built with Next.js.

> **Heads up:** this project runs Next.js **16.2.12** (App Router, React 19). The API and file conventions in this version differ from older Next.js releases: if you're changing the framework code, read the relevant guide in `node_modules/next/dist/docs/` first and heed deprecation notices.

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (utility-based, no config file)
- **Motion**: Motion (formerly Framer Motion)
- **Icons**: lucide-react
- **3D globe**: react-globe.gl with three.js + world-atlas (topojson)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
app/                 Routes (App Router): /, /projects, /projects/[slug], /research, /research/[slug], /resume
components/
  home/              One-page sections (hero, about, projects, research, cortex, etc.)
  work/              Project cards, grid, case study renderer
  research/          Research cards, featured showcase, research overlay
  case-study/        ProjectOverlay used by the home page's project modal
  cortex/            "Cortex" console: the boot synapse overlay, terminal shell, and command views
  ui/                Shared primitives (Reveal, Eyebrow, MagneticButton, AnimatedMetric, …)
data/                Content: projects, research, resume, site metadata (slim + `.full` variants)
public/              Static assets: CV PDF, images (thumbnails, artwork, case-study screenshots)
```

## Content model

- **Projects**: `data/projects.ts` is the source of truth used by cards and the `/projects` grid. The home chapter renders `primaryProjects` (a 12-item subset) while `/projects` shows the full collection. `data/projects.full.ts` extends entries with case-study sections (`problem`, `solution`, `architecture`, `decisions`, `highlights`, `metrics`, …) rendered at `/projects/[slug]`.
- **Research**: `data/research.ts` for cards, `data/research.full.ts` for the full study pages/overlays.
- **Resume**: `data/resume.ts` feeds `/resume`; the downloadable CV lives at `public/Sajidur_Rahman_Sajid.pdf`.

## Notes

- The site is a single-page experience at `/` with additional archive pages (`/projects`, `/research`, `/resume`). Section navigation is hash-based with a tracked active state in the navbar.
- Covers live under `public/images/thumbnails/`. A project's `cover` must point to a file that exists; add the asset before marking the entry visible.
