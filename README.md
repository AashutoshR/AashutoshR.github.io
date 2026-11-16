# aashutoshr.github.io

Personal portfolio of **Aashutosh Rawate**, software engineer (backend, distributed systems, ML systems).

**Live:** https://aashutoshr.github.io

## Design

Dark palette built on the 60-30-10 rule: obsidian canvas (`#0D0F12`), charcoal surfaces (`#181B20`), snow and silver text (`#F3F4F6`, `#9CA3AF`), and cyan (`#06B6D4`) used only for buttons, links and highlights. Geist and Geist Mono throughout.

- Hero with a cursor-reactive line animation, a cut-out portrait and a live "Latest commit" card
- All projects in one filterable grid; clicking a card opens a details panel with screenshot, key result, full stack and links
- Experience timeline, skills with technology logos, education, and icon contact cards
- Smooth scrolling (Lenis), gentle reveal-on-scroll, `prefers-reduced-motion` support, works on phones

Alternative palettes (dark + emerald, dark + violet, clean + cobalt, clean + sage) are already defined in `assets/css/site.css`. To switch, change `data-palette` on the `<html>` tag in `index.html`.

## Live GitHub activity

On every visit the page reads the GitHub REST API for your most recently pushed public repos and their latest commits. It powers the "Latest commit" card, "Currently building" and the commit feed, and refreshes every two minutes while the page is open. Results are cached for three minutes per visitor so reloads stay within GitHub's anonymous limit of 60 requests an hour. New public repos appear in the projects grid automatically with a "New" badge. Only public repositories are read.

## Editing content

Everything lives in [`assets/js/data.js`](assets/js/data.js):

| Section | Variable |
| --- | --- |
| Name, about text, stats, links | `PROFILE` |
| Jobs | `EXPERIENCE` |
| Degrees | `EDUCATION` |
| Skills | `SKILLS` |
| Projects (order = display order; add `shot` for a screenshot cover) | `PROJECTS` |
| Repos to hide | `EXCLUDE` |
| Technology icons | `TECH` |

Screenshots go in `assets/img/work/`. The portrait is `assets/img/aashutosh-cutout.webp` (background removed with rembg). Replace `assets/Aashutosh_Rawate_CV.pdf` to update the resume.

## Run locally

```bash
python -m http.server 5544
```

Then open http://localhost:5544.

## Credits

Tech logos from [Devicon](https://devicon.dev) and [Simple Icons](https://simpleicons.org). UI icons from [Lucide](https://lucide.dev). Smooth scrolling by [Lenis](https://lenis.darkroom.engineering).
