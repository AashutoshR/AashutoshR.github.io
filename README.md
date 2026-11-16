# aashutoshr.github.io

Personal portfolio of **Aashutosh Rawate**, software engineer (backend, distributed systems, ML systems).

**Live:** https://aashutoshr.github.io

## Design

Paper and ink with one signal colour (vermilion). Instrument Serif for display type, Geist for text, Geist Mono for labels.

- Intro counter that plays once per visit, then a hero with an animated signal waveform that reacts to the cursor
- Crossing marquee bands that speed up with scroll velocity
- A statement that lights up word by word as you scroll
- Six featured projects as stacked, sticky showcase cards with real screenshots
- An archive list with category filters, cursor-following previews and expandable details
- Custom cursor, magnetic buttons, smooth inertial scrolling (Lenis), GSAP scroll animations
- Respects `prefers-reduced-motion`, works on phones, and stays readable if the CDN scripts fail

## Live GitHub activity

Two layers keep the site current without a rebuild:

1. **In the browser, on every visit:** the page reads the GitHub REST API for the most recently pushed public repos and their latest commits. The hero line "Right now on GitHub" and the commit feed update immediately after you push, and refresh every 90 seconds while the page is open. New public repos appear in the archive with a "New" badge.
2. **GitHub Action every 30 minutes:** [`.github/workflows/github-data.yml`](.github/workflows/github-data.yml) runs [`fetch-github.mjs`](.github/scripts/fetch-github.mjs), which saves the contribution calendar and recent commits to `data/github.json`. This powers the heatmap and is the fallback when the API rate limit is hit. It only commits when the data changed, and only reads public repositories.

## Editing content

Everything lives in [`assets/js/data.js`](assets/js/data.js):

| Section | Variable |
| --- | --- |
| Name, intro, statement, stats, links | `PROFILE` |
| Jobs | `EXPERIENCE` |
| Degrees | `EDUCATION` |
| Toolbox | `SKILLS` |
| Projects (`featured: true` + `shot` = showcase card) | `PROJECTS` |
| Repos to hide | `EXCLUDE` |
| Technology icons | `TECH` |

Screenshots go in `assets/img/work/`. Replace `assets/img/aashutosh.jpg` to change the portrait and `assets/Aashutosh_Rawate_CV.pdf` to change the resume.

## Run locally

```bash
python -m http.server 5544
```

Then open http://localhost:5544.

## Credits

Tech logos from [Devicon](https://devicon.dev) and [Simple Icons](https://simpleicons.org). Animation by [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering).
