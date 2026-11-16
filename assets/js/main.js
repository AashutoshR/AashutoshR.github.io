(() => {
  "use strict";

  /* ===================== Helpers ===================== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : null);
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ago = (iso, short) => {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const u = [["y", "year", 31536000], ["mo", "month", 2592000], ["w", "week", 604800], ["d", "day", 86400], ["h", "hour", 3600], ["m", "minute", 60]];
    for (const [a, b, v] of u) if (s >= v) { const k = Math.floor(s / v); return short ? `${k}${a} ago` : `${k} ${b}${k > 1 ? "s" : ""} ago`; }
    return "just now";
  };

  /* UI icons (Lucide, ISC licence) */
  const ICONS = {
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-8-2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  };
  const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  const paintIcons = (r = document) => $$("[data-icon]", r).forEach((el) => (el.outerHTML = icon(el.dataset.icon)));

  function techIcon(name) {
    const t = TECH[name];
    if (!t) {
      const m = String(name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || "?";
      return `<span class="ti mg" style="--c:#5c6470" aria-hidden="true">${esc(m)}</span>`;
    }
    if (t.d) return `<img class="ti${t.mono ? " mono" : ""}" src="${DEVICON}${t.d}" alt="" loading="lazy" decoding="async" width="16" height="16" />`;
    if (t.s) return `<span class="ti si" style="--c:#${t.c};--u:url('${SIMPLE}${t.s}.svg')" aria-hidden="true"></span>`;
    return `<span class="ti mg" style="--c:#${t.c}" aria-hidden="true">${esc(t.m)}</span>`;
  }
  const chip = (t) => `<span class="chip">${techIcon(t)}${esc(t)}</span>`;

  const KIND = { ml: "ML Systems", ai: "AI Apps", web: "Full Stack", data: "Data", tool: "Tooling", research: "Research" };

  /* ===================== Bindings ===================== */
  const LINKS = { github: `https://github.com/${PROFILE.github}`, linkedin: PROFILE.linkedin, mailto: `mailto:${PROFILE.email}`, resume: PROFILE.resume };
  $$("[data-href]").forEach((a) => (a.href = LINKS[a.dataset.href]));
  $$("[data-bind]").forEach((el) => (el.textContent = PROFILE[el.dataset.bind] ?? ""));
  $$(".yr").forEach((el) => (el.textContent = new Date().getFullYear()));
  paintIcons();

  /* ===================== Logo strip ===================== */
  const stripTech = ["Java", "Spring Boot", "NestJS", "TypeScript", "Python", "PyTorch", "React", "Node.js", "Kafka", "Redis", "PostgreSQL", "Elasticsearch", "Docker", "Kubernetes", "AWS", "FastAPI", "GitHub Actions", "CUDA"];
  const strip = stripTech.map((t) => `<span class="strip-item">${techIcon(t)}${esc(t)}</span>`).join("");
  $("#strip").innerHTML = strip + strip;

  /* ===================== About ===================== */
  $("#aboutText").innerHTML = PROFILE.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#stats").innerHTML = PROFILE.stats.map((s, i) =>
    `<div class="card stat rv" style="--d:${i}"><b><span class="num" data-to="${s.value}">${s.value.toLocaleString("en-GB")}</span><em>${esc(s.suffix)}</em></b><span>${esc(s.label)}</span></div>`).join("");
  $("#edu").innerHTML = EDUCATION.map((e, i) => `
    <div class="card edu-card rv" style="--d:${i + 2}">
      <span class="edu-ico">${icon("cap")}</span>
      <div><h4>${esc(e.school)}</h4><p>${esc(e.degree)} (${esc(e.grade)})</p><p>${esc(e.period)}</p></div>
    </div>`).join("");

  /* ===================== Experience ===================== */
  const SHOW = 4;
  $("#timeline").innerHTML = EXPERIENCE.map((x) => `
    <li class="job rv">
      <div class="job-when">${esc(x.period)}<b>${esc(x.company)}, ${esc(x.where)}</b></div>
      <article class="card job-card">
        <h3>${esc(x.team)}</h3>
        <p class="role">${esc(x.role)}</p>
        <ul class="job-points">${x.points.map((p, j) => `<li${j >= SHOW ? " hidden" : ""}>${esc(p)}</li>`).join("")}</ul>
        ${x.points.length > SHOW ? `<button class="more-btn" type="button">Show ${x.points.length - SHOW} more ${icon("chevron")}</button>` : ""}
        <div class="chips">${x.tech.map(chip).join("")}</div>
      </article>
    </li>`).join("");
  $$(".more-btn").forEach((b) => b.addEventListener("click", () => {
    $$(".job-points li[hidden]", b.parentElement).forEach((li) => (li.hidden = false));
    b.remove();
  }));

  /* ===================== Skills ===================== */
  $("#skillsGrid").innerHTML = SKILLS.map((g, i) => `
    <div class="card skill rv" style="--d:${i % 2}"><h3>${esc(g.group)}</h3><div class="chips">${g.items.map(chip).join("")}</div></div>`).join("");

  /* ===================== Projects ===================== */
  let projects = PROJECTS.slice();
  let kind = "all";
  const repoUrl = (p) => (p.repo && !p.private ? `https://github.com/${PROFILE.github}/${p.repo}` : null);
  const cover = (p, big) => p.shot
    ? `<img src="${esc(p.shot)}" alt="Screenshot of ${esc(p.title)}" loading="lazy" decoding="async" />`
    : `<div class="gen"><div class="gen-main">${techIcon(p.icon || p.tech[0])}</div>${big ? "" : `<div class="gen-side">${p.tech.filter((t) => t !== (p.icon || p.tech[0])).slice(0, 3).map((t) => `<span>${techIcon(t)}</span>`).join("")}</div>`}</div>`;

  function renderTabs() {
    const counts = projects.reduce((m, p) => ((m[p.kind] = (m[p.kind] || 0) + 1), m), {});
    $("#tabs").innerHTML = [["all", "All", projects.length], ...Object.keys(KIND).filter((k) => counts[k]).map((k) => [k, KIND[k], counts[k]])]
      .map(([k, label, n]) => `<button class="tab" role="tab" type="button" data-kind="${k}" aria-selected="${kind === k}">${label}<small>${n}</small></button>`).join("");
    $("#countBadge").textContent = projects.length;
    $("#projCount").textContent = projects.length;
  }

  function renderGrid() {
    const list = projects.filter((p) => kind === "all" || p.kind === kind);
    $("#grid").innerHTML = list.map((p) => {
      const i = projects.indexOf(p);
      const code = repoUrl(p);
      const more = p.tech.length - 4;
      return `<article class="card p-card rv" data-i="${i}">
        <div class="p-cover">
          <div class="p-badges">
            <span class="badge${p.discovered ? " new" : ""}">${p.discovered ? "New" : esc(KIND[p.kind] || "Project")}</span>
            ${p.demo ? `<span class="badge live">${icon("globe")}Live</span>` : p.private ? `<span class="badge">${icon("lock")}Private</span>` : ""}
          </div>
          ${cover(p)}
        </div>
        <div class="p-body">
          <div class="p-title"><h3>${esc(p.title)}</h3><span>${esc(p.year || "")}</span></div>
          <p class="p-tag">${esc(p.tagline || "")}</p>
          <p class="p-desc">${esc(p.description || "")}</p>
          <div class="chips">${p.tech.slice(0, 4).map(chip).join("")}${more > 0 ? `<span class="chip more">+${more}</span>` : ""}</div>
          <div class="p-foot">
            <button class="details" type="button" data-open="${i}">View details ${icon("arrowRight")}</button>
            <div class="p-links">
              ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.title)} live site">${icon("external")}</a>` : ""}
              ${code ? `<a href="${code}" target="_blank" rel="noopener" aria-label="${esc(p.title)} source on GitHub">${icon("github")}</a>` : ""}
            </div>
          </div>
        </div>
      </article>`;
    }).join("");
    $("#empty").hidden = list.length > 0;
    observe($("#grid"));
  }

  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    kind = b.dataset.kind;
    renderTabs(); renderGrid();
  });
  $("#grid").addEventListener("click", (e) => {
    if (e.target.closest(".p-links a")) return;
    const card = e.target.closest(".p-card");
    if (card) openDrawer(projects[+card.dataset.i], card);
  });

  /* Drawer */
  const drawer = $("#drawer"), backdrop = $("#backdrop");
  let lastFocus = null;
  function openDrawer(p, from) {
    if (!p) return;
    lastFocus = from;
    const code = repoUrl(p);
    $("#dKind").textContent = `${KIND[p.kind] || "Project"} · ${p.year || ""}`;
    $("#dBody").innerHTML = `
      <div class="d-cover">${cover(p, true)}</div>
      <h3 id="dTitle">${esc(p.title)}</h3>
      <p class="d-tag">${esc(p.tagline || "")}</p>
      <p class="d-desc">${esc(p.description || "")}</p>
      ${p.highlight ? `<div class="d-metric"><span>Key result</span><b>${esc(p.highlight)}</b></div>` : ""}
      <span class="d-label">Built with</span>
      <div class="chips">${p.tech.map(chip).join("")}</div>
      <div class="d-actions">
        ${p.demo ? `<a class="btn btn-accent" href="${esc(p.demo)}" target="_blank" rel="noopener">${icon("external")}Open live site</a>` : ""}
        ${code ? `<a class="btn btn-outline" href="${code}" target="_blank" rel="noopener">${icon("github")}View source</a>` : ""}
        ${p.private ? `<span class="btn btn-outline" aria-disabled="true">${icon("lock")}Private repository</span>` : ""}
        ${!p.repo ? `<span class="btn btn-outline" aria-disabled="true">Research project, no public repo</span>` : ""}
      </div>`;
    $("#dBody").scrollTop = 0;
    drawer.classList.add("open"); backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    root.style.overflow = "hidden"; lenis && lenis.stop();
    setTimeout(() => $("#dClose").focus(), 50);
  }
  function closeDrawer() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open"); backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    root.style.overflow = ""; lenis && lenis.start();
    lastFocus && $(".details", lastFocus)?.focus({ preventScroll: true });
  }
  $("#dClose").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); setSheet(false); } });

  /* ===================== Live GitHub activity ===================== */
  const projByRepo = Object.fromEntries(PROJECTS.filter((p) => p.repo).map((p) => [p.repo.toLowerCase(), p]));
  const excluded = new Set(EXCLUDE.map((e) => e.toLowerCase()));
  const repoIcon = (name, lang) => { const p = projByRepo[name.toLowerCase()]; return techIcon(p ? p.icon || p.tech[0] : lang || "Git"); };
  const repoTitle = (name) => projByRepo[name.toLowerCase()]?.title || name;
  const live = { shown: new Set(), synced: 0, repos: [] };

  async function gh(path) {
    const r = await fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    return r.json();
  }

  function renderActivity(repos, commits) {
    // currently building
    const top = repos[0];
    if (top) {
      const p = projByRepo[top.name.toLowerCase()];
      $("#bIco").innerHTML = repoIcon(top.name, top.language);
      $("#bTitle").textContent = p ? p.title : top.name;
      $("#bDesc").textContent = (p && p.description) || top.description || "A project in progress.";
      $("#bMeta").textContent = `Last push ${ago(top.pushed_at)} · ${top.language || "Code"}`;
      $("#bLink").href = top.html_url;
    }
    // feed
    const list = commits.slice(0, 8);
    if (!list.length) return;
    const first = live.shown.size === 0;
    $("#feed").innerHTML = list.map((c) => `
      <li${!first && !live.shown.has(c.sha) ? ' class="fresh"' : ""}>
        <span class="f-ico">${repoIcon(c.repo)}</span>
        <div><span class="f-repo">${esc(c.repo)}</span><a class="f-msg" href="${esc(safeUrl(c.url) || LINKS.github)}" target="_blank" rel="noopener" title="${esc(c.message)}">${esc(c.message)}</a></div>
        <time datetime="${esc(c.date)}">${ago(c.date, true)}</time>
      </li>`).join("");
    list.forEach((c) => live.shown.add(c.sha));
    // hero card
    const c = list[0];
    $("#commitCard").href = safeUrl(c.url) || LINKS.github;
    $("#ccRepo").innerHTML = `${repoIcon(c.repo)}${esc(repoTitle(c.repo))}`;
    $("#ccMsg").textContent = c.message;
    $("#ccWhen").textContent = ago(c.date);
  }

  const setSync = () => { if (live.synced) $("#syncState").textContent = `Live from GitHub · synced ${ago(new Date(live.synced).toISOString())}`; };
  setInterval(setSync, 5000);

  // Results are cached for 3 minutes so reloads and tab hopping do not burn GitHub's 60 requests/hour limit.
  const CACHE = "gh-live-v3";
  const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || "null"); } catch (e) { return null; } };
  const writeCache = (d) => { try { localStorage.setItem(CACHE, JSON.stringify(d)); } catch (e) {} };

  async function fetchLive() {
    const repos = (await gh(`/users/${PROFILE.github}/repos?per_page=100&sort=pushed`))
      .filter((r) => !r.fork && !excluded.has(r.name.toLowerCase()))
      .map((r) => ({ name: r.name, description: r.description, language: r.language, pushed_at: r.pushed_at, created_at: r.created_at, html_url: r.html_url, homepage: r.homepage, archived: r.archived }));
    const batches = await Promise.all(repos.slice(0, 4).map((r) =>
      gh(`/repos/${PROFILE.github}/${r.name}/commits?per_page=5`).then((cs) => cs.map((c) => ({
        repo: r.name, sha: c.sha, message: (c.commit.message || "").split("\n")[0],
        date: c.commit.committer?.date || c.commit.author?.date, url: c.html_url,
      }))).catch(() => [])));
    return { t: Date.now(), repos, commits: batches.flat().sort((a, b) => b.date.localeCompare(a.date)) };
  }

  async function loadLive() {
    let data = readCache();
    if (!data || Date.now() - data.t > 3 * 60 * 1000) {
      try { data = await fetchLive(); writeCache(data); }
      catch (e) { /* rate limited or offline: fall back to the last good copy below */ }
    }
    if (data) {
      discover(data.repos);
      renderActivity(data.repos, data.commits);
      live.synced = data.t; setSync();
      return;
    }
    $("#syncState").textContent = "GitHub is taking a break";
    $("#feed").innerHTML = `<li class="feed-note">GitHub's public API limit was reached for this network. <a class="link" href="${LINKS.github}" target="_blank" rel="noopener">See my activity on GitHub ${icon("arrowRight")}</a></li>`;
    $("#ccRepo").textContent = "github.com/AashutoshR";
    $("#ccMsg").textContent = "See my latest commits on GitHub";
    $("#ccWhen").textContent = "";
    $("#bTitle").textContent = "See it on GitHub";
    $("#bDesc").textContent = "My most recent work is always on my GitHub profile.";
  }

  let discovered = false;
  function discover(repos) {
    if (discovered) return;
    discovered = true;
    const known = new Set(PROJECTS.filter((p) => p.repo).map((p) => p.repo.toLowerCase()));
    const fresh = repos.filter((r) => !known.has(r.name.toLowerCase()) && !r.archived).map((r) => ({
      repo: r.name, title: r.name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      tagline: "Fresh on GitHub", kind: "tool", discovered: true, year: new Date(r.created_at).getFullYear(),
      description: r.description || "A brand new project. Details coming soon.",
      tech: [r.language || "Git"], icon: r.language || "Git", demo: safeUrl(r.homepage) || undefined,
    }));
    if (!fresh.length) return;
    projects = [...fresh, ...projects];
    renderTabs(); renderGrid();
  }

  /* ===================== Hero line animation ===================== */
  (() => {
    const cv = $(".waves"), ctx = cv.getContext("2d"), hero = $(".hero");
    let w = 0, h = 0, running = false, base = "156,163,175", accent = "#06b6d4";
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const LINES = 14;
    const colors = () => { const cs = getComputedStyle(root); base = cs.getPropertyValue("--wave").trim() || base; accent = cs.getPropertyValue("--accent").trim() || accent; };
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); w = hero.clientWidth; h = hero.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = (now) => {
      const t = now / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.07; mouse.y += (mouse.ty - mouse.y) * 0.07;
      ctx.clearRect(0, 0, w, h);
      const top = h * 0.28, span = h * 0.6;
      for (let i = 0; i < LINES; i++) {
        const y0 = top + (span * i) / (LINES - 1);
        const hot = i === 8;
        ctx.beginPath();
        ctx.lineWidth = hot ? 1.3 : 1;
        if (hot) { ctx.strokeStyle = accent; ctx.globalAlpha = 0.45; } else { ctx.strokeStyle = `rgba(${base},${0.07 + (i % 3) * 0.025})`; ctx.globalAlpha = 1; }
        for (let x = -10; x <= w + 10; x += 10) {
          const nx = x / w, env = Math.sin(nx * Math.PI) ** 1.4;
          let y = y0 + Math.sin(nx * 8 + t * 0.6 + i * 0.42) * 9 * env + Math.sin(nx * 21 - t * 0.9 + i) * 3.5 * env + Math.sin(nx * 2.6 + t * 0.25) * 16 * env;
          const dx = x - mouse.x, dy = y0 - mouse.y;
          y += Math.exp(-(dx * dx + dy * dy) / 16000) * 40 * Math.sin(t * 2.6 + i * 0.55 + dx * 0.02);
          x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (running) requestAnimationFrame(draw);
    };
    colors(); resize();
    addEventListener("resize", resize);
    hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top; });
    hero.addEventListener("pointerleave", () => (mouse.tx = mouse.ty = -9999));
    if (reduce) draw(0);
    else new IntersectionObserver(([en]) => { const was = running; running = en.isIntersecting; if (running && !was) requestAnimationFrame(draw); }).observe(hero);
  })();

  /* ===================== Reveal + counters ===================== */
  const countUp = (el) => {
    const to = +el.dataset.to;
    if (reduce) return;
    const t0 = performance.now(), dur = 1400;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - (1 - p) ** 4)).toLocaleString("en-GB"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((ens) => ens.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    $$(".num", en.target).forEach(countUp);
    io.unobserve(en.target);
  }), { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  function observe(r = document) { $$(".rv:not(.in)", r).forEach((el) => io.observe(el)); }

  /* ===================== Header, nav, sheet ===================== */
  const header = $(".header");
  const navLinks = $$('.nav a[href^="#"]');
  const sections = navLinks.map((a) => $(a.getAttribute("href")));
  const onScroll = () => {
    header.classList.toggle("scrolled", scrollY > 10);
    const y = scrollY + innerHeight * 0.3;
    let cur = null;
    sections.forEach((s) => { if (s && s.offsetTop <= y) cur = s; });
    navLinks.forEach((a) => a.classList.toggle("active", cur && a.getAttribute("href") === `#${cur.id}`));
  };
  addEventListener("scroll", onScroll, { passive: true });

  const sheet = $("#sheet"), menuBtn = $(".menu-btn");
  function setSheet(open) {
    sheet.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.innerHTML = icon(open ? "x" : "menu");
    if (open) header.classList.add("scrolled"); else onScroll();
  }
  menuBtn.addEventListener("click", () => setSheet(!sheet.classList.contains("open")));
  $$("#sheet a").forEach((a) => a.addEventListener("click", () => setSheet(false)));

  /* ===================== Clock + copy ===================== */
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: PROFILE.timezone || "Europe/London", hour: "2-digit", minute: "2-digit" });
  const tick = () => ($("#clock").textContent = fmt.format(new Date()));
  tick(); setInterval(tick, 15000);
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 1800); };
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); toast("Email copied"); } catch (e) { toast(PROFILE.email); }
  });

  /* ===================== Smooth scroll ===================== */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -70, duration: 1.2 });
    else if (target === 0) scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  /* ===================== Boot ===================== */
  renderTabs(); renderGrid();
  observe(); onScroll();
  requestAnimationFrame(() => $$(".hero .rv").forEach((el) => el.classList.add("in")));
  loadLive();
  setInterval(() => { if (!document.hidden) loadLive(); }, 120 * 1000);
})();
