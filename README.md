# aashutoshr.github.io

Personal portfolio of **Aashutosh Rawate**, software engineer (backend, distributed systems, ML systems).

**Live:** https://aashutoshr.github.io

## What it does

- Hero, about, experience timeline, skills, projects, education and contact, with a floating dock for navigation
- Projects sync live with the GitHub API: star counts and last-push times update on every visit, and any new public repo appears automatically with a "New on GitHub" badge
- "Recently on GitHub" card shows the latest pushes
- Filter projects by technology or search by keyword
- Dark and light themes, animated meteor sky, reduced-motion support, works on phones

No build step: plain HTML, CSS and JavaScript, served by GitHub Pages.

## Editing content

Everything you might want to change lives in [`assets/js/data.js`](assets/js/data.js):

| Section | Variable |
| --- | --- |
| Name, roles, summary, stats, links | `PROFILE` |
| Jobs | `EXPERIENCE` |
| Degrees | `EDUCATION` |
| Skill chips | `SKILLS` |
| Project cards (order = featured order) | `PROJECTS` |
| Repos to hide | `EXCLUDE` |
| Technology icons | `TECH` |

To use a photo instead of the monogram, add `assets/profile.jpg` and change the `src` of the `.avatar` image in `index.html`.

To replace the resume, overwrite `assets/Aashutosh_Rawate_CV.pdf`.

## Run locally

```bash
python -m http.server 5544
```

Then open http://localhost:5544.

## Credits

Tech logos from [Devicon](https://devicon.dev) and [Simple Icons](https://simpleicons.org). UI icons from [Lucide](https://lucide.dev).
