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

/* =========================================================================
   이야기 ① 사진 51번
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "첫 추리",
    question: "현미경으로도 보이지 않던 DNA 의 모양을 어떻게 알아냈을까요?",
    options: ["㉠ 더 좋은 광학 현미경을 만들어서", "㉡ X선이 분자에 부딪혀 흩어진 무늬를 물리학·수학으로 해석해서", "㉢ DNA 를 크게 부풀려서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — X선 무늬 */
  (function () {
    var canvas = $("c-xr"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var P = 2.5, D = 1.2, TP = 3.4, TD = 2.0, got = window.sthState("xrGot") || { a: false, b: false };
    function spacing(p) { return 80 / p; }
    function slope(p, d) { return p / (Math.PI * d); }
    function drawX(cx, cy, p, d, col, dash) {
      var sp = spacing(p), k = slope(p, d);
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = dash ? 1.5 : 1; if (dash) ctx.setLineDash([5, 4]);
      for (var n = -6; n <= 6; n++) {
        if (n === 0) continue;
        var y = cy + n * sp; if (y < 20 || y > H - 20) continue;
        var x = Math.abs(n * sp) / (1.6 * k);
        [-1, 1].forEach(function (s) {
          if (dash) { ctx.beginPath(); ctx.arc(cx + s * x, y, 7, 0, Math.PI * 2); ctx.stroke(); }
          else { ctx.beginPath(); ctx.ellipse(cx + s * x, y, 9, 4.5, 0, 0, Math.PI * 2); ctx.fill(); }
        });
      }
      ctx.setLineDash([]);
    }
    function draw() {
      paper(ctx, W, H);
      var cx = 250, cy = H / 2, R = 165;
      ctx.fillStyle = "#101820"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R - 4, 0, Math.PI * 2); ctx.clip();
      drawX(cx, cy, P, D, "#e8f0f8", false);
      drawX(cx, cy, TP, TD, "#f5b942", true);
      ctx.restore();
      var rx = 520;
      text(ctx, "흰 무늬: 내 모형 · 노란 점선: 사진 51번", rx, 30, { s: 11.5, w: "800" });
      text(ctx, "층선 간격 (1 / 피치)", rx, 70, { s: 12, c: v("--mist") });
      text(ctx, spacing(P).toFixed(1) + " (목표 " + spacing(TP).toFixed(1) + ")", rx, 98, { s: 17, w: "900", c: Math.abs(P - TP) <= 0.1 + 1e-9 ? v("--green-700") : v("--ink") });
      text(ctx, "X 의 기울기 = 피치 ÷ (π × 지름)", rx, 150, { s: 12, c: v("--mist") });
      text(ctx, slope(P, D).toFixed(2) + " (목표 " + slope(TP, TD).toFixed(2) + ")", rx, 178, { s: 17, w: "900", c: Math.abs(slope(P, D) - slope(TP, TD)) <= 0.03 ? v("--green-700") : v("--ink") });
      text(ctx, "한 바퀴에 들어가는 염기쌍 ≈ 피치 ÷ 0.34 nm = " + (P / 0.34).toFixed(1), rx, 240, { s: 12, c: v("--mist") });
    }
    function update() {
      draw();
      var ch = false;
      $("xr-info").innerHTML = "피치 " + P.toFixed(1) + " nm · 지름 " + D.toFixed(1) + " nm. 피치를 늘리면 층선이 촘촘해지고, 지름을 늘리면 X 가 옆으로 벌어집니다.";
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
      { t: "염기 A 는 T 와, G 는 C 와 짝을 이룬다는 화학 자료를 모형에 넣는다", a: "dna", why: "화학의 결합 규칙이 이중 나선의 안쪽을 채웠습니다." },
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
    function wait(x) { return (F1 * Math.pow(C - x, 2) + F2 * x * x) / (2 * C * (F1 + F2)); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 540, y0 = 30, y1 = H - 40;
      function X(x) { return x0 + (x - 10) / 70 * (x1 - x0); }
      function Y(w) { return y1 - (w - 8) / 20 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [10, 30, 45, 60, 80].forEach(function (x) { text(ctx, x + "초", X(x), y1 + 18, { s: 10.5, a: "center", c: v("--mist") }); });
      [10, 15, 20, 25].forEach(function (w) { text(ctx, w + "초", x0 - 6, Y(w) + 4, { s: 10, a: "right", c: v("--mist") }); });
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (var x = 10; x <= 80; x += 0.5) { var yy = Y(Math.min(28, wait(x))); if (x === 10) ctx.moveTo(X(x), yy); else ctx.lineTo(X(x), yy); }
      ctx.stroke();
      ctx.fillStyle = v("--coral"); ctx.beginPath(); ctx.arc(X(g), Y(Math.min(28, wait(g))), 7, 0, Math.PI * 2); ctx.fill();
      text(ctx, "남북 초록불 시간에 따른 평균 대기 시간", x0, 20, { s: 12, w: "800" });
      var rx = 590;
      text(ctx, "🚗 남북 30대/분 · 초록 " + g + "초", rx, 70, { s: 12.5, w: "800" });
      text(ctx, "🚙 동서 15대/분 · 초록 " + (C - g) + "초", rx, 100, { s: 12.5, w: "800" });
      text(ctx, "평균 대기 " + wait(g).toFixed(2) + "초", rx, 160, { s: 22, w: "900", c: wait(g) <= 10.1 ? v("--green-700") : v("--coral-700") });
      return wait(g);
    }
    function update() {
      var w = draw();
      $("sig-info").innerHTML = "빨간불 동안 쌓인 차는 빨간불이 길수록 더 오래 기다립니다. 차가 많은 방향의 빨간불을 줄이면 전체 대기가 줄지만, 반대쪽이 너무 길게 기다리면 다시 늘어납니다. 지금 평균 <b>" + w.toFixed(2) + "초</b>.";
      if (w <= 10.1 && !ep.cleared(3)) {
        window.sthState("sigBest", "남북 초록 " + g + "초 · 동서 " + (C - g) + "초 → 평균 대기 " + w.toFixed(2) + "초");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("sigBest") + ". 교통량이 2배인 방향에 초록불을 약 2배 주는 것이 가장 효율적입니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("sig-g").addEventListener("input", function (e) { g = +e.target.value; $("sig-g-val").textContent = g + "초"; update(); });
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
      { t: "모래 1 kg 에 미세 플라스틱이 몇 개인지 궁금해진다", a: "sci", why: "과학적 문제 발견입니다." },
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
    function draw() {
      paper(ctx, W, H);
      var m = 100 - y - o, e = est(), x0 = 70, bw = 380;
      [["마을 전체", POP], ["내 표본", [y, Math.max(0, m), o]]].forEach(function (row, k) {
        var yy = 60 + k * 70, cx = x0, cols = ["--amber", "--brand", "--violet"], names = ["10~20대", "30~50대", "60대+"];
        text(ctx, row[0], x0 - 8, yy + 24, { s: 12, w: "800", a: "right" });
        row[1].forEach(function (p, i) { var w = bw * p / 100; ctx.fillStyle = v(cols[i]); ctx.fillRect(cx, yy, w, 36); if (w > 50) text(ctx, names[i] + " " + p + "%", cx + w / 2, yy + 23, { s: 11, w: "800", a: "center", c: v("--on-accent") }); cx += w; });
      });
      if (m < 0) text(ctx, "⚠️ 비율의 합이 100%를 넘었습니다", x0, 230, { s: 13, w: "800", c: v("--rose-700") });
      var rx = 520;
      text(ctx, "실제 마을 찬성률", rx, 70, { s: 12, c: v("--mist") });
      text(ctx, TRUE.toFixed(1) + "%", rx, 100, { s: 20, w: "900" });
      text(ctx, "내 설문 결과", rx, 150, { s: 12, c: v("--mist") });
      text(ctx, e == null ? "-" : e.toFixed(1) + "%", rx, 180, { s: 20, w: "900", c: e != null && Math.abs(e - TRUE) <= 2 ? v("--green-700") : v("--rose-700") });
      text(ctx, "연령대별 찬성률: 80% · 60% · 40%", rx, 230, { s: 11, c: v("--mist") });
      return e;
    }
    function update() {
      var e = draw();
      $("sv-info").innerHTML = e == null ? "세 연령대 비율의 합이 100%를 넘지 않게 조절하세요." : "표본의 30~50대는 나머지 " + (100 - y - o) + "%. 설문 결과 " + e.toFixed(1) + "% (실제 " + TRUE.toFixed(1) + "%, 차이 " + Math.abs(e - TRUE).toFixed(1) + "%p). 표본이 마을을 닮아야 결과도 마을을 닮습니다.";
      if (e != null && Math.abs(e - TRUE) <= 2 && !ep.cleared(2)) {
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
      paper(ctx, W, H);
      var yb = 260, s = 70, x0 = 80;
      ctx.strokeStyle = v("--rose"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(40, yb - 3 * s); ctx.lineTo(500, yb - 3 * s); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "천장 3 m", 504, yb - 3 * s + 4, { s: 10.5, w: "800", c: v("--rose-700") });
      ctx.strokeStyle = v("--line"); ctx.beginPath(); ctx.moveTo(40, yb); ctx.lineTo(560, yb); ctx.stroke();
      VAL.forEach(function (x, i) {
        var h = hgt(x), px = x0 + i * 85, ph = Math.min(h, 3.6) * s;
        ctx.fillStyle = h > 3 ? v("--rose") : v("--teal"); ctx.fillRect(px, yb - ph, 50, ph);
        text(ctx, x + "", px + 25, yb + 16, { s: 10.5, a: "center", c: v("--mist") });
        text(ctx, (h * 100).toFixed(h < 0.1 ? 1 : 0) + " cm", px + 25, yb - ph - 6, { s: 10.5, w: "800", a: "center" });
      });
      var small = hgt(1), big = hgt(1000), ok = big >= 1 && big <= 3 && small >= 0.3;
      text(ctx, sc === "lin" ? "값에 비례" : "자릿수(로그)에 비례", 640, 70, { s: 15, w: "900" });
      text(ctx, "가장 작은 기둥 " + (small * 100).toFixed(1) + " cm", 640, 110, { s: 13, w: "800", c: small >= 0.3 ? v("--green-700") : v("--rose-700") });
      text(ctx, "가장 큰 기둥 " + big.toFixed(2) + " m", 640, 140, { s: 13, w: "800", c: big >= 1 && big <= 3 ? v("--green-700") : v("--rose-700") });
      text(ctx, ok ? "✅ 전시할 수 있습니다" : "", 640, 190, { s: 14, w: "900", c: v("--green-700") });
      return ok;
    }
    function update() {
      var ok = draw();
      $("art-info").innerHTML = sc === "lin" ? "값에 비례하면 1,000배 차이가 그대로 높이 차이가 되어, 큰 기둥을 3 m 로 해도 작은 기둥은 3 mm 밖에 안 됩니다." : "로그 눈금은 값이 10배 될 때마다 같은 높이만큼 올라갑니다. 1, 10, 100, 1,000 이 같은 간격으로 놓여 큰 차이도 한눈에 담깁니다.";
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
      paper(ctx, W, H);
      var d = D[yr], x0 = 90, yb = 250;
      var vals = d.map(function (r) { return md === "raw" ? r[1] : r[1] / r[0] * 100; }), max = md === "raw" ? 500 : 12;
      ["제1병동 (의사)", "제2병동 (조산사)"].forEach(function (n, i) {
        var h = vals[i] / max * 190, bx = x0 + i * 180;
        ctx.fillStyle = i === 0 ? v("--coral") : v("--teal"); ctx.fillRect(bx, yb - h, 110, h);
        text(ctx, md === "raw" ? vals[i] + "명" : vals[i].toFixed(1) + "%", bx + 55, yb - h - 8, { s: 15, w: "900", a: "center" });
        text(ctx, n, bx + 55, yb + 20, { s: 11.5, a: "center", c: v("--mist") });
      });
      ctx.strokeStyle = v("--line"); ctx.beginPath(); ctx.moveTo(60, yb); ctx.lineTo(460, yb); ctx.stroke();
      text(ctx, yr + "년 · " + (md === "raw" ? "사망자 수" : "출산 100건당 사망률"), x0, 26, { s: 13, w: "800" });
      var rx = 540;
      text(ctx, "장부 원자료", rx, 60, { s: 12.5, w: "800" });
      d.forEach(function (r, i) { text(ctx, (i ? "제2병동" : "제1병동") + ": 출산 " + r[0].toLocaleString() + " · 사망 " + r[1], rx, 90 + i * 26, { s: 12, c: v("--mist") }); });
      if (md === "rate") text(ctx, "사망률 = 사망 ÷ 출산 × 100", rx, 170, { s: 12, w: "800", c: v("--brand-700") });
    }
    function update() {
      draw();
      var ch = false;
      $("sw-info").innerHTML = md === "raw" ? "원자료(사망자 수)는 출산 수가 다른 병동이나 해를 공정하게 비교하기 어렵습니다. 출산 100건당 사망률로 가공해 보세요." : (yr === "1846" ? "1846년 제1병동 사망률은 약 <b>11.4%</b>, 제2병동은 약 <b>2.8%</b> — 4배가 넘습니다." : "1847년 5월부터 의사·의대생이 염소 용액으로 손을 씻었습니다. 1848년 제1병동 사망률은 약 <b>1.3%</b> 로, 제2병동과 비슷해졌습니다.");
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
      paper(ctx, W, H);
      var x0 = 60, x1 = W - 40, y0 = 30, y1 = H - 40, yMin = TRUE_VAL - SIGMA - 2, yMax = TRUE_VAL + SIGMA + 2;
      function toY(val) { return y1 - ((val - yMin) / (yMax - yMin)) * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "측정 횟수(n) →", (x0 + x1) / 2, y1 + 26, { s: 11, a: "center", c: v("--mist") });
      ctx.strokeStyle = v("--amber"); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0, toY(TRUE_VAL)); ctx.lineTo(x1, toY(TRUE_VAL)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "참값 = " + TRUE_VAL, x0 + 4, toY(TRUE_VAL) - 6, { s: 10.5, w: "800", c: v("--amber-700") });
      ctx.fillStyle = v("--mist"); ctx.globalAlpha = 0.35;
      for (var k = 0; k < n; k++) { ctx.beginPath(); ctx.arc(x0 + k / 199 * (x1 - x0), toY(S[k]), 2.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1; ctx.beginPath(); var sum = 0;
      for (k = 0; k < n; k++) { sum += S[k]; var xx = x0 + k / 199 * (x1 - x0), yy = toY(sum / (k + 1)); if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); }
      ctx.strokeStyle = v("--teal"); ctx.lineWidth = 2.5; ctx.stroke();
    }
    function update() {
      var sum = 0; for (var k = 0; k < n; k++) sum += S[k];
      var avg = sum / n, se = SIGMA / Math.sqrt(n);
      draw();
      $("c2b-n-val").textContent = n;
      $("c2b-info").innerHTML = "측정 <b>" + n + "번</b> · 평균 <b>" + avg.toFixed(2) + "</b> · 표준 오차 <b>σ/√n ≈ " + se.toFixed(2) + "</b>. 측정 횟수를 늘릴수록 개별 측정의 오차가 서로 상쇄되어 평균이 참값(" + TRUE_VAL + ")에 가까워집니다 — 데이터를 많이 모을수록 결론을 더 믿을 수 있는 까닭입니다.";
      if (se <= 1 + 1e-9 && n <= 46 && !ep.cleared(3)) {
        window.sthState("lnBest", "n = " + n + " → 표준 오차 " + se.toFixed(2) + ", 평균 " + avg.toFixed(2));
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("lnBest") + ". σ = 6 이면 36번 재야 표준 오차가 1 이 됩니다. 오차를 절반으로 줄이려면 4배를 더 재야 합니다.");
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
    function app(f, s) { return Math.abs(f - Math.round(f / s) * s); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 50, x1 = W - 30, cy = 150, A = 90, T = 2;
      function X(t) { return x0 + t / T * (x1 - x0); }
      ctx.strokeStyle = v("--line"); ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke();
      ctx.strokeStyle = v("--mist"); ctx.lineWidth = 2; ctx.beginPath();
      for (var t = 0; t <= T; t += 0.005) { var y = cy - A * Math.sin(2 * Math.PI * F * t); if (t === 0) ctx.moveTo(X(t), y); else ctx.lineTo(X(t), y); } ctx.stroke();
      var pts = [];
      for (var k = 0; k * (1 / fs) <= T + 1e-9; k++) { var tk = k / fs; pts.push([X(tk), cy - A * Math.sin(2 * Math.PI * F * tk)]); }
      var fa = app(F, fs);
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 2.5;
      ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      ctx.fillStyle = v("--coral"); pts.forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2); ctx.fill(); });
      text(ctx, "회색: 실제 흔들림(2 Hz)   주황 점: 센서가 잰 값", x0, 26, { s: 12, w: "800" });
      text(ctx, "0초", x0, H - 12, { s: 10.5, c: v("--mist") }); text(ctx, "2초", x1, H - 12, { s: 10.5, a: "right", c: v("--mist") });
      text(ctx, "기록된 흔들림 " + fa.toFixed(1) + " Hz · 2초에 " + pts.length + "번 측정", x1, 26, { s: 12.5, w: "900", a: "right", c: Math.abs(fa - F) < 1e-9 && fs > 2 * F ? v("--green-700") : v("--rose-700") });
      return fa;
    }
    function update() {
      var fa = draw();
      $("fs-info").innerHTML = "1초에 " + fs + "번 재면 기록된 흔들림은 <b>" + fa.toFixed(1) + " Hz</b>" + (fs <= 2 * F ? " — 너무 드물게 재서 실제와 다른 흔들림으로 기록됩니다(겹침 현상)." : " — 실제 진동수와 같습니다.") + " 흔들림 진동수의 <b>2배보다 자주</b> 재야 합니다.";
      if (fs > 2 * F && fs <= 6 && Math.abs(fa - F) < 1e-9 && !ep.cleared(1)) {
        window.sthState("fsBest", "1초에 " + fs + "번(" + fs + " Hz) 측정");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("fsBest") + ". 흔들림 2 Hz 의 2배(4 Hz)보다 조금 더 자주 재면 충분합니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("fs-v").addEventListener("input", function (e) { fs = +e.target.value; $("fs-v-val").textContent = fs + " Hz"; update(); });
    update();
    if (ep.cleared(1)) window.sthMission("m4-2", true);
  })();

  /* 장면 3 — 문턱값 */
  (function () {
    var canvas = $("c-th"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, th = 0.25;
    function pdf(x, m, s) { return Math.exp(-Math.pow(x - m, 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); }
    function rates() { return { miss: Phi((th - 0.30) / 0.05) * 100, fa: (1 - Phi((th - 0.10) / 0.03)) * 100 }; }
    function draw() {
      paper(ctx, W, H);
      var x0 = 50, x1 = 560, y1 = 250, y0 = 40, r = rates();
      function X(x) { return x0 + x / 0.45 * (x1 - x0); }
      function Y(p) { return y1 - p / 14 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [["--teal", 0.10, 0.03, "정상"], ["--rose", 0.30, 0.05, "위험"]].forEach(function (c) {
        ctx.strokeStyle = v(c[0]); ctx.lineWidth = 2.5; ctx.beginPath();
        for (var x = 0; x <= 0.45; x += 0.002) { if (x === 0) ctx.moveTo(X(x), Y(pdf(x, c[1], c[2]))); else ctx.lineTo(X(x), Y(pdf(x, c[1], c[2]))); } ctx.stroke();
        text(ctx, c[3], X(c[1]), Y(pdf(c[1], c[1], c[2])) - 8, { s: 12, w: "800", a: "center", c: v(c[0] + "-700") });
      });
      ctx.strokeStyle = v("--ink"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(th), y0); ctx.lineTo(X(th), y1); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "문턱 " + th.toFixed(2) + "°", X(th), y0 - 6, { s: 11.5, w: "900", a: "center" });
      [0, 0.1, 0.2, 0.3, 0.4].forEach(function (x) { text(ctx, x.toFixed(1) + "°", X(x), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      var rx = 610;
      text(ctx, "위험을 놓침", rx, 80, { s: 12, c: v("--mist") });
      text(ctx, r.miss.toFixed(2) + "%", rx, 110, { s: 20, w: "900", c: r.miss <= 1 ? v("--green-700") : v("--rose-700") });
      text(ctx, "헛경보", rx, 160, { s: 12, c: v("--mist") });
      text(ctx, r.fa.toFixed(2) + "%", rx, 190, { s: 20, w: "900", c: r.fa <= 5 ? v("--green-700") : v("--rose-700") });
      return r;
    }
    function update() {
      var r = draw();
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
    { key: "rLab", label: "응용 실험실" }
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
    { key: "rLab", label: "응용 실험실" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
