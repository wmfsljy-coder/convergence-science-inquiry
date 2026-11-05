/* 융합과학 탐구 Ⅰ 융합과학 탐구의 이해 — 소단원별 이야기 네 편
   01 사진 51번 / 02 같은 바다, 세 개의 탐구 / 03 빈 병원의 두 병동 / 04 기울어진 건물의 경보
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("cvg-1");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function segWire(id, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute("data-v")); });
  });
}
function filledOrder(mount, steps) { $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>"; }
function Phi(z) { var t = 1 / (1 + 0.3275911 * Math.abs(z / Math.SQRT2)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2); return 0.5 * (1 + (z >= 0 ? y : -y)); }

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
/* 유리판 카드 */
function glass(ctx, x, y, w, h, r, edge, a) {
  var g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "rgba(255,255,255," + (a == null ? 0.09 : a) + ")"); g.addColorStop(1, "rgba(255,255,255,.02)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = edge || "rgba(200,210,255,.22)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
}
/* 무대 위 이름(흐림) + 값(굵게) */
function kv(ctx, k, val, x, y, col, size, a) {
  K.t(ctx, k, x, y, { s: 11.5, c: KC.mute, w: "700", a: a });
  K.t(ctx, val, x, y + (size || 18) + 6, { s: size || 18, c: col || KC.ink, w: "900", a: a });
}
/* 빛나는 선 */
function glowPath(ctx, pts, col, w, dash) {
  if (!pts.length) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.lineJoin = "round"; ctx.shadowColor = col; ctx.shadowBlur = 8;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore();
}
/* 색 점(입자) */
function dot(ctx, x, y, r, col) { K.glow(ctx, x, y, r, col, 2.4); }
/* 계속 도는 움직임의 멈추기 단추 */
function pauser(id, st, label) {
  var b = $(id); if (!b) return;
  label = label || ["움직임 멈추기", "움직임 보기"];
  function paint() { b.textContent = st.on ? "⏸ " + label[0] : "▶ " + label[1]; }
  b.addEventListener("click", function () { st.on = !st.on; paint(); });
  paint();
}
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }

