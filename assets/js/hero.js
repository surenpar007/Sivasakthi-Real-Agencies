/* Home page motion:
   hero  — arrive at sunset → drone rises → survey a corner plot → camera tilts straight down to the plan
   built — scroll-driven callouts over the finished road
   plus the "why land" rain band and the documents parallax */
(function () {
  "use strict";
  const FX = window.SivaFX; if (!FX) return;
  const { reduce, clamp, lerp, smooth, makeRain } = FX;
  const D = window.SIVA || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";

  const hero = $("#hero"); if (!hero) return;
  const stage = $(".stage", hero);
  const lG = $("#lGround"), lA = $("#lAerial"), lT = $("#lTop");
  const sun = $("#sunGlow");
  const bound = $("#plotC"), bfill = $("#plotCfill"), pins = $$("#survey .pin"), dims = $("#survey .dims"), cTag = $("#cTag");
  const scan = $("#scan"), flash = $("#flash");
  const BL = bound.getTotalLength(); bound.style.strokeDasharray = BL; bound.style.strokeDashoffset = BL;

  /* plan rectangles from data.js */
  const planG = $("#heroPlan .plan-plots"), planLabels = $("#heroPlan .plan-labels"), compass = $("#heroPlan .compass2");
  const rects = ((D.plan && D.plan.plots) || []).map((p, i) => {
    const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", p.x + 4); r.setAttribute("y", p.y + 4); r.setAttribute("width", p.w - 8); r.setAttribute("height", p.h - 8);
    r.setAttribute("class", "pp st-" + p.status);
    const L = 2 * (p.w + p.h - 16); r.style.strokeDasharray = L; r.style.strokeDashoffset = L; r.dataset.len = L;
    r.dataset.d = ((i % 5) * .05 + Math.floor(i / 5) * .06).toFixed(3);
    planG.appendChild(r); return r;
  });

  /* fit each 16:9 layer like object-fit: cover, with its own focal point on tall phone screens */
  function fitFrame(fr, box) {
    const W = box.clientWidth * 1.1, H = box.clientHeight * 1.1;
    const portrait = W / H < 1.2;
    const s = Math.max(W / 1280, H / 720), fw = 1280 * s, fh = 720 * s;
    const fx = +(portrait ? fr.dataset.px : fr.dataset.fx), fy = +(portrait ? fr.dataset.py : fr.dataset.fy);
    Object.assign(fr.style, { width: fw + "px", height: fh + "px", left: clamp(W / 2 - fx * s, W - fw, 0) + "px", top: clamp(H / 2 - fy * s, H - fh, 0) + "px" });
  }
  const fit = () => $$(".frame", hero).forEach(f => fitFrame(f, stage));
  fit(); addEventListener("resize", fit);

  /* golden dust in the sunset light */
  const dustCv = $("#dust"), dctx = dustCv.getContext("2d");
  let DW = 0, DH = 0, motes = [];
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  function dustSize() {
    DW = dustCv.clientWidth; DH = dustCv.clientHeight; dustCv.width = DW * dpr; dustCv.height = DH * dpr; dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    motes = Array.from({ length: Math.round(DW * DH / 9000) }, () => ({ x: Math.random() * DW, y: Math.random() * DH, r: Math.random() * 1.8 + .4, v: Math.random() * 14 + 6, ph: Math.random() * 6.28, z: Math.random() }));
  }
  dustSize(); addEventListener("resize", dustSize);
  function dust(dt, t, k) {
    dctx.clearRect(0, 0, DW, DH); if (k <= .01) return;
    for (const m of motes) {
      m.y -= m.v * dt * (.6 + m.z); m.x += Math.sin(t * .6 + m.ph) * 8 * dt;
      if (m.y < -10) { m.y = DH + 10; m.x = Math.random() * DW; }
      const a = (.25 + .55 * m.z) * (.6 + .4 * Math.sin(t * 2 + m.ph)) * k;
      dctx.fillStyle = `rgba(255,214,140,${a.toFixed(3)})`;
      dctx.beginPath(); dctx.arc(m.x, m.y, m.r * (1 + m.z), 0, 6.283); dctx.fill();
    }
  }

  /* "Built before you buy" */
  const built = $("#built"), bStage = built && $(".built-stage", built), bMedia = built && $(".built-media", built);
  const bFrame = built && $(".frame", built), cos = built ? $$(".co", built) : [];
  let builtVis = false;
  if (built) {
    const bfit = () => { const W = bMedia.clientWidth, H = bMedia.clientHeight, s = Math.max(W / 1280, H / 720), fw = 1280 * s, fh = 720 * s;
      Object.assign(bFrame.style, { width: fw + "px", height: fh + "px", left: clamp(W / 2 - 700 * s, W - fw, 0) + "px", top: clamp(H / 2 - 400 * s, H - fh, 0) + "px" }); };
    bfit(); addEventListener("resize", bfit);
    new IntersectionObserver(e => { builtVis = e[0].isIntersecting; }).observe(built);
    if (reduce) cos.forEach(c => c.classList.add("on"));
  }

  /* "Why land" band + documents image */
  const band = $(".inside"), bandBg = $("#insideBg"), rain2Cv = $("#rain2");
  const rain2 = rain2Cv && !reduce ? makeRain(rain2Cv, { density: 2600, len: 14, speed: 520, wind: -.05 }) : null;
  let bandVis = false; if (band) new IntersectionObserver(e => { bandVis = e[0].isIntersecting; }).observe(band);
  const docsImg = $(".docs-img img");

  let pS = 0, bS = 0, mx = 0, my = 0, mxS = 0, myS = 0, last = performance.now();
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  const phases = $$(".phase", hero).map(el => { const [a, b] = el.dataset.range.split(",").map(Number); return { el, a, b }; });
  const dots = $$(".progress span", hero), tView = $("#tView"), tAlt = $("#tAlt");
  let heroVis = true; new IntersectionObserver(e => { heroVis = e[0].isIntersecting; }).observe(hero);
  const progOf = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  const t0 = performance.now();

  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (document.hidden) return;
    const t = (now - t0) / 1000;
    mxS = lerp(mxS, mx, .05); myS = lerp(myS, my, .05);

    if (bandVis && band) {
      rain2 && rain2(dt, .7);
      const r = band.getBoundingClientRect(), k = clamp(1 - (r.top + r.height) / (innerHeight + r.height), 0, 1);
      if (!reduce) bandBg.style.transform = `translate3d(0,${(k - .5) * -10}%,0)`;
    }
    if (docsImg && !reduce) {
      const r = docsImg.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) docsImg.style.transform = `scale(1.12) translate3d(0,${(((r.top + r.height / 2) / innerHeight - .5) * -6).toFixed(2)}%,0)`;
    }
    if (builtVis && !reduce) {
      const b = bS = lerp(bS, progOf(built), .1);
      bMedia.style.transform = `scale(${lerp(1.14, 1, smooth(0, .9, b)).toFixed(4)}) translate3d(${(-mxS * 14).toFixed(1)}px,${(-myS * 10).toFixed(1)}px,0)`;
      cos.forEach((c, i) => c.classList.toggle("on", b > .1 + i * .13));
    }
    if (!heroVis) return;

    const p = pS = reduce ? progOf(hero) : lerp(pS, progOf(hero), .085);
    const rise = smooth(.16, .34, p);       // ground → aerial
    const survey = smooth(.38, .52, p);     // corner plot boundary
    const pitch = smooth(.6, .78, p);       // aerial → straight down
    const draw = smooth(.76, .92, p);       // plan outlines
    const intro = reduce ? 1 : smooth(0, 2.4, t);

    /* 1 · ground */
    if (p < .4) {
      const gs = lerp(1.18, 1, intro) * lerp(1, 1.2, smooth(0, .2, p)) * lerp(1, 1.5, rise);
      lG.style.transform = `translate3d(${(-mxS * 22).toFixed(2)}px,${(-myS * 14 + rise * 60).toFixed(2)}px,0) scale(${gs.toFixed(4)})`;
      lG.style.filter = rise > .01 ? `blur(${(rise * 6).toFixed(2)}px)` : "none";
      sun.setAttribute("r", (210 + Math.sin(t * 1.4) * 14).toFixed(1));
    }
    lG.style.opacity = (1 - smooth(.2, .32, p)).toFixed(3);
    lG.style.visibility = p > .34 ? "hidden" : "visible";

    /* 2–3 · aerial: tilts down from the horizon, then lifts away as the camera pitches */
    const tilt = lerp(32, 0, rise), as = lerp(1.32, 1.04, rise) * lerp(1, 1.55, pitch);
    lA.style.opacity = (smooth(.18, .3, p) * (1 - smooth(.62, .74, p))).toFixed(3);
    lA.style.visibility = p < .16 || p > .76 ? "hidden" : "visible";
    lA.style.transform = `perspective(1400px) translate3d(${(-mxS * 16).toFixed(2)}px,${(-myS * 10 - lerp(80, 0, rise) - pitch * 120).toFixed(2)}px,0) rotateX(${(tilt - pitch * 18).toFixed(2)}deg) scale(${as.toFixed(4)})`;
    lA.style.filter = pitch > .01 ? `blur(${(pitch * 5).toFixed(2)}px)` : "none";
    flash.style.opacity = (Math.sin(clamp((p - .2) / .14, 0, 1) * Math.PI) * .35 + Math.sin(clamp((p - .62) / .14, 0, 1) * Math.PI) * .18).toFixed(3);

    bound.style.strokeDashoffset = (BL * (1 - survey)).toFixed(2);
    bfill.style.opacity = (smooth(.48, .56, p) * .32).toFixed(3);
    dims.style.opacity = smooth(.5, .56, p).toFixed(3);
    pins.forEach((g, i) => { const k = smooth(.38 + i * .03, .44 + i * .03, p); g.style.opacity = k.toFixed(3); g.style.transform = `translateY(${((1 - k) * -14).toFixed(1)}px)`; });
    cTag.style.opacity = smooth(.52, .57, p).toFixed(3);
    const sc = smooth(.36, .4, p) * (1 - smooth(.5, .56, p));
    scan.style.opacity = sc.toFixed(3); scan.style.transform = `translateY(${lerp(-10, 110, smooth(.36, .56, p)).toFixed(1)}%)`;

    /* 4 · top-down plan */
    lT.style.opacity = smooth(.62, .74, p).toFixed(3);
    lT.style.visibility = p < .6 ? "hidden" : "visible";
    if (p > .58) {
      lT.style.transform = `perspective(1400px) translate3d(${(-mxS * 12).toFixed(2)}px,${(-myS * 8 + lerp(140, 0, pitch)).toFixed(2)}px,0) rotateX(${lerp(42, 0, pitch).toFixed(2)}deg) rotateZ(${lerp(-7, 0, pitch).toFixed(2)}deg) scale(${(lerp(1.5, 1.06, pitch) * lerp(1, .98, smooth(.85, 1, p))).toFixed(4)})`;
      rects.forEach(r => {
        const d = +r.dataset.d, k = smooth(d, d + .55, draw), L = +r.dataset.len;
        r.style.strokeDashoffset = (L * (1 - k)).toFixed(1);
        r.style.fillOpacity = (smooth(.88, .96, p) * (r.classList.contains("st-a") ? (.14 + .08 * Math.sin(t * 2.4 + d * 20)) : r.classList.contains("st-b") ? .32 : .5)).toFixed(3);
      });
      planLabels.style.opacity = smooth(.8, .86, p).toFixed(3);
      compass.style.opacity = smooth(.8, .86, p).toFixed(3);
    }

    if (!reduce && p < .4) dust(dt, t, 1 - smooth(.18, .32, p) * .7); else if (p >= .4) dctx.clearRect(0, 0, DW, DH);

    phases.forEach(ph => {
      const fd = .05, v = ph.a < 0 ? 1 - smooth(ph.b - fd, ph.b, p) : Math.min(smooth(ph.a, ph.a + fd, p), 1 - smooth(ph.b - fd, ph.b, p));
      ph.el.style.opacity = v; ph.el.style.visibility = v < .02 ? "hidden" : "visible"; ph.el.style.translate = `0 ${(1 - v) * 20}px`;
    });
    const idx = p < .2 ? 0 : p < .37 ? 1 : p < .66 ? 2 : 3; dots.forEach((d, i) => d.classList.toggle("on", i === idx));
    tAlt.textContent = Math.round(rise * 120 + pitch * 60) + " M";
    tView.textContent = idx === 0 ? "GROUND · SUNSET" : idx === 1 ? "DRONE · RISING" : idx === 2 ? "DRONE · SURVEYING" : "TOP VIEW · PLAN";
  }
  requestAnimationFrame(tick);
})();
