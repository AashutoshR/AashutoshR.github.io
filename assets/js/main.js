(() => {
  "use strict";

  /* ===================== Helpers ===================== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : null);
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGsap && !reduce;
  if (!motion) root.classList.add("no-motion");

  const pad2 = (n) => String(n).padStart(2, "0");
  const ago = (iso, short) => {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const units = [["y", "year", 31536000], ["mo", "month", 2592000], ["w", "week", 604800], ["d", "day", 86400], ["h", "hour", 3600], ["m", "minute", 60]];
    for (const [a, b, v] of units) if (s >= v) { const k = Math.floor(s / v); return short ? `${k}${a}` : `${k} ${b}${k > 1 ? "s" : ""} ago`; }
    return short ? "now" : "just now";
  };

  function techIcon(name) {
    const t = TECH[name];
    if (!t) {
      const m = String(name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || "?";
      return `<span class="ti mg" style="--c:#6b675f" aria-hidden="true">${esc(m)}</span>`;
    }
    if (t.d) return `<img class="ti${t.mono ? " mono" : ""}" src="${DEVICON}${t.d}" alt="" loading="lazy" decoding="async" width="16" height="16" />`;
    if (t.s) return `<span class="ti si" style="--c:#${t.c};--u:url('${SIMPLE}${t.s}.svg')" aria-hidden="true"></span>`;
    return `<span class="ti mg" style="--c:#${t.c}" aria-hidden="true">${esc(t.m)}</span>`;
  }
  const chip = (t) => `<span class="chip">${techIcon(t)}${esc(t)}</span>`;

  const KIND = {
    ml: { label: "ML Systems", c: ["#ff4a1c", "#ffb547"] },
    ai: { label: "AI Apps", c: ["#c38bff", "#ff4a1c"] },
    web: { label: "Full Stack", c: ["#4fb8ff", "#8a7dff"] },
    data: { label: "Data", c: ["#ffb547", "#ff6b8b"] },
    tool: { label: "Tooling", c: ["#5fd3a0", "#4fb8ff"] },
    research: { label: "Research", c: ["#9b8cff", "#ffb547"] },
  };
  const kindOf = (p) => KIND[p.kind] || KIND.tool;

  /* ===================== Static bindings ===================== */
  const LINKS = { github: `https://github.com/${PROFILE.github}`, linkedin: PROFILE.linkedin, mailto: `mailto:${PROFILE.email}`, resume: PROFILE.resume };
  $$("[data-href]").forEach((a) => (a.href = LINKS[a.dataset.href]));
  $$("[data-bind]").forEach((el) => (el.textContent = PROFILE[el.dataset.bind] ?? ""));
  $$(".yr").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ===================== Marquee bands ===================== */
  const bandA = ["Distributed systems", "Microservices", "ML systems", "APIs that stay up", "GPU inference", "Retrieval you can audit", "CI/CD in minutes", "Data pipelines"];
  const bandB = ["Java", "Spring Boot", "NestJS", "Python", "PyTorch", "TypeScript", "React", "Kafka", "Redis", "Kubernetes", "Docker", "PostgreSQL", "Elasticsearch", "AWS", "CUDA", "FastAPI"];
  const twice = (html) => html + html;
  $("#bandA").innerHTML = twice(bandA.map((w) => `<span class="band-item">${esc(w)}<span class="star">✳</span></span>`).join(""));
  $("#bandB").innerHTML = twice(bandB.map((w) => `<span class="band-item">${techIcon(w)}${esc(w)}</span>`).join(""));

  /* ===================== About ===================== */
  const st = $(".statement-text");
  st.innerHTML = PROFILE.statement.split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
  $("#facts").innerHTML = PROFILE.stats.map((s) =>
    `<div class="fact"><div class="fact-num"><span class="count" data-to="${s.value}">${s.value.toLocaleString("en-GB")}</span><sup>${esc(s.suffix)}</sup></div><span class="label">${esc(s.label)}</span></div>`).join("");
  $("#aboutText").innerHTML = PROFILE.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#eduList").innerHTML = EDUCATION.map((e) => `
    <div class="edu-item">
      <span class="meta">${esc(e.period)} · ${esc(e.where)}</span>
      <h4>${esc(e.school)}</h4>
      <p>${esc(e.degree)} <span class="grade">(${esc(e.grade)})</span></p>
    </div>`).join("");

  /* ===================== Featured stack ===================== */
  const featured = PROJECTS.filter((p) => p.featured && p.shot);
  const repoUrl = (p) => (p.repo && !p.private ? `https://github.com/${PROFILE.github}/${p.repo}` : null);
  $("#stack").innerHTML = featured.map((p, i) => {
    const k = kindOf(p);
    const code = repoUrl(p);
    const host = p.demo ? new URL(p.demo).host : code ? `github.com/${PROFILE.github}/${p.repo}` : "";
    return `<article class="shot-card" style="--k1:${k.c[0]};--k2:${k.c[1]}">
      <div class="sc-info">
        <div class="sc-top"><span><b>${pad2(i + 1)}</b> / ${pad2(featured.length)}</span><span>${esc(k.label)} · ${esc(p.year || "")}</span></div>
        <h3 class="sc-title">${esc(p.title)}</h3>
        <p class="sc-tag">${esc(p.tagline || "")}</p>
        <p class="sc-desc">${esc(p.description)}</p>
        ${p.highlight ? `<p class="sc-metric">${esc(p.highlight)}</p>` : ""}
        <div class="chips">${p.tech.slice(0, 7).map(chip).join("")}</div>
        <div class="sc-links">
          ${p.demo ? `<a class="btn-line solid" href="${esc(p.demo)}" target="_blank" rel="noopener" data-cursor="Visit">Live site <i class="arrow">↗</i></a>` : ""}
          ${code ? `<a class="btn-line" href="${code}" target="_blank" rel="noopener" data-cursor="Code">Source <i class="arrow">↗</i></a>` : `<span class="btn-line" style="opacity:.6">Private repository</span>`}
        </div>
      </div>
      <a class="sc-media" href="${esc(p.demo || code || "#work")}" target="_blank" rel="noopener" data-cursor="${p.demo ? "Visit" : "Code"}" aria-label="Open ${esc(p.title)}">
        <div class="sc-bar"><i></i><i></i><i></i><span>${esc(host)}</span></div>
        <div class="sc-img"><img src="${esc(p.shot)}" alt="Screenshot of ${esc(p.title)}" loading="lazy" decoding="async" /></div>
      </a>
    </article>`;
  }).join("");

  /* ===================== Archive ===================== */
  let archive = PROJECTS.filter((p) => !(p.featured && p.shot));
  let activeKind = "all";
  const art = (p) => {
    const k = kindOf(p);
    if (p.shot) return `<img src="${esc(p.shot)}" alt="" />`;
    return `<div class="art" style="--k1:${k.c[0]};--k2:${k.c[1]}"><div class="art-logo">${techIcon(p.icon || p.tech[0])}</div><span class="art-name">${esc(p.title)}</span></div>`;
  };

  function renderTabs() {
    const counts = archive.reduce((m, p) => ((m[p.kind] = (m[p.kind] || 0) + 1), m), {});
    const kinds = Object.keys(KIND).filter((k) => counts[k]);
    $("#tabs").innerHTML = [`<button class="tab" role="tab" data-kind="all" aria-selected="${activeKind === "all"}">All<sup>${archive.length}</sup></button>`]
      .concat(kinds.map((k) => `<button class="tab" role="tab" data-kind="${k}" aria-selected="${activeKind === k}">${KIND[k].label}<sup>${counts[k]}</sup></button>`)).join("");
  }
  function renderRows() {
    const list = archive.filter((p) => activeKind === "all" || p.kind === activeKind);
    $("#rows").innerHTML = list.map((p, i) => {
      const code = repoUrl(p);
      return `<li class="row" data-i="${archive.indexOf(p)}">
        <button class="row-head" type="button" aria-expanded="false" data-cursor="Open">
          <span class="r-num">${pad2(i + 1)}</span>
          <span class="r-title">${esc(p.title)}${p.discovered ? `<span class="r-new">New</span>` : ""}</span>
          <span class="r-tag">${esc(p.tagline || "")}</span>
          <span class="r-icons">${p.tech.slice(0, 3).map(techIcon).join("")}</span>
          <span class="r-year">${esc(p.year || "")}</span>
          <span class="r-plus" aria-hidden="true">+</span>
        </button>
        <div class="row-body"><div><div class="rb-inner">
          <span></span>
          <div>
            ${p.highlight ? `<div class="rb-metric">${esc(p.highlight)}</div>` : ""}
            <p>${esc(p.description || "")}</p>
            <div class="sc-links">
              ${p.demo ? `<a class="btn-line solid" href="${esc(p.demo)}" target="_blank" rel="noopener">Live site <i class="arrow">↗</i></a>` : ""}
              ${code ? `<a class="btn-line" href="${code}" target="_blank" rel="noopener">Source <i class="arrow">↗</i></a>` : !p.repo ? `<span class="btn-line" style="opacity:.6">Research project</span>` : ""}
            </div>
          </div>
          <div class="chips">${p.tech.map(chip).join("")}</div>
        </div></div></div>
      </li>`;
    }).join("");
    if (motion) gsap.from("#rows .row", { opacity: 0, y: 24, duration: 0.7, stagger: 0.04, ease: "power3.out", clearProps: "all" });
  }
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    activeKind = b.dataset.kind;
    renderTabs(); renderRows();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  $("#rows").addEventListener("click", (e) => {
    const h = e.target.closest(".row-head");
    if (!h) return;
    const row = h.parentElement;
    const open = !row.classList.contains("open");
    $$("#rows .row.open").forEach((r) => { r.classList.remove("open"); $(".row-head", r).setAttribute("aria-expanded", "false"); });
    row.classList.toggle("open", open);
    h.setAttribute("aria-expanded", open);
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 650);
  });
  renderTabs(); renderRows();

  /* ===================== Experience + toolbox ===================== */
  $("#expList").innerHTML = EXPERIENCE.map((x) => `
    <li class="exp-item">
      <div class="exp-meta"><span><b>●</b> ${esc(x.company)} · ${esc(x.where)}</span><span>${esc(x.period)}</span></div>
      <h3>${esc(x.team)}</h3>
      <h4>${esc(x.role)}</h4>
      <ul class="exp-points">${x.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <div class="chips">${x.tech.map(chip).join("")}</div>
    </li>`).join("");
  $("#toolGrid").innerHTML = SKILLS.map((g) => `
    <div class="tool-cat"><span class="label">${esc(g.group)}</span>
      <ul>${g.items.map((t) => `<li>${techIcon(t)}<span>${esc(t)}</span></li>`).join("")}</ul>
    </div>`).join("");

  /* ===================== Clock ===================== */
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: PROFILE.timezone || "Europe/London", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tick = () => {
    const t = fmt.format(new Date());
    $("#clock").textContent = t;
    $("#clock2").textContent = `${t.slice(0, 5)} in Glasgow`;
  };
  tick(); setInterval(tick, 1000);

  /* ===================== Live GitHub ===================== */
  const projByRepo = Object.fromEntries(PROJECTS.filter((p) => p.repo).map((p) => [p.repo.toLowerCase(), p]));
  const excluded = new Set(EXCLUDE.map((e) => e.toLowerCase()));
  const repoIcon = (name, lang) => { const p = projByRepo[name.toLowerCase()]; return techIcon(p ? p.icon || p.tech[0] : lang || "Git"); };
  const repoTitle = (name) => { const p = projByRepo[name.toLowerCase()]; return p ? p.title : name; };
  const live = { commits: new Map(), shown: new Set(), synced: 0, mode: "", snapshot: null, langs: {} };

  function renderHeat(days) {
    if (!days || !days.length) return;
    const max = Math.max(1, ...days.map((d) => d[1]));
    const offset = new Date(days[0][0] + "T00:00:00Z").getUTCDay();
    const today = new Date().toISOString().slice(0, 10);
    const cells = Array.from({ length: offset }, () => `<i style="visibility:hidden"></i>`);
    for (const [date, n] of days) {
      const l = n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4));
      cells.push(`<i data-l="${l}"${date === today ? ' class="today"' : ""} title="${n} contribution${n === 1 ? "" : "s"} on ${date}"></i>`);
    }
    $("#heat").innerHTML = cells.join("");
    // stats
    let longest = 0, run = 0, best = days[0];
    for (const d of days) { run = d[1] > 0 ? run + 1 : 0; longest = Math.max(longest, run); if (d[1] > best[1]) best = d; }
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) { if (days[i][1] > 0) current++; else if (i === days.length - 1) continue; else break; }
    const active = days.filter((d) => d[1] > 0).length;
    const bestDate = new Date(best[0] + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
    $("#miniStats").innerHTML = [
      [active, "Active days"], [longest, "Longest streak"], [current, "Current streak"], [best[1], `Busiest day, ${bestDate}`],
    ].map(([v, l]) => `<div><b>${v}</b><span class="label">${esc(l)}</span></div>`).join("");
    const heatCells = $$("#heat i");
    if (motion) {
      gsap.from(heatCells, { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: { amount: 1.1, from: "start" }, scrollTrigger: { trigger: "#heat", start: "top 85%", once: true } });
    }
  }

  function setTotal(n) {
    const el = $("#contribTotal");
    if (!motion) return (el.textContent = n);
    const o = { v: 0 };
    gsap.to(o, { v: n, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  }

  function renderFeed() {
    const list = [...live.commits.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
    if (!list.length) return;
    const firstRender = live.shown.size === 0;
    $("#feed").innerHTML = list.map((c) => {
      const fresh = !firstRender && !live.shown.has(c.sha);
      return `<li${fresh ? ' class="fresh"' : ""}>
        <span class="when" title="${esc(new Date(c.date).toLocaleString("en-GB"))}">${ago(c.date, true)}</span>
        <div>
          <span class="repo">${repoIcon(c.repo)}${esc(c.repo)}</span>
          <a class="msg" href="${esc(safeUrl(c.url) || LINKS.github)}" target="_blank" rel="noopener">${esc(c.message)}<span class="sha">${esc(c.sha)}</span></a>
        </div>
      </li>`;
    }).join("");
    list.forEach((c) => live.shown.add(c.sha));
    const top = list[0];
    $("#heroNow").href = safeUrl(top.url) || LINKS.github;
    $("#heroNow").innerHTML = `<span class="now-repo">${repoIcon(top.repo)}${esc(repoTitle(top.repo))} · ${ago(top.date)}</span><span class="now-msg">“${esc(top.message)}”</span>`;
  }

  function addCommits(arr) { arr.forEach((c) => c && c.sha && live.commits.set(c.sha, c)); }

  function setSync() {
    const el = $("#syncState");
    if (!live.synced) return;
    el.textContent = live.mode === "live"
      ? `Live · synced ${ago(new Date(live.synced).toISOString())}`
      : `Snapshot · updated ${ago(new Date(live.synced).toISOString())}`;
  }
  setInterval(setSync, 5000);

  async function loadSnapshot() {
    try {
      const r = await fetch("data/github.json", { cache: "no-cache" });
      if (!r.ok) throw 0;
      const d = await r.json();
      live.snapshot = d;
      renderHeat(d.days);
      setTotal(d.totalContributions || 0);
      addCommits(d.commits || []);
      renderFeed();
      if (!live.mode) { live.mode = "snapshot"; live.synced = new Date(d.updatedAt || Date.now()).getTime(); setSync(); }
    } catch (e) { /* the live API below still works */ }
  }

  async function gh(path) {
    const r = await fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    return r.json();
  }

  async function loadLive() {
    try {
      const repos = (await gh(`/users/${PROFILE.github}/repos?per_page=100&sort=pushed`))
        .filter((r) => !r.fork && !excluded.has(r.name.toLowerCase()));
      discover(repos);
      const top = repos.slice(0, 4);
      const batches = await Promise.all(top.map((r) =>
        gh(`/repos/${PROFILE.github}/${r.name}/commits?per_page=5`).then((cs) => cs.map((c) => ({
          repo: r.name, sha: c.sha.slice(0, 7), message: (c.commit.message || "").split("\n")[0],
          date: c.commit.committer?.date || c.commit.author?.date, url: c.html_url,
        }))).catch(() => [])));
      addCommits(batches.flat());
      live.mode = "live"; live.synced = Date.now();
      renderFeed(); setSync();
    } catch (e) {
      if (!live.mode) $("#syncState").textContent = "GitHub is busy · showing snapshot";
    }
  }

  let discovered = false;
  function discover(repos) {
    if (discovered) return;
    const known = new Set(PROJECTS.filter((p) => p.repo).map((p) => p.repo.toLowerCase()));
    const fresh = repos.filter((r) => !known.has(r.name.toLowerCase()) && !r.archived).map((r) => ({
      repo: r.name, title: r.name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      tagline: "Fresh on GitHub", kind: "tool", discovered: true, year: new Date(r.created_at).getFullYear(),
      description: r.description || "A brand new project. Details coming soon.",
      tech: [r.language || "Git"], icon: r.language || "Git", demo: safeUrl(r.homepage) || undefined,
    }));
    discovered = true;
    if (!fresh.length) return;
    archive = [...fresh, ...archive];
    renderTabs(); renderRows();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  loadSnapshot().then(loadLive);
  setInterval(() => { if (!document.hidden) loadLive(); }, 90 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && Date.now() - live.synced > 60000) loadLive(); });

  /* ===================== Signal canvas (hero) ===================== */
  (function signal() {
    const cv = $(".signal"); const ctx = cv.getContext("2d");
    const hero = $(".hero");
    let w = 0, h = 0, dpr = 1, running = false, t0 = performance.now();
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const LINES = 16;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (now) => {
      const t = (now - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx.clearRect(0, 0, w, h);
      const top = h * 0.2, span = h * 0.62;
      for (let i = 0; i < LINES; i++) {
        const base = top + (span * i) / (LINES - 1);
        const hot = i === 9;
        ctx.beginPath();
        ctx.lineWidth = hot ? 1.4 : 1;
        ctx.strokeStyle = hot ? "rgba(255,74,28,0.55)" : `rgba(18,18,17,${0.05 + (i % 3) * 0.02})`;
        for (let x = -10; x <= w + 10; x += 10) {
          const nx = x / w;
          const env = Math.sin(nx * Math.PI) ** 1.5;
          let y = base
            + Math.sin(nx * 9 + t * 0.7 + i * 0.45) * 10 * env
            + Math.sin(nx * 23 - t * 1.1 + i) * 4 * env
            + Math.sin(nx * 3 + t * 0.3) * 18 * env;
          const dx = x - mouse.x, dy = base - mouse.y;
          const d2 = dx * dx + dy * dy;
          y += Math.exp(-d2 / 14000) * 46 * Math.sin(t * 3 + i * 0.6 + dx * 0.02);
          x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (running) requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", resize);
    hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top; });
    hero.addEventListener("pointerleave", () => { mouse.tx = mouse.ty = -9999; });
    if (reduce) { draw(performance.now()); return; }
    new IntersectionObserver(([en]) => {
      const was = running; running = en.isIntersecting && !document.hidden;
      if (running && !was) requestAnimationFrame(draw);
    }).observe(hero);
  })();

  /* ===================== Cursor, magnetic, previews ===================== */
  if (fine) {
    root.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor-dot"), ring = $(".cursor-ring"), label = $(".cursor-label");
    const hp = $(".hover-preview"), hpi = $(".hp-inner");
    const p = { x: innerWidth / 2, y: innerHeight / 2 }, r = { ...p }, pv = { ...p };
    addEventListener("pointermove", (e) => { p.x = e.clientX; p.y = e.clientY; cur.classList.remove("is-hidden"); }, { passive: true });
    document.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));
    const loop = () => {
      r.x += (p.x - r.x) * 0.18; r.y += (p.y - r.y) * 0.18;
      pv.x += (p.x - pv.x) * 0.1; pv.y += (p.y - pv.y) * 0.1;
      dot.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${r.x}px, ${r.y}px) translate(-50%, -50%)`;
      hp.style.left = `${pv.x}px`; hp.style.top = `${pv.y}px`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("pointerover", (e) => {
      const labelled = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button");
      cur.classList.toggle("has-label", !!labelled);
      cur.classList.toggle("is-link", !!link && !labelled);
      label.textContent = labelled ? labelled.dataset.cursor : "";
      const row = e.target.closest(".row-head");
      if (row && !row.parentElement.classList.contains("open")) {
        const proj = archive[+row.parentElement.dataset.i];
        if (proj && hp.dataset.for !== proj.title) { hpi.innerHTML = art(proj); hp.dataset.for = proj.title; }
        hp.classList.add("on");
      } else hp.classList.remove("on");
    });

    // magnetic
    $$(".magnetic").forEach((el) => {
      const strength = el.classList.contains("badge-spin") ? 0.35 : 0.28;
      el.addEventListener("pointermove", (e) => {
        const b = el.getBoundingClientRect();
        const x = (e.clientX - b.left - b.width / 2) * strength, y = (e.clientY - b.top - b.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 600); });
    });

    // portrait tilt
    const por = $(".portrait");
    por.addEventListener("pointermove", (e) => {
      const b = por.getBoundingClientRect();
      const rx = ((e.clientY - b.top) / b.height - 0.5) * -10, ry = ((e.clientX - b.left) / b.width - 0.5) * 12;
      por.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    por.addEventListener("pointerleave", () => (por.style.transform = ""));
  }

  /* ===================== Header + menu ===================== */
  const header = $(".header");
  const darkZones = () => $$(".work, .contact");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle("scrolled", y > 30);
    const menuOpen = $(".menu").classList.contains("open");
    header.classList.toggle("hide", !menuOpen && y > 700 && y > lastY + 2);
    if (y < lastY - 2) header.classList.remove("hide");
    lastY = y;
    const probe = 40;
    const dark = menuOpen || darkZones().some((z) => { const b = z.getBoundingClientRect(); return b.top <= probe && b.bottom >= probe; });
    header.classList.toggle("on-dark", dark);
    $(".progress span").style.transform = `scaleX(${Math.min(1, y / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menu = $(".menu"), menuBtn = $(".menu-btn");
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", open);
    $("b", menuBtn).textContent = open ? "Close" : "Menu";
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add("open")); lenis && lenis.stop(); }
    else { menu.classList.remove("open"); setTimeout(() => { if (!menu.classList.contains("open")) menu.hidden = true; }, 800); lenis && lenis.start(); }
    onScroll();
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  $$(".menu a[href^='#']").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ===================== Copy email ===================== */
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 1800); };
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); toast("Email copied. Talk soon."); } catch (e) { toast(PROFILE.email); }
  });

  /* ===================== Smooth scroll ===================== */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // marquee reacts to scroll speed
    const anims = () => $$(".band-track").map((el) => el.getAnimations()[0]).filter(Boolean);
    let boost = 0;
    lenis.on("scroll", (l) => { boost = Math.min(5, Math.abs(l.velocity) / 6); });
    gsap.ticker.add(() => { boost *= 0.92; anims().forEach((a) => (a.playbackRate = 1 + boost)); });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    const behavior = reduce ? "auto" : "smooth";
    if (lenis) lenis.scrollTo(target, { duration: 1.5 });
    else if (target === 0) scrollTo({ top: 0, behavior });
    else target.scrollIntoView({ behavior });
  });

  /* ===================== Motion ===================== */
  const loader = $(".loader");
  if (!motion) { loader.style.display = "none"; return; }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  const heroIn = () => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero-title .word", { yPercent: 110, duration: 1.4, stagger: 0.12 })
      .from(".portrait", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4 }, 0.15)
      .from(".portrait img", { scale: 1.5, duration: 1.8 }, 0.15)
      .from(".hero-top > *, .hero-bottom > *", { y: 30, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: "transform,opacity" }, 0.5)
      .from(".header", { y: -30, opacity: 0, duration: 1, clearProps: "transform,opacity" }, 0.5)
      .from(".signal", { opacity: 0, duration: 2 }, 0.3);
    return tl;
  };

  const seen = (() => { try { return sessionStorage.getItem("seen-intro"); } catch (e) { return null; } })();
  gsap.set(".hero-title .word", { yPercent: 110 });
  if (seen) { gsap.set(".hero-title .word", { yPercent: 0 }); heroIn(); }
  else {
    lenis && lenis.stop();
    const count = { v: 0 };
    const tl = gsap.timeline();
    tl.from(".loader-name > *", { yPercent: 100, opacity: 0, duration: 1, stagger: 0.12, ease: "expo.out" })
      .to(count, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => ($("#loaderCount").textContent = String(Math.round(count.v)).padStart(3, "0")) }, 0)
      .to(".loader-bar span", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
      .to(".loader-name, .loader-count, .loader-meta", { yPercent: -30, opacity: 0, duration: 0.6, ease: "power3.in" }, "+=0.1")
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.25")
      .add(() => { gsap.set(".hero-title .word", { yPercent: 0 }); heroIn(); }, "-=0.55")
      .add(() => { loader.style.display = "none"; lenis && lenis.start(); try { sessionStorage.setItem("seen-intro", "1"); } catch (e) {} });
    gsap.set(loader, { clipPath: "inset(0 0 0% 0)", animation: "none" });
  }

  // Hero parallax on scroll
  gsap.to(".hero-title", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".portrait img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".badge-spin svg", { rotate: 360, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 } });

  document.fonts.ready.then(() => {
    // Headings: line mask reveal
    if (window.SplitText) {
      $$(".display, .contact-title .ct-line, .sc-title").forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "ln" });
        gsap.from(split.lines, { yPercent: 105, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    }

    // Statement words light up while scrolling
    gsap.to(".statement-text .w", { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ".statement-text", start: "top 78%", end: "bottom 40%", scrub: 0.6 } });

    // Facts count up
    $$(".fact .count").forEach((el) => {
      const to = +el.dataset.to, o = { v: 0 };
      el.textContent = "0";
      gsap.to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-GB")), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
    gsap.from(".fact, .about-text p, .about-card", { y: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".facts", start: "top 85%" } });

    // Bands slide in
    gsap.from(".band-a", { xPercent: -15, ease: "none", scrollTrigger: { trigger: ".bands", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".band-b", { xPercent: 15, ease: "none", scrollTrigger: { trigger: ".bands", start: "top bottom", end: "bottom top", scrub: true } });

    // Work section rises in
    gsap.from(".work", { borderRadius: "120px 120px 0 0", ease: "none", scrollTrigger: { trigger: ".work", start: "top bottom", end: "top 20%", scrub: true } });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const cards = $$(".shot-card");
      cards.forEach((card, i) => {
        const img = $(".sc-img img", card);
        gsap.fromTo(img, { yPercent: 0 }, { yPercent: -14, ease: "none", scrollTrigger: { trigger: card, start: "top 90%", end: "bottom top", scrub: true } });
        if (i < cards.length - 1) {
          gsap.to(card, { scale: 0.9, filter: "brightness(0.5)", ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 88px", scrub: true } });
        }
      });
    });
    mm.add("(max-width: 900px)", () => {
      $$(".shot-card").forEach((card) => gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } }));
    });

    // Live + experience + toolbox
    gsap.from(".panel", { y: 50, opacity: 0, duration: 1.2, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".live-grid", start: "top 85%" } });
    gsap.to(".exp-progress span", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#expList", start: "top 70%", end: "bottom 70%", scrub: true } });
    $$(".exp-item").forEach((it) => gsap.from(it.children, { y: 30, opacity: 0, duration: 1, stagger: 0.06, ease: "expo.out", scrollTrigger: { trigger: it, start: "top 85%" } }));
    gsap.from(".tool-cat", { y: 40, opacity: 0, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".tool-grid", start: "top 85%" } });
    gsap.from(".tool-cat li", { x: -16, opacity: 0, duration: 0.8, stagger: 0.012, ease: "power3.out", scrollTrigger: { trigger: ".tool-grid", start: "top 80%" } });

    // Contact
    gsap.from(".contact-row, .contact-grid > div", { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".contact-row", start: "top 92%" } });
    gsap.fromTo(".giant", { xPercent: 12 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: true } });

    ScrollTrigger.refresh();
  });
  addEventListener("load", () => ScrollTrigger.refresh());
})();
