(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- UI icons (Lucide, ISC licence) ---------- */
  const ICONS = {
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-8-2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    sparkle: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  };
  const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  const paintIcons = (root = document) => $$("[data-icon]", root).forEach((el) => { el.outerHTML = icon(el.dataset.icon); });

  /* ---------- Tech icons ---------- */
  function techIcon(name) {
    const t = TECH[name];
    if (!t) {
      const m = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || "?";
      return `<span class="ti mg" style="--c:#6b6b7b" aria-hidden="true">${esc(m)}</span>`;
    }
    if (t.d) return `<img class="ti${t.mono ? " mono" : ""}" src="${DEVICON}${t.d}" alt="" loading="lazy" decoding="async" width="18" height="18" />`;
    if (t.s) return `<span class="ti si" style="--c:#${t.c};--u:url('${SIMPLE}${t.s}.svg')" aria-hidden="true"></span>`;
    return `<span class="ti mg" style="--c:#${t.c}" aria-hidden="true">${esc(t.m)}</span>`;
  }
  const chip = (name, cls = "") => `<span class="chip ${cls}">${techIcon(name)}${esc(name)}</span>`;

  /* ---------- Bindings ---------- */
  const LINKS = {
    github: `https://github.com/${PROFILE.github}`,
    linkedin: PROFILE.linkedin,
    mailto: `mailto:${PROFILE.email}`,
    resume: PROFILE.resume,
  };
  $$("[data-href]").forEach((a) => (a.href = LINKS[a.dataset.href]));
  $$("[data-bind]").forEach((el) => (el.textContent = PROFILE[el.dataset.bind]));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- About ---------- */
  $("#aboutText").innerHTML = PROFILE.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#stats").innerHTML = PROFILE.stats
    .map((s) => `<div><div class="stat-value"><span class="num" data-to="${s.value}">0</span><span class="suf">${esc(s.suffix)}</span></div><div class="stat-label">${esc(s.label)}</div></div>`)
    .join("");

  function countUp(el) {
    const to = +el.dataset.to;
    const fmt = (n) => n.toLocaleString("en-GB");
    if (reduceMotion) return (el.textContent = fmt(to));
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Experience ---------- */
  const SHOW_POINTS = 4;
  $("#timeline").innerHTML = EXPERIENCE.map((x, i) => {
    const extra = x.points.length > SHOW_POINTS;
    return `<li class="tl-item reveal" data-delay="${Math.min(i, 3)}">
      <article class="card tl-card">
        <div class="tl-head"><h3>${esc(x.role)} · ${esc(x.team)}</h3><span class="tl-period">${esc(x.period)}</span></div>
        <p class="tl-org">${esc(x.company)} · ${esc(x.where)}</p>
        <ul class="tl-points">${x.points.map((p, j) => `<li${j >= SHOW_POINTS ? " hidden" : ""}>${esc(p)}</li>`).join("")}</ul>
        ${extra ? `<button class="tl-more" type="button">Show ${x.points.length - SHOW_POINTS} more ${icon("chevron")}</button>` : ""}
        <div class="chips">${x.tech.map((t) => chip(t, "sm")).join("")}</div>
      </article></li>`;
  }).join("");
  $$(".tl-more").forEach((b) => b.addEventListener("click", () => {
    b.parentElement.querySelectorAll(".tl-points li[hidden]").forEach((li) => (li.hidden = false));
    b.remove();
  }));

  /* ---------- Skills ---------- */
  $("#skillGroups").innerHTML = SKILLS.map((g, i) => `
    <div class="skill-group reveal" data-delay="${Math.min(i, 3)}">
      <h3>${esc(g.group)}</h3>
      <div class="chips">${g.items.map((t) => chip(t)).join("")}</div>
    </div>`).join("");

  /* ---------- Education ---------- */
  $("#eduGrid").innerHTML = EDUCATION.map((e, i) => `
    <article class="card edu reveal" data-delay="${i}">
      <div class="edu-icon">${icon("cap")}</div>
      <div>
        <h3>${esc(e.school)}</h3>
        <p class="deg">${esc(e.degree)} <span class="grade">· ${esc(e.grade)}</span></p>
        <p class="meta">${esc(e.period)} · ${esc(e.where)}</p>
        <p class="note">${esc(e.note)}</p>
      </div>
    </article>`).join("");

  /* ---------- Projects ---------- */
  const KIND = {
    ml: ["#8b7bff", "#3fd0e8"],
    ai: ["#ff7ab6", "#8b7bff"],
    web: ["#3fd0e8", "#4f6bff"],
    data: ["#ffb547", "#ff7ab6"],
    tool: ["#34d399", "#3fd0e8"],
    research: ["#a78bfa", "#ffb547"],
  };
  const KIND_LABEL = { ml: "ML Systems", ai: "AI App", web: "Full Stack", data: "Data", tool: "Tooling", research: "Research" };
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : undefined);
  const FEATURED_COUNT = 6;
  let projects = PROJECTS.map((p, i) => ({ ...p, order: i }));
  const filter = { techs: new Set(), q: "" };
  let showAll = false;

  const timeAgo = (iso) => {
    if (!iso) return "";
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    const u = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [n, v] of u) if (s >= v) { const k = Math.floor(s / v); return `${k} ${n}${k > 1 ? "s" : ""} ago`; }
    return "just now";
  };

  function projectCard(p) {
    const [k1, k2] = KIND[p.kind] || KIND.tool;
    const lead = p.icon || p.tech[0] || "Git";
    const orbit = p.tech.filter((t) => t !== lead).slice(0, 4);
    const repoUrl = p.repo && !p.private ? `https://github.com/${PROFILE.github}/${p.repo}` : null;
    const left = p.private ? `<span class="badge">${icon("lock")}Private repo</span>`
      : !p.repo ? `<span class="badge">${icon("flask")}Research</span>`
      : p.discovered ? `<span class="badge new">${icon("sparkle")}New on GitHub</span>`
      : `<span class="badge">${esc(KIND_LABEL[p.kind] || "Project")}</span>`;
    const right = p.demo ? `<span class="badge live"><span class="pulse" style="width:6px;height:6px"></span>Live</span>` : "";
    const meta = [];
    if (p.stars) meta.push(`<span title="Stars">${icon("star")}${p.stars}</span>`);
    if (p.pushed) meta.push(`<span title="Last push">${icon("clock")}${timeAgo(p.pushed)}</span>`);
    return `<article class="card project reveal" data-title="${esc(p.title)}" style="--k1:${k1};--k2:${k2}">
      <div class="p-art">
        <div class="p-badges">${left}${right}</div>
        <div class="main-icon" title="${esc(lead)}">${techIcon(lead)}</div>
        ${orbit.map((t, i) => `<div class="orbit o${i + 1}" title="${esc(t)}">${techIcon(t)}</div>`).join("")}
      </div>
      <div class="p-body">
        <h3>${esc(p.title)}</h3>
        <p class="p-tag">${esc(p.tagline || "")}</p>
        <p class="p-desc">${esc(p.description || "No description yet.")}</p>
        ${p.highlight ? `<p class="p-hl">${esc(p.highlight)}</p>` : ""}
        <div class="chips p-tech">${p.tech.map((t) => chip(t, "sm")).join("")}</div>
        <div class="p-foot">
          <div class="p-links">
            ${repoUrl ? `<a href="${repoUrl}" target="_blank" rel="noopener">${icon("github")}Code</a>` : ""}
            ${p.demo ? `<a class="demo" href="${esc(p.demo)}" target="_blank" rel="noopener">${icon("external")}Live demo</a>` : ""}
          </div>
          <div class="p-meta">${meta.join("")}</div>
        </div>
      </div>
    </article>`;
  }

  function matches(p) {
    if (filter.techs.size && ![...filter.techs].every((t) => p.tech.includes(t))) return false;
    if (filter.q) {
      const hay = [p.title, p.tagline, p.description, p.highlight, p.repo, ...p.tech].join(" ").toLowerCase();
      if (!filter.q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  function renderFilters() {
    const counts = {};
    projects.forEach((p) => p.tech.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).filter(([, c]) => c >= 2).map(([t]) => t);
    filter.techs.forEach((t) => !top.includes(t) && top.unshift(t));
    $("#techFilters").innerHTML = top.map((t) =>
      `<button type="button" class="chip" data-tech="${esc(t)}" aria-pressed="${filter.techs.has(t)}">${techIcon(t)}${esc(t)} <span class="count">${counts[t] || 0}</span></button>`).join("");
  }

  function renderProjects() {
    const list = projects.filter(matches);
    const active = filter.techs.size || filter.q;
    const visible = active || showAll ? list : list.slice(0, FEATURED_COUNT);
    $("#projectGrid").innerHTML = visible.map(projectCard).join("");
    $("#emptyState").hidden = list.length > 0;
    const btn = $("#toggleAll");
    btn.hidden = active || projects.length <= FEATURED_COUNT;
    btn.innerHTML = showAll ? `Show Featured Only ${icon("arrowRight")}` : `View All ${projects.length} Projects ${icon("arrowRight")}`;
    $("#clearFilters").hidden = !active;
    observeReveals($("#projectGrid"));
    bindCardFx($("#projectGrid"));
  }

  $("#techFilters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tech]");
    if (!b) return;
    const t = b.dataset.tech;
    filter.techs.has(t) ? filter.techs.delete(t) : filter.techs.add(t);
    b.setAttribute("aria-pressed", filter.techs.has(t));
    renderProjects();
  });
  let qTimer;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { filter.q = e.target.value.trim().toLowerCase(); renderProjects(); }, 120);
  });
  $("#clearFilters").addEventListener("click", () => {
    filter.techs.clear(); filter.q = ""; $("#search").value = "";
    renderFilters(); renderProjects();
  });
  $("#toggleAll").addEventListener("click", () => {
    showAll = !showAll;
    renderProjects();
    if (!showAll) $("#projects").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Live GitHub sync ---------- */
  const prettify = (n) => n.replace(/[-_]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());

  async function fetchRepos() {
    const KEY = "gh-repos-v1";
    try {
      const c = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (c && Date.now() - c.t < 10 * 60 * 1000) return c.data;
    } catch (e) {}
    const r = await fetch(`https://api.github.com/users/${PROFILE.github}/repos?per_page=100&sort=pushed`, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(`GitHub API ${r.status}`);
    const data = (await r.json()).map((x) => ({
      name: x.name, description: x.description, language: x.language, topics: x.topics || [],
      stars: x.stargazers_count, pushed: x.pushed_at, fork: x.fork, archived: x.archived, homepage: x.homepage,
    }));
    try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), data })); } catch (e) {}
    return data;
  }

  function renderActivity(repos) {
    const byName = Object.fromEntries(PROJECTS.filter((p) => p.repo).map((p) => [p.repo.toLowerCase(), p]));
    const recent = repos.filter((r) => !EXCLUDE.includes(r.name) && !r.fork).slice(0, 4);
    if (!recent.length) return;
    $("#activity").innerHTML = recent.map((r) => {
      const p = byName[r.name.toLowerCase()];
      const title = p ? p.title : prettify(r.name);
      const lead = p ? p.icon || p.tech[0] : r.language || "Git";
      const desc = (p && p.tagline) || r.description || r.language || "";
      return `<li><span class="dot">${techIcon(lead)}</span><span>Pushed to <strong>${esc(title)}</strong>${desc ? ` · ${esc(desc)}` : ""}<time datetime="${esc(r.pushed)}">${timeAgo(r.pushed)}</time></span></li>`;
    }).join("");
  }

  async function syncGitHub() {
    try {
      const repos = await fetchRepos();
      const map = Object.fromEntries(repos.map((r) => [r.name.toLowerCase(), r]));
      projects.forEach((p) => {
        const r = p.repo && map[p.repo.toLowerCase()];
        if (r) { p.stars = r.stars; p.pushed = r.pushed; if (!p.demo && safeUrl(r.homepage)) p.demo = r.homepage; }
      });
      const known = new Set(PROJECTS.filter((p) => p.repo).map((p) => p.repo.toLowerCase()));
      const fresh = repos
        .filter((r) => !known.has(r.name.toLowerCase()) && !EXCLUDE.map((e) => e.toLowerCase()).includes(r.name.toLowerCase()) && !r.fork && !r.archived)
        .map((r, i) => {
          const tech = [r.language, ...r.topics.map((t) => Object.keys(TECH).find((k) => k.toLowerCase().replace(/[^a-z0-9]/g, "") === t.replace(/-/g, "")))].filter(Boolean);
          return {
            repo: r.name, title: prettify(r.name), tagline: "Fresh from GitHub", kind: "tool", discovered: true,
            description: r.description || "A new project. Details coming soon.", tech: [...new Set(tech.length ? tech : ["Git"])],
            stars: r.stars, pushed: r.pushed, demo: safeUrl(r.homepage), order: -1 - i,
          };
        });
      // Newly created repos lead the list so the portfolio always shows the latest work.
      projects = [...fresh, ...projects.filter((p) => !p.discovered)];
      renderActivity(repos);
    } catch (err) {
      $("#activity").innerHTML = `<li class="muted">Live activity is resting (GitHub rate limit). Showing curated projects.</li>`;
    }
    renderFilters();
    renderProjects();
  }

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
        $$(".num", e.target).forEach(countUp);
      }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  function observeReveals(root = document) {
    $$(".reveal:not(.in)", root).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  }

  /* ---------- Card spotlight + tilt ---------- */
  function bindCardFx(root = document) {
    if (!finePointer) return;
    $$(".card", root).forEach((c) => {
      if (c.dataset.fx) return;
      c.dataset.fx = 1;
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty("--mx", `${x}px`);
        c.style.setProperty("--my", `${y}px`);
        if (c.classList.contains("project") && !reduceMotion) {
          const rx = (y / r.height - 0.5) * -5, ry = (x / r.width - 0.5) * 6;
          c.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        }
      });
      c.addEventListener("pointerleave", () => { if (c.classList.contains("project")) c.style.transform = ""; });
    });
  }

  /* ---------- Typed roles ---------- */
  (function typed() {
    const el = $("#typed");
    const roles = PROFILE.roles;
    if (reduceMotion) return (el.textContent = roles[0]);
    let r = 0, i = 0, del = false;
    const tick = () => {
      const word = roles[r];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      let wait = del ? 35 : 70;
      if (!del && i === word.length) { del = true; wait = 2200; }
      else if (del && i === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 900);
  })();

  /* ---------- Dock: active section + magnification ---------- */
  const dockLinks = $$('.dock a[href^="#"]');
  const sections = dockLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const setActive = () => {
    const y = scrollY + innerHeight * 0.35;
    let cur = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= y) cur = s; });
    if ($("#skills").offsetTop <= y && $("#projects").offsetTop > y) cur = $("#experience");
    dockLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${cur.id}`));
  };
  addEventListener("scroll", setActive, { passive: true });
  setActive();

  if (finePointer && !reduceMotion) {
    const dock = $(".dock");
    const items = $$("a, button", dock);
    dock.addEventListener("mousemove", (e) => {
      items.forEach((it) => {
        const r = it.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const s = Math.max(0, 1 - d / 110);
        const size = 42 + s * 16;
        it.style.width = it.style.height = `${size}px`;
      });
    });
    dock.addEventListener("mouseleave", () => items.forEach((it) => (it.style.width = it.style.height = "")));
  }

  /* ---------- Theme ---------- */
  const themeBtn = $("#themeToggle");
  const paintTheme = () => {
    const dark = document.documentElement.dataset.theme !== "light";
    themeBtn.innerHTML = icon(dark ? "sun" : "moon");
    themeBtn.dataset.tip = dark ? "Light mode" : "Dark mode";
    $('meta[name="theme-color"]').content = dark ? "#08080b" : "#f7f7fa";
  };
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintTheme();
    sky.refresh();
  });

  /* ---------- Copy email ---------- */
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 1800);
  };
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); toast("Email copied to clipboard"); }
    catch (e) { toast(PROFILE.email); }
  });

  /* ---------- Sky: meteor streaks + twinkling stars ---------- */
  const sky = (() => {
    const cv = $("#sky"), ctx = cv.getContext("2d");
    let w, h, dpr, stars = [], meteors = [], rgb = "160,170,255", running = true;
    const readColor = () => (rgb = getComputedStyle(document.documentElement).getPropertyValue("--streak").trim() || rgb);
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + 0.2, p: Math.random() * Math.PI * 2, s: 0.5 + Math.random() * 1.5 }));
    };
    const spawn = () => {
      const len = 80 + Math.random() * 160;
      meteors.push({ x: Math.random() * w * 1.3, y: -40 - Math.random() * h * 0.4, len, v: 2.2 + Math.random() * 3.2, a: 0, life: 0, max: 160 + Math.random() * 140 });
    };
    const ANG = (Math.PI / 180) * 152; // falling down-left like light rain
    const dx = Math.cos(ANG), dy = Math.sin(ANG);
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = 0.25 + 0.35 * Math.sin(t / 1000 * s.s + s.p);
        ctx.fillStyle = `rgba(${rgb},${Math.max(0, a)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      if (meteors.length < 14 && Math.random() < 0.08) spawn();
      meteors = meteors.filter((m) => m.life < m.max && m.y < h + 200 && m.x > -300);
      for (const m of meteors) {
        m.life++; m.x += dx * m.v; m.y += dy * m.v;
        const fade = Math.min(1, m.life / 20) * Math.min(1, (m.max - m.life) / 40);
        const tx = m.x - dx * m.len, ty = m.y - dy * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(${rgb},${0.55 * fade})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.strokeStyle = g; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      }
      if (running) requestAnimationFrame(draw);
    };
    resize(); readColor();
    addEventListener("resize", resize);
    if (reduceMotion) { running = false; draw(0); }
    else {
      for (let i = 0; i < 6; i++) { spawn(); meteors[i].life = Math.random() * 100; meteors[i].y = Math.random() * h; }
      requestAnimationFrame(draw);
      document.addEventListener("visibilitychange", () => {
        const was = running; running = !document.hidden;
        if (running && !was) requestAnimationFrame(draw);
      });
    }
    return { refresh: () => { readColor(); if (!running) draw(0); } };
  })();

  /* ---------- Boot ---------- */
  paintIcons();
  paintTheme();
  renderFilters();
  renderProjects();
  observeReveals();
  bindCardFx();
  // Hero reveals straight away
  requestAnimationFrame(() => $$("#home .reveal").forEach((el) => el.classList.add("in")));
  syncGitHub();
})();
