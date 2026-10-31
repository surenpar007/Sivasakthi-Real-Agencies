/* Deepavali offer section: project cards from data.js, price count-down, poster viewer, festive lights */
(function () {
  "use strict";
  const sec = document.getElementById("offers"); if (!sec) return;
  const FX = window.SivaFX, D = window.SIVA || {};
  const { reduce, fine, lakh, wa, clamp } = FX;
  const list = Array.isArray(D.projects) ? D.projects : [];
  const grid = document.getElementById("offerGrid");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const maps = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const PIN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>';
  const PH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>';

  grid.innerHTML = list.map((p, i) => {
    const save = p.oldRate - p.rate, pct = Math.round(save / p.oldRate * 100), total = p.rate * p.area;
    const tel = "+91" + p.phone.replace(/\D/g, "");
    return `<article class="oc" style="--i:${i}">
      <button class="oc-poster" type="button" data-poster="${esc(p.poster)}" aria-label="View the ${esc(p.name)} offer poster">
        <img src="assets/img/${esc(p.poster)}.webp" alt="${esc(p.name)} Deepavali offer poster" width="900" height="1125" loading="lazy">
        <span class="oc-shine" aria-hidden="true"></span><span class="oc-zoom">View poster</span>
      </button>
      <div class="oc-body">
        <span class="oc-badge">Limited plots</span>
        <h3>${esc(p.name)}</h3>
        <p class="oc-ta ta" lang="ta">${esc(p.tamil)}</p>
        <p class="oc-loc">${PIN}<span>${esc(p.location)}<small class="ta" lang="ta">${esc(p.tamilLocation)}</small></span></p>
        <div class="oc-price">
          <s>₹${p.oldRate.toLocaleString("en-IN")}</s>
          <b class="oc-rate" data-to="${p.rate}" data-from="${p.oldRate}">₹${p.rate}</b><span>/ sq.ft<small class="ta" lang="ta">ஒரு சதுர அடி</small></span>
        </div>
        <p class="oc-save">Save ₹${save} per sq.ft · ${pct}% off</p>
        <dl class="kv oc-kv"><dt>Total area</dt><dd>${esc(p.areaLabel)}</dd><dt>At offer rate</dt><dd>≈ ${lakh(total)}</dd></dl>
        <div class="oc-acts">
          <a class="btn gold magnetic" href="tel:${tel}">${PH} Call ${esc(p.phone)}</a>
          <a class="btn magnetic" href="${wa(`Hello Sivasakthi Real Agencies, I saw the Deepavali offer for ${p.name}, ${p.location} at ₹${p.rate}/sq.ft. Please share details and site visit timing.`)}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="btn magnetic" href="${maps(p.location)}" target="_blank" rel="noopener">${PIN} Location</a>
        </div>
      </div>
    </article>`;
  }).join("");

  /* price drops from ₹1,000 to the offer rate when the card comes into view */
  const rates = [...grid.querySelectorAll(".oc-rate")];
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, to = +el.dataset.to, from = +el.dataset.from;
    if (reduce) return;
    const t0 = performance.now(), dur = 1600;
    (function step(now) {
      const k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 4);
      el.textContent = "₹" + Math.round(from + (to - from) * e).toLocaleString("en-IN");
      if (k < 1) requestAnimationFrame(step); else el.classList.add("done");
    })(t0);
  }), { threshold: .6 });
  rates.forEach(r => io.observe(r));

  /* 3D tilt on the posters */
  if (fine && !reduce) grid.querySelectorAll(".oc-poster").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      b.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg) translateZ(10px)`; b.style.setProperty("--sx", (x + .5) * 100 + "%"); });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });

  /* poster viewer */
  const box = document.getElementById("posterBox"), boxImg = box && box.querySelector("img");
  grid.addEventListener("click", e => {
    const b = e.target.closest(".oc-poster"); if (!b || !box) return;
    boxImg.src = `assets/img/${b.dataset.poster}.webp`; boxImg.alt = b.getAttribute("aria-label").replace("View the ", "");
    if (box.showModal) { box.showModal(); FX.lenis && FX.lenis.stop(); } else box.setAttribute("open", "");
  });
  if (box) {
    const close = () => { box.close ? box.close() : box.removeAttribute("open"); };
    box.addEventListener("click", e => { if (e.target === box || e.target.closest("[data-close]")) close(); });
    box.addEventListener("close", () => { FX.lenis && FX.lenis.start(); });
  }

  /* festive canvas: rising diya embers + gold firework bursts */
  const cv = document.getElementById("festFx"); if (!cv || reduce) return;
  const ctx = cv.getContext("2d"); let W = 0, H = 0, embers = [], sparks = [], vis = false, next = .8;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  function size() { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    embers = Array.from({ length: Math.round(W * H / 14000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + .6, v: Math.random() * 20 + 10, ph: Math.random() * 6.28 })); }
  size(); addEventListener("resize", size);
  new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(sec);
  function burst() {
    const x = W * (.1 + Math.random() * .8), y = H * (.08 + Math.random() * .3), n = 46, hue = Math.random() < .5 ? [255, 210, 31] : [255, 150, 70];
    for (let i = 0; i < n; i++) { const a = i / n * 6.283, s = 90 + Math.random() * 90; sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: hue }); }
  }
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop); if (!vis || document.hidden) return;
    const dt = Math.min((now - last) / 1000, .05), t = now / 1000; last = now;
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
    for (const m of embers) {
      m.y -= m.v * dt; m.x += Math.sin(t + m.ph) * 10 * dt; if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
      const a = .25 + .35 * Math.sin(t * 2 + m.ph) ** 2, g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
      g.addColorStop(0, `rgba(255,200,90,${a})`); g.addColorStop(1, "rgba(255,140,40,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 5, 0, 6.283); ctx.fill();
    }
    next -= dt; if (next <= 0) { burst(); next = 1.6 + Math.random() * 2.4; }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.vy += 60 * dt; s.vx *= .985; s.vy *= .985; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt * .7;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${s.life.toFixed(3)})`; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * .04, s.y - s.vy * .04); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  })(last);
})();
