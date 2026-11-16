// Snapshots public GitHub activity into data/github.json for the portfolio.
// Runs in GitHub Actions (see .github/workflows/github-data.yml). Node 20+, no dependencies.
// Only public repositories are read, so nothing private ever reaches the site.

import { readFile, writeFile, mkdir } from "node:fs/promises";

const LOGIN = process.env.GH_LOGIN || "AashutoshR";
const TOKEN = process.env.GH_TOKEN;
const OUT = new URL("../../data/github.json", import.meta.url);
const SKIP = new Set(["leetcode", `${LOGIN.toLowerCase()}.github.io`]);

if (!TOKEN) throw new Error("GH_TOKEN is not set");

const query = `query($login: String!) {
  user(login: $login) {
    repositories(first: 30, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      nodes {
        name description pushedAt stargazerCount isFork isArchived
        primaryLanguage { name }
        defaultBranchRef { target { ... on Commit {
          history(first: 6) { nodes { oid messageHeadline committedDate url } }
        } } }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": "portfolio-data" },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
});
const json = await res.json();
if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors || json));

const user = json.data.user;
const repos = user.repositories.nodes.filter((r) => !r.isFork && !SKIP.has(r.name.toLowerCase()));
const cal = user.contributionsCollection.contributionCalendar;

const commits = repos
  .flatMap((r) => (r.defaultBranchRef?.target?.history?.nodes || []).map((c) => ({
    repo: r.name, sha: c.oid.slice(0, 7), message: c.messageHeadline, date: c.committedDate, url: c.url,
  })))
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 20);

const days = cal.weeks.flatMap((w) => w.contributionDays.map((d) => [d.date, d.contributionCount]));

const data = {
  login: LOGIN,
  totalContributions: cal.totalContributions,
  publicRepos: user.repositories.totalCount,
  days,
  commits,
  repos: repos.map((r) => ({
    name: r.name, description: r.description, pushedAt: r.pushedAt, stars: r.stargazerCount,
    language: r.primaryLanguage?.name || null, archived: r.isArchived,
  })),
};

// Only write when something changed, so the scheduled job does not create empty commits.
let previous = null;
try { previous = JSON.parse(await readFile(OUT, "utf8")); } catch {}
const strip = (d) => d && JSON.stringify({ ...d, updatedAt: undefined });
if (previous && strip(previous) === strip(data)) {
  console.log("No change in GitHub data.");
} else {
  await mkdir(new URL("../../data/", import.meta.url), { recursive: true });
  await writeFile(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), ...data }, null, 1) + "\n");
  console.log(`Updated: ${commits.length} commits, ${cal.totalContributions} contributions, ${repos.length} repos.`);
}
