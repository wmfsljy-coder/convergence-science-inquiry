/* 융합과학 탐구 Ⅱ 융합과학 탐구의 과정 — 소단원별 이야기 네 편
   01 필로티 2층은 왜 추울까 / 02 커피 필터 낙하 실험 / 03 학교 자기장 지도 / 04 선크림 보고서
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("cvg-2");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function segWire(id, attr, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute(attr)); });
  });
}
function filledOrder(mount, steps) { $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>"; }
function seeded(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
function gauss(r) { var u1 = Math.max(1e-6, r()), u2 = r(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

/* ---- 무대 그림 공용 (../assets/kit.js) ---- */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
/* ── 스튜디오 부품(s19) — 재질 상자·원통·피라미드·판정 카드·큰 제목. 같은 단원의 lab-cases·real-cases 도 window.sthSP19 로 쓴다 ── */
var SP = (function () {
  var LT = K.LT;
  var MAT = {
    wood: ["#e4bd86", "#b47e45", "#835729"], dark: ["#a2703f", "#744a26", "#52331a"], brass: ["#f7de8e", "#d3a23d", "#966b1c"],
    stone: ["#eee8db", "#cbc0ab", "#a19680"], iron: ["#d6dce5", "#9aa5b4", "#6d7788"], clay: ["#eaa97c", "#c4734b", "#924e30"],
    grass: ["#97c872", "#a97b4b", "#7b5734"], sand: ["#eedcac", "#d0b47b", "#aa8f59"], paper: ["#fdf8ec", "#ebe1ca", "#cdbfa1"],
    blue: ["#94c7f1", "#4189ca", "#2c629a"], green: ["#93dfbc", "#31a97e", "#20795a"], red: ["#f5a8a8", "#d9534f", "#a8352f"],
    white: ["#ffffff", "#e7ecf3", "#c5cedb"], slate: ["#6d7787", "#465062", "#30384a"], navy: ["#3a4f86", "#22325e", "#172244"],
    yellow: ["#ffe08a", "#f0b429", "#c2870f"], violet: ["#c9b6ff", "#7a5bd6", "#5a3fab"]
  };
  function mt(c) {
    if (typeof c !== "string") return c;
    if (MAT[c]) return MAT[c];
    return [K.tint(c, 1.12), c, K.tint(c, 0.72)];
  }
  function poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function box(ctx, I, x0, y0, z0, x1, y1, z1, m, o) {
    var c = mt(m); o = o || {};
    I.box(ctx, x0, y0, z0, x1, y1, z1, c[0], c[1], c[2]);
    var a = I.P(x0, y1, z1), b = I.P(x1, y1, z0), g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    g.addColorStop(0, "rgba(255,255,255,.16)"); g.addColorStop(1, "rgba(0,0,0,.10)");
    I.quad(ctx, I.P(x0, y1, z0), I.P(x1, y1, z0), I.P(x1, y1, z1), I.P(x0, y1, z1), g);
    if (o.grain) {
      var R = K.rng(o.seed || 3), k, n = Math.max(2, Math.round((z1 - z0) / 5));
      ctx.strokeStyle = "rgba(70,40,15,.22)"; ctx.lineWidth = .8;
      for (k = 1; k < n; k++) {
        var zz = z0 + (z1 - z0) * k / n + (R() - .5) * 2, p1 = I.P(x0, y1, zz), p2 = I.P(x1, y1, zz), p3 = I.P(x1, y0, zz);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.stroke();
      }
    }
    if (o.edge !== false) {
      ctx.strokeStyle = o.edgeCol || "rgba(255,255,255,.55)"; ctx.lineWidth = 1;
      var e1 = I.P(x0, y1, z1), e2 = I.P(x1, y1, z1), e3 = I.P(x1, y0, z1), e4 = I.P(x1, y1, z0);
      ctx.beginPath(); ctx.moveTo(e1.x, e1.y); ctx.lineTo(e2.x, e2.y); ctx.lineTo(e3.x, e3.y); ctx.moveTo(e2.x, e2.y); ctx.lineTo(e4.x, e4.y); ctx.stroke();
    }
  }
  function glass(ctx, I, x0, y0, z0, x1, y1, z1, tint) {
    var t = tint || "200,230,255";
    I.box(ctx, x0, y0, z0, x1, y1, z1, "rgba(" + t + ",.20)", "rgba(" + t + ",.22)", "rgba(" + t + ",.30)");
    ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.2;
    [[I.P(x0, y1, z0), I.P(x1, y1, z0), I.P(x1, y0, z0)], [I.P(x0, y1, z1), I.P(x1, y1, z1), I.P(x1, y0, z1), I.P(x0, y0, z1), I.P(x0, y1, z1)],
     [I.P(x0, y1, z0), I.P(x0, y1, z1)], [I.P(x1, y1, z0), I.P(x1, y1, z1)], [I.P(x1, y0, z0), I.P(x1, y0, z1)]].forEach(function (s) {
      ctx.beginPath(); s.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
    });
  }
  /* 화면 좌표 원통: (cx, cy) = 윗면 가운데, 아래로 h. o.top 윗면 색, o.open 이면 속이 빈 그릇 */
  function cyl(ctx, cx, cy, rx, ry, h, m, o) {
    var c = mt(m); o = o || {};
    var g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
    g.addColorStop(0, c[1]); g.addColorStop(.3, c[0]); g.addColorStop(.55, c[1]); g.addColorStop(1, c[2]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx + rx, cy + h); ctx.ellipse(cx, cy + h, rx, ry, 0, 0, Math.PI);
    ctx.lineTo(cx - rx, cy); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = o.top || c[0]; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.fill();
    if (o.open) { ctx.fillStyle = o.open; ctx.beginPath(); ctx.ellipse(cx, cy, rx * .86, ry * .82, 0, 0, 6.2832); ctx.fill(); }
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.stroke();
  }
  /* 월드 좌표 원통(I): 바닥 가운데 (x, y, z), 반지름 r, 높이 h */
  function icyl(ctx, I, x, y, z, r, h, m, o) { var p = I.P(x, y, z + h); cyl(ctx, p.x, p.y, 1.2247 * r * I.s, .7071 * r * I.s, h * I.s, m, o); }
  function pyramid(ctx, I, x, y, z, w, h, m) {
    var c = mt(m || "sand"), ap = I.P(x + w / 2, y + w / 2, z + h);
    poly(ctx, [I.P(x, y + w, z), I.P(x + w, y + w, z), ap], c[1]);
    poly(ctx, [I.P(x + w, y, z), I.P(x + w, y + w, z), ap], c[2]);
    ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; var q = I.P(x + w, y + w, z);
    ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(ap.x, ap.y); ctx.stroke();
  }
  function head(ctx, big, sub, ok, o) {
    o = o || {};
    K.bigText(ctx, big, o.x || 22, o.y || 50, o.s || 28, ok ? "#ffd35a" : "#ffffff");
    if (sub) K.bigText(ctx, sub, o.x || 22, (o.y || 50) + 34, o.s2 || 17, ok ? "#ffffff" : "#ffd35a");
  }
  /* 흰 판정 카드: rows = [[이름, 값, 색]], tip = [글, 좋음] */
  function card(ctx, x, y, w, h, title, rows, tip, o) {
    o = o || {};
    K.card(ctx, x, y, w, h, title);
    var yy = y + (o.top || 56), gap = o.gap || 26;
    (rows || []).forEach(function (r) {
      if (!r) { yy += gap * .5; return; }
      K.row(ctx, r[0], r[1], x + 16, x + w - 16, yy, r[2]); yy += gap;
    });
    if (tip) K.tip(ctx, tip[0], x + 12, y + h - 44, w - 24, tip[1]);
    return yy;
  }
  function chart(ctx, o) { o.light = true; return K.chart(ctx, o); }
  function plot(ctx, g, pts, col, o) { o = o || {}; o.light = true; K.plot(ctx, g, pts, col, o); }
  /* 밝은 바탕에서도 보이는 별: 남색 테두리 + 빛 */
  function star(ctx, x, y, r) {
    ctx.fillStyle = "rgba(20,30,70,.85)"; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 6.2832); ctx.fill();
    K.glow(ctx, x, y, r, "rgba(200,228,255,.98)", 4); K.spikes(ctx, x, y, r * 4, .8);
  }
  function lbl(ctx, s, x, y, o) { o = o || {}; K.t(ctx, s, x, y, { s: o.s || 11.5, w: o.w || "800", a: o.a, c: o.c || LT.ink }); }
  return { MAT: MAT, mt: mt, poly: poly, box: box, glass: glass, cyl: cyl, icyl: icyl, pyramid: pyramid, head: head, card: card, chart: chart, plot: plot, star: star, lbl: lbl, LT: LT };
})();
window.sthSP19 = SP;
var LT = K.LT;
function glass(ctx, x, y, w, h, r, edge, a) {
  var g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "rgba(255,255,255," + (a == null ? 0.09 : a) + ")"); g.addColorStop(1, "rgba(255,255,255,.02)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = edge || "rgba(200,210,255,.22)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
}
function kv(ctx, k, val, x, y, col, size, a) {
  K.t(ctx, k, x, y, { s: 11.5, c: KC.mute, w: "700", a: a });
  K.t(ctx, val, x, y + (size || 18) + 6, { s: size || 18, c: col || KC.ink, w: "900", a: a });
}
function glowPath(ctx, pts, col, w, dash) {
  if (!pts.length) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.lineJoin = "round"; ctx.shadowColor = col; ctx.shadowBlur = 8;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore();
}
function pauser(id, st, label) {
  var b = $(id); if (!b) return;
  label = label || ["움직임 멈추기", "움직임 보기"];
  function paint() { b.textContent = st.on ? "⏸ " + label[0] : "▶ " + label[1]; }
  b.addEventListener("click", function () { st.on = !st.on; paint(); });
  paint();
}
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
/* 커피 필터(주름 진 종이 컵) n장 */
function filter(ctx, x, y, w, n) {
  for (var i = n - 1; i >= 0; i--) {
    var yy = y + i * 3, g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
    g.addColorStop(0, "#d8c7a3"); g.addColorStop(.5, "#fff6e2"); g.addColorStop(1, "#c9b48c");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w / 2, yy); ctx.lineTo(x + w / 2, yy); ctx.lineTo(x + w * .3, yy + w * .38); ctx.lineTo(x - w * .3, yy + w * .38); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(120,90,50,.35)"; ctx.lineWidth = 1;
    for (var k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(x + k * w / 7, yy); ctx.lineTo(x + k * w * .3 / 3.5, yy + w * .38); ctx.stroke(); }
  }
}

