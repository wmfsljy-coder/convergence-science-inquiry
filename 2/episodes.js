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
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 51 });
      var g = K.chart(ctx, { x: 6, y: 40, w: LW - 16, h: H - 44, x0: 0, x1: 23, y0: -45, y1: 90, xt: 23, yt: 3, xf: function (i) { return i % 6 === 0 || i === 23 ? i + "시" : ""; }, yf: function (t) { return Math.round(t) + " ℃"; }, pl: 56 });
      function Y(t) { return g.Y(clamp(t, -45, 90)); }
      /* 남기는 범위 */
      var bg = ctx.createLinearGradient(0, Y(med + X), 0, Y(med - X));
      bg.addColorStop(0, "rgba(255,211,107,.10)"); bg.addColorStop(.5, "rgba(255,211,107,.28)"); bg.addColorStop(1, "rgba(255,211,107,.10)");
      ctx.fillStyle = bg; ctx.fillRect(g.L, Y(med + X), g.R - g.L, Math.max(2, Y(med - X) - Y(med + X)));
      K.line(ctx, { x: g.L, y: Y(med) }, { x: g.R, y: Y(med) }, "rgba(255,211,107,.6)", 1, [3, 4]);
      K.plot(ctx, g, OUT.map(function (t, i) { return [i, t]; }), KC.blue);
      IN.forEach(function (t, i) {
        var px = g.X(i), py = Y(t);
        if (k[i]) K.glow(ctx, px, py, 4, "rgba(255,140,120,.98)", 2.6);
        else {
          ctx.fillStyle = "rgba(160,170,210,.5)"; ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.2832); ctx.fill();
          ctx.save(); ctx.shadowColor = KC.red; ctx.shadowBlur = 8; ctx.strokeStyle = KC.red; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(px - 7, py - 7); ctx.lineTo(px + 7, py + 7); ctx.moveTo(px + 7, py - 7); ctx.lineTo(px - 7, py + 7); ctx.stroke(); ctx.restore();
        }
      });
      [7, 15].forEach(function (i) { K.pill(ctx, (k[i] ? "오작동? " : "지움 ") + IN[i] + " ℃", g.X(i) + 12, Y(IN[i]) + (IN[i] < 0 ? -6 : 18), { s: 11, c: k[i] ? KC.orange : KC.red, box: [0, LW] }); });
      K.pill(ctx, "● 실내 기록계", 16, 28, { s: 11.5, c: "#ffb0a0" });
      K.pill(ctx, "— 기상청 바깥 기온", 132, 28, { s: 11.5, c: KC.blue });
      K.pill(ctx, "▒ 중앙값 " + med + " ℃ ± " + X + " ℃ (남기는 범위)", LW - 14, 28, { s: 11.5, a: "right", c: KC.yellow, box: [0, LW] });

      /* ── 오른쪽: 기록계 화면 ── */
      var keptIn = IN.filter(function (t, i) { return k[i]; }), mi = keptIn.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, keptIn.length), mo = OUT.reduce(function (a, b) { return a + b; }, 0) / 24;
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 4, title: "가공한 데이터" });
      var lx = RX + 18, lw = RW - 36, ly = 50, lh = 186;
      var lg = ctx.createLinearGradient(lx, ly, lx, ly + lh); lg.addColorStop(0, "#1d3a2c"); lg.addColorStop(1, "#0e2219");
      ctx.fillStyle = "#2a2f45"; ctx.beginPath(); ctx.roundRect(lx - 6, ly - 6, lw + 12, lh + 12, 12); ctx.fill();
      ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(lx, ly, lw, lh, 8); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.beginPath(); ctx.roundRect(lx, ly, lw, lh * .4, [8, 8, 0, 0]); ctx.fill();
      ctx.save(); ctx.shadowColor = "#7dffb5"; ctx.shadowBlur = 6;
      K.t(ctx, "지운 값  " + (24 - keptIn.length) + "개", lx + 14, ly + 30, { s: 14, c: "#9dffc6", w: "900" });
      K.t(ctx, "실내 평균  " + mi.toFixed(1) + " ℃", lx + 14, ly + 70, { s: 14, c: "#ffc2b0", w: "900" });
      K.t(ctx, "바깥 평균  " + mo.toFixed(1) + " ℃", lx + 14, ly + 102, { s: 14, c: "#bfe8ff", w: "900" });
      K.t(ctx, "차이  " + (mi - mo).toFixed(1) + " ℃", lx + 14, ly + 152, { s: 22, c: "#d8ffe9", w: "900" });
      ctx.restore();
      K.pill(ctx, "중앙값은 튀는 값에 잘 안 흔들림", RX + RW / 2, H - 16, { s: 11, a: "center", c: KC.mute, box: [RX, W] });
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
      /* ── 왼쪽: 떨어지는 필터와 동작 감지 센서 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 71 });
      var sx = 132, sy = 24, t = tA % 1.8, tt = Math.min(t, 1.5), fy = 46 + pos(tt) / pos(1.5) * (H - 82);
      ctx.fillStyle = "#262d52"; ctx.beginPath(); ctx.roundRect(sx - 26, sy - 12, 52, 20, 5); ctx.fill();
      ctx.strokeStyle = "rgba(200,210,255,.45)"; ctx.lineWidth = 1; ctx.stroke();
      [-9, 9].forEach(function (o) { ctx.fillStyle = "#0b0f22"; ctx.beginPath(); ctx.arc(sx + o, sy - 2, 6, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(127,211,255,.6)"; ctx.stroke(); });
      if (ping > .02) { ctx.strokeStyle = "rgba(127,211,255," + ping * .8 + ")"; ctx.lineWidth = 1.5; for (var a = 0; a < 3; a++) { var rr = 14 + a * 10 + (1 - ping) * 24; ctx.beginPath(); ctx.arc(sx, sy + 6, rr, Math.PI * .25, Math.PI * .75); ctx.stroke(); } }
      K.line(ctx, { x: sx, y: sy + 10 }, { x: sx, y: fy - 4 }, "rgba(127,211,255,.25)", 1, [3, 4]);
      filter(ctx, sx, fy, 46, 1);
      var fl = ctx.createLinearGradient(0, H - 22, 0, H); fl.addColorStop(0, "#3a3150"); fl.addColorStop(1, "#1a1530");
      ctx.fillStyle = fl; ctx.fillRect(4, H - 22, LW - 8, 18);
      K.pill(ctx, "동작 감지 센서", 12, 27, { s: 10.5, c: KC.blue, box: [0, LW] });
      K.pill(ctx, "느린 화면", 12, H - 30, { s: 10.5, c: KC.mute, box: [0, LW] });
      /* ── 오른쪽: 찍힌 점 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 73, title: "낙하 1.5초 동안 찍힌 점 " + n + "개" });
      var g = K.chart(ctx, { x: RX + 4, y: 38, w: W - RX - 14, h: H - 40, x0: 0, x1: 1.5, y0: 0, y1: 2.2, xt: 3, yt: 2, xf: function (x) { return x.toFixed(1) + " s"; }, yf: function (y) { return y.toFixed(1); }, pl: 40, yl: "속력(m/s)" });
      var curve = []; for (var s = 0; s <= 1.5 + 1e-9; s += 0.01) curve.push([s, Math.tanh(9.8 * s / 2) * 2]);
      K.plot(ctx, g, curve, "rgba(127,211,255,.55)", { w: 1.6 });
      var noise = rate > 50 ? 0.25 : 0.03, r = seeded(rate);
      for (var k = 0; k < n; k++) { var tk = k / rate, vk = Math.tanh(9.8 * tk / 2) * 2 + gauss(r) * noise; K.glow(ctx, g.X(tk), g.Y(clamp(vk, 0, 2.2)), n > 60 ? 2.2 : 3.4, "rgba(255,179,92,.98)", 2.4); }
      K.line(ctx, { x: g.X(tt), y: g.T }, { x: g.X(tt), y: g.B }, "rgba(127,211,255,.25)", 1);
      K.pill(ctx, good ? "✅ 알맞은 간격" : (n < 30 ? "점이 너무 적어 변화가 안 보임" : "너무 촘촘해 속도 잡음이 커짐"), W - 14, 28, { s: 12, a: "right", c: good ? KC.green : KC.red });
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
      /* ── 왼쪽: 떨어지는 필터와 힘 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 81, title: "필터 " + n + "장 낙하" });
      var top = 70, bot = H - 100, fx = 110, fy = top + pos(t, n) / Math.max(pos(T, n), 1e-6) * (bot - top);
      ctx.strokeStyle = "rgba(200,210,255,.25)"; ctx.lineWidth = 1;
      for (var m = 0; m <= 4; m++) { var my = top + m / 4 * (bot - top); ctx.beginPath(); ctx.moveTo(LW - 34, my); ctx.lineTo(LW - 24, my); ctx.stroke(); }
      K.line(ctx, { x: LW - 29, y: top }, { x: LW - 29, y: bot }, "rgba(200,210,255,.25)", 1);
      filter(ctx, fx, fy - 10, 50, n);
      var cyF = fy + 6;
      K.arrow(ctx, { x: fx + 36, y: cyF }, { x: fx + 36, y: cyF + Fw }, KC.red, 3, 9);
      if (Fd > 4) K.arrow(ctx, { x: fx - 36, y: cyF }, { x: fx - 36, y: cyF - Fd }, KC.blue, 3, 9);
      K.pill(ctx, "중력", fx + 46, cyF + 16, { s: 10.5, c: KC.red, box: [0, LW] });
      if (Fd > 4) K.pill(ctx, "공기 저항", fx - 44, cyF - 6, { s: 10.5, a: "right", c: KC.blue, box: [0, LW] });
      K.pill(ctx, "속력 " + u.toFixed(2) + " m/s", LW / 2, H - 16, { s: 12, a: "center", c: Math.abs(u - vt(n)) < 0.02 ? KC.green : KC.ink, box: [0, LW] });
      K.t(ctx, "느린 화면", LW - 14, 52, { s: 10, a: "right", c: KC.mute });

      /* ── 오른쪽: 고른 시각 자료 ── */
      var RX = LW + 8, g;
      if (view === "bar") {
        K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 83, title: "필터 수별 마지막 속도 (막대 차트)" });
        g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 14, h: H - 44, x0: 0, x1: 6, y0: 0, y1: 2.6, xt: 6, yt: 2, xf: function () { return ""; }, yf: function (y) { return y.toFixed(1); }, pl: 44 });
        for (var k = 1; k <= 6; k++) {
          var bx = g.X(k - 0.5), bh = g.B - g.Y(vt(k)), on = k === n, col = on ? "255,107,129" : "160,170,210";
          var bg = ctx.createLinearGradient(bx - 28, 0, bx + 28, 0); bg.addColorStop(0, "rgba(" + col + ",.9)"); bg.addColorStop(1, "rgba(" + col + ",.4)");
          ctx.save(); if (on) { ctx.shadowColor = KC.red; ctx.shadowBlur = 12; } ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(bx - 28, g.B - bh, 56, bh, [6, 6, 0, 0]); ctx.fill(); ctx.restore();
          K.t(ctx, k + "장", bx, g.B + 16, { s: 10.5, a: "center", c: on ? KC.ink : KC.mute });
        }
        K.pill(ctx, "시간에 따른 변화는 안 보인다", W - 14, 28, { s: 11.5, a: "right", c: KC.orange });
      } else {
        var xt = view === "xt";
        K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 85, title: xt ? "떨어진 거리 — 시간 (위치-시간 그래프)" : "속력 — 시간 (속도-시간 그래프)" });
        g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 14, h: H - 44, x0: 0, x1: T, y0: 0, y1: xt ? 2.4 : 2.6, xt: 3, yt: xt ? 3 : 2, xf: function (x) { return x.toFixed(1) + "초"; }, yf: function (y) { return y.toFixed(1); }, pl: 44, yl: xt ? "거리(m)" : "속력(m/s)" });
        var pts = []; for (var s = 0; s <= T + 1e-9; s += 0.01) pts.push([s, xt ? pos(s, n) : vel(s, n)]);
        K.plot(ctx, g, pts, KC.red, { w: 3 });
        if (!xt) {
          K.line(ctx, { x: g.L, y: g.Y(vt(n)) }, { x: g.R, y: g.Y(vt(n)) }, KC.yellow, 1.5, [5, 4]);
          K.pill(ctx, "평평해진 높이 = 종단 속도 " + vt(n).toFixed(2) + " m/s", g.R - 4, g.Y(vt(n)) + 22, { s: 11.5, a: "right", c: KC.yellow });
        } else K.pill(ctx, "기울기(속력)가 일정해지는 곳을 찾아야 한다", W - 14, 28, { s: 11.5, a: "right", c: KC.mute });
        K.glow(ctx, g.X(t), g.Y(xt ? pos(t, n) : u), 4.5, "rgba(255,220,200,.98)", 3);
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
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 91, title: "장소별 평균 자기장 (μT) · 오차 막대 = 표준 오차" });
      var g = K.chart(ctx, { x: 6, y: 44, w: W - 20, h: H - 48, x0: 0, x1: 4, y0: 0, y1: 75, xt: 4, yt: 3, xf: function () { return ""; }, pl: 40, yl: "μT" });
      PL.forEach(function (p, i) {
        var a = avg(p, n), se = p.sd / Math.sqrt(n), cx = g.X(i + 0.5), bw = 96, by = g.Y(a), bh = g.B - by;
        var bg = ctx.createLinearGradient(cx - bw / 2, 0, cx + bw / 2, 0); bg.addColorStop(0, pc(p, .95)); bg.addColorStop(.55, pc(p, .6)); bg.addColorStop(1, pc(p, .35));
        ctx.save(); ctx.shadowColor = pc(p); ctx.shadowBlur = 14; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(cx - bw / 2, by, bw, bh, [8, 8, 0, 0]); ctx.fill(); ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.fillRect(cx - bw / 2 + 8, by + 4, 10, Math.max(0, bh - 8));
        /* 샘플 점(몇 개만) */
        for (var k = 0; k < Math.min(n, 40); k++) { var jx = cx - 30 + ((k * 37) % 60); K.glow(ctx, jx, g.Y(clamp(p.s[k], 0, 75)), 1.4, "rgba(255,255,255,.55)", 2); }
        var yt = g.Y(a + se), yb = g.Y(a - se);
        ctx.save(); ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 6; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, yt); ctx.lineTo(cx, yb); ctx.moveTo(cx - 9, yt); ctx.lineTo(cx + 9, yt); ctx.moveTo(cx - 9, yb); ctx.lineTo(cx + 9, yb); ctx.stroke(); ctx.restore();
        K.pill(ctx, a.toFixed(1) + " ± " + se.toFixed(2), cx, Math.max(54, Math.min(yt, by) - 12), { s: 11.5, a: "center", c: se <= 1 + 1e-9 ? KC.green : KC.ink });
        K.t(ctx, ICON[i] + " " + p.name + " (σ " + p.sd + ")", cx, g.B + 18, { s: 11.5, a: "center", c: pc(p) });
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
      var r = sep(pair, n), x0 = 60, x1 = 840, y = [110, 214];
      function X(m) { return x0 + (m - 45) / 30 * (x1 - x0); }
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 93, title: "평균 ± 2 × 표준 오차 · 측정 " + n + "번" });
      for (var m = 45; m <= 75; m += 5) { K.line(ctx, { x: X(m), y: 62 }, { x: X(m), y: 236 }, KC.grid, 1); K.t(ctx, m + " μT", X(m), 254, { s: 10.5, a: "center", c: KC.mute, w: "600" }); }
      var A = [r.ma - r.ea, r.ma + r.ea], B = [r.mb - r.eb, r.mb + r.eb], lo = Math.max(A[0], B[0]), hi = Math.min(A[1], B[1]);
      if (!r.apart && hi > lo) {
        var og = ctx.createLinearGradient(0, y[0], 0, y[1]); og.addColorStop(0, "rgba(255,107,129,.10)"); og.addColorStop(.5, "rgba(255,107,129,.32)"); og.addColorStop(1, "rgba(255,107,129,.10)");
        ctx.fillStyle = og; ctx.fillRect(X(lo), y[0], X(hi) - X(lo), y[1] - y[0]);
        K.pill(ctx, "겹침", (X(lo) + X(hi)) / 2, (y[0] + y[1]) / 2 + 5, { s: 11.5, a: "center", c: KC.red });
      } else if (r.apart) {
        var gL = Math.min(A[1], B[1]), gR = Math.max(A[0], B[0]);
        var gg = ctx.createLinearGradient(0, y[0], 0, y[1]); gg.addColorStop(0, "rgba(63,211,163,.08)"); gg.addColorStop(.5, "rgba(63,211,163,.28)"); gg.addColorStop(1, "rgba(63,211,163,.08)");
        ctx.fillStyle = gg; ctx.fillRect(X(gL), y[0], X(gR) - X(gL), y[1] - y[0]);
        K.pill(ctx, "틈", (X(gL) + X(gR)) / 2, (y[0] + y[1]) / 2 + 5, { s: 11.5, a: "center", c: KC.green });
      }
      [[PL[pair], r.ma, r.ea], [PL[1], r.mb, r.eb]].forEach(function (q, i) {
        var a = X(clamp(q[1] - q[2], 44, 76)), b = X(clamp(q[1] + q[2], 44, 76));
        var bg = ctx.createLinearGradient(0, y[i] - 6, 0, y[i] + 6); bg.addColorStop(0, pc(q[0], .95)); bg.addColorStop(1, pc(q[0], .45));
        ctx.save(); ctx.shadowColor = pc(q[0]); ctx.shadowBlur = 12; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(a, y[i] - 6, Math.max(4, b - a), 12, 6); ctx.fill(); ctx.restore();
        K.glow(ctx, X(q[1]), y[i], 6, pc(q[0], .98), 2.4);
        K.pill(ctx, q[0].name + " " + q[1].toFixed(1) + " ± " + q[2].toFixed(1) + " μT", X(q[1]), y[i] - 18, { s: 12, a: "center", c: pc(q[0]) });
      });
      K.pill(ctx, r.apart ? "막대가 떨어짐 — 차이가 있다고 말할 근거" : "막대가 겹침 — 차이를 주장하기 어려움", W - 14, 28, { s: 12.5, a: "right", c: r.apart ? KC.green : KC.red });
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
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 97, title: mode === "inter" ? "내삽 — 측정 범위 안의 빈곳 예측" : "외삽 — 측정 범위 밖 예측" });
      var gr = K.chart(ctx, { x: 6, y: 44, w: W - 20, h: H - 48, x0: 0, x1: 10, y0: 0, y1: 9, xt: 10, yt: 3, pl: 40, xl: "조건(예: 바른 양)", yl: "측정값" });
      function P(p) { return { x: gr.X(p.x), y: gr.Y(Math.max(-2, Math.min(11, p.y))) }; }
      var padL = gr.L, padT = gr.T, cw = gr.R - gr.L, chh = gr.B - gr.T;
      var gs = mode === "inter" ? 2 : 6, ge = mode === "inter" ? 6 : 10;
      var known = pts.filter(function (p) { return mode === "inter" ? (p.x <= 2 || (p.x >= 6 && p.x <= 8)) : p.x <= 6; });
      var pred = pts.filter(function (p) { return p.x >= gs - 0.01 && p.x <= ge + 0.01; }), up = [], lo = [];
      pred.forEach(function (p) { var d = mode === "inter" ? Math.min(Math.abs(p.x - gs), Math.abs(p.x - ge)) : p.x - gs, b = noise * (0.15 + (mode === "inter" ? 0.35 : 0.9) * d) * 0.5; up.push({ x: p.x, y: p.y + b }); lo.push({ x: p.x, y: p.y - b }); });
      var g1 = P({ x: gs, y: 0 }).x, g2 = P({ x: ge, y: 0 }).x;
      var zg = ctx.createLinearGradient(0, padT, 0, padT + chh); zg.addColorStop(0, "rgba(255,179,92,.10)"); zg.addColorStop(1, "rgba(255,179,92,.02)");
      ctx.fillStyle = zg; ctx.fillRect(g1, padT, g2 - g1, chh);
      ctx.save(); ctx.beginPath(); ctx.rect(padL, padT, cw, chh); ctx.clip();
      var bandG = ctx.createLinearGradient(g1, 0, g2 + .01, 0);
      if (mode === "inter") { bandG.addColorStop(0, "rgba(255,107,129,.15)"); bandG.addColorStop(.5, "rgba(255,107,129,.38)"); bandG.addColorStop(1, "rgba(255,107,129,.15)"); }
      else { bandG.addColorStop(0, "rgba(255,107,129,.18)"); bandG.addColorStop(1, "rgba(255,107,129,.42)"); }
      ctx.fillStyle = bandG; ctx.beginPath();
      up.forEach(function (p, k) { var q = P(p); if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); });
      for (var k = lo.length - 1; k >= 0; k--) { var q2 = P(lo[k]); ctx.lineTo(q2.x, q2.y); }
      ctx.closePath(); ctx.fill();
      glowPath(ctx, pred.map(function (p) { var q = P(p); return [q.x, q.y]; }), KC.red, 2.2, [6, 5]);
      ctx.restore();
      known.forEach(function (p) { var q = P(p); K.glow(ctx, q.x, q.y, 5, "rgba(63,211,163,.98)", 2.6); });
      K.line(ctx, { x: g1, y: padT }, { x: g1, y: padT + chh }, "rgba(255,179,92,.5)", 1, [3, 4]);
      K.line(ctx, { x: g2, y: padT }, { x: g2, y: padT + chh }, "rgba(255,179,92,.5)", 1, [3, 4]);
      K.pill(ctx, "예측 구간 · 붉은 띠 = 불확실성", (g1 + g2) / 2, padT + 18, { s: 11.5, a: "center", c: KC.orange });
      K.pill(ctx, "● 측정된 데이터", W - 200, 28, { s: 11.5, a: "right", c: KC.green });
      K.pill(ctx, "┄ 예측값", W - 120, 28, { s: 11.5, a: "right", c: KC.red });
      K.pill(ctx, "측정 오차 ×" + noise.toFixed(1), W - 14, 28, { s: 11.5, a: "right", c: KC.yellow });
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
      /* ── 왼쪽: 피부에 닿는 자외선 ── */
      K.stage(ctx, 0, 0, LW, H, "sky", { seed: 3 });
      K.sun(ctx, 40, 38, 14);
      var layerY = 196, skinY = 214, block = clamp(p2, 0, 100) / 100;
      var sk = ctx.createLinearGradient(0, skinY, 0, H); sk.addColorStop(0, "#f3c4a0"); sk.addColorStop(.35, "#e6a882"); sk.addColorStop(1, "#b8714f");
      ctx.fillStyle = sk; ctx.beginPath(); ctx.roundRect(0, skinY, LW, H - skinY, [0, 0, 14, 14]); ctx.fill();
      var cr = ctx.createLinearGradient(0, layerY, 0, skinY); cr.addColorStop(0, "rgba(255,255,255,.95)"); cr.addColorStop(1, "rgba(235,240,255,.75)");
      ctx.fillStyle = cr; ctx.beginPath(); ctx.moveTo(0, skinY);
      for (var xx = 0; xx <= LW; xx += 10) ctx.lineTo(xx, layerY + Math.sin(xx / 17) * 2);
      ctx.lineTo(LW, skinY); ctx.closePath(); ctx.fill();
      /* 자외선 알갱이: 차단율만큼 막힘 */
      ph.forEach(function (p) {
        var x = 60 + p.x * (LW - 80), stop = p.r < block, y;
        if (p.y < 1) y = 50 + p.y * (layerY - 56);
        else if (stop) { K.glow(ctx, x, layerY - 3, 3.2 * (1.25 - p.y) * 4, "rgba(255,255,255,.9)", 2.4); return; }
        else y = layerY + (p.y - 1) * 4 * (H - layerY - 20);
        K.line(ctx, { x: x - 5, y: y - 14 }, { x: x, y: y }, "rgba(182,156,255,.55)", 1.6);
        K.glow(ctx, x, y, 2.4, p.y < 1 ? "rgba(190,160,255,.95)" : "rgba(220,110,255,.95)", 2.6);
      });
      K.pill(ctx, "자외선", 64, 32, { s: 11, c: KC.violet, box: [0, LW] });
      K.pill(ctx, "선크림 2.0 mg/cm²", LW - 12, layerY - 8, { s: 11, a: "right", c: "#24305a", bg: "rgba(255,255,255,.85)", box: [0, LW] });
      K.pill(ctx, "피부", 14, H - 14, { s: 11, c: "#5a2e18", bg: "rgba(255,240,230,.85)", box: [0, LW] });
      K.pill(ctx, over ? "막을 수 있는 것보다 더 막는다? 불가능" : "통과 " + (100 - p2).toFixed(1) + "%", LW - 12, H - 14, { s: 11, a: "right", c: over ? KC.red : "#5a2e18", bg: over ? "rgba(30,10,20,.85)" : "rgba(255,240,230,.85)", box: [0, LW] });

      /* ── 오른쪽: 모형 그래프 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 99, title: md === "lin" ? "직선 모형으로 예측" : "100%에 다가가는 곡선 모형으로 예측" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 14, h: H - 44, x0: 0, x1: 2.4, y0: 40, y1: 120, xt: 6, yt: 4, xf: function (m) { return m.toFixed(1); }, yf: function (p) { return Math.round(p) + "%"; }, xl: "바른 양(mg/cm²)", yl: "자외선 차단율" });
      var og = ctx.createLinearGradient(g.X(1.5), 0, g.R, 0); og.addColorStop(0, "rgba(255,179,92,.05)"); og.addColorStop(1, "rgba(255,179,92,.16)");
      ctx.fillStyle = og; ctx.fillRect(g.X(1.5), g.T, g.R - g.X(1.5), g.B - g.T);
      K.pill(ctx, "측정 범위 밖", g.X(2.05), g.B - 10, { s: 11, a: "center", c: KC.orange });
      ctx.fillStyle = "rgba(255,107,129,.10)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(100) - g.T);
      K.line(ctx, { x: g.L, y: g.Y(100) }, { x: g.R, y: g.Y(100) }, KC.red, 1.5, [5, 4]);
      K.pill(ctx, "100% — 넘을 수 없는 선", g.L + 8, g.Y(100) - 8, { s: 11, c: KC.red });
      var pts = []; for (var m = 0.3; m <= 2.3 + 1e-9; m += 0.02) pts.push([m, pred(m)]);
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
      K.plot(ctx, g, pts, KC.blue); ctx.restore();
      D.forEach(function (d) { K.glow(ctx, g.X(d.m), g.Y(d.y), 5, "rgba(63,211,163,.98)", 2.6); });
      ctx.strokeStyle = over ? KC.red : KC.orange; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(g.X(2), g.Y(Math.min(p2, 120)), 9, 0, 6.2832); ctx.stroke();
      K.pill(ctx, "예측 " + p2.toFixed(1) + "%", g.X(2) - 14, g.Y(Math.min(p2, 120)) + (over ? 22 : -14), { s: 12.5, a: "right", c: over ? KC.red : KC.orange });
      if (measured) { K.glow(ctx, g.X(2), g.Y(real(2)), 6, "rgba(63,211,163,.98)", 2.6); K.pill(ctx, "실제 측정 " + real(2).toFixed(1) + "%", g.X(2) + 14, g.Y(real(2)) + 26, { s: 12.5, c: KC.green }); }
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
