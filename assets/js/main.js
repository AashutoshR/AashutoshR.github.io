(() => {
  "use strict";

  /* ===================== Helpers ===================== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : null);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ago = (iso, short) => {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const u = [["y", "year", 31536000], ["mo", "month", 2592000], ["w", "week", 604800], ["d", "day", 86400], ["h", "hour", 3600], ["m", "minute", 60]];
    for (const [a, b, v] of u) if (s >= v) { const k = Math.floor(s / v); return short ? `${k}${a} ago` : `${k} ${b}${k > 1 ? "s" : ""} ago`; }
    return "just now";
  };
  const COLORS = { cyan: "var(--cyan)", violet: "var(--violet)", emerald: "var(--emerald)" };
  const groupColor = (p) => COLORS[(GROUPS[p.group] || {}).color] || COLORS.cyan;

  /* UI icons (Lucide, ISC licence) */
  const ICONS = {
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-8-2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    hash: '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
    terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
    menu: '<path d="M4 8h16"/><path d="M4 16h16"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    spark: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  };
  const icon = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  const paintIcons = (r = document) => $$("[data-icon]", r).forEach((el) => (el.outerHTML = icon(el.dataset.icon, el.dataset.cls || "")));

  function techIcon(name) {
    const t = TECH[name];
    if (!t) {
      const m = String(name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || "?";
      return `<span class="ti mg" style="--c:#5c6470" title="${esc(name)}" aria-hidden="true">${esc(m)}</span>`;
    }
    if (t.d) return `<img class="ti${t.mono ? " mono" : ""}" src="${DEVICON}${t.d}" alt="" title="${esc(name)}" loading="lazy" decoding="async" width="16" height="16" />`;
    if (t.s) return `<span class="ti si" title="${esc(name)}" style="--c:#${t.c};--u:url('${SIMPLE}${t.s}.svg')" aria-hidden="true"></span>`;
    return `<span class="ti mg" title="${esc(name)}" style="--c:#${t.c}" aria-hidden="true">${esc(t.m)}</span>`;
  }

  /* ===================== Bindings ===================== */
  const LINKS = { github: `https://github.com/${PROFILE.github}`, linkedin: PROFILE.linkedin, mailto: `mailto:${PROFILE.email}`, resume: PROFILE.resume };
  $$("[data-href]").forEach((a) => (a.href = LINKS[a.dataset.href]));
  $$("[data-bind]").forEach((el) => (el.textContent = PROFILE[el.dataset.bind] ?? ""));
  $$(".yr").forEach((el) => (el.textContent = new Date().getFullYear()));
  paintIcons();

  /* ===================== Hero headline ===================== */
  // Static headline lines rise in word by word; the middle line rotates through the three roles.
  let wi = 0;
  $$("#headline .h-line").forEach((line) => {
    line.innerHTML = line.textContent.trim().split(/\s+/).map((w) => `<span class="w" style="--i:${wi++}">${esc(w)}</span>`).join(" ");
  });
  const hero = $("#hero");
  const rots = $$(".rot"), roleItems = $$("#roles li");
  let rIdx = 0, rotTimer = null;
  const showRole = (k) => {
    rots.forEach((r, j) => { r.classList.toggle("on", j === k); r.classList.toggle("out", j !== k && r.classList.contains("on")); });
    roleItems.forEach((li, j) => li.classList.toggle("on", j === k));
    setTimeout(() => rots.forEach((r, j) => j !== k && r.classList.remove("out")), 900);
  };
  let started = false;
  const start = () => {
    if (started) return; started = true;
    requestAnimationFrame(() => hero.classList.add("ready"));
    setTimeout(() => showRole(0), 650);
    if (!reduce) rotTimer = setInterval(() => { rIdx = (rIdx + 1) % rots.length; showRole(rIdx); }, 2800);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
  setTimeout(start, 1200);

  // Section headings: words drift in from a soft blur (no clipping masks)
  $$(".h2").forEach((h) => {
    let i = 0;
    const out = [];
    h.childNodes.forEach((n) => {
      if (n.nodeType === 1 && n.id) { out.push(`<span class="hw" style="--i:${i++}">${n.outerHTML}</span>`); return; }
      if (n.nodeType === 1 && n.tagName === "BR") { out.push("<br />"); return; }
      const cls = n.nodeType === 1 ? ` ${n.className}` : "";
      (n.textContent || "").split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) out.push(" ");
        else out.push(`<span class="hw${cls}" style="--i:${i++}">${esc(w)}</span>`);
      });
    });
    h.innerHTML = out.join("");
    h.classList.add("split");
  });

  /* ===================== Stats + marquee ===================== */
  const stats = [
    { v: 3, s: "+", l: "Years shipping production code" },
    { v: 8000, s: "+", l: "Daily users on systems I built" },
    { v: PROJECTS.length, s: "", l: "Projects, all on this page", id: "statProjects" },
    { v: 45, s: "%", l: "Faster API responses (P50)" },
  ];
  $("#stats").innerHTML = stats.map((s, i) => `<div class="stat rv" style="--d:${i}"><b class="grad"><span class="num"${s.id ? ` id="${s.id}"` : ""} data-to="${s.v}">${s.v.toLocaleString("en-GB")}</span>${esc(s.s)}</b><span>${esc(s.l)}</span></div>`).join("");
  const mq = ["Java", "Spring Boot", "NestJS", "TypeScript", "Python", "PyTorch", "React", "Node.js", "Kafka", "Redis", "PostgreSQL", "Elasticsearch", "Docker", "Kubernetes", "AWS", "FastAPI", "GitHub Actions", "CUDA", "Hugging Face"];
  const mqHtml = mq.map((t) => `<span class="mq">${techIcon(t)}${esc(t)}</span>`).join("");
  $("#marquee").innerHTML = mqHtml + mqHtml;
  const mq2 = ["Angular", "Spring Cloud", "GraphQL", "LangChain", "TensorFlow", "Scikit-learn", "Apache Spark", "Vite", "Tailwind CSS", "MySQL", "SQLite", "Jenkins", "Keycloak", "Linux", "Pandas", "NumPy", "Streamlit", "Git"];
  const mq2Html = mq2.map((t) => `<span class="mq">${techIcon(t)}${esc(t)}</span>`).join("");
  $("#marquee2").innerHTML = mq2Html + mq2Html;

  /* ===================== Projects (bento) ===================== */
  let projects = [];
  let group = "all";
  const featuredFirst = (list) => [...list.filter((p) => p.shot), ...list.filter((p) => !p.shot && p.discovered), ...list.filter((p) => !p.shot && !p.discovered)];
  projects = featuredFirst(PROJECTS.slice());
  const repoUrl = (p) => (p.repo && !p.private ? `https://github.com/${PROFILE.github}/${p.repo}` : null);
  const lead = (p) => p.icon || p.tech[0];
  const art = (p) => `<div class="t-art"><span class="core">${techIcon(lead(p))}</span>${p.tech.filter((t) => t !== lead(p)).slice(0, 3).map((t, k) => `<span class="orb o${k + 1}">${techIcon(t)}</span>`).join("")}</div>`;
  const NUM = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];

  function renderFilters() {
    const counts = projects.reduce((m, p) => ((m[p.group] = (m[p.group] || 0) + 1), m), {});
    $("#filters").innerHTML = [["all", "All work", projects.length], ...Object.keys(GROUPS).filter((g) => counts[g]).map((g) => [g, GROUPS[g].label, counts[g]])]
      .map(([g, label, n]) => `<button type="button" role="tab" data-g="${g}" aria-selected="${group === g}">${esc(label)}<sup>${n}</sup></button>`).join("");
    $("#workCount").textContent = NUM[projects.length] || projects.length;
    const sp = $("#statProjects"); if (sp) { sp.dataset.to = projects.length; sp.textContent = projects.length; }
  }

  function renderBento() {
    const all = group === "all";
    const list = projects.filter((p) => all || p.group === group);
    const smalls = list.filter((p) => !p.shot);
    const rem = smalls.length % 4;
    const bento = $("#bento");
    bento.classList.toggle("all", all);
    bento.innerHTML = list.map((p) => {
      const idx = projects.indexOf(p);
      const big = !!p.shot;
      const si = smalls.indexOf(p);
      let span = "";
      if (all && !big && rem && si >= smalls.length - rem) span = rem === 2 ? " wide" : rem === 1 ? " full" : " third";
      const body = `
        <div class="t-body">
          <h3>${esc(p.title)}${p.discovered ? `<span class="t-new">New</span>` : ""}</h3>
          <p class="t-tag">${esc(p.tagline || "")}</p>
          ${big ? "" : `<p class="t-desc">${esc(p.description || "")}</p>`}
          <div class="t-foot">
            <span class="t-icons">${p.tech.slice(0, big ? 6 : 4).map(techIcon).join("")}</span>
            <span class="t-arrow">${icon("arrowUpRight")}</span>
          </div>
        </div>`;
      return `<article class="tile rv ${big ? "big" : "small"}${span}" data-i="${idx}" style="--c:${groupColor(p)}" tabindex="0" role="button" aria-label="${esc(p.title)}: open project details">
        <div class="t-top"><span class="dom"><i></i>${esc(p.domain || "")}</span><span>${esc(p.year || "")}</span></div>
        ${big ? body + `<div class="t-shot"><div class="bar"><i></i><i></i><i></i></div><img src="${esc(p.shot)}" alt="" loading="lazy" decoding="async" /></div>` : art(p) + body}
      </article>`;
    }).join("");
    observe(bento);
  }

  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    group = b.dataset.g;
    renderFilters(); renderBento();
  });
  const openFromTile = (t) => t && openDrawer(projects[+t.dataset.i], t);
  $("#bento").addEventListener("click", (e) => openFromTile(e.target.closest(".tile")));
  $("#bento").addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("tile")) { e.preventDefault(); openFromTile(e.target); } });

  // Border light that follows the cursor across the whole grid
  const spotlight = (container, sel) => container.addEventListener("pointermove", (e) => {
    $$(sel, container).forEach((t) => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`); });
  });
  if (fine) { spotlight($("#bento"), ".tile"); spotlight($("#cgrid"), ".c-card"); }

  // Gentle 3D tilt on the tile under the cursor
  if (fine && !reduce) {
    const bento = $("#bento");
    bento.addEventListener("pointermove", (e) => {
      const t = e.target.closest(".tile");
      if (!t) return;
      const r = t.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -4, ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
      t.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    bento.addEventListener("pointerout", (e) => { const t = e.target.closest(".tile"); if (t && !t.contains(e.relatedTarget)) t.style.transform = ""; });
  }

  /* Drawer */
  const drawer = $("#drawer"), backdrop = $("#backdrop");
  let lastFocus = null;
  function openDrawer(p, from) {
    if (!p) return;
    lastFocus = from;
    const code = repoUrl(p);
    drawer.style.setProperty("--c", groupColor(p));
    $("#dDom").innerHTML = `<i style="background:${groupColor(p)};box-shadow:0 0 12px ${groupColor(p)}"></i>${esc(p.domain || "")} · ${esc(p.year || "")}`;
    $("#dBody").innerHTML = `
      <div class="d-cover">${p.shot ? `<img src="${esc(p.shot)}" alt="Screenshot of ${esc(p.title)}" />` : art(p)}</div>
      <h3 id="dTitle">${esc(p.title)}</h3>
      <p class="d-tag">${esc(p.tagline || "")}</p>
      <p class="d-desc">${esc(p.description || "")}</p>
      ${p.highlight ? `<div class="d-metric"><span>Key result</span><b>${esc(p.highlight)}</b></div>` : ""}
      <span class="d-label">Built with</span>
      <div class="stack">${p.tech.map((t) => `<span>${techIcon(t)}${esc(t)}</span>`).join("")}</div>
      <div class="d-actions">
        ${p.demo ? `<a class="btn btn-light" href="${esc(p.demo)}" target="_blank" rel="noopener">Open live site ${icon("arrowUpRight")}</a>` : ""}
        ${code ? `<a class="btn btn-ghost" href="${code}" target="_blank" rel="noopener">${icon("github")}View source</a>` : ""}
        ${p.private ? `<span class="note">${icon("lock")} Source is private</span>` : ""}
        ${!p.repo ? `<span class="note">Research project, code not public</span>` : ""}
      </div>`;
    $("#dBody").scrollTop = 0;
    drawer.classList.add("open"); backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden"; lenis && lenis.stop();
    setTimeout(() => $("#dClose").focus(), 60);
  }
  function closeDrawer() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open"); backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = ""; lenis && lenis.start();
    lastFocus && lastFocus.focus({ preventScroll: true });
  }
  $("#dClose").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); setSheet(false); closeK(); } });

  /* ===================== About ===================== */
  const HL = new Set(["trust", "at", "2am:"]);
  $("#statement").innerHTML = PROFILE.statement.split(/\s+/).map((w) => `<span class="sw${HL.has(w) ? " hl" : ""}">${esc(w)}</span>`).join(" ");
  $("#aboutMore").innerHTML = PROFILE.about.slice(0, 2).map((p) => `<p style="margin-bottom:1em">${esc(p)}</p>`).join("");
  const CAPS = [
    { c: "cyan", i: "layers", t: "Full stack engineering", d: "Products from the interface to the database: React and Angular front ends on Spring Boot and NestJS microservices, with Kafka, Redis, Elasticsearch and CI/CD that deploys in minutes.", tech: ["React", "Angular", "TypeScript", "Spring Boot", "NestJS", "PostgreSQL", "Docker"] },
    { c: "violet", i: "cpu", t: "Machine learning engineering", d: "Models that hold up outside the notebook: Whisper fine-tuning, a ViT deepfake detector tested on unseen generators, and Spark and Dask pipelines feeding GPUs efficiently.", tech: ["PyTorch", "TensorFlow", "Scikit-learn", "Hugging Face", "CUDA", "Apache Spark"] },
    { c: "emerald", i: "spark", t: "AI engineering", d: "LLM systems you can check: an inference server built from scratch, retrieval that cites its sources and refuses when it should, and vision-language apps on local or hosted models.", tech: ["LangChain", "FastAPI", "Ollama", "Claude", "Gemini", "Pinecone"] },
  ];
  $("#caps").innerHTML = CAPS.map((c, k) => `<div class="cap rv" style="--c:${COLORS[c.c]};--d:${k}"><span class="cap-ico">${icon(c.i)}</span><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p><div class="icons">${c.tech.map(techIcon).join("")}</div></div>`).join("");

  /* ===================== Experience ===================== */
  const hlNums = (s) => esc(s).replace(/(?<![A-Za-z0-9~.])(\d[\d,.]*\s?(?:%|\+|ms|K|RPS|DAU)?(?:\s?(?:→|to)\s?\d[\d,.]*\s?(?:%|ms|K|s)?)?)(?![A-Za-z])/g, "<b>$1</b>");
  $("#timeline").insertAdjacentHTML("beforeend", EXPERIENCE.map((x) => `
    <div class="job rv">
      <span class="job-period">${esc(x.period)}</span>
      <h3>${esc(x.team)}</h3>
      <p class="org">${esc(x.role)} at <b>${esc(x.company)}</b>, ${esc(x.where)}</p>
      <ul>${x.points.map((p) => `<li>${hlNums(p)}</li>`).join("")}</ul>
      <div class="icons">${x.tech.map(techIcon).join("")}</div>
    </div>`).join(""));
  $("#edu").innerHTML = EDUCATION.map((e) => `<div class="edu-item"><span class="edu-ico">${icon("cap")}</span><div><h4>${esc(e.school)}</h4><p>${esc(e.degree)}, ${esc(e.grade)} · ${esc(e.period)}</p></div></div>`).join("");

  /* ===================== Skills ===================== */
  const skColors = ["cyan", "violet", "emerald"];
  $("#skillGrid").innerHTML = SKILLS.map((g, k) => `<div class="sk rv" style="--c:${COLORS[skColors[k % 3]]};--d:${k % 4}"><h3><i></i>${esc(g.group)}</h3><ul>${g.items.map((t) => `<li>${techIcon(t)}${esc(t)}</li>`).join("")}</ul></div>`).join("");

  /* ===================== Live GitHub terminal ===================== */
  const projByRepo = Object.fromEntries(PROJECTS.filter((p) => p.repo).map((p) => [p.repo.toLowerCase(), p]));
  const excluded = new Set(EXCLUDE.map((e) => e.toLowerCase()));
  const live = { shown: new Set(), synced: 0 };
  const CACHE = "gh-live-v3";
  const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || "null"); } catch (e) { return null; } };
  const writeCache = (d) => { try { localStorage.setItem(CACHE, JSON.stringify(d)); } catch (e) {} };
  async function gh(path, retry = true) {
    const r = await fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json" } });
    // GitHub occasionally returns a transient 422/5xx on busy repos; one quick retry smooths that over.
    if (!r.ok && retry && (r.status === 422 || r.status >= 500)) { await new Promise((ok) => setTimeout(ok, 700)); return gh(path, false); }
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    return r.json();
  }
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

  function renderTerm(data) {
    const commits = (data?.commits || []).slice(0, 8);
    const top = data?.repos?.[0];
    const first = live.shown.size === 0;
    let i = 0;
    const L = (html, cls = "") => `<div class="ln ${cls}" style="--i:${i++}">${html}</div>`;
    const lines = [
      L(`<span class="p">$</span><span class="cmd">whoami</span>`),
      L(`<span class="out">aashutosh-rawate · software engineer · glasgow, uk</span>`),
      `<div class="gap"></div>`,
      L(`<span class="p">$</span><span class="cmd">git log --all-repos --oneline -n ${commits.length || 8}</span>`),
    ];
    if (commits.length) {
      commits.forEach((c) => lines.push(L(`<span class="sha">${esc(c.sha.slice(0, 7))}</span><span class="repo">${esc(c.repo)}</span><a class="msg" href="${esc(safeUrl(c.url) || LINKS.github)}" target="_blank" rel="noopener" title="${esc(c.message)}">${esc(c.message)}</a><span class="when">${ago(c.date, true)}</span>`, `c${!first && !live.shown.has(c.sha) ? " fresh" : ""}`)));
      commits.forEach((c) => live.shown.add(c.sha));
    } else {
      lines.push(L(`<span class="out">GitHub's public API limit was reached for this network. See <a class="msg" href="${LINKS.github}" target="_blank" rel="noopener">github.com/${PROFILE.github}</a></span>`));
    }
    if (top) {
      const p = projByRepo[top.name.toLowerCase()];
      lines.push(`<div class="gap"></div>`);
      lines.push(L(`<span class="p">$</span><span class="cmd">now</span>`));
      lines.push(L(`<span class="out">building <a class="msg" style="color:var(--emerald)" href="${esc(top.html_url)}" target="_blank" rel="noopener">${esc(p ? p.title : top.name)}</a> · last push ${ago(top.pushed_at)}</span>`));
    }
    lines.push(`<div class="gap"></div>`);
    lines.push(L(`<span class="out" style="color:var(--faint)">type <span style="color:var(--cyan)">help</span> below to explore</span>`));
    if (!$("#termLive")) $("#termBody").innerHTML = `<div id="termLive"></div><div id="termUser"></div>`;
    $("#termLive").innerHTML = lines.join("");
    live.data = data;
  }
  const setSync = () => { if (live.synced) $("#sync").textContent = `live · synced ${ago(new Date(live.synced).toISOString())}`; };
  setInterval(setSync, 5000);

  async function loadLive() {
    let data = readCache();
    if (!data || Date.now() - data.t > 3 * 60 * 1000) {
      try { data = await fetchLive(); writeCache(data); } catch (e) { /* rate limited: keep last good copy */ }
    }
    if (data) { discover(data.repos); live.synced = data.t; setSync(); }
    else $("#sync").textContent = "offline";
    renderTerm(data);
  }

  let discovered = false;
  function discover(repos) {
    if (discovered) return;
    discovered = true;
    const known = new Set(PROJECTS.filter((p) => p.repo).map((p) => p.repo.toLowerCase()));
    const fresh = repos.filter((r) => !known.has(r.name.toLowerCase()) && !r.archived).map((r) => ({
      repo: r.name, title: r.name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      tagline: r.description || "Fresh on GitHub", domain: "New project", group: "tools", discovered: true, year: new Date(r.created_at).getFullYear(),
      description: r.description || "A brand new project. Details coming soon.",
      tech: [r.language || "Git"], icon: r.language || "Git", demo: safeUrl(r.homepage) || undefined,
    }));
    if (!fresh.length) return;
    projects = featuredFirst([...fresh, ...projects]);
    renderFilters(); renderBento();
  }

  /* ===================== Hero line animation ===================== */
  (function waves() {
    const cv = $(".hero canvas.lines"), ctx = cv.getContext("2d");
    let w = 0, h = 0, running = false;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const LINES = 16;
    const HOT = { 4: "6,182,212", 9: "139,92,246", 13: "16,185,129" };
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); w = hero.clientWidth; h = hero.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = (now) => {
      const t = now / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.07; mouse.y += (mouse.ty - mouse.y) * 0.07;
      ctx.clearRect(0, 0, w, h);
      const top = h * 0.5, span = h * 0.46;
      for (let i = 0; i < LINES; i++) {
        const y0 = top + (span * i) / (LINES - 1);
        ctx.beginPath();
        ctx.lineWidth = HOT[i] ? 1.4 : 1;
        ctx.strokeStyle = HOT[i] ? `rgba(${HOT[i]},0.55)` : `rgba(156,163,175,${0.05 + (i % 3) * 0.02})`;
        for (let x = -10; x <= w + 10; x += 10) {
          const nx = x / w, env = Math.sin(nx * Math.PI) ** 1.4;
          let y = y0 + Math.sin(nx * 7 + t * 0.55 + i * 0.4) * 10 * env + Math.sin(nx * 19 - t * 0.85 + i) * 3.5 * env + Math.sin(nx * 2.4 + t * 0.22) * 18 * env;
          const dx = x - mouse.x, dy = y0 - mouse.y;
          y += Math.exp(-(dx * dx + dy * dy) / 18000) * 44 * Math.sin(t * 2.4 + i * 0.5 + dx * 0.02);
          x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (running) requestAnimationFrame(draw);
    };
    resize(); addEventListener("resize", resize);
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => (mouse.tx = mouse.ty = -9999));
    if (reduce) draw(0);
    else new IntersectionObserver(([en]) => { const was = running; running = en.isIntersecting; if (running && !was) requestAnimationFrame(draw); }).observe(hero);
  })();

  /* ===================== Reveal + counters ===================== */
  const countUp = (el) => {
    const to = +el.dataset.to;
    if (reduce) return;
    const t0 = performance.now(), dur = 1600;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - (1 - p) ** 4)).toLocaleString("en-GB"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  // Labels decode from random glyphs, like a terminal resolving
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_<>";
  function scramble(el) {
    if (reduce || el.dataset.done) return;
    el.dataset.done = 1;
    const node = [...el.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!node) return;
    const final = node.textContent;
    let frame = 0;
    const total = 22;
    const step = () => {
      const p = frame / total;
      node.textContent = final.split("").map((ch, k) => (ch === " " || k / final.length < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (frame++ < total) requestAnimationFrame(step); else node.textContent = final;
    };
    step();
  }

  const io = new IntersectionObserver((ens) => ens.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    $$(".num", en.target).forEach(countUp);
    $$(".eyebrow", en.target).forEach(scramble);
    $$(".split", en.target).forEach((h) => h.classList.add("in"));
    io.unobserve(en.target);
  }), { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  function observe(r = document) { $$(".rv:not(.in)", r).forEach((el) => io.observe(el)); }

  // Page-wide soft light that follows the cursor
  if (fine && !reduce) {
    const light = $(".cursor-light");
    addEventListener("pointermove", (e) => {
      light.style.setProperty("--cx", `${e.clientX}px`); light.style.setProperty("--cy", `${e.clientY}px`);
      document.documentElement.classList.add("has-light");
    }, { passive: true });
  }

  /* ===================== Scroll-linked effects ===================== */
  const words = $$("#statement .sw");
  const st = $("#statement"), tl = $("#timeline"), fill = $(".tl-fill"), jobs = () => $$(".job"), bar = $(".progress");
  const header = $(".header"), heroWrap = $(".hero-in-wrap");
  const navLinks = $$(".nav a");
  const sections = navLinks.map((a) => $(a.getAttribute("href")));
  let lastY = scrollY, ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    bar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - vh)})`;
    // hero drifts up and fades as you leave it
    if (!reduce && y < vh * 1.2) {
      heroWrap.style.transform = `translateY(${y * 0.22}px) scale(${1 - Math.min(y / vh, 1) * 0.04})`;
      heroWrap.style.opacity = String(clamp(1 - y / (vh * 0.85), 0, 1));
    }
    // statement
    const sr = st.getBoundingClientRect();
    const sp = clamp((vh * 0.85 - sr.top) / (sr.height + vh * 0.3), 0, 1);
    const lit = Math.round(sp * words.length);
    words.forEach((w, k) => w.classList.toggle("lit", k < lit || reduce));
    // timeline
    const tr = tl.getBoundingClientRect();
    fill.style.transform = `scaleY(${clamp((vh * 0.6 - tr.top) / tr.height, 0, 1)})`;
    jobs().forEach((j) => j.classList.toggle("on", j.getBoundingClientRect().top < vh * 0.6));
    // header background + hide on scroll down
    header.classList.toggle("scrolled", y > 40);
    const menuOpen = $("#sheet").classList.contains("open");
    if (!menuOpen) header.classList.toggle("hide", y > 500 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove("hide");
    lastY = y;
    // active nav
    let cur = null;
    sections.forEach((s) => { if (s && s.getBoundingClientRect().top < vh * 0.4) cur = s; });
    navLinks.forEach((a) => a.classList.toggle("active", !!cur && a.getAttribute("href") === `#${cur.id}`));
    movePill();
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", () => requestAnimationFrame(onScroll));

  // Sliding nav indicator
  const nav = $(".nav"), pill = $(".nav-pill");
  let hovered = null;
  function movePill() {
    const target = hovered || $(".nav a.active");
    if (!target) { pill.style.opacity = "0"; return; }
    pill.style.opacity = "1";
    pill.style.width = `${target.offsetWidth}px`;
    pill.style.transform = `translateX(${target.offsetLeft}px)`;
  }
  navLinks.forEach((a) => a.addEventListener("pointerenter", () => { hovered = a; movePill(); }));
  nav.addEventListener("pointerleave", () => { hovered = null; movePill(); });

  /* ===================== Menu sheet ===================== */
  const sheet = $("#sheet"), menuBtn = $(".menu-btn");
  function setSheet(open) {
    sheet.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.innerHTML = icon(open ? "x" : "menu");
    header.classList.remove("hide");
    open ? lenis && lenis.stop() : lenis && lenis.start();
  }
  menuBtn.addEventListener("click", () => setSheet(!sheet.classList.contains("open")));
  $$("#sheet a").forEach((a) => a.addEventListener("click", () => setSheet(false)));

  /* ===================== Magnetic buttons ===================== */
  if (fine && !reduce) $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });

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
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
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
    if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -40, duration: 1.4 });
    else if (target === 0) scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  const goTo = (sel) => { const t = sel === "#top" ? 0 : $(sel); if (t === null) return; if (lenis) lenis.scrollTo(t, { offset: sel === "#top" ? 0 : -40, duration: 1.4 }); else (t === 0 ? scrollTo({ top: 0 }) : t.scrollIntoView()); };
  const findProject = (q) => {
    q = String(q || "").trim().toLowerCase();
    if (!q) return null;
    const n = parseInt(q, 10);
    if (!isNaN(n) && projects[n - 1]) return projects[n - 1];
    return projects.find((p) => p.title.toLowerCase() === q || (p.repo || "").toLowerCase() === q)
      || projects.find((p) => p.title.toLowerCase().includes(q) || (p.repo || "").toLowerCase().includes(q) || (p.domain || "").toLowerCase().includes(q));
  };

  /* ===================== WebGL colour field (hero) ===================== */
  (function shader() {
    const cv = $(".hero canvas.shader");
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return;
    const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fs = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 q=uv*vec2(r.x/r.y,1.);
 vec3 bg=vec3(.051,.059,.071),c1=vec3(.024,.714,.831),c2=vec3(.545,.361,.965),c3=vec3(.063,.725,.506);
 float a=fbm(q*1.5+vec2(t*.045,t*.03));
 float b=fbm(q*2.1-vec2(t*.035,-t*.02)+a*1.4);
 float c=fbm(q*1.2+vec2(-t*.025,t*.018)+b);
 vec3 col=bg;
 col+=c1*smoothstep(.48,.92,a)*.30;
 col+=c2*smoothstep(.50,.95,b)*.30;
 col+=c3*smoothstep(.58,1.,c)*.16;
 vec2 d=(uv-m)*vec2(r.x/r.y,1.);
 col+=mix(c1,c2,uv.x)*.10*exp(-dot(d,d)*7.);
 col=mix(bg,col,smoothstep(0.,.45,uv.y));
 col*=1.-.35*length((uv-.5)*vec2(1.2,.9));
 gl_FragColor=vec4(col,1.);
}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m");
    const mouse = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6 };
    const SCALE = 0.5; // render at half resolution; the field is soft so this is invisible and cheap
    const size = () => { cv.width = Math.max(1, hero.clientWidth * SCALE); cv.height = Math.max(1, hero.clientHeight * SCALE); gl.viewport(0, 0, cv.width, cv.height); };
    size(); addEventListener("resize", size);
    hero.addEventListener("pointermove", (e) => { const b = hero.getBoundingClientRect(); mouse.tx = (e.clientX - b.left) / b.width; mouse.ty = 1 - (e.clientY - b.top) / b.height; });
    let running = false;
    const t0 = performance.now();
    const frame = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, (now - t0) / 1000 + 20); gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running) requestAnimationFrame(frame);
    };
    hero.classList.add("has-gl");
    if (reduce) { frame(performance.now()); return; }
    new IntersectionObserver(([en]) => { const was = running; running = en.isIntersecting && !document.hidden; if (running && !was) requestAnimationFrame(frame); }).observe(hero);
  })();

  /* ===================== Globe: Mumbai to Glasgow ===================== */
  (function globe() {
    const cv = $(".globe");
    if (!cv) return;
    let started = false;
    const go = async () => {
      if (started) return; started = true;
      try {
        const { default: createGlobe } = await import(new URL("assets/vendor/cobe.js", document.baseURI).href);
        let phi = 1.1, drag = null, dragOffset = 0, vel = 0;
        const w = () => cv.offsetWidth * 2;
        createGlobe(cv, {
          devicePixelRatio: 2, width: w(), height: w(), phi, theta: 0.32, dark: 1, diffuse: 1.15,
          mapSamples: 16000, mapBrightness: 5.5, baseColor: [0.16, 0.18, 0.22], markerColor: [0.024, 0.714, 0.831], glowColor: [0.33, 0.27, 0.62],
          markers: [{ location: [19.076, 72.8777], size: 0.09 }, { location: [55.8642, -4.2518], size: 0.09 }],
          onRender: (s) => { if (!drag && !reduce) phi += 0.0035 + vel; vel *= 0.95; s.phi = phi + dragOffset; s.width = w(); s.height = w(); },
        });
        cv.classList.add("ready");
        cv.addEventListener("pointerdown", (e) => { drag = e.clientX - dragOffset * 200; cv.setPointerCapture(e.pointerId); });
        cv.addEventListener("pointerup", () => { drag = null; });
        cv.addEventListener("pointercancel", () => { drag = null; });
        cv.addEventListener("pointermove", (e) => { if (drag !== null) { const d = (e.clientX - drag) / 200; vel = (d - dragOffset) * 0.05; dragOffset = d; } });
      } catch (err) { cv.closest(".globe-card").style.display = "none"; }
    };
    new IntersectionObserver(([en], ob) => { if (en.isIntersecting) { go(); ob.disconnect(); } }, { rootMargin: "300px" }).observe(cv);
  })();

  /* ===================== Tech orbit ===================== */
  (function orbit() {
    const RINGS = [
      { r: 21, c: "var(--cyan)", dur: "48s", dir: "normal", items: ["React", "Angular", "TypeScript", "Spring Boot", "NestJS", "PostgreSQL"] },
      { r: 33, c: "var(--violet)", dur: "70s", dir: "reverse", items: ["PyTorch", "TensorFlow", "Scikit-learn", "Hugging Face", "CUDA", "Apache Spark", "Pandas"] },
      { r: 45, c: "var(--emerald)", dur: "92s", dir: "normal", items: ["LangChain", "Ollama", "Claude", "Gemini", "FastAPI", "Pinecone", "OpenAI", "Docker"] },
    ];
    $("#orbit").innerHTML = RINGS.map((g, k) => `<div class="ring" style="--r:${g.r};--c:${g.c};--dur:${g.dur};--dir:${g.dir}">${g.items.map((t, i) => `<span class="node" title="${esc(t)}" style="--a:${(360 / g.items.length) * i + k * 17}deg;--r:${g.r};--c:${g.c};--dur:${g.dur};--rdir:${g.dir === "normal" ? "reverse" : "normal"}"><span>${techIcon(t)}</span></span>`).join("")}</div>`).join("")
      + `<div class="core"><div><b class="grad">AR</b><small>3 disciplines</small></div></div>`;
  })();

  /* ===================== Interactive terminal ===================== */
  const termForm = $("#termForm"), termCmd = $("#termCmd");
  const hist = []; let hIdx = 0;
  const tline = (html, cls = "") => `<div class="ln typed ${cls}" style="--i:0">${html}</div>`;
  function termPrint(lines) {
    const box = $("#termUser");
    if (!box) return;
    box.insertAdjacentHTML("beforeend", lines.join(""));
    const body = $("#termBody"); body.scrollTop = body.scrollHeight;
  }
  const COMMANDS = {
    help: () => [
      ["whoami", "who I am"], ["projects", "list all projects"], ["open <n|name>", "open a project, e.g. open 1"], ["skills", "what I work with"],
      ["experience", "where I've worked"], ["now", "what I'm building right now"], ["contact", "how to reach me"], ["resume", "open my resume"],
      ["github", "open my GitHub"], ["linkedin", "open my LinkedIn"], ["hire", "the short version"], ["clear", "clear the screen"],
    ].map(([k, d]) => tline(`<span class="k">${esc(k)}</span><span class="out">${esc(d)}</span>`)),
    whoami: () => [tline(`<span class="out">Aashutosh Rawate · Full Stack, Machine Learning &amp; AI Engineer · Glasgow, UK</span>`)],
    projects: () => projects.map((p, i) => tline(`<span class="sha">${String(i + 1).padStart(2, "0")}</span><span class="repo">${esc(p.title)}</span><span class="out">${esc(p.domain || "")}</span>`, "c")).concat([tline(`<span class="out" style="color:var(--faint)">open a project with: open 1</span>`)]),
    open: (arg) => {
      const p = findProject(arg);
      if (!p) return [tline(`<span class="out">no project matches "${esc(arg)}". try: projects</span>`)];
      setTimeout(() => openDrawer(p, termCmd), 250);
      return [tline(`<span class="out">opening ${esc(p.title)}...</span>`, "ok")];
    },
    skills: () => SKILLS.map((g) => tline(`<span class="k">${esc(g.group)}</span><span class="out">${esc(g.items.join(", "))}</span>`)),
    experience: () => EXPERIENCE.map((x) => tline(`<span class="k">${esc(x.period)}</span><span class="out">${esc(x.team)} · ${esc(x.company)}</span>`)).concat(EDUCATION.map((e) => tline(`<span class="k">${esc(e.period)}</span><span class="out">${esc(e.degree)} · ${esc(e.school)}</span>`))),
    now: () => {
      const top = live.data?.repos?.[0];
      return [tline(`<span class="out">${top ? `building <span style="color:var(--emerald)">${esc(projByRepo[top.name.toLowerCase()]?.title || top.name)}</span> · last push ${ago(top.pushed_at)}` : "see github.com/AashutoshR"}</span>`)];
    },
    contact: () => { navigator.clipboard?.writeText(PROFILE.email).catch(() => {}); return [tline(`<span class="k">email</span><span class="out">${esc(PROFILE.email)} (copied)</span>`), tline(`<span class="k">linkedin</span><span class="out">${esc(PROFILE.linkedin)}</span>`), tline(`<span class="k">github</span><span class="out">${esc(LINKS.github)}</span>`)]; },
    resume: () => { open(LINKS.resume, "_blank", "noopener"); return [tline(`<span class="out">opening resume...</span>`, "ok")]; },
    github: () => { open(LINKS.github, "_blank", "noopener"); return [tline(`<span class="out">opening github...</span>`, "ok")]; },
    linkedin: () => { open(LINKS.linkedin, "_blank", "noopener"); return [tline(`<span class="out">opening linkedin...</span>`, "ok")]; },
    hire: () => { setTimeout(() => goTo("#contact"), 900); return [tline(`<span class="out">Full stack, ML and AI in one hire. 3+ years in production, 16 projects, M.Sc. Data Science.</span>`, "ok"), tline(`<span class="out">taking you to contact...</span>`)]; },
    clear: () => { $("#termUser").innerHTML = ""; return []; },
    ls: () => [tline(`<span class="out">work/  about/  experience/  activity/  skills/  contact/</span>`)],
    sudo: () => [tline(`<span class="out">nice try. permission granted only after an interview.</span>`)],
  };
  COMMANDS.email = COMMANDS.contact; COMMANDS.cv = COMMANDS.resume; COMMANDS.cd = (a) => { if (a && $("#" + a.replace(/[^a-z]/gi, ""))) { goTo("#" + a.replace(/[^a-z]/gi, "")); return [tline(`<span class="out">cd ${esc(a)}</span>`, "ok")]; } return COMMANDS.ls(); };
  termForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = termCmd.value.trim();
    termCmd.value = "";
    if (!raw) return;
    hist.push(raw); hIdx = hist.length;
    const [cmd, ...rest] = raw.split(/\s+/);
    const fn = COMMANDS[cmd.toLowerCase()];
    termPrint([tline(`<span class="p">$</span><span class="cmd">${esc(raw)}</span>`, "user")]
      .concat(fn ? fn(rest.join(" ")) : [tline(`<span class="out">command not found: ${esc(cmd)}. type <span style="color:var(--cyan)">help</span></span>`)]));
  });
  termCmd.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hist.length) { hIdx = Math.max(0, hIdx - 1); termCmd.value = hist[hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown" && hist.length) { hIdx = Math.min(hist.length, hIdx + 1); termCmd.value = hist[hIdx] || ""; e.preventDefault(); }
  });
  $("#term").addEventListener("click", (e) => { if (!e.target.closest("a") && !getSelection().toString()) termCmd.focus({ preventScroll: true }); });

  /* ===================== Command menu (Ctrl/Cmd + K) ===================== */
  const kWrap = $("#kWrap"), kInput = $("#kInput"), kList = $("#kList");
  let kItems = [], kActive = 0, kPrev = null;
  const kSource = () => [
    ...[["Work", "#work", "16 projects"], ["About", "#about", "Who I am"], ["Experience", "#experience", "Wipro, 3 years"], ["Activity", "#activity", "Live GitHub"], ["Skills", "#skills", "The toolbox"], ["Contact", "#contact", "Get in touch"], ["Top of page", "#top", "Home"]]
      .map(([l, h, d]) => ({ g: "Go to", label: l, hint: d, ic: icon("hash"), run: () => goTo(h) })),
    ...projects.map((p) => ({ g: "Projects", label: p.title, hint: p.domain || "", ic: techIcon(p.icon || p.tech[0]), run: () => openDrawer(p, $("#kOpen")) })),
    { g: "Actions", label: "Copy email address", hint: PROFILE.email, ic: icon("copy"), run: () => { navigator.clipboard?.writeText(PROFILE.email).then(() => toast("Email copied"), () => toast(PROFILE.email)); } },
    { g: "Actions", label: "Open resume", hint: "PDF", ic: icon("file"), run: () => open(LINKS.resume, "_blank", "noopener") },
    { g: "Actions", label: "GitHub", hint: "@AashutoshR", ic: icon("github"), run: () => open(LINKS.github, "_blank", "noopener") },
    { g: "Actions", label: "LinkedIn", hint: "aashutosh-rawate", ic: icon("linkedin"), run: () => open(LINKS.linkedin, "_blank", "noopener") },
    { g: "Actions", label: "Try the terminal", hint: "type commands", ic: icon("terminal"), run: () => { goTo("#activity"); setTimeout(() => termCmd.focus({ preventScroll: true }), 1400); } },
  ];
  function kRender() {
    const q = kInput.value.trim().toLowerCase();
    kItems = kSource().filter((it) => !q || `${it.label} ${it.hint} ${it.g}`.toLowerCase().includes(q));
    kActive = Math.min(kActive, Math.max(0, kItems.length - 1));
    if (!kItems.length) { kList.innerHTML = `<li class="k-empty">Nothing found for "${esc(q)}"</li>`; return; }
    let lastG = "";
    kList.innerHTML = kItems.map((it, i) => {
      const head = it.g !== lastG ? `<li class="k-group">${esc(it.g)}</li>` : "";
      lastG = it.g;
      return `${head}<li class="k-item${i === kActive ? " active" : ""}" role="option" data-k="${i}" aria-selected="${i === kActive}"><span class="ki">${it.ic}</span><b>${esc(it.label)}</b><small>${esc(it.hint)}</small></li>`;
    }).join("");
    $(".k-item.active", kList)?.scrollIntoView({ block: "nearest" });
  }
  function openK() { kPrev = document.activeElement; setSheet(false); kWrap.hidden = false; kInput.value = ""; kActive = 0; kRender(); lenis && lenis.stop(); kInput.focus(); }
  function closeK() { if (kWrap.hidden) return; kWrap.hidden = true; if (!drawer.classList.contains("open")) lenis && lenis.start(); kPrev && kPrev.focus && kPrev.focus({ preventScroll: true }); }
  const kRun = (i) => { const it = kItems[i]; if (!it) return; closeK(); setTimeout(it.run, 60); };
  kInput.addEventListener("input", () => { kActive = 0; kRender(); });
  kInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { kActive = Math.min(kItems.length - 1, kActive + 1); kRender(); e.preventDefault(); }
    if (e.key === "ArrowUp") { kActive = Math.max(0, kActive - 1); kRender(); e.preventDefault(); }
    if (e.key === "Enter") { kRun(kActive); e.preventDefault(); }
  });
  kList.addEventListener("click", (e) => { const li = e.target.closest(".k-item"); if (li) kRun(+li.dataset.k); });
  kList.addEventListener("pointermove", (e) => { const li = e.target.closest(".k-item"); if (li && +li.dataset.k !== kActive) { kActive = +li.dataset.k; $$(".k-item", kList).forEach((x) => x.classList.toggle("active", +x.dataset.k === kActive)); } });
  $("#kBack").addEventListener("click", closeK);
  $("#kOpen").addEventListener("click", openK);
  $("#kOpen2").addEventListener("click", openK);
  addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "");
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); kWrap.hidden ? openK() : closeK(); }
    else if (e.key === "/" && !typing && kWrap.hidden) { e.preventDefault(); openK(); }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $$("kbd").forEach((k) => (k.textContent = k.textContent.replace("Ctrl", "⌘")));

  /* ===================== Boot ===================== */
  renderFilters(); renderBento();
  observe(); onScroll();
  loadLive();
  setInterval(() => { if (!document.hidden) loadLive(); }, 120 * 1000);
})();