/* =========================================================================
   이야기 ① 필로티 2층은 왜 추울까
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "첫 짐작",
    question: "필로티 2층이 유난히 추운 까닭으로 가장 그럴듯한 것은?",
    options: ["㉠ 2층 주민이 난방을 덜 해서", "㉡ 바닥 아래가 비어 있어 찬 바깥 공기에 바닥이 그대로 닿아서", "㉢ 기분 탓이다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 이상값 걸러 내기 */
  (function () {
    var canvas = $("c-cl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, X = 3;
    var IN = [], OUT = [], h;
    for (h = 0; h < 24; h++) { IN.push(Math.round((16 + 3.5 * Math.cos(2 * Math.PI * (h - 15) / 24)) * 10) / 10); OUT.push(Math.round((-2 + 4 * Math.cos(2 * Math.PI * (h - 14) / 24)) * 10) / 10); }
    IN[7] = -40.0; IN[15] = 85.0;
    var BAD = [7, 15], med = IN.slice().sort(function (a, b) { return a - b; })[12];
    function kept() { return IN.map(function (t) { return Math.abs(t - med) <= X; }); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var k = kept(), LW = 640;
      K.studio(ctx, 0, 0, W, H, { x: 770, y: 268, rx: 110, ry: 12 });
      K.card(ctx, 10, 10, LW - 14, H - 20, null);
      var g = SP.chart(ctx, { x: 16, y: 44, w: LW - 28, h: H - 60, x0: 0, x1: 23, y0: -45, y1: 90, xt: 23, yt: 3, xf: function (i) { return i % 6 === 0 || i === 23 ? i + "시" : ""; }, yf: function (t) { return Math.round(t) + " ℃"; }, pl: 56 });
      function Y(t) { return g.Y(clamp(t, -45, 90)); }
      ctx.fillStyle = "rgba(245,159,0,.18)"; ctx.fillRect(g.L, Y(med + X), g.R - g.L, Math.max(2, Y(med - X) - Y(med + X)));
      K.line(ctx, { x: g.L, y: Y(med) }, { x: g.R, y: Y(med) }, "rgba(217,164,0,.8)", 1, [3, 4]);
      SP.plot(ctx, g, OUT.map(function (t, i) { return [i, t]; }), LT.blue);
      IN.forEach(function (t, i) {
        var px = g.X(i), py = Y(t);
        if (k[i]) K.planet(ctx, px, py, 4.5, "#ffb0a0", "#c0301a");
        else {
          ctx.fillStyle = "rgba(92,112,134,.4)"; ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.2832); ctx.fill();
          ctx.strokeStyle = LT.red; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(px - 7, py - 7); ctx.lineTo(px + 7, py + 7); ctx.moveTo(px + 7, py - 7); ctx.lineTo(px - 7, py + 7); ctx.stroke();
        }
      });
      [7, 15].forEach(function (i) { K.pill(ctx, (k[i] ? "오작동? " : "지움 ") + IN[i] + " ℃", g.X(i) + 12, Y(IN[i]) + (IN[i] < 0 ? -6 : 18), { s: 11, c: k[i] ? "#ffd2a8" : "#ffb3bd", box: [0, LW] }); });
      K.t(ctx, "● 실내 기록계", 26, 32, { s: 11.5, w: "900", c: "#c0301a" });
      K.t(ctx, "— 기상청 바깥 기온", 128, 32, { s: 11.5, w: "900", c: LT.blue });
      K.t(ctx, "▒ 중앙값 " + med + " ℃ ± " + X + " ℃ (남기는 범위)", LW - 20, 32, { s: 11.5, w: "900", a: "right", c: "#b86e00" });
      /* ── 오른쪽: 온도 기록계(입체 기기) ── */
      var keptIn = IN.filter(function (t, i) { return k[i]; }), mi = keptIn.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, keptIn.length), mo = OUT.reduce(function (a, b) { return a + b; }, 0) / 24;
      var lx = 668, lw = 210, ly = 50, lh = 200;
      SP.poly(ctx, [{ x: lx - 10, y: ly - 10 }, { x: lx + lw + 10, y: ly - 10 }, { x: lx + lw + 22, y: ly - 22 }, { x: lx + 2, y: ly - 22 }], "#eef1f5");
      SP.poly(ctx, [{ x: lx + lw + 10, y: ly - 10 }, { x: lx + lw + 22, y: ly - 22 }, { x: lx + lw + 22, y: ly + lh - 2 }, { x: lx + lw + 10, y: ly + lh + 10 }], "#9aa3b0");
      var cg = ctx.createLinearGradient(0, ly - 10, 0, ly + lh + 10); cg.addColorStop(0, "#d6dce5"); cg.addColorStop(1, "#aeb8c6");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(lx - 10, ly - 10, lw + 20, lh + 20, 14); ctx.fill();
      var lg = ctx.createLinearGradient(lx, ly, lx, ly + lh - 40); lg.addColorStop(0, "#1d3a2c"); lg.addColorStop(1, "#0e2219");
      ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(lx, ly, lw, lh - 40, 8); ctx.fill();
      K.t(ctx, "지운 값  " + (24 - keptIn.length) + "개", lx + 14, ly + 28, { s: 13, c: "#9dffc6", w: "900" });
      K.t(ctx, "실내 평균  " + mi.toFixed(1) + " ℃", lx + 14, ly + 60, { s: 13, c: "#ffc2b0", w: "900" });
      K.t(ctx, "바깥 평균  " + mo.toFixed(1) + " ℃", lx + 14, ly + 88, { s: 13, c: "#bfe8ff", w: "900" });
      K.t(ctx, "차이  " + (mi - mo).toFixed(1) + " ℃", lx + 14, ly + 138, { s: 20, c: "#d8ffe9", w: "900" });
      [0, 1, 2].forEach(function (b) { K.planet(ctx, lx + 40 + b * 66, ly + lh - 18, 10, ["#ff8a8a", "#a5d8ff", "#ffe08a"][b], "#4a5262"); });
      K.pill(ctx, "중앙값은 튀는 값에 잘 안 흔들림", 778, H - 12, { s: 11, a: "center", c: KC.ink, box: [640, W] });
      return { k: k, mi: mi, mo: mo };
    }
    function update() {
      var r = draw(), badGone = BAD.every(function (i) { return !r.k[i]; }), realKept = r.k.filter(function (x, i) { return BAD.indexOf(i) < 0 && x; }).length;
      $("cl-info").innerHTML = "중앙값 " + med + " ℃에서 ±" + X + " ℃ 안의 값만 남깁니다. 오작동 값 " + (badGone ? "모두 제거" : "남음") + " · 진짜 값 " + realKept + "/22 개 남음. 평균은 튀는 값 하나에도 크게 흔들리지만, 중앙값은 잘 흔들리지 않아 기준으로 쓰기 좋습니다.";
      if (badGone && realKept === 22 && !ep.cleared(1)) {
        window.sthState("clBest", "±" + X + " ℃ 기준 → 실내 평균 " + r.mi.toFixed(1) + " ℃, 바깥보다 " + (r.mi - r.mo).toFixed(1) + " ℃ 높음");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("clBest") + ". 가공한 데이터로 ‘바깥이 추운 밤에 실내 온도가 얼마나 따라 내려가나’를 물을 수 있게 되었습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("cl-x").addEventListener("input", function (e) { X = +e.target.value; $("cl-x-val").textContent = X + " ℃"; update(); });
    update();
    if (ep.cleared(1)) window.sthMission("m1-2", true);
  })();

  /* 장면 3 — 가설 가르기 */
  window.sthSort({
    mount: "s1-sort",
    buckets: [{ id: "h", label: "검증할 수 있는 가설", sub: "변인 사이의 관계를 실험·측정으로 확인 가능" }, { id: "x", label: "가설로 쓰기 어려운 문장", sub: "막연하거나, 가치 판단이거나, 확인할 수 없음" }],
    items: [
      { t: "바닥 아래가 비어 있는 방은 막힌 방보다 밤사이 온도가 더 많이 내려간다", a: "h", why: "조작 변인(바닥 아래 공간)과 종속 변인(온도 변화)이 분명합니다." },
      { t: "바깥 기온이 낮을수록 필로티 2층의 바닥 온도가 더 낮아진다", a: "h", why: "측정으로 확인할 수 있는 관계입니다." },
      { t: "바닥에 단열재를 깔면 필로티 2층의 밤사이 온도 하강이 줄어든다", a: "h", why: "단열재 유무를 바꿔 검증할 수 있습니다." },
      { t: "필로티 1층을 유리벽으로 막으면 2층 바닥 온도가 올라간다", a: "h", why: "바꾸는 것과 재는 것이 드러납니다." },
      { t: "필로티 건물은 나쁜 건물이다", a: "x", why: "가치 판단이라 실험으로 검증할 수 없습니다." },
      { t: "2층은 왠지 춥다", a: "x", why: "무엇이 무엇에 영향을 주는지 드러나지 않습니다." },
      { t: "필로티 2층에 사는 사람은 추위를 잘 탄다", a: "x", why: "사람의 느낌에 기대어 있고, 건물 구조와의 관계를 검증하기 어렵습니다.", hint: "무엇을 바꾸고 무엇을 잴 수 있나요?" },
      { t: "건물은 언젠가 모두 무너진다", a: "x", why: "탐구 문제와 관계없고, 확인할 수 있는 조건이 없습니다." }
    ],
    onDone: function () { window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>좋은 가설은 ‘무엇을 바꾸면(조작 변인) 무엇이 어떻게 달라진다(종속 변인)’로 쓰여 검증할 수 있습니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m1-3", true);

  /* 장면 4 — 모형 실험 설계 */
  (function () {
    var canvas = $("c-md"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var VARS = [
      { id: "floor", t: "바닥 아래 공간", diff: false, key: true },
      { id: "wall", t: "벽 두께", diff: false },
      { id: "win", t: "창문 크기", diff: true },
      { id: "heat", t: "처음 온도", diff: false },
      { id: "mat", t: "상자 재료", diff: true }
    ];
    var ran = null;
    VARS.forEach(function (x) {
      var g = document.createElement("div"); g.className = "ctrl-group";
      g.innerHTML = "<div class='ctrl-label'>" + x.t + " (A와 B)</div>";
      var sg = document.createElement("div"); sg.className = "seg";
      [[false, "같음"], [true, "다름"]].forEach(function (o) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = o[1];
        if (x.diff === o[0]) b.classList.add("on");
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(sg.children, function (c) { c.classList.toggle("on", c === b); });
          if (x.diff !== o[0]) { x.diff = o[0]; ran = null; draw(); $("md-info").innerHTML = "설계가 바뀌었습니다. 다시 실행해 보세요."; }
        });
        sg.appendChild(b);
      });
      g.appendChild(sg); $("md-ctrl").appendChild(g);
    });
    function fair() { return VARS.every(function (x) { return x.key ? x.diff : !x.diff; }); }
    function curves() {
      var tA = 8, tB = 8;
      VARS.forEach(function (x) { if (!x.diff) return; if (x.id === "floor") tB = 5; if (x.id === "wall") tB -= 1.5; if (x.id === "win") tB -= 1; if (x.id === "mat") tA += 1.5; });
      var T0A = 20, T0B = VARS[3].diff ? 23 : 20;
      function T(T0, tau, t) { return -3 + (T0 + 3) * Math.exp(-t / tau); }
      var a = [], b = []; for (var t = 0; t <= 12; t += 0.25) { a.push(T(T0A, tA, t)); b.push(T(T0B, tB, t)); }
      return { a: a, b: b };
    }
    /* ── 잘라 보는 디오라마: 눈 덮인 땅 블록 위 모형 상자 A·B (앞벽과 지붕을 잘라 속을 보임) ── */
    var DH = 412;                                         /* 위 칸(모형) 높이, 아래는 온도 그래프 */
    var I = K.iso({ ox: 480, oy: 122, s: 0.8, L: 500, D: 170 });
    var anim = { on: !REDUCE }, ph = 0, playT = 12;
    pauser("md-anim", anim, ["눈·바람 멈추기", "눈·바람 보기"]);
    function tempAt(arr, t) { var i = Math.min(arr.length - 1, Math.max(0, Math.round(t / 0.25))); return arr[i]; }
    function T0(isB) { return isB && VARS[3].diff ? 23 : 20; }
    function heat(T, a) {                                 /* −3 ℃ 파랑 ~ 23 ℃ 주황 */
      var f = clamp((T + 3) / 26, 0, 1), r = Math.round(90 + 165 * f), g = Math.round(160 - 10 * f), b = Math.round(255 - 185 * f);
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
    function quadP(a, b, c, d, fill) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    function model(x0, isB, T) {
      var y0 = 30, x1 = x0 + 150, y1 = 130, h = 84;
      var pil = isB && VARS[0].diff, thin = isB && VARS[1].diff, bigWin = isB && VARS[2].diff, foam = !isB && VARS[4].diff;
      var zb = pil ? 40 : 0, t = thin ? 4 : 11;
      var wTop = foam ? "#f3f5fb" : "#d2a46a", wIn = foam ? "#e3e7f3" : "#c08a4e", wOut = foam ? "#b8c0d6" : "#93633a", wCut = foam ? "#ffffff" : "#e6c08c";
      if (pil) {
        var cols = [[x0 + 4, y0 + 4], [x1 - 14, y0 + 4]], fr = [[x0 + 4, y1 - 14], [x1 - 14, y1 - 14]];
        cols.forEach(function (c) { I.box(ctx, c[0], c[1], 0, c[0] + 10, c[1] + 10, zb, "#c9ccd6", "#9aa0b2", "#7d8396"); });
        fr.forEach(function (c) { I.box(ctx, c[0], c[1], 0, c[0] + 10, c[1] + 10, zb, "#c9ccd6", "#9aa0b2", "#7d8396"); });
      }
      I.box(ctx, x0, y0, zb, x1, y1, zb + 6, "#a88a66", "#e9d7bb", "#7a6248");          /* 바닥판 */
      quadP(I.P(x0 + t, y0 + t, zb + 6), I.P(x1 - t, y0 + t, zb + 6), I.P(x1 - t, y1, zb + 6), I.P(x0 + t, y1, zb + 6), heat(T, .55));
      I.box(ctx, x0, y0, zb + 6, x1, y0 + t, zb + 6 + h, wTop, wIn, wOut);               /* 뒷벽 */
      var yb = y0 + t;                                     /* 뒷벽 안쪽 면: 데워진 공기와 창 */
      quadP(I.P(x0 + t, yb, zb + 6), I.P(x1 - t, yb, zb + 6), I.P(x1 - t, yb, zb + 6 + h), I.P(x0 + t, yb, zb + 6 + h), heat(T, .32));
      var ww = bigWin ? 70 : 34, wh = bigWin ? 44 : 24, wx = (x0 + x1) / 2 - ww / 2, wz = zb + 6 + 34;
      var wa = I.P(wx, yb, wz), wb = I.P(wx + ww, yb, wz), wc = I.P(wx + ww, yb, wz + wh), wd = I.P(wx, yb, wz + wh);
      var wg = ctx.createLinearGradient(wd.x, wd.y, wb.x, wb.y); wg.addColorStop(0, "#1b2a5a"); wg.addColorStop(1, "#3a5fa8");
      quadP(wa, wb, wc, wd, wg);
      ctx.strokeStyle = "#eef3ff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wa.x, wa.y); ctx.lineTo(wb.x, wb.y); ctx.lineTo(wc.x, wc.y); ctx.lineTo(wd.x, wd.y); ctx.closePath(); ctx.stroke();
      I.box(ctx, x0, y0 + t, zb + 6, x0 + t, y1, zb + 6 + h, wTop, wCut, wIn);          /* 왼쪽 벽 (앞면 = 자른 자리) */
      var th = I.P((x0 + x1) / 2 + 20, (y0 + y1) / 2 + 20, zb + 6);                    /* 온도계 */
      ctx.fillStyle = "#f4f6fb"; ctx.fillRect(th.x - 3, th.y - 34, 6, 32);
      var lv = clamp((T + 3) / 26, 0.05, 1); ctx.fillStyle = heat(T, 1); ctx.fillRect(th.x - 2, th.y - 4 - 28 * lv, 4, 28 * lv);
      ctx.beginPath(); ctx.arc(th.x, th.y - 2, 4.5, 0, 6.283); ctx.fill();
      I.box(ctx, x1 - t, y0 + t, zb + 6, x1, y1, zb + 6 + h, wTop, wCut, wOut);         /* 오른쪽 벽 */
      if (pil) for (var k = 0; k < 4; k++) {               /* 기둥 사이 빈 공간으로 지나가는 찬 바람 */
        var u = ((ph * 0.35 + k / 4) % 1), yy = y1 + 2 + (k % 2) * 10, zz = 10 + (k % 2) * 14;
        var a = I.P(x0 - 30 + u * 190, yy, zz), b = I.P(x0 - 30 + u * 190 + 30, yy, zz);
        K.arrow(ctx, a, b, "rgba(70,150,245,.95)", 2.4, 7);
      }
      return { top: I.P(x0 + 20, y0, zb + 6 + h), mid: I.P((x0 + x1) / 2, y1, zb + 6), thx: th, pil: pil };
    }
    function snow() {
      var R = K.rng(17);
      for (var i = 0; i < 46; i++) {
        var x = R() * I.L, y = R() * I.D, z = (R() * 190 - ph * 22 * (0.6 + R() * 0.6)) % 190; if (z < 0) z += 190;
        if (y > 22 && y < 132 && ((x > 32 && x < 198) || (x > 282 && x < 448))) continue;   /* 방 안에는 눈이 내리지 않게 */
        var p = I.P(x, y, z + 2); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fill();
      }
    }
    function drawModel() {
      var showT = ran ? playT : 0;
      var TA = ran ? tempAt(ran.a, showT) : T0(false), TB = ran ? tempAt(ran.b, showT) : T0(true);
      K.studio(ctx, 0, 0, W, DH, { x: I.P(I.L, I.D, 0).x - 160, y: I.P(I.L, I.D, 0).y - 20, rx: 330, ry: 54 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      I.box(ctx, 0, 0, -16, I.L, I.D, 0, "#eef3fb", "#6b5a48", "#4f4234");               /* 눈 덮인 땅 */
      I.face(ctx, "front", function (Lw) { ctx.fillStyle = "#f7faff"; ctx.fillRect(0, -5, Lw, 5); var R = K.rng(9); for (var i = 0; i < 70; i++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.15)" : "rgba(30,20,10,.25)"; ctx.fillRect(R() * Lw, -16 + R() * 11, 2, 2); } });
      I.edges(ctx, 0, 0);
      var A = model(40, false, TA), B = model(290, true, TB);
      snow();
      ctx.restore();
      var box = [0, W];
      I.label(ctx, 40 + 20, 30, (A.pil ? 40 : 0) + 90, "모형 A · " + TA.toFixed(1) + " ℃", -36, -26, "#bfe6ff", box);
      I.label(ctx, 290 + 130, 30, (B.pil ? 40 : 0) + 90, "모형 B · " + TB.toFixed(1) + " ℃", 30, -30, "#ffb3bd", box);
      if (B.pil) I.label(ctx, 290 + 150, 120, 18, "바닥 아래로 찬 바람", 40, 18, "#bfe6ff", box);
      I.label(ctx, 290, 130, 40, "앞벽·지붕을 잘라 냄", -60, 46, "#e8ecff", box);
      /* 두 모형이 다른 점(설계가 그대로 드러남) */
      var dA = [], dB = [];
      if (VARS[0].diff) dB.push("바닥 아래 빈 곳"); if (VARS[1].diff) dB.push("얇은 벽"); if (VARS[2].diff) dB.push("큰 창");
      if (VARS[3].diff) dB.push("처음 23 ℃"); if (VARS[4].diff) dA.push("스티로폼 상자");
      K.pill(ctx, "A만 다른 점: " + (dA.length ? dA.join(" · ") : "없음"), 22, DH - 50, { s: 11.5, c: KC.blue, box: box });
      K.pill(ctx, "B만 다른 점: " + (dB.length ? dB.join(" · ") : "없음"), 22, DH - 24, { s: 11.5, c: KC.red, box: box });
      K.warn(ctx, W - 14, 30, "⚠ 모형 크기·벽 두께는 보기 쉽게 과장", "right");
      K.pill(ctx, "바깥 −3 ℃ · 눈 오는 밤", W - 14, 58, { s: 11.5, a: "right", c: KC.blue, box: box });
      /* 큰 제목 */
      var others = VARS.filter(function (x) { return !x.key && x.diff; }).map(function (x) { return x.t; });
      var h1, h2;
      if (!ran) { h1 = "모형 A와 B, 무엇이 다른가"; h2 = "설계를 고르고 밤새 식혀 보세요"; }
      else if (playT < 12) { h1 = "밤이 깊어 간다"; h2 = playT.toFixed(1) + "시간 · A " + TA.toFixed(1) + " ℃ · B " + TB.toFixed(1) + " ℃"; }
      else if (!VARS[0].diff) { h1 = "바닥 아래가 똑같다"; h2 = "이대로는 가설을 검증할 수 없다"; }
      else if (others.length) { h1 = "다른 조건이 섞였다"; h2 = "차이가 바닥 탓인지 알 수 없다"; }
      else { h1 = "바닥 아래만 다르다"; h2 = "12시간 뒤 B가 " + (TA - TB).toFixed(1) + " ℃ 더 차갑다"; }
      K.bigText(ctx, h1, 22, 50, 27, "#ffffff"); K.bigText(ctx, h2, 22, 82, 17, "#ffd35a");
    }
    function drawChart() {
      var y0 = DH + 8, h = H - y0;
      K.stage(ctx, 0, y0, W, h, "lab", { seed: 61 });
      K.pill(ctx, "두 모형의 밤사이 온도", 14, y0 + 22, { s: 12, c: KC.ink });
      var g = K.chart(ctx, { x: 4, y: y0 + 28, w: W - 130, h: h - 30, x0: 0, x1: 12, y0: -5, y1: 25, xt: 6, yt: 3, pb: 26, xf: function (t) { return t + "시간"; }, yf: function (t) { return t + " ℃"; }, pl: 50 });
      K.line(ctx, { x: g.L, y: g.Y(-3) }, { x: g.R, y: g.Y(-3) }, "rgba(127,211,255,.45)", 1.2, [4, 4]);
      K.t(ctx, "바깥 −3 ℃", g.L + 6, g.Y(-3) - 6, { s: 10.5, c: KC.blue });
      if (ran) {
        var ends = [], n = ran.a.length;
        [["a", KC.blue, "A"], ["b", KC.red, "B" + (VARS[0].diff ? "(필로티)" : "")]].forEach(function (s) {
          var arr = ran[s[0]], pts = arr.map(function (t, i) { return [i / (n - 1) * 12, t]; });
          ctx.save(); ctx.globalAlpha = .25; K.plot(ctx, g, pts, s[1]); ctx.restore();
          K.plot(ctx, g, pts.filter(function (p) { return p[0] <= playT + 1e-6; }), s[1]);
          var tv = tempAt(arr, playT); K.glow(ctx, g.X(playT), g.Y(tv), 4, s[1], 2.6);
          ends.push([s[2] + " " + tv.toFixed(1) + " ℃", g.Y(tv), s[1]]);
        });
        if (Math.abs(ends[0][1] - ends[1][1]) < 24) { var mid = (ends[0][1] + ends[1][1]) / 2, up = ends[0][1] <= ends[1][1] ? 0 : 1; ends[up][1] = mid - 12; ends[1 - up][1] = mid + 12; }
        ends.forEach(function (e) { K.pill(ctx, e[0], g.R + 8, e[1] + 4, { s: 11, c: e[2] }); });
      } else K.pill(ctx, "▶ 밤새 식혀 보기를 누르면 12시간 온도 변화가 그려집니다", (g.L + g.R) / 2, (g.T + g.B) / 2, { s: 12, a: "center", c: KC.mute });
    }
    function draw() { ctx.clearRect(0, 0, W, H); drawModel(); drawChart(); }
    $("md-run").addEventListener("click", function () { playT = REDUCE ? 12 : 0; draw(); });
    K.animate(canvas, function (dt) {
      var moved = false;
      if (ran && playT < 12) { playT = Math.min(12, playT + dt / 1000 * 3); moved = true; }
      if (anim.on) { ph += dt / 1000; moved = true; }
      if (moved) draw();
    }, 24);
    $("md-run").addEventListener("click", function () {
      ran = curves(); draw();
      var others = VARS.filter(function (x) { return !x.key && x.diff; }).map(function (x) { return x.t; });
      if (!VARS[0].diff) { $("md-info").innerHTML = "두 모형의 바닥 아래 공간이 같습니다. 가설의 <b>조작 변인</b>을 다르게 해야 비교할 수 있습니다."; return; }
      if (others.length) { $("md-info").innerHTML = "온도 차이는 보이지만 <b>" + others.join(", ") + "</b>도 달라, 차이가 바닥 때문인지 알 수 없습니다. 통제 변인은 같게 두세요."; return; }
      var d = ran.a[ran.a.length - 1] - ran.b[ran.b.length - 1];
      $("md-info").innerHTML = "공정한 실험입니다. 12시간 뒤 필로티 모형(B)이 <b>" + d.toFixed(1) + " ℃</b> 더 낮습니다. 바닥 아래 공간만 달랐으니 이 차이는 바닥 때문이라고 말할 수 있습니다.";
      if (!ep.cleared(3)) {
        window.sthState("mdBest", "바닥 아래 공간만 다르게 → 필로티 모형이 12시간 뒤 " + d.toFixed(1) + " ℃ 더 낮음");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("mdBest") + ". 가설이 모형 실험으로 지지되었습니다.");
        ep.clear(3); ep.clear(4);
      }
    });
    canvas._redraw = draw; draw();
    if (ep.cleared(3)) window.sthMission("m1-4", true);
  })();

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("mdBest") || "")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 짐작</b> " + (p || "기록 없음") + "<br><b>데이터 가공</b> " + (window.sthState("clBest") || "-") + "<br><b>모형 실험</b> " + (window.sthState("mdBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ① 필로티 2층은 왜 추울까",
    items: [
      { id: "w1", label: "내가 세운 가설", hint: "탐구 문제 하나를 정하고, 검증 가능한 가설로 바꿔 쓰세요.", ph: "문제: … / 가설: …" },
      { id: "e1b", label: "모형 실험 설계서", hint: "위 가설을 검증할 모형 실험에서 조작 변인·종속 변인·통제 변인을 적고, 공공 데이터를 어떻게 함께 쓸지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 커피 필터 낙하 실험
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "첫 예상",
    question: "필터를 여러 장 겹쳐 떨어뜨리면 종단 속도는 어떻게 될까요?",
    options: ["㉠ 무게와 관계없이 같다", "㉡ 무거울수록 커진다", "㉢ 무거울수록 작아진다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — MBL 절차와 측정 간격 */
  (function () {
    var got = window.sthState("mblGot") || { a: false, b: false }, rate = 5;
    var STEPS = ["① 센서와 분석 프로그램이 도는 기기를 유선 또는 블루투스로 연결한다", "② 수집을 시작하면 측정값이 실시간으로 기기에 전송된다", "③ 분석 프로그램으로 그래프·통계를 만든다", "④ 모둠의 데이터와 분석 결과를 네트워크로 공유한다"];
    function mission() {
      if (got.a) done("m2-2a"); if (got.b) done("m2-2b");
      if (got.a && got.b) { window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>MBL 준비 끝. 1초에 " + (got.r || 20) + "번이면 1.5초 낙하 동안 " + Math.round(1.5 * (got.r || 20)) + "개의 점을 얻습니다."); ep.clear(1); }
    }
    if (got.a) filledOrder("s2-order", STEPS);
    else window.sthOrder({ mount: "s2-order", steps: STEPS, onDone: function () { got.a = true; window.sthState("mblGot", got); mission(); } });
    var canvas = $("c-rate"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var st = { on: !REDUCE }, tA = 0, ping = 0, lastK = -1;
    function pos(t) { return 4 / 9.8 * Math.log(Math.cosh(9.8 * t / 2)); }   /* 종단 속도 2 m/s 인 낙하 */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var n = Math.floor(1.5 * rate) + 1, LW = 200, good = n >= 30 && rate <= 50;
      K.studio(ctx, 0, 0, W, H, { x: 110, y: H - 12, rx: 90, ry: 8 });
      /* ── 왼쪽: 나무 낙하대 + 동작 감지 센서 ── */
      var sx = 120, sy = 30, t = tA % 1.8, tt = Math.min(t, 1.5), fy = 50 + pos(tt) / pos(1.5) * (H - 86);
      SP.poly(ctx, [{ x: 30, y: H - 20 }, { x: 180, y: H - 20 }, { x: 192, y: H - 30 }, { x: 42, y: H - 30 }], "#e4bd86");
      ctx.fillStyle = "#a8763f"; ctx.fillRect(30, H - 20, 150, 8);
      var pg = ctx.createLinearGradient(52, 0, 62, 0); pg.addColorStop(0, "#c9965a"); pg.addColorStop(1, "#7d5428"); ctx.fillStyle = pg; ctx.fillRect(52, 16, 10, H - 40);
      ctx.fillStyle = "#8a5d30"; ctx.fillRect(52, 16, 96, 8);
      ctx.fillStyle = "#2a303b"; ctx.beginPath(); ctx.roundRect(sx - 26, sy - 6, 52, 20, 5); ctx.fill();
      [-9, 9].forEach(function (o) { ctx.fillStyle = "#0b0f22"; ctx.beginPath(); ctx.arc(sx + o, sy + 4, 6, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(127,211,255,.8)"; ctx.lineWidth = 1; ctx.stroke(); });
      if (ping > .02) { ctx.strokeStyle = "rgba(28,126,214," + ping * .8 + ")"; ctx.lineWidth = 1.6; for (var a = 0; a < 3; a++) { var rr = 14 + a * 10 + (1 - ping) * 24; ctx.beginPath(); ctx.arc(sx, sy + 12, rr, Math.PI * .25, Math.PI * .75); ctx.stroke(); } }
      K.line(ctx, { x: sx, y: sy + 16 }, { x: sx, y: fy - 4 }, "rgba(28,126,214,.35)", 1, [3, 4]);
      filter(ctx, sx, fy, 46, 1);
      K.pill(ctx, "동작 감지 센서", 196, 34, { s: 10.5, a: "right", c: "#bfe6ff", box: [0, LW] });
      /* ── 오른쪽 흰 카드: 찍힌 점 ── */
      var RX = LW + 8, cw = W - RX - 12;
      K.card(ctx, RX, 8, cw, H - 16, "낙하 1.5초 동안 찍힌 점 " + n + "개");
      var g = SP.chart(ctx, { x: RX + 4, y: 46, w: cw - 12, h: H - 58, x0: 0, x1: 1.5, y0: 0, y1: 2.2, xt: 3, yt: 2, xf: function (x) { return x.toFixed(1) + " s"; }, yf: function (y) { return y.toFixed(1); }, pl: 40, yl: "속력(m/s)" });
      var curve = []; for (var s = 0; s <= 1.5 + 1e-9; s += 0.01) curve.push([s, Math.tanh(9.8 * s / 2) * 2]);
      SP.plot(ctx, g, curve, "rgba(28,126,214,.5)", { w: 1.6, glow: false });
      var noise = rate > 50 ? 0.25 : 0.03, r = seeded(rate);
      for (var k = 0; k < n; k++) { var tk = k / rate, vk = Math.tanh(9.8 * tk / 2) * 2 + gauss(r) * noise; ctx.fillStyle = LT.orange; ctx.beginPath(); ctx.arc(g.X(tk), g.Y(clamp(vk, 0, 2.2)), n > 60 ? 2.2 : 3.6, 0, 6.2832); ctx.fill(); }
      K.line(ctx, { x: g.X(tt), y: g.T }, { x: g.X(tt), y: g.B }, "rgba(28,126,214,.3)", 1);
      K.t(ctx, good ? "✅ 알맞은 간격" : (n < 30 ? "점이 너무 적어 변화가 안 보임" : "너무 촘촘해 속도 잡음이 커짐"), W - 28, 30, { s: 12, w: "900", a: "right", c: good ? LT.green : LT.red });
      return n;
    }
    function update() {
      var n = draw();
      $("rt-info").innerHTML = "1초에 " + rate + "번 측정 → 1.5초 동안 " + n + "개. 측정 간격(" + (1000 / rate).toFixed(0) + " ms)이 현상의 빠르기보다 충분히 짧아야 변화가 보입니다.";
      if (n >= 30 && rate <= 50 && !got.b) { got.b = true; got.r = rate; window.sthState("mblGot", got); mission(); }
    }
    canvas._redraw = draw;
    $("rt-v").addEventListener("input", function (e) { rate = +e.target.value; $("rt-v-val").textContent = rate + "번"; update(); });
    pauser("rt-play", st, ["낙하 멈추기", "낙하 보기"]);
    K.animate(canvas, function (dt) {
      if (!st.on) return;
      tA += dt / 1000 / 4;                                 /* ¼ 느린 화면 */
      var t = tA % 1.8, k = t <= 1.5 ? Math.floor(t * Math.min(rate, 20)) : -2;
      if (k !== lastK) { lastK = k; if (k >= 0) ping = 1; }
      ping = Math.max(0, ping - dt / 300);
      draw();
    });
    update(); mission();
  })();

  /* 장면 3 — 시각화 분류 */
  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "graph", label: "📈 그래프", sub: "수치 관계·시간 변화" }, { id: "chart", label: "📊 차트", sub: "막대·부채꼴 크기로 비교" }, { id: "diagram", label: "🗺️ 다이어그램·지도", sub: "관계·구조·지리적 분포" }],
    items: [
      { t: "커피 필터의 속도가 시간에 따라 어떻게 변하는지", a: "graph", why: "시간에 따른 변화는 그래프가 가장 잘 보여 줍니다." },
      { t: "한 달 동안 매일 잰 우리 동네 미세 먼지 농도의 변화 추이", a: "graph", why: "시간 변화 추이입니다." },
      { t: "여러 나라의 연도별 이산화 탄소 배출량 증가 추세", a: "graph", why: "여러 계열의 변화를 한 좌표계에 선으로 나타냅니다." },
      { t: "반 학생들이 좋아하는 계절별 인원수 비교", a: "chart", why: "크기 비교는 막대 차트가 알맞습니다." },
      { t: "설문 응답자의 혈액형별 인원수", a: "chart", why: "막대의 크기로 비교합니다." },
      { t: "필터 1~6장의 종단 속도를 나란히 비교", a: "chart", why: "항목별 크기 비교입니다.", hint: "시간 변화가 아니라 항목 사이의 크기 비교입니다." },
      { t: "우리 지역 재활용 쓰레기 배출 장소와 수거 동선", a: "diagram", why: "지리적 분포와 동선은 지도가 알맞습니다." },
      { t: "먹이 그물처럼 여러 생물 사이의 관계 구조", a: "diagram", why: "관계 구조는 다이어그램입니다." },
      { t: "MBL의 센서 → 기기 → 분석 → 공유로 이어지는 흐름", a: "diagram", why: "과정의 흐름과 연결은 다이어그램으로 나타냅니다." }
    ],
    onDone: function () { window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>시각화는 데이터가 아니라 <b>목적</b>에 맞춰 고릅니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m2-3", true);

  /* 장면 4 — 낙하 그래프 */
  (function () {
    var canvas = $("c-fall"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, view = "xt", n = 1, g = 9.8;
    function vt(k) { return Math.sqrt(k); }
    function vel(t, k) { var u = vt(k); return u * Math.tanh(g * t / u); }
    function pos(t, k) { var u = vt(k); return u * u / g * Math.log(Math.cosh(g * t / u)); }
    var st = { on: !REDUCE }, tA = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 236, T = 1.5, t = Math.min(tA % 1.9, T), u = vel(t, n), Fw = 10 + 9 * n, Fd = Fw * Math.pow(u / vt(n), 2);
      K.studio(ctx, 0, 0, W, H, { x: 118, y: H - 30, rx: 100, ry: 10 });
      /* ── 왼쪽: 눈금 기둥이 있는 낙하대와 힘 화살표 ── */
      var top = 70, bot = H - 100, fx = 104, fy = top + pos(t, n) / Math.max(pos(T, n), 1e-6) * (bot - top);
      SP.poly(ctx, [{ x: 24, y: H - 60 }, { x: 214, y: H - 60 }, { x: 226, y: H - 70 }, { x: 36, y: H - 70 }], "#e4bd86");
      ctx.fillStyle = "#a8763f"; ctx.fillRect(24, H - 60, 190, 8);
      var pg = ctx.createLinearGradient(LW - 40, 0, LW - 26, 0); pg.addColorStop(0, "#f3e2c0"); pg.addColorStop(1, "#c9a46a"); ctx.fillStyle = pg; ctx.fillRect(LW - 40, top - 10, 14, H - 60 - top + 10);
      ctx.strokeStyle = "rgba(90,55,20,.7)"; ctx.lineWidth = 1;
      for (var m = 0; m <= 8; m++) { var my = top + m / 8 * (bot - top); ctx.beginPath(); ctx.moveTo(LW - 40, my); ctx.lineTo(LW - (m % 2 ? 34 : 30), my); ctx.stroke(); }
      filter(ctx, fx, fy - 10, 50, n);
      var cyF = fy + 6;
      K.arrow(ctx, { x: fx + 36, y: cyF }, { x: fx + 36, y: cyF + Fw }, LT.red, 3.2, 9);
      if (Fd > 4) K.arrow(ctx, { x: fx - 36, y: cyF }, { x: fx - 36, y: cyF - Fd }, LT.blue, 3.2, 9);
      K.pill(ctx, "중력", fx + 46, cyF + 16, { s: 10.5, c: "#ffb3bd", box: [0, LW] });
      if (Fd > 4) K.pill(ctx, "공기 저항", fx - 44, cyF - 6, { s: 10.5, a: "right", c: "#bfe6ff", box: [0, LW] });
      K.pill(ctx, "필터 " + n + "장 · 속력 " + u.toFixed(2) + " m/s", LW / 2, H - 16, { s: 12, a: "center", c: Math.abs(u - vt(n)) < 0.02 ? "#7ff0c4" : KC.ink, box: [0, LW] });
      K.pill(ctx, "느린 화면", 16, 28, { s: 10.5, c: KC.ink });
      /* ── 오른쪽 흰 카드: 고른 시각 자료 ── */
      var RX = LW + 8, cw = W - RX - 12, g;
      if (view === "bar") {
        K.card(ctx, RX, 10, cw, H - 20, "필터 수별 마지막 속도 (막대 차트)");
        g = SP.chart(ctx, { x: RX + 4, y: 50, w: cw - 12, h: H - 66, x0: 0, x1: 6, y0: 0, y1: 2.6, xt: 6, yt: 2, xf: function () { return ""; }, yf: function (y) { return y.toFixed(1); }, pl: 44 });
        for (var k = 1; k <= 6; k++) {
          var bx = g.X(k - 0.5), top2 = g.Y(vt(k)), on = k === n, c = SP.mt(on ? "red" : "#9aa5b4");
          SP.poly(ctx, [{ x: bx + 26, y: g.B }, { x: bx + 34, y: g.B - 6 }, { x: bx + 34, y: top2 - 6 }, { x: bx + 26, y: top2 }], c[2]);
          SP.poly(ctx, [{ x: bx - 26, y: top2 }, { x: bx + 26, y: top2 }, { x: bx + 34, y: top2 - 6 }, { x: bx - 18, y: top2 - 6 }], c[0]);
          ctx.fillStyle = c[1]; ctx.fillRect(bx - 26, top2, 52, g.B - top2);
          K.t(ctx, k + "장", bx, g.B + 16, { s: 10.5, w: "800", a: "center", c: on ? LT.ink : LT.mute });
        }
        K.t(ctx, "시간에 따른 변화는 안 보인다", RX + cw - 16, 30, { s: 11.5, w: "900", a: "right", c: LT.orange });
      } else {
        var xt = view === "xt";
        K.card(ctx, RX, 10, cw, H - 20, xt ? "떨어진 거리 — 시간 (위치-시간 그래프)" : "속력 — 시간 (속도-시간 그래프)");
        g = SP.chart(ctx, { x: RX + 4, y: 50, w: cw - 12, h: H - 66, x0: 0, x1: T, y0: 0, y1: xt ? 2.4 : 2.6, xt: 3, yt: xt ? 3 : 2, xf: function (x) { return x.toFixed(1) + "초"; }, yf: function (y) { return y.toFixed(1); }, pl: 44, yl: xt ? "거리(m)" : "속력(m/s)" });
        var pts = []; for (var s = 0; s <= T + 1e-9; s += 0.01) pts.push([s, xt ? pos(s, n) : vel(s, n)]);
        SP.plot(ctx, g, pts, LT.red, { w: 3 });
        if (!xt) {
          K.line(ctx, { x: g.L, y: g.Y(vt(n)) }, { x: g.R, y: g.Y(vt(n)) }, "#d9a400", 1.6, [5, 4]);
          SP.lbl(ctx, "평평해진 높이 = 종단 속도 " + vt(n).toFixed(2) + " m/s", g.R - 4, g.Y(vt(n)) + 18, { s: 11.5, a: "right", c: "#b86e00" });
        } else K.t(ctx, "기울기(속력)가 일정해지는 곳을 찾아야 한다", RX + cw - 16, 30, { s: 11.5, w: "800", a: "right", c: LT.mute });
        ctx.fillStyle = LT.orange; ctx.beginPath(); ctx.arc(g.X(t), g.Y(xt ? pos(t, n) : u), 5.5, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    function update() {
      draw();
      $("fl-info").innerHTML = view === "vt" ? "속도-시간 그래프는 처음에 가파르게 오르다 평평해집니다. 평평해진 높이가 종단 속도입니다. 필터 " + n + "장 → <b>" + vt(n).toFixed(2) + " m/s</b>." : (view === "xt" ? "위치-시간 그래프에서는 기울기가 속력이라 종단 속도를 바로 읽기 어렵습니다." : "막대 차트는 크기 비교에는 좋지만 시간에 따라 속도가 어떻게 변하는지는 보여 주지 않습니다.");
      if (view === "vt" && vt(n) >= 1.9 && vt(n) <= 2.1 && !ep.cleared(3)) {
        window.sthState("flBest", "속도-시간 그래프 · 필터 " + n + "장 → 종단 속도 " + vt(n).toFixed(2) + " m/s");
        window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("flBest") + ". 무게가 4배면 종단 속도는 2배 — 무거울수록 빨라지지만 비례하지는 않습니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("fl-v", "data-v", function (x) { view = x; update(); });
    $("fl-n").addEventListener("input", function (e) { n = +e.target.value; $("fl-n-val").textContent = n + "장"; update(); });
    pauser("fl-play", st, ["낙하 멈추기", "낙하 보기"]);
    K.animate(canvas, function (dt) { if (st.on) { tA += dt / 1000 / 3; draw(); } });
    update();
    if (ep.cleared(3)) window.sthMission("m2-4", true);
  })();

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("flBest") || "")); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 예상</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 맞았습니다." : " — 그래프는 무거울수록 커진다고 말합니다.") + "<br><b>나의 그래프</b> " + (window.sthState("flBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ② 커피 필터 낙하 실험",
    items: [
      { id: "e2a", label: "디지털 도구로 데이터를 모은 과정", hint: "MBL의 네 단계를 따라 우리 모둠이 한 일을 쓰고, 측정 간격을 그렇게 정한 까닭을 쓰세요." },
      { id: "e2b", label: "이 그래프를 고른 까닭", hint: "종단 속도를 보여 주려고 어떤 시각 자료를 골랐는지, 다른 것보다 나은 점을 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 학교 자기장 지도
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });
  var PL = [{ name: "교실", m: 57, sd: 4, c: "--teal" }, { name: "과학실", m: 64, sd: 5, c: "--coral" }, { name: "복도", m: 62, sd: 4.5, c: "--brand" }, { name: "운동장", m: 63, sd: 6, c: "--violet" }];
  PL.forEach(function (p, i) { var r = seeded(i * 131 + 7); p.s = []; for (var k = 0; k < 100; k++) p.s.push(p.m + gauss(r) * p.sd); });
  function avg(p, n) { var s = 0; for (var k = 0; k < n; k++) s += p.s[k]; return s / n; }
  var PRGB = { "--teal": "63,211,163", "--coral": "255,107,129", "--brand": "127,211,255", "--violet": "182,156,255" };
  function pc(p, a) { return "rgba(" + PRGB[p.c] + "," + (a == null ? 1 : a) + ")"; }

  window.sthGate({
    gate: "g3", key: "p3", title: "선생님의 물음",
    question: "교실 55, 과학실 68 — 한 번씩 잰 두 값으로 ‘과학실 자기장이 더 세다’고 결론 내려도 될까요?",
    options: ["㉠ 된다 — 68이 더 크니까", "㉡ 안 된다 — 측정마다 흔들림이 있으니 여러 번 재어 퍼짐까지 봐야 한다", "㉢ 된다 — 스마트폰은 틀리지 않으니까"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 표준 편차 */
  (function () {
    var got = window.sthState("sdGot") || { a: false, b: false };
    var FIG = "<table><tr><th></th><th>1회</th><th>2회</th><th>3회</th><th>4회</th><th>5회</th><th>평균</th><th>표준 편차</th></tr><tr><td>앱 A</td><td>50</td><td>51</td><td>49</td><td>50</td><td>50</td><td>50</td><td>약 0.7</td></tr><tr><td>앱 B</td><td>45</td><td>55</td><td>48</td><td>52</td><td>50</td><td>50</td><td>약 3.8</td></tr></table><div style=\"font-size:12px;margin:4px 0 0\">표준 편차는 (n − 1)로 나눈 표본 표준 편차입니다(n으로 나누면 0.6, 3.4).</div>";
    function mission() { if (got.a && got.b) { window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>평균이 같아도 표준 편차가 작은 쪽이 더 믿을 만합니다. 평균만으로는 데이터의 특성을 다 알 수 없습니다."); ep.clear(1); } }
    window.sthPick({
      mount: "s3-q1",
      q: "같은 자리를 두 앱으로 다섯 번씩 쟀습니다. 더 믿을 만한 앱은?" + FIG,
      options: ["앱 A — 값이 평균 둘레에 좁게 모여 있다(표준 편차가 작다)", "앱 B — 값이 다양해서 더 많은 정보를 준다", "평균이 같으니 둘 다 똑같다"],
      answer: 0,
      why: ["표준 편차가 작을수록 측정이 일정합니다(정밀도가 높음).", "값이 넓게 흩어지는 것은 측정이 불안정하다는 뜻입니다.", "평균이 같아도 퍼짐이 다르면 믿을 만한 정도가 다릅니다."],
      onDone: function () { got.a = true; window.sthState("sdGot", got); mission(); }
    });
    window.sthPick({
      mount: "s3-q2",
      q: "앱 B로 한 번만 재서 45가 나왔다면, 참값이 50 이라도 이상하지 않은 까닭은?",
      options: ["앱 B는 표준 편차가 커서 한 번 잰 값이 평균에서 5쯤 벗어나는 일이 흔하기 때문", "45가 참값이기 때문", "앱이 고장 났기 때문"],
      answer: 0,
      why: ["퍼짐이 큰 측정은 한두 번의 값만으로 결론을 내리기 어렵습니다. 여러 번 재어 평균을 내야 합니다.", "한 번의 값은 참값에서 벗어날 수 있습니다.", "측정은 원래 흔들립니다. 그 정도를 표준 편차로 나타냅니다."],
      onDone: function () { got.b = true; window.sthState("sdGot", got); mission(); }
    });
    mission();
  })();

  /* 장면 3 — 측정 횟수와 오차 막대 (기존 시뮬레이션) */
  (function () {
    var canvas = $("c4"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 3;
    var ICON = ["🏫", "🧪", "🚪", "⚽"];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var PD = { "--teal": "#0f9f76", "--coral": "#e03131", "--brand": "#1c7ed6", "--violet": "#7048e8" };
      K.studio(ctx, 0, 0, W, H);
      K.card(ctx, 10, 10, W - 20, H - 20, "장소별 평균 자기장 (μT) · 오차 막대 = 표준 오차");
      var g = SP.chart(ctx, { x: 16, y: 50, w: W - 32, h: H - 66, x0: 0, x1: 4, y0: 0, y1: 75, xt: 4, yt: 3, xf: function () { return ""; }, pl: 40, yl: "μT" });
      PL.forEach(function (p, i) {
        var a = avg(p, n), se = p.sd / Math.sqrt(n), cx = g.X(i + 0.5), bw = 90, by = g.Y(a), DX = 12, DY = -9, c = SP.mt(PD[p.c]);
        SP.poly(ctx, [{ x: cx + bw / 2, y: g.B }, { x: cx + bw / 2 + DX, y: g.B + DY }, { x: cx + bw / 2 + DX, y: by + DY }, { x: cx + bw / 2, y: by }], c[2]);
        SP.poly(ctx, [{ x: cx - bw / 2, y: by }, { x: cx + bw / 2, y: by }, { x: cx + bw / 2 + DX, y: by + DY }, { x: cx - bw / 2 + DX, y: by + DY }], c[0]);
        ctx.globalAlpha = .85; ctx.fillStyle = c[1]; ctx.fillRect(cx - bw / 2, by, bw, g.B - by); ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(255,255,255,.7)";
        for (var k = 0; k < Math.min(n, 40); k++) { var jx = cx - 30 + ((k * 37) % 60); ctx.beginPath(); ctx.arc(jx, g.Y(clamp(p.s[k], 0, 75)), 1.8, 0, 6.2832); ctx.fill(); }
        var yt = g.Y(a + se), yb = g.Y(a - se);
        ctx.strokeStyle = LT.ink; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(cx, yt); ctx.lineTo(cx, yb); ctx.moveTo(cx - 9, yt); ctx.lineTo(cx + 9, yt); ctx.moveTo(cx - 9, yb); ctx.lineTo(cx + 9, yb); ctx.stroke();
        K.pill(ctx, a.toFixed(1) + " ± " + se.toFixed(2), cx, Math.max(64, Math.min(yt, by) - 16), { s: 11.5, a: "center", c: se <= 1 + 1e-9 ? "#7ff0c4" : KC.ink });
        K.t(ctx, ICON[i] + " " + p.name + " (σ " + p.sd + ")", cx, g.B + 18, { s: 11.5, w: "900", a: "center", c: PD[p.c] });
      });
    }
    function update() {
      draw();
      var maxSe = Math.max.apply(null, PL.map(function (p) { return p.sd / Math.sqrt(n); }));
      $("c4-n-val").textContent = n;
      put("c4-read",
        "<span class='k'>측정 횟수</span><span class='v b'>장소마다 " + n + "번</span>" +
        "<span class='k'>가장 큰 표준 오차</span><span class='v " + (maxSe <= 1 + 1e-9 ? "g" : "y") + "'>" + maxSe.toFixed(2) + " μT</span><span class='sub'>운동장 σ 6 ÷ √" + n + "</span>" +
        "<span class='ok " + (maxSe <= 1 + 1e-9 ? "g" : "r") + "'>" + (maxSe <= 1 + 1e-9 ? "모든 장소의 표준 오차 1 μT 이하" : "아직 1 μT보다 큰 장소가 있습니다") + "</span>");
      $("c4-info").innerHTML = "장소마다 " + n + "번 → 가장 큰 표준 오차 <b>" + maxSe.toFixed(2) + " μT</b>. 측정 횟수가 늘수록 표준 오차(σ/√n)가 줄어 평균을 더 믿을 수 있습니다.";
      if (maxSe <= 1 + 1e-9 && n <= 46 && !ep.cleared(2)) {
        window.sthState("seBest", "장소마다 " + n + "번 → 표준 오차 모두 1 μT 이하");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("seBest") + ". 표준 편차가 가장 큰 운동장(6 μT)이 기준을 정합니다: 6 ÷ √36 = 1.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("c4-n").addEventListener("input", function (e) { n = +e.target.value; update(); });
    update();
    if (ep.cleared(2)) window.sthMission("m3-3", true);
  })();

  /* 장면 4 — 막대가 겹치는가 */
  (function () {
    var canvas = $("c-ht"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pair = 0, n = 3;
    var got = window.sthState("htGot") || { a: false, b: false };
    function sep(i, k) { var a = PL[i], b = PL[1], ma = avg(a, k), mb = avg(b, k), ea = 2 * a.sd / Math.sqrt(k), eb = 2 * b.sd / Math.sqrt(k); return { ma: ma, mb: mb, ea: ea, eb: eb, apart: Math.abs(ma - mb) > ea + eb }; }
    var FIRST = 100; for (var k = 3; k <= 100; k++) if (sep(0, k).apart) { FIRST = k; break; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = sep(pair, n), x0 = 60, x1 = 840, y = [116, 214], PD = { "--teal": "#0f9f76", "--coral": "#e03131", "--brand": "#1c7ed6", "--violet": "#7048e8" };
      function X(m) { return x0 + (m - 45) / 30 * (x1 - x0); }
      K.studio(ctx, 0, 0, W, H);
      K.card(ctx, 10, 10, W - 20, H - 20, "평균 ± 2 × 표준 오차 · 측정 " + n + "번");
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(x0, 62, x1 - x0, 176);
      for (var m = 45; m <= 75; m += 5) { K.line(ctx, { x: X(m), y: 62 }, { x: X(m), y: 238 }, LT.grid, 1); K.t(ctx, m + " μT", X(m), 256, { s: 10.5, a: "center", c: LT.mute, w: "600" }); }
      var A = [r.ma - r.ea, r.ma + r.ea], B = [r.mb - r.eb, r.mb + r.eb], lo = Math.max(A[0], B[0]), hi = Math.min(A[1], B[1]);
      if (!r.apart && hi > lo) {
        ctx.fillStyle = "rgba(224,49,49,.16)"; ctx.fillRect(X(lo), y[0], X(hi) - X(lo), y[1] - y[0]);
        K.pill(ctx, "겹침", (X(lo) + X(hi)) / 2, (y[0] + y[1]) / 2 + 5, { s: 11.5, a: "center", c: "#ffb3bd" });
      } else if (r.apart) {
        var gL = Math.min(A[1], B[1]), gR = Math.max(A[0], B[0]);
        ctx.fillStyle = "rgba(15,159,118,.16)"; ctx.fillRect(X(gL), y[0], X(gR) - X(gL), y[1] - y[0]);
        K.pill(ctx, "틈", (X(gL) + X(gR)) / 2, (y[0] + y[1]) / 2 + 5, { s: 11.5, a: "center", c: "#7ff0c4" });
      }
      [[PL[pair], r.ma, r.ea], [PL[1], r.mb, r.eb]].forEach(function (q, i) {
        var a = X(clamp(q[1] - q[2], 44, 76)), b = X(clamp(q[1] + q[2], 44, 76)), col = PD[q[0].c];
        ctx.fillStyle = "rgba(20,30,50,.15)"; ctx.beginPath(); ctx.roundRect(a + 2, y[i] - 4, Math.max(4, b - a), 14, 7); ctx.fill();
        var bg = ctx.createLinearGradient(0, y[i] - 7, 0, y[i] + 7); bg.addColorStop(0, K.tint(col, 1.3)); bg.addColorStop(1, col);
        ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(a, y[i] - 7, Math.max(4, b - a), 14, 7); ctx.fill();
        K.planet(ctx, X(q[1]), y[i], 8, "#ffffff", col);
        K.pill(ctx, q[0].name + " " + q[1].toFixed(1) + " ± " + q[2].toFixed(1) + " μT", X(q[1]), y[i] - 18, { s: 12, a: "center", c: "#ffffff" });
      });
      K.t(ctx, r.apart ? "막대가 떨어짐 — 차이가 있다고 말할 근거" : "막대가 겹침 — 차이를 주장하기 어려움", W - 28, 32, { s: 12.5, w: "900", a: "right", c: r.apart ? LT.green : LT.red });
      return r;
    }
    function update() {
      var r = draw(), ch = false;
      $("ht-info").innerHTML = PL[pair].name + " " + r.ma.toFixed(1) + " μT, 과학실 " + r.mb.toFixed(1) + " μT (측정 " + n + "번). 차이 " + Math.abs(r.ma - r.mb).toFixed(1) + " μT, 두 막대 반쪽 길이의 합 " + (r.ea + r.eb).toFixed(1) + " μT.";
      if (pair === 0 && r.apart && n <= FIRST + 5 && !got.a) { got.a = ch = true; got.n = n; }
      if (pair === 3 && n === 100 && !r.apart && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("htGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-4a"); if (got.b) done("m3-4b");
      if (got.a && got.b) {
        window.sthState("htBest", "교실·과학실은 " + got.n + "번 재면 구별, 운동장·과학실은 100번 재도 구별 안 됨");
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("htBest") + ". 가설의 일부만 데이터로 지지됩니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("ht-p", "data-v", function (x) { pair = +x; update(); });
    $("ht-n").addEventListener("input", function (e) { n = +e.target.value; $("ht-n-val").textContent = n; update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("htBest") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 판단</b> " + (p || "기록 없음") + "<br><b>측정 횟수</b> " + (window.sthState("seBest") || "-") + "<br><b>가설 검증</b> " + (window.sthState("htBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ③ 학교 자기장 지도",
    items: [
      { id: "w2", label: "평균만으로는 모자란 이유", hint: "같은 평균인데 성질이 다른 두 자료를 떠올려 보고, 표준편차가 왜 필요한지 쓰세요." },
      { id: "e3b", label: "자기장 가설 검증 보고", hint: "‘과학실 자기장이 더 세다’는 가설 가운데 무엇이 지지되고 무엇이 보류되었는지, 측정 횟수와 오차 막대를 근거로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 선크림 보고서
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "첫 생각",
    question: "측정한 세 점(0.5, 1.0, 1.5 mg/cm²)을 직선으로 이어 2.0 mg/cm²의 차단율을 예측해도 될까요?",
    options: ["㉠ 된다 — 점이 직선에 가깝다", "㉡ 조심해야 한다 — 측정 범위 밖이고, 차단율은 100%를 넘을 수 없다", "㉢ 아예 예측할 수 없다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 내삽·외삽 (기존 시뮬레이션) */
  (function () {
    var canvas = $("c5"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, mode = "inter", noise = 1.0;
    var got = window.sthState("ieGot") || { i: false, e: false, big: false };
    var pts = []; for (var i = 0; i <= 8; i++) pts.push({ x: i, y: 3 + Math.sin(i * 0.6) * 1.6 + i * 0.35 });
    pts.push({ x: 9, y: 3 + Math.sin(9 * 0.6) * 1.6 + 9 * 0.35 }); pts.push({ x: 10, y: 3 + Math.sin(10 * 0.6) * 1.6 + 10 * 0.35 });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      K.studio(ctx, 0, 0, W, H);
      K.card(ctx, 10, 10, W - 20, H - 20, mode === "inter" ? "내삽 — 측정 범위 안의 빈곳 예측" : "외삽 — 측정 범위 밖 예측");
      var gr = SP.chart(ctx, { x: 16, y: 50, w: W - 32, h: H - 66, x0: 0, x1: 10, y0: 0, y1: 9, xt: 10, yt: 3, pl: 40, xl: "조건(예: 바른 양)", yl: "측정값" });
      function P(p) { return { x: gr.X(p.x), y: gr.Y(Math.max(-2, Math.min(11, p.y))) }; }
      var padL = gr.L, padT = gr.T, cw = gr.R - gr.L, chh = gr.B - gr.T;
      var gs = mode === "inter" ? 2 : 6, ge = mode === "inter" ? 6 : 10;
      var known = pts.filter(function (p) { return mode === "inter" ? (p.x <= 2 || (p.x >= 6 && p.x <= 8)) : p.x <= 6; });
      var pred = pts.filter(function (p) { return p.x >= gs - 0.01 && p.x <= ge + 0.01; }), up = [], lo = [];
      pred.forEach(function (p) { var d = mode === "inter" ? Math.min(Math.abs(p.x - gs), Math.abs(p.x - ge)) : p.x - gs, b = noise * (0.15 + (mode === "inter" ? 0.35 : 0.9) * d) * 0.5; up.push({ x: p.x, y: p.y + b }); lo.push({ x: p.x, y: p.y - b }); });
      var g1 = P({ x: gs, y: 0 }).x, g2 = P({ x: ge, y: 0 }).x;
      ctx.fillStyle = "rgba(245,159,0,.10)"; ctx.fillRect(g1, padT, g2 - g1, chh);
      ctx.save(); ctx.beginPath(); ctx.rect(padL, padT, cw, chh); ctx.clip();
      ctx.fillStyle = "rgba(224,49,49,.22)"; ctx.beginPath();
      up.forEach(function (p, k) { var q = P(p); if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); });
      for (var k = lo.length - 1; k >= 0; k--) { var q2 = P(lo[k]); ctx.lineTo(q2.x, q2.y); }
      ctx.closePath(); ctx.fill();
      ctx.save(); ctx.strokeStyle = LT.red; ctx.lineWidth = 2.4; ctx.setLineDash([6, 5]); ctx.beginPath();
      pred.forEach(function (p, i) { var q = P(p); if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.stroke(); ctx.restore();
      ctx.restore();
      known.forEach(function (p) { var q = P(p); K.planet(ctx, q.x, q.y, 6, "#9ff0d4", "#0f7a55"); });
      K.line(ctx, { x: g1, y: padT }, { x: g1, y: padT + chh }, "rgba(217,164,0,.7)", 1, [3, 4]);
      K.line(ctx, { x: g2, y: padT }, { x: g2, y: padT + chh }, "rgba(217,164,0,.7)", 1, [3, 4]);
      K.pill(ctx, "예측 구간 · 붉은 띠 = 불확실성", (g1 + g2) / 2, padT + 18, { s: 11.5, a: "center", c: "#ffd2a8" });
      K.t(ctx, "● 측정된 데이터", W - 230, 32, { s: 11.5, w: "900", a: "right", c: LT.green });
      K.t(ctx, "┄ 예측값", W - 150, 32, { s: 11.5, w: "900", a: "right", c: LT.red });
      K.t(ctx, "측정 오차 ×" + noise.toFixed(1), W - 28, 32, { s: 11.5, w: "900", a: "right", c: "#b86e00" });
    }
    function update() {
      draw();
      $("c5-info").innerHTML = mode === "inter" ? "<b>내삽</b> — 측정 범위 <b>안</b>의 빈 구간을 예측합니다. 양쪽 관측값이 붙잡아 주어 불확실성이 좁습니다. 예) 일기도의 등압선 그리기." : "<b>외삽</b> — 측정 범위 <b>밖</b>을 예측합니다. 데이터에서 멀어질수록 불확실성이 빠르게 넓어지고, 측정 오차가 크면 더 넓어집니다. 예) 기후 변화 예측.";
      var ch = false;
      if (mode === "inter" && !got.i) { got.i = ch = true; }
      if (mode === "extra" && !got.e) { got.e = ch = true; }
      if (mode === "extra" && noise >= 2.5 && !got.big) { got.big = ch = true; }
      if (ch) { window.sthState("ieGot", got); mission(); }
    }
    function mission() {
      if (got.i && got.e) done("m4-2a"); if (got.big) done("m4-2b");
      if (got.i && got.e && got.big) { window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>외삽은 데이터에서 멀어질수록, 오차가 클수록 불확실성이 크게 늘어납니다."); ep.clear(1); }
    }
    canvas._redraw = draw;
    segWire("c5-mode", "data-m", function (m) { mode = m; update(); });
    $("c5-noise").addEventListener("input", function (e) { noise = +e.target.value; $("c5-noise-val").textContent = noise.toFixed(1); update(); });
    update(); mission();
  })();

  /* 장면 3 — 선크림 예측 */
  (function () {
    var canvas = $("c-sun"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, md = "lin", measured = !!window.sthState("snMeas");
    function real(m) { return 100 * (1 - Math.pow(1 / 50, m / 2)); }
    var D = [0.5, 1.0, 1.5].map(function (m) { return { m: m, y: real(m) }; });
    var mx = 1.0, my = D.reduce(function (a, d) { return a + d.y; }, 0) / 3, sl = D.reduce(function (a, d) { return a + (d.m - mx) * (d.y - my); }, 0) / D.reduce(function (a, d) { return a + (d.m - mx) * (d.m - mx); }, 0);
    function lin(m) { return my + sl * (m - mx); }
    function pred(m) { return md === "lin" ? lin(m) : real(m); }
    var st = { on: !REDUCE }, ph = [], R0 = K.rng(17);
    for (var q = 0; q < 26; q++) ph.push({ x: R0(), y: R0(), r: R0() });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var p2 = pred(2.0), LW = 300, over = p2 > 100;
      K.studio(ctx, 0, 0, W, H, { x: 150, y: H - 10, rx: 140, ry: 8 });
      /* ── 왼쪽: 피부 단면 블록(입체) + 선크림 층 + 자외선 ── */
      var layerY = 186, skinY = 204, bx0 = 14, bx1 = 270, DX = 18, DY = -14, block = clamp(p2, 0, 100) / 100;
      SP.poly(ctx, [{ x: bx0, y: layerY }, { x: bx1, y: layerY }, { x: bx1 + DX, y: layerY + DY }, { x: bx0 + DX, y: layerY + DY }], "#f8fbff");
      SP.poly(ctx, [{ x: bx1, y: layerY }, { x: bx1 + DX, y: layerY + DY }, { x: bx1 + DX, y: H - 26 + DY }, { x: bx1, y: H - 26 }], "#b8714f");
      var cr = ctx.createLinearGradient(0, layerY, 0, skinY); cr.addColorStop(0, "#ffffff"); cr.addColorStop(1, "#e3ebf7");
      ctx.fillStyle = cr; ctx.fillRect(bx0, layerY, bx1 - bx0, skinY - layerY);
      var sk = ctx.createLinearGradient(0, skinY, 0, H - 26); sk.addColorStop(0, "#f3c4a0"); sk.addColorStop(.35, "#e6a882"); sk.addColorStop(1, "#b8714f");
      ctx.fillStyle = sk; ctx.fillRect(bx0, skinY, bx1 - bx0, H - 26 - skinY);
      ctx.strokeStyle = "rgba(140,70,40,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx0, skinY + 22); ctx.bezierCurveTo(bx0 + 80, skinY + 16, bx0 + 170, skinY + 28, bx1, skinY + 20); ctx.stroke();
      K.sun(ctx, 40, 38, 14); K.planet(ctx, 40, 38, 11, "#fff6c8", "#f0a020");
      ph.forEach(function (p) {
        var x = 60 + p.x * (bx1 - 80), stop = p.r < block, y;
        if (p.y < 1) y = 50 + p.y * (layerY - 56);
        else if (stop) { ctx.fillStyle = "rgba(112,72,232," + (.6 * (1.25 - p.y) * 4) + ")"; ctx.beginPath(); ctx.arc(x, layerY - 3, 4, 0, 6.2832); ctx.fill(); return; }
        else y = layerY + (p.y - 1) * 4 * (H - layerY - 30);
        K.line(ctx, { x: x - 5, y: y - 14 }, { x: x, y: y }, "rgba(112,72,232,.6)", 1.8);
        ctx.fillStyle = p.y < 1 ? "#7048e8" : "#c2255c"; ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.2832); ctx.fill();
      });
      K.pill(ctx, "자외선", 64, 32, { s: 11, c: "#d0bfff", box: [0, LW] });
      K.pill(ctx, "선크림 2.0 mg/cm²", bx1 - 4, layerY - 22, { s: 11, a: "right", c: KC.ink, box: [0, LW] });
      K.pill(ctx, over ? "더 막는다? 불가능" : "통과 " + (100 - p2).toFixed(1) + "%", bx1 - 4, H - 36, { s: 11, a: "right", c: over ? "#ffb3bd" : KC.ink, box: [0, LW] });
      /* ── 오른쪽 흰 카드: 모형 그래프 ── */
      var RX = LW + 8, cw = W - RX - 12;
      K.card(ctx, RX, 10, cw, H - 20, md === "lin" ? "직선 모형으로 예측" : "100%에 다가가는 곡선 모형으로 예측");
      var g = SP.chart(ctx, { x: RX + 4, y: 50, w: cw - 12, h: H - 66, x0: 0, x1: 2.4, y0: 40, y1: 120, xt: 6, yt: 4, xf: function (m) { return m.toFixed(1); }, yf: function (p) { return Math.round(p) + "%"; }, xl: "바른 양(mg/cm²)", yl: "자외선 차단율" });
      ctx.fillStyle = "rgba(245,159,0,.10)"; ctx.fillRect(g.X(1.5), g.T, g.R - g.X(1.5), g.B - g.T);
      SP.lbl(ctx, "측정 범위 밖", g.X(2.05), g.B - 8, { s: 11, a: "center", c: LT.orange });
      ctx.fillStyle = "rgba(224,49,49,.08)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(100) - g.T);
      K.line(ctx, { x: g.L, y: g.Y(100) }, { x: g.R, y: g.Y(100) }, LT.red, 1.6, [5, 4]);
      SP.lbl(ctx, "100% — 넘을 수 없는 선", g.L + 8, g.Y(100) - 6, { s: 11, c: LT.red });
      var pts = []; for (var m = 0.3; m <= 2.3 + 1e-9; m += 0.02) pts.push([m, pred(m)]);
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
      SP.plot(ctx, g, pts, LT.blue); ctx.restore();
      D.forEach(function (d) { K.planet(ctx, g.X(d.m), g.Y(d.y), 6, "#9ff0d4", "#0f7a55"); });
      ctx.strokeStyle = over ? LT.red : LT.orange; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(g.X(2), g.Y(Math.min(p2, 120)), 9, 0, 6.2832); ctx.stroke();
      SP.lbl(ctx, "예측 " + p2.toFixed(1) + "%", g.X(2) - 14, g.Y(Math.min(p2, 120)) + (over ? 22 : -14), { s: 12.5, a: "right", c: over ? LT.red : LT.orange });
      if (measured) { K.planet(ctx, g.X(2), g.Y(real(2)), 7, "#9ff0d4", "#0f7a55"); SP.lbl(ctx, "실제 측정 " + real(2).toFixed(1) + "%", g.X(2) + 14, g.Y(real(2)) + 26, { s: 12.5, c: LT.green }); }
      return p2;
    }
    function update() {
      var p2 = draw();
      $("sn-info").innerHTML = (md === "lin" ? "직선 모형은 측정한 세 점을 잘 지나지만, 2.0 mg/cm²에서 <b>" + p2.toFixed(1) + "%</b> — 100%를 넘는 말이 안 되는 값을 냅니다." : "‘100%에 다가가는 곡선’은 바를수록 차단율이 늘지만 100%를 넘지 않는 성질을 담고 있습니다. 2.0 mg/cm²에서 <b>" + p2.toFixed(1) + "%</b>.") + (measured ? " 실제 측정값은 <b>98.0%</b>." : "");
      if (measured && md === "exp" && Math.abs(p2 - 98) <= 1 && !ep.cleared(2)) {
        window.sthState("snBest", "곡선 모형 예측 " + p2.toFixed(1) + "% = 실제 98.0% (직선은 " + lin(2).toFixed(0) + "%)");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("snBest") + ". 결론을 새 측정과 현상의 성질로 평가해 모형을 골랐습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("sn-m", "data-v", function (x) { md = x; update(); });
    $("sn-meas").addEventListener("click", function () { measured = true; window.sthState("snMeas", 1); update(); });
    pauser("sn-play", st, ["자외선 멈추기", "자외선 보기"]);
    K.animate(canvas, function (dt) { if (!st.on) return; ph.forEach(function (p) { p.y += dt / 2600; if (p.y > 1.25) { p.y -= 1.25; p.x = Math.random(); } }); draw(); });
    update();
    if (ep.cleared(2)) window.sthMission("m4-3", true);
  })();

  /* 장면 4 — 발표 절차와 토론 */
  (function () {
    var got = window.sthState("comGot") || { a: false, b: false };
    function mission() {
      if (got.a) done("m4-4a"); if (got.b) done("m4-4b");
      if (got.a && got.b) { window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>발표 자료의 과정을 세우고, 토론의 논점을 정리했습니다. 증거에 근거한 논증이 과학적 의사소통의 핵심입니다."); ep.clear(3); ep.clear(4); }
    }
    var STEPS = ["① 계획 수립 — 청중과 핵심 메시지를 정하고 흐름을 기획한다", "② 자료 제작 — 일관된 디자인으로 그림·그래프를 논리적으로 배치한다", "③ 검토 및 수정 — 오류와 오타, 논리의 일관성을 확인한다"];
    if (got.a) filledOrder("s4-order", STEPS);
    else window.sthOrder({ mount: "s4-order", steps: STEPS, onDone: function () { got.a = true; window.sthState("comGot", got); mission(); } });
    window.sthSort({
      mount: "s4-sort",
      buckets: [{ id: "tp", label: "전통 과학실의 장점" }, { id: "tm", label: "전통 과학실의 단점" }, { id: "sp", label: "지능형 과학실의 장점" }, { id: "sm", label: "지능형 과학실의 단점" }],
      items: [
        { t: "손으로 직접 만지고 재며 기본 탐구 기능을 기른다", a: "tp", why: "직접 실험 중심의 학습입니다." },
        { t: "모둠이 함께 기구를 다루며 협력한다", a: "tp", why: "협력 활동을 촉진합니다." },
        { t: "재료와 기기가 한정되어 할 수 있는 실험이 적다", a: "tm", why: "전통 과학실의 한계입니다." },
        { t: "위험한 약품·불을 다루다 안전사고가 날 수 있다", a: "tm", why: "안전사고 위험입니다." },
        { t: "센서·시뮬레이션으로 위험한 실험을 안전하게 한다", a: "sp", why: "안전한 실험 환경입니다." },
        { t: "학생마다 속도에 맞춰 개인 맞춤형으로 배울 수 있다", a: "sp", why: "개인 맞춤형 학습입니다." },
        { t: "갖추는 비용이 많이 든다", a: "sm", why: "높은 구축 비용입니다." },
        { t: "기기가 고장 나면 수업이 멈추고 기술에 기대게 된다", a: "sm", why: "기술 의존과 장애 문제입니다." }
      ],
      onDone: function () { got.b = true; window.sthState("comGot", got); mission(); }
    });
    mission();
  })();

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("snBest") || "")); }
  function vs() {
    var p = window.sthState("p4") || "";
    $("e4-vs").innerHTML = "<b>나의 첫 생각</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다." : " — 직선 외삽은 113%라는 불가능한 값을 냈지요.") + "<br><b>나의 결론</b> " + (window.sthState("snBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ④ 선크림 보고서",
    items: [
      { id: "w3", label: "내삽과 외삽", hint: "둘 중 어느 쪽이 더 위험한지, 왜 그런지 쓰세요." },
      { id: "e4b", label: "발표 슬라이드 세 장 구상", hint: "선크림 탐구를 발표한다면 세 장의 슬라이드에 각각 무엇(문제·과정·결론)을 어떤 그림과 함께 넣을지 쓰고, 지능형 과학실 토론에서 내 입장을 한 줄 덧붙이세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[융합과학 탐구 Ⅱ] 융합과학 탐구의 과정 — 정리",
  recap: [
    { key: "r1", label: "① 필로티 2층은 왜 추울까" },
    { key: "r2", label: "② 커피 필터 낙하 실험" },
    { key: "r3", label: "③ 학교 자기장 지도" },
    { key: "r4", label: "④ 선크림 보고서" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "문제 발견 → 수집·시각화 → 검증 → 결론·발표. 네 이야기가 탐구의 어느 단계를 보여 주는지 한 문장으로 이어 보세요." },
    { id: "w4", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "cvg-2", unitLabel: "[융합과학 탐구 Ⅱ] 융합과학 탐구의 과정",
  rows: [
    { key: "r1", label: "① 필로티 2층은 왜 추울까" },
    { key: "r2", label: "② 커피 필터 낙하 실험" },
    { key: "r3", label: "③ 학교 자기장 지도" },
    { key: "r4", label: "④ 선크림 보고서" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
