/* Sivasakthi Real Agencies — shared behaviour for every page */
(function () {
  "use strict";
  const D = window.SIVA || {};
  const B = D.business || {};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const hasG = typeof gsap !== "undefined";
  const hasST = hasG && typeof ScrollTrigger !== "undefined";
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
  const lakh = n => n >= 1e7 ? "₹" + (n / 1e7).toFixed(2) + " Cr" : "₹" + (n / 1e5).toFixed(2) + " L";
  const wa = text => `https://wa.me/${B.whatsapp || ""}?text=${encodeURIComponent(text)}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* shared helpers for the other scripts */
  window.SivaFX = { reduce, fine, clamp, lerp, smooth, lakh, inr, wa, makeRain };

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && typeof Lenis !== "undefined") {
    try {
      lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      if (hasG) { gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
      else { const r = t => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
      if (hasST) lenis.on("scroll", ScrollTrigger.update);
    } catch (e) { lenis = null; }
  }
  window.SivaFX.lenis = lenis;
  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
    const el = document.getElementById(url.hash.slice(1));
    if (!el) return;
    e.preventDefault(); closeMenu(); scrollToEl(el);
  });
  if (location.hash.length > 1) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => scrollToEl(el), 400);
  }

  /* ---------- nav + mobile menu ---------- */
  const nav = $("#nav");
  const onScroll = () => nav && nav.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const burger = $("#burger"), menu = $("#menu");
  function closeMenu() {
    if (!menu || !menu.classList.contains("open")) return;
    menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open"); lenis && lenis.start();
  }
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = !menu.classList.contains("open");
      menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
      if (open) { lenis && lenis.stop(); setTimeout(() => { const f = $("a", menu); f && f.focus(); }, 300); }
      else lenis && lenis.start();
    });
    addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); burger.focus(); } });
    $$("a", menu).forEach(a => a.addEventListener("click", closeMenu));
  }

  /* ---------- loader (home page, once per visit) ---------- */
  const loader = $("#loader");
  function intro() {
    if (!hasG || reduce) return;
    gsap.from(".intro-line > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: .09 });
    gsap.from(".intro-fade", { y: 24, opacity: 0, duration: 1, ease: "power3.out", delay: .3, stagger: .1 });
  }
  if (loader) {
    let seen = false;
    try { seen = sessionStorage.getItem("siva-intro") === "1"; sessionStorage.setItem("siva-intro", "1"); } catch (e) {}
    if (hasG && !reduce && !seen) {
      const cells = $("#cells");
      const cols = innerWidth < 700 ? 8 : 16, rows = innerWidth < 700 ? 12 : 9;
      cells.style.setProperty("--cols", cols); cells.style.setProperty("--rows", rows);
      for (let i = 0; i < cols * rows; i++) cells.appendChild(document.createElement("i"));
      const o = { v: 0 };
      gsap.timeline()
        .to(o, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => { $("#lcount").textContent = String(Math.round(o.v)).padStart(3, "0"); $("#lbar").style.width = o.v + "%"; } })
        .to(".loader .mark", { opacity: 0, y: -12, duration: .35 })
        .to(".loader .cells i", { scale: 0, duration: .55, ease: "power2.in", stagger: { each: .006, from: "random" } }, "-=.05")
        .add(() => { loader.remove(); intro(); }, "-=.35");
    } else { loader.remove(); intro(); }
  } else intro();

  /* ---------- buy / sell toggle ---------- */
  const mode = $("#mode");
  if (mode) {
    const modeText = $("#modeText"), modeCta = $("#modeCta");
    $$("button", mode).forEach(b => b.addEventListener("click", () => {
      const sell = b.dataset.mode === "sell";
      mode.classList.toggle("sell", sell);
      $$("button", mode).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      modeText.textContent = sell
        ? "Tell us about your plot, farm land or house. We value it, check the papers and bring you serious buyers."
        : "DTCP and RERA approved plots, farm land and houses in and around Villupuram. Every document is checked before you visit.";
      modeCta.firstChild.textContent = sell ? "Sell my land " : "Explore land ";
      modeCta.setAttribute("href", sell ? "sell.html" : "properties.html");
    }));
  }

  /* ---------- listings ---------- */
  const pin = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>';
  const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>';
  const grid = $("#grid");
  if (grid && Array.isArray(D.properties)) {
    const limit = +grid.dataset.limit || 0;
    let list = D.properties.slice();
    if (grid.dataset.featured) list = list.filter(p => p.featured);
    if (limit) list = list.slice(0, limit);
    grid.innerHTML = list.map(p => `<article class="card${p.offer ? " offer" : ""}" data-t="${esc(p.type)}">
  <div class="art"><img src="assets/img/${esc(p.img)}.webp" alt="${esc(p.name)}, ${esc(p.location)}" loading="lazy" decoding="async" width="960" height="540"><span class="shadeb"></span>${p.real ? "" : '<span class="sample">Sample</span>'}<span class="tag">${esc(p.tag)}</span></div>
  <div class="body"><span class="pid">REF ${esc(p.id)}</span><h3>${esc(p.name)}</h3><div class="loc">${pin}${esc(p.location)}</div>
   <div class="specs">${(p.specs || []).map(s => `<b style="font-weight:400">${s[0] ? `<span>${esc(s[0])} </span>` : ""}${esc(s[1])}</b>`).join("")}</div>
   <div class="foot"><div class="price">${p.rate ? `<s>₹${p.oldRate.toLocaleString("en-IN")}</s> ₹${p.rate}<small>/sq.ft</small><span class="tot">≈ ${lakh(p.price)} total</span>` : lakh(p.price)}</div>
   <a class="enq" href="${wa(`Hello Sivasakthi Real Agencies, I am interested in ${p.name}, ${p.location} (ref ${p.id}). Please share details.`)}" target="_blank" rel="noopener" aria-label="Enquire about ${esc(p.name)} on WhatsApp">${waIcon}Enquire</a></div></div>
  <span class="glare"></span></article>`).join("") + '<p class="empty" hidden>No listings in this category right now. Call us and we will tell you what is coming up.</p>';
    const note = $("#sampleNote"); if (note) note.hidden = !D.showSampleNote || !list.some(p => !p.real);

    const btns = $$(".filters button");
    function applyFilter(f, animate) {
      if (!btns.some(b => b.dataset.f === f)) f = "all";
      btns.forEach(x => x.setAttribute("aria-pressed", String(x.dataset.f === f)));
      const cards = $$(".card", grid);
      cards.forEach(c => c.classList.toggle("hide", f !== "all" && c.dataset.t !== f));
      const shown = cards.filter(c => !c.classList.contains("hide"));
      $(".empty", grid).hidden = shown.length > 0;
      if (animate && hasG && !reduce) gsap.fromTo(shown, { y: 30, rotateX: -8 }, { y: 0, rotateX: 0, duration: .7, ease: "power3.out", stagger: .06, clearProps: "transform" });
    }
    btns.forEach(b => b.addEventListener("click", () => {
      applyFilter(b.dataset.f, true);
      try { history.replaceState(null, "", b.dataset.f === "all" ? location.pathname : "?type=" + b.dataset.f); } catch (e) {}
    }));
    const q = new URLSearchParams(location.search).get("type");
    if (q) applyFilter(q, false);

    if (fine && !reduce) $$(".card", grid).forEach(c => {
      c.addEventListener("pointermove", e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = `rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 8}deg)`;
        c.style.setProperty("--gx", x * 100 + "%"); c.style.setProperty("--gy", y * 100 + "%");
      });
      c.addEventListener("pointerleave", () => { c.style.transform = ""; });
    });
  }

  /* ---------- cursor + magnetic buttons ---------- */
  const cur = $("#cursor");
  if (cur && fine && !reduce) {
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() { cx = lerp(cx, tx, .2); cy = lerp(cy, ty, .2); cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", e => cur.classList.toggle("big", !!e.target.closest("a,button,.card,#plot3d,summary")));
    $$(".magnetic").forEach(b => {
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  } else if (cur) cur.remove();

  /* ---------- count-up ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, to = +el.dataset.count, suf = el.dataset.suffix;
    const set = v => { el.innerHTML = Math.round(v).toLocaleString("en-IN") + (suf ? `<sup>${suf}</sup>` : ""); };
    if (!hasG || reduce) return set(to);
    const o = { v: 0 }; gsap.to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => set(o.v) });
  }), { threshold: .4 });
  $$("[data-count]").forEach(el => io.observe(el));

  /* ---------- reveals (transform only, text stays readable) ---------- */
  if (hasST && !reduce) {
    $$(".head h2, .steps li, .emi, .closing h2, .docs-list li, .c-tile, .faq details, .teaser").forEach(el =>
      gsap.from(el, { y: 50, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%" } }));
    if ($(".marquee div")) gsap.to(".marquee div", { xPercent: -8, ease: "none", scrollTrigger: { trigger: ".closing", scrub: true } });
  }

  /* ---------- sell form → WhatsApp ---------- */
  const form = $("#sellForm");
  if (form) {
    const err = $("#fErr"), msg = $("#fMsg");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const n = $("#f-name").value.trim(), ph = $("#f-phone").value.replace(/\D/g, "");
      if (!n) { err.textContent = "Enter your name so we know who to call."; $("#f-name").focus(); return; }
      if (ph.length < 10) { err.textContent = "Enter a 10-digit phone number."; $("#f-phone").focus(); return; }
      err.textContent = "";
      const text = `Hello Sivasakthi Real Agencies, I want to sell my property.\nName: ${n}\nPhone: ${ph}\nType: ${$("#f-type").value}\nArea: ${$("#f-area").value.trim() || "-"}`;
      const url = wa(text);
      msg.innerHTML = `Thanks, ${esc(n)}. <a class="wa-link" href="${url}" target="_blank" rel="noopener">Send these details on WhatsApp</a>`;
      const w = window.open(url, "_blank", "noopener");
      if (!w) msg.querySelector("a").focus();
    });
    ["f-name", "f-phone"].forEach(id => $("#" + id).addEventListener("input", () => { err.textContent = ""; }));
  }

  /* ---------- copy phone ---------- */
  $$("[data-copy]").forEach(btn => btn.addEventListener("click", () => {
    const t = btn.dataset.copy, out = $("#" + btn.dataset.out);
    const done = ok => { if (out) out.textContent = ok ? `Copied ${t}` : `Phone: ${t}`; };
    if (navigator.clipboard) navigator.clipboard.writeText(t.replace(/\s/g, "")).then(() => done(true), () => done(false)); else done(false);
  }));

  /* ---------- EMI ---------- */
  const rA = $("#rAmt"), rR = $("#rRate"), rY = $("#rYrs");
  if (rA && rR && rY) {
    const emi = () => {
      const P = +rA.value, ann = +rR.value, n = +rY.value * 12, r = ann / 1200;
      const E = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1), tot = E * n, int = tot - P;
      $("#oAmt").textContent = lakh(P); $("#oRate").textContent = ann.toFixed(2) + "%"; $("#oYrs").textContent = rY.value + " years";
      $("#emiVal").innerHTML = inr(E) + " <small>/ month</small>";
      $("#ePrin").textContent = lakh(P); $("#eInt").textContent = lakh(int); $("#eTot").textContent = lakh(tot);
      $("#ringArc").setAttribute("stroke-dashoffset", (251.3 * (int / tot)).toFixed(1));
      [rA, rR, rY].forEach(s => s.style.setProperty("--fill", ((s.value - s.min) / (s.max - s.min) * 100) + "%"));
    };
    [rA, rR, rY].forEach(s => s.addEventListener("input", emi)); emi();
  }

  /* ---------- inner page hero: parallax + light rain ---------- */
  const ph = $(".page-hero");
  if (ph) {
    const bg = $(".bg", ph), cv = $("canvas", ph);
    const rain = cv && !reduce ? makeRain(cv, { density: innerWidth < 700 ? 5200 : 2600, len: 18, speed: 900 }) : null;
    let last = performance.now(), vis = true;
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(ph);
    (function f(now) {
      requestAnimationFrame(f); const dt = Math.min((now - last) / 1000, .05); last = now;
      if (!vis || document.hidden) return;
      const r = ph.getBoundingClientRect(); const k = clamp(-r.top / r.height, 0, 1);
      if (!reduce) bg.style.transform = `translate3d(0,${(k * 14).toFixed(2)}%,0) scale(${(1.04 + k * .06).toFixed(3)})`;
      rain && rain(dt, .55);
    })(last);
  }

  /* ---------- rain renderer (used by hero.js too) ---------- */
  function makeRain(cv, opts) {
    const ctx = cv.getContext("2d"); let W = 0, H = 0, drops = [], splash = [];
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    function nd(init) { const z = Math.random(); return { x: Math.random() * W * 1.2 - W * .1, y: init ? Math.random() * H : -40 - Math.random() * H * .3, z, l: (opts.len || 22) * (.5 + z), v: (opts.speed || 900) * (.55 + z * .7) }; }
    function size() {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.round((W * H) / (opts.density || 1800)) }, () => nd(true));
    }
    size(); addEventListener("resize", size);
    return function draw(dt, intensity) {
      ctx.clearRect(0, 0, W, H); if (intensity <= .01) return;
      const wind = opts.wind ?? -.18; ctx.lineCap = "round";
      for (const d of drops) {
        d.y += d.v * dt; d.x += d.v * dt * wind;
        if (d.y > H + d.l) { if (opts.splash && Math.random() < .35) splash.push({ x: d.x, y: H * (.62 + Math.random() * .38), t: 0 }); Object.assign(d, nd(false)); }
        ctx.strokeStyle = `rgba(210,222,240,${(.12 + d.z * .38) * intensity})`; ctx.lineWidth = .6 + d.z * .9;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.l * wind, d.y - d.l); ctx.stroke();
      }
      if (opts.splash) for (let i = splash.length - 1; i >= 0; i--) {
        const s = splash[i]; s.t += dt * 3.2; if (s.t > 1) { splash.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(220,230,245,${(1 - s.t) * .45 * intensity})`; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.ellipse(s.x, s.y, 2 + s.t * 9, .8 + s.t * 2.4, 0, 0, Math.PI * 2); ctx.stroke();
      }
    };
  }

  /* year */
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
})();

/* floating Deepavali offer pill (every page) */
(function () {
  const pill = document.getElementById("offerPill"); if (!pill) return;
  let hidden = false; try { hidden = sessionStorage.getItem("siva-offer-x") === "1"; } catch (e) {}
  const offers = document.getElementById("offers");
  if (offers) pill.setAttribute("href", "#offers");
  if (hidden) return;
  setTimeout(() => { pill.hidden = false; requestAnimationFrame(() => pill.classList.add("show")); }, 2600);
  pill.querySelector(".op-x").addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); pill.classList.remove("show"); setTimeout(() => { pill.hidden = true; }, 400); try { sessionStorage.setItem("siva-offer-x", "1"); } catch (er) {} });
  if (offers) new IntersectionObserver(es => pill.classList.toggle("away", es[0].isIntersecting)).observe(offers);
})();
