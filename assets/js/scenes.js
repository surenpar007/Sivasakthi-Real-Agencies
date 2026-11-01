/* Home page scroll scenes: plot of the week, horizontal layout gallery, dream home reveal, night closing */
(function () {
  "use strict";
  const FX = window.SivaFX; if (!FX) return;
  const { reduce, fine, clamp, lerp, smooth } = FX;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const prog = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  /* visibility comes from IntersectionObserver, so idle frames never read layout */
  const vis = new WeakMap();
  const vio = new IntersectionObserver(es => es.forEach(e => vis.set(e.target, e.isIntersecting)), { rootMargin: "100px 0px" });
  const seen = el => vis.get(el) === true;
  const watch = el => { if (el) vio.observe(el); };

  const CQ = window.CSS && CSS.supports("width", "1cqw");
  /* fallback for older browsers: cover-fit a 16:9 frame inside a box, keeping a focal point (in 1280×720 space) in view */
  function cover(frame, box, fx, fy) {
    const W = box.clientWidth, H = box.clientHeight, s = Math.max(W / 1280, H / 720), fw = 1280 * s, fh = 720 * s;
    Object.assign(frame.style, { width: fw + "px", height: fh + "px", left: clamp(W / 2 - fx * s, W - fw, 0) + "px", top: clamp(H / 2 - fy * s, H - fh, 0) + "px" });
  }

  let mx = 0, my = 0, sx = 0, sy = 0, sDims = "", sCard = "", gOff = [], lastSp = -1, lastDr = -1, lastGa = -1;
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });

  /* ---------- 1 · plot of the week ---------- */
  const spot = $("#spotlight"), spotMedia = $("#spotMedia"), spotFrame = spot && $(".frame", spot);
  const bound = $("#spotBound"); let BL = 0;
  if (spot) {
    BL = bound.getTotalLength(); bound.style.strokeDasharray = BL; bound.style.strokeDashoffset = BL;
    const fit = () => cover(spotFrame, spotMedia, innerWidth < 900 ? 640 : 700, 360); if (!CQ) { fit(); addEventListener("resize", fit); }
  }

  /* ---------- 2 · horizontal gallery ---------- */
  const gal = $("#gallery"), track = $("#gTrack"), gProg = $("#gProg"), gImgs = gal ? $$(".g-img img", gal) : [];
  let gMax = 0;
  function gSize() {
    if (!gal) return;
    const horiz = innerWidth > 760 && !reduce;
    gal.classList.toggle("horiz", horiz);
    if (horiz) { gMax = Math.max(0, track.scrollWidth - innerWidth + 48); gal.style.height = (innerHeight + gMax) + "px"; track.style.transform = ""; gOff = gImgs.map(i => { const r = i.parentElement.getBoundingClientRect(); return r.left + r.width / 2; }); }
    else { gal.style.height = ""; track.style.transform = ""; }
  }
  if (gal) { gSize(); addEventListener("resize", gSize); addEventListener("load", gSize); }

  /* ---------- 3 · dream home ---------- */
  const dream = $("#dream"), dMedia = $("#dreamMedia"), dFrame = dream && $(".frame", dream), dLit = $("#dreamLit"), dLabels = dream ? $$(".dl", dream) : [];
  if (dream) { const fit = () => cover(dFrame, dMedia, innerWidth < 900 ? 860 : 760, 330); if (!CQ) { fit(); addEventListener("resize", fit); } }

  /* ---------- 4 · night closing: car light trails on the main road + fireflies ---------- */
  const nCv = $("#nightFx"), nBox = nCv && nCv.parentElement;
  const FLY = FX.glow(255, 236, 150);
  let nctx, NW = 0, NH = 0, flies = [], cars = [];
  const ROAD = [[110, 310], [330, 420], [560, 520], [780, 630], [980, 740], [1180, 860], [1310, 941]]; // 1672×941 photo space
  function nSize() {
    NW = nCv.clientWidth; NH = nCv.clientHeight; const d = 1;
    nCv.width = NW * d; nCv.height = NH * d; nctx.setTransform(d, 0, 0, d, 0, 0);
    flies = Array.from({ length: Math.min(45, Math.round(NW * NH / 22000)) }, () => ({ x: Math.random() * NW, y: NH * (.45 + Math.random() * .55), vx: (Math.random() - .5) * 14, vy: (Math.random() - .5) * 10, ph: Math.random() * 6.28, r: Math.random() * 1.6 + .8 }));
  }
  function roadPt(t, lane) { // position along the road polyline, mapped into canvas space (img is object-fit: cover)
    const s = Math.max(NW / 1672, NH / 941), ox = (NW - 1672 * s) / 2, oy = (NH - 941 * s) / 2;
    const seg = Math.min(ROAD.length - 2, Math.floor(t * (ROAD.length - 1))), k = t * (ROAD.length - 1) - seg;
    const a = ROAD[seg], b = ROAD[seg + 1];
    const x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k;
    const w = lane * (8 + t * 40); // lanes spread with perspective
    return [ox + (x + w * .6) * s, oy + (y - w * .8) * s, s * (.4 + t * 1.6)];
  }
  if (nCv) {
    nctx = nCv.getContext("2d"); nSize(); addEventListener("resize", nSize);
    for (let i = 0; i < 5; i++) cars.push({ t: Math.random(), v: .05 + Math.random() * .04, lane: i % 2 ? 1 : -1 });
  }
  function night(dt, t) {
    nctx.clearRect(0, 0, NW, NH);
    nctx.globalCompositeOperation = "lighter";
    for (const c of cars) {
      c.t += c.v * dt * (c.lane > 0 ? 1 : -1) * (.6 + c.t);
      if (c.t > 1) c.t = 0; if (c.t < 0) c.t = 1;
      const head = roadPt(c.t, c.lane), tail = roadPt(clamp(c.t - .05 * (c.lane > 0 ? 1 : -1), 0, 1), c.lane);
      const g = nctx.createLinearGradient(tail[0], tail[1], head[0], head[1]);
      const col = c.lane > 0 ? "255,236,190" : "255,90,60";
      g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},.9)`);
      nctx.strokeStyle = g; nctx.lineWidth = 2.2 * head[2]; nctx.lineCap = "round";
      nctx.beginPath(); nctx.moveTo(tail[0], tail[1]); nctx.lineTo(head[0], head[1]); nctx.stroke();
    }
    for (const f of flies) {
      f.x += (f.vx + Math.sin(t * .7 + f.ph) * 10) * dt; f.y += (f.vy + Math.cos(t * .9 + f.ph) * 8) * dt;
      if (f.x < 0) f.x = NW; if (f.x > NW) f.x = 0; if (f.y < NH * .4) f.y = NH; if (f.y > NH) f.y = NH * .4;
      const a = .35 + .65 * Math.max(0, Math.sin(t * 1.8 + f.ph));
      nctx.globalAlpha = a; const r = f.r * 6; nctx.drawImage(FLY, f.x - r, f.y - r, r * 2, r * 2);
    }
    nctx.globalAlpha = 1; nctx.globalCompositeOperation = "source-over";
  }

  [spot, gal, dream, nBox].forEach(watch);
  let last = performance.now();
  (function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, .05), t = now / 1000; last = now;
    if (document.hidden || !(seen(spot) || seen(gal) || seen(dream) || seen(nBox))) return;
    const moving = Math.abs(mx - sx) > 1e-3 || Math.abs(my - sy) > 1e-3;
    sx = lerp(sx, mx, .05); sy = lerp(sy, my, .05);

    if (spot && seen(spot)) {
      const p = reduce ? 1 : prog(spot);
      if (p !== lastSp || moving) { lastSp = p;
      spotMedia.style.transform = reduce ? "" : `scale(${lerp(1.18, 1.02, smooth(0, .8, p)).toFixed(4)}) translate3d(${(-sx * 16).toFixed(1)}px,${(-sy * 10).toFixed(1)}px,0)`;
      bound.style.strokeDashoffset = (BL * (1 - smooth(.08, .45, p))).toFixed(1);
      const dv = smooth(.4, .55, p).toFixed(3), cv = smooth(.3, .5, p).toFixed(3);
      if (dv !== sDims) spot.style.setProperty("--dims", sDims = dv);
      if (cv !== sCard) spot.style.setProperty("--card", sCard = cv); }
    }
    if (gal && seen(gal) && gal.classList.contains("horiz")) {
      const p = prog(gal); if (p !== lastGa) { lastGa = p;
      track.style.transform = `translate3d(${(-gMax * p).toFixed(1)}px,0,0)`;
      gProg.style.transform = `scaleX(${p.toFixed(3)})`;
      const tl = -gMax * p; gImgs.forEach((img, i) => { const k = (tl + gOff[i]) / innerWidth - .5; img.style.transform = `translate3d(${(k * -8).toFixed(2)}%,0,0) scale(1.18)`; }); }
    }
    if (dream && seen(dream)) {
      const p = reduce ? 1 : prog(dream);
      if (p !== lastDr || moving) { lastDr = p;
      const r = lerp(0, 140, smooth(.12, .6, p));
      dLit.style.clipPath = `circle(${r.toFixed(1)}% at 66% 32%)`;
      dMedia.style.transform = reduce ? "" : `scale(${lerp(1.12, 1, smooth(0, .8, p)).toFixed(4)}) translate3d(${(-sx * 12).toFixed(1)}px,${(-sy * 8).toFixed(1)}px,0)`;
      dLabels.forEach((l, i) => l.classList.toggle("on", p > .45 + i * .08 || reduce)); }
    }
    if (nCv && seen(nBox) && !reduce) night(dt, t);
  })(last);
})();
