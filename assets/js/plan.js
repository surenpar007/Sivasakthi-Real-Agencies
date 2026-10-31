/* Land for sale page: interactive top-down layout plan */
(function () {
  "use strict";
  const stage = document.getElementById("planStage"); if (!stage) return;
  const FX = window.SivaFX, D = window.SIVA || {}, P = D.plan || {};
  const { lakh, wa, reduce, fine } = FX;
  const plots = Array.isArray(P.plots) ? P.plots : [];
  const rate = P.ratePerSqft || 800;
  const NS = "http://www.w3.org/2000/svg";
  const ST = { a: ["Available", "#FFD21F"], b: ["Booked", "#8FA7D6"], s: ["Sold", "#8F9BB2"] };
  const $ = id => document.getElementById(id);
  const g = document.querySelector("#planSvg .plan-plots"), tip = $("planTip");

  const els = plots.map((p, i) => {
    const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", p.x + 5); r.setAttribute("y", p.y + 5); r.setAttribute("width", p.w - 10); r.setAttribute("height", p.h - 10); r.setAttribute("rx", 3);
    r.setAttribute("class", "pp st-" + p.status); r.setAttribute("tabindex", "0"); r.setAttribute("role", "button");
    r.setAttribute("aria-label", `Plot ${p.id}, ${ST[p.status][0]}, ${p.size}, ${p.facing} facing`);
    r.style.setProperty("--i", i);
    g.appendChild(r); return r;
  });
  let sel = Math.max(0, plots.findIndex(p => p.status === "a"));

  function show(i, hover) {
    const p = plots[i]; if (!p) return; const st = ST[p.status] || ST.a;
    $("qId").textContent = p.id; $("qStatus").textContent = st[0]; $("qStatus").style.color = st[1];
    $("qSize").textContent = p.size; $("qArea").textContent = p.area.toLocaleString("en-IN") + " sq.ft";
    $("qCents").textContent = (p.area / 435.6).toFixed(2) + " cents"; $("qFace").textContent = p.facing; $("qPrice").textContent = lakh(p.area * rate);
    const ok = p.status === "a", hold = $("qHold");
    hold.textContent = ok ? `Hold plot ${p.id}` : "Ask about similar plots";
    hold.href = wa(ok ? `Hello Sivasakthi Real Agencies, I want to hold plot ${p.id} (${p.size}, ${p.facing} facing) at ${P.name || "your layout"}, ${P.place || ""}.`
                      : `Hello Sivasakthi Real Agencies, plot ${p.id} at ${P.name || "your layout"} is ${st[0].toLowerCase()}. Do you have similar plots?`);
    els.forEach((e, j) => { e.classList.toggle("sel", j === sel); e.classList.toggle("hov", hover && j === i); });
  }
  function moveTip(i, e) {
    if (!fine || !e) { tip.hidden = true; return; }
    const p = plots[i], r = stage.getBoundingClientRect();
    tip.innerHTML = `<b>${p.id}</b> ${p.size} · ${lakh(p.area * rate)} <i class="t-${p.status}">${ST[p.status][0]}</i>`;
    tip.hidden = false; tip.style.left = (e.clientX - r.left) + "px"; tip.style.top = (e.clientY - r.top) + "px"; tip.classList.toggle("flip", e.clientX - r.left > r.width * .6);
  }
  els.forEach((r, i) => {
    r.addEventListener("click", () => { sel = i; show(i); });
    r.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sel = i; show(i); } });
    r.addEventListener("pointerenter", e => { show(i, true); moveTip(i, e); });
    r.addEventListener("pointermove", e => moveTip(i, e));
    r.addEventListener("pointerleave", () => { tip.hidden = true; show(sel); });
    r.addEventListener("focus", () => show(i, true));
  });
  show(sel);
  const count = s => plots.filter(p => p.status === s).length;
  $("qCount").textContent = `${count("a")} available · ${count("b")} booked · ${count("s")} sold`;

  /* reveal: outlines draw in when the plan scrolls into view */
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { stage.classList.add("in"); o.disconnect(); } }, { threshold: .25 }).observe(stage);
  if (reduce) stage.classList.add("in");
})();