/* =========================================================================
   이야기 ① 사진 51번
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "첫 추리",
    question: "현미경으로도 보이지 않던 DNA의 모양을 어떻게 알아냈을까요?",
    options: ["㉠ 더 좋은 광학 현미경을 만들어서", "㉡ X선이 분자에 부딪혀 흩어진 무늬를 물리학·수학으로 해석해서", "㉢ DNA를 크게 부풀려서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — X선 무늬 */
  (function () {
    var canvas = $("c-xr"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var P = 2.5, D = 1.2, TP = 3.4, TD = 2.0, got = window.sthState("xrGot") || { a: false, b: false };
    var st = { on: !REDUCE }, ph = 0;
    var LW = 430, FX = 215, FY = 192, FR = 148;
    function spacing(p) { return 80 / p; }
    function slope(p, d) { return p / (Math.PI * d); }
    function okA() { return Math.abs(P - TP) <= 0.1 + 1e-9; }
    function okB() { return Math.abs(slope(P, D) - slope(TP, TD)) <= 0.03; }
    /* 필름 위 반점 자리(층선 n, 좌우) */
    function spots(p, d, fn) {
      var sp = spacing(p), k = slope(p, d);
      for (var n = -6; n <= 6; n++) {
        if (n === 0) continue;
        var y = FY + n * sp; if (Math.abs(y - FY) > FR - 6) continue;
        var x = Math.abs(n * sp) / (1.6 * k);
        fn(FX - x, y, n); fn(FX + x, y, n);
      }
    }
    function blob(x, y, n) {
      var a = 1 - Math.abs(n) * 0.09, g = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
      g.addColorStop(0, "rgba(255,255,255," + a + ")"); g.addColorStop(.35, "rgba(170,220,255," + (a * .7) + ")"); g.addColorStop(1, "rgba(120,190,255,0)");
      ctx.save(); ctx.translate(x, y); ctx.scale(1, .5); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 16, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    function xLines(p, d, col) {
      var dx = FR / (1.6 * slope(p, d));
      K.line(ctx, { x: FX - dx, y: FY - FR }, { x: FX + dx, y: FY + FR }, col, 1.2, [3, 5]);
      K.line(ctx, { x: FX + dx, y: FY - FR }, { x: FX - dx, y: FY + FR }, col, 1.2, [3, 5]);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      K.studio(ctx, 0, 0, W, H, { x: 640, y: H - 24, rx: 200, ry: 16 });
      /* ── 왼쪽: 판독용 라이트 박스 위의 X선 필름 ── */
      SP.poly(ctx, [{ x: 30, y: 36 }, { x: 400, y: 36 }, { x: 414, y: 24 }, { x: 44, y: 24 }], "#eef1f5");
      SP.poly(ctx, [{ x: 400, y: 36 }, { x: 414, y: 24 }, { x: 414, y: 336 }, { x: 400, y: 348 }], "#9aa3b0");
      var bx = ctx.createLinearGradient(0, 36, 0, 348); bx.addColorStop(0, "#d6dce5"); bx.addColorStop(1, "#b5bfcc");
      ctx.fillStyle = bx; ctx.beginPath(); ctx.roundRect(30, 36, 370, 312, 10); ctx.fill();
      var lb = ctx.createRadialGradient(FX, FY, 20, FX, FY, 200); lb.addColorStop(0, "#fbfdff"); lb.addColorStop(1, "#dfe8f2");
      ctx.fillStyle = lb; ctx.beginPath(); ctx.roundRect(44, 46, 342, 292, 6); ctx.fill();
      var fg = ctx.createRadialGradient(FX, FY, 8, FX, FY, FR);
      fg.addColorStop(0, "#2b3c46"); fg.addColorStop(.55, "#121d25"); fg.addColorStop(1, "#05090d");
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(FX, FY, FR, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(FX, FY, FR - 3, 0, 6.2832); ctx.clip();
      var hg = ctx.createRadialGradient(FX, FY, 0, FX, FY, 80);
      hg.addColorStop(0, "rgba(220,240,255,.32)"); hg.addColorStop(1, "rgba(220,240,255,0)");
      ctx.fillStyle = hg; ctx.fillRect(FX - 80, FY - 80, 160, 160);
      xLines(TP, TD, "rgba(255,211,107,.45)");
      xLines(P, D, "rgba(190,225,255,.35)");
      spots(P, D, blob);
      ctx.strokeStyle = KC.yellow; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]);
      spots(TP, TD, function (x, y) { ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.2832); ctx.stroke(); });
      ctx.setLineDash([]);
      ctx.fillStyle = "#04070a"; ctx.beginPath(); ctx.arc(FX, FY, 9, 0, 6.2832); ctx.fill();
      ctx.restore();
      var sp = spacing(P), bxx = FX + FR + 12;
      ctx.strokeStyle = LT.blue; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bxx - 5, FY - sp); ctx.lineTo(bxx, FY - sp); ctx.lineTo(bxx, FY); ctx.lineTo(bxx - 5, FY); ctx.stroke();
      K.pill(ctx, "층선 간격", bxx, FY - sp - 12, { s: 11, a: "center", c: "#bfe6ff", box: [0, LW] });
      K.pill(ctx, "● 내 모형", 54, H - 26, { s: 11.5, c: "#cfe8ff" });
      K.pill(ctx, "◌ 사진 51번", 376, H - 26, { s: 11.5, a: "right", c: "#ffe08a", box: [0, LW] });
      K.pill(ctx, "X선 필름 — 회절 무늬", 54, 70, { s: 12, c: KC.ink });
      /* ── 오른쪽: 받침대에 꽂은 이중 나선 모형 ── */
      var RX = LW + 8, HX = RX + 150, y0 = 58, y1 = H - 66, s = 40, rr = D / 2 * s, pp = P * s;
      SP.cyl(ctx, HX, y1 + 18, 70, 18, 12, "wood");
      ctx.fillStyle = "#a8741f"; ctx.fillRect(HX - 2, y0 - 8, 4, y1 - y0 + 26);
      function th(y) { return 2 * Math.PI * (y - y0) / pp + ph; }
      function strand(off, col, front) {
        ctx.save(); ctx.strokeStyle = col; ctx.lineCap = "round";
        for (var y = y0; y < y1; y += 2) {
          var a = th(y) + off, b = th(y + 2) + off, z = Math.cos((a + b) / 2);
          if ((z > 0) !== front) continue;
          ctx.globalAlpha = front ? 1 : .35; ctx.lineWidth = front ? 5 : 4;
          ctx.beginPath(); ctx.moveTo(HX + rr * Math.sin(a), y); ctx.lineTo(HX + rr * Math.sin(b), y + 2); ctx.stroke();
        }
        ctx.restore();
      }
      strand(0, LT.blue, false); strand(Math.PI, LT.violet, false);
      var R = K.rng(9);
      for (var yk = y0 + 4; yk < y1; yk += 0.34 * s) {
        var t = th(yk), xa = HX + rr * Math.sin(t), xb = HX + rr * Math.sin(t + Math.PI), at = R() < .5;
        var gg = ctx.createLinearGradient(xa, 0, xb + .01, 0);
        gg.addColorStop(0, at ? "#f59f00" : "#0f9f76"); gg.addColorStop(.5, "rgba(255,255,255,.6)"); gg.addColorStop(1, at ? "#e03131" : "#1c7ed6");
        ctx.strokeStyle = gg; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa, yk); ctx.lineTo(xb, yk); ctx.stroke();
      }
      strand(0, LT.blue, true); strand(Math.PI, LT.violet, true);
      var px = HX + 90, pe = Math.min(y0 + pp, y1);
      ctx.strokeStyle = LT.blue; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px - 6, y0); ctx.lineTo(px, y0); ctx.lineTo(px, pe); ctx.lineTo(px - 6, pe); ctx.stroke();
      K.pill(ctx, "피치 " + P.toFixed(1) + " nm" + (y0 + pp > y1 ? " (화면보다 길다)" : ""), px + 10, (y0 + pe) / 2 + 5, { s: 12, c: "#bfe6ff", box: [RX, W] });
      K.bracket(ctx, HX - rr, HX + rr, y1 + 4, LT.orange, null, false);
      K.pill(ctx, "지름 " + D.toFixed(1) + " nm", HX - rr - 10, y1 + 12, { s: 11.5, a: "right", c: "#ffd2a8", box: [RX, W] });
      K.pill(ctx, "A–T 쌍", W - 14, 60, { s: 11, a: "right", c: "#ffe08a" });
      K.pill(ctx, "G–C 쌍", W - 14, 88, { s: 11, a: "right", c: "#7ff0c4" });
      K.pill(ctx, "한 바퀴 " + (P / 0.34).toFixed(1) + "개 염기쌍", W - 14, H - 14, { s: 11.5, a: "right", c: KC.ink });
      K.warn(ctx, W - 14, H - 44, "⚠ 두 가닥의 엇갈림은 단순화", "right");
      var a2 = okA(), b2 = okB();
      SP.head(ctx, a2 && b2 ? "사진 51번과 겹친다" : "피치 " + P.toFixed(1) + " · 지름 " + D.toFixed(1), "", a2 && b2, { x: RX + 4, y: 40, s: 20 });
    }
    function readout() {
      var a = okA(), b = okB();
      put("xr-read",
        "<span class='k'>피치</span><span class='v b'>" + P.toFixed(1) + " nm</span>" +
        "<span class='sub'>층선 간격 " + spacing(P).toFixed(1) + " → 목표 " + spacing(TP).toFixed(1) + "</span>" +
        "<span class='k'>지름</span><span class='v y'>" + D.toFixed(1) + " nm</span>" +
        "<span class='sub'>X 기울기 = 피치 ÷ (π × 지름) = " + slope(P, D).toFixed(2) + " → 목표 " + slope(TP, TD).toFixed(2) + "</span>" +
        "<span class='k'>염기쌍</span><span class='v g'>" + (P / 0.34).toFixed(1) + "개/바퀴</span>" +
        "<span class='ok " + (a && b ? "g" : "r") + "'>" + (a && b ? "사진 51번의 무늬와 격칩니다" : (a ? "층선은 맞았습니다 · 이제 X의 각" : "층선 간격부터 맞춰 보세요")) + "</span>");
    }
    function update() {
      draw(); readout();
      var ch = false;
      $("xr-info").innerHTML = "피치 " + P.toFixed(1) + " nm · 지름 " + D.toFixed(1) + " nm. 피치를 늘리면 층선이 촘촘해지고, 지름을 늘리면 X가 옆으로 벌어집니다.";
      if (Math.abs(P - TP) <= 0.1 + 1e-9 && !got.a) { got.a = ch = true; }
      if (got.a && Math.abs(P - TP) <= 0.1 + 1e-9 && Math.abs(D - TD) <= 0.1 + 1e-9 && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("xrGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.b) done("m1-2b");
      if (got.a && got.b) { window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>피치 약 <b>3.4 nm</b>, 지름 약 <b>2 nm</b>. 한 바퀴에 염기쌍이 약 10개 들어가는 나선 — 왓슨과 크릭 모형의 치수와 같습니다."); ep.clear(1); }
    }
    canvas._redraw = draw;
    $("xr-p").addEventListener("input", function (e) { P = +e.target.value; $("xr-p-val").textContent = P.toFixed(1) + " nm"; update(); });
    $("xr-d").addEventListener("input", function (e) { D = +e.target.value; $("xr-d-val").textContent = D.toFixed(1) + " nm"; update(); });
    pauser("xr-play", st, ["나선 멈추기", "나선 돌리기"]);
    K.animate(canvas, function (dt) { if (st.on) { ph = (ph + dt * 0.0011) % (2 * Math.PI); draw(); } });
    update(); mission();
  })();

  /* 장면 3 — 분야의 만남 */
  window.sthSort({
    mount: "s1-sort",
    buckets: [
      { id: "dna", label: "🧬 DNA 구조 규명", sub: "물리학·화학·생물학" },
      { id: "city", label: "🏙️ 스마트 도시", sub: "사회과학·데이터 과학·공학" },
      { id: "med", label: "🩺 맞춤형 의료", sub: "유전학·정보과학·의학" },
      { id: "bot", label: "🦿 생체 모방 로봇", sub: "생물학·로봇 공학" }
    ],
    items: [
      { t: "X선 회절 무늬로 분자의 반복 구조를 알아낸다", a: "dna", why: "물리학의 도구가 생물학의 문제를 풀었습니다." },
      { t: "염기 A는 T와, G는 C와 짝을 이룬다는 화학 자료를 모형에 넣는다", a: "dna", why: "화학의 결합 규칙이 이중 나선의 안쪽을 채웠습니다." },
      { t: "교통·에너지·안전 센서 데이터를 모아 도시 문제를 푼다", a: "city", why: "데이터 과학과 도시 공학의 만남입니다." },
      { t: "시민의 이동 습관을 조사해 대중교통 노선을 바꾼다", a: "city", why: "사회과학 조사가 도시 설계에 쓰입니다." },
      { t: "개인의 유전 정보를 분석해 질병 위험을 미리 알려 준다", a: "med", why: "유전학과 정보과학이 만났습니다." },
      { t: "환자마다 잘 듣는 약을 유전자 검사로 고른다", a: "med", why: "맞춤형 의료의 예입니다." },
      { t: "게코도마뱀 발바닥 구조를 본떠 벽을 오르는 로봇을 만든다", a: "bot", why: "생물의 구조를 공학에 옮겼습니다." },
      { t: "물고기 떼의 움직임을 본떠 여러 대의 수중 드론을 움직인다", a: "bot", why: "생물의 행동을 로봇 제어에 썼습니다.", hint: "생물을 흉내 내어 기계를 만든 사례입니다." }
    ],
    onDone: function () { window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>문제가 복잡할수록 여러 분야의 지식과 방법을 엮어야 풀립니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m1-3", true);

  /* 장면 4 — 신호등 */
  (function () {
    var canvas = $("c-sig"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, g = 45;
    var C = 90, F1 = 30, F2 = 15;
    var st = { on: !REDUCE }, simT = 20, ns = [], ew = [], spN = 0, spE = 5;
    var LW = 372, cx = 186, cy = 158, RD = 34, STOP = 46, CAR = 22;
    function wait(x) { return (F1 * Math.pow(C - x, 2) + F2 * x * x) / (2 * C * (F1 + F2)); }
    function nsGreen() { return (simT % C) < g; }
    /* 차 한 대 그림 = 실제 차 5대 */
    function car(x, y, vert, col) {
      ctx.save(); ctx.translate(x, y); if (vert) ctx.rotate(Math.PI / 2);
      var bg = ctx.createLinearGradient(0, -7, 0, 7); bg.addColorStop(0, "rgba(255,255,255,.9)"); bg.addColorStop(.3, col); bg.addColorStop(1, "rgba(10,14,40,.9)");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-9, -6, 18, 12, 3); ctx.fill();
      ctx.fillStyle = "rgba(20,30,60,.85)"; ctx.fillRect(-1, -4.5, 5, 9);
      ctx.restore();
      var hx = vert ? x : x + 9, hy = vert ? y + 9 : y;
      K.glow(ctx, hx, hy, 1.6, "rgba(255,250,210,.9)", 3);
    }
    function lamp(x, y, on, col) {
      ctx.fillStyle = "#0b0f22"; ctx.beginPath(); ctx.roundRect(x - 8, y - 15, 16, 30, 5); ctx.fill();
      if (on) K.glow(ctx, x, y - 6, 4, col, 3.2); else { ctx.fillStyle = "rgba(255,107,129,.85)"; ctx.beginPath(); ctx.arc(x, y + 6, 3.6, 0, 6.2832); ctx.fill(); K.glow(ctx, x, y + 6, 3.4, "rgba(255,107,129,.9)", 3); }
    }
    /* 한 방향 차로의 차들: s = 정지선까지 남은 거리(px, 음수면 지나감) */
    function move(arr, green, dt) {
      var lead = null;
      for (var i = 0; i < arr.length; i++) {
        var c = arr[i], sp = dt * 0.09, lim = Infinity;
        if (!green && c.s >= 0) lim = c.s;
        if (lead) lim = Math.min(lim, c.s - lead.s - CAR);
        c.s -= Math.max(0, Math.min(sp, lim));
        lead = c;
      }
      while (arr.length && arr[0].s < -420) arr.shift();
    }
    function stepCars(dt) {
      var ds = dt / 1000 * 6;                /* 화면 1초 = 실제 6초 */
      simT += ds; spN += ds; spE += ds;
      if (spN >= 10) { spN -= 10; if (!ns.length || ns[ns.length - 1].s < 160) ns.push({ s: 190 }); }
      if (spE >= 20) { spE -= 20; if (!ew.length || ew[ew.length - 1].s < 160) ew.push({ s: 190 }); }
      var gn = nsGreen();
      move(ns, gn, dt); move(ew, !gn, dt);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      K.studio(ctx, 0, 0, W, H, { x: 210, y: 280, rx: 200, ry: 16 });
      /* ── 왼쪽: 교차로 블록 모형(위 지도 좌표 = 월드 좌표) ── */
      var I = K.iso({ ox: 200, oy: 52, s: 0.56, L: LW, D: H }), Z = 8, gn = nsGreen();
      SP.box(ctx, I, 0, 0, 0, I.L, I.D, Z, ["#c9c2b2", "#8d8676", "#6f6a5e"], { edge: false });
      I.plane(ctx, Z, "#c7d3a8");
      I.plane(ctx, Z + .2, "#4a5060", null, 0, I.L, cy - RD, cy + RD);
      I.plane(ctx, Z + .2, "#4a5060", null, cx - RD, cx + RD, 0, I.D);
      ctx.save(); ctx.strokeStyle = "rgba(255,211,107,.9)"; ctx.lineWidth = 1.4; ctx.setLineDash([6, 5]);
      [[[0, cy], [cx - RD, cy]], [[cx + RD, cy], [I.L, cy]], [[cx, 0], [cx, cy - RD]], [[cx, cy + RD], [cx, I.D]]].forEach(function (sg) { var a = I.P(sg[0][0], sg[0][1], Z + .4), b = I.P(sg[1][0], sg[1][1], Z + .4); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
      ctx.restore();
      var R = K.rng(4), blocks = [];
      for (var b = 0; b < 4; b++) {
        var qx = b % 2 ? cx + RD + 10 : 10, qy = b > 1 ? cy + RD + 10 : 10, qw = b % 2 ? LW - qx - 10 : cx - RD - 20, qh = b > 1 ? H - qy - 10 : cy - RD - 20;
        blocks.push([qx, qy, qw, qh, 30 + R() * 40]);
      }
      function bld(q) { SP.box(ctx, I, q[0], q[1], Z, q[0] + q[2], q[1] + q[3], Z + q[4], ["#e9ecf2", "#b7c1d0", "#8f9bad"]); var w = I.P(q[0] + q[2] * .5, q[1] + q[3], Z + q[4] * .6); ctx.fillStyle = "rgba(255,220,140,.8)"; for (var k = -2; k <= 2; k++) ctx.fillRect(w.x + k * 9 - 2, w.y - 4 + k * 2.6, 4, 5); }
      bld(blocks[0]); bld(blocks[1]); bld(blocks[2]);
      ns.forEach(function (c) { var x = cx - RD / 2, y = cy - RD - 4 - c.s - 9; if (y < -10 || y > I.D + 10) return; SP.box(ctx, I, x - 6, y - 10, Z, x + 6, y + 10, Z + 8, "blue", { edge: false }); });
      ew.forEach(function (c) { var x = cx - RD - 4 - c.s - 9, y = cy + RD / 2; if (x < -10 || x > I.L + 10) return; SP.box(ctx, I, x - 10, y - 6, Z, x + 10, y + 6, Z + 8, "#e8590c", { edge: false }); });
      function pole(x, y, on) { var p0 = I.P(x, y, Z), p1 = I.P(x, y, Z + 40); ctx.strokeStyle = "#3d4452"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.fillStyle = "#1c2230"; ctx.beginPath(); ctx.roundRect(p1.x - 6, p1.y - 16, 12, 22, 4); ctx.fill(); ctx.fillStyle = on ? "#2fe0a0" : "#ff5a6e"; ctx.beginPath(); ctx.arc(p1.x, on ? p1.y - 9 : p1.y + 1, 4, 0, 6.2832); ctx.fill(); }
      pole(cx - RD - 10, cy - RD - 10, gn); pole(cx - RD - 10, cy + RD + 10, !gn);
      bld(blocks[3]);
      K.pill(ctx, "남북 30대/분", I.P(cx, 20, Z).x + 16, I.P(cx, 20, Z).y + 4, { s: 11, c: "#bfe6ff", box: [0, 440] });
      K.pill(ctx, "동서 15대/분", I.P(20, cy + RD, Z).x - 10, I.P(20, cy + RD, Z).y + 26, { s: 11, a: "right", c: "#ffc78a", box: [0, 440] });
      var ph2 = simT % C;
      K.pill(ctx, (gn ? "남북 초록 " + Math.ceil(g - ph2) : "동서 초록 " + Math.ceil(C - ph2)) + "초 남음", 16, H - 40, { s: 11.5, c: "#7ff0c4" });
      K.pill(ctx, "차 1대 = 5대 · 6배속", 16, H - 14, { s: 10.5, c: KC.ink });
      /* ── 오른쪽 흰 카드: 대기 시간 그래프 ── */
      var RX = LW + 70, cw = W - RX - 14;
      K.card(ctx, RX, 14, cw, H - 28, "남북 초록불 시간 → 평균 대기 시간");
      var gr = SP.chart(ctx, { x: RX + 6, y: 56, w: cw - 14, h: H - 112, x0: 10, x1: 80, y0: 8, y1: 28, xt: 7, yt: 4, xl: "남북 초록(초)", yl: "평균 대기(초)" });
      var pts = []; for (var x = 10; x <= 80; x += 0.5) pts.push([x, Math.min(28, wait(x))]);
      ctx.save(); ctx.beginPath(); ctx.rect(gr.L, gr.T, gr.R - gr.L, gr.B - gr.T); ctx.clip();
      K.line(ctx, { x: gr.L, y: gr.Y(10.1) }, { x: gr.R, y: gr.Y(10.1) }, "rgba(15,159,118,.8)", 1.4, [5, 4]);
      SP.plot(ctx, gr, pts, LT.blue);
      ctx.restore();
      SP.lbl(ctx, "목표 10.1초", gr.R - 4, gr.Y(10.1) + 16, { s: 11, a: "right", c: LT.green });
      var w = wait(g), gy = gr.Y(Math.min(28, w)), okw = w <= 10.1;
      K.line(ctx, { x: gr.X(g), y: gr.B }, { x: gr.X(g), y: gy }, "rgba(20,40,90,.4)", 1.2, [3, 4]);
      ctx.fillStyle = okw ? LT.green : LT.orange; ctx.beginPath(); ctx.arc(gr.X(g), gy, 6, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      K.tip(ctx, "남북 " + g + "초 → 평균 대기 " + w.toFixed(2) + "초" + (okw ? " · 최솟값 근처" : ""), RX + 12, H - 54, cw - 24, okw);
      return w;
    }
    function update() {
      var w = draw();
      put("sig-read",
        "<span class='k'>남북 초록</span><span class='v b'>" + g + "초</span><span class='sub'>30대/분 · 빨간불 " + (C - g) + "초</span>" +
        "<span class='k'>동서 초록</span><span class='v y'>" + (C - g) + "초</span><span class='sub'>15대/분 · 빨간불 " + g + "초</span>" +
        "<span class='k'>평균 대기</span><span class='v " + (w <= 10.1 ? "g" : "r") + "'>" + w.toFixed(2) + "초</span>" +
        "<span class='ok " + (w <= 10.1 ? "g" : "r") + "'>" + (w <= 10.1 ? "최솟값 가까이입니다" : "아직 더 줄일 수 있습니다") + "</span>");
      $("sig-info").innerHTML = "빨간불 동안 쌓인 차는 빨간불이 길수록 더 오래 기다립니다. 차가 많은 방향의 빨간불을 줄이면 전체 대기가 줄지만, 반대쪽이 너무 길게 기다리면 다시 늘어납니다. 지금 평균 <b>" + w.toFixed(2) + "초</b>.";
      if (w <= 10.1 && !ep.cleared(3)) {
        window.sthState("sigBest", "남북 초록 " + g + "초 · 동서 " + (C - g) + "초 → 평균 대기 " + w.toFixed(2) + "초");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("sigBest") + ". 교통량이 2배인 방향에 초록불을 약 2배 주는 것이 가장 효율적입니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("sig-g").addEventListener("input", function (e) { g = +e.target.value; $("sig-g-val").textContent = g + "초"; update(); });
    pauser("sig-play", st, ["차 멈추기", "차 움직이기"]);
    for (var pre = 0; pre < 90; pre++) stepCars(100);
    K.animate(canvas, function (dt) { if (st.on) { stepCars(dt); draw(); } });
    update();
    if (ep.cleared(3)) window.sthMission("m1-4", true);
  })();

  function finish() { window.sthState("r1", "해결 · DNA 피치 3.4 nm·지름 2 nm / " + (window.sthState("sigBest") || "")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 추리</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다." : " — 답은 X선 회절이라는 물리학의 도구였습니다.") + "<br><b>나의 신호 설계</b> " + (window.sthState("sigBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[융합과학 탐구 Ⅰ] 이야기 ① 사진 51번",
    items: [
      { id: "e1a", label: "융합적 탐구가 문제를 푼 사례", hint: "DNA 구조 규명이나 스마트 도시 가운데 하나를 골라, 어떤 분야가 무엇을 맡아 문제를 풀었는지 쓰세요." },
      { id: "e1b", label: "내가 풀고 싶은 문제와 필요한 분야", hint: "우리 주변의 문제 하나를 정하고, 풀려면 어떤 분야들이 함께해야 하는지 까닭과 함께 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 같은 바다, 세 개의 탐구
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "기자의 첫 생각",
    question: "예술 창작, 사회과학적 탐구, 과학적 탐구에 공통점이 있을까요?",
    options: ["㉠ 전혀 없다 — 완전히 다른 일이다", "㉡ 관찰·탐색에서 출발해 문제(주제)를 발견한다는 점이 같다", "㉢ 셋 다 실험실에서 변인을 통제한다"],
    onPick: function () { ep.clear(0); }
  });

  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "art", label: "🎨 예술 창작" }, { id: "soc", label: "🏛️ 사회과학적 탐구" }, { id: "sci", label: "🔬 과학적 탐구" }],
    items: [
      { t: "해변을 걸으며 떠밀려 온 물건의 색과 모양을 관찰한다", a: "art", why: "관찰·탐색으로 표현할 주제를 찾습니다." },
      { t: "‘바다가 삼킨 일상’이라는 작품 주제를 정한다", a: "art", why: "주제 발견입니다." },
      { t: "주운 플라스틱으로 설치 작품의 도안을 그린다", a: "art", why: "도안·구성 단계입니다." },
      { t: "관객에게 어떤 느낌을 줄지 미학적으로 판단한다", a: "art", why: "예술은 미학적 기준으로 판단합니다.", hint: "‘아름다움’이나 ‘느낌’을 기준으로 하는 판단입니다." },
      { t: "주민과 이야기를 나누며 쓰레기 문제를 어떻게 느끼는지 듣는다", a: "soc", why: "인간의 상호 작용에서 출발합니다." },
      { t: "쓰레기 문제로 마을 사람들 사이에 갈등이 생긴 까닭을 찾는다", a: "soc", why: "사회 현상의 문제 발견입니다." },
      { t: "주민 설문으로 규제에 대한 생각을 조사한다", a: "soc", why: "사회과학의 자료 수집 방법입니다." },
      { t: "조사 결과가 공정하고 윤리적인지 따져 정책 변화를 제안한다", a: "soc", why: "인문·윤리적 판단과 변화 추구입니다." },
      { t: "모래 1 kg에 미세 플라스틱이 몇 개인지 궁금해진다", a: "sci", why: "과학적 문제 발견입니다." },
      { t: "같은 양의 모래, 같은 체로 여러 해변의 시료를 비교하도록 설계한다", a: "sci", why: "변인 통제를 포함한 실험 설계입니다." },
      { t: "현미경으로 센 입자 수를 표로 만들어 분석한다", a: "sci", why: "자료 해석 및 분석입니다." },
      { t: "측정 결과가 다시 재도 같은지 객관적으로 판단한다", a: "sci", why: "과학은 객관성을 기준으로 판단합니다." }
    ],
    onDone: function () { window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>세 탐구 모두 관찰에서 출발하지만, 무엇을 추구하고 무엇으로 판단하는지가 다릅니다."); ep.clear(1); }
  });
  if (ep.cleared(1)) window.sthMission("m2-2", true);

  /* 장면 3 — 설문 표본 */
  (function () {
    var canvas = $("c-sv"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, y = 90, o = 0;
    var POP = [30, 45, 25], SUP = [80, 60, 40], TRUE = (30 * 80 + 45 * 60 + 25 * 40) / 100;
    function est() { var m = 100 - y - o; if (m < 0) return null; return (y * SUP[0] + m * SUP[1] + o * SUP[2]) / 100; }
    var GC = [KC.yellow, KC.blue, KC.violet], GN = ["10~20대", "30~50대", "60대+"];
    /* 사람 한 명(머리 + 어깨) */
    function person(x, y, col, a) {
      ctx.save(); ctx.globalAlpha = a == null ? 1 : a;
      var bg = ctx.createLinearGradient(0, y - 2, 0, y + 9); bg.addColorStop(0, col); bg.addColorStop(1, "rgba(10,14,40,.6)");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - 6, y + 9); ctx.quadraticCurveTo(x - 6, y - 1, x, y - 1); ctx.quadraticCurveTo(x + 6, y - 1, x + 6, y + 9); ctx.closePath(); ctx.fill();
      K.planet(ctx, x, y - 6, 4.2, col, "rgba(20,24,60,.9)");
      ctx.restore();
    }
    function crowd(x0, y0, parts, cols) {
      var k = 0;
      parts.forEach(function (p, i) { for (var j = 0; j < Math.round(p / 2); j++, k++) { if (k >= 50) return; person(x0 + (k % 25) * 19, y0 + Math.floor(k / 25) * 26, cols[i]); } });
      for (; k < 50; k++) person(x0 + (k % 25) * 19, y0 + Math.floor(k / 25) * 26, "rgba(160,170,210,.5)", .25);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var m = 100 - y - o, e = est(), LW = 530, GL = [LT.yellow, LT.blue, LT.violet];
      K.studio(ctx, 0, 0, W, H);
      function man(x, yy, col, a) {
        ctx.save(); ctx.globalAlpha = a == null ? 1 : a;
        ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(x + 2, yy + 10, 6, 2, 0, 0, 6.2832); ctx.fill();
        var bg = ctx.createLinearGradient(x - 6, 0, x + 6, 0); bg.addColorStop(0, K.tint(col, 1.15)); bg.addColorStop(1, K.tint(col, .7));
        ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - 6, yy + 9); ctx.quadraticCurveTo(x - 6, yy - 1, x, yy - 1); ctx.quadraticCurveTo(x + 6, yy - 1, x + 6, yy + 9); ctx.closePath(); ctx.fill();
        K.planet(ctx, x, yy - 6, 4.2, "#f1c7a5", "#a8704a");
        ctx.restore();
      }
      [["마을 전체", POP, 50], ["내 표본", [y, Math.max(0, m), o], 168]].forEach(function (row) {
        K.card(ctx, 12, row[2] - 30, LW - 24, 108, null);
        K.t(ctx, row[0], 28, row[2] - 6, { s: 13, w: "900", c: LT.ink });
        var bx = 120, bw = LW - 148, cxx = bx;
        row[1].forEach(function (p, i) {
          var w = bw * Math.min(p, 100) / 100; if (w <= 0) return;
          ctx.fillStyle = GL[i]; ctx.beginPath(); ctx.roundRect(cxx, row[2] - 18, Math.max(2, w - 2), 12, 4); ctx.fill();
          if (w > 70) K.t(ctx, GN[i] + " " + p + "%", cxx + w / 2, row[2] + 6, { s: 10.5, w: "800", a: "center", c: GL[i] });
          cxx += w;
        });
        var k = 0, parts = row[1].map(function (p) { return Math.max(0, p); });
        parts.forEach(function (p, i) { for (var j = 0; j < Math.round(p / 2); j++, k++) { if (k >= 50) return; man(34 + (k % 25) * 19, row[2] + 26 + Math.floor(k / 25) * 24, GL[i]); } });
        for (; k < 50; k++) man(34 + (k % 25) * 19, row[2] + 26 + Math.floor(k / 25) * 24, "#b8c2d0", .35);
      });
      if (m < 0) K.pill(ctx, "⚠ 비율의 합이 100%를 넘었습니다", LW / 2, H - 10, { s: 12, a: "center", c: "#ffb3bd" });
      else K.pill(ctx, "연령대별 찬성률 80% · 60% · 40% · 한 사람 = 2%", LW / 2, H - 10, { s: 11, a: "center", c: KC.ink });
      /* ── 오른쪽 흰 카드: 찬성률 계기 ── */
      var RX = LW + 8, RW = W - RX - 12, gx = RX + 30, gw = RW - 60;
      K.card(ctx, RX, 14, RW, H - 28, "설문 결과 vs 실제 찬성률");
      function GX(p) { return gx + (p - 30) / 70 * gw; }
      var gy = 150;
      ctx.fillStyle = "#e3e9f1"; ctx.beginPath(); ctx.roundRect(gx, gy - 9, gw, 18, 9); ctx.fill();
      ctx.fillStyle = "rgba(15,159,118,.35)"; ctx.fillRect(GX(TRUE - 2), gy - 14, GX(TRUE + 2) - GX(TRUE - 2), 28);
      [30, 50, 70, 90].forEach(function (p) { K.t(ctx, p + "%", GX(p), gy + 32, { s: 10.5, a: "center", c: LT.mute, w: "700" }); });
      ctx.strokeStyle = "#d9a400"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(GX(TRUE), gy - 22); ctx.lineTo(GX(TRUE), gy + 16); ctx.stroke();
      K.t(ctx, "실제 " + TRUE.toFixed(1) + "%", GX(TRUE), gy - 28, { s: 12, w: "900", a: "center", c: "#b86e00" });
      var ok = e != null && Math.abs(e - TRUE) <= 2;
      if (e != null) {
        var ex = GX(clamp(e, 30, 100));
        K.planet(ctx, ex, gy, 9, ok ? "#9ff0d4" : "#ffb3bd", ok ? "#0f7a55" : "#a8202e");
        K.t(ctx, "내 설문 " + e.toFixed(1) + "%", ex, gy + 58, { s: 15, w: "900", a: "center", c: ok ? LT.green : LT.red });
      }
      K.tip(ctx, e == null ? "비율의 합을 100% 안으로" : (ok ? "실제 ± 2%p 안" : "실제와 " + Math.abs(e - TRUE).toFixed(1) + "%p 차이"), RX + 12, H - 54, RW - 24, e == null ? null : ok);
      return e;
    }
    function update() {
      var e = draw();
      $("sv-info").innerHTML = e == null ? "세 연령대 비율의 합이 100%를 넘지 않게 조절하세요." : "표본의 30~50대는 나머지 " + (100 - y - o) + "%. 설문 결과 " + e.toFixed(1) + "% (실제 " + TRUE.toFixed(1) + "%, 차이 " + Math.abs(e - TRUE).toFixed(1) + "%p). 표본이 마을을 닮아야 결과도 마을을 닮습니다." + (e != null && Math.abs(e - TRUE) <= 2 && !(Math.abs(y - POP[0]) <= 5 && Math.abs(o - POP[2]) <= 5) ? " <b>결과는 비슷하지만 연령 구성이 마을과 다릅니다.</b> 치우침이 우연히 서로 상쇄된 것이라, 다른 질문에서는 크게 어긋날 수 있어요." : "");
      if (e != null && Math.abs(e - TRUE) <= 2 && Math.abs(y - POP[0]) <= 5 && Math.abs(o - POP[2]) <= 5 && !ep.cleared(2)) {
        window.sthState("svBest", "10~20대 " + y + "% · 30~50대 " + (100 - y - o) + "% · 60대+ " + o + "% → " + e.toFixed(1) + "%");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("svBest") + ". 사회과학도 과학처럼 표본의 <b>대표성</b>을 따져 객관성을 높입니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("sv-y").addEventListener("input", function (ev) { y = +ev.target.value; $("sv-y-val").textContent = y + "%"; update(); });
    $("sv-o").addEventListener("input", function (ev) { o = +ev.target.value; $("sv-o-val").textContent = o + "%"; update(); });
    update();
    if (ep.cleared(2)) window.sthMission("m2-3", true);
  })();

  /* 장면 4 — 데이터 조각 */
  (function () {
    var canvas = $("c-art"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, sc = "lin", top = 2;
    var VAL = [1, 8, 40, 250, 1000];
    function hgt(x) { return sc === "lin" ? top * x / 1000 : top * (Math.log(x) / Math.LN10 + 1) / 4; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var yb = 252, s = 64, x0 = 90, LW = 610, DX = 12, DY = -9;
      K.studio(ctx, 0, 0, W, H);
      /* ── 밝은 전시장: 흰 벽 + 나무 바닥(입체 판) ── */
      ctx.save(); ctx.beginPath(); ctx.roundRect(6, 6, LW - 6, H - 12, 12); ctx.clip();
      var wall = ctx.createLinearGradient(0, 0, 0, yb); wall.addColorStop(0, "#f7f4ee"); wall.addColorStop(1, "#e8e1d4"); ctx.fillStyle = wall; ctx.fillRect(0, 0, LW, yb);
      var fl = ctx.createLinearGradient(0, yb, 0, H); fl.addColorStop(0, "#d6a874"); fl.addColorStop(1, "#a8794c"); ctx.fillStyle = fl; ctx.fillRect(0, yb, LW, H - yb);
      ctx.strokeStyle = "rgba(110,70,30,.2)"; ctx.lineWidth = 1;
      for (var pl = 0; pl < LW; pl += 46) { ctx.beginPath(); ctx.moveTo(pl, yb); ctx.lineTo(pl - 20, H); ctx.stroke(); }
      ctx.restore();
      var cyy = yb - 3 * s;
      K.line(ctx, { x: 20, y: cyy }, { x: LW - 20, y: cyy }, LT.red, 1.8, [6, 4]);
      K.pill(ctx, "천장 3 m", LW - 16, cyy - 8, { s: 11, a: "right", c: "#ffb3bd", box: [0, LW] });
      I0person(42, yb, 1.7 * s);
      VAL.forEach(function (x, i) {
        var h = hgt(x), px = x0 + i * 100, ph = Math.max(1.5, Math.min(h, 3.6) * s), bad = h > 3, tiny = h < 0.3, c0 = bad ? "#e03131" : (tiny ? "#f08c00" : "#0f9f76");
        ctx.fillStyle = "rgba(60,40,20,.22)"; ctx.beginPath(); ctx.ellipse(px + 26, yb + 3, 32, 5, 0, 0, 6.2832); ctx.fill();
        SP.poly(ctx, [{ x: px + 40, y: yb }, { x: px + 40 + DX, y: yb + DY }, { x: px + 40 + DX, y: yb - ph + DY }, { x: px + 40, y: yb - ph }], K.tint(c0, .7));
        SP.poly(ctx, [{ x: px, y: yb - ph }, { x: px + 40, y: yb - ph }, { x: px + 40 + DX, y: yb - ph + DY }, { x: px + DX, y: yb - ph + DY }], K.tint(c0, 1.35));
        var fg = ctx.createLinearGradient(px, 0, px + 40, 0); fg.addColorStop(0, K.tint(c0, 1.15)); fg.addColorStop(1, K.tint(c0, .85));
        ctx.globalAlpha = .9; ctx.fillStyle = fg; ctx.fillRect(px, yb - ph, 40, ph); ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(px + 5, yb - ph + 3, 4, Math.max(0, ph - 6));
        K.t(ctx, "해변 " + (i + 1) + " · " + x, px + 22, yb + 22, { s: 10, w: "800", a: "center", c: "#4a2e14" });
        K.pill(ctx, (h < 1 ? (h * 100).toFixed(h < 0.1 ? 1 : 0) + " cm" : h.toFixed(2) + " m"), px + 22, Math.max(yb - ph - 16, 60), { s: 11, a: "center", c: bad ? "#ffb3bd" : (tiny ? "#ffd2a8" : KC.ink) });
      });
      K.pill(ctx, "데이터 조각 전시장 · 미세 플라스틱 값", 18, 28, { s: 12.5, c: KC.ink });
      /* ── 오른쪽 흰 카드: 설계 점검 ── */
      var RX = LW + 8, RW = W - RX - 12, small = hgt(1), big = hgt(1000), ok = big >= 1 && big <= 3 && small >= 0.3;
      SP.card(ctx, RX, 14, RW, H - 28, "설계 점검 · " + (sc === "lin" ? "값에 비례(선형)" : "자릿수(로그)에 비례"), [
        ["가장 작은 기둥 (30 cm↑)", (small * 100).toFixed(1) + " cm", small >= 0.3 ? LT.green : LT.red],
        ["가장 큰 기둥 (1~3 m)", big.toFixed(2) + " m", big >= 1 && big <= 3 ? LT.green : LT.red]
      ], [ok ? "전시할 수 있다" : (bigOver() ? "천장을 뚫었다" : "조건을 아직 못 맞췄다"), ok], { top: 62, gap: 32 });
      if (sc === "log") K.t(ctx, "1 → 10 → 100 → 1,000 같은 간격", RX + 16, 170, { s: 11, w: "700", c: LT.mute });
      return ok;
    }
    function I0person(mx, yb, mh) {
      ctx.fillStyle = "rgba(60,40,20,.2)"; ctx.beginPath(); ctx.ellipse(mx + 4, yb + 2, 14, 3, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#5c6b8a"; ctx.beginPath(); ctx.roundRect(mx - 10, yb - mh + 20, 20, mh * .45, 7); ctx.fill();
      ctx.fillStyle = "#3d4452"; ctx.fillRect(mx - 8, yb - mh * .55 + 18, 6, mh * .55 - 18); ctx.fillRect(mx + 2, yb - mh * .55 + 18, 6, mh * .55 - 18);
      K.planet(ctx, mx, yb - mh + 9, 9, "#f6d2b4", "#b47a50");
      K.t(ctx, "관객 1.7 m", mx, yb + 22, { s: 10, w: "800", a: "center", c: "#4a2e14" });
    }
    function bigOver() { return hgt(1000) > 3; }
    function update() {
      var ok = draw();
      $("art-info").innerHTML = sc === "lin" ? "값에 비례하면 1,000배 차이가 그대로 높이 차이가 되어, 큰 기둥을 3 m로 해도 작은 기둥은 3 mm 밖에 안 됩니다." : "로그 눈금은 값이 10배 될 때마다 같은 높이만큼 올라갑니다. 1, 10, 100, 1,000이 같은 간격으로 놓여 큰 차이도 한눈에 담깁니다.";
      if (ok && !ep.cleared(3)) {
        window.sthState("artBest", "로그 눈금 · 가장 큰 기둥 " + top.toFixed(1) + " m");
        window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("artBest") + ". 예술가는 과학의 데이터를, 과학자는 예술의 표현을 빌려 쓸 수 있습니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("art-s", function (x) { sc = x; update(); });
    $("art-h").addEventListener("input", function (e) { top = +e.target.value; $("art-h-val").textContent = top.toFixed(1) + " m"; update(); });
    update();
    if (ep.cleared(3)) window.sthMission("m2-4", true);
  })();

  function finish() { window.sthState("r2", "해결 · 표본 " + (window.sthState("svBest") || "") + " / " + (window.sthState("artBest") || "")); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 생각</b> " + (p || "기록 없음") + "<br><b>설문 표본</b> " + (window.sthState("svBest") || "-") + "<br><b>데이터 조각</b> " + (window.sthState("artBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[융합과학 탐구 Ⅰ] 이야기 ② 같은 바다, 세 개의 탐구",
    items: [
      { id: "w1", label: "세 가지 탐구의 공통점", hint: "과학·예술·사회과학의 탐구 과정에서 공통으로 나타나는 단계를 하나 찾아 쓰세요." },
      { id: "e2b", label: "세 가지 탐구의 차이점", hint: "세 탐구가 추구하는 가치(객관성·주관성·인간과 사회의 가치)와 판단 기준을 비교해 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 빈 병원의 두 병동
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "p3", title: "첫 가설",
    question: "제1병동에서만 산모가 많이 죽는 까닭으로 가장 그럴듯한 가설은?",
    options: ["㉠ 제1병동의 공기가 나빠서", "㉡ 해부를 마친 의사·의대생의 손이 무언가를 옮겨서", "㉢ 제1병동 산모들이 원래 약해서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 원자료와 가공 */
  (function () {
    var canvas = $("c-sw"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, yr = "1846", md = "raw";
    var D = { "1846": [[4010, 459], [3754, 105]], "1848": [[3556, 45], [3219, 43]] };
    var got = window.sthState("swGot") || { a: false, b: false, q: false };
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var d = D[yr], LW = 500, yb = 252, x0 = 110, DX = 14, DY = -10;
      var vals = d.map(function (r) { return md === "raw" ? r[1] : r[1] / r[0] * 100; }), max = md === "raw" ? 500 : 12;
      K.studio(ctx, 0, 0, W, H, { x: 700, y: 270, rx: 170, ry: 14 });
      K.card(ctx, 10, 10, LW - 10, H - 20, yr + "년 · " + (md === "raw" ? "사망자 수 (원자료)" : "출산 100건당 사망률 (가공)"));
      for (var t = 0; t <= 4; t++) {
        var gy = yb - t * 190 / 4; K.line(ctx, { x: 60, y: gy }, { x: LW - 30, y: gy }, LT.grid, 1);
        K.t(ctx, md === "raw" ? String(t * 125) : (t * 3) + "%", 54, gy + 4, { s: 10, a: "right", c: LT.mute, w: "600" });
      }
      [["제1병동 (의사·의대생)", "red", LT.red], ["제2병동 (조산사)", "green", LT.green]].forEach(function (q, i) {
        var h = Math.max(2, vals[i] / max * 180), bx = x0 + i * 190, bw = 100, c = SP.mt(q[1]);
        SP.poly(ctx, [{ x: bx + bw, y: yb }, { x: bx + bw + DX, y: yb + DY }, { x: bx + bw + DX, y: yb - h + DY }, { x: bx + bw, y: yb - h }], c[2]);
        SP.poly(ctx, [{ x: bx, y: yb - h }, { x: bx + bw, y: yb - h }, { x: bx + bw + DX, y: yb - h + DY }, { x: bx + DX, y: yb - h + DY }], c[0]);
        var g = ctx.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, K.tint(c[1], 1.1)); g.addColorStop(1, K.tint(c[1], .85));
        ctx.fillStyle = g; ctx.fillRect(bx, yb - h, bw, h);
        K.t(ctx, md === "raw" ? vals[i] + "명" : vals[i].toFixed(1) + "%", bx + bw / 2, yb - h - 16, { s: 16, w: "900", a: "center", c: q[2] });
        K.t(ctx, q[0], bx + bw / 2, yb + 22, { s: 11.5, w: "800", a: "center", c: LT.ink });
      });
      K.line(ctx, { x: 60, y: yb }, { x: LW - 30, y: yb }, LT.line, 1.5);
      /* ── 오른쪽: 책상 위에 펼친 병원 장부(입체) ── */
      var RX = LW + 8, RW = W - RX, px = RX + 26, py = 50, pw = RW - 60, ph = 176;
      SP.poly(ctx, [{ x: px, y: py + ph }, { x: px + pw, y: py + ph }, { x: px + pw + 10, y: py + ph - 8 }, { x: px + 10, y: py + ph - 8 }], "#7a4a24");
      ctx.fillStyle = "#5a3418"; ctx.fillRect(px, py + ph, pw, 10);
      ctx.save(); ctx.shadowColor = "rgba(40,30,20,.3)"; ctx.shadowBlur = 10;
      var pg = ctx.createLinearGradient(px, py, px + pw, py + ph); pg.addColorStop(0, "#f6ecd2"); pg.addColorStop(1, "#e2cfa4");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "rgba(120,80,40,.3)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px + pw / 2, py + 4); ctx.lineTo(px + pw / 2, py + ph - 4); ctx.stroke();
      for (var ln = py + 52; ln < py + ph - 6; ln += 26) { ctx.beginPath(); ctx.moveTo(px + 12, ln); ctx.lineTo(px + pw - 12, ln); ctx.stroke(); }
      K.t(ctx, yr + "년 산부인과 · 출산 / 사망", px + 14, py + 26, { s: 13, c: "#5a3a1a", w: "800" });
      d.forEach(function (r, i) {
        var ly = py + 70 + i * 52;
        K.t(ctx, i ? "제2병동" : "제1병동", px + 14, ly, { s: 12.5, c: "#4a2e14", w: "800" });
        K.t(ctx, "출산 " + r[0].toLocaleString() + "  ·  사망 " + r[1], px + 14, ly + 22, { s: 12.5, c: "#6a4422", w: "700" });
      });
      if (md === "rate") K.pill(ctx, "사망률 = 사망 ÷ 출산 × 100", RX + RW / 2, H - 46, { s: 12, a: "center", c: "#bfe6ff" });
      K.pill(ctx, yr === "1848" ? "1847년 5월부터 염소 용액 손 씻기" : "손 씻기 전", RX + RW / 2, H - 16, { s: 11.5, a: "center", c: yr === "1848" ? "#7ff0c4" : KC.ink });
    }
    function update() {
      draw();
      var ch = false;
      $("sw-info").innerHTML = md === "raw" ? "원자료(사망자 수)는 출산 수가 다른 병동이나 해를 공정하게 비교하기 어렵습니다. 출산 100건당 사망률로 가공해 보세요." : (yr === "1846" ? "1846년 제1병동 사망률은 약 <b>11.4%</b>, 제2병동은 약 <b>2.8%</b> — 4배가 넘습니다." : "1847년 5월부터 의사·의대생이 염소 용액으로 손을 씻었습니다. 1848년 제1병동 사망률은 약 <b>1.3%</b>로, 제2병동과 비슷해졌습니다.");
      if (md === "rate" && yr === "1846" && !got.a) { got.a = ch = true; }
      if (md === "rate" && yr === "1848" && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("swGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-2a"); if (got.b) done("m3-2b"); if (got.q) done("m3-2c");
      if (got.a && got.b && got.q) { window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>원자료를 비율로 가공하자 차이가 드러났고, 손 씻기 뒤의 데이터가 가설을 뒷받침했습니다."); ep.clear(1); }
    }
    canvas._redraw = draw;
    segWire("sw-y", function (x) { yr = x; update(); });
    segWire("sw-m", function (x) { md = x; update(); });
    window.sthPick({
      mount: "s3-q1",
      q: "1846년과 1848년의 사망률 비교가 과학적 탐구에서 하는 역할은?",
      options: ["가설을 세우는 데만 쓰였다", "1846년 자료는 문제를 드러냈고, 1848년 자료는 손 씻기 가설을 검증했다", "두 해의 자료는 서로 관계가 없다", "사망자 수만 보면 충분했다"],
      answer: 1,
      why: ["1848년 자료는 가설을 ‘시험’한 결과입니다.", "같은 데이터라도 탐구 단계에 따라 문제 인식, 가설 검증의 근거로 쓰입니다.", "손 씻기 전과 뒤를 비교했기에 의미가 생깁니다.", "출산 수가 달라 비율로 가공해야 공정합니다."],
      onDone: function () { got.q = true; window.sthState("swGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 데이터 종류 */
  window.sthSort({
    mount: "s3-sort",
    buckets: [{ id: "raw", label: "데이터 원자료", sub: "가공하지 않은 최초의 측정 자료(1차 데이터)" }, { id: "pro", label: "가공된 데이터", sub: "목적에 맞게 처리한 데이터" }, { id: "big", label: "빅데이터", sub: "방대한 양·빠른 속도·다양성" }],
    items: [
      { t: "제멜바이스 병원 장부에 적힌 해마다의 출산 수와 사망자 수", a: "raw", why: "처음 기록된 그대로의 자료입니다." },
      { t: "온도계로 직접 재어 아직 아무 처리도 하지 않은 기온 기록", a: "raw", why: "1차 데이터입니다." },
      { t: "실험에서 측정기가 그대로 기록한 최초의 값", a: "raw", why: "원자료입니다." },
      { t: "장부의 숫자로 계산한 병동별 출산 100건당 사망률", a: "pro", why: "비율로 처리한 가공된 데이터입니다.", hint: "원자료에 계산을 한 번 더 했습니다." },
      { t: "설문 응답을 항목별로 정리해 평균과 그래프로 나타낸 결과", a: "pro", why: "가공된 데이터입니다." },
      { t: "원자료에서 이상값을 제거하고 단위를 맞춘 표", a: "pro", why: "분석에 바로 쓰도록 처리했습니다." },
      { t: "전국 수백만 명의 스마트폰 위치 정보를 실시간으로 모은 교통 자료", a: "big", why: "양·속도·다양성이 모두 큽니다." },
      { t: "여러 병원의 진료 기록을 통합해 감염병 확산을 추적하는 자료", a: "big", why: "방대하고 복잡한 빅데이터입니다." },
      { t: "전 세계 기상 관측소와 위성이 매시간 보내는 날씨 자료", a: "big", why: "빅데이터입니다." }
    ],
    onDone: function () { window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>원자료는 가공되어 해석되고, 빅데이터는 사람이 다 볼 수 없는 규모의 패턴을 드러냅니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m3-3", true);

  /* 장면 4 — 큰 수의 법칙 (기존 시뮬레이션) */
  (function () {
    var canvas = $("c2b"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, TRUE_VAL = 20, SIGMA = 6;
    function seeded(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
    function gauss(r) { var u1 = Math.max(1e-6, r()), u2 = r(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
    var rnd = seeded(42), S = [], n = 1, i;
    for (i = 0; i < 200; i++) S.push(TRUE_VAL + gauss(rnd) * SIGMA);
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var yMin = TRUE_VAL - SIGMA - 2, yMax = TRUE_VAL + SIGMA + 2, k, se;
      K.studio(ctx, 0, 0, W, H, { x: 770, y: 120, rx: 90, ry: 10 });
      K.card(ctx, 10, 10, 630, H - 20, "같은 양을 거듭 재며 구한 평균");
      var g = SP.chart(ctx, { x: 16, y: 54, w: 616, h: H - 70, x0: 0, x1: 200, y0: yMin, y1: yMax, xt: 4, yt: 4, xf: function (x) { return Math.round(x) + "번"; }, xl: "측정 횟수 n", yl: "잰 값" });
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
      ctx.fillStyle = "rgba(245,159,0,.18)"; ctx.beginPath();
      for (k = 1; k <= 200; k++) { se = SIGMA / Math.sqrt(k); if (k === 1) ctx.moveTo(g.X(k), g.Y(TRUE_VAL + se)); else ctx.lineTo(g.X(k), g.Y(TRUE_VAL + se)); }
      for (k = 200; k >= 1; k--) { se = SIGMA / Math.sqrt(k); ctx.lineTo(g.X(k), g.Y(TRUE_VAL - se)); }
      ctx.closePath(); ctx.fill();
      K.line(ctx, { x: g.L, y: g.Y(TRUE_VAL) }, { x: g.R, y: g.Y(TRUE_VAL) }, "#d9a400", 1.6, [5, 4]);
      ctx.fillStyle = "rgba(92,112,134,.55)";
      for (k = 0; k < n; k++) { ctx.beginPath(); ctx.arc(g.X(k + 1), g.Y(S[k]), 2.2, 0, 6.2832); ctx.fill(); }
      var pts = [], sum = 0;
      for (k = 0; k < n; k++) { sum += S[k]; pts.push([k + 1, sum / (k + 1)]); }
      if (pts.length > 1) SP.plot(ctx, g, pts, LT.green, { w: 2.8 });
      ctx.restore();
      var last = pts[pts.length - 1], lx = g.X(last[0]), ly = g.Y(clamp(last[1], yMin, yMax));
      ctx.fillStyle = LT.green; ctx.beginPath(); ctx.arc(lx, ly, 6, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      SP.lbl(ctx, "참값 " + TRUE_VAL, g.R - 6, g.Y(TRUE_VAL) - 6, { s: 11, a: "right", c: "#b86e00" });
      /* 오른쪽: 저울 미니어처 + 판정 카드 */
      var sx = 770, sy = 96;
      SP.cyl(ctx, sx, sy + 10, 60, 14, 12, "iron", { top: "#eef1f5" });
      SP.cyl(ctx, sx, sy - 10, 34, 8, 8, "brass");
      var avg = last[1], se2 = SIGMA / Math.sqrt(n), ok = se2 <= 1 + 1e-9;
      ctx.fillStyle = "#1c2230"; ctx.beginPath(); ctx.roundRect(sx - 30, sy + 28, 60, 18, 4); ctx.fill();
      K.t(ctx, avg.toFixed(2), sx, sy + 42, { s: 12, w: "900", a: "center", c: "#5affc0" });
      SP.card(ctx, 652, 150, 234, H - 162, null, [["측정 횟수", "n = " + n, LT.blue], ["표준 오차 σ/√n", se2.toFixed(2), ok ? LT.green : LT.red]], [ok ? "1 이하!" : "아직 1보다 크다", ok], { top: 30, gap: 28 });
      K.t(ctx, "● 한 번씩 잰 값  — 지금까지의 평균  ▒ 참값 ± σ/√n", 26, H - 18, { s: 10.5, w: "800", c: LT.mute });
    }
    function readout(avg, se) {
      var ok = se <= 1 + 1e-9;
      put("c2b-read",
        "<span class='k'>측정 횟수</span><span class='v b'>n = " + n + "</span>" +
        "<span class='k'>평균</span><span class='v g'>" + avg.toFixed(2) + "</span><span class='sub'>참값 " + TRUE_VAL + "에서 " + Math.abs(avg - TRUE_VAL).toFixed(2) + " 벗어남</span>" +
        "<span class='k'>표준 오차</span><span class='v y'>σ/√n = " + se.toFixed(2) + "</span><span class='sub'>σ = " + SIGMA + " ÷ √" + n + "</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "표준 오차 1 이하" : "표준 오차가 아직 1보다 큽니다") + "</span>");
    }
    function update() {
      var sum = 0; for (var k = 0; k < n; k++) sum += S[k];
      var avg = sum / n, se = SIGMA / Math.sqrt(n);
      draw(); readout(avg, se);
      $("c2b-n-val").textContent = n;
      $("c2b-info").innerHTML = "측정 <b>" + n + "번</b> · 평균 <b>" + avg.toFixed(2) + "</b> · 표준 오차 <b>σ/√n ≈ " + se.toFixed(2) + "</b>. 측정 횟수를 늘릴수록 개별 측정의 오차가 서로 상쇄되어 평균이 참값(" + TRUE_VAL + ")에 가까워집니다 — 데이터를 많이 모을수록 결론을 더 믿을 수 있는 까닭입니다.";
      if (se <= 1 + 1e-9 && n <= 46 && !ep.cleared(3)) {
        window.sthState("lnBest", "n = " + n + " → 표준 오차 " + se.toFixed(2) + ", 평균 " + avg.toFixed(2));
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("lnBest") + ". σ = 6이면 36번 재야 표준 오차가 1이 됩니다. 오차를 절반으로 줄이려면 4배를 더 재야 합니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("c2b-n").addEventListener("input", function (e) { n = +e.target.value; update(); });
    update();
    if (ep.cleared(3)) window.sthMission("m3-4", true);
  })();

  function finish() { window.sthState("r3", "해결 · 사망률 11.4% → 1.3% / " + (window.sthState("lnBest") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 가설</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 제멜바이스와 같은 가설입니다." : " — 제멜바이스는 해부 뒤의 손을 의심했습니다.") + "<br><b>표본 크기</b> " + (window.sthState("lnBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[융합과학 탐구 Ⅰ] 이야기 ③ 빈 병원의 두 병동",
    items: [
      { id: "w2", label: "데이터가 하는 일", hint: "제멜바이스 사례에서 데이터가 무엇을 바꾸었는지(가설을 세웠는지, 뒤집었는지, 검증했는지) 쓰세요." },
      { id: "e3b", label: "원자료와 가공된 데이터", hint: "사망자 수와 사망률 가운데 어느 것으로 비교해야 공정한지, 까닭과 함께 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 기울어진 건물의 경보
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "첫 답변",
    question: "수평계를 IoT 센서로 바꾸면 무엇이 가장 크게 달라질까요?",
    options: ["㉠ 건물이 덜 흔들린다", "㉡ 훨씬 자주, 자동으로 재고 기록해 변화를 바로 알 수 있다", "㉢ 사람이 더 자주 올라가야 한다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 표본화 */
  (function () {
    var canvas = $("c-fs"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, fs = 1.5, F = 2;
    var st = { on: !REDUCE }, tA = 0.3, flash = 0, lastK = -1;
    function app(f, s) { return Math.abs(f - Math.round(f / s) * s); }
    function nSamp() { var c = 0; for (var k = 0; k * (1 / fs) <= 2 + 1e-9; k++) c++; return c; }
    /* ── 위: 잘라 낸 땅 블록 위의 40년 된 아파트(센서 달린 건물) · 아래: 흔들림 기록 ── */
    var MH = 420;                                           /* 모형 칸 높이 */
    var I = K.iso({ ox: 412, oy: 170, s: 0.56, L: 560, D: 320 });
    var GZ = 50;                                            /* 땅 표면 높이(블록 두께) */
    var BX0 = 200, BX1 = 340, BY0 = 100, BY1 = 220, NF = 10, FH = 27, BZT = GZ + NF * FH;
    function gz(x, y) { return GZ + 1.5 * Math.sin(x / 60) * Math.cos(y / 45); }
    function gcol(x, y, z, light) {
      var c = (y > 252 && y < 286) ? "#6d7178" : ((y > 244 && y <= 252) || (y >= 286 && y < 292)) ? "#b9b4aa" : (x > BX0 - 14 && x < BX1 + 14 && y > BY0 - 14 && y < BY1 + 14) ? "#a9a49a" : "#7fae5a";
      return K.tint(c, light);
    }
    function wq(a, b, c, d, fill) { I.quad(ctx, a, b, c, d, fill); }
    function drawBuilding(sway) {
      var AMP = 16;                                         /* 꼭대기 흔들림(그림 단위, 크게 과장) */
      var tops = null, f, w;
      for (f = 0; f < NF; f++) {
        var z0 = GZ + f * FH, z1 = z0 + FH, d0 = sway * AMP * f / NF, d1 = sway * AMP * (f + 1) / NF;
        /* 앞면(y = BY1)과 오른쪽 면(x = BX1) — 층마다 위로 갈수록 더 밀린다 */
        var a = I.P(BX0 + d0, BY1, z0), b = I.P(BX1 + d0, BY1, z0), c = I.P(BX1 + d1, BY1, z1), d = I.P(BX0 + d1, BY1, z1);
        var gF = ctx.createLinearGradient(a.x, 0, b.x, 0); gF.addColorStop(0, "#d6cfc1"); gF.addColorStop(1, "#c3bbab");
        wq(a, b, c, d, gF);
        var e = I.P(BX1 + d0, BY0, z0), g = I.P(BX1 + d1, BY0, z1);
        wq(b, e, g, c, "#9d9588");
        ctx.strokeStyle = "rgba(60,50,40,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(e.x, e.y); ctx.stroke();
        /* 창문 */
        var R = K.rng(40 + f * 7);
        for (w = 0; w < 5; w++) {
          var xa = BX0 + 10 + w * 27, xb = xa + 15, dm = (d0 + d1) / 2;
          var lit = R() > .45;
          wq(I.P(xa + dm, BY1, z0 + 9), I.P(xb + dm, BY1, z0 + 9), I.P(xb + dm, BY1, z0 + 21), I.P(xa + dm, BY1, z0 + 21), lit ? "rgba(255,214,140,.95)" : "#5f6c84");
        }
        for (w = 0; w < 4; w++) {
          var ya = BY0 + 12 + w * 27, yb = ya + 14, dr = (d0 + d1) / 2;
          wq(I.P(BX1 + dr, ya, z0 + 9), I.P(BX1 + dr, yb, z0 + 9), I.P(BX1 + dr, yb, z0 + 21), I.P(BX1 + dr, ya, z0 + 21), R() > .5 ? "rgba(230,190,120,.85)" : "#4c566c");
        }
        tops = d1;
      }
      /* 옥상 */
      I.quad(ctx, I.P(BX0 + tops, BY0, BZT), I.P(BX1 + tops, BY0, BZT), I.P(BX1 + tops, BY1, BZT), I.P(BX0 + tops, BY1, BZT), "#e2dccf", "rgba(80,70,60,.35)");
      I.box(ctx, BX0 + 18 + tops, BY0 + 20, BZT, BX0 + 48 + tops, BY0 + 50, BZT + 16, "#d9d2c4", "#bdb5a6", "#9d9588");   /* 옥탑 */
      /* 아래층 벽의 금 */
      ctx.strokeStyle = "rgba(70,45,30,.75)"; ctx.lineWidth = 1.3; ctx.beginPath();
      var k0 = I.P(BX0 + 30 + sway * AMP * .1, BY1, GZ + 30);
      ctx.moveTo(k0.x, k0.y); ctx.lineTo(k0.x + 5, k0.y - 9); ctx.lineTo(k0.x + 2, k0.y - 16); ctx.lineTo(k0.x + 8, k0.y - 26); ctx.stroke();
      return tops;
    }
    function drawModel(sway, fa, good) {
      K.studio(ctx, 0, 0, W, MH, { x: I.P(I.L, I.D, 0).x - 120, y: I.P(I.L, I.D, 0).y - 30, rx: 330, ry: 52 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, MH, 14); ctx.clip();
      /* 땅 블록: 윗면 + 잘린 면의 흙·암반 */
      I.field(ctx, gz, gcol, 28, 16);
      ["front", "right"].forEach(function (side) {
        I.face(ctx, side, function (Lw) {
          var gg = ctx.createLinearGradient(0, 0, 0, GZ); gg.addColorStop(0, "#6b6a70"); gg.addColorStop(.42, "#8a7a62"); gg.addColorStop(1, "#6e5238");
          I.profile(ctx, side, function (u) { return side === "front" ? gz(u, I.D) : gz(I.L, u); }, 0); ctx.fillStyle = gg; ctx.fill();
          ctx.save(); I.profile(ctx, side, function (u) { return side === "front" ? gz(u, I.D) : gz(I.L, u); }, 0); ctx.clip();
          ctx.strokeStyle = "rgba(40,30,20,.3)"; ctx.lineWidth = 1;
          [20, 38].forEach(function (zz) { ctx.beginPath(); ctx.moveTo(0, zz); ctx.lineTo(Lw, zz + 2); ctx.stroke(); });
          var R = K.rng(side === "front" ? 5 : 9);
          for (var i = 0; i < Lw * 0.6; i++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.16)" : "rgba(30,20,10,.22)"; ctx.fillRect(R() * Lw, R() * 46, 1.8, 1.8); }
          ctx.restore();
        });
      });
      I.shade(ctx, "front", function (u) { return gz(u, I.D); });
      I.shade(ctx, "right", function (u) { return gz(I.L, u); });
      I.edges(ctx, GZ, GZ);
      /* 뒤쪽 나무·이웃집 */
      [[60, 60], [110, 40], [40, 150], [380, 50], [450, 70]].forEach(function (t, i) { I.tree(ctx, t[0], t[1], gz(t[0], t[1]), .9 + (i % 2) * .15); });
      I.house(ctx, 420, 120, GZ, 50, 40, 26, "#3f6fb5");
      I.house(ctx, 70, 205, GZ, 46, 34, 24, "#c0553f");
      /* 바람 화살표(건물 왼쪽 뒤에서 +x 방향으로) */
      [[150, 150], [170, 220], [195, 290]].forEach(function (q) {
        var p0 = I.P(30, q[0], q[1]), p1 = I.P(150, q[0], q[1]);
        K.arrow(ctx, p0, p1, "rgba(60,140,220,.75)", 2.2, 9);
      });
      /* 아파트 */
      var tops = drawBuilding(sway);
      /* 데이터 수집 장치(건물 오른쪽 앞) + 케이블 */
      I.box(ctx, BX1 + 14, BY1 + 6, GZ, BX1 + 34, BY1 + 22, GZ + 18, "#3a4256", "#2b3243", "#1e2433");
      var hub = I.P(BX1 + 24, BY1 + 14, GZ + 18), rs = I.P(BX1 - 22 + tops, BY1 - 18, BZT + 6), ts = I.P(BX0 + 4 + sway * 8, BY1, GZ + 5 * FH + 14);
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "rgba(40,60,90,.7)"; ctx.lineWidth = 1.4;
      var ce = I.P(BX1 + tops, BY1, BZT), cb = I.P(BX1, BY1, GZ + 4);
      ctx.beginPath(); ctx.moveTo(rs.x, rs.y); ctx.lineTo(ce.x, ce.y); ctx.lineTo(cb.x, cb.y); ctx.lineTo(hub.x, hub.y); ctx.stroke(); ctx.restore();
      K.line(ctx, { x: hub.x, y: hub.y }, { x: hub.x, y: hub.y - 18 }, "#2b3243", 2);
      ctx.strokeStyle = "rgba(63,160,120,.85)"; ctx.lineWidth = 1.6;
      [7, 13, 19].forEach(function (r) { ctx.beginPath(); ctx.arc(hub.x, hub.y - 18, r, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); });
      /* 벽의 기울기 센서 */
      ctx.fillStyle = "#1b2140"; ctx.beginPath(); ctx.roundRect(ts.x - 7, ts.y - 5, 14, 10, 2); ctx.fill();
      K.glow(ctx, ts.x, ts.y, 2, "rgba(127,211,255,.95)", 3);
      /* 옥상 가속도 센서 — 잴 때마다 번쩍 */
      ctx.fillStyle = "#1b2140"; ctx.beginPath(); ctx.roundRect(rs.x - 11, rs.y - 7, 22, 12, 3); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.stroke();
      K.glow(ctx, rs.x + 5, rs.y - 1, 2 + flash * 3, flash > .05 ? "rgba(255,150,40,.98)" : "rgba(255,150,40,.5)", 3 + flash * 3);
      if (flash > .05) { ctx.strokeStyle = "rgba(255,140,30," + (flash * .8) + ")"; ctx.lineWidth = 1.8; [12, 21].forEach(function (r) { ctx.beginPath(); ctx.arc(rs.x, rs.y, r + (1 - flash) * 10, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }); }
      /* 사람 */
      I.person(ctx, BX1 + 60, BY1 + 40, GZ, "#ff6b81", 1.1);
      I.person(ctx, 150, 268, GZ, "#3fa0ff", 1.1);
      ctx.restore();
      /* 이름표 */
      var box = [0, W];
      I.label(ctx, BX1 - 22 + tops, BY1 - 18, BZT + 10, "가속도 센서 · 1초에 " + fs + "번", 60, -26, "#ffd8a8", box);
      I.label(ctx, BX0 + 4 + sway * 8, BY1, GZ + 5 * FH + 14, "기울기 센서", -46, -8, "#bfe6ff", box);
      I.label(ctx, BX1 + 24, BY1 + 14, GZ + 36, "데이터 수집 장치 → 인터넷", 70, -14, "#c8f5dc", box);
      I.label(ctx, BX0 + 30, BY1, GZ + 22, "벽의 금", -40, 18, "#ffd0c0", box);
      var wl = I.P(30, 170, 220); K.pill(ctx, "바람", wl.x - 6, wl.y + 9, { s: 11, a: "right", c: KC.blue, box: box });
      /* 큰 제목 */
      var t1, t2, c2 = "#ffd35a";
      if (Math.abs(fs - 2 * F) < 1e-9) { t1 = "흔들림이 사라졌다"; t2 = "잴 때마다 건물이 제자리를 지나고 있었다"; }
      else if (!good) { t1 = "엉뚱한 흔들림으로 기록된다"; t2 = "실제 2 Hz → 기록 " + fa.toFixed(1) + " Hz"; }
      else if (fs <= 6) { t1 = "흔들림을 알뜰하게 잡았다"; t2 = "2초에 " + nSamp() + "번 재고도 2 Hz 그대로"; c2 = "#7ff0b8"; }
      else { t1 = "정확하지만 데이터가 넘친다"; t2 = "2초에 " + nSamp() + "번 · 배터리·저장 공간 낭비"; }
      K.bigText(ctx, t1, 22, 52, 27, "#ffffff");
      K.bigText(ctx, t2, 22, 84, 17, c2);
      K.warn(ctx, W - 14, 30, "⚠ 흔들림·건물 크기는 크게 과장", "right");
      K.pill(ctx, "느린 화면 ⅛배", W - 14, 56, { s: 11, a: "right", c: "#ffffff", box: box });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var T = 2, sway = Math.sin(2 * Math.PI * F * tA);
      var fa = app(F, fs), good = Math.abs(fa - F) < 1e-9 && fs > 2 * F;
      drawModel(sway, fa, good);

      /* ── 아래: 흔들림 기록 ── */
      var Y0 = MH + 8, x0 = 40, x1 = W - 24, cy = Y0 + 112, A = 66;
      K.stage(ctx, 0, Y0, W, H - Y0, "lab", { seed: 37 });
      function X(t) { return x0 + t / T * (x1 - x0); }
      K.line(ctx, { x: x0, y: cy }, { x: x1, y: cy }, KC.line, 1);
      var wave = []; for (var t = 0; t <= T + 1e-9; t += 0.005) wave.push([X(t), cy - A * Math.sin(2 * Math.PI * F * t)]);
      glowPath(ctx, wave, KC.blue, 2.4);
      var pts = [];
      for (var k = 0; k * (1 / fs) <= T + 1e-9; k++) { var tk = k / fs; pts.push([X(tk), cy - A * Math.sin(2 * Math.PI * F * tk)]); }
      glowPath(ctx, pts, KC.red, 2.4, [7, 4]);
      pts.forEach(function (p) { K.line(ctx, { x: p[0], y: cy }, { x: p[0], y: p[1] }, "rgba(255,179,92,.35)", 1); K.glow(ctx, p[0], p[1], 4, "rgba(255,179,92,.98)", 2.6); });
      var tp = tA % T;
      K.line(ctx, { x: X(tp), y: Y0 + 40 }, { x: X(tp), y: H - 30 }, "rgba(127,211,255,.25)", 1);
      K.glow(ctx, X(tp), cy - A * Math.sin(2 * Math.PI * F * tp), 4, "rgba(220,245,255,.98)", 3.4);
      for (var s = 0; s <= 4; s++) K.t(ctx, (s * 0.5).toFixed(1) + " s", X(s * 0.5), H - 12, { s: 10, a: "center", c: KC.mute, w: "600" });
      K.pill(ctx, "— 실제 흔들림 2 Hz", 16, Y0 + 24, { s: 11.5, c: KC.blue });
      K.pill(ctx, "● 센서가 잰 값", 186, Y0 + 24, { s: 11.5, c: KC.orange });
      K.pill(ctx, "┄ 기록된 흔들림 " + fa.toFixed(1) + " Hz", W - 14, Y0 + 24, { s: 11.5, a: "right", c: good ? KC.green : KC.red });
      return fa;
    }
    function readout(fa) {
      var good = Math.abs(fa - F) < 1e-9 && fs > 2 * F;
      put("fs-read",
        "<span class='k'>표본화</span><span class='v b'>" + fs + " Hz</span><span class='sub'>" + (1000 / fs).toFixed(0) + " ms마다 한 번 · 2초에 " + nSamp() + "번</span>" +
        "<span class='k'>기록된 흔들림</span><span class='v " + (good ? "g" : "r") + "'>" + fa.toFixed(1) + " Hz</span><span class='sub'>실제 2 Hz · 기준 2 × 2 Hz = 4 Hz</span>" +
        "<span class='ok " + (good ? "g" : "r") + "'>" + (good ? "흔들림을 제대로 기록합니다" : "겹침 현상 · 엉뚱한 흔들림으로 기록") + "</span>");
    }
    function update() {
      var fa = draw(); readout(fa);
      $("fs-info").innerHTML = "1초에 " + fs + "번 재면 기록된 흔들림은 <b>" + fa.toFixed(1) + " Hz</b>" + (fs <= 2 * F ? " — 너무 드물게 재서 실제와 다른 흔들림으로 기록됩니다(겹침 현상)." : " — 실제 진동수와 같습니다.") + " 흔들림 진동수의 <b>2배보다 자주</b> 재야 합니다.";
      if (fs > 2 * F && fs <= 6 && Math.abs(fa - F) < 1e-9 && !ep.cleared(1)) {
        window.sthState("fsBest", "1초에 " + fs + "번(" + fs + " Hz) 측정");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("fsBest") + ". 흔들림 2 Hz의 2배(4 Hz)보다 조금 더 자주 재면 충분합니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("fs-v").addEventListener("input", function (e) { fs = +e.target.value; $("fs-v-val").textContent = fs + " Hz"; update(); });
    pauser("fs-play", st, ["건물 멈추기", "건물 흔들기"]);
    K.animate(canvas, function (dt) {
      if (!st.on) return;
      tA += dt / 1000 / 8;
      var k = Math.floor((tA % 2) * fs + 1e-9);
      if (k !== lastK) { lastK = k; flash = 1; }
      flash = Math.max(0, flash - dt / 400);
      draw();
    });
    update();
    if (ep.cleared(1)) window.sthMission("m4-2", true);
  })();

  /* 장면 3 — 문턱값 */
  (function () {
    var canvas = $("c-th"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, th = 0.25;
    function pdf(x, m, s) { return Math.exp(-Math.pow(x - m, 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); }
    function rates() { return { miss: Phi((th - 0.30) / 0.05) * 100, fa: (1 - Phi((th - 0.10) / 0.03)) * 100 }; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = rates();
      K.studio(ctx, 0, 0, W, H, { x: 770, y: 150, rx: 80, ry: 10 });
      K.card(ctx, 10, 10, 630, H - 20, "센서가 잰 기울기의 분포 — 문턱으로 가른다");
      var g = SP.chart(ctx, { x: 16, y: 54, w: 616, h: H - 66, x0: 0, x1: 0.45, y0: 0, y1: 14, xt: 9, yt: 2, xf: function (x) { return x.toFixed(2) + "°"; }, yf: function () { return ""; }, pl: 20, xl: "기울기" });
      function curve(m, s) { var p = []; for (var x = 0; x <= 0.45 + 1e-9; x += 0.002) p.push([x, pdf(x, m, s)]); return p; }
      function area(m, s, a, b, col) {
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(0));
        for (var x = a; x <= b + 1e-9; x += 0.002) ctx.lineTo(g.X(x), g.Y(pdf(x, m, s)));
        ctx.lineTo(g.X(b), g.Y(0)); ctx.closePath(); ctx.fill();
      }
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T - 4, g.R - g.L, g.B - g.T + 4); ctx.clip();
      area(0.10, 0.03, 0, 0.45, "rgba(15,159,118,.12)"); area(0.30, 0.05, 0, 0.45, "rgba(224,49,49,.10)");
      area(0.10, 0.03, th, 0.45, "rgba(15,159,118,.55)");
      area(0.30, 0.05, 0, th, "rgba(224,49,49,.55)");
      SP.plot(ctx, g, curve(0.10, 0.03), LT.green); SP.plot(ctx, g, curve(0.30, 0.05), LT.red);
      ctx.restore();
      SP.lbl(ctx, "정상 건물", g.X(0.10) - 26, g.T + 30, { s: 12, a: "right", c: LT.green });
      SP.lbl(ctx, "위험 건물", g.X(0.33), g.Y(pdf(0.30, 0.30, 0.05)) - 8, { s: 12, c: LT.red });
      var tx = g.X(th);
      K.line(ctx, { x: tx, y: g.T - 2 }, { x: tx, y: g.B }, "#d9a400", 2.4);
      K.pill(ctx, "문턱 " + th.toFixed(2) + "°", tx, g.T + 6, { s: 12, a: "center", c: "#ffe08a" });
      K.arrow(ctx, { x: tx + 10, y: g.B - 40 }, { x: Math.min(tx + 70, g.R - 4), y: g.B - 40 }, "#d9a400", 2, 8);
      SP.lbl(ctx, "경보!", Math.min(tx + 12, g.R - 40), g.B - 50, { s: 11.5, c: "#b86e00" });
      /* 오른쪽: 기울기 센서를 단 아파트 미니어처 + 판정 카드 */
      var I = K.iso({ ox: 770, oy: 100, s: 0.6, L: 70, D: 50 });
      ctx.save(); ctx.translate(780, 136); ctx.rotate(th * 0.4); ctx.translate(-780, -136);
      SP.box(ctx, I, 0, 0, 0, 70, 50, 90, ["#e9ecf2", "#b7c1d0", "#8f9bad"]);
      for (var fz = 12; fz < 90; fz += 14) for (var fx = 8; fx < 70; fx += 14) { var wp = I.P(fx, 50, fz); ctx.fillStyle = "rgba(60,120,190,.55)"; ctx.fillRect(wp.x - 3, wp.y - 8, 6, 6); }
      var sp0 = I.P(70, 25, 70); ctx.fillStyle = "#e03131"; ctx.beginPath(); ctx.arc(sp0.x, sp0.y, 4, 0, 6.2832); ctx.fill();
      ctx.restore();
      SP.card(ctx, 652, 164, 234, H - 176, null, [["놓친 위험", r.miss.toFixed(2) + "%", r.miss <= 1 ? LT.green : LT.red], ["헛경보", r.fa.toFixed(2) + "%", r.fa <= 5 ? LT.green : LT.red]], null, { top: 30, gap: 30 });
      K.t(ctx, "목표: 놓침 1% 이하 · 헛경보 5% 이하", 664, H - 24, { s: 10, w: "700", c: LT.mute });
      return r;
    }
    function update() {
      var r = draw();
      put("th-read",
        "<span class='k'>문턱</span><span class='v y'>" + th.toFixed(2) + "°</span><span class='sub'>이보다 기울면 경보</span>" +
        "<span class='k'>위험 놓침</span><span class='v " + (r.miss <= 1 ? "g" : "r") + "'>" + r.miss.toFixed(2) + "%</span><span class='sub'>목표 1% 이하</span>" +
        "<span class='k'>헛경보</span><span class='v " + (r.fa <= 5 ? "g" : "r") + "'>" + r.fa.toFixed(2) + "%</span><span class='sub'>목표 5% 이하</span>" +
        "<span class='ok " + (r.miss <= 1 && r.fa <= 5 ? "g" : "r") + "'>" + (r.miss <= 1 && r.fa <= 5 ? "두 기준을 모두 만족합니다" : "한쪽을 줄이면 다른 쪽이 늘어납니다") + "</span>");
      $("th-info").innerHTML = "문턱보다 큰 기울기가 들어오면 경보를 울립니다. 문턱을 내리면 놓침이 줄고 헛경보가 늘며, 올리면 그 반대입니다.";
      if (r.miss <= 1 && r.fa <= 5 && !ep.cleared(2)) {
        window.sthState("thBest", "문턱 " + th.toFixed(2) + "° → 놓침 " + r.miss.toFixed(2) + "%, 헛경보 " + r.fa.toFixed(2) + "%");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("thBest") + ". 인공지능의 판단도 사람이 정한 기준 위에서 이루어집니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("th-v").addEventListener("input", function (e) { th = +e.target.value; $("th-v-val").textContent = th.toFixed(2) + "°"; update(); });
    update();
    if (ep.cleared(2)) window.sthMission("m4-3", true);
  })();

  /* 장면 4 — 도구 분류와 프로젝트 절차 */
  (function () {
    var got = window.sthState("prjGot") || { a: false, b: false };
    function mission() {
      if (got.a) done("m4-4a"); if (got.b) done("m4-4b");
      if (got.a && got.b) { window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>디지털 도구를 이해하고, 인공지능 개선 프로젝트의 절차를 세웠습니다."); ep.clear(3); ep.clear(4); }
    }
    window.sthSort({
      mount: "s4-sort",
      buckets: [{ id: "a", label: "아날로그 도구" }, { id: "d", label: "디지털 탐구 도구" }],
      items: [
        { t: "손으로 눈금을 읽는 피펫", a: "a", why: "사람이 눈금을 맞춥니다." },
        { t: "정해진 양을 버튼 하나로 일정하게 옮기는 전자식 피펫", a: "d", why: "정밀하고 반복이 일정합니다." },
        { t: "눈금을 읽어 공책에 적는 온·습도계", a: "a", why: "기록을 사람이 합니다." },
        { t: "측정값을 자동으로 저장하는 디지털 온·습도계", a: "d", why: "자동 기록이 됩니다." },
        { t: "긴 줄자", a: "a", why: "아날로그 측정 도구입니다." },
        { t: "레이저 거리 측정기", a: "d", why: "빛을 이용해 거리를 디지털로 잽니다." },
        { t: "눈으로 보고 스케치하는 광학 현미경 관찰", a: "a", why: "관찰 결과를 사람이 기록합니다.", hint: "결과를 누가 기록하나요?" },
        { t: "인터넷으로 측정값을 실시간 전송하는 IoT 센서", a: "d", why: "사물 인터넷입니다." }
      ],
      onDone: function () { got.a = true; window.sthState("prjGot", got); mission(); }
    });
    var STEPS = ["① 생활 속 인공지능 사례 찾기 (음성 비서, 추천 알고리즘, 자동 번역 …)", "② 직접 써 보며 불편한 점·오류·한계 기록하기", "③ 모둠 토의로 개선 아이디어 제안하기", "④ 포트폴리오로 정리해 발표·공유하기"];
    if (got.b) filledOrder("s4-order", STEPS);
    else window.sthOrder({ mount: "s4-order", steps: STEPS, onDone: function () { got.b = true; window.sthState("prjGot", got); mission(); } });
    mission();
  })();

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("fsBest") || "") + " / " + (window.sthState("thBest") || "")); }
  function vs() {
    var p = window.sthState("p4") || "";
    $("e4-vs").innerHTML = "<b>나의 첫 답변</b> " + (p || "기록 없음") + "<br><b>측정 주기</b> " + (window.sthState("fsBest") || "-") + "<br><b>경보 문턱</b> " + (window.sthState("thBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[융합과학 탐구 Ⅰ] 이야기 ④ 기울어진 건물의 경보",
    items: [
      { id: "e4a", label: "생활 속 인공지능 개선 아이디어", hint: "생활 속 인공지능 하나를 골라, 써 보며 발견한 문제점과 개선 아이디어를 쓰세요." },
      { id: "e4b", label: "디지털 도구를 탐구에 쓰는 방법", hint: "내가 하고 싶은 탐구 하나에 디지털 탐구 도구(센서, 앱, 인공지능 등)를 어떻게 쓸지, 주의할 점(측정 주기, 판정 기준)과 함께 쓰세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[융합과학 탐구 Ⅰ] 융합과학 탐구의 이해 — 정리",
  recap: [
    { key: "r1", label: "① 사진 51번" },
    { key: "r2", label: "② 같은 바다, 세 개의 탐구" },
    { key: "r3", label: "③ 빈 병원의 두 병동" },
    { key: "r4", label: "④ 기울어진 건물의 경보" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "DNA 사진, 해변의 세 탐구, 병원 장부, 건물 센서. 네 이야기를 ‘융합’과 ‘데이터’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "cvg-1", unitLabel: "[융합과학 탐구 Ⅰ] 융합과학 탐구의 이해",
  rows: [
    { key: "r1", label: "① 사진 51번" },
    { key: "r2", label: "② 같은 바다, 세 개의 탐구" },
    { key: "r3", label: "③ 빈 병원의 두 병동" },
    { key: "r4", label: "④ 기울어진 건물의 경보" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
