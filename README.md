# aashutoshr.github.io

Personal portfolio of **Aashutosh Rawate**, Full Stack, Machine Learning and AI Engineer based in Glasgow.

**Live:** https://aashutoshr.github.io

## Design

Dark canvas (`#0D0F12`, `#181B20`) with three accents, one per role: cyan `#06B6D4` for full stack, violet `#8B5CF6` for machine learning and emerald `#10B981` for AI. Geist and Geist Mono throughout.

## What's on the page

- **Hero:** a WebGL colour field and cursor-reactive lines behind a headline that rotates through full-stack web apps, machine learning models and LLM-powered AI apps, with the matching role lighting up
- **Projects:** all 16 in one filterable bento grid with specific domains (LLM Inference, Financial RAG, Deepfake Detection...). Tiles glow and tilt under the cursor; clicking one opens a details panel
- **About:** a statement that lights up as you scroll, a draggable 3D globe marking Mumbai and Glasgow, and three role cards
- **Experience:** a timeline that draws itself as you scroll
- **Activity:** a terminal showing live commits from GitHub. Visitors can type commands: `help`, `projects`, `open 1`, `skills`, `experience`, `now`, `contact`, `resume`, `hire`
- **Skills:** a tech orbit with one ring per role, plus the full toolbox
- **Contact:** icon cards for email, GitHub, LinkedIn and resume
- **Command menu:** press `Ctrl K` (or `⌘K`, or `/`) to jump to any section, open any project or copy the email

Smooth scrolling (Lenis), reduced-motion support, and a full phone layout.

## Live GitHub activity

On every visit the page reads the GitHub REST API for the most recently pushed public repos and their latest commits, and refreshes every two minutes while open. Results are cached for three minutes per visitor to stay within GitHub's anonymous limit. New public repos appear in the projects grid automatically with a "New" badge. Only public repositories are read.

## Editing content

Everything lives in [`assets/js/data.js`](assets/js/data.js):

| Section | Variable |
| --- | --- |
| Name, statement, about text, links | `PROFILE` |
| Jobs | `EXPERIENCE` |
| Degrees | `EDUCATION` |
| Skills | `SKILLS` |
| Projects (`domain`, `group`, optional `shot` screenshot) | `PROJECTS` |
| Project filter groups | `GROUPS` |
| Repos to hide | `EXCLUDE` |
| Technology icons | `TECH` |

Screenshots go in `assets/img/work/`. The photo is `assets/img/avatar.webp`. Replace `assets/Aashutosh_Rawate_CV.pdf` to update the resume.

## Run locally

```bash
python -m http.server 5544
```

Then open http://localhost:5544.

## Credits

Globe by [cobe](https://github.com/shuding/cobe) (MIT, bundled in `assets/vendor`). Smooth scrolling by [Lenis](https://lenis.darkroom.engineering). Tech logos from [Devicon](https://devicon.dev) and [Simple Icons](https://simpleicons.org). UI icons from [Lucide](https://lucide.dev).
